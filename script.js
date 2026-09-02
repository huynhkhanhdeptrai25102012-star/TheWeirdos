(() => {
  "use strict";

  const state = {
    lang: localStorage.getItem("weirdos-lang") || "vi",
    unlockedZ: false,
    puppetSolved: false,
    ticketSolved: false,
    lastActivity: Date.now(),
    zCode: "NEVERLOOKBACK",
    diskD: "M3ggKyA3ID0gMjguIFg/IiwgU29sdmUgdGhlIHZhbHVlIG9mIFguIDxTSEVSRUlOLj4=",
    expectedPuppet: "7",
    ticketSymbols: ["∆", "13", "K"],
    hexClue: "4B-31-33",
    openWindows: new Map(),
  };

  const text = {
    vi: {
      tagline: "> Xem những gì không nên được nhìn thấy _",
      power: "BẬT MÁY",
      start: "Bắt đầu",
      shutdown: "Tắt máy...",
      lang: "Tiếng Việt",
      app: {
        computer: "Máy tính của tôi",
        cmd: "Dấu nhắc lệnh",
        ticket: "TheTicket",
        mail: "WeirdMail",
        recycle: "Discarded_Souls",
        task: "Trình quản lý tác vụ",
        notepad: "Sổ tay",
        settings: "Bảng điều khiển",
      },
      common: {
        back: "← Quay lại",
        open: "MỞ",
        run: "CHẠY",
        verify: "KIỂM TRA MÃ",
        inspect: "XEM CHI TIẾT",
        save: "Lưu",
        current: "Hiện tại",
        locked: "BỊ KHÓA",
        solved: "ĐÃ GIẢI",
        unsolved: "CHƯA GIẢI",
        running: "ĐANG CHẠY",
        unknown: "CHƯA BIẾT",
        accessDenied: "TỪ CHỐI TRUY CẬP",
      },
      toast: {
        started: "WeirdOS đã khởi động.",
        shutdown: "Không thể tắt máy. Z: vẫn đang thức.",
        language: "Đã chuyển ngôn ngữ sang Tiếng Việt.",
        puppet: "PuppetYourself: đã khôi phục dữ liệu.",
        ticket: "TheTicket đã xác nhận. Trình quản lý tác vụ đã mở khóa.",
      },
    },
    en: {
      tagline: "> See what shouldn’t be seen _",
      power: "POWER ON",
      start: "Start",
      shutdown: "Shut Down...",
      lang: "English",
      app: {
        computer: "My Computer",
        cmd: "Command Prompt",
        ticket: "TheTicket",
        mail: "WeirdMail",
        recycle: "Discarded_Souls",
        task: "Task Monitor",
        notepad: "Notepad",
        settings: "Control Panel",
      },
      common: {
        back: "← Back",
        open: "OPEN",
        run: "RUN",
        verify: "VERIFY CODE",
        inspect: "INSPECT",
        save: "Save",
        current: "Current",
        locked: "LOCKED",
        solved: "SOLVED",
        unsolved: "UNSOLVED",
        running: "RUNNING",
        unknown: "KHÔNG XÁC ĐỊNH",
        accessDenied: "ACCESS DENIED",
      },
      toast: {
        started: "WeirdOS started.",
        shutdown: "Shutdown denied. Z: is still awake.",
        language: "Language switched to English.",
        puppet: "PuppetYourself: payload recovered.",
        ticket: "TheTicket verified. Task Monitor unlocked.",
      },
    },
  };

  const boot = document.getElementById("boot-screen");
  const mergeScreen = document.getElementById("boot-merge-screen");
  const mergeConsole = document.getElementById("merge-console");
  const mergeBar = document.getElementById("merge-progress-bar");
  const mergePercent = document.getElementById("merge-percent");
  const mergeStatus = document.getElementById("merge-status");
  const desktop = document.getElementById("desktop");
  const saver = document.getElementById("screensaver");
  const startupAudio = document.getElementById("startup-audio");
  const windowLayer = document.getElementById("window-layer");
  const taskbarApps = document.getElementById("taskbar-apps");
  const startMenu = document.getElementById("start-menu");
  const languageMenu = document.getElementById("language-menu");
  const desktopToast = document.getElementById("desktop-toast");

  let zIndex = 20;
  let toastTimer = null;
  let idleTimer = null;

  const t = (key) => {
    const parts = key.split(".");
    let result = text[state.lang];
    for (const part of parts) result = result?.[part];
    return result ?? key;
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    }[ch]));
  }

  function touch() {
    state.lastActivity = Date.now();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!desktop.classList.contains("hidden")) {
        saver.classList.remove("hidden");
        saver.setAttribute("aria-hidden", "false");
      }
    }, 120000);
    if (!saver.classList.contains("hidden")) {
      saver.classList.add("hidden");
      saver.setAttribute("aria-hidden", "true");
    }
  }

  ["mousemove", "keydown", "mousedown", "touchstart", "wheel"].forEach((evt) => {
    window.addEventListener(evt, touch, { passive: true });
  });

  setInterval(() => {
    const now = new Date();
    const short = now.toLocaleTimeString(state.lang === "vi" ? "vi-VN" : "en-US", {
      hour: "2-digit", minute: "2-digit", hour12: false
    });
    document.getElementById("system-clock").textContent = short;
    document.getElementById("desktop-clock-top").textContent = short;
  }, 1000);

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = key === "tagline" ? t("tagline") : key.startsWith("app.") ? t(key) : text[state.lang][key];
      if (value) el.textContent = value;
    });
    document.getElementById("lang-label").textContent = t("lang");
    localStorage.setItem("weirdos-lang", state.lang);
    updateWindowTaskLabels();
    document.title = state.lang === "vi" ? "WeirdOS — Hệ điều hành thử nghiệm" : "WeirdOS — Experimental Desktop Environment";
  }

  function setLanguage(lang, silent = false) {
    state.lang = lang === "en" ? "en" : "vi";
    applyLanguage();
    languageMenu.classList.add("hidden");
    document.getElementById("lang-switcher").setAttribute("aria-expanded", "false");
    if (!silent) flashToast(t("toast.language"));
  }

  document.querySelectorAll("#language-menu button").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  document.getElementById("lang-switcher").addEventListener("click", (e) => {
    e.stopPropagation();
    languageMenu.classList.toggle("hidden");
    document.getElementById("lang-switcher").setAttribute("aria-expanded", String(!languageMenu.classList.contains("hidden")));
    startMenu.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!languageMenu.contains(e.target) && e.target.id !== "lang-switcher") languageMenu.classList.add("hidden");
    if (!startMenu.contains(e.target) && e.target.id !== "start-menu-btn") startMenu.classList.add("hidden");
  });

  async function beginBootSequence() {
    document.getElementById("power-btn").disabled = true;
    try {
      startupAudio.currentTime = 0;
      await startupAudio.play();
    } catch (_) {
      console.info("Startup audio unavailable. Add assets/audio/startup.mp3.");
    }

    boot.classList.add("hidden");
    mergeScreen.classList.remove("hidden");
    mergeConsole.innerHTML = "";
    mergeBar.style.width = "0%";
    mergePercent.textContent = "0%";
    mergeStatus.textContent = state.lang === "vi" ? "Đang mở bảng kiểm tra..." : "Opening verification board...";

    const steps = state.lang === "vi" ? [
      ["[BIOS] Đọc cấu hình phần cứng...", "Bộ nhớ 640K: OK"],
      ["[KERNEL] Nạp weirdkernel.sys...", "Nhân hệ thống: ĐÃ NẠP"],
      ["[DRIVE] Hợp nhất C: và D:...", "C: / D: đồng bộ chỉ mục"],
      ["[ARCHIVE] Đọc dữ liệu lưu trữ ẩn...", "Phát hiện chỉ mục 00:13"],
      ["[EVENT] Khôi phục bộ đệm sự kiện...", "Nguồn sự kiện: CHƯA XÁC ĐỊNH"],
      ["[VOLUME] Gắn thử Z:...", "Z: phát hiện nhưng chưa mở khóa"],
      ["[SYSTEM] Hoàn tất hợp nhất dữ liệu...", "CÓ THỂ TIẾP TỤC"]
    ] : [
      ["[BIOS] Reading hardware profile...", "Memory 640K: OK"],
      ["[KERNEL] Loading weirdkernel.sys...", "System kernel: LOADED"],
      ["[DRIVE] Merging C: and D:...", "C: / D: index synchronized"],
      ["[ARCHIVE] Reading hidden archive data...", "Index 00:13 detected"],
      ["[EVENT] Restoring event buffer...", "Event source: UNKNOWN"],
      ["[VOLUME] Probing Z:...", "Z: detected but not unlocked"],
      ["[SYSTEM] Finalizing merged boot data...", "READY TO CONTINUE"]
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [line, result] = steps[i];
      const row = document.createElement("div");
      row.innerHTML = `${escapeHtml(line)} <span class="merge-ok">${escapeHtml(result)}</span>`;
      mergeConsole.appendChild(row);
      mergeConsole.scrollTop = mergeConsole.scrollHeight;
      const pct = Math.round(((i + 1) / steps.length) * 100);
      mergeBar.style.width = `${pct}%`;
      mergePercent.textContent = `${pct}%`;
      mergeStatus.textContent = result;
    }

    await new Promise((resolve) => setTimeout(resolve, 650));
    mergeScreen.classList.add("hidden");
    desktop.classList.remove("hidden");
    touch();
    flashToast(t("toast.started"));
  }

  document.getElementById("power-btn").addEventListener("click", beginBootSequence);

  document.getElementById("desktop-icons").addEventListener("click", (e) => {
    const icon = e.target.closest(".desktop-icon");
    if (!icon) return;
    document.querySelectorAll(".desktop-icon").forEach((x) => x.classList.remove("selected"));
    icon.classList.add("selected");
    if (window.innerWidth < 650) openApp(icon.dataset.app);
  });

  document.querySelectorAll(".desktop-icon").forEach((icon) => {
    icon.addEventListener("dblclick", () => openApp(icon.dataset.app));
  });

  document.getElementById("start-menu-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("hidden");
    document.getElementById("start-menu-btn").setAttribute("aria-expanded", String(!startMenu.classList.contains("hidden")));
    languageMenu.classList.add("hidden");
  });

  document.querySelectorAll("[data-start-app]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startMenu.classList.add("hidden");
      openApp(btn.dataset.startApp);
    });
  });

  document.getElementById("start-shutdown").addEventListener("click", () => {
    startMenu.classList.add("hidden");
    flashToast(t("toast.shutdown"));
  });

  function flashToast(message) {
    desktopToast.textContent = message;
    desktopToast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => desktopToast.classList.add("hidden"), 2500);
  }

  function openApp(app) {
    touch();
    if (state.openWindows.has(app)) {
      const win = state.openWindows.get(app);
      win.classList.remove("hidden");
      win.style.zIndex = ++zIndex;
      return;
    }
    const builders = {
      computer: computerWindow, ticket: ticketWindow, recycle: recycleWindow,
      cmd: cmdWindow, mail: mailWindow, task: taskWindow,
      notepad: notepadWindow, settings: settingsWindow
    };
    if (builders[app]) builders[app]();
  }

  function createWindow(appKey, title, width = 620, height = 420) {
    const win = document.createElement("section");
    win.className = "os-window";
    win.dataset.app = appKey;
    const safeW = Math.min(width, window.innerWidth - 10);
    const safeH = Math.min(height, window.innerHeight - 55);
    win.style.width = `${safeW}px`;
    win.style.height = `${safeH}px`;
    const count = document.querySelectorAll(".os-window").length;
    win.style.left = `${Math.max(5, Math.min(window.innerWidth - safeW - 5, 120 + (count * 28) % 170))}px`;
    win.style.top = `${Math.max(35, Math.min(window.innerHeight - safeH - 45, 58 + (count * 25) % 110))}px`;
    win.style.zIndex = ++zIndex;
    win.innerHTML = `
      <div class="window-title">
        <strong>${escapeHtml(title)}</strong>
        <div class="window-controls"><button class="window-min" title="${state.lang === "vi" ? "Thu nhỏ" : "Minimize"}">_</button><button class="window-close" title="${state.lang === "vi" ? "Đóng" : "Close"}">X</button></div>
      </div>
      <div class="window-body"></div>`;
    windowLayer.appendChild(win);
    state.openWindows.set(appKey, win);
    const body = win.querySelector(".window-body");
    win.addEventListener("mousedown", () => { win.style.zIndex = ++zIndex; updateTaskbarActive(win); });
    win.querySelector(".window-close").addEventListener("click", () => closeWindow(appKey));
    win.querySelector(".window-min").addEventListener("click", () => { win.classList.toggle("hidden"); updateTaskbarActive(); });
    makeDraggable(win);
    addTaskbarButton(appKey, title);
    return { win, body };
  }

  function closeWindow(appKey) {
    const win = state.openWindows.get(appKey);
    if (win) win.remove();
    state.openWindows.delete(appKey);
    taskbarApps.querySelector(`[data-task="${appKey}"]`)?.remove();
  }

  function addTaskbarButton(appKey) {
    const btn = document.createElement("button");
    btn.className = "taskbar-app active";
    btn.dataset.task = appKey;
    btn.textContent = appDisplayName(appKey);
    btn.addEventListener("click", () => {
      const win = state.openWindows.get(appKey);
      if (!win) return;
      win.classList.remove("hidden");
      win.style.zIndex = ++zIndex;
      updateTaskbarActive(win);
    });
    taskbarApps.appendChild(btn);
  }

  function updateTaskbarActive(activeWin = null) {
    taskbarApps.querySelectorAll(".taskbar-app").forEach((btn) => btn.classList.remove("active"));
    if (activeWin) taskbarApps.querySelector(`[data-task="${activeWin.dataset.app}"]`)?.classList.add("active");
  }

  function updateWindowTaskLabels() {
    state.openWindows.forEach((_, app) => {
      const taskBtn = taskbarApps.querySelector(`[data-task="${app}"]`);
      if (taskBtn) taskBtn.textContent = appDisplayName(app);
    });
  }

  function appDisplayName(app) {
    return t({
      computer: "app.computer", cmd: "app.cmd", ticket: "app.ticket", mail: "app.mail",
      recycle: "app.recycle", task: "app.task", notepad: "app.notepad", settings: "app.settings"
    }[app]);
  }

  function makeDraggable(win) {
    const bar = win.querySelector(".window-title");
    let dragging = false, offsetX = 0, offsetY = 0;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true;
      bar.setPointerCapture(e.pointerId);
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      win.style.zIndex = ++zIndex;
    });
    bar.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const maxX = Math.max(5, window.innerWidth - win.offsetWidth - 5);
      const maxY = Math.max(35, window.innerHeight - win.offsetHeight - 45);
      win.style.left = `${Math.min(maxX, Math.max(5, e.clientX - offsetX))}px`;
      win.style.top = `${Math.min(maxY, Math.max(35, e.clientY - offsetY))}px`;
    });
    bar.addEventListener("pointerup", (e) => {
      dragging = false;
      try { bar.releasePointerCapture(e.pointerId); } catch (_) {}
    });
  }

  function computerWindow() {
    const { body } = createWindow("computer", appDisplayName("computer"), 760, 540);
    body.innerHTML = `
      <div class="panel"><div class="panel-title">${appDisplayName("computer")}</div>
        <div class="file-row"><span>💾 C: — HỆ THỐNG</span><button data-drive="C">${t("common.open")}</button></div>
        <div class="file-row"><span>💾 D: — LƯU TRỮ</span><button data-drive="D">${t("common.open")}</button></div>
        <div class="file-row"><span>◼ Z: — PHÂN VÙNG LẠ</span><button data-drive="Z">${t("common.open")}</button></div>
      </div>
      <div class="panel"><div class="panel-title">TRẠNG THÁI HỆ THỐNG</div>
        <div class="muted">Puppet: ${state.puppetSolved ? t("common.solved") : t("common.locked")} · TheTicket: ${state.ticketSolved ? t("common.solved") : t("common.unsolved")} · Z: ${state.unlockedZ ? "MỞ" : "ẨN"}</div>
      </div>`;
    body.querySelectorAll("button[data-drive]").forEach((btn) => btn.addEventListener("click", () => {
      if (btn.dataset.drive === "C") openCDrive(body);
      else if (btn.dataset.drive === "D") openDDrive(body);
      else openZDrive(body);
    }));
  }

    function openCDrive(container) {
    container.innerHTML = `
      <div class="panel"><div class="panel-title">C:\\</div>
        <div class="file-row"><span>🧩 PuppetYourself.exe</span><button id="open-puppet">${t("common.run")}</button></div>
        <div class="muted">Một chương trình khẳng định rằng nó vẫn nhớ dữ liệu bạn nhập.</div>
      </div><button class="secondary-btn" id="back-drives">${t("common.back")}</button>`;
    container.querySelector("#back-drives").addEventListener("click", () => computerWindow());
    container.querySelector("#open-puppet").addEventListener("click", () => puppetApp(container));
  }

  function openDDrive(container) {
    container.innerHTML = `
      <div class="panel"><div class="panel-title">D:\\LƯU TRỮ</div>
        <div class="file-row"><span>clue_003.txt</span><button id="decode-btn">${t("common.open")}</button></div>
        <div class="muted">Kích thước: 71 byte. Chỉnh sửa cuối: 03/11/1999 00:13.</div>
      </div>
      <pre class="console">D:\\&gt; dir\nclue_003.txt\n\nD:\\&gt; type clue_003.txt\nBASE64_PAYLOAD_PRESENT\nGỢI Ý: HÃY ĐỌC ĐOẠN DỮ LIỆU LỖI, ĐỪNG ĐỌC NÓ NHƯ MỘT TIN NHẮN.</pre>
      <button class="secondary-btn" id="back-drives">${t("common.back")}</button>`;
    container.querySelector("#back-drives").addEventListener("click", () => computerWindow());
    container.querySelector("#decode-btn").addEventListener("click", () => {
      let decoded = "";
      try { decoded = atob(state.diskD); } catch { decoded = "[không thể giải mã]"; }
      const answer = decoded.includes("3x + 7 = 28") ? state.expectedPuppet : "?";
      container.innerHTML = `
        <div class="panel"><div class="panel-title">clue_003.txt — đã giải mã</div><pre>${escapeHtml(decoded)}</pre></div>
        <div class="panel"><strong>ĐỐ CÂU:</strong> Giải <code>3x + 7 = 28</code>. Chỉ nhập giá trị của X vào PuppetYourself.exe.</div>
        <div class="panel"><strong>ĐÁP ÁN:</strong> x = <span class="hex">${answer}</span></div>
        <button class="secondary-btn" id="back-drives">${t("common.back")}</button>`;
      container.querySelector("#back-drives").addEventListener("click", () => computerWindow());
    });
  }

  function openZDrive(container) {
    container.innerHTML = state.unlockedZ
      ? `<div class="panel"><div class="panel-title">Z:\\</div><pre class="console">Z:\\&gt; ENDING.SCR đã được phát hiện.\nDùng Dấu nhắc lệnh → Z để mở toàn bộ cảnh kết thúc.</pre></div><button class="secondary-btn" id="back-drives">${t("common.back")}</button>`
      : `<div class="panel"><div class="panel-title">Z:\\</div><pre class="console">TỪ CHỐI TRUY CẬP.\nPhân vùng tồn tại nhưng chưa được gắn vào hệ thống.</pre></div><button class="secondary-btn" id="back-drives">${t("common.back")}</button>`;
    container.querySelector("#back-drives").addEventListener("click", () => computerWindow());
  }

  function puppetApp(container) {
    container.innerHTML = `
      <div class="panel"><div class="panel-title">PuppetYourself.exe</div>
        <p>Dán mã truy cập:</p>
        <div class="input-row"><input id="puppet-input" class="text-input" placeholder="ví dụ: 7" /><button id="puppet-run" class="primary-btn">${t("common.run")}</button></div>
      </div>
      <div id="puppet-console" class="console">C:\\&gt; puppet.exe\nREADY.\nĐANG CHỜ BIẾN NGƯỜI DÙNG...</div>`;
    const input = container.querySelector("#puppet-input");
    const out = container.querySelector("#puppet-console");
    container.querySelector("#puppet-run").addEventListener("click", () => {
      const value = input.value.trim();
      out.textContent = "C:\\> puppet.exe\n> cấp phát puppet_thread...\n> kiểm tra bộ nhớ...\n";
      setTimeout(() => {
        if (value !== state.expectedPuppet) {
          out.innerHTML += `<span class="bad">LỖI 0xPUP: mã không đúng.\nLỖI: CON RỐI ĐANG CƯỜI.\n${t("common.accessDenied")}.</span>`;
          safeErrorSound();
          return;
        }
        state.puppetSolved = true;
        out.innerHTML += `<span class="ok">TRUY CẬP CHẤP NHẬN.\nLỖI 0x00013A: phát hiện gói hình ảnh bất thường\nKÊNH MORSE A: .-- . .. .-. -..\nKÊNH MORSE B: -.-. --- -.. .\n</span>`;
        const img = document.createElement("img");
        img.className = "result-image";
        img.src = "assets/images/puppet_result.png";
        img.alt = "Ảnh kết quả Puppet";
        img.onerror = () => {
          img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='300'><rect width='100%' height='100%' fill='%230047AB'/><text x='50%' y='50%' fill='white' font-size='32' font-family='monospace' text-anchor='middle'>puppet_result.png</text></svg>`);
        };
        container.appendChild(img);
        const morse = document.createElement("div");
        morse.className = "morse";
        morse.innerHTML = `MORSE A: <strong>.-- . .. .-. -..</strong><br/>MORSE B: <strong>-.-. --- -.. .</strong>`;
        container.appendChild(morse);
        flashToast(t("toast.puppet"));
      }, 750);
    });
  }

  function ticketWindow() {
    const { body } = createWindow("ticket", "TheTicket — Vé hòa nhạc cũ", 820, 600);
    body.innerHTML = `
      <div class="panel"><div class="panel-title">THE STATIC PARADE // 1999</div><p>Ba tấm vé bị hỏng. Hãy đọc các lớp in còn sót lại và đối chiếu với dữ liệu từ PuppetYourself.</p></div>
      <div class="ticket-grid">
        ${[1, 2, 3].map((i) => `<article class="ticket-card">
          <img class="ticket-img" src="assets/images/ticket_${i}.png" alt="Vé số ${i}" onerror="this.outerHTML='<div class=\'ticket-img\' style=\'display:grid;place-items:center;font:12px var(--mono);\'>ticket_${i}.png</div>'" />
          <div>THE STATIC PARADE ${i}</div><div class="muted" style="color:#d8e7ff">GHẾ ${i}13 // PHÒNG XANH</div><div class="ticket-code">${state.ticketSymbols[i - 1]}</div>
        </article>`).join("")}
      </div>
      <div class="panel"><div class="panel-title">TỔ HỢP</div><p>Ký hiệu: <code>∆ + 13 + K</code></p><p class="muted">Morse A/B = WEIRD / CODE. Ba dấu in gợi ra tuyến <strong>∆13K</strong>.</p><button id="ticket-check" class="primary-btn">${t("common.verify")}</button></div>`;
    body.querySelector("#ticket-check").addEventListener("click", () => {
      state.ticketSolved = true;
      const p = document.createElement("p");
      p.style.color = "#0047ab";
      p.innerHTML = `<strong>ĐÃ XÁC NHẬN.</strong> GỢI Ý MỚI → Trình quản lý tác vụ → Illusionary_Process.exe`;
      body.querySelector(".panel:last-child").appendChild(p);
      flashToast(t("toast.ticket"));
    });
  }

  function recycleWindow() {
    const { body } = createWindow("recycle", "Discarded_Souls — Thùng rác", 740, 530);
    const logs = [
      "[MẢNH 01] Chúng tôi gọi nó là bản dựng tương thích vô hại. Nó tự tạo thư mục trước cả khi trình cài đặt hoàn tất.",
      "[MẢNH 02] Kho lưu trữ D: không nằm trong bản phát hành bán lẻ. Ai đó đã thêm nó sau đợt kiểm thử.",
      "[MẢNH 03] Nếu phương trình còn nguyên, chỉ dùng đáp án. Đừng nhập cả câu.",
      "[MẢNH 04] Hình vé chưa từng được phê duyệt. Các ký tự ẩn trong lớp in tạo thành một tuyến.",
      "[MẢNH 05] Z: có tồn tại, nhưng chỉ mở khi hệ thống cho rằng bạn đã nhìn thấy đủ.",
      "[MẢNH 06] Đừng tin Illusionary_Process.exe. Trong bản đồ gốc không có tiến trình cha của nó."
    ];
    body.innerHTML = logs.map((x) => `<div class="log-shard">${escapeHtml(x)}</div>`).join("") + `<div class="panel"><strong>GỢI Ý:</strong> "đọc đoạn dữ liệu lỗi" = Base64. Manh mối nằm trong Máy tính của tôi → D:.</div>`;
  }

  function cmdWindow() {
    const { body } = createWindow("cmd", "Dấu nhắc lệnh — Chế độ thân thiện", 760, 530);
    body.innerHTML = `<div class="terminal"><div id="terminal-output" class="terminal-output"></div><form id="terminal-form" class="terminal-form"><span class="prompt">Z:\&gt;</span><input id="cmd-input" autocomplete="off" spellcheck="false" /><button class="secondary-btn" type="submit">ENTER</button></form></div>`;
    const output = body.querySelector("#terminal-output"), input = body.querySelector("#cmd-input"), form = body.querySelector("#terminal-form");
    print("Dấu nhắc lệnh WeirdOS — Chế độ thân thiện", "");
    print("Gõ HELP để xem danh sách lệnh.", "");
    function print(line, cls = "") { const el = document.createElement("div"); if (cls) el.className = cls; el.textContent = line; output.appendChild(el); output.scrollTop = output.scrollHeight; }
    form.addEventListener("submit", (e) => { e.preventDefault(); const cmd = input.value.trim().toLowerCase(); input.value = ""; if (!cmd) return; print(`Z:\\> ${cmd}`); handle(cmd); });
    function handle(cmd) {
      if (cmd === "help") return print("HELP  DIR  C:  D:  RUN PUPPET  CHECK  Z  CLEAR  EXIT");
      if (cmd === "dir") return print("C:\\PuppetYourself.exe\nD:\\clue_003.txt\nZ:\\[BỊ KHÓA]");
      if (cmd === "c:") return print(state.puppetSolved ? "C: ĐÃ CẤP QUYỀN" : "C: BÌNH THƯỜNG");
      if (cmd === "d:") return print("D:\\clue_003.txt — BASE64");
      if (cmd === "run puppet") return print(state.puppetSolved ? "PuppetYourself.exe: dữ liệu hình ảnh đã được khôi phục." : "PuppetYourself.exe: chưa có mã hợp lệ.");
      if (cmd === "check") return print(`CHUỖI: Puppet=${state.puppetSolved ? "OK" : "NO"} TheTicket=${state.ticketSolved ? "OK" : "NO"}`);
      if (cmd === "clear") { output.innerHTML = ""; return; }
      if (cmd === "z") { if (state.puppetSolved && state.ticketSolved) { state.unlockedZ = true; return renderEnding(body); } return print("Z: BỊ KHÓA // hãy hoàn tất chuỗi manh mối trước."); }
      if (cmd === "exit") return print("Phiên vẫn được giữ lại. Bạn có thể đóng cửa sổ này.");
      print("Lệnh không tồn tại. Hãy gõ HELP.");
    }
  }

  function renderEnding(body) {
    body.innerHTML = `<div class="panel"><div class="panel-title">Z:\\ENDING.SCR</div><pre class="console">Z:\\&gt; ACCESS GRANTED\n\nBẠN ĐÃ TÌM THẤY BẢN DỰNG CHƯA TỪNG ĐƯỢC PHÁT HÀNH.\n\n[CAMERA 01] PHÒNG LÀM VIỆC TRỐNG\n[CAMERA 02] MÀN HÌNH VẪN SÁNG\n[CAMERA 03] CON TRỎ CỦA BẠN TỰ DI CHUYỂN\n\nMÃ CUỐI: ${state.zCode}\n\nHỆ THỐNG KHÔNG BỊ ÁM.\nNÓ CHỈ NHỚ.</pre></div><button class="primary-btn" id="restart-arg">KHỞI ĐỘNG LẠI ARG</button>`;
    body.querySelector("#restart-arg").addEventListener("click", () => location.reload());
  }

  function mailWindow() {
    const { body } = createWindow("mail", "WeirdMail — Thư nội bộ", 780, 590);
    const mail = [
      { from: "MIRA", subject: "RE: hàm tự viết mã", body: `Tôi xóa móc tương thích ba lần. Nó lại xuất hiện sau mỗi lần khởi động.\n\nĐừng gửi việc này cho bộ phận kiểm thử. Tên hàm không còn là của chúng ta nữa.` },
      { from: "ELI", subject: "RE: hàm tự viết mã", body: `Hãy kiểm tra nhánh lưu trữ. Có tham chiếu tới ổ D: nhưng nó không tồn tại trong ghi chú trình cài đặt.\n\nNgoài ra — ứng dụng vé đang tự sinh chuỗi khi không có ai chạm vào.` },
      { from: "MIRA", subject: "KHÔNG ĐƯỢC PHÁT HÀNH", body: `Lúc 00:13, hệ điều hành mở một tiến trình tên Illusionary_Process.exe. Không có tiến trình cha. Không có vị trí tệp.\n\nTôi nghĩ nó đang theo dõi các sự kiện nhập liệu.` },
      { from: "ELI", subject: "tin nhắn cuối", body: `Nếu bạn đọc được việc này sau khi triển khai: đừng đuổi theo phần hình ảnh. Hãy đi theo dữ liệu.\n\nPhương trình → Puppet → TheTicket → Hex → Z:` }
    ];
    body.innerHTML = mail.map((m, i) => `<div class="panel"><div class="mail-row"><strong>${m.from}</strong><button data-mail="${i}">${m.subject}</button></div><div id="mail-${i}" class="mail-content hidden">${escapeHtml(m.body)}</div></div>`).join("");
    body.querySelectorAll("button[data-mail]").forEach((btn) => btn.addEventListener("click", () => body.querySelector(`#mail-${btn.dataset.mail}`).classList.toggle("hidden")));
  }

  function taskWindow() {
    const { body } = createWindow("task", "Trình quản lý tác vụ — Tiến trình hệ thống", 740, 530);
    const processes = ["explorer.exe", "weirdkernel.sys", "ticket_host.exe", "mailhost.exe", "Illusionary_Process.exe"];
    body.innerHTML = `<div class="panel"><div class="panel-title">TIẾN TRÌNH ĐANG CHẠY</div><div class="list">${processes.map((p, i) => `<div class="process-row"><span>${p}</span><span>${i === 4 ? `<button data-suspect="1">${t("common.inspect")}</button>` : `<span class="muted">${t("common.running")}</span>`}</span></div>`).join("")}</div><div id="task-detail" class="panel"><div class="muted">Chọn một tiến trình để xem chi tiết.</div></div>`;
    body.querySelector("[data-suspect]").addEventListener("click", () => {
      body.querySelector("#task-detail").innerHTML = `<div class="panel-title">ILLUSIONARY_PROCESS.EXE</div><p>Tiến trình cha: <strong>NULL</strong><br/>Vị trí: <strong>KHÔNG XÁC ĐỊNH</strong><br/>Khởi chạy: <strong>00:13:13</strong></p><p>Chuỗi Hex sinh ra:</p><div class="hex">${state.hexClue}</div><p class="muted">Các byte giải mã tạo thành K13. Ghép với tuyến vé: ∆13K → K-13-∆.</p>`;
    });
  }

  function notepadWindow() {
    const { body } = createWindow("notepad", "Sổ tay — DOC_NHAN.txt", 650, 490);
    body.innerHTML = `<textarea style="height:330px;resize:none;">GHI CHÚ WEIRDOS\n----------------------\nKhông đổi tên kho lưu trữ.\nKhông xóa Z:.\nKhông tin tiến trình không có tiến trình cha.\n\nPhương trình → Puppet → TheTicket → Hex → Z:\n\nCó người đã để chiếc máy này chạy.</textarea><div style="margin-top:7px"><button class="secondary-btn" id="save-note">${t("common.save")}</button></div>`;
    body.querySelector("#save-note").addEventListener("click", () => {
      body.querySelector("textarea").value += "\n[Đã lưu cục bộ — ít nhất là trên lý thuyết]";
      flashToast("Sổ tay: đã ghi lại thay đổi.");
    });
  }

  function settingsWindow() {
    const { body } = createWindow("settings", "Bảng điều khiển — WeirdOS", 660, 520);
    body.innerHTML = `
      <div class="about-logo panel"><img src="assets/images/weirdos-logo.svg" alt="Logo WeirdOS" /><div><strong>WeirdOS™</strong><br/><span class="muted">Phiên bản 1.7.0 (Bản dựng 0425)</span><br/><span class="muted">Hệ điều hành thử nghiệm.</span></div></div>
      <div class="control-grid">
        <div class="control-option"><h4>Màn hình</h4><p class="muted">Hiệu ứng sọc CRT đang bật.</p><button class="secondary-btn" id="toggle-crt">Bật / tắt sọc CRT</button></div>
        <div class="control-option"><h4>Ngôn ngữ</h4><p class="muted" id="current-lang">Hiện tại: ${t("lang")}</p><button class="secondary-btn" id="toggle-lang">Đổi ngôn ngữ</button></div>
        <div class="control-option"><h4>Thông tin</h4><p class="muted">Giao diện: xanh cobalt / đen / trắng<br/>Nhân hệ thống: weirdkernel.sys</p></div>
        <div class="control-option"><h4>Cảnh báo</h4><p class="muted">Thực tại chỉ là một giao diện khác.</p></div>
      </div>`;
    body.querySelector("#toggle-crt").addEventListener("click", () => document.getElementById("crt-overlay").classList.toggle("hidden"));
    body.querySelector("#toggle-lang").addEventListener("click", () => {
      setLanguage(state.lang === "vi" ? "en" : "vi");
      body.querySelector("#current-lang").textContent = `${t("common.current")}: ${t("lang")}`;
    });
  }

  function safeErrorSound() {
    const audio = document.getElementById("error-audio");
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  applyLanguage();
  touch();
})();

# WeirdOS

> **WeirdOS** — một hệ điều hành giả lập mang phong cách Windows 9x/2000, CRT, điều tra bí ẩn và ARG.

WeirdOS là một prototype web ARG được xây dựng hoàn toàn bằng **HTML, Vanilla CSS và JavaScript thuần**. Người chơi khám phá desktop cổ điển, mở các ứng dụng giả lập, giải chuỗi manh mối và lần theo dấu vết của một tiến trình không nên tồn tại.

---

## 🖥️ Preview

### Màn hình khởi động

<img width="1429" height="1071" alt="Screenshot 2026-09-02 131510" src="https://github.com/user-attachments/assets/da7bed58-4fea-4726-ac78-0f07ed403128" />


### Hợp nhất dữ liệu khởi động

<img width="1704" height="938" alt="Screenshot 2026-09-02 131515" src="https://github.com/user-attachments/assets/5db44b16-1910-48c3-8746-70060cd4eb5e" />


### Desktop WeirdOS

<img width="1918" height="1078" alt="Screenshot 2026-09-02 131527" src="https://github.com/user-attachments/assets/c45e0f2e-e706-4274-851d-1ab9a970e4fd" />


## 🎮 ARG Overview

Người chơi không được đưa thẳng tới đáp án. Chuỗi khám phá được thiết kế theo hướng:

```text
POWER ON
   │
   ▼
Màn hình kiểm tra hệ thống
   │
   ▼
Hợp nhất dữ liệu khởi động
   │
   ▼
WEIRDOS DESKTOP
   │
   ├── Your Computer
   │      ├── C:\
   │      │    └── PuppetYourself.exe
   │      │
   │      └── D:\
   │           └── clue_003.txt
   │
   ├── Discarded_Souls
   ├── WeirdMail
   ├── TheTicket
   └── Task Monitor
           │
           └── Illusionary_Process.exe
                    │
                    ▼
                  Hex clue
                    │
                    ▼
                  Z:
                    │
                    ▼
                ENDING.SCR
```

---

## ✨ Tính năng

### Desktop cổ điển

- Giao diện desktop giả lập Windows 9x/2000.
- Taskbar, Start Menu và system tray.
- Đồng hồ hệ thống.
- Shortcut ứng dụng trên desktop.
- Cửa sổ ứng dụng nổi có thể kéo.
- CRT scanlines và hiệu ứng nhiễu nhẹ.
- Logo WeirdOS riêng.

### 🌐 Ngôn ngữ

WeirdOS hỗ trợ:

- 🇺🇸 English
- 🇻🇳 Tiếng Việt

Ngôn ngữ có thể đổi trực tiếp từ khu vực system tray ở góc phải taskbar.

---

## 🔌 Các ứng dụng

### 1. Your Computer

File Explorer giả lập với hai ổ:

```text
C:\    SYSTEM
D:\    ARCHIVE
```

**C:\** chứa `PuppetYourself.exe`.

**D:\** chứa `clue_003.txt`, trong đó có payload Base64. Sau khi decode, người chơi nhận được:

```text
3x + 7 = 28
```

Đáp án cần nhập vào PuppetYourself là:

```text
7
```

### 2. PuppetYourself.exe

Nhập sai sẽ cho lỗi giả lập. Nhập đúng sẽ xuất hai kênh Morse:

```text
.-- . .. .-. -..
-.-. --- -.. .
```

Tương ứng:

```text
WEIRD
CODE
```

Ứng dụng cũng có thể tải ảnh kết quả từ:

```text
assets/images/puppet_result.png
```

### 3. TheTicket

Ứng dụng lưu trữ vé concert cũ với ba ký hiệu:

```text
∆
13
K
```

Tổ hợp manh mối:

```text
∆13K
```

Sau khi xác nhận, người chơi được dẫn tới Task Monitor.

### 4. Discarded_Souls

Recycle Bin đặc biệt chứa các mảnh nhật ký cũ, cung cấp lore và hint về Base64, ticket, Z: và `Illusionary_Process.exe`.

### 5. WeirdMail

Lưu lại email nội bộ giữa hai developer **MIRA** và **ELI**, nói về code tự sinh, ổ D: bất thường, ticket app và process đáng ngờ.

Email cuối đưa ra route:

```text
Equation → Puppet → Ticket → Hex → Z:
```

### 6. Task Monitor

Danh sách process có:

```text
Illusionary_Process.exe
```

Khi inspect:

```text
Parent: NULL
Location: UNKNOWN
Started: 00:13:13
```

Hex clue:

```text
4B-31-33
```

### 7. Command Prompt

Các lệnh chính:

```text
HELP
DIR
C:
D:
RUN PUPPET
CHECK
Z
CLEAR
EXIT
```

Ổ `Z:` chỉ mở sau khi hoàn thành chuỗi manh mối cần thiết.

---

## 🧩 Puzzle Flow

```text
D:
 ↓
Base64
 ↓
3x + 7 = 28
 ↓
7
 ↓
PuppetYourself.exe
 ↓
Morse
 ↓
WEIRD / CODE
 ↓
TheTicket
 ↓
∆13K
 ↓
Task Monitor
 ↓
Illusionary_Process.exe
 ↓
4B-31-33
 ↓
Z:
 ↓
ENDING.SCR
```

---

## 🌙 Screensaver

WeirdOS tự chuyển sang screensaver sau **2 phút không có thao tác**.

Hiển thị các hình học màu cobalt, CRT/noise, chuyển động chậm và cảnh báo:

```text
WAKE UP // SOMETHING IS LOOKING BACK
```

Di chuyển chuột hoặc nhấn phím để quay lại desktop.

---

## 🔊 Assets

Project không bao gồm media thực tế. Bạn có thể tự thêm:

```text
assets/
├── audio/
│   ├── startup.mp3
│   └── error.wav
│
└── images/
    ├── weirdos-logo.svg
    ├── puppet_result.png
    ├── ticket_1.png
    ├── ticket_2.png
    └── ticket_3.png
```

---

## 📁 Project Structure

```text
WeirdOS/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
├── assets/
│   ├── audio/
│   │   ├── startup.mp3
│   │   └── error.wav
│   │
│   └── images/
│       ├── weirdos-logo.svg
│       ├── puppet_result.png
│       ├── ticket_1.png
│       ├── ticket_2.png
│       └── ticket_3.png
│
└── docs/
    └── screenshots/
        ├── 01-desktop.png
        ├── 02-boot.png
        ├── 03-loading.png
        ├── 04-weirdmail.png
        ├── 05-discarded-souls.png
        └── 06-puppetyourself.png
```

---

## 🚀 Chạy local

Clone repository:

```bash
git clone YOUR_REPOSITORY_URL
cd WeirdOS
```

Sau đó chạy bằng local server. Với VS Code có thể dùng **Live Server**.

Hoặc:

```bash
python -m http.server 8000
```

Mở:

```text
http://localhost:8000
```

> Khuyến nghị dùng local server thay vì mở `index.html` trực tiếp bằng `file://`.

---

## 🛠️ Công nghệ

| Công nghệ | Sử dụng |
|---|---|
| HTML5 | Cấu trúc giao diện |
| CSS3 | Retro UI, CRT, animation |
| JavaScript | Desktop + ARG logic |
| SVG | Logo WeirdOS |
| Base64 | Puzzle ở ổ D: |
| Audio API | Startup / error sound |

Không sử dụng framework UI nặng.

---

## 🎨 Design Direction

Màu chủ đạo:

```css
#0047AB  /* Cobalt Blue */
#FFFFFF  /* White */
#000000  /* Black */
```

Phong cách:

- Windows 9x / Windows 2000
- CRT monitor
- Glitch
- Analog horror
- Software archaeology
- Mystery / investigation

Mục tiêu là tạo cảm giác:

> **Bạn không đang xem một website. Bạn đang sử dụng một chiếc máy tính cũ mà lẽ ra không còn tồn tại.**

---


## ⚠️ ARG Spoiler

<details>
<summary>Mở để xem puzzle answers</summary>

```text
D:\clue_003.txt
    ↓
Base64
    ↓
3x + 7 = 28
    ↓
x = 7

PuppetYourself
    ↓
Morse A = WEIRD
Morse B = CODE

TheTicket
    ↓
∆ + 13 + K
    ↓
∆13K

Task Monitor
    ↓
Illusionary_Process.exe
    ↓
4B-31-33

Command Prompt
    ↓
Z
    ↓
ENDING.SCR
```

</details>

---

## 📜 License

Prototype ARG / experimental web project.

Bạn có thể điều chỉnh lore, puzzle, artwork và visual identity cho phiên bản WeirdOS của riêng mình.

---

## 🕳️ Final Note

WeirdOS được thiết kế để tạo cảm giác rằng có thứ gì đó đang chạy phía sau desktop.

```text
Không phải mọi cửa sổ đều quan trọng.
Không phải mọi process đều vô hại.

Và đôi khi...

Z: không phải là một ổ đĩa.
```

---

**WEIRDOS // BUILD 1.7**  
`> See what shouldn't be seen _`

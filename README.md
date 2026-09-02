# WeirdOS

> **WeirdOS** — a simulated operating system inspired by Windows 9x/2000, CRT aesthetics, software archaeology, mystery, and ARG design.

## ⚠️ Current Status — EXPERIMENTAL PROTOTYPE

**WeirdOS is currently an experimental prototype.**

The current build is **not a finished or stable release**. Some features, puzzles, visuals, interactions, and system behaviors are still being tested and may change significantly in future versions.

You may encounter:
- Bugs and unexpected behavior
- Placeholder assets
- Incomplete ARG sections
- Experimental UI interactions
- Puzzle elements that are still being refined

**Please treat the current version as a work in progress.**

---

## 🖥️ Preview

### Boot Screen

<img width="1429" height="1071" alt="WeirdOS Boot Screen" src="https://github.com/user-attachments/assets/da7bed58-4fea-4726-ac78-0f07ed403128" />

### Startup Data Merge

<img width="1704" height="938" alt="WeirdOS Startup Data Merge" src="https://github.com/user-attachments/assets/5db44b16-1910-48c3-8746-70060cd4eb5e" />

### WeirdOS Desktop

<img width="1918" height="1078" alt="WeirdOS Desktop" src="https://github.com/user-attachments/assets/c45e0f2e-e706-4274-851d-1ab9a970e4fd" />

---

## 🎮 ARG Overview

WeirdOS is designed as an interactive ARG rather than a conventional website.

The player is placed inside a fictional computer system and must investigate its files, applications, messages, processes, and hidden data.

The intended investigation route is:

```text
POWER ON
   │
   ▼
System Hardware Check
   │
   ▼
Startup Data Merge
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
                  Hex Clue
                    │
                    ▼
                   Z:
                    │
                    ▼
                ENDING.SCR
```

---

## ✨ Features

### Classic Desktop Environment

- Simulated Windows 9x/2000-style desktop
- Taskbar, Start Menu, and system tray
- System clock
- Desktop application shortcuts
- Draggable application windows
- CRT scanlines and subtle screen noise
- Custom WeirdOS logo
- Retro computer-style boot sequence
- Startup data synchronization screen

### 🌐 Language Support

The interface currently supports:

- 🇺🇸 English
- 🇻🇳 Vietnamese

The language can be changed from the system tray in the bottom-right corner.

---

## 🔌 Applications

### 1. Your Computer

A simulated file explorer containing two virtual drives:

```text
C:\    SYSTEM
D:\    ARCHIVE
```

#### C:\

Contains:

```text
PuppetYourself.exe
```

The player must enter the correct value obtained from the puzzle stored on drive D:.

#### D:\

Contains:

```text
clue_003.txt
```

The file contains a Base64 payload.

After decoding it, the player receives a mathematical puzzle:

```text
3x + 7 = 28
```

The required answer is:

```text
7
```

---

### 2. PuppetYourself.exe

The player enters the answer from the D: drive puzzle.

An incorrect answer produces a simulated system error.

A correct answer triggers a fake command-line execution sequence and eventually produces:

```text
ACCESS ACCEPTED.
```

The application then reveals two Morse-code channels:

```text
.-- . .. .-. -..
-.-. --- -.. .
```

Which decode to:

```text
WEIRD
CODE
```

The application can also display an image from:

```text
assets/images/puppet_result.png
```

---

### 3. TheTicket

A fictional legacy concert-ticket application.

The ticket artwork contains hidden symbols that become part of the ARG investigation.

Current clue:

```text
∆
13
K
```

Combined:

```text
∆13K
```

The clue connects the ticket application to the next stage of the investigation.

---

### 4. Discarded_Souls

A strange version of the Recycle Bin containing fragmented developer logs.

The files provide:

- Background lore
- Hints about the D: drive
- Base64 clues
- Information about the ticket application
- Warnings about `Illusionary_Process.exe`
- Hints about the hidden Z: drive

---

### 5. WeirdMail

An internal email archive containing messages exchanged between the two fictional WeirdOS developers:

```text
MIRA
ELI
```

The messages discuss:

- Self-generating code
- Strange system behavior
- A mysterious D: volume
- The ticket application generating strings by itself
- Missing process parents
- Input monitoring
- The possibility that WeirdOS is behaving in ways its developers did not intend

The final message gives the intended investigation route:

```text
Equation → Puppet → Ticket → Hex → Z:
```

---

### 6. Task Monitor

A simulated process manager showing active system processes.

Among the normal processes is:

```text
Illusionary_Process.exe
```

Its information is intentionally suspicious:

```text
Parent: NULL
Location: UNKNOWN
Started: 00:13:13
```

Inspecting the process reveals a hexadecimal clue:

```text
4B-31-33
```

This clue is used together with information discovered elsewhere in the ARG.

---

### 7. Command Prompt

A retro command-line interface supporting simple commands such as:

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

The virtual `Z:` drive is only accessible after enough of the ARG has been completed.

The final destination is:

```text
Z:\ENDING.SCR
```

---

## 🧩 Puzzle Flow

The current prototype follows this investigation path:

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

This sequence may change during future ARG development.

---

## 🌙 Screensaver

WeirdOS automatically enters screensaver mode after **2 minutes of inactivity**.

The screensaver features:

- Slowly moving cobalt geometric shapes
- CRT effects
- Screen noise
- Flickering warning text
- WeirdOS branding

Current warning:

```text
WAKE UP // SOMETHING IS LOOKING BACK
```

Mouse or keyboard activity returns the player to the desktop.

---

## 🔊 Assets

The project does not require the actual media files to be included in the repository.

Optional assets can be placed in:

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

### Startup Audio

Played when the player activates:

```text
POWER ON
```

Expected file:

```text
assets/audio/startup.mp3
```

### Visual Assets

Ticket and PuppetYourself images can be replaced with final ARG artwork later.

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
```

---

## 🚀 Running Locally

WeirdOS does not require a framework or build system.

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd WeirdOS
```

Then run it through a local web server.

For VS Code, **Live Server** is recommended.

Alternatively:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

> Using a local server is recommended instead of opening `index.html` directly with `file://`.

---

## 🛠️ Technology

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| Vanilla CSS | Retro interface, CRT effects, animations |
| Vanilla JavaScript | Desktop and ARG logic |
| SVG | WeirdOS logo |
| Base64 | D: drive puzzle |
| Audio API | Startup / system sounds |

No heavy UI framework is used.

---

## 🎨 Design Direction

The main color palette is:

```css
#0047AB  /* Cobalt Blue */
#FFFFFF  /* White */
#000000  /* Black */
```

The visual direction is inspired by:

- Windows 9x / Windows 2000
- CRT monitors
- Glitch aesthetics
- Analog horror
- Software archaeology
- Mystery / investigation
- Retro computing
- ARG interfaces

The core design goal is:

> **You are not browsing a website. You are using an old computer that should no longer exist.**

---

## 🧪 Experimental Development

WeirdOS is actively being developed as an experimental ARG prototype.

The current version is primarily intended for:

- Testing the gameplay concept
- Testing the visual direction
- Testing puzzle flow
- Testing the simulated operating-system interface
- Collecting feedback
- Experimenting with ARG storytelling

Features may be redesigned, removed, expanded, or replaced without notice.

**Do not consider the current build a final release.**

---

## ⚠️ ARG Spoilers

<details>
<summary>Click to reveal current puzzle answers</summary>

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

## 📩 Feedback & Bug Reports

If you find any errors or have suggestions for the project, please [send an email to the WeirdOS developer](https://mail.google.com/mail/?view=cm&fs=1&to=huynhkhanhdeptrai25102012@gmail.com&su=WeirdOS%20Feedback).

---

## 📜 License

**Experimental / Prototype ARG project.**

The lore, puzzles, artwork, interface, and visual identity are subject to change as WeirdOS continues to evolve.

---

## 🕳️ Final Note

WeirdOS is built around the idea that something is running behind the desktop.

Not every window matters.

Not every process is harmless.

And sometimes...

```text
Z: is not a drive.
```

---

**WEIRDOS // BUILD 1.7 — EXPERIMENTAL PROTOTYPE**

`> See what shouldn't be seen _`

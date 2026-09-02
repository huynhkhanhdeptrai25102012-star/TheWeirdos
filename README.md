# WeirdOS ARG

WeirdOS is a browser-based ARG prototype styled as a haunted Windows 9x / early-2000s desktop.

## Run

Open the folder in VS Code and serve it with Live Server (recommended), or another local HTTP server. Then open `index.html`.

## Asset placeholders

Add your real assets later at:

```text
assets/audio/startup.mp3
assets/audio/error.wav
assets/images/puppet_result.png
assets/images/ticket_1.png
assets/images/ticket_2.png
assets/images/ticket_3.png
```

A custom vector logo is already included at:

```text
assets/images/weirdos-logo.svg
```

## UI updates

- Win9x-style gray taskbar and Start menu
- System tray with a **language switcher: English / Tiếng Việt** in the bottom-right corner
- Retro shortcut icons and draggable application windows
- CRT scanlines + vignette
- Central WeirdOS watermark/logo on the desktop
- About / Control Panel app
- Original ARG puzzle chain is preserved

## Puzzle chain

```text
D: clue_003.txt
  -> Base64
  -> 3x + 7 = 28
  -> X = 7
  -> PuppetYourself.exe
  -> Morse: WEIRD / CODE
  -> TheTicket: ∆ + 13 + K
  -> Task Monitor
  -> Illusionary_Process.exe
  -> Hex: 4B-31-33
  -> Command Prompt
  -> Z:
  -> ENDING.SCR
```

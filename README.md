# SleeperClass.live 🚂🌙

![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20&height=170&section=header&text=SleeperClass.live&fontSize=54&fontColor=ffffff&animation=fadeIn)

![SleeperClass banner — lo-fi night train](assets/banner.png)

![Made by VN](https://img.shields.io/badge/made%20by-VN-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![HTML](https://img.shields.io/badge/type-single%20HTML%20file-orange.svg)
![No build](https://img.shields.io/badge/build-none%20needed-brightgreen.svg)

A late-night Indian Railways sleeper-coach experience in a single HTML file. Settle into your berth as the train rumbles through the dark — passing stations glow by the window, you can pull the emergency chain (gently), tune the radio, and add your own songs.

## Screenshots

> 📸 Screenshots coming soon — open `index.html` in any browser, hit **Start Journey**, and watch the night roll by.

## Features

- 🚂 **Immersive sleeper coach** — window assembly, safety bars, glass shutter, control panel
- 🌃 **Passing stations** — glowing signboards roll by (Nagpur, Itarsi, Bhopal, Varanasi…)
- 🔊 **Procedural audio** — WebAudio-synthesized train rumble, ambient loops, and UI chimes (no audio files)
- ⛓️ **Emergency chain** — pull it and feel the brake (with a 3-second reset, don't worry)
- 📻 **Custom songs** — paste any YouTube URL to play your own track on the journey
- 🎚️ **Mixing controls** — separate music / train-noise volume sliders, window latch, radio muffle
- ✨ **Maximalist night sky** — twinkling starfield, glowing signboard pulse, hover-glow controls
- ♿ **Reduced-motion respected** — calm static mode when your OS prefers it

## Controls

| Input | Action |
|---|---|
| **Start Journey** | Begin the ride (starts audio) |
| **Prev / Next Station** | Jump between stations |
| **Add Your Song** | Play a YouTube URL as the journey soundtrack |
| **Emergency chain** | Click-drag the chain down to pull it |
| **Sliders** | Mix music vs. train noise |
| 🔊 button (bottom-right) | Mute / unmute UI sounds |

## Usage

No build step. Just open it:

```bash
# option 1: double-click index.html
# option 2: serve it
python3 -m http.server 8000
# → http://localhost:8000/index.html
```

> Browsers require a user gesture before audio can start — that's why the journey begins with the **Start Journey** button.

## Project structure

```
index.html      The entire app — markup, styles, and script in one file
assets/         Banner art
```

## How it was recovered

Fun fact: this app originally lived inside a LibreOffice `.odt` document (`index.html.odt`), which mangled the code on export — smart quotes, capitalized keywords (`Const`, `Function`), en-dashes as minus signs, and broken comments. The code was carefully extracted and repaired; see the QA notes in the repo history.

## License

MIT © 2026 Vivek Nair — see [LICENSE](LICENSE).

---

**Crafted by [Vivek Nair](https://github.com/vivekn4) · VN**

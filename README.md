# 🏃 Dagan Bai!🎂

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-API-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://vercel.com)

A responsive, browser-native 2D retro endless runner game built with HTML5 Canvas, CSS3, and JavaScript, celebrating Filipino street culture with an unexpected comedic **birthday surprise twist**!

---

## 📖 Table of Contents

- [Overview & Lore](#-overview--lore)
- [Key Features](#-key-features)
- [The Birthday Surprise Twist](#-the-birthday-surprise-twist)
- [Project Architecture](#-project-architecture)
- [Controls & Input Mapping](#-controls--input-mapping)
- [Local Setup & Installation](#-local-setup--installation)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Personalization & Customization](#-personalization--customization)
- [License](#-license)

---

## 🌴 Overview & Lore

In Cebuano and Bisaya, **"Dagan Bai!"** translates to **"Run, Brother!"**. 

You play as **Aloy**, a lively boy sprinting through the sun-drenched provincial streets of the Philippines. You are in a desperate rush to reach the neighborhood birthday party before the lechon runs out! Along the way, dodge street-smart *askal* dogs and parked passenger tricycles, collect shiny gold peso coins, and survive as long as you can.

The twist? The game is secretly a birthday greeting in disguise!

---

## ⚡ Key Features

* **Dynamic HTML5 Canvas Scaling**: Scales smoothly to maintain an ideal 16:9 aspect ratio (`960 × 540`) across 4K desktops, laptops, iPads, tablets, and smartphones without visual distortion.
* **Dual Input System**: Seamless desktop keyboard support (`Spacebar`, `Arrow Up`, `W`) and responsive mobile touch gestures (tap anywhere to jump).
* **Double Jump Physics**: Perform mid-air acrobatic double jumps to clear wide obstacles or collect higher coin arcs.
* **4-Layer Parallax Background**: Layered tropical sky, rolling mountain ridges, sari-sari stores, and asphalt road scrolling at varying depth speeds.
* **Authentic Cultural Obstacles**:
  * 🐕 **The Askal**: Philippine street dog resting or alert on the sidewalk.
  * 🛺 **The Tricycle**: Classic sidecar passenger transport parked along the lane.
  * 🕳️ **The Pothole (*Lubak*)**: Road hazard with warning cone.
* **Collectible Peso Coins (₱)**: Floating golden coins that grant +50 points and floating score popups.
* **The Birthday Surprise Twist**: An unexpected celebratory sequence disguised as an arcade endless runner game over.
* **The 2-Second Suspense Freeze**: Upon obstacle collision, the game pauses for 2 seconds of comedic tension with a comic "Patay kang bata ka... 👀" game over screen.
* **Explosive Physics Confetti**: 260+ colorful, swirling confetti particles burst across the screen with wobble, spin, and gravity dynamics.
* **Synthesized 8-Bit Web Audio**: Pure synthesized sound effects and multi-voice "Happy Birthday" melody without external audio file dependencies.
* **Persistent High Scores**: Automatically saves your personal best score to browser `localStorage`.

---

## 🎂 The Birthday Surprise Twist

When the player collides with an obstacle:
1. **The Dramatic Freeze (Comedic Suspense)**: The game immediately freezes, plays a punchy crash sound, and displays a standard red `"GAME OVER"` banner with the caption: *"Patay kang bata ka... 👀"*.
2. **The 2-Second Suspense**: For exactly **2.0 seconds**, the screen stays frozen to build authentic comedic tension.
3. **The Celebration Explosion**:
   * Over **260 physics confetti particles** explode across the screen in vibrant rainbow colors!
   * A multi-voice synthesized **Happy Birthday** 8-bit melody plays automatically using the HTML5 Web Audio API.
   * The celebratory banner unfurls: **"🎉 SURPRISE! Happy Birthday, [NAME]! 🎂"** (customized via `?name=YourName`).
   * Final game statistics (Distance, Coins, Score) are revealed alongside the replay button: **"🔄 DAGAN NA SAD! (PLAY AGAIN)"**.

---

## 📁 Project Architecture

```
dagan-bai-game/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI workflow verifying JS syntax & structure
├── docs/
│   ├── architecture.md     # Technical specifications, state machine & physics
│   └── user-guide.md       # Full player manual, lore & control mappings
├── src/
│   ├── index.html          # Main entry markup with canvas, HUD, and surprise overlays
│   ├── css/
│   │   └── style.css       # Responsive layout, retro pixel styles & celebration animations
│   └── js/
│       ├── main.js         # Core game loop, event listeners, and state initialization
│       ├── engine.js       # Physics, collision detection, sprite rendering & speed scaling
│       └── surprise.js     # 2s suspense freeze, audio synthesis & confetti celebration
├── assets/
│   ├── sprites/            # Pixel art sprite storage (cake.png, etc.)
│   └── audio/              # Sound effects & audio documentation
├── index.html              # Root index with direct runner game & surprise views
├── vercel.json             # Production rewrites configuration for Vercel
├── package.json            # Project metadata & npm scripts
└── README.md               # Master documentation
```

---

## 🎮 Controls & Input Mapping

| Device | Action | Primary Input | Secondary Input |
|---|---|---|---|
| **Desktop / Laptop** | **Jump** | `Spacebar` | `Arrow Up` / `W` / Left Click |
| **Desktop / Laptop** | **Double Jump** | Double tap `Spacebar` | Double tap `Arrow Up` / `W` |
| **Mobile / Tablet** | **Jump** | **Tap anywhere** on screen | — |
| **Mobile / Tablet** | **Double Jump** | **Double tap** while in the air | — |
| **Restart** | **Play Again** | `Enter` / `Space` | Click/Tap **"Dagan Na Sad!"** |

---

## 💻 Local Setup & Installation

### Option 1: Instant Python Server (Zero Install)
If you have Python installed, open your terminal inside the project directory and run:
```bash
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Option 2: Using Node.js / npx
```bash
npx serve src
```

### Option 3: VS Code Live Server
Right-click `src/index.html` in VS Code and select **"Open with Live Server"**.

---

## 🚀 Vercel Deployment Guide

Deploying **Dagan Bai!** to Vercel takes under 1 minute:

### Method 1: Git Repository (Recommended)
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit of Dagan Bai! game"
   git remote add origin https://github.com/<your-username>/dagan-bai-game.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `dagan-bai-game` repository.
4. Leave all build settings as default (Vercel automatically detects [`vercel.json`](file:///c:/Users/Arien/OneDrive%20-%20ctu.edu.ph/Desktop/Personal%20Files/birthday%20project/vercel.json) and [`package.json`](file:///c:/Users/Arien/OneDrive%20-%20ctu.edu.ph/Desktop/Personal%20Files/birthday%20project/package.json)).
5. Click **Deploy**. Your game is live!

### Method 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🎁 Personalization & Customization

### Send with Recipient's Name via URL
You can customize the birthday surprise for anyone by adding the `?name=` query parameter to your live link:

```
https://dagan-bai.vercel.app/?name=Marc
https://dagan-bai.vercel.app/?name=Arien
https://dagan-bai.vercel.app/?name=Kuya%20John
```

When they crash, the surprise headline dynamically reads:
> **"🎉 SURPRISE! Happy Birthday, Marc! 🎂"**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal, educational, and commercial game modifications.

# System Architecture & Technical Specifications — Dagan Bai! (Run Brother)

This document provides a comprehensive technical breakdown of the architecture, engine design, state machine, and asset pipeline for **Dagan Bai! (Run Brother)**.

---

## 1. High-Level Architecture

The game is structured as a modular, browser-native 2D canvas game built with zero external runtime dependencies. It uses standard Web APIs (HTML5 Canvas 2D Context, Web Audio API, `requestAnimationFrame`, `localStorage`, and CSS3).

```
┌────────────────────────────────────────────────────────┐
│                      src/index.html                    │
│   (HTML5 Canvas, Retro HUD Overlay, Responsive Modal)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                      src/js/main.js                    │
│      - Application Orchestrator & Input Router         │
│      - Game Loop & Frame Timing (Delta Time)           │
│      - LocalStorage High Score Persistence             │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼─────────────┐ ┌──────────▼──────────────┐
│       src/js/engine.js     │ │     src/js/surprise.js  │
│  - Physics & Velocity Step │ │  - 2s Suspense Manager  │
│  - AABB Collision Engine   │ │  - Confetti Physics     │
│  - Parallax Scroller       │ │  - Web Audio Synthesizer│
│  - Procedural Sprite Engine│ │    (Fanfare + B-day)    │
│  - Obstacle & Coin Spawner │ │  - Greeting Modal HUD   │
└────────────────────────────┘ └─────────────────────────┘
```

---

## 2. Finite State Machine (FSM)

The game executes across 4 mutually exclusive states:

```
        ┌───────────────────────────────────┐
        │               MENU                │
        │  (Press Space / Tap to Dagan!)    │
        └─────────────────┬─────────────────┘
                          │ User Input
                          ▼
        ┌───────────────────────────────────┐
        │             PLAYING               │ ◀──────────────┐
        │  (Run, Jump, Collect, Dodge)      │                │
        └─────────────────┬─────────────────┘                │
                          │ Player Collision                 │
                          ▼                                  │
        ┌───────────────────────────────────┐                │
        │       GAME_OVER_SUSPENSE          │                │
        │  (Loop pauses for exactly 2.0s;   │                │
        │   comedic crash effect & silence) │                │
        └─────────────────┬─────────────────┘                │
                          │ Timer = 2000ms                   │
                          ▼                                  │
        ┌───────────────────────────────────┐                │
        │        BIRTHDAY_SURPRISE          │                │
        │  (Confetti explosion, audio play, │                │
        │   cake appearance, banner reveal) │                │
        └─────────────────┬─────────────────┘                │
                          │ "Dagan Na Sad!" (Replay)         │
                          └──────────────────────────────────┘
```

### State Breakdown
1. **`MENU`**:
   - Background parallax gently animates.
   - Character rests in idle stance.
   - HUD displays title logo, instructions, and high score.
2. **`PLAYING`**:
   - Active physics (gravity, jump velocity, ground snapping).
   - Progressive difficulty multiplier: speed increments smoothly every 100 distance units.
   - Dynamic obstacle generation (Askal dog, Parked Tricycle, Pothole).
   - Coin spawning with sine-wave floating motion.
3. **`GAME_OVER_SUSPENSE` (The 2-Second Freeze)**:
   - Physics immediately halts.
   - Player sprite renders in comic tumble frame.
   - Standard "Game Over" red banner appears.
   - Audio cuts with an abrupt record scratch/thud sound.
   - A precise 2000ms countdown timer begins to build comedic tension.
4. **`BIRTHDAY_SURPRISE`**:
   - The "Game Over" text blasts away!
   - Fullscreen confetti particle system activates with 260+ colorful physics particles.
   - Web Audio synthesizer plays an upbeat 8-bit multi-voice "Happy Birthday" melody.
   - Festively styled celebration banner reveals personalized celebrant name (supporting `?name=Name` query parameter).
   - Real-time run statistics (distance, collected coins, and final score) are shown.
   - "DAGAN NA SAD! (PLAY AGAIN)" option restarts the runner instantly without reloading.

---

## 3. Physics & Collision Engine

### Jump & Gravity Model
The player movement uses Euler integration:
$$\text{velocity}_y = \text{velocity}_y + \text{gravity} \times \Delta t$$
$$\text{position}_y = \text{position}_y + \text{velocity}_y \times \Delta t$$

* **Gravity**: $1600\,\text{px/s}^2$
* **Initial Jump Velocity**: $-680\,\text{px/s}$ (instant upward impulse)
* **Double Jump Option**: Players can perform a mid-air flip for tight obstacle dodges.
* **Terminal Velocity**: $900\,\text{px/s}$ (prevents ground clip errors)

### Collision Detection: Inset AABB
To ensure fair and fun arcade gameplay, bounding boxes are **inset** by 15% on each side. This prevents frustrating "air collisions" where empty sprite padding hits an obstacle:

```javascript
function checkCollision(a, b) {
  const padA = { x: a.width * 0.15, y: a.height * 0.12 };
  const padB = { x: b.width * 0.15, y: b.height * 0.12 };

  return (
    a.x + padA.x < b.x + b.width - padB.x &&
    a.x + a.width - padA.x > b.x + padB.x &&
    a.y + padA.y < b.y + b.height - padB.y &&
    a.y + a.height - padA.y > b.y + padB.y
  );
}
```

---

## 4. Parallax Rendering Engine

The background is composed of 4 layered horizontal bands that scroll at relative speeds to produce realistic depth:

| Layer | Subject | Speed Ratio |
|---|---|---|
| **0** | Tropical Sky & Drifting Clouds | `0.15 × baseSpeed` |
| **1** | Distant Verdant Mountains & Coconut Palms | `0.40 × baseSpeed` |
| **2** | Provincial Sari-Sari Stores & Power Lines | `0.75 × baseSpeed` |
| **3** | Asphalt Road, Sidewalk Curb & Grass Base | `1.00 × baseSpeed` |

---

## 5. Procedural Web Audio Engine

No external MP3 files are required for operation. All sound effects and music tracks are synthesized in real time using the browser's native **Web Audio API**:
* **Jump Sound**: Frequency sweep from 250Hz up to 600Hz on a square wave oscillator.
* **Coin Pickup**: High-pitch arpeggio (B5 $\to$ E6) on triangle waves with exponential gain decay.
* **Collision Thud**: Low-frequency noise burst coupled with a descending pitch bass drop.
* **Birthday Surprise Music**: Full 4-measure "Happy Birthday" melody synthesized with melodic triangle oscillators, harmonic sub-oscillators, and chord pads.

---

## 6. Responsive Resolution & Scaling

The game canvas operates on a fixed internal resolution of **`960 × 540`** (16:9 aspect ratio). 
* CSS letterboxing / auto-aspect scaling preserves pixel-perfect proportions across smartphones, tablets, laptops, and ultra-wide desktop displays.
* Touch input coordinates are automatically mapped from client viewport coordinates back into internal game space:
  $$\text{canvasX} = (\text{clientX} - \text{rect.left}) \times \left(\frac{960}{\text{rect.width}}\right)$$
  $$\text{canvasY} = (\text{clientY} - \text{rect.top}) \times \left(\frac{540}{\text{rect.height}}\right)$$

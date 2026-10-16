# User Guide & Gameplay Manual — Dagan Bai! (Run Brother)

Welcome to **Dagan Bai! (Run Brother)** — a fast-paced, humor-filled 2D endless runner web game celebrating Filipino street culture, arcade nostalgia, and an unforgettable birthday surprise twist!

---

## 1. Story & Lore

In Cebuano and Bisaya, *"Dagan Bai!"* means **"Run, Brother!"**. 

You play as **Aloy**, a resilient local boy sprinting down the vibrant provincial streets of the Philippines. You're in a mad rush to reach the neighborhood birthday party before the lechon runs out! Along the way, you must navigate local street obstacles, collect gold peso coins, and survive as long as possible.

Little do you know... the game has a surprise waiting for you the moment you crash!

---

## 2. Controls & Input Mapping

The game automatically adapts to whichever device you are playing on:

### Desktop / Laptop Controls
| Action | Primary Key | Secondary Key | Alternate |
|---|---|---|---|
| **Jump** | `Spacebar` | `Arrow Up` | `W` |
| **Double Jump** | Tap `Spacebar` twice in mid-air | Tap `Arrow Up` twice | Tap `W` twice |
| **Quick Restart** | `Enter` | `Spacebar` (on game over) | Click **Dagan Na Sad!** |
| **Mouse Jump** | Left Click anywhere on the game canvas | — | — |

### Mobile & Tablet Controls
| Action | Touch Gesture |
|---|---|
| **Jump** | **Tap anywhere** on the screen |
| **Double Jump** | **Quick double-tap** while in mid-air |
| **Restart** | Tap the **Dagan Na Sad!** button |

---

## 3. Game Obstacles & Hazards

Watch out for these classic street hazards moving right-to-left:

1. **The Askal (Asong Kalye / Street Dog) 🐕**:
   - The neighborhood guard dog taking a nap on the street or suddenly barking!
   - Jump cleanly over it to avoid waking it up.

2. **The Parked Tricycle 🛺**:
   - A classic Philippine passenger tricycle parked along the road shoulder.
   - It's taller and wider than the askal — timing your jump or saving your double-jump is key!

3. **Road Pothole (*Lubak*) 🕳️**:
   - Street construction and potholes. Don't trip into one!

---

## 4. Collectibles & Score System

* **Distance (Meters)**: Your distance counter increases by 1 meter for every frame you survive.
* **Gold Peso Coins 🪙**: Floating in air arcs. Each collected coin grants **+50 bonus points** and triggers a shiny chime!
* **High Score**: Your personal best score is automatically saved in your browser's `localStorage` so you can beat your record every time you return.

---

## 5. The Birthday Surprise Twist 🎂

When your character collides with an obstacle:
1. **The Freeze Frame (Suspense)**: The game halts immediately with a dramatic crash thud and displays a comic "Game Over" screen (*"Patay kang bata ka... 👀"*).
2. **The 2-Second Suspense**: For exactly **2.0 seconds**, the screen stays completely still in comedic suspense.
3. **The Celebration Burst**:
   - Over **260 physics confetti particles** explode across the canvas in vibrant rainbow colors!
   - The upbeat **Happy Birthday** 8-bit chiptune melody plays automatically through your speakers via the Web Audio API.
   - A grand festive banner unfolds: **"🎉 SURPRISE! Happy Birthday, [NAME]! 🎂"** with game distance, coins collected, and final score.
   - The **"🔄 DAGAN NA SAD! (PLAY AGAIN)"** button lets you sprint right back into the action without refreshing!

### URL Personalization
You can send this game to anyone on their birthday with their name built right into both the start screen and the celebration banner! Simply add `?name=TheirName` to the URL:

```
https://your-dagan-bai.vercel.app/?name=Marc
https://your-dagan-bai.vercel.app/?name=Arien
https://your-dagan-bai.vercel.app/?name=Maria
```

When they open the game, the title screen greets them with:
> **"🏃 SPECIAL MISSION FOR ARIEN! 🎂"**

And after the 2-second suspense:
> **"🎉 SURPRISE! Happy Birthday, ARIEN! 🎂"**

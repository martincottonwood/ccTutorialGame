# Breakout Game — Design Spec
_Date: 2026-06-29_

## Overview

A browser-based Breakout clone built with Phaser 3. Player controls a paddle to bounce a ball into a grid of colored bricks. Goal: clear all bricks without running out of lives.

---

## Tech Stack

| Item | Choice |
|---|---|
| Game library | Phaser 3, loaded via CDN (no build tools) |
| Canvas size | 480×640px, centered on a dark page |
| Entry point | `index.html` — loads Phaser CDN + all JS files |

---

## File Structure

```
index.html       — loads Phaser + JS files, no logic
js/
  game.js        — Phaser Game config, scene registration
  visuals.js     — color constants, drawing helpers, UI text
  mechanics.js   — game logic: lives, scoring, win/lose, paddle-velocity influence
  audio.js       — stub (wired up in a later phase)
```

---

## Scene Structure

One Phaser Scene: **GameScene**. It owns the entire game lifecycle.

### Game Objects

**Paddle**
- Rectangle sprite at bottom of canvas
- Moves left/right via arrow keys or A/D
- Constrained within canvas bounds
- Velocity tracked for ball-influence calculation

**Ball**
- Circle sprite with Arcade Physics
- Initial velocity: ~300px/s at a diagonal angle
- `setBounce(1)` — perfectly elastic
- `setCollideWorldBounds(true)` with bottom wall **excluded** — ball falls through to trigger life loss

**Bricks**
- Static physics group
- 8 columns × 5 rows
- Row colors (top to bottom): red, orange, yellow, green, teal
- Point values by row:
  - Rows 1–2 (red, orange): 3 points each
  - Rows 3–4 (yellow, green): 2 points each
  - Row 5 (teal): 1 point each

**HUD**
- Score: top-left text, updates on each brick hit
- Lives: top-right text, updates on each life lost

---

## Physics & Collision

### Wall Bouncing
Handled automatically by Phaser Arcade Physics world bounds (top + left + right only).

### Paddle Collision
`addCollider(ball, paddle)` triggers a callback in `mechanics.js` that:
1. Calculates hit position on paddle (left edge = -1, center = 0, right edge = +1)
2. Maps hit position to a new horizontal velocity component
3. Blends in a fraction of the paddle's current velocity at moment of contact
4. Preserves ball speed (normalizes velocity after blending)

### Brick Collision
`addCollider(ball, bricks)` triggers a callback that:
1. Destroys the brick
2. Adds the row's point value to score
3. Updates score HUD
4. Checks if all bricks are gone → triggers win condition

---

## Lives & Game State

- Start with 3 lives
- When ball Y exceeds canvas bottom: lose a life, reset ball to center, 1-second pause then relaunch
- When lives reach 0: trigger game over
- When brick count reaches 0: trigger win

---

## Game Over / Win Overlay

Displayed on top of the frozen scene:
- Semi-transparent dark rectangle covering the canvas
- Large text: "GAME OVER" or "YOU WIN!"
- Final score displayed below
- "Play Again" button — clicking restarts GameScene from scratch

---

## Out of Scope (MVP)

The following are deferred to later phases per `notes/game-design.md`:

- Ball speedup over time
- Power-ups
- Multiple levels
- Sound effects (audio.js is a stub)
- Ball glow / brick shatter animations
- Wide/responsive canvas layout

# Breakout Game - Design Document

## 1. Game Concept
A simple paddle-and-ball brick-breaker game. Player controls a paddle at the bottom of the screen to reflect a ball upward and break bricks. Goal: break all bricks without letting the ball fall off the bottom.

## 2. Core Mechanic (Phase 1 - MVP)
- Paddle: moves left/right with arrow keys or A/D
- Ball: bounces off paddle, walls, and bricks
- Bricks: disappear when ball hits them
- Score: increases by 1 for each brick broken
- Game ends: when ball falls below paddle (lose) or all bricks destroyed (win)

## 3. Code Structure
- game.js: core game loop, collision detection, game state
- visuals.js: rendering, colors, animations
- audio.js: sound effects
- mechanics.js: special effects, power-ups, advanced features

## 4. Future Iterations (Phase 2+)
- Visuals: ball glow, brick shattering animations, colorful bricks
- Audio: paddle hit sound, brick break sound, level complete sound
- Mechanics: ball flare on perfect timing, power-ups, multiple lives

## 5. Learning Notes
(Will fill as we go)

## 6. TODO - Phase 1
- [ ] Set up HTML structure
- [ ] Create paddle and ball objects
- [ ] Implement collision detection
- [ ] Add scoring system
- [ ] Test core loop works
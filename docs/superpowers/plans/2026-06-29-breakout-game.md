# Breakout Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully playable Breakout game in the browser using Phaser 3, with 3 lives, colored brick rows with score multipliers, paddle-velocity-influenced ball angles, and a game over/win overlay.

**Architecture:** A single Phaser 3 `GameScene` manages the complete game lifecycle. Global constants (canvas size, colors, dimensions) live in `visuals.js`. Pure collision logic lives in `mechanics.js`. `audio.js` is a stub for future sound. `game.js` holds the Phaser config and `GameScene` class. Scripts are loaded in dependency order via plain `<script>` tags — no build tools.

**Tech Stack:** Phaser 3.60 (CDN), vanilla JavaScript, HTML5 Canvas

---

## File Map

| File | Responsibility |
|------|----------------|
| `index.html` | Load Phaser CDN + JS files in order; no game logic |
| `js/visuals.js` | Constants: canvas size, colors, brick/paddle/ball dimensions, point values |
| `js/audio.js` | `Audio` stub object — empty sound methods |
| `js/mechanics.js` | `Mechanics` object — paddle-ball collision angle logic, brick collision handler |
| `js/game.js` | `GameScene` class + Phaser `Game` config |

**Load order in HTML:** Phaser CDN → visuals.js → audio.js → mechanics.js → game.js

---

### Task 1: HTML scaffold + empty JS file stubs

**Files:**
- Modify: `index.html`
- Modify: `js/visuals.js`
- Modify: `js/audio.js`
- Modify: `js/mechanics.js`
- Modify: `js/game.js`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Breakout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
  <script src="js/visuals.js"></script>
  <script src="js/audio.js"></script>
  <script src="js/mechanics.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write js/visuals.js stub** (full constants come in Task 3)

```javascript
// Game constants — populated in Task 3
```

- [ ] **Step 3: Write js/audio.js**

```javascript
const Audio = {
  init(scene) {},
  playPaddleHit() {},
  playBrickHit() {},
  playLose() {},
  playWin() {}
};
```

- [ ] **Step 4: Write js/mechanics.js stub**

```javascript
const Mechanics = {
  handlePaddleBallCollision(ball, paddle) {},
  handleBrickCollision(scene, ball, brick) {}
};
```

- [ ] **Step 5: Write js/game.js stub**

```javascript
// GameScene + Phaser config — populated in Task 2
```

- [ ] **Step 6: Open index.html in your browser**

Open the file directly (File → Open File, or drag it into the browser). Open the browser console (F12 → Console). Verify:
- No errors
- A Phaser banner log line is fine — it means Phaser loaded successfully

- [ ] **Step 7: Commit**

```bash
git add index.html js/visuals.js js/audio.js js/mechanics.js js/game.js
git commit -m "scaffold: add index.html and empty JS stubs"
```

---

### Task 2: Phaser config + blank GameScene

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Write game.js with Phaser config and empty scene**

```javascript
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {}

  create() {}

  update() {}
}

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  backgroundColor: '#111111',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [GameScene]
};

new Phaser.Game(config);
```

- [ ] **Step 2: Verify in browser**

Refresh. You should see a dark 480×640 canvas centered on the black page. No console errors.

- [ ] **Step 3: Commit**

```bash
git add js/game.js
git commit -m "feat: add Phaser config and blank GameScene"
```

---

### Task 3: Constants + texture generation

**Files:**
- Modify: `js/visuals.js`
- Modify: `js/game.js` (add preload method)

- [ ] **Step 1: Write all constants in js/visuals.js**

```javascript
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const COLORS = {
  paddle: 0xcccccc,
  ball: 0xffffff,
  brickRows: [0xe63946, 0xf4a261, 0xe9c46a, 0x2a9d8f, 0x264653]
};

// Points awarded per row hit, top to bottom
const BRICK_POINTS = [3, 3, 2, 2, 1];

const BRICK = {
  cols: 8,
  rows: 5,
  width: 54,
  height: 16,
  gap: 4,
  offsetTop: 80,
  offsetLeft: 10
};

const PADDLE = {
  width: 80,
  height: 12,
  startY: 600,
  speed: 400
};

const BALL = {
  size: 14,
  speed: 320
};
```

- [ ] **Step 2: Replace preload() in game.js to generate textures**

```javascript
preload() {
  const paddleGfx = this.make.graphics({ add: false });
  paddleGfx.fillStyle(COLORS.paddle);
  paddleGfx.fillRect(0, 0, PADDLE.width, PADDLE.height);
  paddleGfx.generateTexture('paddle', PADDLE.width, PADDLE.height);
  paddleGfx.destroy();

  const ballGfx = this.make.graphics({ add: false });
  ballGfx.fillStyle(COLORS.ball);
  ballGfx.fillRect(0, 0, BALL.size, BALL.size);
  ballGfx.generateTexture('ball', BALL.size, BALL.size);
  ballGfx.destroy();

  // White brick texture — tinted per row in create()
  const brickGfx = this.make.graphics({ add: false });
  brickGfx.fillStyle(0xffffff);
  brickGfx.fillRect(0, 0, BRICK.width, BRICK.height);
  brickGfx.generateTexture('brick', BRICK.width, BRICK.height);
  brickGfx.destroy();
}
```

- [ ] **Step 3: Verify in browser**

Refresh. Canvas is still dark — textures are generated in memory but nothing is placed yet. Zero console errors.

- [ ] **Step 4: Commit**

```bash
git add js/visuals.js js/game.js
git commit -m "feat: add game constants and generate Phaser textures in preload"
```

---

### Task 4: Paddle — creation + keyboard movement

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Replace create() and add helper methods**

```javascript
create() {
  this.score = 0;
  this.lives = 3;
  this.gameOver = false;
  this.ballResetting = false;

  this.createPaddle();
  this.setupInput();
}

createPaddle() {
  this.paddle = this.physics.add.image(CANVAS_WIDTH / 2, PADDLE.startY, 'paddle');
  this.paddle.setImmovable(true);
  this.paddle.body.allowGravity = false;
  this.paddle.setCollideWorldBounds(true);
}

setupInput() {
  this.cursors = this.input.keyboard.createCursorKeys();
  this.wasd = this.input.keyboard.addKeys({ left: 'A', right: 'D' });
}
```

- [ ] **Step 2: Replace update() and add movePaddle()**

```javascript
update() {
  this.movePaddle();
}

movePaddle() {
  const goLeft = this.cursors.left.isDown || this.wasd.left.isDown;
  const goRight = this.cursors.right.isDown || this.wasd.right.isDown;

  if (goLeft) {
    this.paddle.setVelocityX(-PADDLE.speed);
  } else if (goRight) {
    this.paddle.setVelocityX(PADDLE.speed);
  } else {
    this.paddle.setVelocityX(0);
  }
}
```

- [ ] **Step 3: Verify in browser**

Refresh. A gray paddle appears near the bottom. Arrow keys and A/D move it left and right. It stops at the canvas edges.

- [ ] **Step 4: Commit**

```bash
git add js/game.js
git commit -m "feat: add paddle with keyboard movement"
```

---

### Task 5: Ball — creation, physics, initial launch

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Add createBall() and launchBall() — call createBall() from create()**

Add `this.createBall();` at the end of `create()`. Add the methods:

```javascript
createBall() {
  this.ball = this.physics.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'ball');
  this.ball.setBounce(1, 1);
  this.ball.setCollideWorldBounds(true);
  // Disable collision on the bottom wall so the ball falls through
  this.physics.world.setBoundsCollision(true, true, true, false);
  this.launchBall();
}

launchBall() {
  const vx = (Math.random() < 0.5 ? 1 : -1) * BALL.speed * 0.5;
  this.ball.body.setVelocity(vx, -BALL.speed);
}
```

- [ ] **Step 2: Verify in browser**

Refresh. A white square (ball) moves diagonally, bouncing off the top wall and both side walls. When it reaches the bottom of the canvas, it disappears below. Paddle still moves with keys.

- [ ] **Step 3: Commit**

```bash
git add js/game.js
git commit -m "feat: add ball with arcade physics and initial launch"
```

---

### Task 6: Paddle-ball collision with angle + velocity influence

**Files:**
- Modify: `js/mechanics.js`
- Modify: `js/game.js` (add setupColliders)

- [ ] **Step 1: Write handlePaddleBallCollision in js/mechanics.js**

```javascript
const Mechanics = {
  handlePaddleBallCollision(ball, paddle) {
    // relativeHit: -1 = left edge, 0 = center, 1 = right edge
    const relativeHit = (ball.x - paddle.x) / (paddle.body.width / 2);
    const clamped = Phaser.Math.Clamp(relativeHit, -1, 1);

    // Map to angle: left edge → -150°, center → -90° (straight up), right edge → -30°
    const angle = -90 + clamped * 60;
    const radians = Phaser.Math.DegToRad(angle);

    // Blend in a fraction of paddle's current velocity for extra player control
    const paddleInfluence = paddle.body.velocity.x * 0.12;

    const vx = Math.cos(radians) * BALL.speed + paddleInfluence;
    const vy = Math.sin(radians) * BALL.speed;

    // Normalize to preserve ball speed after blending
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    ball.body.setVelocity(
      (vx / magnitude) * BALL.speed,
      (vy / magnitude) * BALL.speed
    );
  },

  handleBrickCollision(scene, ball, brick) {}
};
```

- [ ] **Step 2: Add setupColliders() method to GameScene and call it from create()**

Add `this.setupColliders();` at the end of `create()`. Add the method:

```javascript
setupColliders() {
  this.physics.add.collider(this.ball, this.paddle, () => {
    Mechanics.handlePaddleBallCollision(this.ball, this.paddle);
    Audio.playPaddleHit();
  });
}
```

- [ ] **Step 3: Verify in browser**

Refresh. When the ball hits the paddle:
- Hitting the left half sends it upper-left
- Hitting the right half sends it upper-right
- Hitting center sends it nearly straight up
- Moving the paddle sideways during a hit visibly nudges the ball angle

- [ ] **Step 4: Commit**

```bash
git add js/mechanics.js js/game.js
git commit -m "feat: paddle-ball collision with hit-position angle and velocity influence"
```

---

### Task 7: Brick grid

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Add createBricks() — call it from create() before createPaddle()**

Add `this.createBricks();` as the first call inside `create()`. Add the method:

```javascript
createBricks() {
  this.bricks = this.physics.add.staticGroup();

  for (let row = 0; row < BRICK.rows; row++) {
    for (let col = 0; col < BRICK.cols; col++) {
      const x = BRICK.offsetLeft + col * (BRICK.width + BRICK.gap) + BRICK.width / 2;
      const y = BRICK.offsetTop + row * (BRICK.height + BRICK.gap) + BRICK.height / 2;

      const brick = this.bricks.create(x, y, 'brick');
      brick.setTint(COLORS.brickRows[row]);
      brick.setData('row', row);
      brick.refreshBody();
    }
  }
}
```

- [ ] **Step 2: Verify in browser**

Refresh. You should see 5 rows of 8 bricks near the top:
- Row 1 (top): red
- Row 2: orange
- Row 3: yellow
- Row 4: teal-green
- Row 5: dark teal

Paddle and ball still work. Ball passes through bricks (collision not wired up yet).

- [ ] **Step 3: Commit**

```bash
git add js/game.js
git commit -m "feat: add 8x5 colored brick grid"
```

---

### Task 8: HUD — score and lives display

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Add createHUD() — call it from create() after createBricks()**

Add `this.createHUD();` after `this.createBricks();` in `create()`. Add the method and a stub for showOverlay (filled in Task 11):

```javascript
createHUD() {
  const style = { fontSize: '16px', color: '#ffffff', fontFamily: 'monospace' };
  this.scoreText = this.add.text(10, 10, 'Score: 0', style);
  this.livesText = this.add.text(CANVAS_WIDTH - 10, 10, 'Lives: 3', style).setOrigin(1, 0);
}

addScore(points) {
  this.score += points;
  this.scoreText.setText(`Score: ${this.score}`);
}

showOverlay(title, titleColor) {
  // Stub — replaced in Task 11
  this.ball.body.setVelocity(0, 0);
  console.log(`Game ended: ${title} | Final score: ${this.score}`);
}
```

- [ ] **Step 2: Verify in browser**

Refresh. "Score: 0" appears in the top-left. "Lives: 3" appears in the top-right. Everything else still works.

- [ ] **Step 3: Commit**

```bash
git add js/game.js
git commit -m "feat: add score and lives HUD"
```

---

### Task 9: Ball-brick collision + scoring + win check

**Files:**
- Modify: `js/mechanics.js`
- Modify: `js/game.js`

- [ ] **Step 1: Write handleBrickCollision in js/mechanics.js**

Replace the stub body of `handleBrickCollision`:

```javascript
const Mechanics = {
  handlePaddleBallCollision(ball, paddle) {
    const relativeHit = (ball.x - paddle.x) / (paddle.body.width / 2);
    const clamped = Phaser.Math.Clamp(relativeHit, -1, 1);
    const angle = -90 + clamped * 60;
    const radians = Phaser.Math.DegToRad(angle);
    const paddleInfluence = paddle.body.velocity.x * 0.12;
    ball.body.setVelocity(
      Math.cos(radians) * BALL.speed + paddleInfluence,
      Math.sin(radians) * BALL.speed
    );
  },

  handleBrickCollision(scene, ball, brick) {
    brick.disableBody(true, true);
    const row = brick.getData('row');
    scene.addScore(BRICK_POINTS[row]);
    Audio.playBrickHit();
    scene.checkWin();
  }
};
```

- [ ] **Step 2: Add brick collider and checkWin() to GameScene**

Update `setupColliders()` to add the brick collider:

```javascript
setupColliders() {
  this.physics.add.collider(this.ball, this.paddle, () => {
    Mechanics.handlePaddleBallCollision(this.ball, this.paddle);
    Audio.playPaddleHit();
  });

  this.physics.add.collider(this.ball, this.bricks, (ball, brick) => {
    Mechanics.handleBrickCollision(this, ball, brick);
  });
}
```

Add `checkWin()` to `GameScene`:

```javascript
checkWin() {
  if (this.bricks.countActive(true) === 0) {
    this.gameOver = true;
    Audio.playWin();
    this.showOverlay('YOU WIN!', '#2ecc71');
  }
}
```

- [ ] **Step 3: Verify in browser**

Refresh. When the ball hits a brick:
- Brick disappears
- Score increases: red/orange bricks = +3, yellow/teal = +2, dark teal = +1

To test win: temporarily set `rows: 1` in the `BRICK` constant in visuals.js, clear all 8 bricks — the console should log "Game ended: YOU WIN!". Restore `rows: 5` after.

- [ ] **Step 4: Commit**

```bash
git add js/mechanics.js js/game.js
git commit -m "feat: ball-brick collision with scoring and win condition"
```

---

### Task 10: Life system — ball falls, reset, game over

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Add loseLife() to GameScene**

```javascript
loseLife() {
  this.ballResetting = true;
  this.lives--;
  this.livesText.setText(`Lives: ${this.lives}`);

  if (this.lives <= 0) {
    this.gameOver = true;
    this.ball.setVisible(false);
    Audio.playLose();
    this.showOverlay('GAME OVER', '#e63946');
    return;
  }

  this.ball.setPosition(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  this.ball.body.setVelocity(0, 0);

  this.time.delayedCall(1000, () => {
    this.launchBall();
    this.ballResetting = false;
  });
}
```

- [ ] **Step 2: Add ball-fell detection to update()**

Replace `update()`:

```javascript
update() {
  this.movePaddle();

  if (!this.gameOver && !this.ballResetting && this.ball.y > CANVAS_HEIGHT + 20) {
    this.loseLife();
  }
}
```

- [ ] **Step 3: Verify in browser**

Refresh. Let the ball fall:
- Lives counter decreases from 3 → 2 → 1
- Ball reappears at center and relaunches ~1 second later
- After 3 falls, the ball hides and console logs "Game ended: GAME OVER"

- [ ] **Step 4: Commit**

```bash
git add js/game.js
git commit -m "feat: life system with ball reset and game over detection"
```

---

### Task 11: Game over / win overlay + Play Again button

**Files:**
- Modify: `js/game.js`

- [ ] **Step 1: Replace the showOverlay() stub with the real implementation**

```javascript
showOverlay(title, titleColor) {
  this.add.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000, 0.75);

  this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 70, title, {
    fontSize: '52px',
    color: titleColor,
    fontFamily: 'monospace',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, `Score: ${this.score}`, {
    fontSize: '28px',
    color: '#ffffff',
    fontFamily: 'monospace'
  }).setOrigin(0.5);

  const button = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70, '[ Play Again ]', {
    fontSize: '24px',
    color: '#ffffff',
    fontFamily: 'monospace'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });

  button.on('pointerover', () => button.setStyle({ color: '#f4a261' }));
  button.on('pointerout', () => button.setStyle({ color: '#ffffff' }));
  button.on('pointerup', () => this.scene.restart());
}
```

- [ ] **Step 2: Verify game over flow**

Refresh. Let the ball fall 3 times:
- Dark overlay appears
- "GAME OVER" in red
- Final score shown
- "[ Play Again ]" turns orange on hover, restarts cleanly on click (score 0, lives 3, all bricks back)

- [ ] **Step 3: Verify win flow**

Temporarily set `rows: 1` in visuals.js. Clear all 8 bricks:
- "YOU WIN!" in green
- Final score shown
- Play Again restarts cleanly

Restore `rows: 5`.

- [ ] **Step 4: Commit**

```bash
git add js/game.js
git commit -m "feat: game over/win overlay with Play Again button"
```

---

### Task 12: Audio stubs — verify no errors

**Files:** `js/audio.js` (already complete from Task 1)

The `Audio` object is called throughout the game (`playPaddleHit`, `playBrickHit`, `playLose`, `playWin`). The stub from Task 1 handles all of these with empty functions.

- [ ] **Step 1: Verify zero audio errors in browser console**

Open a full game in browser. Open console (F12). Play through to a game over AND a win. The console should show zero errors related to `Audio`.

- [ ] **Step 2: Commit**

```bash
git commit --allow-empty -m "note: audio.js stubs verified — sound effects deferred to next phase"
```

---

## Final Verification Checklist

- [ ] Play a full game to **game over**: ball falls 3 times → "GAME OVER" overlay appears → Play Again restarts cleanly
- [ ] Play a full game to **win**: clear all 40 bricks → "YOU WIN!" overlay appears → Play Again restarts cleanly
- [ ] Confirm after restart: score = 0, lives = 3, all 40 bricks present
- [ ] Browser console: **zero errors** throughout both flows
- [ ] Confirm paddle-velocity influence: hit the ball while the paddle is moving sideways — the ball should angle noticeably in that direction

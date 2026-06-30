class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    const paddleGfx = this.make.graphics({ add: false });
    paddleGfx.fillStyle(COLORS.paddle);
    paddleGfx.fillRect(0, 0, PADDLE.width, PADDLE.height);
    paddleGfx.generateTexture('paddle', PADDLE.width, PADDLE.height);
    paddleGfx.destroy();

    const ballGfx = this.make.graphics({ add: false });
    ballGfx.fillStyle(COLORS.ball);
    ballGfx.fillCircle(BALL.size / 2, BALL.size / 2, BALL.size / 2);
    ballGfx.generateTexture('ball', BALL.size, BALL.size);
    ballGfx.destroy();

    // White brick texture — tinted per row in create()
    const brickGfx = this.make.graphics({ add: false });
    brickGfx.fillStyle(0xffffff);
    brickGfx.fillRect(0, 0, BRICK.width, BRICK.height);
    brickGfx.generateTexture('brick', BRICK.width, BRICK.height);
    brickGfx.destroy();
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.ballResetting = false;

    this.createBorder();
    this.createBricks();
    this.createHUD();
    this.createPaddle();
    this.setupInput();
    this.createBall();
    this.setupColliders();
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

  createBorder() {
    const g = this.add.graphics();
    g.lineStyle(2, COLORS.border, 1);
    g.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);
  }

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

  update() {
    this.movePaddle();

    if (!this.gameOver && !this.ballResetting && this.ball.y > CANVAS_HEIGHT + 20) {
      this.loseLife();
    }
  }

  setupColliders() {
    this.physics.add.collider(this.ball, this.paddle, () => {
      Mechanics.handlePaddleBallCollision(this.ball, this.paddle);
      Audio.playPaddleHit();
    });

    this.physics.add.collider(this.ball, this.bricks, (ball, brick) => {
      Mechanics.handleBrickCollision(this, ball, brick);
    });
  }

  checkWin() {
    if (this.bricks.countActive(true) === 0) {
      this.gameOver = true;
      Audio.playWin();
      this.showOverlay('YOU WIN!', '#2ecc71');
    }
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

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

  create() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.ballResetting = false;

    this.createPaddle();
    this.setupInput();
    this.createBall();
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

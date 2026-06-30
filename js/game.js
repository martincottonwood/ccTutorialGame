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

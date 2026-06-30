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

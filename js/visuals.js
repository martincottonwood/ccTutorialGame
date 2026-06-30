const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const COLORS = {
  paddle: 0xcccccc,
  ball: 0xffffff,
  border: 0x4488cc,
  brickRows: [0xe63946, 0xf4a261, 0xe9c46a, 0x27ae60, 0x264653]
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

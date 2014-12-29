

var WIDTH = 256;
var HEIGHT = 192;
var ZOOM = 3;
var width = WIDTH * ZOOM;
var height = HEIGHT * ZOOM;

var controller = require('./controller');
var keyboard = require('./keyboard');

var pad = controller({
  'left': 'button',
  'right': 'button',
  'jump': 'button',
  'start': 'button'
});

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

ctx.save();
ctx.scale(ZOOM, ZOOM);

ctx.fillRect(0,176,WIDTH,1);
ctx.fillStyle = '#503000';
ctx.fillRect(0,177,WIDTH,64);


var c = [1, 2, 3, 2];

var keys = keyboard();

var pos = 0;
var walk = 0;
var dir = 0;
var jump = 0;
var walking = false;
var x = 128;
var y = 0;
var vx = 0;
var vy = 0;
var limit = 2;
var thud = 0;
var changed = false;

var chars = [
  {
    row: 0,
    lspeed: 3,
    aspeed: 3,
    djump: false,
    jump: 8
  },
  {
    row: 1,
    lspeed: 3,
    aspeed: 3,
    djump: true,
    jump: 6
  },
  {
    row: 2,
    lspeed: 2,
    aspeed: 3,
    djump: true,
    jump: 6
  },
  {
    row: 3,
    lspeed: 2,
    aspeed: 3,
    djump: false,
    jump: 7
  }
];

var charid = 0;
var char = chars[0];
var debounceChar = false;

var i = new Image();
i.onload = function () {
  function draw() {
    p = dir * 4 + pos;
    ctx.fillStyle = '#a4e4fc';
    ctx.fillRect(0, 0, WIDTH, HEIGHT-16);
    ctx.drawImage(i, p * 16, 32 + char.row * 32, 16, 32, x, (144-y), 16, 32);
    requestAnimationFrame(draw, 150);
  }
  draw();
  var start = Date.now();
  var frame = 0;
  var t;

  function game() {
    t = Date.now() - start;
    var g = t / 16;
    var num = 0;
    while(frame < g) {
      frame++;
      num++;
      tick();
    }
    setTimeout(game, 10);
  }

  var djump = true;

  function tick() {
    pad.poll();
    if ((keys.right && !keys.left) || (pad.check('right') && !pad.check('left'))) {
      dir = 0;
      vx += 1;
    }
    if (keys.left && !keys.right || (pad.check('left') && !pad.check('right'))) {
      dir = 1;
      vx -= 1;
    }
    if (keys.char && !debounceChar && y === 0) {
      charid = (charid + 1) % chars.length;
      char = chars[charid];
      vy = 2;
    }
    debounceChar = keys.char;
    limit = char.lspeed;
    if (y > 0) {
      limit = char.aspeed;
    }
    if (vx > limit) {
      vx = limit;
    }
    if (vx < -limit) {
      vx = -limit;
    }
    if (!(keys.right ^ keys.left) && !(pad.check('right') ^ pad.check('left'))) {
      vx = 0;
    }
    x = x + vx;
    if (x < 0) {
      x = 0;
    }
    if (x > WIDTH - 16) {
      x = WIDTH - 16;
    }
    y = y + Math.round(vy);
    if (y > 0) {
      vy = vy - 0.5;
    } else {
      djump = true;
      if (y <= 0 && vy < 0) {
        thud = 2;
      }
      vy = 0;
      y = 0;
    }
    if (thud > 0) {
      thud--;
    }
    if ((keys.up || pad.check('jump')) && y === 0 && thud === 0) {
      vy = char.jump;
    }
    if (char.djump && (keys.up || pad.check('jump')) && y > 0 && vy < 0 && djump) {
      djump = false;
      vy = char.jump;
    }
    if (y > 0) {
      pos = 1;
    } else {
      if (vx) {
        pos = c[(t / 100 | 0) % 4];
      } else {
        pos = 0;
      }
    }
  }
  game();
};
i.src = './art.png';

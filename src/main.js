

var WIDTH = 256;
var HEIGHT = 192;
var ZOOM = 3;
var width = WIDTH * ZOOM;
var height = HEIGHT * ZOOM;

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var c = [1, 2, 3, 2];

var keys = {};
window.addEventListener('keydown', function (e) {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', function (e) {
  keys[e.key.toLowerCase()] = false;
});

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

var i = new Image();
i.onload = function () {
  function draw() {
    p = dir * 4 + pos;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(i, p * 16, 32, 16, 32, x*ZOOM, (160-y)*ZOOM, 16*ZOOM, 32*ZOOM);
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
  function tick() {
    if (keys.right && !keys.left) {
      dir = 0;
      vx += 1;
    }
    if (keys.left && !keys.right) {
      dir = 1;
      vx -= 1;
    }
    if (y > 0) {
      limit = 2;
    }
    if (vx > limit) {
      vx = limit;
    }
    if (vx < -limit) {
      vx = -limit;
    }
    if (!(keys.right ^ keys.left)) {
      vx = 0;
    }
    x = x + vx;
    if (x < 0) {
      x = 0;
    }
    if (x > WIDTH - 16) {
      x = WIDTH - 16;
    }
    y = Math.round(y + vy);
    if (y > 0) {
      vy = vy - 0.5;
    } else {
      if (y <= 0 && vy < 0) {
        thud = 2;
      }
      vy = 0;
      y = 0;
    }
    if (thud > 0) {
      thud--;
    }
    if (keys.up && y === 0 && thud === 0) {
      vy = 8;
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

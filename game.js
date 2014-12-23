(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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

ctx.save();
ctx.scale(ZOOM, ZOOM);

ctx.fillRect(0,176,WIDTH,1);
ctx.fillStyle = '#503000';
ctx.fillRect(0,177,WIDTH,64);


var c = [1, 2, 3, 2];

var specialKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

var keys = {};
window.addEventListener('keydown', function (e) {
  if (e.keyCode in specialKeys) {
    keys[specialKeys[e.keyCode]] = true;
  }
});
window.addEventListener('keyup', function (e) {
  if (e.keyCode in specialKeys) {
    keys[specialKeys[e.keyCode]] = false;
  }
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

var char = {
  lspeed: 2,
  aspeed: 3,
  djump: true,
  jump: 8
};


var i = new Image();
i.onload = function () {
  function draw() {
    p = dir * 4 + pos;
    ctx.fillStyle = '#a4e4fc';
    ctx.fillRect(0, 0, WIDTH, HEIGHT-16);
    ctx.drawImage(i, p * 16, 32, 16, 32, x, (144-y), 16, 32);
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
    if (keys.right && !keys.left) {
      dir = 0;
      vx += 1;
    }
    if (keys.left && !keys.right) {
      dir = 1;
      vx -= 1;
    }
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
    if (keys.up && y === 0 && thud === 0) {
      vy = char.jump;
    }
    if (char.djump && keys.up && y > 0 && vy < -5 && djump) {
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

},{}]},{},[1]);


var specialKeys = {
  27: 'esc',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'char'
};

function keyboard(el) {
  if (!el) {
    el = window;
  }
  var keys = {};
  el.addEventListener('keydown', function (e) {
    if (e.keyCode in specialKeys) {
      keys[specialKeys[e.keyCode]] = true;
    }
  });
  el.addEventListener('keyup', function (e) {
    if (e.keyCode in specialKeys) {
      keys[specialKeys[e.keyCode]] = false;
    }
  });
  return keys;
}

module.exports = keyboard;

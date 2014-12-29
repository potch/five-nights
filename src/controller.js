
var mappings = localStorage.getItem('controller-mappings');
if (!mappings) {
  mappings = {};
}

var config = document.createElement('div');
config.style = "display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #666; color: #fff; border-radius: 1em; padding: 1em; font-family: sans-serif";


function prompt() {

}

var map = {
  'jump': 14,
  'left': 7,
  'right': 5
};

function setup(pad, map, el) {
  el.appendChild(config);
  var controls = Object.keys[map];
  config.style.display = block;
  config.innerHTML = 'New Controller: ' + pad.id;
}

function controller(_, opts) {
  opts = opts || {};
  var el = opts.el || window;

  var pad;

  function poll() {
    var pads = navigator.getGamepads();
    pad = pads[0];
  }

  function check(name) {
    if (pad) {
      return map[name] && pad.buttons[map[name]] && pad.buttons[map[name]].pressed;
    }
    return false;
  }

  return {
    check: check,
    poll: poll
  };
}

module.exports = controller;

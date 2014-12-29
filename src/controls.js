function controls(map, opts) {
  opts = opts || {};
  if ('keyboard' in opts) {
    kb = opts.keyboard;
  } else {
    kb = true;
  }

  if ('gamepad' in opts) {
    kb = opts.gamepad;
  } else {
    gamepad = true;
  }

  var ctrls = {};
  map.forEach(function control() {

  });

  return {
    poll: poll,
    pressed: pressed
  };
}

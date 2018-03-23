var smartHomeStatus = {
  hue: {
    light_1: false
  }
}

$('#hue-light').click(function() {
  socket.emit('hue:light_1');
  var html = $('#hue-light .status p');
  if (smartHomeStatus.hue.light_1) {
    html.text('0%');
  } else {
    html.text('100%');
  }
  smartHomeStatus.hue.light_1 = !smartHomeStatus.hue.light_1;
});

socket.on('status', function(info) {
  updateHue(info.hue);
})

function updateHue(obj) {
  var html = $('#hue-light .status p');
  // If light is on then for now set to 100%, later specify
  if (obj.light_1 && !smartHomeStatus.hue.light_1) {
    smartHomeStatus.hue.light_1 = true;
    html.text('100%');
  } else if (!obj.light_1 && smartHomeStatus.hue.light_1) {
    smartHomeStatus.hue.light_1 = false;
    html.text('0%');
  }
}

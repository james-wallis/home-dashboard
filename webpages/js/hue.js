var smartHomeStatus = {
  hue: {
    light_1: false
  }
}

function hueWidget() {

  var s = document.createElement('div');
  s.id = 'hue-widget';
  s.className = 'widget';

  var p = document.createElement('p');
  p.innerHTML = 'Hue';
  s.appendChild(p);

  var d = document.createElement('div');
  d.className = 'status';

  p = document.createElement('p');
  p.className = 'hue-widget hue-light-percentage';
  p.innerHTML = name;
  d.appendChild(p);

  s.appendChild(d);

  return s;
}


$('#hue-widget').click(function() {
  socket.emit('hue:light_1');
  var html = $('#hue-widget .status p');
  if (smartHomeStatus.hue.light_1) {
    html.text('0%');
  } else {
    html.text('100%');
  }
  smartHomeStatus.hue.light_1 = !smartHomeStatus.hue.light_1;
});

function updateHue(obj) {
  var html = $('#hue-widget .status p');
  // If light is on then for now set to 100%, later specify
  if (obj.light_1 && !smartHomeStatus.hue.light_1) {
    smartHomeStatus.hue.light_1 = true;
    html.text('100%');
  } else if (!obj.light_1 && smartHomeStatus.hue.light_1) {
    smartHomeStatus.hue.light_1 = false;
    html.text('0%');
  }
}

function hueDashboard() {

}

var maxLight = 254;

// Event listeners
$('body').on('click touchstart','#hue-light', function(e){
  console.log('light');
  socket.emit('hue-light-toggle');
});

$('body').on('click touchstart','#hue-lamps', function(e){
  console.log('lamps');
  socket.emit('hue-lamps-toggle');
});

function hueLightWidget() {
  var s = document.createElement('div');
  s.id = 'hue-light';
  s.className = 'widget hue-widget';

  var p = document.createElement('p');
  p.innerHTML = 'Hue light';
  s.appendChild(p);

  var r = document.createElement('div');
  r.className = 'row';

  var d = document.createElement('div');
  d.className = 'col-sm-12';

  h = document.createElement('h3');
  h.className = 'hue-widget';
  h.innerHTML = 'Bedroom';
  d.appendChild(h);

  p = document.createElement('p');
  p.className = 'hue-light-state';
  d.appendChild(p);

  p = document.createElement('p');
  p.className = 'hue-light-percentage';
  d.appendChild(p);
  r.appendChild(d);

  s.appendChild(r);
  return s;
}

function hueLampWidget() {
  var s = document.createElement('div');
  s.id = 'hue-lamp';
  s.className = 'widget hue-widget';

  var p = document.createElement('p');
  p.innerHTML = 'Hue lamp';
  s.appendChild(p);

  var d = document.createElement('div');
  d.className = 'state';

  p = document.createElement('p');
  p.className = 'hue-widget hue-light-percentage';
  p.innerHTML = name;
  d.appendChild(p);
  s.appendChild(d);
  return s;

}

function hueDoubleLampWidget() {
  var s = document.createElement('div');
  s.id = 'hue-lamps';
  s.className = 'widget hue-widget';

  var p = document.createElement('p');
  p.innerHTML = 'Hue lamps';
  s.appendChild(p);

  var r = document.createElement('div');
  r.className = 'row';

  for (var i = 0; i < 2; i++) {
    var d = document.createElement('div');
    d.className = 'col-sm-6';

    h = document.createElement('h3');
    h.className = 'hue-widget';
    h.innerHTML = 'Left';
    if (i==1) h.innerHTML = 'Right';
    d.appendChild(h);

    p = document.createElement('p');
    p.className = 'hue-left-lamp-state';
    if (i==1) p.className = 'hue-right-lamp-state';
    d.appendChild(p);

    p = document.createElement('p');
    p.className = 'hue-left-lamp-percentage';
    if (i==1) p.className = 'hue-right-lamp-percentage';
    d.appendChild(p);
    r.appendChild(d);
  }
  s.appendChild(r);
  return s;

}



function updateHue(obj) {
  var percentage;
  // Update light
  var light = obj.lights['Light'];
  percentage = 100*(light.state.bri/maxLight);
  if (light.state.on) {
    $('.hue-light-state').text('On');
  } else {
    $('.hue-light-state').text('Off');
  }
  percentage = 100*(light.state.bri/maxLight);
  $('.hue-light-percentage').text(Math.round(percentage) + '%');

  // Update Left lamp
  var leftLamp = obj.lamps['Left lamp'];
  percentage = 100*(leftLamp.state.bri/maxLight);
  if (leftLamp.state.on) {
    $('.hue-left-lamp-state').text('On');
  } else {
    $('.hue-left-lamp-state').text('Off');
  }
  percentage = 100*(leftLamp.state.bri/maxLight);
  $('.hue-left-lamp-percentage').text(Math.round(percentage) + '%');

  // Update Right lamp
  var rightLamp = obj.lamps['Right lamp'];
  if (rightLamp.state.on) {
    $('.hue-right-lamp-state').text('On');
  } else {
    $('.hue-right-lamp-state').text('Off');
  }
  percentage = 100*(rightLamp.state.bri/maxLight);
  $('.hue-right-lamp-percentage').text(Math.round(percentage) + '%');




}

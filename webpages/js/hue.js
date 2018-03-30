var maxLight = 254;
var brightness = {
  light: 0,
  lamps: {
    left: 0,
    right: 0
  }
}

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

  brightness.light = light.state.bri;
  brightness.lamps.left = leftLamp.state.bri;
  brightness.lamps.right = rightLamp.state.bri;

}

function hue() {
  $('h1').text('Hue');
  $('h2').text('Smart lights');
  $('#hue').show();
  $('#hue-button').addClass('active');
  var hueHeight = $(window).height() - ($('header').height() + $('header').offset().top + $('footer').height());
  $('#hue').height(hueHeight + 'px');
  var html = '<div class="row">';
  html += '<div class="col-sm-6">';
  html += '<div class="hue-height">'
  html += '<div class="col-sm-12"><h3>Bedroom Light</h3></div>'
  html += '<div class="col-sm-12"><p class="hue-light-state"></p></div>'
  html += '<div class="col-sm-12"><p class="hue-light-percentage"></p></div>'
  html += '</div>';
  html += '<div class="col-sm-12"><div class="hue-light-slider"></div></div>'
  html += '</div>';
  html += '<div class="col-sm-6">';
  html += '<div class="hue-height">'
  html += '<div class="col-sm-12"><h3>Bedroom Lamps</h3></div>';
  html += '<div class="col-sm-12"><div class="col-sm-6 hue-lamp"><p>Left</p></div><div class="col-sm-6 hue-lamp"><p>Right</p></div></div>'
  html += '<div class="col-sm-12"><div class="col-sm-6 hue-lamp"><p class="hue-left-lamp-state"></p></div><div class="col-sm-6 hue-lamp"><p class="hue-right-lamp-state"></p></div></div>'
  html += '<div class="col-sm-12"><div class="col-sm-6 hue-lamp"><p class="hue-left-lamp-percentage"></p></div><div class="col-sm-6 hue-lamp"><p class="hue-right-lamp-percentage"></p></div></div>'
  html += '</div>';
  html += '<div class="col-sm-12"><div class="hue-lamp-slider"></div></div>'
  html += '</div>';
  // html += '<div class="col-sm-4">';
  // html += '</div>';
  html += '</div>';
  // var input = '<input class="hue-brightness" type="range" min="0" max="100" value="50">';
  $('#hue').html(html);
  noUiSlider.create($('.hue-light-slider')[0], {
  	start: 0, // 4 handles, starting at...
  	orientation: 'vertical', // Orient the slider vertically
  	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
  	step: 5,
    direction: 'rtl',
  	range: {
  		'min': 0,
  		'max': 100
  	},
    pips: { mode: 'count', values: 5, density: 5 }
  });
  $('.hue-light-slider')[0].noUiSlider.on('slide', function(value){
  	// convert percentage to value out of 254
    value = value * 2.54;
    socket.emit('hue-light-value', value);
  });

  noUiSlider.create($('.hue-lamp-slider')[0], {
  	start: 0, // 4 handles, starting at...
  	orientation: 'vertical', // Orient the slider vertically
  	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
  	step: 5,
    direction: 'rtl',
  	range: {
  		'min': 0,
  		'max': 100
  	},
    pips: { mode: 'count', values: 5, density: 5 }
  });
  $('.hue-lamp-slider')[0].noUiSlider.on('slide', function(value){
  	// convert percentage to value out of 254
    value = value * 2.54;
    socket.emit('hue-lamps-value', value);
  });

  $('.hue-light-slider')[0].noUiSlider.set(brightness.light);
  if (brightness.lamps.left > brightness.lamps.right) {
    $('.hue-lamp-slider')[0].noUiSlider.set(brightness.lamps.left - (brightness.lamps.left - brightness.lamps.right));
  } else {
    $('.hue-lamp-slider')[0].noUiSlider.set(brightness.lamps.right - (brightness.lamps.right - brightness.lamps.left));
  }


}

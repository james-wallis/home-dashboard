var onlongtouch;
var timer;
var timeout;
var emitted = false;
var lockTimer = false;
var touchduration = 800; // length of time for long touch
var notified = false;



// Event Listeners
$('body').on('touchstart','#timer', function(e){
  e.preventDefault();
  if (lockTimer){
		return;
	} else {
    timeout = setTimeout(function() {
      socket.emit('timer-reset');
      $('.timer-time').text(timesToString(0, 0));
      emitted = true;
    }, touchduration);
  	lockTimer = true;
  }
});

$('body').on('touchend','#timer', function(e){
  if (timeout) {
    clearTimeout(timeout);
    lockTimer = false;
    if (!emitted) {
      socket.emit('timer-increase');
      emitted = false;
    } else {
      emitted = false;
    }
  }
});

$('body').on('click touchstart','#overlay',function(e){
  $('#overlay').css('margin-top', '-35vh');
  socket.emit('timer-notified')
});

function timerWidget() {
  var s = document.createElement('div');
  s.id = 'timer';
  s.className = 'widget timer-widget';

  var p = document.createElement('p');
  p.innerHTML = 'Timer';
  s.appendChild(p);

  var r = document.createElement('div');
  r.id = 'timer-content';
  r.className = 'row';

  var d = document.createElement('div');
  d.className = 'col-sm-12';

  p = document.createElement('p');
  p.className = 'timer-time';
  p.innerHTML = timesToString(0, 0);

  d.appendChild(p);
  r.appendChild(d);
  s.appendChild(r);
  return s;

}


function updateTimer(info) {
  // console.log(info);
  if (!info.done) {
    minutes = Math.floor(info.time / 60);
    seconds = info.time - minutes * 60;
    // console.log(minutes, seconds);
    $('.timer-time').text(timesToString(minutes, seconds));
    $('#overlay').css('margin-top', '-35vh');
    notified = false;
  } else if (info.done && !notified) {
    $('#overlay').css('margin-top', '0');
    // $('#overlay').css('transition', 'all 200ms')
    $('.timer-time').text(timesToString(0, 0));
    notified = true;
  } else {
    $('.timer-time').text(timesToString(0, 0));
  }
}

function timesToString(m, s) {
  var time = '';
  if (m < 10) {
    time += '0'+m;
  } else {
    time += m;
  }
  time += ':';
  if (s < 10) {
    time += '0'+s;
  } else {
    time += s;
  }
  return time;
}

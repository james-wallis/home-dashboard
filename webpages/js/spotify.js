var authenticated = false;
var auth_url;
var nowPlaying = null;
var playing = false;
var repeatStates = ['off', 'context', 'track'];
var repeat = 0;
var shuffle = false;
var spotifyGreen = '#1ed760';
var playingTimeout = 2;
var volumeTimeout = 1;
var repeatTimeout = 1;
var shuffleTimeout = 1;

// Event listeners
$('body').on('click touchstart','#spotify-next',function(e){
  socket.emit('spotify-next');
});

$('body').on('click touchstart','#spotify-previous',function(e){
  socket.emit('spotify-previous');
});

$('body').on('click touchstart','#spotify-play-pause', function(e) {
  playing = !playing;
  socket.emit('spotify-play-pause', playing);
  playingTimeout = 2;
  updatePlaying();
});

function updatePlaying() {
  if (playing) {
    $('#spotify-play-pause #play-icon').hide();
    $('#spotify-play-pause #pause-icon').show();
  } else {
    $('#spotify-play-pause #pause-icon').hide();
    $('#spotify-play-pause #play-icon').show();
  }
}

$('body').on('click touchstart','#spotify-repeat', function(e) {
  repeat++;
  var noRepeat = repeatStates.length;
  if (repeat == noRepeat) repeat = 0;
  socket.emit('spotify-repeat', repeatStates[repeat]);
  repeatTimeout = 2;
  updateRepeat();
});
function updateRepeat(){
  var m = $('#repeat-fa');
  var s = $('#repeat-fa-single');
  if (repeat == 0) {
    $('#spotify-repeat svg').css('color', '');
    s.hide();
    m.show();
  } else if (repeat == 1) {
    $('#spotify-repeat svg').css('color', spotifyGreen);
    s.hide();
    m.show();
  } else if (repeat == 2) {
    $('#spotify-repeat svg').css('color', spotifyGreen);
    m.hide();
    s.show();
  }
};

$('body').on('click touchstart','#spotify-shuffle', function(e) {
  shuffle = !shuffle;
  socket.emit('spotify-shuffle', shuffle);
  shuffleTimeout = 2;
  updateShuffle();
});
function updateShuffle() {
  if (shuffle) {
    $('#spotify-shuffle svg').css('color', spotifyGreen);
  } else {
    $('#spotify-shuffle svg').css('color', '');
  }
};

$('body').on('change click touchstart', '#spotify-volume', function(e) {
  socket.emit('spotify-volume', this.value);
  updateVolume(this.value);
  volumeTimeout = 2;
});
function updateVolume(vol) {
  $('#spotify-volume').val(vol);
}

function spotifyWidget() {
  var name = '';
  var artists = '';
  if (nowPlaying) {
    name = nowPlaying.name;
    artists = concatArtists(nowPlaying);
  }

  var s = document.createElement('div');
  s.id = 'spotify-widget';
  s.className = 'widget';

  var p = document.createElement('p');
  p.innerHTML = 'Spotify';
  s.appendChild(p);

  var d = document.createElement('div');
  d.className = 'status';

  p = document.createElement('p');
  p.className = 'spotify-widget spotify-now-playing-name';
  p.innerHTML = name;
  d.appendChild(p);

  p = document.createElement('p');
  p.className = 'spotify-widget spotify-now-playing-artists';
  p.innerHTML = artists;
  d.appendChild(p);

  s.appendChild(d);

  return s;
}

function spotify() {
  $('h1').text('Spotify');
  $('h2').text('Music player');
  $('#spotify').show();
  $('#spotify-button').addClass('active');
  $('#spotify').html('');
  if (!authenticated) {
    var a = document.createElement('a');
    a.setAttribute('href', auth_url);
    a.innerHTML = 'Click here to authenticate with Spotify.';
    document.getElementById('spotify').appendChild(a);
  } else {
    var r = document.createElement('div');
    r.className = 'row';

    var c = document.createElement('div');
    c.className = 'col-sm-12';

    var h = document.createElement('h3');
    h.innerHTML = 'Available devices';

    c.appendChild(h);
    r.appendChild(c);
    document.getElementById('spotify').appendChild(r);

    r = document.createElement('div');
    r.className = 'row';
    r.id = 'spotify-device-container';


    document.getElementById('spotify').appendChild(r);
  }
}

function updateSpotify(info) {
  if (info && (Object.keys(info).length > 0) && info.now_playing && info.player_info) {
    nowPlaying = info.now_playing;
    playerInfo = info.player_info;
    // console.log(playerInfo);
    $('.spotify-now-playing-name').text(nowPlaying.name);
    var artists = concatArtists(nowPlaying);
    $('.spotify-now-playing-artists').text(artists);
    $('.spotify-now-playing-image').attr('src', nowPlaying.images[0].url);
    $('.spotify-now-playing-placeholder').hide();
    $('.spotify-now-playing-image').show();
    if (nowPlaying.playing != playing && playingTimeout <= 0) {
      playing = nowPlaying.playing;
      updatePlaying();
    }
    if (playerInfo.repeat != repeat && repeatTimeout <=0) {
      var index = repeatStates.indexOf(playerInfo.repeat);
      repeat = index;
      updateRepeat();
    }
    if (playerInfo.shuffle != shuffle && shuffleTimeout <= 0) {
      shuffle = playerInfo.shuffle;
    }
    if (volumeTimeout <= 0) {
      updateVolume(playerInfo.volume);
    }
    updateShuffle();
    playingTimeout--;
    repeatTimeout--;
    shuffleTimeout--;
    volumeTimeout--;

    if (info.devices) {
      updateDevices(info.devices);
    }

  }

};

function updateDevices(info) {
  var cont = document.getElementById('spotify-device-container');
  if (info && info.length > 0 && cont) {
    console.log(info);
    var info = info.sort(compare);
    console.log(info);
    cont.innerHTML = '';
    for (var i = 0; i < info.length; i++) {
      var device = info[i];
      var col = document.createElement('div');
      col.className = 'col-sm spotify-device';
      col.setAttribute('data-spotify-device', device.id);
      if (device.is_active) col.className = 'col-sm active';


      var h = document.createElement('h4');
      h.innerHTML = device.name;


      var fa = document.createElement('i');
      var type = device.type.toLowerCase();
      if (type == 'computer') {
        fa.className = 'fal fa-desktop-alt fa-2x';
      } else if (type == 'tv') {
        fa.className = 'fal fa-tv fa-2x';
      } else {
        fa.className = 'fal fa-volume-up fa-2x';
      }
      col.appendChild(h);
      col.appendChild(fa);
      cont.appendChild(col);
    }
  }
}

$('body').on('click touchstart','.spotify-device', function(e) {
  $('#spotify-device-container div.active').removeClass('active');
  $(this).addClass('active');
  var id = $(this).attr('data-spotify-device');
  var opts = {
    deviceIds: [id],
    play: playing
  };
  socket.emit('spotify-device', opts);
});

function concatArtists(track) {
  var artists = '';
  for (var i = 0; i < track.artists.length; i++) {
    artists += track.artists[i].name;
    if (!i+1 == track.artists.length) artists += ', ';
  }
  return artists;
}

function compare(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

socket.on('spotify_authenticated', function(data) {
  authenticated = data.auth;
  auth_url = data.url;
})

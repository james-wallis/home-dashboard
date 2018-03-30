// Get env variables
require('dotenv').config();

// Packages
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const hueApi = require('node-hue-api');

// Modules
const GoogleMaps = require('./modules/googlemaps.js');
const Hue = require('./modules/hue.js');
const Spotify = require('./modules/spotify.js');
const Timer = require('timer-stopwatch');


// Express app.use
app.use(express.static(__dirname + '/webpages/css'));
app.use(express.static(__dirname + '/webpages/js'));
app.use(express.static(__dirname + '/webpages/include'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/webpages/index.html');
});

// Global variables
let hue = null;
let firstSearch = true;
const port = 3000;
const fastSearchInterval = 0.5 * 1000; // first number is the amount of seconds to wait
const slowSearchInterval = 5 * 60 * 1000; // first number is the amount of minutes to wait
let status = {
  googlemaps: {
    routes: []
  },
  hue: {
  },
  spotify: {},
  timer: {
    time: 0,
    done: false
  }
}
const googlemaps = new GoogleMaps({
  key: process.env.GOOGLE_MAPS_DIRECTIONS_API_KEY,
  origin: 'SO172FE',
  destination: 'IBM Hursley'
});
const spotify = new Spotify({
  app: app,
  client_id: process.env.SPOTIFY_CLIENT_ID,
  client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  redirect_uri: `http://localhost:${port}`,
  redirect_endpoint: '/spotify/callback'
});
let time = 0;
let timer = new Timer(time , { refreshRateMS: 500 });
timer.onTime(function(t) {
  if (status.timer.done || status.timer.reset) {
    time = 0;
  } else {
    console.log(Math.round(t.ms / 1000));
    time = t.ms;
    status.timer.time = Math.round(t.ms / 1000);
  }
});
timer.onDone(function(){
    status.timer.done = true;
});

/**
 * Start the server
 */
http.listen(port, function(){
  console.log('listening on ' + port);
});

/**
 * Get the Hue bridge IP as soon as the server starts
 * TODO handle more than one bridge on a network
 */
hueApi.nupnpSearch(function(err, bridges) {
    if (err) throw err;
    let opts = {
      user: process.env.HUE_USER,
      bridge: bridges[0]
    }
    hue = new Hue(opts);
});


/**
 * Socket.io
 */
io.on('connection', function(socket) {
  console.log('a user connected');
  sendStatus();
  socket.on('disconnect', function(){
   console.log('user disconnected');
  });
  googleMapsSocket(socket);
  hueSocket(socket);
  spotifySocket(socket);
  timerSocket(socket);

});

function googleMapsSocket(socket) {
  socket.on('google-maps-route', function() {
    googlemaps.directions();
  });
}

function hueSocket(socket) {
  socket.on('hue-light-toggle', function() {
    hue.lights(function(err, data) {
      for (var i = 0; i <= data.lights.length; i++) {
        if (data.lights[i].name.indexOf('Light') > -1) {
          hue.toggle(i+1);
        }
      }
    });
  });

  socket.on('hue-light-value', function(value) {
    hue.lights(function(err, data) {
      for (var i = 0; i <= data.lights.length; i++) {
        if (data.lights[i].name.indexOf('Light') > -1) {
          hue.dim(i+1, value);
        }
      }
    });
  });

  socket.on('hue-lamps-toggle', function() {
    hue.lights(function(err, data) {
      for (var i = 0; i <= data.lights.length; i++) {
        if (data.lights[i].name.indexOf('lamp') > -1) {
          hue.toggle(i+1);
        }
      }
    });
  });

  socket.on('hue-lamps-value', function(value) {
    hue.lights(function(err, data) {
      for (var i = 0; i <= data.lights.length; i++) {
        if (data.lights[i].name.indexOf('lamp') > -1) {
          hue.dim(i+1, value);
        }
      }
    });
  });
}

function spotifySocket(socket) {
  // Auth
  spotify.authorized(function(auth, url) {
   io.emit('spotify_authenticated', { auth: auth, url: url });
  });

  socket.on('spotify-play-pause', function(play) {
    if (play) {
      spotify.play(function(err) {
        if (err) console.error(err);
      });
    } else {
      spotify.pause(function(err) {
        if (err) console.error(err);
      });
    }
  })

  socket.on('spotify-next', function() {
    spotify.next(function(err) {
      if (err) console.error(err);
    });
  });

  socket.on('spotify-previous', function() {
    spotify.previous(function(err) {
      if (err) console.error(err);
    });
  });

  socket.on('spotify-repeat', function(repeat) {
    spotify.repeat({ state: repeat }, function(err, data) {
      if (err) console.error(err);
    });
  })

  socket.on('spotify-shuffle', function(shuffle) {
    spotify.shuffle({ state: shuffle }, function(err) {
      if (err) console.error(err);
    });
  })

  socket.on('spotify-volume', function(vol) {
    spotify.volume(vol, {}, function(err) {
      if (err) console.error(err);
    });
  })

  socket.on('spotify-device', function(opts) {
    spotify.device(opts, function(err) {
      if (err) console.error(err);
    });
  });

}

function timerSocket(socket) {
  socket.on('timer-increase', function() {
    if (status.timer.done) {
      time = 0;
      status.timer.done = false;
    }
    console.log('time', time);
    if (time < 5 * 60000) {
      time += (0.5 * 60000);
    } else if (time < 20 * 60000) {
      time += (1 * 60000);
    } else {
      time += (5 * 60000);
    }
    timer.reset(time);
    timer.start();
  });

  socket.on('timer-reset', function() {
    timer.stop();
    status.timer.time = 0;
    time = 0;
    timer.reset();
    status.timer.done = true;
  });

  socket.on('timer-notified', function() {
    status.timer.done = false;
  });
}




//
//
// Functions
//
//

/**
 * Function to get the status of different smart home devices
 */
function getStatus(periodicStatus) {
  // periodicStatus is the flag for longer wait intervals
  if (periodicStatus || firstSearch) {
    googlemaps.directions(function(routes) {
      status.googlemaps.routes = routes;
    });
    firstSearch = false;
  }
  if (hue) {
    let lights = {};
    let lamps = {};
    hue.lights(function(err, data) {
      for (var i = 0; i <= data.lights.length; i++) {
        hue.lightStatus(i, function(err, result) {
          if (result.name.indexOf('lamp') > -1) {
            lamps[result.name] = {
              state: result.state
            }
          } else {
            lights[result.name] = {
              state: result.state
            };
          }
          if ((Object.keys(lamps).length + Object.keys(lights).length) == data.lights.length) {
            status.hue = {
              lamps: lamps,
              lights: lights
            }
          }
        });
      }
    })
  }
  spotify.authorized(function(auth) {
    if (auth) {
      spotify.getPlaybackInfo(function(err, data) {
        if (data && data.item) {
          let s = {
            now_playing: {
              playing: data.is_playing,
              name: data.item.name,
              artists: data.item.album.artists,
              images: data.item.album.images
            },
            player_info: {
              repeat: data.repeat_state,
              shuffle: data.shuffle_state,
              volume: data.device.volume_percent
            }
          }
          status.spotify = s;
        }
      });
      spotify.devices(function(err, data) {
        if (data && data.devices) {
          status.spotify.devices = data.devices;
        }
      });
    }
  });
  sendStatus();
}

/**
 * Function to send the status of different smart home devices to the UI
 */
function sendStatus() {
  io.emit('status', status)
}

setInterval(getStatus, fastSearchInterval);
setInterval(getStatus, slowSearchInterval, true);

// Packages
const SpotifyWebApi = require('spotify-web-api-node');
const scope = ['playlist-read-private',
              'playlist-read-collaborative',
              'playlist-modify-private',
              'streaming',
              'ugc-image-upload',
              'user-follow-modify',
              'user-follow-read',
              'user-library-read',
              'user-library-modify',
              'user-read-private',
              'user-read-birthdate',
              'user-read-email',
              'user-top-read',
              'user-read-playback-state',
              'user-modify-playback-state',
              'user-read-currently-playing',
              'user-read-recently-played'];

/**
 * Create the Spotify object
 * @param {Object} opts, the options
 */
var Spotify = function(opts) {
  var self = this;
  this.app = opts.app;
  let api = new SpotifyWebApi({
    clientId : opts.client_id,
    clientSecret : opts.client_secret,
    redirectUri : opts.redirect_uri + opts.redirect_endpoint
  });
  this.api = api;
  this.auth_url = this.api.createAuthorizeURL(scope);
  console.log(this.auth_url);
  this.app.get(opts.redirect_endpoint, function(req, res) {
    api.authorizationCodeGrant(req.query.code, function(err, data) {
      if (err) throw err;
      api.setAccessToken(data.body['access_token']);
      api.setRefreshToken(data.body['refresh_token']);
      // console.log('The token expires in ' + data.body['expires_in']);
      this.api = api;
      res.redirect('/');
    });
  });

}

Spotify.prototype.authorized = function(callback) {
  if (this.api._credentials.accessToken && this.api._credentials.refreshToken) {
    ((typeof callback === 'function') ? callback(true, this.auth_url) : console.log('Spotify is authorized'));
  } else {
    ((typeof callback === 'function') ? callback(false, this.auth_url) : console.log('Spotify is not authorized'));
  }
}

Spotify.prototype.device = function(opts, callback) {
  this.api.transferMyPlayback(opts, function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

Spotify.prototype.devices = function(callback) {
  this.api.getMyDevices(function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data.body) : console.log(data));
    }
  });
}

Spotify.prototype.getPlaybackInfo = function(callback) {
  this.api.getMyCurrentPlaybackState({}, function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data.body) : console.log(data));
    }
  });
}

Spotify.prototype.next = function(callback) {
  this.api.skipToNext(function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data.body) : console.log(data));
    }
  });
}

Spotify.prototype.pause = function(callback) {
  this.api.pause(function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

Spotify.prototype.play = function(callback) {
  this.api.play(function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

Spotify.prototype.previous = function(callback) {
  this.api.skipToPrevious(function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data.body) : console.log(data));
    }
  });
}

Spotify.prototype.repeat = function(opts, callback) {
  if (!opts) throw new Error('No repeat state given');
  this.api.setRepeat(opts, function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

Spotify.prototype.shuffle = function(opts, callback) {
  if (!opts) throw new Error('No shuffle state given');
  this.api.setShuffle(opts, function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

Spotify.prototype.volume = function(vol, opts, callback) {
  if (!vol) throw new Error('No volume given');
  this.api.volume(vol, opts, function(err, data) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, data) : console.log(data));
    }
  });
}

module.exports = Spotify;

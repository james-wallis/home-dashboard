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
const Spotify = (opts) => {
  this.app = opts.app;
  const api = new SpotifyWebApi({
    clientId: opts.client_id,
    clientSecret: opts.client_secret,
    redirectUri: opts.redirect_uri + opts.redirect_endpoint,
  });
  this.api = api;
  this.auth_url = this.api.createAuthorizeURL(scope);
  this.app.get(opts.redirect_endpoint, (req, res) => {
    api.authorizationCodeGrant(req.query.code, (err, data) => {
      if (err) throw err;
      api.setAccessToken(data.body.access_token);
      api.setRefreshToken(data.body.refresh_token);
      // console.log('The token expires in ' + data.body['expires_in']);
      this.api = api;
      res.redirect('/');
    });
  });
};

Spotify.prototype.authorized = (callback) => {
  if (this.api.credentials.accessToken && this.api.credentials.refreshToken) {
    callback(true, this.auth_url);
  } else {
    callback(false, this.auth_url);
  }
};

Spotify.prototype.device = (opts, callback) => {
  this.api.transferMyPlayback(opts, (err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.devices = (callback) => {
  this.api.getMyDevices((err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.getPlaybackInfo = (callback) => {
  this.api.getMyCurrentPlaybackState({}, (err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.next = (callback) => {
  this.api.skipToNext((err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.pause = (callback) => {
  this.api.pause((err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.play = (callback) => {
  this.api.play((err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.previous = (callback) => {
  this.api.skipToPrevious((err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.repeat = (opts, callback) => {
  if (!opts) throw new Error('No repeat state given');
  this.api.setRepeat(opts, (err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.shuffle = (opts, callback) => {
  if (!opts) throw new Error('No shuffle state given');
  this.api.setShuffle(opts, (err, data) => {
    callback(err, data);
  });
};

Spotify.prototype.volume = (vol, opts, callback) => {
  if (!vol) throw new Error('No volume given');
  this.api.volume(vol, opts, (err, data) => {
    callback(err, data);
  });
};

module.exports = Spotify;

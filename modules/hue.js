// Packages
const { HueApi } = require('node-hue-api');

/**
 * Create the hue object
 * @param {Object} opts, the options
 */
const Hue = (opts) => {
  this.user = opts.user;
  this.bridge = opts.bridge;
  this.api = new HueApi(this.bridge.ipaddress, this.user);
};

/**
 * Get full description of the bridge
 */
Hue.prototype.description = (callback) => {
  this.api.description((err, desc) => {
    callback(err, desc);
  });
};

/**
 * Dim the lights
 */
Hue.prototype.dim = (id, value, callback) => {
  if (value === 0) {
    this.api.setLightState(id, { bri: value, on: false }, (err, res) => {
      callback(err, res);
    });
  } else {
    this.api.setLightState(id, { bri: value, on: true }, (err, res) => {
      callback(err, res);
    });
  }
};

/**
 * Get Hue config
 */
Hue.prototype.config = (callback) => {
  this.api.getConfig((err, config) => {
    callback(err, config);
  });
};

/**
 * Get full state of the Hue bridge and devices
 */
Hue.prototype.fullState = (callback) => {
  this.api.getFullState((err, state) => {
    callback(err, state);
  });
};

/**
 * Get the lights attached to the Hue bridge
 */
Hue.prototype.lights = (callback) => {
  this.api.lights((err, lights) => {
    callback(err, lights);
  });
};

/**
 * Get the status of a single light
 */
Hue.prototype.lightStatus = (id, callback) => {
  this.api.lightStatus(id, (err, result) => {
    callback(err, result);
  });
};

/**
 * Toggle the lights on or off
 * TODO If I get more lights, handle for this.
 *      At the moment I have one so the ID will always be one.
 */
Hue.prototype.toggle = (id, callback) => {
  const { api } = this;
  api.lightStatus(id, (getErr, result) => {
    if (getErr) {
      callback(getErr);
    } else {
      let lightValue = true;
      if (result.state.on) lightValue = false;
      api.setLightState(id, { on: lightValue }, (setErr, res) => {
        callback(setErr, res);
      });
    }
  });
};

/**
 * Get Hue version
 */
Hue.prototype.version = (callback) => {
  this.api.getVersion((err, version) => {
    callback(err, version);
  });
};

module.exports = Hue;

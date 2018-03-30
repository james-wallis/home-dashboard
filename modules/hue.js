// Packages
const HueApi = require("node-hue-api").HueApi;

/**
 * Create the hue object
 * @param {Object} opts, the options
 */
var Hue = function(opts) {
  var self = this;
  this.user = opts.user;
  this.bridge = opts.bridge;
  this.api = new HueApi(this.bridge.ipaddress, this.user);
}

/**
 * Get full description of the bridge
 */
Hue.prototype.description = function(callback) {
  this.api.description(function(err, desc) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, desc) : console.log(desc));
    }
  });
}

/**
 * Dim the lights
 */
Hue.prototype.dim = function(id, value, callback) {
  if (value == 0) {
    this.api.setLightState(id, {'bri': value, 'on': false}, function(err, res) {
      if (err) {
        ((typeof callback === 'function') ? callback(err) : console.error(err));
      } else {
        ((typeof callback === 'function') ? callback(null, res) : console.log(res));
      }
    });
  } else {
    this.api.setLightState(id, {'bri': value, 'on': true}, function(err, res) {
      if (err) {
        ((typeof callback === 'function') ? callback(err) : console.error(err));
      } else {
        ((typeof callback === 'function') ? callback(null, res) : console.log(res));
      }
    });
  }
}

/**
 * Get Hue config
 */
Hue.prototype.config = function(callback) {
  this.api.getConfig(function(err, config) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, config) : console.log(config));
    }
  });
}

/**
 * Get full state of the Hue bridge and devices
 */
Hue.prototype.fullState = function(callback) {
  this.api.getFullState(function(err, state) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, state) : console.log(state));
    }
  });
}

/**
 * Get the lights attached to the Hue bridge
 */
Hue.prototype.lights = function(callback) {
  this.api.lights(function(err, lights) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, lights) : console.log(lights));
    }
  });
};

/**
 * Get the status of a single light
 */
Hue.prototype.lightStatus = function(id, callback) {
  this.api.lightStatus(id, function(err, result) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, result) : console.log(result));
    }
  });
};

/**
 * Toggle the lights on or off
 * TODO If I get more lights, handle for this.
 *      At the moment I have one so the ID will always be one.
 */
Hue.prototype.toggle = function(id, callback) {
  let api = this.api;
  api.lightStatus(id, function(err, result) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      if (result.state.on) {
        api.setLightState(id, {'on': false}, function(err, res) {
          if (err) {
            ((typeof callback === 'function') ? callback(err) : console.error(err));
          } else {
            ((typeof callback === 'function') ? callback(null, res) : console.log(res));
          }
        });
      } else {
        api.setLightState(id, {'on': true}, function(err, res) {
          if (err) {
            ((typeof callback === 'function') ? callback(err) : console.error(err));
          } else {
            ((typeof callback === 'function') ? callback(null, res) : console.log(res));
          }
        });
      }
    }
  });
}

/**
 * Get Hue version
 */
Hue.prototype.version = function(callback) {
  this.api.getVersion(function(err, version) {
    if (err) {
      ((typeof callback === 'function') ? callback(err) : console.error(err));
    } else {
      ((typeof callback === 'function') ? callback(null, version) : console.log(version));
    }
  });
}
module.exports = Hue;

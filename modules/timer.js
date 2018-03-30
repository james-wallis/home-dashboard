const Stopwatch = require('timer-stopwatch');

var timer = new Stopwatch(60000); // A new countdown timer with 60 seconds
var stopwatch = new Stopwatch();

/**
 * Create the Timer object
 * @param {Object} opts, the options
 */
var Timer = function(opts) {
  var self = this;
  this.time = 0;
  this.timer = null;
}

Timer.prototype.get = function(callback) {
  callback(this.time);
}

Timer.prototype.set = function(t, callback) {
  this.time = t;
  callback();
}

Timer.prototype.reduceTimer = function() {
  this.timer-=1;
}



module.exports = Timer;

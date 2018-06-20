// const Stopwatch = require('timer-stopwatch');

// const timer = new Stopwatch(60000); // A new countdown timer with 60 seconds
// const stopwatch = new Stopwatch();

/**
 * Create the Timer object
 * @param {Object} opts, the options
 */
const Timer = () => {
  this.time = 0;
  this.timer = null;
};

Timer.prototype.get = (callback) => {
  callback(this.time);
};

Timer.prototype.set = (t, callback) => {
  this.time = t;
  callback();
};

Timer.prototype.reduceTimer = () => {
  this.timer -= 1;
};

module.exports = Timer;

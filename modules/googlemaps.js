// Packages
const { Client } = require('node-rest-client');


/**
 * Create the Google Maps object
 * @param {Object} opts, the options
 */
const GoogleMaps = (opts) => {
  this.client = new Client();
  this.key = opts.key;
  this.origin = opts.origin;
  this.destination = opts.destination;
};

GoogleMaps.prototype.directions = (callback) => {
  const routes = [];
  let url = '';
  url += 'https://maps.googleapis.com/maps/api/';
  url += 'directions/';
  url += 'json?units=imperial';
  url += `&origin=${this.origin}`;
  url += `&destination=${this.destination}`;
  url += '&departure_time=now';
  url += `&key=${this.key}`;
  url += '&alternatives=true';
  this.client.get(url, (data) => {
    for (let i = 0; i < data.routes.length; i + 1) {
      const route = {
        name: data.routes[i].summary,
        duration: data.routes[i].legs[0].duration_in_traffic,
        start: data.routes[i].legs[0].start_address,
        end: data.routes[i].legs[0].end_address,
        warnings: data.routes[i].warnings,
      };
      routes.push(route);
      if (data.routes.length === routes.length) {
        this.routes = routes;
        if (typeof callback === 'function') callback(this.routes);
      }
    }
  });
};


module.exports = GoogleMaps;

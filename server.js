// Get env variables
require('dotenv').config();

// Packages
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const hueApi = require('node-hue-api');

// Modules
const Hue = require('./modules/hue.js');

// Express app.use
app.use(express.static(__dirname + '/webpages/css'));
app.use(express.static(__dirname + '/webpages/js'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/webpages/dashboard.html');
});

// Global variables
let hue = null;
const port = 3000;
const searchInterval = 3 * 1000; // first number is the amount of seconds to wait
let status = {
  hue: {
    light_1: null
  }
}

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
   socket.on('hue:light_1', function() {
     console.log('received');
     hue.toggle();
   });
 });

//
//
// Functions
//
//

/**
 * Function to get the status of different smart home devices
 */
function getStatus() {
  if (hue) {
    hue.lightStatus(1, function(err, result) {
      status.hue.light_1 = result.state.on;
    });
  }
  sendStatus();
}

/**
 * Function to send the status of different smart home devices to the UI
 */
function sendStatus() {
  io.emit('status', status)
}


setInterval(getStatus, searchInterval);

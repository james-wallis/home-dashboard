/* eslint-disable */
var routes = [];

// Event listeners
$('body').on('click touchstart','#google-maps', function(e){
  socket.emit('google-maps-route');
});


function googleMapsWidget() {
  var s = document.createElement('div');
  s.id = 'google-maps';
  s.className = 'widget google-maps-widget';

  var p = document.createElement('p');
  p.innerHTML = 'Google maps';
  s.appendChild(p);

  var r = document.createElement('div');
  r.id = 'google-maps-content';
  r.className = 'row';

  p = document.createElement('p');
  p.innerHTML = 'No Google maps information';
  r.appendChild(p);

  s.appendChild(r);
  return s;

}



function updateGoogleMaps(routes) {
  // As the amount of routes may change, updating google maps should redraw the html
  var el = document.getElementById('google-maps-content');
  if (routes.length > 0 && el) {
    var el = document.getElementById('google-maps-content');
    el.innerHTML = '';
    var noRoutes = routes.length;
    for (var i = 0; i < noRoutes; i++) {
      var route = routes[i];
      var col = 12/noRoutes;
      var d = document.createElement('div');
      d.className = 'col-sm-' + col;

      h = document.createElement('h3');
      h.className = 'google-maps-widget';
      h.innerHTML = route.name;
      if (noRoutes > 2) {
        h.style.fontSize = '8px';
      }
      d.appendChild(h);

      p = document.createElement('p');
      p.className = 'google-maps-duration';
      p.innerHTML = route.duration.text;
      if (noRoutes > 2) {
        p.style.fontSize = '12px';
      }
      d.appendChild(p);

      el.appendChild(d);

    }
  }

}

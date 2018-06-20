/* eslint-disable */
// Stop website drag on ipad
$(window).bind('touchmove', function(e) {
  if (e.target.id != 'spotify-volume') {
    e.preventDefault();
  }
});
spotify();
hue();


$('body').on('click touchstart','.side-bar-button',function(e){
  $('.page').hide();
  $('.side-bar-button').removeClass('active');
  switch(this.id) {
    case 'hue-button':
      showHue();
      break;
    case 'spotify-button':
      showSpotify();
      break;
    default:
      dashboard();
  }
});

socket.on('status', function(info) {
  if (info.hue) updateHue(info.hue);
  if (info.spotify) updateSpotify(info.spotify);
  if (info.googlemaps) updateGoogleMaps(info.googlemaps.routes);
  if (info.timer) updateTimer(info.timer);
})


$('body').on('click touchstart','.side-bar-button',function(e){
  $('.page').hide();
  $('.side-bar-button').removeClass('active');
  switch(this.id) {
    case 'spotify-button':
      spotify();
      break;
    default:
      dashboard();
  }
});

socket.on('status', function(info) {
  if (info.hue) updateHue(info.hue);
  if (info.spotify) updateSpotify(info.spotify);
})

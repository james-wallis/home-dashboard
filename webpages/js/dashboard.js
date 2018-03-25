$(function(){
  dashboard();
});

function dashboard() {
  var widgetWidth = $(window).width() * 0.15; // 15vw .widget
  var dashboardListUpper = [hueWidget(),hueWidget(),hueWidget(),hueWidget()];
  var dashboardListLower = [hueWidget(),hueWidget(),hueWidget(),hueWidget()];
  $('h1').text('Dashboard');
  $('h2').text('Smart home control panel');
  $('#dashboard-button').addClass('active');
  $('#dashboard').html('');
  var dashboardHeight = $(window).height() - ($('header').height() + $('header').offset().top + $('footer').height());
  $('#dashboard').height(dashboardHeight + 'px');
  // add two row splitter
  var row = document.createElement('div');
  row.className = 'row';
  for (var i = 0; i < dashboardListUpper.length; i++) {
    if (i != 0) {
      var marginLeft = ($('#dashboard-container').width() - (widgetWidth*dashboardListUpper.length)) / (dashboardListUpper.length-1);
      $(dashboardListUpper[i]).css('margin-left', marginLeft);
    }
    row.appendChild(dashboardListUpper[i]);
  }
  document.getElementById('dashboard').appendChild(row);
  row = document.createElement('div');
  row.className = 'row';
  for (var i = 0; i < dashboardListLower.length; i++) {
    if (i != 0) {
      var marginLeft = ($('#dashboard-container').width() - (widgetWidth*dashboardListLower.length)) / (dashboardListLower.length-1);
      $(dashboardListLower[i]).css('margin-left', marginLeft);
    }
    row.appendChild(dashboardListLower[i]);
  }
  document.getElementById('dashboard').appendChild(row);

  $('#dashboard').show();

}

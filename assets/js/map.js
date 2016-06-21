function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: centerLat, lng: centerLng},
    zoom: 12,
    mapTypeControl: false,
    scaleControl: false,
    panControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},
      {"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},
      {"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},
      {"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},
      {"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},
      {"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},
      {"featureType":"administrative.province","stylers":[{"visibility":"off"}]},
      {"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},
      {"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},
      {"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]}
    ]
  });

  var infowindow = new google.maps.InfoWindow();
  
  for (i = 0; i < markers.length; i++) {
    var placelatlng = new google.maps.LatLng(markers[i].lat, markers[i].lng);
    
    var marker = new RichMarker({
      position: placelatlng,
      map: map,
      draggable: false,
      flat: true,
      content: '<div style="margin-top:3em; display:block;"><span class="place-number">' + markers[i].number + '</span></div>'
    });
    
    marker.html = '<div class="custom-info-window"><span class="place-number">' + markers[i].number + '</span><a class="info-window-url" href="' + markers[i].url + '"><h3 class="info-window-title">' + markers[i].title + '</h3></a></div>';
    
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.html);
      infowindow.open(map, this);
    });
    
    if (markers[i].number == getUrlParameter('q')) {
      infowindow.setContent(marker.html);
      infowindow.open(map, marker);
      map.setZoom(15);
      map.setCenter(marker.position);
    };

  }
}

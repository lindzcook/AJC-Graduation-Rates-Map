$(document).ready(function(){
  var metro5Centroid = new google.maps.LatLng(33.77, -84.330101);

  var mapStyle = [
  {
    stylers: [{
      saturation: -60
    }]
  },
  {
    featureType: "poi",
    stylers: [{visibility: "off"}]
  },
  {
    featureType: "landscape",
    stylers: [{
      visibility: "off"
    }]
  },
  {
    featureType: 'road',
    stylers: [{
      visibility: "simplified",
      saturation: 70
    }]
  },
  {
    featureType: "road.arterial",
    stylers: [{visibility: "off"}]
  }];

  var mapOptions = {
    center:            metro5Centroid,
    zoom:              $('#map').width() > 700 ? 10 : 9,
    mapTypeId:         google.maps.MapTypeId.ROADMAP,
    mapTypeControl:    false,
    streetViewControl: false,
    panControl:        false,
    zoomControl:      $('#map').width() > 700 ? true : false,
    styles:            mapStyle
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var markers = { //spreadsheets
        schoolwide:   [],
        black: [],
        hispanic:   [],
        white:   [],
        econ:   [],
        dis:   []
      },
      infoWindows = [],
      currentCluster = 'schoolwide';

  Tabletop.init({
    key: 'https://docs.google.com/spreadsheet/pub?key=0Al0mJbZP51h2dDVRM1VZa3p1LVVVUmtyazV1bzJ1TWc&output=html',
	simpleSheet: true,
    callback: function(data, tabletop) {
    //spreadsheets
        var schools = tabletop.data();
		
        $.each(schools, function(idx, school) {
          var latLng = new google.maps.LatLng(school.latitude, school.longitude);

          var infoWindow = new google.maps.InfoWindow({
            content: function() {
              template = $('#scores');
              $(template).find('#name').text(function(){ return school.schoolname;  });
              $(template).find('#district').text(function(){ return school.systemname;  });
              $(template).find('#schoolwide').text(function(){ return school.schoolwide;  });
              $(template).find('#econ').text(function(){ return school.econ; });
              $(template).find('#dis').text(function(){ return school.dis;         });
              $(template).find('#black').text(function(){ return school.black;   });
              $(template).find('#white').text(function(){ return school.white;   });
              $(template).find('#hispanic').text(function(){ return school.hispanic;   });
              //$(template).find('#file').text(function(){ return school.filename;   });
              return $(template).html();
            }()
          });
          infoWindows.push(infoWindow);

		  $.each(markers, function(id){
			  var marker = new google.maps.Marker({
				  position: latLng,
				  title: school.schoolname,
				  icon: function() {
					  //change if to take into consideration filename
					  if ( school[id] >= 90 ) {
						  return 'images/a.png';
					  } //if
					  else if ( school[id] >= 80 ) {
						  return 'images/b.png';
					  } //else if
					  else if ( school[id] >= 70 ) {
						  return 'images/c.png';
					  } 
					  else if ( school[id] >= 60 ) {
						  return 'images/d.png';
					  } //else if
					  else if ( school[id] >= 0  ) {
						  return 'images/f.png';
					  } 
					  else { 
						  return  'images/na.png'; 
					  };
				  }()//icon
			  });//close marker
	          google.maps.event.addListener(marker, 'click', function() {
	            $.each(infoWindows, function(idx, window) {
	              window.close();
	            })
	            infoWindow.open(map, marker);
	          });
	          markers[id].push(marker);
		  })


          
        });  //school loop
    //  });  //school cluster loop

      var displayCluster = function(cluster) {
        $.each(markers[currentCluster], function(idx, marker) {
          marker.setMap(null);
        });
        $.each(markers[cluster], function(idx, marker) {
          marker.setMap(map);
        });
        currentCluster = cluster;
      };

      displayCluster(currentCluster);

      $('#choose_school_layer').change(function() {
        displayCluster( $(this).val() );
      })
    } // tabletop callback function
  }); //Tabletop.init
});

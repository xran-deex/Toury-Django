/*
    returns a Javascript namspace
*/
function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
}

var valis = namespace('valis.Utilites');

valis.StateEnum = {
    FIRST_MARKER_ADDED: 0,
    DIRECTION_MARKER_ADDED: 1,
    READY: 2,
    FINISHED: 3
}

var map; //the google map object

var infowindowvisible = true;
var mapOptions;
var marker;
var infowindow;

var state = valis.StateEnum.READY;
var flightPath;
var touryMarker;
var hasEdited = false;

$(function(){

    //set the active tab in the navbar
    var href = window.location.pathname;
    $('.nav a').each(function(){
        if($(this).attr('href') == href)
            $(this).parent().attr('class', 'active');
    });

    $('#radius').focusout(function(e){
        touryMarker.marker.setIcon(getCircle($('#radius').val()));
        // touryMarker.title = $('#marker').val();
        // touryMarker.description = $('#description').val();
        touryMarker.radius = $('#radius').val();
        dict.put(touryMarker.flightPath.getPath().getAt(1), touryMarker);
        hasEdited = true;
        setTimeout(postUpdates, 5000);
    });
    $('#marker').focusout(function(e){
        touryMarker.infowindow.setContent('<div id="content"><h5>'+ $('#marker').val() + '</h5></div>');
        touryMarker.title = $('#marker').val();
        touryMarker.description = $('#description').val();
        dict.put(touryMarker.flightPath.getPath().getAt(1), touryMarker);
        hasEdited = true;
        setTimeout(postUpdates, 5000);
    });
    $('#order').focusout(function(e){
        touryMarker.infowindow.setContent('<div id="content"><h5>'+ $('#marker').val() + ' - ' + $('#order').val()  + '</h5></div>');
        // touryMarker.title = $('#marker').val();
        touryMarker.order = $('#order').val();
        // touryMarker.description = $('#description').val();
        dict.put(touryMarker.flightPath.getPath().getAt(1), touryMarker);
        hasEdited = true;
        setTimeout(postUpdates, 5000);
    });
    $('#description').focusout(function(e){
        touryMarker.description = $(this).val();
        dict.put(touryMarker.flightPath.getPath().getAt(1), touryMarker);
        hasEdited = true;
        setTimeout(postUpdates, 5000);
    });

    $('#submit').click(function(e){
        e.preventDefault();
        var form = this;
        if(state == valis.StateEnum.DIRECTION_MARKER_ADDED)
            form.submit();
        else
            alert('Oops. Please select a location where you want your user to look, then press submit again.');
    });

    $('#clear').click(function(e){
        e.preventDefault();
        touryMarker.marker.setMap(null);
    });


    map = new google.maps.Map(document.getElementById("map-canvas"), {
        mapTypeId: google.maps.MapTypeId.SATELLITE,

        zoom: 14    
    });

    function getCircle(magnitude) {
        console.log(magnitude);
        var scale = parseInt(magnitude) * 2 / (21 - map.zoom);
        console.log('Scale' + scale);
      return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .2,
        scale: scale,
        strokeColor: 'white',
        strokeWeight: .5
      };
    }

    google.maps.event.addListener(map, 'zoom_changed', function(event){
        var keys = dict.keys();
        for(var i = 0; i < keys.length; i++){
            var m = dict.getVal(keys[i]);
            m.marker.setIcon(getCircle(m.radius));
        }
        //touryMarker.marker.setIcon(getCircle($('#radius').val()));
    });

    google.maps.event.addListener(map, 'click', function(event){

        if(state == valis.StateEnum.DIRECTION_MARKER_ADDED){
            state = valis.StateEnum.READY;
        }

        if(state == valis.StateEnum.FIRST_MARKER_ADDED){
            $('#instructions').html('<p>You may change the radius or click submit to save your marker.</p>');
            flightPath = new google.maps.Polyline({
                path: [event.latLng, marker.getPosition()],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                editable: true
            });

            touryMarker.flightPath = flightPath;

            var heading = google.maps.geometry.spherical.computeHeading(touryMarker.marker.getPosition(), event.latLng);

            touryMarker.marker_lat = event.latLng.lat();
            touryMarker.marker_lng = event.latLng.lng();
            console.log(touryMarker);

            $('#direction').val(heading);
            $('#mark_lat').val(event.latLng.lat());
            $('#mark_lng').val(event.latLng.lng());
            touryMarker.flightPath.setMap(map);
            state = valis.StateEnum.DIRECTION_MARKER_ADDED;
            //hasEdited = true;
            //setTimeout(postUpdates, 5000);
        }

        if(state == valis.StateEnum.READY){
            $('#lat').val(event.latLng.lat());
            $('#lng').val(event.latLng.lng());
            $('#marker').val('');
            $('#description').val('');
            $('#radius').val(15);
            $('#instructions').html('<p>Click again in the location you want to the tourer to look.</p>');

            touryMarker = new TouryMarker(); //create a new TouryMarker

            marker = new google.maps.Marker({
                map: map,
                position: event.latLng,
                title: $('#marker').val(),
                icon: getCircle($('#radius').val()),
                draggable: true
            });
            
            touryMarker.marker = marker;

            google.maps.event.addListener(touryMarker.marker, 'click', function(event){
                touryMarker = dict.getVal(event.latLng.lat());
                $('#marker').val(touryMarker.title);
                $('#description').val(touryMarker.description);
                $('#order').val(touryMarker.order);
                if(!infowindowvisible){
                    touryMarker.infowindow.open(map, touryMarker.marker);
                    infowindowvisible = true;
                }
                // else {
                //     touryMarker.infowindow.close();
                //     infowindowvisible = false;
                // }
            });
            
            infowindow = new google.maps.InfoWindow({
                content: '<div id="content"><h5>'+ $('#marker').val() + '</h5></div>',
                enableEventPropoagation: true
            });
            touryMarker.title = $('#marker').val();
            touryMarker.description = $('#description').val();

            touryMarker.infowindow = infowindow;

            dict.put($('#lat').val(), touryMarker);

            var keys = dict.keys();
            for(var i = 0; i < keys.length; i++)
                console.log(dict.getVal(keys[i]));

            if($('#marker').val() != ''){
                touryMarker.infowindow.open(map, touryMarker.marker);
            }


            google.maps.event.addListener(touryMarker.infowindow, 'content_changed', function(event){
                touryMarker.infowindow.open(map, touryMarker.marker);
            });
            google.maps.event.addListener(touryMarker.infowindow, 'closeclick', function(event){
                infowindowvisible = false;
            });
            google.maps.event.addListener(touryMarker.marker, 'dragstart', function(event){
                dict.remove(event.latLng.lat());
                console.log(touryMarker);
            });
            google.maps.event.addListener(touryMarker.marker, 'dragend', function(event){
                dict.put(event.latLng.lat(), touryMarker);
                console.log(touryMarker);
                $('#marker').val(touryMarker.title);
                $('#description').val(touryMarker.description);
                $('#lat').val(event.latLng.lat());
                $('#lng').val(event.latLng.lng());
                touryMarker.infowindow.setMap(null);
                touryMarker.infowindow = new google.maps.InfoWindow({
                    content: '<div id="content"><h5>'+ $('#marker').val() + '</h5></div>',
                    enableEventPropoagation: true
                });
                if($('#marker').val() != '')
                    touryMarker.infowindow.open(map, touryMarker.marker);
                if(touryMarker.flightPath != null){
                    var oldpath = touryMarker.flightPath.getPath();
                    touryMarker.flightPath.setPath([oldpath.getAt(0), event.latLng]);
                }
            });

            state = valis.StateEnum.FIRST_MARKER_ADDED;
            //hasEdited = true;
            //setTimeout(postUpdates, 5000);
        }

    });

    if(markerList.length != 0){
        mapOptions = {
            center: new google.maps.LatLng(markerList[0].marker_lat, markerList[0].marker_lng),
            zoom: 20
        };
        map.setOptions(mapOptions);
    } else if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(setLoc);

    } else {
        mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8
        };
        map.setOptions(mapOptions);
    }

    /*
        This loop initializes all of the previously saved markers
    */
    for(var i = 0; i < markerList.length; i++){
        console.log(markerList[i]);
        touryMarker = new TouryMarker();
        touryMarker.title = markerList[i].title;
        touryMarker.description = markerList[i].description;
        touryMarker.id = markerList[i].id;
        touryMarker.radius = markerList[i].radius;
        touryMarker.order = markerList[i].order;
        touryMarker.marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(markerList[i].lat, markerList[i].lng),
                title: markerList[i].title,
                icon: getCircle(markerList[i].radius),
                draggable: true
            });

        google.maps.event.addListener(touryMarker.marker, 'click', function(event){

                touryMarker = dict.getVal(event.latLng.lat());
                console.log(touryMarker);
                $('#marker').val(touryMarker.title);
                $('#description').val(touryMarker.description);
                $('#order').val(touryMarker.order);
                $('#radius').val(touryMarker.radius);
                if(!infowindowvisible){
                    touryMarker.infowindow.open(map, touryMarker.marker);
                    infowindowvisible = true;
                }
            });

        touryMarker.infowindow = new google.maps.InfoWindow({
                content: '<div id="content"><h5>'+ markerList[i].title +'</h5></div>',
                enableEventPropoagation: true
         });

        touryMarker.flightPath = new google.maps.Polyline({
            path: [new google.maps.LatLng(markerList[i].marker_lat, markerList[i].marker_lng),new google.maps.LatLng(markerList[i].lat, markerList[i].lng)],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            editable: true
            // draggable: true
        });

        google.maps.event.addListener(touryMarker.flightPath.getPath(), 'set_at', function(event){
            //console.log(touryMarker);
            hasEdited = true;
            setTimeout(postUpdates, 5000);
        });

        google.maps.event.addListener(touryMarker.infowindow, 'closeclick', function(event){
                infowindowvisible = false;
        });

        google.maps.event.addListener(touryMarker.marker, 'dragstart', function(event){
                //dict.remove(event.latLng.lat());
                touryMarker = dict.getVal(event.latLng.lat());
                hasEdited = true;
                setTimeout(postUpdates, 5000);
        });
        google.maps.event.addListener(touryMarker.marker, 'dragend', function(event){
            console.log(touryMarker);
            dict.put(event.latLng.lat(), touryMarker);
            $('#marker').val(touryMarker.title);
            $('#description').val(touryMarker.description);
            $('#lat').val(event.latLng.lat());
            $('#lng').val(event.latLng.lng());
            $('#order').val(touryMarker.order);

            touryMarker.infowindow.setMap(null);
            touryMarker.infowindow = new google.maps.InfoWindow({
                content: '<div id="content"><h5>'+ $('#marker').val() + '</h5></div>',
                enableEventPropoagation: true
            });
            if($('#marker').val() != '')
                touryMarker.infowindow.open(map, touryMarker.marker);
            if(touryMarker.flightPath != null){
                var oldpath = touryMarker.flightPath.getPath();
                touryMarker.flightPath.setPath([oldpath.getAt(0), event.latLng]);
            }
            hasEdited = true;
            setTimeout(postUpdates, 5000);
        });

        touryMarker.flightPath.setMap(map);

        dict.put(markerList[i].lat, touryMarker);
        touryMarker.infowindow.open(map, touryMarker.marker);
    }
});

/* 
    Post an AJAX request after 5 seconds of something having been edited.
*/
var postUpdates = function(){
    console.log('Checking for updates...');
    if(hasEdited && state == valis.StateEnum.READY){
        console.log('Posting updates...');
        console.log(dict);
        for(var marker in dict.keys()){
            var strId = dict.getVal(dict.Keys[marker]).id + '';
            //console.log(dict.getVal(dict.Keys[marker]).flightPath.getPath().getAt(0).lat());
            if(dict.getVal(dict.Keys[marker]).id === undefined){
            $.ajax({
                url: window.location.href,
                type: 'POST',
                data: { description: dict.getVal(dict.Keys[marker]).description,
                        title: dict.getVal(dict.Keys[marker]).title,
                        trigger_latitude: dict.getVal(dict.Keys[marker]).marker.position.k,
                        trigger_longitude: dict.getVal(dict.Keys[marker]).marker.position.A,
                        marker_latitude: dict.getVal(dict.Keys[marker]).flightPath.getPath().getAt(0).lat(),
                        marker_longitude: dict.getVal(dict.Keys[marker]).flightPath.getPath().getAt(0).lng(),
                        order: dict.getVal(dict.Keys[marker]).order,
                        radius: 15,
                        ajax: true
                 },
                //success: function(msg){ window.location.href = window.location.href; }
            });
            } else {
            $.ajax({
                url: '/marker/' + strId + '/',
                type: 'POST',
                data: { description: dict.getVal(dict.Keys[marker]).description,
                        title: dict.getVal(dict.Keys[marker]).title,
                        trigger_latitude: dict.getVal(dict.Keys[marker]).marker.position.k,
                        trigger_longitude: dict.getVal(dict.Keys[marker]).marker.position.A,
                        marker_latitude: dict.getVal(dict.Keys[marker]).flightPath.getPath().getAt(0).lat(),
                        marker_longitude: dict.getVal(dict.Keys[marker]).flightPath.getPath().getAt(0).lng(),
                        radius: dict.getVal(dict.Keys[marker]).radius,
                        order: dict.getVal(dict.Keys[marker]).order,
                        ajax: true
                 },
                //success: function(msg){ window.location.href = window.location.href; }
            });
            }

        }
        hasEdited = false;
    }
};

function setLoc(location)
{
           //console.log(location.coords.latitude);
           mapOptions = {
            center: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
            zoom: 20
           }
        map.setOptions(mapOptions);
}
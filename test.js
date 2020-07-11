$(document).ready(function() {

    var latitude
    var longitude
    var map;
    var service
    var infowindow
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: {lat: latitude, lng: longitude},
            zoom: 12
        })
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition(getPosition)
    }

    function getPosition(position) {
        latitude = position.coords.latitude
        longitude = position.coords.longitude

        console.log(latitude)
        console.log(longitude)

        initMap()
    }

    function createMarker(markerLocation) {
        var marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            title:"Hello World!"
        });
       
        marker.setMap(map);
    }

    function findDate() {
        var distMiles = $("#searchradius").val()
        var distMeters = distMiles * 1610
        var cuisine = $("#cuisine").val()
        var currentMapCoords = latitude + ", " + longitude
        var searchLocation = new google.maps.LatLng(currentMapCoords)

        console.log(distMiles)
        console.log(distMeters)
        console.log(cuisine)
        console.log(currentMapCoords)
        console.log(searchLocation)
        
        var request = {
            location: searchLocation,
            radius: distMeters.toString(),
            type: ["restaruant"],
            query: cuisine.toString()
          };
      
          service = new google.maps.places.PlacesService(map);
          service.textSearch(request, callback);
      }
      
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                var place = results[i];
                console.log(place)
                var placeDetailId = place.place_id

                var requestDetail = {
                    placeId: placeDetailId,
                    fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'photo', 'url']
                  };
                  
                  service = new google.maps.places.PlacesService(map);
                  service.getDetails(requestDetail, callback);
                  
                  function callback(placeDetail, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(placeDetail)
                    //   createMarker(placeDetail);
                    }
                  }
            }
        }
    }

    


    getLocation()

    $("#centermap").on("click", function(event) {
        event.preventDefault()
        navigator.geolocation.getCurrentPosition(getPosition)
        // console.log("button is clicked")
    })

    $("#findcity").on("click", function(event) {
        event.preventDefault()

        var cityField = $("#cityfield").val().trim()
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityField + "&key=AIzaSyCFP0tqM6o9f2FoX3gInG3rF-5nGBZiKc8"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // console.log(response)
            // console.log(response.results[0].geometry.location.lat)
            // console.log(response.results[0].geometry.location.lng)

            latitude = response.results[0].geometry.location.lat
            longitude = response.results[0].geometry.location.lng
            console.log(latitude)
            console.log(longitude)

            initMap()
        })
    })

    $("#findrestaurant").on("click", function(event) {
        event.preventDefault()
        findDate()
    })


})


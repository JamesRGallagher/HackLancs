/**
 * Created by aetdeveloper on 29/11/14.
 */
angular.module('hs.mapbox', ['ionic','ionic.service.platform', 'ionic.ui.content', 'ionic.ui.list', 'ionic.service.loading'])

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('eventmenu', {
                url: "/event",
                abstract: true,
                templateUrl: "event-menu.html"
            })
            .state('eventmenu.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "home.html",
                        controller: "MapCtrl"
                    }
                }
            })
            .state('eventmenu.info', {
                url: "/info",
                views: {
                    'menuContent': {
                        templateUrl: "info.html",
                        controller: "InfoCtrl"
                    }
                }
            })
            .state('eventmenu.start', {
                url: "/start",
                views: {
                    'menuContent': {
                        templateUrl: "start.html",
                        controller: "StartCtrl"
                    }
                }
            })
            .state('eventmenu.present', {
                url: "/present",
                views: {
                    'menuContent': {
                        templateUrl: "present.html",
                        controller: "PresentCtrl"
                    }
                }
            })

        $urlRouterProvider.otherwise("/event/start");
    })

    .controller('MainCtrl', function($scope,$http) {
      var responsePromise = $http.get("https://hacklancaster.herokuapp.com/events")
          .success(function(data, status, headers, config) {
            $scope.events = data.events;

            console.log(data.events);
        });

    })

    .controller('InfoCtrl', function($scope) {

        $scope.leftButtons = [{
            type: 'button-icon icon ion-search',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];
        $scope.rightButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleRight();
            }
        }];
    })

    .controller('StartCtrl', function($scope, $http, $location) {
        $scope.leftButtons = [{
            type: 'button-icon icon ion-search',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];
        
        $scope.rightButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleRight();
            }
        }];

        var responsePromise = $http.get("https://hacklancaster.herokuapp.com/catogories")
          .success(function(data, status, headers, config) {
            $scope.periods = data.catogories;

            
            console.log(data);
        })

        $scope.chooseCat = function(chosenPeriod) {

            $location.path('event/home') + $location.search('period', chosenPeriod);

        }

    })

    .controller('MapCtrl', function($scope, $ionicLoading,$rootScope,$location,$http, $interval) {

        var mapObject;
        var featureLayer;

		$scope.whereubin = [];

        if ( $location.search().present) {

            var pusher = new Pusher('3bf0e385c57546f6d7e8');

            var channel = pusher.subscribe('screen_count'); 

            channel.bind('person_near', function(data) {

                $http.get('https://hacklancaster.herokuapp.com/catogories/' + $location.search().period).success(function(geo) {
                    featureLayer.setGeoJSON(geo);

                    featureLayer.eachLayer(function(layer) {

                        // here you call `bindPopup` with a string of HTML you create - the feature
                        // properties declared above are available under `layer.feature.properties`
                        if (layer.feature.id == data.monument) {
                            var content = '<h2>'+layer.features.properties.title+'<\/h2>'+'<br><div style="font-size:10px">'+feature.properties.description+'</div>'
                            layer.bindPopup(content);
                        }
                    });
                });

            });
        }

        $scope.leftButtons = [{
            type: 'button-icon icon ion-search',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }];
        $scope.rightButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.sideMenuController.toggleRight();
            }
        }];

        $scope.initializeMap =  function() {
            
            $http.get('https://hacklancaster.herokuapp.com/catogories/' + $location.search().period).success(function(geo) {
                mapObject = L.mapbox.map('map', mapStyle).setView([54.0498942, -2.8055977], 15)
				$scope.geo = geo;
                
                console.log(geo);

                featureLayer = L.mapbox.featureLayer()
                    .addTo(mapObject);

                featureLayer.on('layeradd', function(e) {
                    var marker = e.layer;
                    var feature = marker.feature;

                    if ( marker.feature.id != "line") {

                        marker.setIcon(L.icon(feature.properties.icon));
                    
                    }
                });

                featureLayer.setGeoJSON(geo);

                featureLayer.eachLayer(function(layer) {

                    // here you call `bindPopup` with a string of HTML you create - the feature
                    // properties declared above are available under `layer.feature.properties`
                    if (layer.feature.id && !angular.isUndefined(layer.features)) {
                        var content = '<h2>'+layer.features.properties.title+'<\/h2>'+'<br><div style="font-size:10px">'+feature.properties.description+'</div>'
                    layer.bindPopup(content);
                }

                var controller = new Leap.Controller();

                controller.connect();

                var singleHandEnter = function() {
                        // $scope.hands.mapAnchor = mapObject.getCenter();
                        // $scope.hands.handAnchor = $scope.hands.new[0].stabilizedPalmPosition;
                    }

                var singleHandMove = function () {
                    var change = [];

                    for (var i = 0; i < 3; i++) {
                        change[i] = $scope.hands.new[0].stabilizedPalmPosition[i] - $scope.hands.old[0].stabilizedPalmPosition[i];
                    }

                    // mapObject.panBy([changeX, changeY], false);
                    mapObject.panBy([-change[0], change[1]], {
                        'animate': false,
                        'duration': 0, 
                        'easyLinearity': 0, 
                        'noMoveStart': false 
                    });

                }

                var singleHandSwipe = function() {

                }

                var twoHandMove = function() {
                    x = $scope.hands.new[0].stabilizedPalmPosition[0] - $scope.hands.new[1].stabilizedPalmPosition[0];
                    y = $scope.hands.new[0].stabilizedPalmPosition[1] - $scope.hands.new[1].stabilizedPalmPosition[1];
                    z = $scope.hands.new[0].stabilizedPalmPosition[2] - $scope.hands.new[1].stabilizedPalmPosition[2];
                    var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

                    mapObject.setZoom(Math.round(((dist-70)/100) + 14, 0), {
                        'animate':false
                    });
                }

                controller.on('frame', function (frame) {
                    
                    $scope.hands.old = $scope.hands.new;
                    $scope.hands.new = frame.hands;

                    if ( $scope.hands.old.length == 0 && $scope.hands.new.length == 1) {
                        singleHandEnter();
                    }
                    if ( $scope.hands.old.length == 1 && $scope.hands.new.length == 1) {
                        if ($scope.hands.old[0].grabStrength > 0.8) {
                            singleHandMove();
                        }
                    }
                    if ( $scope.hands.old.length == 2 && $scope.hands.new.length == 2) {
                        if ($scope.hands.old[0].grabStrength > 0.8 || $scope.hands.old[1].grabStrength > 0.8) {
                            twoHandMove();
                        }
                    }   
                    
                });
            });

            });
            // Stop the side bar from dragging when mousedown/tapdown on the map
            L.DomEvent.addListener(document.getElementById('map'), 'mousedown', function(e) {
                e.preventDefault();
                return false;
            });

            $scope.hands = {new: []};
			
			setInterval(function(){
                // method to be executed;
                $scope.nearMe()
            },1500);

            //$scope.centerOnMe();
            HSSearch.init();
        }

		$scope.nearMe = function() {

            navigator.geolocation.getCurrentPosition(function(pos) {
               // $scope.map.setView([pos.coords.latitude, pos.coords.longitude], 9);
                //alert(pos.coords.latitude);
                //alert(pos.coords.longitude);

                for(i=0;i<$scope.events.length;i++){
                   
                    var placeLat = parseFloat($scope.geo.features[i].geometry.coordinates[1].toFixed(5)) // lat
                    var placeLong = parseFloat($scope.geo.features[i].geometry.coordinates[0].toFixed(5)) // long
                    
                    var myLat = parseFloat(pos.coords.latitude.toFixed(5))
                    var myLong = parseFloat(pos.coords.longitude.toFixed(5))
                    // console.log('my long-'+pos.coords.latitude)
                    // console.log('my lat-'+pos.coords.longitude)
                    // console.log('place long-'+placeLat)
                    // console.log('place lat-'+placeLong)

                    //console.log(placeLong + "-" + myLong)
                    //console.log(Math.abs(placeLong-myLong).toFixed(3))
                    if(Math.abs(placeLong-myLong)<=0.0001 && Math.abs(placeLat-myLat)<=0.0001 ){

                        console.log("Alert!");

                            sweetAlert("Good Job!", "Found "+ $scope.geo.features[i].properties.title +"!", "success");
                            $scope.whereubin.push($scope.geo.features[i].properties.title);
                            $scope.whereubin = [{'text': "Hello"}];
                            //console.log($scope.whereubin);
                            $http.get('https://hacklancaster.herokuapp.com/nearby/'+$scope.geo.features[i].id)
                    }

                    

                }
                
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };
		
        
        $scope.centerOnMe = function() {
            if(!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setView([pos.coords.latitude, pos.coords.longitude], 9);
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        

    });

var HSSearch = {
    lastParams: false,
    placeSearch: false,
    autocomplete: false,
    callback: false,

    componentForm: {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    },

    labelConversion: {
        "street_number": 'street_number',
        "route": 'route',
        "locality": 'city',
        "administrative_area_level_1": 'state',
        "country": 'country',
        "postal_code": 'zip'
    },

    init: function () {
        this.placeInit();
        $(document).on("gotPosition", HSSearch.biasResults);
    },

    biasResults: function() {
        var geolocation = new google.maps.LatLng(
            window.userPosition.coords.latitude, window.userPosition.coords.longitude);
        HSSearch.autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
            geolocation));
    },

    placeInit: function() {
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        HSSearch.autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */(document.getElementById('searchInput')),
            { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        // do search
        google.maps.event.addListener(HSSearch.autocomplete, 'place_changed', function() {
            HSSearch.fillInAddress();
        });
    },

    fillInAddress: function() {
        // Get the place details from the autocomplete object.
        var place = HSSearch.autocomplete.getPlace();

        // Get place lat/lon
        var params = {};
        params["lat"] = place.geometry.location.d;
        params["lon"] = place.geometry.location.e;
        params["full"] = $("#stormSearchInput").val();

        // Get each component of the address from the place details
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (HSSearch.labelConversion[addressType]) {
                var lbl = HSSearch.labelConversion[addressType];
                params[lbl] = place.address_components[i][HSSearch.componentForm[addressType]];
                if(addressType == "country" && params[lbl] != "United States") {
                    $("#stormSearchInput").val("");
                    alert("Only US Locations are supported at this time.");
                    return;
                }
            }
        }

        console.log(params);
    }
};

var mapStyle = {
    "attribution": "<a href='http://mapbox.com/about/maps' target='_blank'>Terms & Feedback</a>",
    "autoscale": true,
    "bounds": [
        -180,
        -85.0511,
        180,
        85.0511
    ],
    "center": [
        -77.03643321990967,
        38.89546690844457,
        16
    ],
    "description": "A painstakingly hand-drawn representation of the entire world. 2B graphite on acid-free paper.",
    "filesize": 212410,
    "id": "examples.a4c252ab",
    "maxzoom": 21,
    "minzoom": 0,
    "name": "Pencil",
    "private": true,

    "zoomAnimation": false, 
    "fadeAnimation": false, 
    "intertia": false, 

    "scheme": "xyz",
    "source": "mapbox:///mapbox.mapbox-streets-v4",
    "tilejson": "2.0.0",
    "tiles": [
        "https://a.tiles.mapbox.com/v4/examples.a4c252ab/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q",
        "https://b.tiles.mapbox.com/v4/examples.a4c252ab/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q"
    ],
    "webpage": "https://a.tiles.mapbox.com/v4/examples.a4c252ab/page.html?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q"
};
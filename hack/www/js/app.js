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

        $urlRouterProvider.otherwise("/event/start");
    })

    .controller('MainCtrl', function($scope,$http) {
      var responsePromise = $http.get("https://hacklancaster.herokuapp.com/events")
          .success(function(data, status, headers, config) {
            $scope.events = data.events;

            console.log(data.events);
        })

        $scope.chosenPeriod = null;
    })

    .controller('InfoCtrl', function($scope) {
        console.log('INFO');
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
            $location.path('event/home');

            $scope.chosenPeriod = chosenPeriod;

        }

    })

    .controller('MapCtrl', function($scope, $ionicLoading,$rootScope,$location,$http) {

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

        function initialize() {
            $http.get('https://hacklancaster.herokuapp.com/catogories/' + $scope.chosenPeriod).success(function(geo) {
                var map = L.mapbox.map('map', {
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
                    "scheme": "xyz",
                    "source": "mapbox:///mapbox.mapbox-streets-v4",
                    "tilejson": "2.0.0",
                    "tiles": [
                        "https://a.tiles.mapbox.com/v4/examples.a4c252ab/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q",
                        "https://b.tiles.mapbox.com/v4/examples.a4c252ab/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q"
                    ],
                    "webpage": "https://a.tiles.mapbox.com/v4/examples.a4c252ab/page.html?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q"
                }).setView([54.0498942, -2.8055977], 15)

                var featureLayer = L.mapbox.featureLayer(geo)
                    .addTo(map);

                featureLayer.eachLayer(function(layer) {

                    // here you call `bindPopup` with a string of HTML you create - the feature
                    // properties declared above are available under `layer.feature.properties`
                    if (layer.feature.id){
                        var content = '<h2>'+layer.features.properties.title+'<\/h2>'+'<br><div style="font-size:10px">'+feature.properties.description+'</div>'
                    layer.bindPopup(content);
                }
                });


            });
            // Stop the side bar from dragging when mousedown/tapdown on the map
            L.DomEvent.addListener(document.getElementById('map'), 'mousedown', function(e) {
                e.preventDefault();
                return false;
            });

            $scope.map = map;

            //$scope.centerOnMe();
            HSSearch.init();
        }
			
		L.DomEvent.addListener(window, 'load', initialize);

        
        $rootScope.$on('$locationChangeSuccess', initialize);
        
        
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

        var controller = new Leap.Controller();
        controller.connect();

        controller.on('frame', onFrame);

        function onFrame(frame)
        {
            for ( var i = 0; i < frame.pointables.length; i++) {

            }
            
        }

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
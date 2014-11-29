
cacheTheCastle.controller('MapCtrl', function($scope, $ionicLoading,$rootScope,$location) {

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

        console.log('init called');

       if ( $('#map').children().length == 0 ) {
            // do something
            console.log('here called')
            map = L.mapbox.map('map', {
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
            }).setView([54.0498942, -2.8055977], 18);

            // Stop the side bar from dragging when mousedown/tapdown on the map
            L.DomEvent.addListener(document.getElementById('map'), 'mousedown', function (e) {
                e.preventDefault();
                return false;
            });

            $scope.map = map;

            //$scope.centerOnMe();
            HSSearch.init();
        }
     }

    L.DomEvent.addListener(window, 'load', initialize);

    
    $rootScope.$on('$locationChangeSuccess',initialize);
    
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
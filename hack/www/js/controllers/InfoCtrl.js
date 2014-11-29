cacheTheCastle.controller('InfoCtrl', function($scope) {
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
});
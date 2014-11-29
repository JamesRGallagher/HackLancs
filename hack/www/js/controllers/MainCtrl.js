cacheTheCastle.controller('MainCtrl', function($scope,$http) {
  var responsePromise = $http.get("https://hacklancaster.herokuapp.com/events")
      .success(function(data, status, headers, config) {
        $scope.places = data.Places;
    })

  responsePromise.then( function(data) {
  	console.log(data);
  });
  
});
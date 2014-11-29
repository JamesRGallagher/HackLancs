cacheTheCastle.config(function($stateProvider, $urlRouterProvider) {

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

    $urlRouterProvider.otherwise("/event/home");
});
angular.module('facebookUtilsDemo', ['facebookUtils'])
  .value('facebookConfigSettings', {
    'routingEnabled' : true,
    'firebaseURL' : 'https://davidchang.firebaseio.com/backUp',
    'channelFile' : 'channel.html'
  })
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'demo/partials/main.html',
      controller: function ($rootScope, $scope, facebookSDK) {
        $rootScope.loggedInUser = {};

        $scope.facebookResponse = {};

        $scope.$on('fbLoginSuccess', function(name, response) {

          $scope.facebookResponse = response;

          facebookSDK.api('/me').then(function(response) {
            $rootScope.loggedInUser = response;
          });
        });

        $scope.$on('fbLogoutSuccess', function() {

          $scope.$apply(function() {
            $scope.facebookResponse = {};
          });

        });
      }
    })
    .when('/loginButton', {
      templateUrl: 'demo/partials/loginButton.html',
      controller: function() {}
    })
    .when('/routing', {
      templateUrl: 'demo/partials/routing.html',
      controller: function() {}
    })
    .when('/private', {
      templateUrl: 'demo/partials/private.html',
      controller: function($scope, $rootScope) {
        $scope.dataDump = angular.toJson($rootScope.loggedInUser, true);
      },
      needAuth: true
    })
    .otherwise({
      redirectTo: '/'
    });
  });
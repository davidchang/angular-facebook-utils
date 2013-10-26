angular.module('facebookUtilsDemo', ['facebookUtils'])
  .value('facebookConfigSettings', {
    'routingEnabled' : true,
    'firebaseURL' : 'https://davidchang.firebaseio.com/backUp',
    'channelFile' : 'channel.html'
  })
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'demo/partials/main.html',
      controller: function($rootScope, $scope) {
        $scope.facebookResponse = {};
        $rootScope.$on('fbLoginSuccess', function(name, response) {
          $scope.facebookResponse = response;
        });
        $rootScope.$on('fbLogoutSuccess', function() {
          $scope.$apply(function() {
            $scope.facebookResponse = {};
          });
        });
      }
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
  })
  .controller('RootCtrl', function($rootScope, $scope, facebookSDK) {
    $rootScope.loggedInUser = {};

    $rootScope.$on('fbLoginSuccess', function(name, response) {
      facebookSDK.api('/me').then(function(response) {
        console.log(response);
        $rootScope.loggedInUser = response;
      });
    });

    $rootScope.$on('fbLogoutSuccess', function() {
      $scope.$apply(function() {
        $rootScope.loggedInUser = {};
      });
    });
  });
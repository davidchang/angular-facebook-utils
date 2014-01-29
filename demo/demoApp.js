angular.module('facebookUtilsDemo', ['facebookUtils', 'ngRoute'])
  .constant('facebookConfigSettings', {
    'routingEnabled' : true,
    'channelFile'    : 'channel.html',
    'appID'          : '629661603722657'
  })
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl : 'demo/partials/main.html',
      controller  : angular.noop
    })
    .when('/private', {
      templateUrl : 'demo/partials/private.html',
      controller  : angular.noop,
      needAuth    : true
    })
    .otherwise({
      redirectTo  : '/'
    });
  })
  .controller('RootCtrl', function($rootScope, $scope, facebookUser) {
    $rootScope.loggedInUser = {};

    $rootScope.$on('fbLoginSuccess', function(name, response) {
      facebookUser.then(function(user) {
        user.api('/me').then(function(response) {
          $rootScope.loggedInUser = response;
        });
      });
    });

    $rootScope.$on('fbLogoutSuccess', function() {
      $scope.$apply(function() {
        $rootScope.loggedInUser = {};
      });
    });
  });

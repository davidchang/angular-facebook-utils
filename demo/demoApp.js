angular.module('facebookUtilsDemo', ['facebookUtils'])
  .value('facebookConfigSettings', {
    'routingEnabled' : true,
    'firebaseURL' : 'https://davidchang.firebaseio.com/backUp3',
    'channelFile' : 'channel.html'
  })
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'demo/partials/main.html',
      controller: angular.noop
    })
    .when('/private', {
      templateUrl: 'demo/partials/private.html',
      controller: angular.noop,
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
        $rootScope.loggedInUser = response;
      });
    });

    $rootScope.$on('fbLogoutSuccess', function() {
      $scope.$apply(function() {
        $rootScope.loggedInUser = {};
      });
    });
  });
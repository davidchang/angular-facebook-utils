'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', [
    'angularFire', 'facebookSDK', 'facebookConfigSettings',
    function (angularFire, facebookSDK, facebookConfigSettings) {
      return {
        templateUrl: 'src/views/facebookLoginPartialFirebase.html',
        restrict: 'E',
        replace: true,
        scope: { },
        link: function postLink($scope, $element, $attrs) {

          //if showConfigure attribute is true OR facebook SDK couldn't be initialized (presumably from no App ID)
          var showConfigure = $attrs.showConfigure || !facebookSDK.wasInitialized;

          $scope.signInOrConfigure = function() {
            if (!showConfigure) {
              if (!$scope.connected) {
                facebookSDK.login();
              } else {
                facebookSDK.logout();
              }
            } else {
              $scope.configureLocation = window.location.origin;
              $scope.showConfigure = true;
            }
          };

          $scope.$on('fbLoginSuccess', function() {
            $scope.connected = true;
          });

          $scope.$on('fbLogoutSuccess', function() {
            $scope.$apply(function() {
              $scope.connected = false;
            });
          });

          if (showConfigure) {

            var firebaseUrl = facebookConfigSettings.firebaseURL;

            if (!firebaseUrl) {
              throw new Error('You\'ll need to either specify a Firebase URL or App ID via application value');
            }

            var ref = new Firebase(firebaseUrl);

            $scope.facebook = {
              appId : '',
            };

            angularFire(ref, $scope, 'facebook');

            $scope.$watch('facebook', function(val) {
              $scope.newAppId = $scope.facebook.appId;
            }, true);

            $scope.saveConfiguration = function() {
              if ($scope.newAppId) {
                var originalID = $scope.facebook.appId;

                if ($scope.newAppId === originalID) {
                  if (!$scope.connected) {
                    facebookSDK.login();
                  } else {
                    facebookSDK.logout();
                  }
                  $scope.showConfigure = false;
                } else {
                  $scope.reloading = true;
                  $scope.facebook.appId = $scope.newAppId;
                  setTimeout(function() {
                    location.reload();
                  }, 1000);
                }
              }
            }

          }
        }
      };
    }
  ]
);

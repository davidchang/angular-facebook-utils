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

          if ($attrs.permissions) {
            facebookSDK.setPermissions($attrs.permissions);
          }
          if ($attrs.channelFile) {
            facebookSDK.setChannelFile($attrs.channelFile);
          }

          $scope.signInOrConfigure = function() {
            if (!$attrs.showConfigure) {
              if (!$scope.connected) {
                facebookSDK.login();
              } else {
                facebookSDK.logout();
              }
            } else {
              $scope.configureLocation = window.location.origin;
              $scope.showConfigure = true;
            }
          }

          $scope.$on('fbLoginSuccess', function() {
            $scope.connected = true;
          });

          $scope.$on('fbLogoutSuccess', function() {
            $scope.$apply(function() {
              $scope.connected = false;
            });
          });

          if ($attrs.showConfigure) {

            var firebaseUrl = $attrs.firebase || facebookConfigSettings.firebaseURL;

            if (!firebaseUrl) {
              throw new Error('You\'ll need to either specify a Firebase URL via attribute or application value or provide the app-id attribute on the directive');
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

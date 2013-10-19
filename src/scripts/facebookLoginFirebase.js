'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', [
    'angularFire', 'facebookSDK', 'facebookAppID', 'facebookFirebaseURL',
    function (angularFire, facebookSDK, facebookAppID, facebookFirebaseURL) {
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

          var needToConfigure = $attrs.showConfigure;

          $scope.signInOrConfigure = function() {
            if (facebookSDK.wasInitialized()) {
              if (!$scope.connected) {
                facebookSDK.login();
              } else {
                facebookSDK.logout();
              }
            } else {
              needToConfigure = true;
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

          if (($attrs.appId || facebookAppID) && !needToConfigure) {

            facebookSDK.initializeFb($attrs.appId || facebookAppID);

          } else {

            var firebaseUrl = $attrs.firebase || facebookFirebaseURL;

            if (!firebaseUrl) {
              throw new Error('You\'ll need to either specify a Firebase URL via attribute or application value or provide the app-id attribute on the directive');
            }

            var ref = new Firebase(firebaseUrl);

            $scope.facebook = {
              appId : '',
            };

            angularFire(ref, $scope, 'facebook');

            $scope.$watch('facebook', function(val) {
              if (!needToConfigure && val.appId) {
                facebookSDK.initializeFb(val.appId);
              } else if (needToConfigure) {
                $scope.newAppId = $scope.facebook.appId;
              }
            }, true);

            $scope.saveConfiguration = function() {
              if ($scope.newAppId) {
                $scope.facebook.appId = $scope.newAppId;

                facebookSDK.initializeFb($scope.newAppId, true);
                $scope.showConfigure = false;
              }
            }

          }
        }
      };
    }
  ]
);

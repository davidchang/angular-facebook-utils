'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', ['facebookSDK', function (facebookSDK) {
    return {
      templateUrl: 'src/views/facebookLoginPartial.html',
      restrict: 'E',
      replace: true,
      scope: { },
      link: function postLink($scope, $element, $attrs) {

        facebookSDK.setPermissions($attrs.permissions);

        if ($attrs.channelFile) {
          facebookSDK.setChannelFile($attrs.channelFile);
        }

        $scope.signInOrConfigure = function() {
          if (!$scope.connected) {
            facebookSDK.login();
          } else {
            facebookSDK.logout();
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

        if (!$attrs.appId) {
          throw new Error('You must provide an app-id for the facebook-login directive to work!');
        }

        facebookSDK.initializeFb($attrs.appId);
      }
    };
  }]);

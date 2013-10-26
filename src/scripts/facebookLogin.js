'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', ['facebookSDK', function (facebookSDK) {
    return {
      templateUrl: 'src/views/facebookLoginPartial.html',
      restrict: 'E',
      replace: true,
      scope: { },
      link: function postLink($scope, $element, $attrs) {

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
      }
    };
  }]);

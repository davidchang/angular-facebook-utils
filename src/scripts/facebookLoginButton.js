'use strict';

// TODO : remove $rootScope, because everything should be able to exist on $scope alone?
angular.module('facebookUtils')
  .directive('facebookLoginButton', [
    '$rootScope', 'facebookUser', 'facebookConfigSettings',
    function ($rootScope, facebookUser, facebookConfigSettings) {
      return {
        templateUrl: 'src/views/facebookLoginPartial.html',
        restrict: 'E',
        replace: true,
        scope: false,
        link: function postLink($scope, $element, $attrs) {

          $scope.signInOrConfigure = function() {
            if ($rootScope.connectedToFB) {
              facebookUser.logout();
              return;
            }

            if (facebookConfigSettings.appID) {
              if (!$rootScope.connectedToFB) {
                facebookUser.login();
              } else {
                facebookUser.logout();
              }
            } else {
              $scope.configureLocation = window.location.origin;
              $scope.showConfigure = true;
            }
          };

          $scope.$on('fbLoginSuccess', function() {
            $rootScope.connectedToFB = true;
          });

          $scope.$on('fbLogoutSuccess', function() {
            $scope.$apply(function() {
              $rootScope.connectedToFB = false;
            });
          });

        }
      };
    }
  ]);

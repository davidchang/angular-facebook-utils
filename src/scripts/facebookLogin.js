'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', [
    '$rootScope', 'facebookSDK',
    function ($rootScope, facebookSDK) {
      return {
        templateUrl: 'src/views/facebookLoginPartial.html',
        restrict: 'E',
        replace: true,
        scope: false,
        link: function postLink($scope, $element, $attrs) {

          //if showConfigure attribute is true OR facebook SDK couldn't be initialized (presumably from no App ID)
          var showConfigure = $attrs.showConfigure || facebookSDK.cantInitialize;

          $scope.signInOrConfigure = function() {
            if ($rootScope.connectedToFB) {
              facebookSDK.logout();
              return;
            }

            if (!showConfigure) {
              if (!$rootScope.connectedToFB) {
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

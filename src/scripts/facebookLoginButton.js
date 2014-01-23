'use strict';

angular.module('facebookUtils')
  .directive('facebookLoginButton', [
    'facebookUser',
    function (facebookUser) {
      return {
        templateUrl: 'src/views/facebookLoginPartial.html',
        restrict: 'E',
        replace: true,
        scope: false,
        link: function postLink($scope, $element, $attrs) {

          facebookUser.then(function(user) {

            $scope.signInOrConfigure = function() {
              var action = !user.loggedIn ? 'login' : 'logout';
              user[action]();
            };

            var syncLoggedIn = function() {
              $scope.connectedToFB = user.loggedIn;
            };

            $scope.$on('fbLoginSuccess', syncLoggedIn);

            $scope.$on('fbLogoutSuccess', function() {
              $scope.$apply(function() {
                syncLoggedIn();
              });
            });

            syncLoggedIn();

          }, function() {

            $scope.signInOrConfigure = function() {
              $scope.configureLocation = window.location.origin;
              $scope.showConfigure = true;
            };

          });

        }
      };
    }
  ]);

'use strict';

var application = angular.module('facebookUtils', [])
  .value('facebookAppID', '')
  .value('facebookPermissions', '')
  .value('facebookChannelFile', 'bower_components/angular-facebook-utils/channel.html').value('facebookRoutingEnabled', false)
  .value('facebookRoutingEnabled', false)
  .value('facebookLoginPath', '/')
  .run([
    'facebookRoutingEnabled',
    'facebookLoginPath',
    '$rootScope',
    '$location',
    'facebookSDK',
    function(
      facebookRoutingEnabled,
      facebookLoginPath,
      $rootScope,
      $location,
      facebookSDK) {
        if (facebookRoutingEnabled) {
          $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.needAuth && !facebookSDK.loggedIn) {
              // reload the login route
              $location.path(facebookLoginPath);
            }
            /*
            * NOTE:
            * It's important to repeat the control also in the backend,
            * before sending back from the server reserved information.
            */
          });
        }
      }
  ]);
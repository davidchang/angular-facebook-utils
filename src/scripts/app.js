'use strict';

var application = angular.module('facebookUtils', [])
  .value('facebookConfigSettings', {
    'appID' : '',
    'permissions' : '',
    'channelFile' : 'bower_components/angular-facebook-utils/channel.html',
    'routingEnabled' : false,
    'loginPath' : '/'
  })
  .run([
    'facebookConfigSettings',
    '$rootScope',
    '$location',
    'facebookSDK',
    function(
      facebookConfigSettings,
      $rootScope,
      $location,
      facebookSDK) {
        if (facebookConfigSettings.routingEnabled) {
          $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.needAuth && !facebookSDK.loggedIn) {
              // reload the login route
              $location.path(facebookConfigSettings.loginPath);
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
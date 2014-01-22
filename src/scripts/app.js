'use strict';

var defaultSettings = {
  'appID'          : '',
  'permissions'    : '',
  'channelFile'    : 'bower_components/angular-facebook-utils/channel.html',
  'routingEnabled' : false,
  'loginPath'      : '/'
};

var application = angular.module('facebookUtils', ['ngRoute'])
  .constant('facebookConfigDefaults', defaultSettings)
  .constant('facebookConfigSettings', defaultSettings)
  .config([
    'facebookConfigSettings', 'facebookConfigDefaults', '$provide',
    function(facebookConfigSettings, facebookConfigDefaults, $provide) {
      for(var key in facebookConfigDefaults) {
        if (facebookConfigSettings[key] === undefined) {
          facebookConfigSettings[key] = facebookConfigDefaults[key];
        }
      }
    }])
  .run(['facebookConfigSettings', 'facebookConfigDefaults', '$rootScope', '$location', 'facebookSDK',
    function(facebookConfigSettings, facebookConfigDefaults, $rootScope, $location, facebookSDK, $route) {

      //handle routing
      if (facebookConfigSettings.routingEnabled) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
          if (next && next.$$route && next.$$route.needAuth) {
            facebookSDK.then(function() {

              if (!facebookSDK.loggedIn) {
                // reload the login route
                $location.path(facebookConfigSettings.loginPath);
              }
            });
          }
          /*
          * NOTE:
          * It's important to repeat the control also in the backend,
          * before sending back from the server reserved information.
          */
        });

        $rootScope.$on('fbLogoutSuccess', function() {
          if ($route.current.$$route.needAuth) {
            // reload the login route
            $location.path(facebookConfigSettings.loginPath);
          }
        });
      }
    }
  ]);
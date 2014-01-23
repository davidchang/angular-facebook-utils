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
  .run([
    'facebookConfigSettings', 'facebookConfigDefaults', '$rootScope', '$location', 'facebookUser', '$route',
    function(facebookConfigSettings, facebookConfigDefaults, $rootScope, $location, facebookUser, $route) {

      //handle routing
      if (facebookConfigSettings.routingEnabled) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {

          if (next && next.$$route && next.$$route.needAuth) {
            facebookUser.then(function(user) {
              if (!user.loggedIn) {
                // reload the login route
                $location.path(facebookConfigSettings.loginPath || facebookConfigDefaults.loginPath);
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
            $location.path(facebookConfigSettings.loginPath || facebookConfigDefaults.loginPath);
          }
        });
      }
    }
  ]);
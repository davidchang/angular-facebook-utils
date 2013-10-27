'use strict';

var defaultSettings = {
  'firebaseURL'    : '',
  'appID'          : '',
  'permissions'    : '',
  'channelFile'    : 'bower_components/angular-facebook-utils/channel.html',
  'routingEnabled' : false,
  'loginPath'      : '/'
};

var application = angular.module('facebookUtils', ['firebase'])
  .constant('facebookConfigDefaults', defaultSettings)
  .value('facebookConfigSettings', defaultSettings)
  .run([
    'facebookConfigSettings',
    'facebookConfigDefaults',
    '$rootScope',
    '$location',
    'facebookSDK',
    'angularFireCollection',
    '$route',
    function(
      facebookConfigSettings,
      facebookConfigDefaults,
      $rootScope,
      $location,
      facebookSDK,
      angularFireCollection,
      $route) {
        for(var key in facebookConfigDefaults) {
          if (facebookConfigSettings[key] === undefined) {
            facebookConfigSettings[key] = facebookConfigDefaults[key];
          }
        }

        //handle initialization
        if (facebookConfigSettings.appID) {
          facebookSDK.initializeFb(facebookConfigSettings.appID);
        } else if (facebookConfigSettings.firebaseURL) {
          angularFireCollection(new Firebase(facebookConfigSettings.firebaseURL), function(snapshot) {
            var val = snapshot.val();
            if (val && val.appId) {
              facebookSDK.initializeFb(val.appId);
            } else {
              facebookSDK.cantInitialize = true;
            }
          });
        } else {
          facebookSDK.cantInitialize = true;
        }

        //handle routing
        if (facebookConfigSettings.routingEnabled) {
          $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next && next.$$route && next.$$route.needAuth) {
              facebookSDK.getInitializedPromise().then(function() {

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
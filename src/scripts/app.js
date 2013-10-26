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
        //handle initialization
        if (facebookConfigSettings.appID) {
          facebookSDK.initializeFb(facebookConfigSettings.appID);
        } else if (facebookConfigSettings.firebaseURL) {
          angularFireCollection(new Firebase(facebookConfigSettings.firebaseURL), function(snapshot) {
            var id = snapshot.val().appId;
            if (id) {
              facebookSDK.initializeFb(id);
            }
          });
        }

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
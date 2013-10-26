'use strict';

var application = angular.module('facebookUtils', ['firebase'])
  .value('facebookConfigSettings', {
    'firebaseURL' : '',
    'appID' : '',
    'permissions' : '',
    'channelFile' : 'bower_components/angular-facebook-utils/channel.html',
    'routingEnabled' : false,
    'loginPath' : '/',
    'signedInPath' : '/#/main'
  })
  .run([
    'facebookConfigSettings',
    '$rootScope',
    '$location',
    'facebookSDK',
    'angularFireCollection',
    function(
      facebookConfigSettings,
      $rootScope,
      $location,
      facebookSDK,
      angularFireCollection) {
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

        //handle routing
        if (facebookConfigSettings.routingEnabled) {
          $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.needAuth) {
              if (facebookSDK.initialized) {
                facebookSDK.checkStatus().then(angular.noop, function() {
                  // reload the login route
                  $location.path(facebookConfigSettings.loginPath);
                });
              }
              else {
                //you will want to check after facebookSDK initializes, have a queue or something
              }
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
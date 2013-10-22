'use strict';

var application = angular.module('facebookUtils', ['firebase'])
  .value('facebookFirebaseURL', '')
  .value('facebookAppID', '')
  .value('facebookPermissions', '')
  .value('facebookChannelFile', 'bower_components/angular-facebook-utils/channel.html')
  .value('facebookRoutingEnabled', false)
  .value('facebookLoginPath', '/')
  .run([
    'facebookRoutingEnabled',
    'facebookLoginPath',
    '$rootScope',
    '$location',
    'facebookSDK',
    'facebookAppID',
    'facebookFirebaseURL',
    'angularFireCollection',
    function(
      facebookRoutingEnabled,
      facebookLoginPath,
      $rootScope,
      $location,
      facebookSDK,
      facebookAppID,
      facebookFirebaseURL,
      angularFireCollection) {
        //handle initialization
        if (facebookAppID) {
          facebookSDK.initializeFb(facebookAppID);
        } else if (facebookFirebaseURL) {
          angularFireCollection(new Firebase(facebookFirebaseURL), function(snapshot) {
            var id = snapshot.val().appId;
            if (id) {
              facebookSDK.initializeFb(id);

              setTimeout(function() {
                console.log('alert!');
                facebookSDK.initializeFb('335763733225618');
              }, 5000);
            }
          });
        }

        //handle routing
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
'use strict';

angular.module('facebookUtils')
  .provider('facebookSDK', function() {

    // https://developers.facebook.com/docs/facebook-login/getting-started-web/

    var loadScript = function(d, cb) {
      var js = d.createElement('script');
      js.async = true;
      js.src = '//connect.facebook.net/en_US/all.js';
      js.onreadystatechange = function() {
        if (this.readyState == 'complete') {
          cb();
        }
      }
      js.onload = cb;
      d.getElementsByTagName('body')[0].appendChild(js);
    }

    this.$get = [
      '$q', 'facebookConfigDefaults', 'facebookConfigSettings', '$timeout',
      function($q, facebookConfigDefaults, facebookConfigSettings, $timeout) {
        var deferred = $q.defer();

        if (!facebookConfigSettings.appID) {
          deferred.reject('You must provide an app-id for the facebook-login directive to work!');
        } else {
          loadScript(document, function(callback) {
            FB.init({
              appId      : facebookConfigSettings.appID, // App ID
              channelUrl : facebookConfigSettings.channelFile || facebookConfigDefaults.channelFile, // Channel File
              status     : true, // check login status
              cookie     : true // enable cookies to allow the server to access the session
            });
            $timeout(function() {
              deferred.resolve(FB);
            });
          });
        }

        return deferred.promise;
      }
    ];

  });
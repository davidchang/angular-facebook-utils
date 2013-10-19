'use strict';

angular.module('facebookUtils')
  .service('facebookSDK', [
    '$window', '$rootScope', '$q', 'facebookPermissions', 'facebookChannelFile', 'facebookAppID',
    function($window, $rootScope, $q, facebookPermissions, facebookChannelFile, facebookAppID) {

      var SDK = function(){};

      SDK.permissions = facebookPermissions;
      SDK.initialized = false;
      SDK.channelFile = facebookChannelFile;

      SDK.prototype.wasInitialized = function() {
        return this.initialized;
      };

      SDK.prototype.setPermissions = function(permissions) {
        if (permissions) {
          this.permissions = permissions;
        }
      };

      SDK.prototype.setChannelFile = function(newFile) {
        if (newFile) {
          this.channelFile = newFile;
        }
      };

      SDK.prototype.api = function() {
        var deferred = $q.defer();
        var args = [].splice.call(arguments,0);
        args.push(function(response) {
          $rootScope.$apply(function() {
            deferred.resolve(response);
          });
        });

        FB.api.apply(FB, args);

        return deferred.promise;
      };

      SDK.prototype.login = function() {
        var _self = this;
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            $rootScope.$broadcast('fbLoginSuccess', response);
          } else {
            FB.login(function(response) {
              if (response.authResponse) {
                response.userNotAuthorized = true;
                $rootScope.$broadcast('fbLoginSuccess', response);
              } else {
                $rootScope.$broadcast('fbLoginFailure');
              }
            }, { 'scope' : _self.permissions });
          }
        }, true);
      };

      SDK.prototype.logout = function() {
        FB.logout(function(response) {
          if (response) {
            $rootScope.$broadcast('fbLogoutSuccess');
          } else {
            $rootScope.$broadcast('fbLogoutFailure');
          }
        });
      };

      SDK.prototype.initializeFb = function(appId, tryToLogin) {
        // https://developers.facebook.com/docs/facebook-login/getting-started-web/
        var _self = this;

        _self.initialized = true;

        if (!appId && !facebookAppID) {
          throw new Error('You must provide an app-id for the facebook-login directive to work!');
        }

        // Additional JS functions here
        $window.fbAsyncInit = function() {
          FB.init({
            appId      : appId || facebookAppID, // App ID
            channelUrl : _self.channelFile, // Channel File
            status     : true, // check login status
            cookie     : true // enable cookies to allow the server to access the session
          });

          if (tryToLogin) {
            _self.login();
          }

          FB.Event.subscribe('auth.authResponseChange', function(response) {
            $rootScope.$broadcast('fbStatusChange', response);
          });

        };

        // Load the SDK asynchronously
        (function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";
           ref.parentNode.insertBefore(js, ref);
         }(document));
      };

      return new SDK();
    }
  ]);

'use strict';

angular.module('facebookUtils')
  .service('facebookSDK', [
    '$window', '$rootScope', '$q', 'facebookConfigSettings',
    function($window, $rootScope, $q, facebookConfigSettings) {

      var SDK = function(){};

      SDK.permissions = facebookConfigSettings.permissions;
      SDK.channelFile = facebookConfigSettings.channelFile;

      SDK.initialized = false;
      SDK.loggedIn = false;
      SDK.cantInitialize = false;

      SDK.prototype.getInitializedPromise = function() {
        var deferred = $q.defer();
        var $this = this;
        var check = function() {
          if($this.initialized) {
            deferred.resolve();
          } else {
            if ($this.cantInitialize) {
              deferred.reject();
            } else {
              setTimeout(check, 50);
            }
          }
        };
        check();
        return deferred.promise;
      }

      SDK.prototype.api = function() {
        var deferred = $q.defer();
        var args = [].splice.call(arguments, 0);
        args.push(function(response) {
          $rootScope.$apply(function() {
            deferred.resolve(response);
          });
        });

        FB.api.apply(FB, args);

        return deferred.promise;
      };

      SDK.prototype.checkStatus = function() {
        var $this = this;
        var deferred = $q.defer();
        FB.getLoginStatus(function(response) {
          $rootScope.$apply(function() {
            if (response.status === 'connected') {
              $this.loggedIn = true;
              deferred.resolve(response);
            } else {
              $this.loggedIn = false;
              deferred.reject(response);
            }
          });
        }, true);

        return deferred.promise;
      };

      SDK.prototype.login = function() {
        var _self = this;

        _self.checkStatus().then(function(response) {
          $rootScope.$broadcast('fbLoginSuccess', response);
          _self.loggedIn = true;
        }, function() {
          FB.login(function(response) {
            if (response.authResponse) {
              response.userNotAuthorized = true;
              $rootScope.$broadcast('fbLoginSuccess', response);
              _self.loggedIn = true;
            } else {
              $rootScope.$broadcast('fbLoginFailure');
              _self.loggedIn = false;
            }
          }, { 'scope' : _self.permissions });
        });
      };

      SDK.prototype.logout = function() {
        var _self = this;
        FB.logout(function(response) {
          if (response) {
            $rootScope.$broadcast('fbLogoutSuccess');
            _self.loggedIn = false;
          } else {
            $rootScope.$broadcast('fbLogoutFailure');
          }
        });
      };

      SDK.prototype.initializeFb = function(appId) {
        // https://developers.facebook.com/docs/facebook-login/getting-started-web/
        var _self = this;

        if (!appId && !facebookConfigSettings.appID) {
          throw new Error('You must provide an app-id for the facebook-login directive to work!');
        }

        // Additional JS functions here
        $window.fbAsyncInit = function() {
          FB.init({
            appId      : appId || facebookConfigSettings.appID, // App ID
            channelUrl : _self.channelFile, // Channel File
            status     : true, // check login status
            cookie     : true // enable cookies to allow the server to access the session
          });

          FB.Event.subscribe('auth.authResponseChange', function(response) {
            $rootScope.$broadcast('fbStatusChange', response);
          });

          _self.initialized = true;

          _self.checkStatus().then(function(response) {
            $rootScope.$broadcast('fbLoginSuccess', response);
            _self.loggedIn = true;
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

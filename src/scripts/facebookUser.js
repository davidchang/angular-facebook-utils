'use strict';

// TODO: Move to be a provider that waits on facebookSDK to load, make sure to reject if facebookSDK can't load
angular.module('facebookUtils')
  .service('facebookUser', [
    '$window', '$rootScope', '$q', 'facebookConfigSettings', 'facebookSDK',
    function($window, $rootScope, $q, facebookConfigSettings, facebookSDK) {

      var FacebookUser = function(){};

      FacebookUser.loggedIn = false;

      FacebookUser.prototype.api = function() {
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

      FacebookUser.prototype.checkStatus = function() {
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

      FacebookUser.prototype.login = function() {
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
          }, { 'scope' : facebookConfigSettings.permissions });
        });
      };

      FacebookUser.prototype.logout = function() {
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

      return new FacebookUser();
    }
  ]);

'use strict';

angular.module('facebookUtils')
  .service('facebookUser', [
    '$window', '$rootScope', '$q', 'facebookConfigDefaults', 'facebookConfigSettings', 'facebookSDK',
    function($window, $rootScope, $q, facebookConfigDefaults, facebookConfigSettings, facebookSDK) {

      var FacebookUser = function(){};

      var checkStatus = function() {
        var deferred = $q.defer();
        FB.getLoginStatus(function(response) {
          $rootScope.$apply(function() {
            if (response.status === 'connected') {
              user.loggedIn = true;
              $rootScope.$broadcast('fbLoginSuccess', response);
              deferred.resolve(response);
            } else {
              user.loggedIn = false;
              deferred.reject(response);
            }
          });
        }, true);

        return deferred.promise;
      };

      FacebookUser.prototype.loggedIn = false;

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

      FacebookUser.prototype.login = function() {
        var _self = this;
        FB.login(function(response) {
          if (response.authResponse) {
            response.userNotAuthorized = true;
            _self.loggedIn = true;
            $rootScope.$broadcast('fbLoginSuccess', response);
          } else {
            _self.loggedIn = false;
            $rootScope.$broadcast('fbLoginFailure');
          }
        }, { 'scope' : facebookConfigSettings.permissions || facebookConfigDefaults.permissions });
      };

      FacebookUser.prototype.logout = function() {
        var _self = this;
        FB.logout(function(response) {
          if (response) {
            _self.loggedIn = false;
            $rootScope.$broadcast('fbLogoutSuccess');
          } else {
            $rootScope.$broadcast('fbLogoutFailure');
          }
        });
      };

      var user = new FacebookUser();

      var deferred = $q.defer();
      facebookSDK.then(function() {
        checkStatus()['finally'](function() {
          deferred.resolve(user);
        });
      }, function() {
        deferred.reject('SDK failed to load because your app ID wasn\'t set');
      });
      return deferred.promise;
    }
  ]);

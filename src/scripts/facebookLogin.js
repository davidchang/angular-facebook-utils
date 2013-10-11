'use strict';

angular.module('facebookUtils')
  .directive('facebookLogin', ['facebookSDK', function (facebookSDK) {
    return {
      template: '<div id="facebookLogin"><a ng-click="signInOrConfigure()" data-toggle="modal" data-target="#myModal" class="btn-auth btn-facebook"><span ng-hide="connected"> Sign in with <b>Facebook</b></span><span ng-show="connected"> Sign out </span></a><div class="modal" ng-class="{fade: !showConfigure, show: showConfigure}"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="showConfigure=false">&times;</button><h4 class="modal-title">Configure Facebook Login</h4></div><div class="modal-body"><div> First, you\'ll need to register your app on Facebook. Follow these steps: </div><ol class="marginTop"><li>Visit <a href="https://developers.facebook.com/apps" target="_blank">https://developers.facebook.com/apps</a></li><li>Create New App (Only a name is required.)</li><li>Set "Sandbox Mode" to "Disabled"</li><li>Under "Select how your app integrates with Facebook", expand "Website with Facebook Login".</li><li>Set Site URL to: http://localhost:3000/</li></ol><div> Now, copy over some details. </div><form role="form" class="marginTop"><div class="form-group"><label for="appIdInput">Facebook App ID:</label><input id="appIdInput" type="text" ng-model="newAppId" class="form-control" placeholder="App ID"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="showConfigure=false">I\'ll do this later</button><button type="button" ng-click="saveConfiguration()" class="btn btn-primary">Save configuration</button></div></div></div></div><div id="fb-root"></div></div>',
      restrict: 'E',
      replace: true,
      scope: { },
      link: function postLink($scope, $element, $attrs) {

        facebookSDK.setPermissions($attrs.permissions);

        $scope.signInOrConfigure = function() {
          if (!$scope.connected) {
            facebookSDK.login();
          } else {
            facebookSDK.logout();
          }
        }

        $scope.$on('fbLoginSuccess', function() {
          $scope.connected = true;
        });

        $scope.$on('fbLogoutSuccess', function() {

          $scope.$apply(function() {
            $scope.connected = false;
          });

        });

        if (!$attrs.appId) {
          throw new Error('You must provide an app-id for the facebook-login directive to work!');
        }

        facebookSDK.initializeFb($attrs.appId);
      }
    };
  }]);

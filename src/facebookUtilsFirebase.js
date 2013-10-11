(function(exports, global) {
    global["true"] = exports;
    "use strict";
    angular.module("facebookUtils", [ "firebase" ]);
    "use strict";
    angular.module("facebookUtils").service("facebookSDK", [ "$window", "$rootScope", function($window, $rootScope) {
        var SDK = function() {};
        SDK.permissions = "";
        SDK.initialized = false;
        SDK.prototype.wasInitialized = function() {
            return this.initialized;
        };
        SDK.prototype.setPermissions = function(permissions) {
            this.permissions = permissions || "";
        };
        SDK.prototype.login = function() {
            var _self = this;
            FB.getLoginStatus(function(response) {
                if (response.status === "connected") {
                    $rootScope.$broadcast("fbLoginSuccess", response);
                } else {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            response.userNotAuthorized = true;
                            $rootScope.$broadcast("fbLoginSuccess", response);
                        } else {
                            $rootScope.$broadcast("fbLoginFailure");
                        }
                    }, {
                        scope: _self.permissions
                    });
                }
            }, true);
        };
        SDK.prototype.logout = function() {
            FB.logout(function(response) {
                if (response) {
                    $rootScope.$broadcast("fbLogoutSuccess");
                } else {
                    $rootScope.$broadcast("fbLogoutFailure");
                }
            });
        };
        SDK.prototype.initializeFb = function(appId, tryToLogin) {
            var _self = this;
            _self.initialized = true;
            $window.fbAsyncInit = function() {
                FB.init({
                    appId: appId,
                    channelUrl: "channel.html",
                    status: true,
                    cookie: true
                });
                if (tryToLogin) {
                    _self.login();
                }
                FB.Event.subscribe("auth.authResponseChange", function(response) {
                    $rootScope.$broadcast("fbStatusChange", response);
                    if (response.status === "connected") {
                        $rootScope.$broadcast("fbLoginSuccess", response);
                    }
                });
            };
            (function(d) {
                var js, id = "facebook-jssdk", ref = d.getElementsByTagName("script")[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement("script");
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            })(document);
        };
        return new SDK();
    } ]);
    "use strict";
    angular.module("facebookUtils").directive("facebookLogin", [ "angularFire", "facebookSDK", function(angularFire, facebookSDK) {
        return {
            template: '<div id="facebookLogin"><a ng-click="signInOrConfigure()" data-toggle="modal" data-target="#myModal" class="btn-auth btn-facebook"><span ng-hide="connected"> Sign in with <b>Facebook</b></span><span ng-show="connected"> Sign out </span></a><div class="modal" ng-class="{fade: !showConfigure, show: showConfigure}"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="showConfigure=false">&times;</button><h4 class="modal-title">Configure Facebook Login</h4></div><div class="modal-body"><div> First, you\'ll need to register your app on Facebook. Follow these steps: </div><ol class="marginTop"><li>Visit <a href="https://developers.facebook.com/apps" target="_blank">https://developers.facebook.com/apps</a></li><li>Create New App (Only a name is required.)</li><li>Set "Sandbox Mode" to "Disabled"</li><li>Under "Select how your app integrates with Facebook", expand "Website with Facebook Login".</li><li>Set Site URL to: http://localhost:3000/</li></ol><div> Now, copy over some details. </div><form role="form" class="marginTop"><div class="form-group"><label for="appIdInput">Facebook App ID:</label><input id="appIdInput" type="text" ng-model="newAppId" class="form-control" placeholder="App ID"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="showConfigure=false">I\'ll do this later</button><button type="button" ng-click="saveConfiguration()" class="btn btn-primary">Save configuration</button></div></div></div></div><div id="fb-root"></div></div>',
            restrict: "E",
            replace: true,
            scope: {},
            link: function postLink($scope, $element, $attrs) {
                facebookSDK.setPermissions($attrs.permissions);
                var needToConfigure = $attrs.showConfigure;
                $scope.signInOrConfigure = function() {
                    if (facebookSDK.wasInitialized()) {
                        if (!$scope.connected) {
                            facebookSDK.login();
                        } else {
                            facebookSDK.logout();
                        }
                    } else {
                        needToConfigure = true;
                        $scope.showConfigure = true;
                    }
                };
                $scope.$on("fbLoginSuccess", function(name, response) {
                    $scope.connected = true;
                });
                $scope.$on("fbLogoutSuccess", function() {
                    $scope.$apply(function() {
                        $scope.connected = false;
                    });
                });
                if ($attrs.appId && !needToConfigure) {
                    facebookSDK.initializeFb($attrs.appId);
                } else {
                    var firebaseUrl = $attrs.firebase;
                    if (!firebaseUrl) {
                        throw new Error("You'll need to either specify a Firebase URL or provide app-id attribute on the directive");
                        return;
                    }
                    var ref = new Firebase(firebaseUrl);
                    $scope.facebook = {
                        appId: ""
                    };
                    angularFire(ref, $scope, "facebook");
                    $scope.$watch("facebook", function(val) {
                        if (!needToConfigure && val.appId) {
                            facebookSDK.initializeFb(val.appId);
                        } else if (needToConfigure) {
                            $scope.newAppId = $scope.facebook.appId;
                        }
                    }, true);
                    $scope.saveConfiguration = function() {
                        if ($scope.newAppId) {
                            $scope.facebook.appId = $scope.newAppId;
                            facebookSDK.initializeFb($scope.newAppId, true);
                            $scope.showConfigure = false;
                        }
                    };
                }
            }
        };
    } ]);
})({}, function() {
    return this;
}());
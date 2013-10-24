(function(exports, global) {
    global["true"] = exports;
    "use strict";
    var application = angular.module("facebookUtils", []).value("facebookConfigSettings", {
        appID: "",
        permissions: "",
        channelFile: "bower_components/angular-facebook-utils/channel.html",
        routingEnabled: false,
        loginPath: "/"
    }).run([ "facebookConfigSettings", "$rootScope", "$location", "facebookSDK", function(facebookConfigSettings, $rootScope, $location, facebookSDK) {
        if (facebookConfigSettings.routingEnabled) {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if (next.needAuth && !facebookSDK.loggedIn) {
                    $location.path(facebookConfigSettings.loginPath);
                }
            });
        }
    } ]);
    angular.module("facebookUtils").run([ "$templateCache", function($templateCache) {
        $templateCache.put("src/views/facebookLoginPartial.html", "<div id=facebookLogin><style>.marginTop {margin-top: 10px;}\n" + '    .btn-auth,.btn-auth:visited{position:relative;display:inline-block;height:22px;padding:0 1em;border:1px solid #999;border-radius:2px;margin:0;text-align:center;text-decoration:none;font-size:14px;line-height:22px;white-space:nowrap;cursor:pointer;color:#222;background:#fff;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:none;*overflow:visible;*display:inline;*zoom:1}.btn-auth:hover,.btn-auth:focus,.btn-auth:active{color:#222;text-decoration:none}.btn-auth:before{content:"";float:left;width:22px;height:22px;background:url(http://necolas.github.io/css3-social-signin-buttons/auth-icons.png) no-repeat 99px 99px}.btn-auth.large{height:36px;line-height:36px;font-size:20px}.btn-auth.large:before{width:36px;height:36px}.btn-auth::-moz-focus-inner{border:0;padding:0}.btn-facebook,.btn-facebook:visited{border-color:#29447e;border-bottom-color:#1a356e;color:#fff;background-color:#5872a7;background-image:-webkit-gradient(linear,0 0,0 100%,from(#637bad),to(#5872a7));background-image:-webkit-linear-gradient(#637bad,#5872a7);background-image:-moz-linear-gradient(#637bad,#5872a7);background-image:-ms-linear-gradient(#637bad,#5872a7);background-image:-o-linear-gradient(#637bad,#5872a7);background-image:linear-gradient(#637bad,#5872a7);-webkit-box-shadow:inset 0 1px 0 #879ac0;box-shadow:inset 0 1px 0 #879ac0}.btn-facebook:hover,.btn-facebook:focus{color:#fff;background-color:#3b5998}.btn-facebook:active{color:#fff;background:#4f6aa3;-webkit-box-shadow:inset 0 1px 0 #45619d;box-shadow:inset 0 1px 0 #45619d}.btn-facebook:before{border-right:1px solid #465f94;margin:0 1em 0 -1em;background-position:0 0}.btn-facebook.large:before{background-position:0 -22px}</style><a ng-click=signInOrConfigure() data-toggle=modal data-target=#myModal class="btn-auth btn-facebook"><span ng-hide=connected>Sign in with <b>Facebook</b></span> <span ng-show=connected>Sign out</span></a><div id=fb-root></div></div>');
    } ]);
    "use strict";
    angular.module("facebookUtils").service("facebookSDK", [ "$window", "$rootScope", "$q", "facebookConfigSettings", function($window, $rootScope, $q, facebookConfigSettings) {
        var SDK = function() {};
        SDK.permissions = facebookConfigSettings.permissions;
        SDK.channelFile = facebookConfigSettings.channelFile;
        SDK.initialized = false;
        SDK.loggedIn = false;
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
            var deferred = $q.defer();
            FB.getLoginStatus(function(response) {
                $rootScope.$apply(function() {
                    if (response.status === "connected") {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                });
            }, true);
            return deferred.promise;
        };
        SDK.prototype.login = function() {
            var _self = this;
            _self.checkStatus().then(function(response) {
                $rootScope.$broadcast("fbLoginSuccess", response);
                _self.loggedIn = true;
            }, function() {
                FB.login(function(response) {
                    if (response.authResponse) {
                        response.userNotAuthorized = true;
                        $rootScope.$broadcast("fbLoginSuccess", response);
                        _self.loggedIn = false;
                    } else {
                        $rootScope.$broadcast("fbLoginFailure");
                    }
                }, {
                    scope: _self.permissions
                });
            });
        };
        SDK.prototype.logout = function() {
            var _self = this;
            FB.logout(function(response) {
                if (response) {
                    $rootScope.$broadcast("fbLogoutSuccess");
                    _self.loggedIn = false;
                } else {
                    $rootScope.$broadcast("fbLogoutFailure");
                }
            });
        };
        SDK.prototype.initializeFb = function(appId) {
            var _self = this;
            _self.initialized = true;
            if (!appId && !facebookConfigSettings.appID) {
                throw new Error("You must provide an app-id for the facebook-login directive to work!");
            }
            $window.fbAsyncInit = function() {
                FB.init({
                    appId: appId || facebookConfigSettings.appID,
                    channelUrl: _self.channelFile,
                    status: true,
                    cookie: true
                });
                FB.Event.subscribe("auth.authResponseChange", function(response) {
                    $rootScope.$broadcast("fbStatusChange", response);
                });
                _self.checkStatus().then(function(response) {
                    $rootScope.$broadcast("fbLoginSuccess", response);
                    _self.loggedIn = true;
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
    angular.module("facebookUtils").directive("facebookLogin", [ "facebookSDK", function(facebookSDK) {
        return {
            templateUrl: "src/views/facebookLoginPartial.html",
            restrict: "E",
            replace: true,
            scope: {},
            link: function postLink($scope, $element, $attrs) {
                if ($attrs.permissions) {
                    facebookSDK.setPermissions($attrs.permissions);
                }
                if ($attrs.channelFile) {
                    facebookSDK.setChannelFile($attrs.channelFile);
                }
                $scope.signInOrConfigure = function() {
                    if (!$scope.connected) {
                        facebookSDK.login();
                    } else {
                        facebookSDK.logout();
                    }
                };
                $scope.$on("fbLoginSuccess", function() {
                    $scope.connected = true;
                });
                $scope.$on("fbLogoutSuccess", function() {
                    $scope.$apply(function() {
                        $scope.connected = false;
                    });
                });
            }
        };
    } ]);
})({}, function() {
    return this;
}());
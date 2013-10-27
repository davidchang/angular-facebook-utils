(function(exports, global) {
    global["true"] = exports;
    "use strict";
    var defaultSettings = {
        appID: "",
        permissions: "",
        channelFile: "bower_components/angular-facebook-utils/channel.html",
        routingEnabled: false,
        loginPath: "/"
    };
    var application = angular.module("facebookUtils", []).constant("facebookConfigDefaults", defaultSettings).value("facebookConfigSettings", defaultSettings).run([ "facebookConfigSettings", "facebookConfigDefaults", "$rootScope", "$location", "facebookSDK", function(facebookConfigSettings, facebookConfigDefaults, $rootScope, $location, facebookSDK, $route) {
        for (var key in facebookConfigDefaults) {
            if (facebookConfigSettings[key] === undefined) {
                facebookConfigSettings[key] = facebookConfigDefaults[key];
            }
        }
        if (facebookConfigSettings.appID) {
            facebookSDK.initializeFb(facebookConfigSettings.appID);
        } else {
            facebookSDK.cantInitialize = true;
        }
        if (facebookConfigSettings.routingEnabled) {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if (next && next.$$route && next.$$route.needAuth) {
                    facebookSDK.getInitializedPromise().then(function() {
                        if (!facebookSDK.loggedIn) {
                            $location.path(facebookConfigSettings.loginPath);
                        }
                    });
                }
            });
            $rootScope.$on("fbLogoutSuccess", function() {
                if ($route.current.$$route.needAuth) {
                    $location.path(facebookConfigSettings.loginPath);
                }
            });
        }
    } ]);
    angular.module("facebookUtils").run([ "$templateCache", function($templateCache) {
        $templateCache.put("src/views/facebookLoginPartial.html", "<div id=facebookLogin><style>.marginTop {margin-top: 10px;}\n" + "    .modal.show {display: block;}\n" + '    .btn-auth,.btn-auth:visited{position:relative;display:inline-block;height:22px;padding:0 1em;border:1px solid #999;border-radius:2px;margin:0;text-align:center;text-decoration:none;font-size:14px;line-height:22px;white-space:nowrap;cursor:pointer;color:#222;background:#fff;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:none;*overflow:visible;*display:inline;*zoom:1}.btn-auth:hover,.btn-auth:focus,.btn-auth:active{color:#222;text-decoration:none}.btn-auth:before{content:"";float:left;width:22px;height:22px;background:url(http://necolas.github.io/css3-social-signin-buttons/auth-icons.png) no-repeat 99px 99px}.btn-auth.large{height:36px;line-height:36px;font-size:20px}.btn-auth.large:before{width:36px;height:36px}.btn-auth::-moz-focus-inner{border:0;padding:0}.btn-facebook,.btn-facebook:visited{border-color:#29447e;border-bottom-color:#1a356e;color:#fff;background-color:#5872a7;background-image:-webkit-gradient(linear,0 0,0 100%,from(#637bad),to(#5872a7));background-image:-webkit-linear-gradient(#637bad,#5872a7);background-image:-moz-linear-gradient(#637bad,#5872a7);background-image:-ms-linear-gradient(#637bad,#5872a7);background-image:-o-linear-gradient(#637bad,#5872a7);background-image:linear-gradient(#637bad,#5872a7);-webkit-box-shadow:inset 0 1px 0 #879ac0;box-shadow:inset 0 1px 0 #879ac0}.btn-facebook:hover,.btn-facebook:focus{color:#fff;background-color:#3b5998}.btn-facebook:active{color:#fff;background:#4f6aa3;-webkit-box-shadow:inset 0 1px 0 #45619d;box-shadow:inset 0 1px 0 #45619d}.btn-facebook:before{border-right:1px solid #465f94;margin:0 1em 0 -1em;background-position:0 0}.btn-facebook.large:before{background-position:0 -22px}</style><a ng-click=signInOrConfigure() data-toggle=modal data-target=#myModal class="btn-auth btn-facebook"><span ng-hide=connectedToFB>Sign in with <b>Facebook</b></span> <span ng-show=connectedToFB>Sign out</span></a> <div class=modal ng-class="{fade: !showConfigure, show: showConfigure}"><div class=modal-dialog><div class=modal-content><div class=modal-header><button type=button class=close ng-click="showConfigure = false">&times;</button><h4 class=modal-title>Configure Facebook Login</h4></div><div class=modal-body><div>First, you\'ll need to register your app on Facebook. Follow these steps:</div><ol class=marginTop><li>Visit <a href=https://developers.facebook.com/apps target=_blank>https://developers.facebook.com/apps</a></li><li>Create New App (Only a name is required.)</li><li>Set "Sandbox Mode" to "Disabled"</li><li>Under "Select how your app integrates with Facebook", expand "Website with Facebook Login".</li><li>Set Site URL to: <span ng-bind=configureLocation>http://localhost:3000/</span></li></ol><div>Now, set your App ID in your code.</div><div><code></code></div></div><div class=modal-footer><button type=button class="btn btn-default" ng-click="showConfigure = false">High Five</button></div></div></div></div><div id=fb-root></div></div>');
    } ]);
    "use strict";
    angular.module("facebookUtils").service("facebookSDK", [ "$window", "$rootScope", "$q", "facebookConfigSettings", function($window, $rootScope, $q, facebookConfigSettings) {
        var SDK = function() {};
        SDK.permissions = facebookConfigSettings.permissions;
        SDK.channelFile = facebookConfigSettings.channelFile;
        SDK.initialized = false;
        SDK.loggedIn = false;
        SDK.cantInitialize = false;
        SDK.prototype.getInitializedPromise = function() {
            var deferred = $q.defer();
            var $this = this;
            var check = function() {
                if ($this.initialized) {
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
            var $this = this;
            var deferred = $q.defer();
            FB.getLoginStatus(function(response) {
                $rootScope.$apply(function() {
                    if (response.status === "connected") {
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
                $rootScope.$broadcast("fbLoginSuccess", response);
                _self.loggedIn = true;
            }, function() {
                FB.login(function(response) {
                    if (response.authResponse) {
                        response.userNotAuthorized = true;
                        $rootScope.$broadcast("fbLoginSuccess", response);
                        _self.loggedIn = true;
                    } else {
                        $rootScope.$broadcast("fbLoginFailure");
                        _self.loggedIn = false;
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
                _self.initialized = true;
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
    angular.module("facebookUtils").directive("facebookLogin", [ "$rootScope", "facebookSDK", function($rootScope, facebookSDK) {
        return {
            templateUrl: "src/views/facebookLoginPartial.html",
            restrict: "E",
            replace: true,
            scope: false,
            link: function postLink($scope, $element, $attrs) {
                var showConfigure = $attrs.showConfigure || facebookSDK.cantInitialize;
                $scope.signInOrConfigure = function() {
                    if ($rootScope.connectedToFB) {
                        facebookSDK.logout();
                        return;
                    }
                    if (!showConfigure) {
                        if (!$rootScope.connectedToFB) {
                            facebookSDK.login();
                        } else {
                            facebookSDK.logout();
                        }
                    } else {
                        $scope.configureLocation = window.location.origin;
                        $scope.showConfigure = true;
                    }
                };
                $scope.$on("fbLoginSuccess", function() {
                    $rootScope.connectedToFB = true;
                });
                $scope.$on("fbLogoutSuccess", function() {
                    $scope.$apply(function() {
                        $rootScope.connectedToFB = false;
                    });
                });
            }
        };
    } ]);
})({}, function() {
    return this;
}());
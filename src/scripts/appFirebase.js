'use strict';

var application = angular.module('facebookUtils', ['firebase']);
application.value('facebookFirebaseURL', '');
application.value('facebookAppID', '');
application.value('facebookPermissions', '');
application.value('facebookChannelFile', 'bower_components/angular-facebook-utils/channel.html');
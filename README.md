Angular Facebook Utils
===================

Implementing Facebook Login in Meteor is as easy as:

1. mrt create new-app && cd new-app
2. mrt add accounts-ui && mrt add accounts-facebook
3. Add the line {{loginButtons}} to new-app.html
4. meteor to run the server

Click the login button and it will give you instructions on configuration
Meteor can do this, in part, because they own the entire stack. They can save and interpolate values from Mongo.

Let's make something as simple in Angular, with Firebase as our backend!

Due Credit
----------

I took code and ideas from these 3 places, so they deserve more obvious credit:

[http://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app](http://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app)

[https://github.com/Terumi/AngularJS-Facebook-Login/blob/master/js/app.js](https://github.com/Terumi/AngularJS-Facebook-Login/blob/master/js/app.js)

[https://github.com/necolas/css3-social-signin-buttons](https://github.com/necolas/css3-social-signin-buttons)

Usage
-----

1. ``bower install angular-facebook-utils``
2. Add the facebookUtils module as a dependency of your Angular application
3. Include facebookUtils.min.js or facebookUtilsFirebase.min.js:
  <script src="angular-facebook-utils/src/facebookUtils.min.js></script>
4. Include facebookUtils.css:
  <link rel="stylesheet" href="angular-facebook-utils/src/styles/facebookUtils.css></link>
5. You'll have to add a channel.html for Facebook, containing the following contents:
  <script src="//connect.facebook.net/en_US/all.js"></script>
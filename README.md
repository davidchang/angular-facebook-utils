Unfortunate Notice :/
=======

Please note... there is a glaring bug in my logic for this package that I hope to address before the end of the month (October 2013). Login is inconsistent once the user refreshes the page - I should always be initializing the FB application in the angular-facebook-utils run block, not later in the login button directive. Here are the changes that will be in that 1.0.2 release:

- Fix Inconsistent/Broken Login Logic
- Introduce non-backwards compatible changes to move to Angular Values for providing configuration like App ID or Firebase URL, as opposed to passing these values as directive element attributes
- Introduce Routing to enforce Facebook Login to view specified pages

Angular Facebook Utils
===================

Visit the nicer page at [http://davidchang.github.io/angular-facebook-utils/](http://davidchang.github.io/angular-facebook-utils/) for more details.

Implementing Facebook Login in Meteor is as easy as:

1. mrt add accounts-ui && mrt add accounts-facebook
2. Add the line {{loginButtons}} to new-app.html
3. Run meteor to start the server
4. Click the login button and it will give you configuration instructions


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
3. Include facebookUtils.min.js or facebookUtilsFirebase.min.js.
4. Run your server
5. Click the login button and it will give you configuration instructions

Visit the nicer page at [http://davidchang.github.io/angular-facebook-utils/](http://davidchang.github.io/angular-facebook-utils/) for more details.

Me
--
[http://davidandsuzi.com](http://davidandsuzi.com)

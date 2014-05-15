/*
The user controller page.
the Passport module does most of the work here.
 */
var path = require('path'),
    formidable = require('formidable'), //required fir uploading
    fs = require('fs');

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//config and stuff
var config = {
    allowedLogins: ['bartvanitterbeeck@gmail.com', 'nick_vdaele@hotmail.com', 'maarten_89@msn.com','kennardvermeiren@gmail.com', 'kusksu@gmail.com'],
    googleClientId: '902378923519-h9t13fp0d3mq2tf70rqih4c6su4865hn.apps.googleusercontent.com',
    googleClientSecret: 'zXcVylv4uGehSj-hQXn5ZWNi',
    googleCallbackURL: '/auth/google/callback'
};

// DB logic & shizzle
var main = require('../models/main');

// API Access link for creating client ID and secret:
var GOOGLE_CLIENT_ID = config.googleClientId;
var GOOGLE_CLIENT_SECRET = config.googleClientSecret;
var googleCallbackURL = config.googleCallbackURL;

/*
Returns the callback function, normally used to store a user in the DB
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            return done(null, profile);
        });
    }
));


var userController = {
    login: function(req, res) {
        /*
        Renders the login view
         */
        res.render('login', {
            user: req.user,
            title: 'Log in',
            message: '',
            layout:false
        });
    },
    logout: function(req, res) {
        /*
        Logs the user out
         */
        req.logout();
        res.render('logout', {
                layout: false
            });
    },
    account: function(req, res) {
        /*
        Renders the user account page
         */
        console.log(req.user);
        res.render('account', {
            user: req.user,
            title: 'Account',
            layout:false
        });
    },
    authGoogle: passport.authenticate('google', {
        /*
        Says what we need from google, not much in this case
         */
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.me'
        ]
    }),
    authGoogleCallBack: passport.authenticate('google', {
        successRedirect: '/admin',
        failureRedirect: '/login'
    }),
    ensureAuthenticated: function(req, res, next) {
        /*
        ensures that the user is authenticated,
        and checks if he is in the array of allowed users.
         */
        if (req.isAuthenticated()) {
            // console.log('user tried to log in', req.user._json.email);
            if (inArray(req.user._json.email, config.allowedLogins, true)) {
                next();
            } else {
                res.render('login', {
                    message: 'e-mail not allowed'
                })
            }
        } else {
            // console.log('user not logged in');
            res.redirect('/login')
        }
    },
    loginFailed: function(req, res) {
        res.render('login', {
            title: 'Login Failed',
            message: 'You can only log in using a specific email'
        });
    }
}

/*Sets the userController object as the thing that gets loaded when requiring this file in other files. */
module.exports = userController;


//helper functions
function inArray(needle, haystack, argStrict) {
    var key = '',
        strict = !! argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

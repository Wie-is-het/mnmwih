var util = require(__dirname + '/../libs/util.js'),
    path = require('path'),
    exphbs  = require('express3-handlebars'),
    passport = require('passport');

module.exports = function (express, app) {

    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    //handlebars help: https://github.com/ericf/express3-handlebars/
    // app.enable('view cache');

    // Common configuration
    app.configure(function () {

        // Configure hogan template engine
        app.set('views', path.join(__dirname, '/../views/'));
        app.set('view engine', 'handlebars');

        //enable gzip compression
        app.use(express.compress());

        //cookie & session stuff (needed for authentication)
        app.use(express.cookieParser('mr ripley'));
        app.use(express.session({
            secret: 'EVerYtHingiSAWeSoME'
        }));

        //passport stuff:
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);

        //temp directory to store uploaded files
        // app.use(express.bodyParser({uploadDir:'/tmp/files'}));
        app.use(express.json());
        app.use(express.urlencoded());

        // Create static file servers for the image and public folders
        app.use("/public", express.static(__dirname + "/../public"));

    });

    // Development specific configuration
    app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    // Production specific configuration
    app.configure('production', function () {
        app.use(express.errorHandler());
    });

};
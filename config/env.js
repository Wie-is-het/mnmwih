var util = require(__dirname + '/../libs/util.js'),
    path = require('path'),
    hogan = require('hogan-express');

module.exports = function (express, app) {

    app.engine('html', require('hogan-express'));
    // app.enable('view cache');

    // Common configuration
    app.configure(function () {

        // Configure hogan template engine
        app.set('views', path.join(__dirname, '/../views/'));
        app.set('view engine', 'html');

        app.use(app.router);

        //temp directory to store uploaded files
        // app.use(express.bodyParser({uploadDir:'/tmp/files'}));
        app.use(express.json());
        app.use(express.urlencoded());

        // Create static file servers for the image and public folders
        app.use("/public", express.static(__dirname + "/../public"));
        app.use("/images", express.static(__dirname + "/../images"));

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
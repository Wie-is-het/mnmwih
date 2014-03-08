var util = require(__dirname + '/../libs/util.js'),
    path = require('path'),
    exphbs  = require('express3-handlebars');

module.exports = function (express, app) {

    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    //handlebars help: https://github.com/ericf/express3-handlebars/
    // app.enable('view cache');

    // Common configuration
    app.configure(function () {

        // Configure hogan template engine
        app.set('views', path.join(__dirname, '/../views/'));
        app.set('view engine', 'handlebars');

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
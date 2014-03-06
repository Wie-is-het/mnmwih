var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');

// Load express configuration
require(__dirname + '/config/env.js')(express, app);

// Load routes
require(__dirname + '/routes')(app);

var port = process.env.PORT || 3000;
// Start the server
http.createServer(app).listen(port, function() {
    console.log("Express server listening on port %d in %s mode",
        port, app.settings.env);
});

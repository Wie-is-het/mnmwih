var path = require('path'),
    formidable = require('formidable'),
    Nedb = require('nedb'),
    fs = require('fs');

// DB logic & shizzle
var main = require('../models/main');
   	// models = Nedb.model('main')

module.exports = function(app) {
    app.get('/admin/new', admin_new);

    app.get('/admin', admin)

    // app.get('/app/:id', view)

    app.post('/upload', upload);

    app.get('/admin/save', save);
};

var admin = function(req, res) {
    res.locals = {
        title: 'Freegees Control Panel',
    };
    return res.render(
        'admin-dashboard'
    );
};

var admin_new = function(req, res) {
    res.locals = {
        title: 'Add new Freegees page',
    };
    return res.render(
        'admin-new'
    );
};


var index = function(req, res) {
    res.locals = {
        title: 'Freegees',
    };
    return res.render(
        'index', {
            // partials: {‡
            //     part: 'part',
            // }
        }
    );
};

var save = function(req, res) {

	console.log(JSON.parse(req.query));


	main.planets.find({ satellites: { $lt: 100 } }, function (err, docs) {
        // docs is an array containing Earth and Mars
        // console.log(docs);
      });

}


////////////////////////////////
/////  Upload Function  ////////
////////////////////////////////
var upload = function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../tmp/files';
    form.encoding = 'binary';
    //creates a hopefully unique filename
    var filename = createFileName();

    form.addListener('file', function(name, file) {
        // console.log('NAME --->', name);
        // console.log('FILE --->', file);

        //Set the temporary path and the target path and move from temp to target after renaming the file
        var tempPath = file.path,
            targetPath = path.resolve('./images/' + filename + '.png');
        if (path.extname(file.name).toLowerCase() === '.png') {
            fs.rename(tempPath, targetPath, function(err) {
                if (err) throw err;
                // console.log("Upload completed!");
            });
        } else {
            fs.unlink(tempPath, function(err) {
                if (err) throw err;
                res.status(412).send("Only .png files are allowed!");
            });
        }

    });

    form.addListener('end', function() {
        //when succesfully uploaded, send 200 with the filename
        res.status(200).send(filename);
    });

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
    });
}



////////////////////////////////
///		Helper Functions	  //
////////////////////////////////
    function createFileName() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        var time = new Date().valueOf() + text;
        return time;
    }

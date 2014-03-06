var path = require('path'),
    formidable = require('formidable'),
    Nedb = require('nedb'),
    fs = require('fs');

// DB logic & shizzle
var main = require('../models/main');
// models = Nedb.model('main')

module.exports = function(app) {

    app.get('/', index)

    // app.get('/app/:id', view)

    app.get('/upload', upload);
};


var upload = function(req, res) {
    res.locals = {
        title: 'Upload a new Photo',
        categories: ['People', 'Object'],
        properties: {
              people: [
                {"name": "sex", "possibilities": ["male", "female"]},
                {"name": "Glasses", "possibilities": ["yes", "no"]},
                {"name": "Facial hair", "possibilities": ["yes", "no"]},
                {"name": "Hair color", "possibilities": ["Brown", "Blonde", "Ginger", "Black"]},
                {"name": "Skin color", "possibilities": ["Light", "Asian", "Black","Brown"]}
              ],
              object: [
                {"name": "Material", "possibilities": ["Wood", "Plastic","Stone","Digital","Paper"]},
                {"name": "Breakable", "possibilities": ["yes", "no"]},
                {"name": "Color", "possibilities": ["Red", "Yellow", "Green", "Blue","White","Black"]}
              ]
            }

    };
    return res.render(
        'upload'
    );
};


var index = function(req, res) {
    res.locals = {
        title: 'Wie Is Het?',
    };
    return res.render(
        'index', {
            // partials: {‡
            //     part: 'part',
            // }
        }
    );
};



////////////////////////////////
///     Helper Functions      //
////////////////////////////////

function createFileName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    var time = new Date().valueOf() + text;
    return time;
}

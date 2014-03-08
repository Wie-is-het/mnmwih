var path = require('path'),
    formidable = require('formidable'),
    Nedb = require('nedb'),
    fs = require('fs');

// DB logic & shizzle
var main = require('../models/db-main');
// models = Nedb.model('main')
//
var locals = {title: 'Upload a new Photo',
        categories: ['People', 'Object'],
        properties: {
              people: [
                {"name": "sex", "possibilities": ["male", "female"]},
                {"name": "Glasses", "possibilities": ["yes", "no"]},
                {"name": "Facial hair", "possibilities": ["None","Mustache", "Goatee", "Beard"]},
                {"name": "Hair color", "possibilities": ["Brown", "Blonde", "Ginger", "Black"]},
                {"name": "Hair Type", "possibilities": ["Long", "Short", "Bald"]},
                {"name": "Accesories", "possibilities": ["None", "Ear Rings", "Glasses","Hat","Ear rings and a hat","Glasses and a hat", "Ear rings and glasses","Like a christmas tree"]},
                {"name": "Eye color", "possibilities": ["Black", "Brown", "Amber","Orange","Blue","Blue-grey","Green","Gray","Hazel","Multiple","Other"]},
                {"name": "Skin color", "possibilities": ["Light", "Asian", "Black","Brown"]}
              ],
              object: [
                {"name": "Material", "possibilities": ["Wood", "Plastic","Stone","Digital","Paper"]},
                {"name": "Breakable", "possibilities": ["yes", "no"]},
                {"name": "Color", "possibilities": ["Red", "Yellow", "Green", "Blue","White","Black"]}
              ]
            }}

module.exports = function(app) {

    app.get('/', index)

    // app.get('/app/:id', view)

    app.get('/upload', upload)

    app.post('/upload', saveObject)

    app.get('/play', play)
};


var upload = function(req, res) {
    res.locals = locals;
    return res.render(
        'upload', {layout: false}
    );
};

var play = function(req, res) {
    main.objecti.find({},function(err, docs) {

            if (!err){
               // console.log(docs);
               res.locals = {
                    title: 'Play',
                    locals: locals,
                    data: docs,
                };
                return res.render(
                    'play', {layout: false}
                );
               process.exit();
            }
            else {
                throw err;
            }

            })
};


var saveObject = function(req,res){
    try {
        if (req.method == 'POST') {

            //parsing & concatenating the incoming data stream
            var body = '';
            req.on('data', function(data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                    res.send('Nice Try, but we ain\'t getting DDOS\'D');
                }
            });
            req.on('end', function() {

                var POST = JSON.parse(body);

                if(validatePropertiesLegal(POST, locals)){
                    // console.log('All valid')
                    var obj = new main.objecti({
                        name: POST.name,
                        type: POST.categorie,
                        image: POST.image,
                        properties: POST.properties
                    });

                    obj.save(function (err) {
                    if (err){
                        res.status(500).send('failed: uploading might not be possible at this moment');
                    }else{
                        res.status(200).send('Succeeded')
                    }
                    });

                }else{
                    console.log('Not all properties were valid')
                    res.status(403).send('Please don\'t try to hack this game, we worked very hard on this, and it\'s people like you who ruin all the fun');
                }

            });
        }


    } catch (e) {
        res.status(500).send('failed: uploading might not be possible at this moment', e)
    }
}

var index = function(req, res) {
    res.locals = {
        title: 'Wie Is Het?',
    };
    return res.render(
        'index', {layout: false}
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

function validatePropertiesLegal(POST, locals) {

    var illegalNotFound = true;

    localAttr = new Array();

    for (var i = 0; i < locals.properties.people.length; i++) {
        var name = locals.properties.people[i].name;
        localAttr.push(name.toLowerCase());
    };
    for (var i = 0; i < locals.properties.object.length; i++) {
        var name = locals.properties.object[i].name;
        localAttr.push(name.toLowerCase());
    };

    console.log(localAttr, POST.properties);

    for(var obj in POST.properties){

        console.log(obj)
        if(localAttr.indexOf(obj.toLowerCase()) != -1){

            // console.log("true")
            illegalNotFound = true;
        }else{
            // console.log('false')
            illegalNotFound = false;
        }
    }

    console.log('illegal',illegalNotFound)
    return illegalNotFound;

}

var path = require('path'),
    formidable = require('formidable'),
    fs = require('fs');

var admin = require('../controllers/admin-controller')
var user = require('../controllers/user-controller.js');

// DB logic & shizzle
var main = require('../models/db-main');
// models = Nedb.model('main')
//
// var locals = {
//     title: 'Upload a new Photo',
//     categories: ['People', 'Object'],
//     properties: {
//         people: [{
//             "name": "sex",
//             "possibilities": ["male", "female"]
//         }, {
//             "name": "Glasses",
//             "possibilities": ["yes", "no"]
//         }, {
//             "name": "Facial hair",
//             "possibilities": ["None", "Mustache", "Goatee", "Beard"]
//         }, {
//             "name": "Hair color",
//             "possibilities": ["Brown", "Blonde", "Ginger", "Black"]
//         }, {
//             "name": "Hair Type",
//             "possibilities": ["Long", "Short", "Bald"]
//         }, {
//             "name": "Accesories",
//             "possibilities": ["None", "Ear Rings", "Glasses", "Hat", "Ear rings and a hat", "Glasses and a hat", "Ear rings and glasses", "Like a christmas tree"]
//         }, {
//             "name": "Eye color",
//             "possibilities": ["Black", "Brown", "Amber", "Orange", "Blue", "Blue-grey", "Green", "Gray", "Hazel", "Multiple", "Other"]
//         }, {
//             "name": "Skin color",
//             "possibilities": ["Light", "Asian", "Black", "Brown"]
//         }]
//         // ,
//         // object: [
//         //   {"name": "Material", "possibilities": ["Wood", "Plastic","Stone","Digital","Paper"]},
//         //   {"name": "Breakable", "possibilities": ["yes", "no"]},
//         //   {"name": "Color", "possibilities": ["Red", "Yellow", "Green", "Blue","White","Black"]},
//         //   {"name": "animal type", "possibilities": ["Dog","Cat","Fish","Rabbit"]}
//         // ]
//     }
// }

module.exports = function(app) {

    app.get('/', play)

    // app.get('/app/:id', view)

    app.get('/upload', upload)

    app.post('/upload', saveObject)

    app.get('/play', play)

    app.get('/admin', user.ensureAuthenticated, admin.admin)

    app.get('/admin/properties', user.ensureAuthenticated, admin.properties)
    app.get('/saveProps', user.ensureAuthenticated, admin.save)
    app.get('/removeProps/:id', user.ensureAuthenticated, admin.removeProps)

    app.get('/admin/photos', user.ensureAuthenticated, admin.photos)
    app.get('/admin/photos/:page', user.ensureAuthenticated, admin.photos)
    app.get('/admin/photos/search', user.ensureAuthenticated, admin.photoSearch)
    app.get('/removePhoto/:id', user.ensureAuthenticated, admin.removePhotos)

    //authentication
    app.get('/login', user.login)
    app.get('/loginFailed', user.loginFailed)
    app.get('/logout', user.logout)

    app.get('/account', user.ensureAuthenticated, user.account)
    app.get('/auth/google', user.authGoogle)
    app.get('/auth/google/callback', user.authGoogleCallBack)
};


var upload = function(req, res) {
    // res.locals = locals;
    main.props.find(function(err, possibilitiesDocs) {
        // console.log(possibilitiesDocs)
        res.locals = {
            props: possibilitiesDocs
        }
        return res.render(
            'upload', {
                layout: false
            }
        );
    })
};

var play = function(req, res) {

    main.props.find(function(err, possibilitiesDocs) {
        main.objecti.find().where('random').near([Math.random(), Math.random()]).sort({
            'name': 1
        }).limit(12).exec({}, function(err, docs) {

            if (!err) {
                var rand = (Math.random() * docs.length).toFixed(0);
                // console.log(docs[rand]);
                var theOne = docs[rand];

                // console.log(docs);
                res.locals = {
                    title: 'Play',
                    locals: JSON.stringify(possibilitiesDocs),
                    data: docs,
                    result: JSON.stringify(theOne)
                };
                return res.render(
                    'play', {
                        layout: false
                    }
                );
                process.exit();
            } else {
                console.log(err)
            }

        })
    })
};


var saveObject = function(req, res) {
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

                validatePropertiesLegal(POST, function(valid) {

                    if (valid) {
                        // console.log('All valid')
                        var obj = new main.objecti({
                            name: POST.name,
                            type: POST.categorie,
                            image: POST.image,
                            properties: POST.properties
                        });

                        obj.save(function(err) {
                            if (err) {
                                res.status(500).send('failed: uploading might not be possible at this moment');
                            } else {
                                res.status(200).send('Succeeded')
                            }
                        });

                    } else {
                        console.log('Not all properties were valid')
                        res.status(403).send('Please don\'t try to hack this game, we worked very hard on this, and it\'s people like you who ruin all the fun');
                    }

                });

            });
        }


    } catch (e) {
        res.status(500).send('failed: submittiong might not be possible at this moment', e)
    }
}

var index = function(req, res) {
    res.locals = {
        title: 'Wie Is Het?',
    };
    return res.render(
        'index', {
            layout: false
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

// function validatePropertiesLegal(POST, locals) {

//     var illegalNotFound = true;

//     localAttr = new Array();

//     main.props.find(function )

//     for (var i = 0; i < locals.properties.people.length; i++) {
//         var name = locals.properties.people[i].name;
//         localAttr.push(name.toLowerCase());
//     };
//     for (var i = 0; i < locals.properties.object.length; i++) {
//         var name = locals.properties.object[i].name;
//         localAttr.push(name.toLowerCase());
//     };

//     console.log(localAttr, POST.properties);

//     for (var obj in POST.properties) {

//         console.log(obj)
//         if (localAttr.indexOf(obj.toLowerCase()) != -1) {

//             // console.log("true")
//             illegalNotFound = true;
//         } else {
//             // console.log('false')
//             illegalNotFound = false;
//         }
//     }

//     console.log('illegal', illegalNotFound)
//     return illegalNotFound;

// }

function validatePropertiesLegal(POST, callback) {

    console.log(POST);

    var illegalNotFound = true;

    localAttr = [];

    main.props.find(function(err, props) {

        for (var i = 0; i < props.length; i++) {
            var name = props[i].name;
            localAttr.push(name.toLowerCase());
        };

        for (var obj in POST.properties) {

            // console.log('OBJ from POST->',obj.toLowerCase())
            // console.log('local Array to compare', localAttr)

            if (localAttr.indexOf(obj.toLowerCase()) != -1) {

                console.log("true")
                illegalNotFound = true;
            } else {
                console.log('false: obj ->' + obj)
                illegalNotFound = false;
                callback(illegalNotFound);
                return false;
            }

        }

        console.log('illegal not found:', illegalNotFound)
        callback(illegalNotFound);

    })

}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
            result = prop;
    return result;
}

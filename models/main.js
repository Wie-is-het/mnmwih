var path = require('path'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//to transfer from NeDB to MongoDB -> https://github.com/louischatriot/nedb-to-mongodb

var Nedb = require('nedb')

  var planets = new Nedb({ filename: path.join(__dirname,'../db/planets.db'), autoload: true });
  var apps = new Nedb({ filename: path.join(__dirname,'../db/apps.db'), autoload: true });
// Let's insert some data
// planets.insert({ name: 'Earth', satellites: 1 }, function (err) {
//   planets.insert({ name: 'Mars', satellites: 2 }, function (err) {
//     planets.insert({ name: 'Jupiter', satellites: 67 }, function (err) {

//       // Now we can query it the usual way
//       planets.find({ satellites: { $lt: 100 } }, function (err, docs) {
//         // docs is an array containing Earth and Mars
//         console.log(docs);
//       });
//     });
//   });
// });

exports.planets = planets;
exports.apps = apps;


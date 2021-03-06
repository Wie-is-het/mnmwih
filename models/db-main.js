var path = require('path'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//to transfer from NeDB to MongoDB -> https://github.com/louischatriot/nedb-to-mongodb

var mongoose = require('mongoose'),
    config = {};

config.username = 'bartdegeweldige';
config.password = 'Pinguin123';
config.mongodbHost = 'ds031329.mongolab.com';
config.mongodbPort = 31329;
config.mongodbDbname = 'mnm_wie_is_het';


////////////////////////////////
/// DB Shizzle
////////////////////////////////
dburistring = 'mongodb://'+config.username+':'+config.password+'@'+config.mongodbHost+':'+config.mongodbPort +'/'+config.mongodbDbname;
//
//for testing:
// dburistring = 'mongodb://localhost/MNMs';
mongoose.connect(dburistring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + config.mongodbDbname + '. ' + err);
    } else {
        console.log('Succeeded connecting to: ' + config.mongodbDbname);
    }
});


var Objects = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:false,
    },
    type: {
        type: String,
        required: true,
        index:false,
    },
    image: {
        type: String,
        required: true,
        index:false,
    },
    properties: Object,
    random: {
        random: {type: [Number], default: function(){ return [Math.random(), Math.random()]}, index: '2d'}
    }

});

var properties = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index:false,
    },
    possibilities: {
        type: [String]
    }

});

var settings = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: false,
	},
	value: {
		type: Number,
		required: true,
		index: false
	}
});

var User = new mongoose.Schema({
    openId: {type:String, required: true,unique: true}
});
// User.plugin(supergoose, {instance: mongoose});

Objects.pre('save', function(next) {
    console.log('An Objects was saved to Mongo: %s.', this.get('name'));
    next();
});

User.pre('save', function(next) {
    console.log('A User was saved to Mongo');
    next();
});

properties.pre('save', function(next) {
    console.log('A property was saved to Mongo');
    next();
});

var User = mongoose.model('user', User);
var Objects = mongoose.model('objects', Objects);
var Settings = mongoose.model('settings', settings);

var Properties = mongoose.model('properties', properties);

exports.objecti = Objects;
exports.props = Properties;
exports.setting = Settings;

    // exports.planets = planets; exports.apps = apps;

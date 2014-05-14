var admincontroller = {};
var db = require('../models/db-main');


admincontroller.properties = function(req, res) {
    db.props.find().exec({}, function(err, docs) {
        res.locals = {
            data: docs,
        }
        return res.render(
            'admin-dashboard-properties', {
                layout: false
            }
        );
    });
}

admincontroller.save = function(req, res) {

    var toDBData = {
    	name: req.query.name.toLowerCase(),
    	possibilities : req.query.properties
    }

    console.log(toDBData)

    if(toDBData.name && toDBData.possibilities[0]){
	    db.props.update({name: req.query.name.toLowerCase()}, toDBData, {upsert: true}, function(err, docsUpdated){
	    	console.log('err: ',err)
	    	console.log('docsUpdated: ',docsUpdated)
	    })
	}
    return res.redirect('back')
}

admincontroller.removeProps = function(req,res){
	var id = req.params.id

	db.props.remove({_id: id}, function(err, docs){
		if(!err && docs){
			console.log(docs,' removed')
		}else{
			console.log('err->', err)
		}
		res.redirect('back');
	})

}




admincontroller.photos = function (req, res){
	try{
		var page = parseInt(req.params.page) || 1;
	}catch (e){
		var page = 1;
	}
	var perPage = 50;
	var skip = (page*perPage)-perPage;

	db.objecti.find().sort({name: 1}).skip(skip).limit(perPage).exec(function (err, docs){
		res.locals = {
			data: docs,
			page: page,
			pagePlusOne: page + 1
		}
		return res.render(
            'admin-photos', {
                layout: false
            }
        );
	})
}

admincontroller.admin = function (req,res){
	return res.render(
            'admin', {
                layout: false
            }
        );
}

admincontroller.photoSearch = function (req, res){

	var re = new RegExp(req.query.search, 'i');
	console.log(re)

	db.objecti.find().where({name: { $regex: re }}).exec(function (err, docs){
		res.locals = {
			data: docs
		}
		return res.render(
            'admin-photos', {
                layout: false
            }
        );
	})
}

admincontroller.removePhotos = function (req, res){
	db.objecti.remove({_id: req.params.id}, function(err, docs){
		if(!err && docs){
			console.log(docs,' removed')
		}else{
			console.log('err->', err)
		}
		res.redirect('back');
	})
}

module.exports = admincontroller;

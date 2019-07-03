var express = require('express');
var router = express.Router();
const logger = require('morgan');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const app = express();
var User = require('../db/User');
const calendarTypes = require('../db/CalendarTypes');
const slipTypes = require('../db/SlipTypes');

app.set('secretKey', 'nodeRestApi'); // jwt secret token
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
//Verify if auth token is coming or not
const verifyToken = function(req,res,next){
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined'){
		// Split at the space
	    const bearer = bearerHeader.split(' ');
	    // Get token from array
	    const bearerToken = bearer[1];
	    // Set the token
	    req.token = bearerToken;
	    // Next middleware
	    next();
	}else{
		res.sendStatus(403)
	}
}

module.exports = function(){
	router.get('/', function(req, res){
		res.json({"tutorial" : "Build REST API with node.js"});
	});
	router.post('/login',function (req, res) {
		var body = req.body;
		var email = req.body.email;
		User.findOne({email:email},function(err,doc){
			if(err){return res.json({"error":err})}
			else{
				if(doc){
					var validUser = doc.comparePassword(req.body.password,doc.password);
					if(validUser){
						const token = jwt.sign({doc}, 'secret', { expiresIn: '1h' });
						res.json({status:"success", message: "user found!!!", data:{user: doc, token:token}});
					}else{
						res.json({status:"error", message: "Invalid password!!!"});
					}
				}else{
					res.json({status:"error", message: "Invalid email!!!"});
				}
			}
		})
    });
    //Get calendar types
    router.get('/calendar_types', verifyToken, (req, res) => {  
	  	jwt.verify(req.token, 'secret', (err, authData) => {
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		//Get the user id from auth data
	    		calendarTypes.find(function(err,doc){
					if(err){
			  			res.sendStatus(500);
			  		}
			  		else{
			  			res.json({"calendarTypes":doc});
			  		}
			  	});
	      	}
	  	});
	});
	//Store calendar types
    router.post('/add_calendar_type', verifyToken, (req, res) => {  
	  	jwt.verify(req.token, 'secret', (err, authData) => {
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		var body = req.body;
	    		var record = new calendarTypes(body);
				record.save(function(err){
					if(err){
						res.sendStatus(err.message)
					}
					else{
						res.json({"message":"Added successfully"});
					}
				})
	      	}
	  	});
	});
	//Edit particular calendar type
	router.put('/edit_calendar_type/:typeId',verifyToken,function(req,res){
		jwt.verify(req.token, 'secret', (err, authData) =>{
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		var body = req.body;
	    		var record = new calendarTypes(body);
	    		calendarTypes.findOne({"_id":req.params.typeId},function(err,record){
					if(err){
						res.sendStatus(err.message)
					}
					else{
						record.calendar_type_name = req.body.calendar_type_name;
						record.save();
						res.json({"message":"Updated successfully",record});
					}
				})
	      	}
	  	});
	});
	//Delete particular calendar type
	router.delete('/delete_calendar_type/:typeId',verifyToken,function(req,res){
		jwt.verify(req.token, 'secret', (err, authData) =>{
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		var body = req.body;
	    		var record = new calendarTypes(body);
	    		calendarTypes.findOne({"_id":req.params.typeId},function(err,record){
					if(err){
						res.sendStatus(err.message)
					}
					else{
						record.delete();
						res.json({"message":"Deleted successfully",record});
					}
				})
	      	}
	  	});
	});
	//Create daily calendar date slip types
	router.post('/add_slip_type', verifyToken, (req, res) => {  
	  	jwt.verify(req.token, 'secret', (err, authData) => {
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		var body = req.body;
	    		var record = new slipTypes(body);
				record.save(function(err){
					if(err){
						res.sendStatus(err.message)
					}
					else{
						res.json({"message":"Added successfully"});
					}
				})
	      	}
	  	});
	});
	//Create daily calendar date slip types
	router.get('/get_slip_types', verifyToken, (req, res) => {  
	  	jwt.verify(req.token, 'secret', (err, authData) => {
	    	if(err) {
	      		res.sendStatus(403);
	    	} else {
	    		//Get the user id from auth data
	    		slipTypes.find(function(err,doc){
					if(err){
			  			res.sendStatus(500);
			  		}
			  		else{
			  			res.json({"slipTypes":doc});
			  		}
			  	});
	      	}
	  	});
	});
    return router;
}

// module.exports = router;
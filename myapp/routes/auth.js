var express = require('express');
var router = express.Router();
var User = require('../db/User');

module.exports = function(passport){
	/* GET home page. */
	router.post('/signup', function(req, res) {
		var body = req.body,
		 	email = body.email,
		 	password = body.password;
	  	User.findOne({email:email},function(err,doc){
	  		if(err){
	  			res.status(500).send('error occurred');
	  		}
	  		else{
	  			if(doc){
	  				res.status(500).send('username already exist');
	  			}else{
	  				var record = new User(body);
	  				record.email = email;
	  				record.password = record.hashPassword(password);
	  				record.save(function(err,user){
	  					if(err){
	  						res.status(500).send(err.message)
	  					}
	  					else{
	  						res.redirect('/');
	  					}
	  				})
	  			}
	  		}
	  	})
	});
	router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true
    }), function (req, res) {
        res.send('hey')
    })
    return router;
};

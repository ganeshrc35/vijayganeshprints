var localStrategy = require('passport-local').strategy;
var User = require('./db/User');

module.exports = function(passport){
	passport.serializeUser(function(user,done){
		done(null,user)
	});
	passport.deserializeUser(function(user,done){
		done(null,user)
	});
	//Create strategy for login
	passport.use(new localStrategy(function(email,password,done){
		console.log(email,password)
	}))
}
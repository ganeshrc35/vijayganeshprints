var localStrategy = require('passport-local').Strategy;
var User = require('./db/User');
var passport = require('passport');
module.exports = function(passport){
	passport.serializeUser(function(user,done){
		done(null,user)
	});
	passport.deserializeUser(function(user,done){
		done(null,user)
	});
	//Create strategy for login
	passport.use('local',new localStrategy({
	  	usernameField: 'email',
	  	passwordField: 'password',
	},function(email,password,done){
		User.findOne({email:email},function(err,doc){
			if(err){return done(err)}
			else{
				if(doc){
					var validUser = doc.comparePassword(password,doc.password);
					if(validUser){
						done(null,doc);
					}else{
						return done(null, false, { message: 'Incorrect password.' });
					}
				}else{
					return done(null, false, { message: 'Incorrect username.' });
				}
			}
		})
	}))
}
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var schema = mongoose.Schema;
var userSchema = new schema({
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true,
	},
	first_name:{
		type:String,
		required:true,
	},
	last_name:{
		type:String
	},
});

userSchema.methods.hashPassword = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}
userSchema.methods.comparePassword = function(password,hash){
	return bcrypt.compareSync(password,hash);
}
module.exports = mongoose.model('users',userSchema,'users');
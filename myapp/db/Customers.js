var mongoose = require('mongoose');
var schema = mongoose.Schema;
var customerSchema = new schema({
	salesman_id:{
		type:String,
		required:true,
		ref:'User'
	},
	user_id:{
		type:String,
		required:true,
		ref:'User'
	},
	company_name:{
		type:String,
		required:true,
	},
	contact_number:{
		type:String,
		required:true,
	},
	address:{
		type:String,
		required:true
	},
	logo:{
		type:String
	},
});
module.exports = mongoose.model('customers',customerSchema,'customers');
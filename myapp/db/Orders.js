var mongoose = require('mongoose');
var schema = mongoose.Schema;
var orderSchema = new schema({
	user_id:{
		type:String,
		required:true,
		ref:'User'
	},
	no_of_copies:{
		type:Number,
		required:true,
	},
	content:{
		type:String,
		required:true,
	},
	contact_number:{
		type:String
	},
});
module.exports = mongoose.model('orders',orderSchema,'orders');
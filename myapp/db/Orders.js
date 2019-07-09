var mongoose = require('mongoose');
var schema = mongoose.Schema;
var orderSchema = new schema({
	user_id:{
		type:String,
		required:true,
		ref:'User'
	},
	customer_id:{
		type:String,
		required:true,
		ref:'Customers'
	},
	calendar_type:{
		type:String,
		required:true
	},
	slip_type:{
		type:String
	},
	no_of_copies:{
		type:Number,
		required:true,
	},
	content:{
		type:String,
		required:true,
	},
	booked_by:{
		type:String,
		ref:'User'
	},
	booked_at:{
		type : Date, default: Date.now
	},
	status:{
		type:Boolean
	},
	samples:{
		type:String
	}
});
module.exports = mongoose.model('orders',orderSchema,'orders');
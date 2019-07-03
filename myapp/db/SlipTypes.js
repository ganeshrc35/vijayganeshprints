var mongoose = require('mongoose');
var schema = mongoose.Schema;
var slipTypeSchema = new schema({
	slip_type_name:{
		type:String,
		required:true,
	}
});
module.exports = mongoose.model('slipTypes',slipTypeSchema,'slipTypes');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var calendarTypeSchema = new schema({
	calendar_type_name:{
		type:String,
		required:true,
	}
});
module.exports = mongoose.model('calendarTypes',calendarTypeSchema,'calendarTypes');
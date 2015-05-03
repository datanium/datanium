var mongodb = require('./mongodb');
var autoIncrement = mongodb.autoIncrement;
var Schema = mongodb.mongoose.Schema;
var MethodSchema = new Schema({
	method_id : Number,
	name : String,
	desc : String,
	method : String,
	user_id : String,
	user_name : String,
	user_ip : String,
	creation_date : Date,
	modification_date : Date
});
MethodSchema.plugin(autoIncrement.plugin, {
	model : 'Method',
	field : 'method_id'
});
exports.Method = mongodb.mongoose.model('Method', MethodSchema, 'testing_method');

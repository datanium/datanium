var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MethodSchema = new Schema({
	name : String,
	desc : String,
	method : String,
	user_id : String,
	user_name : String,
	user_ip : String,
	creation_date : Date,
	modification_date : Date
});
exports.Method = mongodb.mongoose.model('Method', MethodSchema, 'testing_method');

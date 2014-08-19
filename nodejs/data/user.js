var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
	userName : String,
	password : String,
	email : String
});
exports.User = mongodb.mongoose.model('User', UserSchema,'user'); 


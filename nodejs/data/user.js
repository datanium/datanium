var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
	username : String,
	password : String,
	email : String,
	signup_date : Date,
	last_login_date : Date,
	last_login_ip : String
});
exports.User = mongodb.mongoose.model('User', UserSchema, 'user');

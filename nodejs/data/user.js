var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var UserSchema = new Schema({
	username : String,
	password : String,
	email : String,
	signup_date : Date,
	last_signin_date : Date
});
exports.User = mongodb.mongoose.model('User', UserSchema, 'user');

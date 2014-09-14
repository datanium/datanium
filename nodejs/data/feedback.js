var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var FeedbackSchema = new Schema({
	content : String,
	user_id : String,
	user_ip : String,
	creation_date : Date
});
exports.Feedback = mongodb.mongoose.model('Feedback', FeedbackSchema, 'feedback');

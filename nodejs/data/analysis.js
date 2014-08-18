var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var DatasetSchema = new Schema({
	hashid : String,
	qubeInfo : Object,
	queryParam : Object,
	rptMode : String,
	chartMode : String,
	user_id : String,
	user_ip : String,
	creation_date : Date,
	modification_date : Date
});
exports.Analysis = mongodb.mongoose.model('Analysis', DatasetSchema, 'analysis');

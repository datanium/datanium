var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var ReportSchema = new Schema({
	hashid : String,
	qubeInfo : Object,
	queryParam : Object,
	rptMode : String,
	chartMode : String,
	autoScale : Boolean,
	showLegend : Boolean,
	title : String,
	description : String,
	enableQuery : Boolean,
	user_id : String,
	user_name : String,
	user_ip : String,
	creation_date : Date,
	modification_date : Date
});
exports.Report = mongodb.mongoose.model('Report', ReportSchema, 'report');

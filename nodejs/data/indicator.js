var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var IndicatorSchema = new Schema({
	indicator_key : String,
	indicator_text : String,
	data_source : String,
	data_type : String,
	topic : String,
	dimension :[{dimension_key : String, dimension_text : String}],
		tag:[{indicator_key : String}]
});
exports.Indicator = mongodb.mongoose.model('Indicator', IndicatorSchema,'indicator'); 


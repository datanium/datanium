var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var CountrySchema = new Schema({
	country_name : String,
	indicators : [ {
		indicator_key : String,
		indicator_text : String,
		data_source : String
	} ]
});
exports.Country = mongodb.mongoose.model('Country', CountrySchema, 'country');

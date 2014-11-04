var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var DatasetSchema = new Schema({});
exports.Dataset = mongodb.mongoose.model('Dataset', DatasetSchema, 'dataset_new');

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect('mongodb://localhost:27017/datanium');
autoIncrement.initialize(connection);
exports.mongoose = mongoose;
exports.autoIncrement = autoIncrement;
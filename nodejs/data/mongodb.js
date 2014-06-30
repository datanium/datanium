var mongoose = require('mongoose');
mongoose.connect('mongodb://www.dtnium.com:27017/datanium');
exports.mongoose = mongoose;
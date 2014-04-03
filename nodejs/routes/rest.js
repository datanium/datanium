var data = require('../data/sampleData');
var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var IndicatorSchema = indicator.Indicator;

exports.cubeList = function(req, res) {
	res.send(data.cubeListJSON);
};

exports.cubeInfo = function(req, res) {
	res.send(data.cubeInfoJSON);
};

exports.queryResult = function(req, res) {
	console.log(req.body);
	var returnJson = [];
	var Schema = mongodb.mongoose.Schema;
	var DatasetSchema = new Schema({
		"region" : String,
		"country" : String,
		"year" : Number,
		"gdp" : Number
	});
	console.log(mongodb.mongoose.modelNames());
	var dataSet = mongodb.mongoose.model('Dataset', DatasetSchema, 'dataset');
	dataSet.find({}, function(err, doc) {
		console.log(doc);
		res.send(returnJson);
	});
};

exports.indicatorMapping = function(req, res) {
	var indicatorMappingJSON = {};
	var query = require('url').parse(req.url, true).query;
	var idc = query.idc;
	var dimensions = [];
	var measures = [];
	IndicatorSchema.find({
		indicator_key : idc
	}, function(err, doc) {
		doc.forEach(function(item, index) {
			console.log(item.indicator_key);
			console.log(item.indicator_text);
			var tempDimensions = item.dimension;
			tempDimensions.forEach(function(dimension, index) {
				var tempDimension = {
					"uniqueName" : dimension.dimension_key,
					"name" : dimension.dimension_key,
					"text" : dimension.dimension_text
				};
				dimensions.push(tempDimension);
			});
			var tempMesureJson = {
				"uniqueName" : item.indicator_key,
				"name" : item.indicator_key,
				"text" : item.indicator_text
			};
			measures.push(tempMesureJson);
		});
		indicatorMappingJSON = {
			"dimensions" : dimensions,
			"measures" : measures
		};
		console.log(indicatorMappingJSON);
		res.send(indicatorMappingJSON);
	});
}

exports.indicatorSearch = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var indicatorResultJSON = {};
	if (query.query != null) {
		var key = query.query.toLowerCase();
		var results = [];
		IndicatorSchema.find({
			indicator_key : {
				$regex : key
			}
		}, function(err, doc) {
			doc.forEach(function(item, index) {
				console.log(item.indicator_key);
				console.log(item.indicator_text);
				var tempJson = {
					"uniqueName" : item.indicator_key,
					"text" : item.indicator_text
				};
				results.push(tempJson);
			});
			indicatorResultJSON = {
				"indicators" : results
			};
			res.send(indicatorResultJSON);
		});
	} else {
		indicatorResultJSON = {
			"indicators" : []
		};
		res.send(indicatorResultJSON);
	}
};
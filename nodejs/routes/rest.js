var data = require('../data/sampleData');
var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var IndicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;

exports.cubeList = function(req, res) {
	res.send(data.cubeListJSON);
};

exports.cubeInfo = function(req, res) {
	res.send(data.cubeInfoJSON);
};

exports.queryResult = function(req, res) {
	var queryParam = req.body;
	var resultJSON = {
		"total" : 0,
		"result" : []
	};
	var groupStr = generateGroupStr(queryParam);
	var groupObj = eval("(" + groupStr + ")");
	datasetSchema.aggregate().group(groupObj).exec(function(err, doc) {
		if (err)
			return handleError(err);
		resultJSON.result = convertResult(doc);
		resultJSON.total = doc.length;
		res.send(resultJSON);
	});
};

function generateGroupStr(queryParam) {
	var dimensions = queryParam.dimensions;
	var measures = queryParam.measures;
	var idStr = "_id:{";
	dimensions.forEach(function(item, index) {
		idStr += item.uniqueName;
		idStr += ":\"$";
		idStr += item.uniqueName;
		idStr += "\"";
		if (index < dimensions.length - 1) {
			idStr += ","
		}
	});
	idStr += "},"
	var indicatorStr = "";
	measures.forEach(function(item, index) {
		indicatorStr += item.uniqueName;
		indicatorStr += ":{";
		if (item.data_type == 'number') {
			indicatorStr += "$sum:";
		} else if (item.data_type == 'percentage') {
			indicatorStr += "$avg:";
		} else {
			return "";
		}
		indicatorStr += "\"$";
		indicatorStr += item.uniqueName;
		indicatorStr += "\"";
		indicatorStr += "}"
		if (index < measures.length - 1) {
			indicatorStr += ","
		}
	});
	var res = "{" + idStr + indicatorStr + "}";
	return res;
}

function convertResult(doc) {
	var results = [];
	doc.forEach(function(item) {
		var gstr = JSON.stringify(item._id);
		gstr = gstr.substring(1, gstr.length - 1);
		delete item._id;
		var mstr = JSON.stringify(item);
		mstr = mstr.substring(1, mstr.length - 1);
		var recordStr = '{' + gstr + ',' + mstr + '}';
		var recordObj = eval("(" + recordStr + ")");
		results.push(recordObj);
	});
	return results;
}

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
				"text" : item.indicator_text,
				"data_source" : item.data_source,
				"data_type" : item.data_type
			};
			measures.push(tempMesureJson);
		});
		indicatorMappingJSON = {
			"dimensions" : dimensions,
			"measures" : measures
		};
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
			indicator_text : {
				$regex : key,
				$options : 'i'
			}
		}, function(err, doc) {
			doc.forEach(function(item, index) {
				var tempJson = {
					"uniqueName" : item.indicator_key,
					"text" : item.indicator_text + ' - ' + item.data_source
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
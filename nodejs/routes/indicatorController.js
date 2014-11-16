var cache = require('memory-cache');
var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var async = require('../lib/async');
var IndicatorSchema = indicator.Indicator;

exports.searchIndicator = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var indicatorResultJSON = {};
	if (query.query != null && query.query.length > 0) {
		var input = query.query;
		var keys = input.split(' ');
		var dimensions = [];
		var results = [];
		var callbackFuncArray = [];
		keys.forEach(function(key, index) {
			if (key.length > 0) {
				var callbackFunc = function(callback) {
					IndicatorSchema.find({
						indicator_text : {
							$regex : key,
							$options : 'i'
						}
					}, function(err, doc) {
						if (err)
							console.log('Exception: ' + err);
						doc.forEach(function(item, index) {
							var tempJson = {
								"uniqueName" : item.indicator_key,
								"text" : item.indicator_text + ' - ' + item.data_source,
								"dimensionStr" : genDimStr(item.dimension)
							};
							results.push(tempJson);
						});
						// match dimension value
						// if (doc.length === 0 && key.length > 2) {
						// var dims = cache.get('dimensions');
						// dims.forEach(function(d) {
						// if ((d.dimension_value +
						// '').toLowerCase().indexOf(key.toLowerCase()) > -1) {
						// dimensions.push(d);
						// }
						// });
						// }
						callback();
					});
				}
				callbackFuncArray.push(callbackFunc);
			}
		});
		async.parallel(callbackFuncArray, function() {
			console.log('matched results count: ' + results.length);
			// console.log('matched dimension value count: ' +
			// dimensions.length);
			// results.forEach(function(r) {
			// dimensions.forEach(function(d) {
			// if (r.dimensionStr.indexOf(d.dimension_key) > -1) {
			// r.text = d.dimension_value + ' - ' + r.text;
			// r.uniqueName = r.uniqueName + '///' + d.dimension_key + '///' +
			// d.dimension_value;
			// results.push(r);
			// }
			// });
			// });
			indicatorResultJSON = {
				"indicators" : results
			};
			// console.log(indicatorResultJSON);
			res.send(indicatorResultJSON);
		});
	} else {
		indicatorResultJSON = {
			"indicators" : []
		};
		res.send(indicatorResultJSON);
	}
};

var genDimStr = function(dimensionArray) {
	var dimensionStr = '';
	dimensionArray.forEach(function(d) {
		dimensionStr += d.dimension_key;
	});
	return dimensionStr;
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
		if (err)
			console.log('Exception: ' + err);
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
				"source_note" : item.sourceNote,
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

exports.topicSearch = function(req, res) {
	IndicatorSchema.find({}, {
		_id : 0,
		topics : 1,
		indicator_text : 1,
		indicator_key : 1
	}).sort({
		'topics' : 1
	}).exec(function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		var topicArray = [];
		var topicObjArray = [];
		doc.forEach(function(item) {
			if (item.topics !== null && item.topics.length > 0) {
				item.topics.forEach(function(topic) {
					if (topic !== null && topic !== '') {
						if (topicArray.indexOf(topic) === -1) {
							var topicObj = {
								'topic' : topic,
								'indicatorKey' : [],
								'indicatorText' : []
							};
							topicArray.push(topic);
							topicObjArray.push(topicObj);
						}
					}
				});
			}
		});
		topicObjArray.forEach(function(topicObj) {
			doc.forEach(function(item) {
				if (item.topics !== null && item.topics.indexOf(topicObj.topic) > -1) {
					topicObj.indicatorKey.push(item.indicator_key);
					topicObj.indicatorText.push(item.indicator_text);
				}
			});
		});
		// console.log(topicObjArray);
		res.send(topicObjArray);
	});
};
var cache = require('memory-cache');
var mongodb = require('../data/mongodb');
var async = require('../lib/async');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var IndicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;

exports.init = function() {
	console.log('Init server cache...');
	var dimensionObjs = [];
	var indicatorObjs = [];
	var currentTime = Date.now();
	IndicatorSchema.distinct('dimension').exec(function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		doc.forEach(function(dim, index) {
			if (dim.dimension_key != 'year' && dim.dimension_key != 'month') {
				async.parallel([ function(callback) {
					datasetSchema.distinct(dim.dimension_key).exec(function(err, doc) {
						doc.forEach(function(dimVal) {
							// console.log(dim.dimension_key + ' : ' + dimVal);
							var dimObj = {
								'dimension_key' : dim.dimension_key,
								'dimension_value' : dimVal
							};
							dimensionObjs.push(dimObj);
						});
						callback();
					});
				} ], function() {
					if (doc.length - 1 == index) {
						cache.put('dimensions', dimensionObjs);
						console.log('dimension size: ' + dimensionObjs.length);
						console.log('cost ' + (Date.now() - currentTime) + ' ms.');
					}
				});
			}
		});
	});
	IndicatorSchema.find({}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		doc.forEach(function(indicator, index) {
			var indicatorObj = {
				indicator_key : doc.indicator_key,
				indicator_text : doc.indicator_text
			}
			indicatorObjs.push(indicatorObj);
		})
		cache.put('indicators', indicatorObjs);
		console.log('indicators size: ' + indicatorObjs.length);
		console.log('cost ' + (Date.now() - currentTime) + ' ms.');
	})
}
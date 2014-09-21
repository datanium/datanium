var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var async = require('../lib/async');
var IndicatorSchema = indicator.Indicator;

exports.searchIndicator = function(req, res) {
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
			if (err)
				console.log('Exception: ' + err);
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

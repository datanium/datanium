var cache = require('memory-cache');
var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var country = require('../data/country');
var async = require('../lib/async');
var pinyinsort = require('../lib/pinyinsort');
var indicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;
var countrySchema = country.Country;

exports.searchEntry = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	if (query.keyword != null && query.keyword.length > 0) {
		var start = 0;
		if (query.start != null && query.start.length > 0) {
			start = query.start;
		}
		var keyword = query.keyword;
		console.log(keyword);

		indicatorSchema.count({
			indicator_text : {
				$regex : keyword,
				$options : 'i'
			}
		}).count(function(err, total) {
			if (err)
				console.log('Exception: ' + err);
			var prev = start < 10 ? -1 : start - 10;
			var next = start + 10 >= total ? -1 : start + 10;
			var range = [];
			var index = start < 50 ? 0 : start - 40;
			for (i = 0; i < 9; i++) {
				if (index < total)
					range.push(index);
				index += 10;
			}
			indicatorSchema.find({
				indicator_text : {
					$regex : keyword,
					$options : 'i'
				}
			}).skip(start).limit(10).exec(function(err, doc) {
				if (err)
					console.log('Exception: ' + err);
				res.render('searchresult.ejs', {
					currPage : 'search',
					host : req.protocol + '://' + req.get('host'),
					userEmail : req.session.user ? req.session.user.email : null,
					username : req.session.user ? req.session.user.username : null,
					results : doc,
					keyword : keyword,
					curr : start,
					prev : prev,
					next : next,
					range : range,
					total : total
				});
			});
		});
	} else {
		res.render('searchresult.ejs', {
			currPage : 'search',
			host : req.protocol + '://' + req.get('host'),
			userEmail : req.session.user ? req.session.user.email : null,
			username : req.session.user ? req.session.user.username : null,
			results : [],
			keyword : '',
			total : 0
		});
	}
};

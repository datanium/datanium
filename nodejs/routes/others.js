var mongodb = require('../data/mongodb');
var feedback = require('../data/feedback');
var dataset = require('../data/dataset');
var FeedbackSchema = feedback.Feedback;
var datasetSchema = dataset.Dataset;
var async = require('../lib/async');
var pinyinsort = require('../lib/pinyinsort');

exports.feedbacksave = function(req, res) {
	var userEmail = 'anonymous user';
	if (req.session.user != null)
		userEmail = req.session.user.email;
	var content = req.body.feedbackContent;
	var userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var currentDate = new Date();
	var oneFeedback = {
		'content' : content,
		'user_id' : userEmail,
		'user_ip' : userip,
		'creation_date' : currentDate
	};
	FeedbackSchema.create(oneFeedback, function(err) {
		if (err)
			console.log('Exception: ' + err);
		status = 'success';
		returnJSON = {
			'status' : status
		};
		res.send(returnJSON);
	});
}

exports.release_notes = function(req, res) {
	var username = null;
	var userEmail = null;
	if (req.session.user != null) {
		username = req.session.user.username;
		userEmail = req.session.user.email;
	}
	res.render('release_notes.ejs', {
		currPage : 'release_notes',
		host : req.protocol + '://' + req.get('host'),
		username : username,
		userEmail : userEmail
	});
};

exports.dimensionValueSearch = function(req, res) {
	var start = new Date().getTime();
	var query = require('url').parse(req.url, true).query;
	var dimensionValueResultJSON = {};
	if (query.dim != null) {
		var key = query.dim.toLowerCase();
		var results = [];
		
		// exclude blank record
		var matchStr = '{ ' + key + ' : { $ne : \'\' } }';
		var matchObj = eval("(" + matchStr + ")");
		datasetSchema.aggregate().match(matchObj).group({
			'_id' : '$' + key
		}).sort('field _id').exec(function(err, doc) {
			if (err)
				console.log('Exception: ' + err);
			doc.forEach(function(item, index) {
				if (item._id != null) {
					var tempJson = {
						"name" : item._id
					};
					results.push(tempJson);
				}
			});
			
			// sort by pinyin
			results.sort(function(a, b) {
				return a['name'].localeCompare(b['name']);
			});
			
			dimensionValueResultJSON = {
				"dimensionValues" : results
			};
			
			// put send here cause callback func is async
			var end = new Date().getTime();
			var time = end - start;
			console.log('Query execution time: ' + time + ' ms');
			res.send(dimensionValueResultJSON);
		});
	} else {
		dimensionValueResultJSON = {
			"dimensionValues" : []
		};
		res.send(dimensionValueResultJSON);
	}
}
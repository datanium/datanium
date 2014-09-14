var mongodb = require('../data/mongodb');
var feedback = require('../data/feedback');
var FeedbackSchema = feedback.Feedback;
var async = require('../lib/async');

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
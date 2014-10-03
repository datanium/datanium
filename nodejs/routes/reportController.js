var mongodb = require('../data/mongodb');
var user = require('../data/user');
var report = require('../data/report');
var UserSchema = user.User;
var reportSchema = report.Report;
var async = require('../lib/async');
var ejs = require('ejs');
ejs.open = '$[';
ejs.close = ']';

exports.remove = function(req, res) {
	console.log('report/remove');
	var rptId = req.url.substr(20);
	if (req.session.user == null) {
		res.redirect('/');
		return;
	}
	var userEmail = req.session.user.email;
	async.parallel([ function(callback) {
		reportSchema.findOneAndRemove({
			hashid : rptId,
			user_id : userEmail
		}, function(err, rpt) {
			if (err) {
				console.log('Exception: ' + err);
				res.redirect('/');
				return;
			} else {
				console.log('remove succeeded.');
				callback();
			}
		});
	} ], function() {
		res.redirect('/user/space/');
	});
}
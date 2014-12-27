var mongodb = require('../data/mongodb');
var user = require('../data/user');
var report = require('../data/report');
var UserSchema = user.User;
var reportSchema = report.Report;
var async = require('../lib/async');
var hashids = require('../lib/hashids');

exports.remove = function(req, res) {
	console.log('report/remove');
	var rptId = req.url.substr(15);
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

exports.save = function(req, res) {
	var userEmail = 'Anonymous User';
	var userName = req.i18n.__('Anonymous User');
	if (req.session.user != null) {
		userEmail = req.session.user.email;
		userName = req.session.user.username;
	}
	var reportObj = req.body;
	var userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var hashid = null;
	var status = 'success';
	var rptTitle = '';
	if (reportObj.title != null && reportObj.title.length > 0) {
		rptTitle = reportObj.title;
	} else {
		rptTitle = req.i18n.__('Untitled');
	}
	var rptDesc = '';
	if (reportObj.description != null && reportObj.description.length > 0) {
		rptDesc = reportObj.description;
	} else {
		rptDesc = req.i18n.__('No description.');
	}
	var date = new Date();
	async.parallel([ function(callback) {
		if (reportObj.hashid !== null && reportObj.hashid !== '') {
			console.log('Update Report ' + reportObj.hashid);
			// update analysis
			reportSchema.findOne({
				hashid : reportObj.hashid
			}, function(err, rpt) {
				if (err)
					throw err;
				hashid = rpt.hashid;
				if (rpt.user_id == userEmail) {
					reportSchema.update({
						hashid : reportObj.hashid
					}, {
						qubeInfo : reportObj.qubeInfo,
						queryParam : reportObj.queryParam,
						rptMode : reportObj.rptMode,
						chartMode : reportObj.chartMode,
						autoScale : JSON.parse(reportObj.autoScale),
						showLegend : JSON.parse(reportObj.showLegend),
						title : rptTitle,
						description : rptDesc,
						user_name : userName,
						user_ip : userip,
						modification_date : date
					}, function(err, doc) {
						if (err)
							throw err;
						callback();
					});
				} else {
					status = 'userid_not_match';
					callback();
				}
			});
		} else {
			console.log('Save New Report');
			// encrypt hashid
			var key = Math.round(date.getTime() + Math.random() * 10);
			var hashs = new hashids("datanium salt", 4);
			hashid = hashs.encrypt(key);
			// save report
			var newReport = new reportSchema({
				hashid : hashid,
				qubeInfo : reportObj.qubeInfo,
				queryParam : reportObj.queryParam,
				rptMode : reportObj.rptMode,
				chartMode : reportObj.chartMode,
				autoScale : JSON.parse(reportObj.autoScale),
				showLegend : JSON.parse(reportObj.showLegend),
				title : rptTitle,
				description : rptDesc,
				user_name : userName,
				user_id : userEmail,
				user_ip : userip,
				creation_date : date,
				modification_date : date
			});
			newReport.save();
			callback();
		}
	} ], function() {
		res.send({
			hashid : hashid,
			status : status
		});
	});
}

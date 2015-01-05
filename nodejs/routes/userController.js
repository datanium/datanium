var mongodb = require('../data/mongodb');
var user = require('../data/user');
var report = require('../data/report');
var UserSchema = user.User;
var reportSchema = report.Report;
var async = require('../lib/async');
var crypto = require('crypto');

exports.saveUser = function(req, res) {
	var userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var info = req.body;
	var username = info.username;
	var password = info.password;
	var email = info.email;
	var returnJSON = {};
	var status = '';
	var message = '';
	var userExistFlag = false;
	var emailExistFlag = false;
	async.parallel([ function(callback) {
		UserSchema.find({
			username : username
		}, function(err, doc) {
			if (err) {
				console.log('Exception: ' + err);
				res.send('500 Sorry, server error...');
				return false;
			}
			if (doc.length > 0) {
				userExistFlag = true;
			}
			callback();
		});
	}, function(callback) {
		UserSchema.find({
			email : email
		}, function(err, doc) {
			if (err) {
				console.log('Exception: ' + err);
				res.send('500 Sorry, server error...');
				return false;
			}
			if (doc.length > 0) {
				emailExistFlag = true;
			}
			callback();
		});
	} ], function() {
		if (userExistFlag) {
			status = 'username_exists';
			message = req.i18n.__('Username already exists.');
			returnJSON = {
				'status' : status,
				'message' : message
			}
			res.send(returnJSON);
			return;
		}
		if (emailExistFlag) {
			status = 'email_exists';
			message = req.i18n.__('Email already exists.');
			returnJSON = {
				'status' : status,
				'message' : message
			}
			res.send(returnJSON);
			return;
		}
		var currentDate = getCurrentDate();
		var oneUser = {
			'username' : username,
			'password' : md5(password),
			'email' : email,
			'signup_date' : currentDate,
			'last_login_date' : currentDate,
			'last_login_ip' : userip
		};
		UserSchema.create(oneUser, function(err) {
			if (err) {
				status = 'create_user_fail';
				message = 'New user created failed!';
				console.log('Exception: ' + err);
			} else {
				status = 'create_user_success';
				message = 'New user created successfully!';
				req.session.user = {
					username : username,
					email : email
				};
			}
			console.log(status);
			returnJSON = {
				'status' : status,
				'message' : message,
				'user_email' : email,
				'username' : username
			};
			res.send(returnJSON);
		});
	});
};

exports.login = function(req, res) {
	var info = req.body;
	var email = info.email;
	var password = md5(info.password);
	console.log(password);
	var returnJSON = {};
	var status = '';
	var message = '';
	UserSchema.findOneAndUpdate({
		email : email
	}, {
		last_signin_date : getCurrentDate()
	}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		else {
			var user = doc;
			var emailNotExistFlag = (user == null);
			if (emailNotExistFlag == true) {
				status = 'email_not_exist';
				message = req.i18n.__('Account does not exist.');
				returnJSON = {
					'status' : status,
					'message' : message
				}
				res.send(returnJSON);
				return;
			}
			var passExistFlag = (user.password == password);
			if (passExistFlag == false) {
				status = 'password_not_match';
				message = req.i18n.__('Password does not match.');
				returnJSON = {
					'status' : status,
					'message' : message
				}
				res.send(returnJSON);
				return;
			}
			status = 'login_success';
			message = 'Login successfully.';
			returnJSON = {
				'status' : status,
				'message' : message,
				'user_email' : user.email,
				'username' : user.username
			};
			req.session.user = {
				username : user.username,
				email : user.email
			};
			res.send(returnJSON);
			return;
		}
	});
};

exports.signout = function(req, res) {
	console.log('logout...');
	req.session.user = null;
	res.redirect('/');
}

exports.space = function(req, res) {
	console.log('user/space: ' + req.session.user);
	if (req.session.user == null) {
		res.redirect('/');
		return;
	}
	var username = req.session.user.username;
	UserSchema.findOne({
		username : username
	}, function(err, user) {
		if (err)
			console.log('Exception: ' + err);
		else {
			reportSchema.find({
				user_id : user.email
			}).sort({
				'modification_date' : -1
			}).exec(function(err, reports) {
				// console.log(reports);
				if (err)
					console.log('Exception: ' + err);
				else {
					res.render('space.ejs', {
						currPage : 'space',
						host : req.protocol + '://' + req.get('host'),
						username : user.username,
						userEmail : user.email,
						signup_date : dateFormat(user.signup_date),
						reports : reports
					});
				}
			})
		}
	});
}

function getCurrentDate() {
	var currentDate = new Date();
	return currentDate;
};

function dateFormat(date) {
	return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function md5(text) {
	return crypto.createHash('md5').update(text).digest('hex');
}

exports.settings = function(req, res) {
	var username = null;
	if (req.session.user == null) {
		res.redirect('/');
		return;
	}
	var username = req.session.user.username;
	console.log("settings: " + username);
	var userEmail = req.session.user.email;
	UserSchema.findOne({
		email : userEmail
	}, function(err, user) {
		if (err)
			console.log('Exception: ' + err);
		else {
			res.render('settings.ejs', {
				currPage : 'space',
				host : req.protocol + '://' + req.get('host'),
				username : user.username,
				userEmail : user.email,
				signup_date : dateFormat(user.signup_date)
			});
		}
	});
};

exports.saveSettings = function(req, res) {
	var userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var username = req.session.user.username;
	var userEmail = req.session.user.email;
	if (req.session.user == null) {
		res.redirect('/');
		return;
	}
	var info = req.body;
	var newusername = info.username;
	var password = md5(info.password);
	var newpassword = md5(info.newpassword);
	var conpassword = md5(info.conpassword);

	var returnJSON = {};
	var status = '';
	var message = '';
	var userExistFlag = false;
	var passNotMatchFlag = false;
	async.parallel([ function(callback) {
		UserSchema.findOne({
			username : username
		}, function(err, doc) {
			if (err) {
				console.log('Exception: ' + err);
				res.send('500 Sorry, server error...');
				return false;
			}
			if (doc != null && doc.password != password) {
				passNotMatchFlag = true;
			}
			callback();
		});
	}, function(callback) {
		if (newusername != null && newusername != '' && newusername != username) {
			UserSchema.find({
				username : newusername
			}, function(err, doc) {
				if (err) {
					console.log('Exception: ' + err);
					res.send('500 Sorry, server error...');
					return false;
				}
				if (doc.length > 0) {
					userExistFlag = true;
				}
				callback();
			});
		} else {
			callback();
		}
	} ], function() {
		if (userExistFlag) {
			status = 'username_exists';
			message = req.i18n.__('Username already exists.');
			returnJSON = {
				'status' : status,
				'message' : message
			}
			res.send(returnJSON);
			return;
		}
		if (passNotMatchFlag) {
			status = 'password_not_match';
			message = req.i18n.__('Password does not match.');
			returnJSON = {
				'status' : status,
				'message' : message
			}
			res.send(returnJSON);
			return;
		}
		var currentDate = getCurrentDate();
		if (newusername != null && newusername != '' && newpassword != null && newpassword != '') {
			UserSchema.update({
				email : userEmail
			}, {
				'username' : newusername,
				'password' : newpassword
			}, function(err, user) {
				if (err)
					throw err;
				req.session.user = {
					username : user.username,
					email : user.email
				};
			});
		} else if (newpassword != null && newpassword != '') {
			UserSchema.update({
				email : userEmail
			}, {
				'password' : newpassword
			}, function(err, user) {
				if (err)
					throw err;
				req.session.user = {
					username : user.username,
					email : user.email
				};
			});
		} else {
			UserSchema.update({
				email : userEmail
			}, {
				'username' : newusername
			}, function(err, user) {
				if (err)
					throw err;
				req.session.user = {
					username : user.username,
					email : user.email
				};
			});
		}
		returnJSON = {
			'status' : "modify_success",
			'message' : message
		};
		res.send(returnJSON);
	});
};
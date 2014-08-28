var mongodb = require('../data/mongodb');
var user = require('../data/user');
var UserSchema = user.User;
var async = require('../lib/async');

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
		console.log(userExistFlag);
		console.log(emailExistFlag);
		if (userExistFlag) {
			status = 'username_exists';
			message = 'Username already exists.';
			returnJSON = {
				'status' : status,
				'message' : message
			}
			res.send(returnJSON);
			return;
		}
		if (emailExistFlag) {
			status = 'email_exists';
			message = 'Email already exists.';
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
			'password' : password,
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
	var password = info.password;
	var returnJSON = {};
	var status = '';
	var message = '';
	console.log('get user ' + email);
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
				message = 'Account does not exist.';
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
				message = 'Password does not match.';
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

function getCurrentDate() {
	var currentDate = new Date();
	return currentDate;
};


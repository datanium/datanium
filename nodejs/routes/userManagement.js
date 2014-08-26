var mongodb = require('../data/mongodb');
var user = require('../data/user');
var UserSchema = user.User;
var async = require('../lib/async');

exports.saveUser = function(req, res) {
	var info=req.body;
	var username = info.username;
	var password = info.password;
	var email = info.email;
	var returnJSON = {};
	var status = '';
	var message = '';
	var userExistFlag = checkUserExist(username);
	console.log(userExistFlag);
	var emailExistFlag = checkEmailExist(email);
	console.log(emailExistFlag);
	if(userExistFlag == false){
		status = 'Username Exist';
        message='Username already exists.';
        returnJSON = {
		'status' : status,
		'message' : message
	}
	res.send(returnJSON);
}
if(emailExistFlag == false){
		status = 'Email Exist';
        message='Email already exists.';
        returnJSON = {
		'status' : status,
		'message' : message
	}
	res.send(returnJSON);
}
	var currentDate = getCurrentDate();
	var oneUser = {'username' : username,
				   'password' : password,
				   'email' : email,
				   'signup_date' : currentDate,
				   'last_signin_date' : currentDate};
	UserSchema.create(oneUser, function(err){
          if (err) {
          	status='failed';
          	message='New user created failed!';
            console.log('Exception: ' + err);
          }
          status='success';
          message='New user created successfully!';
          returnJSON = {
		'status' : status,
		'message' : message
		};
          res.send(returnJSON);
      });	

};

function getCurrentDate(){
	var currentDate = new Date();
	return currentDate;
};

function checkUserExist(user){
	var flag = true;
	/*async.series({
		one : function (callback){
		UserSchema.find({
		username : user
		}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		if(doc.length > 0){
			flag = false;
		}
		callback();
	});
		},
	two : function (callback){
		return flag;
	}
});*/
		UserSchema.find({
		username : user
		}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		if(doc.length > 0){
			flag = false;
		}
	});
	return flag;
};

function checkEmailExist(emailAddr){
	UserSchema.find({
		email : emailAddr
	}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		if(doc.length > 0){
			return false;
		}
	});
};


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
	if(userExistFlag == true){
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
	}else{
		status = 'failed';
        message='user '+username+' already exists.';
        returnJSON = {
		'status' : status,
		'message' : message
	};
	res.send(returnJSON);
	}
	

};

function getCurrentDate(){
	var currentDate = new Date();
	return currentDate;
};

function checkUserExist(username){
	return true;
};


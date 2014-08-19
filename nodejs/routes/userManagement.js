var mongodb = require('../data/mongodb');
var user = require('../data/user');
var UserSchema = user.User;

exports.saveUser = function(req, res) {
	var info=req.body;
	UserSchema.userId = info.userId;
	UserSchema.userName = info.userName;
	UserSchema.password = info.password;
	UserSchema.email = info.email;
	UserSchema.save(function(err){
          if (err) {
            console.log('save failed');  
          }
          console.log('save success'); 
      });

};


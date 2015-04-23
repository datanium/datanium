var fs = require("fs");
var PythonShell = require('python-shell');
var mongodb = require('../data/mongodb');
var method = require('../data/stock_method');
var methodSchema = method.Method;

exports.stockholm = function(req, res) {
	res.render('stockholm.ejs', {
		currPage : 'stock',
		host : req.protocol + '://' + req.get('host')
	});
}

exports.loadData = function(req, res) {
	var targetDate = null;
	var query = require('url').parse(req.url, true).query;
	if (query.targetDate != null && query.targetDate.length > 0) {
		targetDate = query.targetDate;
	}
	var dirname = getUserHome() + "/tmp/stockholm_export";
	var dateArray = [];
	fs.readdir(dirname, function(err, files) {
		if (files != null) {
			var isDateValid = false;
			files.forEach(function(file) {
				if (file.indexOf("result_") >= 0) {
					var date = file.substr(7, 10);
					dateArray.push(date);
					if (date == targetDate) {
						isDateValid = true;
					}
				}
			});
			if (targetDate == null || targetDate == "") {
				targetDate = dateArray[dateArray.length - 1];
				isDateValid = true;
			}
			var resultJSON = {
				"res" : [],
				"targetDate" : targetDate
			};
			if (isDateValid) {
				files.forEach(function(file) {
					if (file.indexOf(targetDate) >= 0) {
						var filepath = dirname + "/" + file;
						fs.readFile(filepath, function(error, fileData) {
							if (error) {
								console.log(error);
							}
							var data = JSON.parse(fileData);

							data.forEach(function(item, index) {
								if ("Data" in item && item.Data.length > 0) {
									for ( var key in item.Data[0]) {
										item[key] = item.Data[0][key];
									}
								}
								item["Date"] = targetDate;
							});

							resultJSON.res = data;
							res.send(resultJSON);
						});
					}
				});
			} else {
				res.send(resultJSON);
			}
		}
	});
}

exports.loadDates = function(req, res) {
	var dirname = getUserHome() + "/tmp/stockholm_export";
	var dateArray = [];
	fs.readdir(dirname, function(err, files) {
		if (files != null) {
			files.forEach(function(file) {
				if (file.indexOf("result_") >= 0) {
					var date = file.substr(7, 10);
					var dateObj = {};
					dateObj['date_str'] = date;
					dateArray.push(dateObj);
				}
			});
			var resultJSON = {
				"res" : dateArray
			};
			res.send(resultJSON);
		}
	});
}

exports.runTest = function(req, res) {
	var resultJSON = {
		"status" : "Successful",
		"msg" : "回测执行完毕..."
	};

	var options = {
		mode : 'text',
		pythonPath : 'python3.4',
		args : [ '--reload=N', '--portfolio=Y', '--testfile=mongodb' ],
		scriptPath : '/Users/Puffy/git/stockholm/stockholm'
	// scriptPath : '/opt/datanium/stockholm_codebase/stockholm'
	};
	// console.log(options);

	PythonShell.run('main.py', options, function(err, results) {
		if (err) {
			resultJSON = {
				"status" : "Failed",
				"msg" : "回测执行失败..."
			};
		}
		console.log('script execution is completed...');
		res.send(resultJSON);
	});
}

exports.loadMethods = function(req, res) {
	console.log(0);
	methodSchema.find({}, function(err, doc) {
		console.log(1);
		if (err) {
			console.log(2);
			console.log('Exception: ' + err);
		}
		console.log(3);
		var methodObjArray = [];
		console.log(doc);
		doc.forEach(function(rec) {
			var methodObj = {
				'name' : rec.name,
				'desc' : rec.desc,
				'method' : rec.method,
				'user_id' : rec.user_id,
				'user_name' : rec.user_name,
				'creation_date' : rec.creation_date,
				'modification_date' : rec.modification_date
			};
			methodObjArray.push(methodObj);
		});
		console.log(methodObjArray);
		var resultJSON = {
			"status" : "Successful",
			"res" : methodObjArray
		};
		res.send(resultJSON);
	});
}

var getUserHome = function() {
	return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

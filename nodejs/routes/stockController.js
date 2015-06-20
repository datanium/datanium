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
							// console.log(data);
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
	var methodIds = [];
	var query = require('url').parse(req.url, true).query;
	if (query.ids != null && query.ids.length > 0) {
		methodIds = query.ids.split(',');
	}
	var resultJSON = {
		"status" : "Successful",
		"msg" : "回测执行完毕..."
	};

	var options = {
		mode : 'text',
		pythonPath : 'python3.4',
		args : [ '--reload=N', '--portfolio=Y', '--testfile=mongodb', '--dbname=datanium' ],
		// scriptPath : '/Users/Puffy/git/stockholm/stockholm'
		scriptPath : '/opt/datanium/stockholm_codebase/stockholm'
	};
	if (methodIds != null && methodIds.length > 0) {
		options['args'].push('--methods=' + methodIds);
	}
	// console.log(options);

	PythonShell.run('main.py', options, function(err, results) {
		if (err) {
			resultJSON = {
				"status" : "Failed",
				"msg" : "回测执行失败..."
			};
			console.log(err);
		}
		// console.log(results);
		console.log('script execution is completed...');
		res.send(resultJSON);
	});
}

exports.loadMethods = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var findObj = {};
	if (query.id != null && query.id.length > 0) {
		findObj = {
			"method_id" : query.id
		};
	}
	methodSchema.find(findObj, function(err, doc) {
		if (err) {
			console.log('Exception: ' + err);
		}
		var methodObjArray = [];
		doc.forEach(function(rec) {
			var methodObj = {
				'method_id' : rec.method_id,
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
		var resultJSON = {
			"status" : "Successful",
			"res" : methodObjArray
		};
		res.send(resultJSON);
	});
}

exports.saveMethod = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var methodObj = req.body;
	var date = new Date();
	if (methodObj.method_id != null && methodObj.method_id != '') {
		console.log('Update Method ' + methodObj.name);
		methodSchema.findOne({
			method_id : methodObj.method_id
		}, function(err, mtd) {
			if (err)
				throw err;
			methodSchema.update({
				method_id : methodObj.method_id
			}, {
				'name' : methodObj.name,
				'desc' : methodObj.desc,
				'method' : methodObj.method,
				'modification_date' : date
			}, function(err, doc) {
				if (err) {
					res.send({
						success : false,
						msg : "保存出错..."
					});
					throw err;
				}
				res.send({
					success : true,
					msg : "保存成功..."
				});
			});
		});
	} else {
		console.log('Save New Method');
		var newMethod = new methodSchema({
			'name' : methodObj.name,
			'desc' : methodObj.desc,
			'method' : methodObj.method,
			'user_id' : 'dtnium@gmail.com',
			'user_name' : 'Stockholm',
			'creation_date' : date,
			'modification_date' : date
		});
		newMethod.save(function(err, doc) {
			if (err) {
				res.send({
					success : false,
					msg : "保存出错..."
				});
				throw err;
			}
			res.send({
				success : true,
				msg : "保存成功..."
			});
		});

	}
}

exports.removeMethod = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var findObj = {};
	if (query.id != null && query.id.length > 0) {
		methodSchema.remove({
			"method_id" : query.id
		}, function(err, doc) {
			var resultJSON = {
				"status" : "Success"
			};
			if (err) {
				console.log('Exception: ' + err);
				resultJSON = {
					"status" : "Failed"
				};
			}
			res.send(resultJSON);
		});
	} else {
		res.send({
			"status" : "Failed"
		});
	}
}

exports.loadTrend = function(req, res) {
	var targetDate = null;
	var targetSymbol = null;
	var query = require('url').parse(req.url, true).query;
	if (query.targetDate != null && query.targetDate.length > 0) {
		targetDate = query.targetDate;
	}
	if (query.targetSymbol != null && query.targetSymbol.length > 0) {
		targetSymbol = query.targetSymbol;
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
				"targetDate" : targetDate,
				"targetSymbol" : targetSymbol
			};
			if (isDateValid && targetSymbol != null) {
				files.forEach(function(file) {
					if (file.indexOf(targetDate) >= 0) {
						var filepath = dirname + "/" + file;
						fs.readFile(filepath, function(error, fileData) {
							if (error) {
								console.log(error);
							}
							var data = JSON.parse(fileData);
							var trends = [];
							data.forEach(function(item, index) {
								if (item["Symbol"] == targetSymbol) {
									if ("Data" in item && item.Data.length > 0) {
										for ( var key in item.Data[0]) {
											item[key] = item.Data[0][key];
										}
									}
									for (i = 1; i <= 10; i++) {
										var profitKey = "Day_" + i + "_Profit";
										if (item[profitKey] != null) {
											var trend = {
												Date : targetDate,
												Symbol : item["Symbol"],
												Name : item["Name"],
												Day : i,
												Change : item[profitKey]
											}
											trends.push(trend);
										}
									}
								}
							});

							console.log(trends);
							resultJSON.res = trends;
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

var getUserHome = function() {
	return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

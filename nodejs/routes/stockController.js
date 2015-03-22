var fs = require("fs");

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
					dateObj['Date'] = date;
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

var getUserHome = function() {
	return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}
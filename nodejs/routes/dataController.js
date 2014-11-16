var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var report = require('../data/report');
var async = require('../lib/async');
var IndicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;
var reportSchema = report.Report;

exports.querySplit = function(req, res) {
	var start = new Date().getTime();
	var resultJSON = {
		"grid" : {
			"total" : 0,
			"result" : []
		},
		"chart" : {
			"result" : []
		}
	};
	var queryParam = req.body;
	var matchObj = generateMatchObj(queryParam, false);
	// for grid
	var group = generateGroupObj(queryParam);
	var groupObj = group.returnObj;
	var groupObjProject = group.returnProject;
	var sortStr = group.returnSort;
	// for chart
	var groupSplitJSON4Chart = generateGroupSplitObj(queryParam);
	var groupObj4Chart = groupSplitJSON4Chart.returnObj;
	var groupObj4ChartProject = groupSplitJSON4Chart.returnProject;
	var sortStr4Chart = groupSplitJSON4Chart.returnSort;
	// to get all the query results and return
	async.parallel([
			function(callback) {
				// query for grid
				datasetSchema.aggregate().match(matchObj).group(groupObj).project(groupObjProject).sort(sortStr).limit(
						1000).exec(function(err, doc) {
					if (err)
						throw err;
					resultJSON.grid.result = doc;
					resultJSON.grid.total = doc.length;
					callback();
				});
			},
			function(callback) {
				// query for chart
				datasetSchema.aggregate().match(matchObj).group(groupObj4Chart).project(groupObj4ChartProject).sort(
						sortStr4Chart).limit(1000).exec(function(err, doc) {
					if (err)
						throw err;
					resultJSON.chart.result = doc;
					callback();
				});
			} ], function() {
		var end = new Date().getTime();
		var time = end - start;
		console.log('Query execution time: ' + time + ' ms');
		resultJSON.execute_time = time;
		res.send(resultJSON);
	});
};

function generateGroupSplitObj(queryParam) {
	var returnJSON = {};
	var dimensions = queryParam.dimensions;
	var measures = queryParam.measures;
	var primaryDimension = queryParam.primaryDimension;
	var split = queryParam.split;
	var breakException = {};
	var idStr = "_id:{";
	var projectStr = "{";
	var sortStr = "field " + primaryDimension;
	try {
		dimensions.forEach(function(item, index) {
			if (item.uniqueName == queryParam.primaryDimension) {
				projectStr += item.uniqueName;
				projectStr += ":\"$_id." + item.uniqueName + "\",";
				idStr += item.uniqueName;
				idStr += ":\"$";
				idStr += item.uniqueName;
				idStr += "\"";
				throw breakException;
			}
		});
	} catch (e) {
		if (e !== breakException)
			console.log(e);
	}
	idStr += "},"
	var indicatorStr = "";
	var splitValue = split.splitValue;
	// var sortStr = "";
	measures.forEach(function(item) {
		splitValue.forEach(function(value) {
			var isString = (typeof value === 'string');
			// convert split value string
			var cvtVal = value;
			if (isString)
				cvtVal = convertSplitValue(value);
			if (indicatorStr != '') {
				indicatorStr += ","
			}
			var splitIndicator = "";
			splitIndicator += item.uniqueName;
			splitIndicator += "_";
			splitIndicator += cvtVal;
			// if (index == 0 && sortStr == '') {
			// sortStr = "{" + splitIndicator + ": 1}";
			// }
			projectStr += splitIndicator
			projectStr += ":1,";
			indicatorStr += splitIndicator;
			indicatorStr += ":{";
			if (item.data_type == 'number') {
				indicatorStr += "$sum:{$cond:[{$eq:[";
			} else if (item.data_type == 'percentage') {
				indicatorStr += "$avg:{$cond:[{$eq:[";
			} else {
				return "";
			}
			indicatorStr += "\"$";
			indicatorStr += split.dimensions;
			indicatorStr += "\",";
			if (isString) {
				indicatorStr += "\"";
				indicatorStr += value;
				indicatorStr += "\"]},";
			} else {
				indicatorStr += value;
				indicatorStr += "]},";
			}
			indicatorStr += "\"$";
			indicatorStr += item.uniqueName;
			indicatorStr += "\",null]}}";
		});
	});
	var res = "{" + idStr + indicatorStr + "}";
	console.log('result string:' + res);
	var returnObj = eval("(" + res + ")");
	projectStr += "_id:0}";
	var projectObj = eval("(" + projectStr + ")");
	returnJSON = {
		"returnObj" : returnObj,
		"returnProject" : projectObj,
		"returnSort" : sortStr
	}
	return returnJSON;
}

exports.queryResult = function(req, res) {
	var start = new Date().getTime();
	var queryParam = req.body;
	var resultJSON = {
		"grid" : {
			"total" : 0,
			"result" : []
		},
		"chart" : {
			"result" : []
		}
	};
	var matchObj = generateMatchObj(queryParam);
	// for grid
	var group = generateGroupObj(queryParam, false);
	var groupObj = group.returnObj;
	var groupObjProject = group.returnProject;
	var sortStr = group.returnSort;
	// for chart
	var chartGroup = generateGroupObj(queryParam, true);
	var groupObj4Chart = chartGroup.returnObj;

	// to get all the query results and return
	async.parallel([
			function(callback) {
				// query for grid
				datasetSchema.aggregate().match(matchObj).group(groupObj).project(groupObjProject).sort(sortStr).limit(
						1000).exec(function(err, doc) {
					if (err)
						console.log('Exception: ' + err);
					resultJSON.grid.result = convertResult(doc, false);
					resultJSON.grid.total = doc.length;
					callback();
				});
			},
			function(callback) {
				// query for chart
				datasetSchema.aggregate().match(matchObj).group(groupObj4Chart).project(groupObjProject).sort(sortStr)
						.limit(1000).exec(function(err, doc) {
							if (err)
								console.log('Exception: ' + err);
							resultJSON.chart.result = convertResult(doc, true);
							callback();
						});
			} ], function() {
		var end = new Date().getTime();
		var time = end - start;
		console.log('Query execution time: ' + time + ' ms');
		resultJSON.execute_time = time;
		res.send(resultJSON);
	});
};

function generateGroupObj(queryParam, isChart) {
	var dimensions = queryParam.dimensions;
	var measures = queryParam.measures;
	var breakException = {};
	var idStr = "_id:{";
	var projectStr = "{";
	try {
		dimensions.forEach(function(item, index) {
			if (isChart) {
				if (item.uniqueName == queryParam.primaryDimension) {
					idStr += item.uniqueName;
					idStr += ":\"$";
					idStr += item.uniqueName;
					idStr += "\"";
					projectStr += item.uniqueName;
					projectStr += ":\"$_id." + item.uniqueName + "\",";
					throw breakException;
				}
			} else {
				idStr += item.uniqueName;
				idStr += ":\"$";
				idStr += item.uniqueName;
				idStr += "\"";
				if (index < dimensions.length - 1) {
					idStr += ","
				}
				projectStr += item.uniqueName;
				projectStr += ":\"$_id." + item.uniqueName + "\",";
			}
		});
	} catch (e) {
		if (e !== breakException)
			throw e;
	}
	idStr += "},"
	var indicatorStr = "";
	measures.forEach(function(item, index) {
		indicatorStr += item.uniqueName;
		indicatorStr += ":{";
		projectStr += item.uniqueName
		projectStr += ":1,";
		if (item.data_type == 'number') {
			indicatorStr += "$sum:";
		} else if (item.data_type == 'percentage') {
			indicatorStr += "$avg:";
		} else {
			return "";
		}
		indicatorStr += "\"$";
		indicatorStr += item.uniqueName;
		indicatorStr += "\"";
		indicatorStr += "}"
		if (index < measures.length - 1) {
			indicatorStr += ","
		}
	});
	var res = "{" + idStr + indicatorStr + "}";
	var returnObj = eval("(" + res + ")");
	projectStr += "_id:0}";
	// console.log(projectStr);
	var projectObj = eval("(" + projectStr + ")");
	var sortStr = generateSortStr(dimensions);
	returnJSON = {
		"returnObj" : returnObj,
		"returnProject" : projectObj,
		"returnSort" : sortStr
	}
	return returnJSON;
}

function generateMatchObj(queryParam) {
	var dimensions = queryParam.dimensions;
	var filters = queryParam.filters == null ? [] : queryParam.filters;
	var filterArray = [];
	dimensions.forEach(function(item, index) {
		if (item.uniqueName in filters) {
			if (item.uniqueName == 'year' || item.uniqueName == 'month') {
				var timeObj = eval('filters.' + item.uniqueName);
				var time_start = timeObj.time_start;
				var time_end = timeObj.time_end;
				time_start = time_start == '' ? null : time_start;
				time_end = time_end == '' ? null : time_end;
				if (time_start != null && time_end != null)
					filterArray.push(item.uniqueName + ': {$gte : ' + time_start + ', $lte : ' + time_end + '}');
				else if (time_start != null)
					filterArray.push(item.uniqueName + ': {$gte : ' + time_start + '}');
				else if (time_end != null)
					filterArray.push(item.uniqueName + ': {$lte : ' + time_end + '}');
			} else {
				var array = eval('filters.' + item.uniqueName);
				if (array != null && array.length > 0) {
					var str = '';
					if (item.uniqueName == 'year') {
						str = array.join(",");
					} else {
						str = "'" + array.join("','") + "'";
					}
					filterArray.push(item.uniqueName + ': {$in:[' + str + ']}');
				}
			}
		}
	});
	var matchStr = '{ ' + filterArray.join(",") + ' }';
	// console.log(matchStr);
	var returnObj = eval("(" + matchStr + ")");
	return returnObj;
}

function generateSortStr(dimensons) {
	var sortStr = 'field -';
	var timeFlag = false;
	if (dimensons != null && dimensons.length > 0) {
		dimensons.forEach(function(item, index) {
			if (item.uniqueName == 'year' || item.uniqueName == 'month') {
				sortStr += item.uniqueName;
				timeFlag = true;
				return;
			}
		});
		if (!timeFlag) {
			sortStr += dimensons[0].uniqueName;
		}
		return sortStr;
	} else {
		return null;
	}
}

function convertResult(doc, isChart) {
	var results = doc;
	// doc.forEach(function(item) {
	// var gstr = JSON.stringify(item._id);
	// gstr = gstr.substring(1, gstr.length - 1);
	// delete item._id;
	// var mstr = JSON.stringify(item);
	// mstr = mstr.substring(1, mstr.length - 1);
	// var recordStr = '{' + gstr + ',' + mstr + '}';
	// var recordObj = eval("(" + recordStr + ")");
	// results.push(recordObj);
	// });
	// sort result by year for charts
	if (isChart) {
		if (results.length > 0 && 'year' in results[0])
			bubbleSort(results, 'year');
		if (results.length > 0 && 'month' in results[0])
			bubbleSort(results, 'month');
	}
	return results;
}

function bubbleSort(a, par) {
	var swapped;
	do {
		swapped = false;
		for ( var i = 0; i < a.length - 1; i++) {
			if (a[i][par] > a[i + 1][par]) {
				var temp = a[i];
				a[i] = a[i + 1];
				a[i + 1] = temp;
				swapped = true;
			}
		}
	} while (swapped);
}

function convertSplitValue(str) {
	var returnStr = str.trim().replace(/ |-|&|\(|\)|\,|\.|\'|\uFF08|\uFF09/g, '');
	return returnStr;
}
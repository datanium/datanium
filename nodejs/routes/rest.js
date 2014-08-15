var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var analysis = require('../data/analysis');
var async = require('../lib/async');
var hashids = require('../lib/hashids');
var IndicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;
var analysisSchema = analysis.Analysis;

exports.topicSearch = function(req, res) {
	var resultJSON = [];
	var mainTopic = '';
	var indicatorText = [];
	/*
	 * IndicatorSchema.aggregate().group({ '_id' : '$topic' }).project({ 'topic' :
	 * '$_id'
	 */
	IndicatorSchema.find({}, {
		_id : 0,
		topic : 1,
		indicator_text : 1
	}).sort({
		'topic' : 1
	}).exec(function(err, doc) {
		// .match({'topic' : 'Education: Efficiency'})
		// IndicatorSchema.find().select({'topic' : 1, '_id' :
		// 0}).sort({'topic':1}).exec(function(err, doc) {
		// IndicatorSchema.distinct('topic').sort().exec(function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		doc.forEach(function(item, index) {
			if (item.topic == null)
				return;
			var topicArray = item.topic.split(':');
			var mainTopicStr = topicArray[0].trim();
			// var subTopicStr = topicArray[topicArray.length - 1].trim();
			var indicatorTextStr = item.indicator_text.trim();
			// console.log(mainTopicStr);
			// console.log(indicatorTextStr);
			if (index == 0) {
				mainTopic = mainTopicStr;
				indicatorText.push(indicatorTextStr);
			} else if (mainTopicStr == mainTopic) {
				indicatorText.push(indicatorTextStr);
			} else {
				var topic = {
					'topic' : mainTopic,
					'indicatorText' : indicatorText
				}
				resultJSON.push(topic);
				mainTopic = mainTopicStr;
				indicatorText = [];
				indicatorText.push(indicatorTextStr);
			}
			// resultJSON.push(item.topic);
		});
		// deal with the last topic
		var topic = {
			'topic' : mainTopic,
			'indicatorText' : indicatorText
		}
		resultJSON.push(topic);
		res.send(resultJSON);
	});

};

exports.querySplit = function(req, res) {
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
						500).exec(function(err, doc) {
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
						sortStr4Chart).limit(500).exec(function(err, doc) {
					if (err)
						throw err;
					// console.log(doc);
					resultJSON.chart.result = doc;
					callback();
				});
			} ], function() {
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
			indicatorStr += "\",0]}}";
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
						500).exec(function(err, doc) {
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
						.limit(500).exec(function(err, doc) {
							if (err)
								console.log('Exception: ' + err);
							resultJSON.chart.result = convertResult(doc, true);
							callback();
						});
			} ], function() {
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
	returnJSON = {
		"returnObj" : returnObj,
		"returnProject" : projectObj,
		"returnSort" : generateSortStr(measures)
	}
	return returnJSON;
}

function generateMatchObj(queryParam) {
	var dimensions = queryParam.dimensions;
	var filters = queryParam.filters == null ? [] : queryParam.filters;
	var filterArray = [];
	dimensions.forEach(function(item, index) {
		if (item.uniqueName in filters) {
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
	});
	var matchStr = '{ ' + filterArray.join(",") + ' }';
	// console.log(matchStr);
	var returnObj = eval("(" + matchStr + ")");
	return returnObj;
}

function generateSortStr(measures) {
	var sortStr = 'field -';
	if (measures != null && measures.length > 0) {
		sortStr += measures[0].uniqueName;
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
	var returnStr = str.trim().replace(/ |-|&|\(|\)|\,|\./g, '');
	return returnStr;
}

exports.indicatorMapping = function(req, res) {
	var indicatorMappingJSON = {};
	var query = require('url').parse(req.url, true).query;
	var idc = query.idc;
	var dimensions = [];
	var measures = [];
	IndicatorSchema.find({
		indicator_key : idc
	}, function(err, doc) {
		if (err)
			console.log('Exception: ' + err);
		doc.forEach(function(item, index) {
			var tempDimensions = item.dimension;
			tempDimensions.forEach(function(dimension, index) {
				var tempDimension = {
					"uniqueName" : dimension.dimension_key,
					"name" : dimension.dimension_key,
					"text" : dimension.dimension_text
				};
				dimensions.push(tempDimension);
			});
			var tempMesureJson = {
				"uniqueName" : item.indicator_key,
				"name" : item.indicator_key,
				"text" : item.indicator_text,
				"data_source" : item.data_source,
				"data_type" : item.data_type
			};
			measures.push(tempMesureJson);
		});
		indicatorMappingJSON = {
			"dimensions" : dimensions,
			"measures" : measures
		};
		res.send(indicatorMappingJSON);
	});
}

exports.indicatorSearch = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var indicatorResultJSON = {};
	if (query.query != null) {
		var key = query.query.toLowerCase();
		var results = [];
		IndicatorSchema.find({
			indicator_text : {
				$regex : key,
				$options : 'i'
			}
		}, function(err, doc) {
			if (err)
				console.log('Exception: ' + err);
			doc.forEach(function(item, index) {
				var tempJson = {
					"uniqueName" : item.indicator_key,
					"text" : item.indicator_text + ' - ' + item.data_source
				};
				results.push(tempJson);
			});
			indicatorResultJSON = {
				"indicators" : results
			};
			res.send(indicatorResultJSON);
		});
	} else {
		indicatorResultJSON = {
			"indicators" : []
		};
		res.send(indicatorResultJSON);
	}
};

exports.dimensionValueSearch = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var dimensionValueResultJSON = {};
	if (query.dim != null) {
		var key = query.dim.toLowerCase();
		var results = [];
		// exclude blank record
		var matchStr = '{ ' + key + ' : { $ne : \'\' } }';
		var matchObj = eval("(" + matchStr + ")");
		datasetSchema.aggregate().match(matchObj).group({
			'_id' : '$' + key
		}).sort('field _id').exec(function(err, doc) {
			if (err)
				console.log('Exception: ' + err);
			doc.forEach(function(item, index) {
				if (item._id != null) {
					var tempJson = {
						"name" : item._id
					};
					results.push(tempJson);
				}
			});
			dimensionValueResultJSON = {
				"dimensionValues" : results
			};
			// put send here cause callback func is async
			res.send(dimensionValueResultJSON);
		});
	} else {
		dimensionValueResultJSON = {
			"dimensionValues" : []
		};
		res.send(dimensionValueResultJSON);
	}
}

exports.save = function(req, res) {
	var analysisObj = req.body;
	var userip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var hashid = null;
	var date = new Date();
	async.parallel([ function(callback) {
		if (analysisObj.hashid !== null && analysisObj.hashid !== '') {
			console.log('Update Analysis ' + analysisObj.hashid);
			// update analysis
			analysisSchema.findOneAndUpdate({
				hashid : analysisObj.hashid
			}, {
				qubeInfo : analysisObj.qubeInfo,
				queryParam : analysisObj.queryParam,
				rptMode : analysisObj.rptMode,
				chartMode : analysisObj.chartMode,
				user_ip : userip,
				modification_date : date
			}, function(err, doc) {
				if (err)
					throw err;
				hashid = doc.hashid;
				callback();
			})
		} else {
			console.log('Save New Analysis');
			// encrypt hashid
			var key = date.getTime() * 10 + Math.round(Math.random() * 10);
			var hashs = new hashids("datanium salt", 4);
			hashid = hashs.encrypt(key);
			// save analysis
			var newAnalysis = new analysisSchema({
				hashid : hashid,
				qubeInfo : analysisObj.qubeInfo,
				queryParam : analysisObj.queryParam,
				rptMode : analysisObj.rptMode,
				chartMode : analysisObj.chartMode,
				user_id : 'anonymous user',
				user_ip : userip,
				creation_date : date,
				modification_date : date
			});
			newAnalysis.save();
			callback();
		}
	} ], function() {
		res.send({
			hashid : hashid
		});
	});
}

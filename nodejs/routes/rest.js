var data = require('../data/sampleData');
var mongodb = require('../data/mongodb');
var indicator = require('../data/indicator');
var dataset = require('../data/dataset');
var async = require('../lib/async');
var IndicatorSchema = indicator.Indicator;
var datasetSchema = dataset.Dataset;

exports.cubeList = function(req, res) {
	res.send(data.cubeListJSON);
};

exports.cubeInfo = function(req, res) {
	res.send(data.cubeInfoJSON);
};

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
	var groupObj = generateGroupObj(queryParam, false);
	var groupObj4Chart = generateGroupObj(queryParam, true);
	var matchObj = generateMatchObj(queryParam);
	var sortStr = generateSortStr(queryParam);
	// to get all the query results and return
	async.parallel([
			function(callback) {
				// query for grid
				datasetSchema.aggregate().match(matchObj).group(groupObj).sort(sortStr).limit(500).exec(
						function(err, doc) {
							if (err)
								throw err;
							resultJSON.grid.result = convertResult(doc, false);
							resultJSON.grid.total = doc.length;
							callback();
						});
			},
			function(callback) {
				// query for chart
				datasetSchema.aggregate().match(matchObj).group(groupObj4Chart).sort(sortStr).limit(500).exec(
						function(err, doc) {
							if (err)
								throw err;
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
	try {
		dimensions.forEach(function(item, index) {
			if (isChart) {
				if (item.uniqueName == queryParam.primaryDimension) {
					idStr += item.uniqueName;
					idStr += ":\"$";
					idStr += item.uniqueName;
					idStr += "\"";
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
	return returnObj;
}

function generateMatchObj(queryParam) {
	var dimensions = queryParam.dimensions;
	var filters = queryParam.filters;
	var filterArray = [];
	dimensions.forEach(function(item, index) {
		if (item.uniqueName in filters) {
			var array = eval('filters.' + item.uniqueName);
			var str = '';
			if (item.uniqueName == 'year') {
				str = array.join(",");
			} else {
				str = "'" + array.join("','") + "'";
			}
			filterArray.push(item.uniqueName + ': {$in:[' + str + ']}');
		}
	});
	var matchStr = '{ ' + filterArray.join(",") + ' }';
	console.log(matchStr);
	var returnObj = eval("(" + matchStr + ")");
	return returnObj;
}

function generateSortStr(queryParam) {
	var measures = queryParam.measures;
	var sortStr = 'field -';
	if (measures != null && measures.length > 0) {
		sortStr += measures[0].uniqueName;
		return sortStr;
	} else {
		return null;
	}
}

function convertResult(doc, isChart) {
	var results = [];
	doc.forEach(function(item) {
		var gstr = JSON.stringify(item._id);
		gstr = gstr.substring(1, gstr.length - 1);
		delete item._id;
		var mstr = JSON.stringify(item);
		mstr = mstr.substring(1, mstr.length - 1);
		var recordStr = '{' + gstr + ',' + mstr + '}';
		var recordObj = eval("(" + recordStr + ")");
		results.push(recordObj);
	});
	// sort result by year for charts
	if (isChart) {
		if (results.length > 0 && 'year' in results[0])
			bubbleSort(results, 'year');
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
			throw err;
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
				throw err;
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
		datasetSchema.distinct(key, function(err, doc) {
			if (err)
				throw err;
			doc.forEach(function(item, index) {
				var tempJson = {
					"name" : item
				};
				results.push(tempJson);
			});
			dimensionValueResultJSON = {
				"dimensionValues" : results
			};
			res.send(dimensionValueResultJSON);
		});
	} else {
		dimensionValueResultJSON = {
			"dimensionValues" : []
		};
		res.send(dimensionValueResultJSON);
	}
}
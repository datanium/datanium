var data = require('../data/sampleData');

exports.cubeList = function(req, res) {
	res.send(data.cubeListJSON);
};

exports.cubeInfo = function(req, res) {
	res.send(data.cubeInfoJSON);
};

exports.queryResult = function(req, res) {
	res.send(data.queryResultJSON);
};

exports.indicatorMapping = function(req, res) {
	var indicatorMappingJSON = {};
	var query = require('url').parse(req.url, true).query;
	var idc = query.idc;
	console.log(idc);
	if (idc == '[Measures].[CPI]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			}, {
				"uniqueName" : "[TIME].[YEAR]",
				"name" : "YEAR",
				"text" : "Year"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[CPI]",
				"name" : "CPI",
				"text" : "CPI"
			} ]
		};
	} else if (idc == '[Measures].[GDP]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[REGION]",
				"name" : "REGION",
				"text" : "Region"
			}, {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[GDP]",
				"name" : "GDP",
				"text" : "GDP"
			} ]
		};
	} else if (idc == '[Measures].[Interest Rate]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[Interest Rate]",
				"name" : "Interest Rate",
				"text" : "Interest Rate"
			} ]
		};
	}
	res.send(indicatorMappingJSON);
}

exports.indicatorSearch = function(req, res) {
	var indicatorResultJSON = {
		"indicators" : [ {
			"uniqueName" : "[Measures].[CPI]",
			"text" : "CPI"
		}, {
			"uniqueName" : "[Measures].[GDP]",
			"text" : "GDP"
		}, {
			"uniqueName" : "[Measures].[Interest Rate]",
			"text" : "Interest Rate"
		} ]
	};
	res.send(indicatorResultJSON);
};
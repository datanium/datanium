Ext.define('Datanium.store.DemoAnalysisStats', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.DemoAnalysisStat',
	data : [ {
		"indicator" : "Sample Indicator A",
		"year" : "2005-2013",
		"min" : 2,
		"max" : 14,
		"mean" : 5.6,
		"median" : 5,
		"std" : 2.5
	}, {
		"indicator" : "Sample Indicator B",
		"year" : "2005-2013",
		"min" : 3,
		"max" : 16,
		"mean" : 6.6,
		"median" : 7,
		"std" : 4.2
	}, {
		"indicator" : "Sample Indicator C",
		"year" : "2005-2013",
		"min" : 1,
		"max" : 7,
		"mean" : 2,
		"median" : 3,
		"std" : 1.2
	} ]
});
Ext.define('Datanium.GlobalData', {
	singleton : true,
	tabindex : 0,
	queryParam : {
		dimensions : [],
		measures : [],
		groups : []
	},
	queryResult : {},
	enableQuery : false,
	groups : []
});
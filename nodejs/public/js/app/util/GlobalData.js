Ext.define('Datanium.GlobalData', {
	singleton : true,
	tabindex : 0,
	queryParam : {
		dimensions : [],
		measures : [],
		groups : [],
		primaryDimension : null
	},
	qubeInfo : {
		dimensions : [],
		measures : []
	},
	queryResult : null,
	queryResult4Chart : null,
	enableQuery : false,
	groups : [],
	rptMode : 'grid',
	chartMode : 'columnchart',
	autoRun : true
});
Ext.define('Datanium.GlobalData', {
	singleton : true,
	tabindex : 0,
	hashid : null,
	queryParam : {
		dimensions : [],
		measures : [],
		filters : {},
		primaryDimension : null,
		primaryFilter : null,
		split : {
			dimensions : null,
			splitValue : []
		},
		isSplit : false,
		groups : [],
		columns : []
	},
	qubeInfo : {
		dimensions : [],
		measures : []
	},
	queryResult : null,
	queryResult4Chart : null,
	enableQuery : false,
	rptMode : 'grid',
	chartMode : 'columnchart',
	autoScale : false,
	showLegend : true,
	autoRun : true,
	dimensionValues : [],
	popDimensionKey : null,
	popDimension : null
});
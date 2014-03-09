Ext.define('Datanium.controller.ChartController', {
	extend : 'Ext.app.Controller',
	views : [ 'ChartView', 'charts.ColumnChart' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'datachartview' : {
				afterrender : this.onChartPanelReady,
				beforeshow : this.onChartPanelShow
			}
		});
	},
	onChartPanelReady : function(me) {
		console.log('onChartPanelReady');
		var chart = Ext.create('widget.columnchart', {
			itemId : Datanium.util.CommonUtils.genItemId('columnchart'),
			region : 'center',
			floatable : false,
			collapsible : false,
			header : false
		});
		Datanium.util.CommonUtils.getCmpInActiveTab('datachartview').insert(chart);
	},
	onChartPanelShow : function(me) {
		console.log('onChartPanelShow');
	}
});
Ext.define('Datanium.controller.ChartController', {
	extend : 'Ext.app.Controller',
	views : [ 'ChartView', 'charts.ColumnChart', 'charts.LineChart', 'charts.StackChart', 'charts.ChartToolbar' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'datachartview' : {
				afterrender : this.onChartPanelReady,
				beforeshow : this.onChartPanelShow
			},
			'chart-toolbar > button[action=auto-scale]' : {
				click : function(btn) {
					if (btn.pressed) {
						Datanium.GlobalData.autoScale = true;
					} else {
						Datanium.GlobalData.autoScale = false;
					}
					Datanium.util.CommonUtils.generateChart();
				}
			}
		});
	},
	onChartPanelReady : function(me) {
		console.log('onChartPanelReady');
		Datanium.util.CommonUtils.generateChart();

	},
	onChartPanelShow : function(me) {
		console.log('onChartPanelShow');
	}
});
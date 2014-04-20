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
			'chart-toolbar > button[action=column-chart]' : {
				click : function(btn) {
					if (Datanium.GlobalData.chartMode != 'columnchart') {
						Datanium.GlobalData.chartMode = 'columnchart';
						Datanium.util.CommonUtils.generateChart();
					}
				}
			},
			'chart-toolbar > button[action=line-chart]' : {
				click : function(btn) {
					if (Datanium.GlobalData.chartMode != 'linechart') {
						Datanium.GlobalData.chartMode = 'linechart';
						Datanium.util.CommonUtils.generateChart();
					}
				}
			},
			'chart-toolbar > button[action=stack-chart]' : {
				click : function(btn) {
					if (Datanium.GlobalData.chartMode != 'stackchart') {
						Datanium.GlobalData.chartMode = 'stackchart';
						Datanium.util.CommonUtils.generateChart();
					}
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
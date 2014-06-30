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
			},
			'chart-toolbar > button[action=hide-legend]' : {
				click : function(btn) {
					if (btn.pressed) {
						Datanium.GlobalData.showLegend = false;
					} else {
						Datanium.GlobalData.showLegend = true;
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
	},
	reloadDimSwitchMenu : function() {
		var dimensions = Datanium.GlobalData.queryParam.dimensions;
		var primaryDim = Datanium.GlobalData.queryParam.primaryDimension;
		if (dimensions != null && dimensions.length > 0 && primaryDim != null) {
			var dimSwitch = Ext.getCmp('dimSwitch');
			dimSwitch.menu.removeAll();
			Ext.Array.each(dimensions, function(dim) {
				var iconClsTxt = '';
				if (primaryDim == dim.uniqueName) {
					dimSwitch.setText(dim.text);
					iconClsTxt = 'fa fa-star-o';
				}
				var item = new Ext.menu.Item({
					iconCls : iconClsTxt,
					text : dim.text,
					handler : function() {
						this.parentMenu.ownerButton.setText(dim.text);
						Datanium.util.CommonUtils.markSelection(this);

						Datanium.GlobalData.queryParam.primaryDimension = dim.uniqueName;
						Datanium.util.CommonUtils.updateFields();
						Datanium.util.CommonUtils.markPrimary();
						Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('selectionChange');
					}
				});
				dimSwitch.menu.add(item);
			});
		}
	}
});
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
		var dimSwitch = Ext.getCmp('dimSwitch');
		if (dimensions != null && dimensions.length > 0 && primaryDim != null) {
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
			// enable dimSwitch
			dimSwitch.enable();
		} else {
			dimSwitch.setText('Primary Dimension');
			dimSwitch.disable();
		}
	},
	reloadFilterSwitchMenu : function() {
		console.log('reloadFilterSwitchMenu');
		var filters = Datanium.GlobalData.queryParam.filters;
		var filterKeys = Object.keys(Datanium.GlobalData.queryParam.filters);
		var primaryFilter = Datanium.GlobalData.queryParam.split.dimensions;
		var dimensions = Datanium.GlobalData.queryParam.dimensions;
		var filterSwitch = Ext.getCmp('filterSwitch');
		if (filters != null && filterKeys.length > 0 && primaryFilter != null) {
			filterSwitch.menu.removeAll();
			for (f in filters) {
				Ext.Array.each(dimensions, function(dim) {
					if (f == dim.uniqueName) {
						var iconClsTxt = '';
						if (primaryFilter == dim.uniqueName) {
							filterSwitch.setText(dim.text);
							iconClsTxt = 'fa fa-star-o';
						}
						var item = new Ext.menu.Item({
							iconCls : iconClsTxt,
							text : dim.text,
							itemId : f,
							handler : function() {
								this.parentMenu.ownerButton.setText(dim.text);
								Datanium.util.CommonUtils.markSelection(this);

								var popSelection = [];
								Datanium.GlobalData.queryParam.primaryFilter = this.itemId;
								if (this.itemId in Datanium.GlobalData.queryParam.filters)
									popSelection = eval('Datanium.GlobalData.queryParam.filters.' + this.itemId);
								Datanium.util.CommonUtils.splitFilter(popSelection);
								Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('submitFilter');
							}
						});
						filterSwitch.menu.add(item);
					}
				});
			}
			// enable filterSwitch
			filterSwitch.enable();
		} else {
			filterSwitch.setText('Primary Filter');
			filterSwitch.disable();
		}
	}
});
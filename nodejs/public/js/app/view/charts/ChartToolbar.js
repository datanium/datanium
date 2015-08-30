Ext.define('Datanium.view.charts.ChartToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	alias : 'widget.chart-toolbar',
	shadowOffset : 10,
	minHeight : 38,
	padding : '0 5',
	initComponent : function() {
		this.callParent();
	},
	items : [ {
		id : 'chartTypeBtn',
		xtype : 'splitbutton',
		iconCls : 'fa fa-bar-chart-o',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.util.CommonUtils.getChartModeStr(),
		tooltipType : 'title',
		text : Datanium.util.CommonUtils.getChartModeStr(),
		handler : function() {
			this.showMenu();
		},
		menu : [ {
			iconCls : Datanium.util.CommonUtils.getChartModeStar('columnchart'),
			text : Datanium.GlobalStatic.label_column_chart,
			handler : function() {
				this.parentMenu.ownerCmp.setText(Datanium.GlobalStatic.label_column_chart);
				this.parentMenu.ownerCmp.setTooltip(Datanium.GlobalStatic.label_column_chart);
				Datanium.util.CommonUtils.markSelection(this);
				if (Datanium.GlobalData.chartMode != 'columnchart') {
					Datanium.GlobalData.chartMode = 'columnchart';
					Datanium.util.CommonUtils.generateChart();
				}
			}
		}, {
			iconCls : Datanium.util.CommonUtils.getChartModeStar('stackchart'),
			text : Datanium.GlobalStatic.label_stack_chart,
			handler : function() {
				this.parentMenu.ownerCmp.setText(Datanium.GlobalStatic.label_stack_chart);
				this.parentMenu.ownerCmp.setTooltip(Datanium.GlobalStatic.label_stack_chart);
				Datanium.util.CommonUtils.markSelection(this);
				if (Datanium.GlobalData.chartMode != 'stackchart') {
					Datanium.GlobalData.chartMode = 'stackchart';
					Datanium.util.CommonUtils.generateChart();
				}
			}
		}, {
			iconCls : Datanium.util.CommonUtils.getChartModeStar('linechart'),
			text : Datanium.GlobalStatic.label_line_chart,
			handler : function() {
				this.parentMenu.ownerCmp.setText(Datanium.GlobalStatic.label_line_chart);
				this.parentMenu.ownerCmp.setTooltip(Datanium.GlobalStatic.label_line_chart);
				Datanium.util.CommonUtils.markSelection(this);
				if (Datanium.GlobalData.chartMode != 'linechart') {
					Datanium.GlobalData.chartMode = 'linechart';
					Datanium.util.CommonUtils.generateChart();
				}
			}
		} ]
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		id : 'dimSwitch',
		xtype : 'splitbutton',
		iconCls : 'fa fa-cube',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_switch_dim,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_primary_dim,
		disabled : true,
		handler : function() {
			this.showMenu();
		},
		menu : []
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		id : 'filterSwitch',
		xtype : 'splitbutton',
		iconCls : 'fa fa-filter',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_switch_filter,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_primary_filter,
		disabled : true,
		handler : function() {
			this.showMenu();
		},
		menu : []
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		id : 'auto_scale_btn',
		iconCls : 'fa fa-arrows fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_auto_scale,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_auto_scale,
		action : 'auto-scale',
		enableToggle : true,
		pressed : Datanium.GlobalData.autoScale,
		disabled : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-eye-slash fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_hide_legend,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_hide_legend,
		action : 'hide-legend',
		enableToggle : true,
		pressed : !Datanium.GlobalData.showLegend
	} ]
});
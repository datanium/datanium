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
		xtype : 'splitbutton',
		iconCls : 'fa fa-bar-chart-o',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Column Chart',
		tooltipType : 'title',
		text : 'Column Chart',
		handler : function() {
			this.showMenu();
		},
		menu : [ {
			iconCls : 'fa fa-star-o',
			text : 'Column Chart',
			handler : function() {
				this.parentMenu.ownerButton.setText('Column Chart');
				this.parentMenu.ownerButton.setTooltip('Column Chart');
				Datanium.util.CommonUtils.markSelection(this);
				if (Datanium.GlobalData.chartMode != 'columnchart') {
					Datanium.GlobalData.chartMode = 'columnchart';
					Datanium.util.CommonUtils.generateChart();
				}
			}
		}, {
			text : 'Stack Chart',
			handler : function() {
				this.parentMenu.ownerButton.setText('Stack Chart');
				this.parentMenu.ownerButton.setTooltip('Stack Chart');
				Datanium.util.CommonUtils.markSelection(this);
				if (Datanium.GlobalData.chartMode != 'stackchart') {
					Datanium.GlobalData.chartMode = 'stackchart';
					Datanium.util.CommonUtils.generateChart();
				}
			}
		}, {
			text : 'Line Chart',
			handler : function() {
				this.parentMenu.ownerButton.setText('Line Chart');
				this.parentMenu.ownerButton.setTooltip('Line Chart');
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
		tooltip : 'Switch Dimension',
		tooltipType : 'title',
		text : 'Primary Dimension',
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
		tooltip : 'Switch Filter',
		tooltipType : 'title',
		text : 'Primary Filter',
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
		iconCls : 'fa fa-arrows fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Auto Scale',
		tooltipType : 'title',
		text : 'Auto Scale',
		action : 'auto-scale',
		enableToggle : true,
		pressed : false
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-eye-slash fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Hide Legend Box',
		tooltipType : 'title',
		text : 'Hide Legend',
		action : 'hide-legend',
		enableToggle : true,
		pressed : false
	} ]
});
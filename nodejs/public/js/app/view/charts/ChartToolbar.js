Ext.define('Datanium.view.charts.ChartToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	alias : 'widget.chart-toolbar',
	shadowOffset : 10,
	minHeight : 38,
	padding : '0 5',
	items : [ {
		iconCls : 'fa fa-bar-chart-o',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Column Chart',
		tooltipType : 'title',
		text : 'Column Chart',
		action : 'column-chart',
		enableToggle : true,
		pressed : true,
		toggleGroup : 'chartMode'
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-bar-chart-o',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Line Chart',
		tooltipType : 'title',
		text : 'Line Chart',
		action : 'line-chart',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'chartMode'
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-bar-chart-o',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : 'Stack Chart',
		tooltipType : 'title',
		text : 'Stack Chart',
		action : 'stack-chart',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'chartMode'
	} ]
});
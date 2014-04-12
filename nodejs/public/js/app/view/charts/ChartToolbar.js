Ext.define('Datanium.view.charts.ChartToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	alias : 'widget.chart-toolbar',
	shadow : 'drop',
	shadowOffset : 10,
	minHeight : 38,
	padding : '0 5',
	items : [ {
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
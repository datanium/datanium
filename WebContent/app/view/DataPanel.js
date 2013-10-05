Ext.define('Datanium.view.DataPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.datapanel',
	defaults : {
		border : false,
		floatable : false,
		collapsible : false,
		header : false
	},
	rbar : [ {
		xtype : 'buttongroup',
		columns : 1,
		activeItem : 0,
		cls : 'view-switch',
		style : {
			'border-width' : 1
		},
		items : [ {
			icon : 'img/icons/table.png',
			tooltip : 'Grid View',
			tooltipType : 'title',
			name : 'gridView',
			margin : '2',
			height : 24,
			width : 24,
			toggleGroup : 'viewSwitch',
			pressed : true
		}, {
			icon : 'img/icons/chart_bar.png',
			tooltip : 'Chart View',
			tooltipType : 'title',
			name : 'chartView',
			margin : '2',
			height : 24,
			width : 24,
			toggleGroup : 'viewSwitch'
		} ]

	} ],
	itemId : Datanium.util.CommonUtils.genItemId('dataViewBox'),
	layout : 'card',
	items : [ {
		// xtype : 'gridview',
		itemId : Datanium.util.CommonUtils.genItemId('gridview')
	}, {
		// xtype : 'chartview',
		itemId : Datanium.util.CommonUtils.genItemId('chartview')
	} ]
});

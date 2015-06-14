Ext.define('Stockholm.view.TrendChart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.trendchart',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'fit',
			region : 'center',
			style : 'background:#fff',
			animate : true,
			insetPadding : 50,
			shadow : true,
			hidden : true,
			legend : {
				position : 'right'
			}
		});

		this.axes = [ {
			type : 'Numeric',
			minimum : 0,
			position : 'left',
			fields : [ 'Change' ]
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'Day' ]
		} ];

		this.series = [ {
			type : 'line',
			highlight : {
				size : 7,
				radius : 7
			},
			axis : 'left',
			xField : 'Day',
			yField : 'Change'
		} ];

		this.store = 'Trends';
		this.callParent();
	}
});
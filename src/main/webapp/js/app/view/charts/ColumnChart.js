var store_template = {
	extend : 'Ext.data.Store',
	autoLoad : true,
	proxy : {
		type : 'memory',
		reader : {
			type : 'json',
			root : 'result'
		}
	}
};

var store1 = Ext.create('Ext.data.JsonStore', {
	fields : [ 'year', 'China', 'US' ],
	data : [ {
		'year' : 2005,
		'China' : 15,
		'US' : 10
	}, {
		'year' : 2006,
		'China' : 4,
		'US' : 7
	}, {
		'year' : 2007,
		'China' : 2,
		'US' : 5
	}, {
		'year' : 2008,
		'China' : 3,
		'US' : 2
	}, {
		'year' : 2009,
		'China' : 20,
		'US' : 27
	} ]
});

Ext.define('Datanium.view.charts.ColumnChart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.columnchart',
	initComponent : function() {
		Ext.apply(this, {
			style : 'background:#fff',
			animate : true,
			insetPadding : 50,
			shadow : true
		});
		this.store = store1;
		this.axes = [ {
			type : 'Numeric',
			position : 'left',
			fields : [ 'China', 'US' ],
			label : {
				renderer : Ext.util.Format.numberRenderer('0,0')
			},
			title : 'Sample Values',
			grid : true,
			minimum : 0
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'year' ],
			title : 'Year'
		} ],
				this.series = [ {
					type : 'column',
					axis : 'left',
					highlight : true,
					tips : {
						style : 'background:#fff; text-align: center;',
						trackMouse : true,
						width : 140,
						height : 28,
						renderer : function(storeItem, item) {
							this.setTitle(item.yField + ' ' + storeItem.get('year') + ': ' + storeItem.get(item.yField)
									+ ' $');
						}
					},
					/*
					 * label : { display : 'insideEnd', 'text-anchor' :
					 * 'middle', field : [ 'China', 'US' ], renderer :
					 * Ext.util.Format.numberRenderer('0'), orientation :
					 * 'horizontal', color : '#fff' },
					 */
					xField : 'year',
					yField : [ 'China', 'US' ]
				} ]
		this.callParent();
		this.addEvents('refreshColumnChart');
		this.on('refreshColumnChart',
				function() {
					if (Datanium.util.CommonUtils.getCmpInActiveTab('columnchart') != null) {
						var activeItemId = Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout()
								.getActiveItem().id;
						destoryGrid('columnchart');
						Datanium.util.CommonUtils.getCmpInActiveTab('chartgridview').insert(0,
								Ext.create('Datanium.view.charts.ColumnChart', {
									xtype : 'columnchart',
									itemId : Datanium.util.CommonUtils.genItemId('columnchart'),
									region : 'center',
									floatable : false,
									collapsible : false,
									header : false
								}).show());
					}
				});
	}
});

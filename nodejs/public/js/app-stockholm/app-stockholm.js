Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Stockholm',
	appFolder : '../js/app-stockholm',
	controllers : [ 'StockController' ],
	launch : function() {
		Ext.create('Ext.container.Viewport', {
			layout : 'fit',
			renderTo : Ext.getBody(),
			items : [ {
				region : 'center',
				xtype : 'panel',
				bodyPadding : 10,
				frame : true,
				layout : 'fit',
				items : [ {
					region : 'center',
					id : 'stockGrid',
					header : false,
					title : 'Home',
					xtype : 'stockgrid',
					dockedItems : [ {
						dock : 'top',
						xtype : 'toolbar',
						items : [ {
							xtype : 'label',
							text : '当日推荐',
							margin : '5 12 0 12'
						}, {
							id : 'dateSelect',
							xtype : 'combobox',
							store : 'JobDates',
							queryMode : 'remote',
							displayField : 'Date',
							valueField : 'Date',
							listeners : {
								'select' : function(me) {
									var key = me.getValue();
									var grid = Ext.getCmp('stockGrid');
									grid.store.load({
										params : {
											targetDate : key
										},
										callback : function(records, operation, success) {
											// do something after the load
											// finishes
										},
										scope : this
									});
								}
							}
						} ]
					} ],
				} ]
			} ]
		});
	}
});
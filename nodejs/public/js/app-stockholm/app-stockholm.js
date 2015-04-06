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
				bodyPadding : 5,
				frame : true,
				layout : 'fit',
				items : [ {
					region : 'center',
					id : 'stockGrid',
					header : false,
					title : 'Home',
					xtype : 'stockgrid',
					store : 'Quotes',
					dockedItems : [ {
						id : 'grid-dock-toolbar',
						dock : 'top',
						xtype : 'dock-toolbar',
						height : 40
					} ],
				} ]
			} ]
		});
	}
});
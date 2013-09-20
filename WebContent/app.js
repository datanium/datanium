Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Datanium',
	appFolder : 'app',
	controllers : [],

	init : function() {
		Ext.enableFx = true;
		// Ext.setGlyphFontFamily("Pictos");
	},

	launch : function() {
		Ext.create('Ext.container.Viewport', {
			layout : 'border',
			bodyBorder : false,
			defaults : {
				collapsible : true,
				border : false,
				split : true
			},
			items : [ {
				title : 'Toolbar',
				region : 'north',
				height : 45,
				header : false,
				items : []
			}, {
				title : 'Main Box',
				region : 'center',
				xtype : 'panel',
				id : 'mainBox',
				activeTab : 0,
				collapsible : false,
				margins : 5,
				header : false,
				items : []
			} ]
		});
	}
});
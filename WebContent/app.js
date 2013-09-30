Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Datanium',
	appFolder : 'app',
	controllers : [ 'Homepage' ],

	init : function() {
		Ext.enableFx = true;
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
				items : [ {
					xtype : 'top-toolbar'
				} ]
			}, {
				title : 'Main Box',
				region : 'center',
				xtype : 'tabpanel',
				id : 'mainBox',
				activeTab : 0,
				collapsible : false,
				margins : 5,
				header : false,
				tabBar : {
					height : 30,
					defaults : {
						height : 30
					}
				},
				items : [ {
					itemId : 'report-tab' + Datanium.GlobalData.tabindex,
					closable : true,
					// icon : 'img/icons/report.png',
					title : 'New Report'
				// , xtype : 'reportmockup1'
				} ]
			} ]
		});
	}
});
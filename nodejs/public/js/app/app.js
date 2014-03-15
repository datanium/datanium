Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Datanium',
	appFolder : '../js/app',
	controllers : [ 'Homepage', 'FieldController', 'GridController', 'ChartController' ],

	init : function() {
		Ext.enableFx = true;
	},

	launch : function() {
		Ext.create('Ext.panel.Panel', {
			layout : 'border',
			// renderTo : Ext.getBody(),
			renderTo : Ext.get('appContainer'),
			bodyBorder : false,
			bodyStyle : {
				'position' : 'relative',
				'z-index' : 1
			},
			defaults : {
				collapsible : true,
				border : false,
				split : true
			},
			id : "appPanel",
			listeners : {
				beforerender : function() {
					Ext.getCmp("appPanel").setHeight(Ext.get("appContainer").getHeight());
					Ext.getCmp("appPanel").doLayout();
					Ext.EventManager.onWindowResize(function() {
						Ext.getCmp("appPanel").setHeight(Ext.get("appContainer").getHeight());
						Ext.getCmp("appPanel").doLayout();
					});
				}
			},
			items : [ {
				title : 'Main Box',
				region : 'center',
				xtype : 'tabpanel',
				id : 'mainBox',
				activeTab : 0,
				collapsible : false,
				header : false,
				tabBar : {
					display : false,
					height : 25,
					defaults : {
						height : 25
					}
				},
				items : [ {
					itemId : 'report-tab' + Datanium.GlobalData.tabindex,
					closable : true,
					// icon : 'img/icons/report.png',
					title : 'New Analysis',
					xtype : 'reporttemplate'
				} ]
			} ]
		});
	}
});
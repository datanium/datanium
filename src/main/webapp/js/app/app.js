Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Datanium',
	appFolder : '../js/app',
	controllers : [ 'Homepage', 'FieldController', 'GridController' ],

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
				title : 'Datanium Analysis',
				region : 'north',
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
				header : false,
				tabBar : {
					height : 25,
					defaults : {
						height : 25
					}
				},
				items : [ {
					itemId : 'report-tab' + Datanium.GlobalData.tabindex,
					closable : true,
					// icon : 'img/icons/report.png',
					title : 'New Report',
					xtype : 'reporttemplate'
				} ]
			} ]
		});
	}
});
Ext.application({
	requires : [ 'Ext.container.Viewport' ],
	name : 'Datanium',
	appFolder : '../js/app',
	controllers : [ 'Homepage', 'FieldController', 'GridController', 'ChartController', 'AnalysisController' ],

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
					this.setHeight(Ext.get("appContainer").getHeight());
					this.doLayout();
				}
			},
			/*
			 * items : [ { region : 'center', xtype : 'tabpanel', id :
			 * 'mainBox', activeTab : 0, collapsible : false, header : false,
			 * tabBar : { display : false, height : 25, defaults : { height : 25 } },
			 * items : [ { itemId : 'report-tab' + Datanium.GlobalData.tabindex,
			 * closable : true, // icon : 'img/icons/report.png', title : 'My
			 * Analysis', xtype : 'reporttemplate' } ] } ],
			 */
			items : [ {
				region : 'center',
				id : 'mainBox',
				header : false,
				title : 'My Analysis',
				xtype : 'reporttemplate'
			} ]
		});
		Ext.EventManager.onWindowResize(function() {
			Ext.getCmp("appPanel").setHeight(Ext.get("appContainer").getHeight());
			Ext.getCmp("appPanel").doLayout();
		});

		// call report generate when existed report is loaded
		if (Datanium.GlobalData.hashid != null && Datanium.GlobalData.hashid !== '') {
			Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel');
			Datanium.util.CommonUtils.updateFilterFields();
			Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('selectionChange');
			this.getController('ChartController').reloadFilterSwitchMenu();
			if (Datanium.GlobalData.rptMode === 'grid') {
				Ext.getCmp('gridViewBtn').toggle();
				Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(0);
			}
			if (Datanium.GlobalData.rptMode === 'chart') {
				Ext.getCmp('chartViewBtn').toggle();
				Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(1);
			}
			if (Datanium.GlobalData.rptMode === 'analysis') {
				Ext.getCmp('analysisViewBtn').toggle();
				Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(2);
			}
		}
	}
});
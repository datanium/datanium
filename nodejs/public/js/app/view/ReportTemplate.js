Ext.define('Datanium.view.ReportTemplate', {
	extend : 'Ext.container.Container',
	alias : 'widget.reporttemplate',
	layout : 'border',
	bodyBorder : false,
	border : false,
	padding : 5,
	defaults : {
		collapsible : true,
		split : true
	},
	items : [ {
		region : 'north',
		header : false,
		border : false,
		collapsible : false,
		split : false,
		xtype : 'searchbox',
		width : '100%',
		cls : 'searchbox'
	}, {
		region : 'west',
		floatable : false,
		header : false,
		width : 280,
		minWidth : 150,
		maxWidth : 400,
		bodyPadding : 0,
		layout : 'fit',
		items : [ {
			itemId : Datanium.util.CommonUtils.genItemId('leftpanel'),
			xtype : 'leftpanel'
		} ],
		listeners : {
			afterrender : function() {
				if (Datanium.GlobalData.hashid != null && Datanium.GlobalData.hashid.length > 0) {
					var appWidth = Ext.get("appContainer").getWidth();
					// var appHeight = Ext.get("appContainer").getHeight();
					if (appWidth < 1024) {
						this.collapsed = true;
					}
				}
			}
		}
	}, {
		collapsible : false,
		region : 'center',
		header : false,
		border : false,
		layout : 'fit',
		flex : 1,
		items : [ {
			layout : 'border',
			bodyBorder : false,
			border : false,
			defaults : {
				collapsible : false,
				split : false
			},
			items : [ {
				title : 'My Analysis',
				layout : 'vbox',
				header : false,
				region : 'north',
				height : 'auto',
				width : '100%',
				items : [ {
					xtype : 'inner-toolbar',
					itemId : Datanium.util.CommonUtils.genItemId('inner-toolbar'),
					width : '100%',
					border : false
				}, {
					xtype : 'fieldpanel',
					cls : 'fieldpanel',
					itemId : Datanium.util.CommonUtils.genItemId('fieldpanel'),
					bodyPadding : 0,
					header : false,
					width : '100%',
					hidden : true
				} ]
			}, {
				itemId : Datanium.util.CommonUtils.genItemId('datapanel'),
				xtype : 'datapanel',
				region : 'center',
				floatable : false,
				layout : 'fit',
				header : false,
				minWidth : 400,
				margin : '5 0 0 0'
			} ]

		} ]
	} ]
});
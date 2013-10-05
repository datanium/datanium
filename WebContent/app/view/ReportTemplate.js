Ext.define('Datanium.view.ReportTemplate', {
	extend : 'Ext.container.Container',
	alias : 'widget.reporttemplate',
	layout : 'border',
	bodyBorder : false,
	border : false,
	defaults : {
		collapsible : true,
		split : true
	},
	items : [ {
		title : 'Data Cubes',
		region : 'west',
		floatable : false,
		margins : '5 0 0 0',
		width : 250,
		minWidth : 100,
		maxWidth : 250,
		bodyPadding : 0,
		layout : 'fit',
		items : [ {
			itemId : Datanium.util.CommonUtils.genItemId('leftpanel'),
			// cls : 'leftpanel',
			xtype : 'leftpanel'
		} ],
		tools : [ {
			itemId : Datanium.util.CommonUtils.genItemId('refreshbtn'),
			type : 'refresh'
		} ]
	}, {
		collapsible : false,
		region : 'center',
		margins : '5 0 0 0',
		header : false,
		border : false,
		layout : 'fit',
		flex : 1,
		items : [ {
			layout : 'border',
			bodyBorder : false,
			border : false,
			defaults : {
				collapsible : true,
				split : true
			},
			items : [ {
				layout : 'vbox',
				header : false,
				region : 'north',
				height : 'auto',
				width : '100%',
				items : [ {
					xtype : 'inner-toolbar',
					itemId : Datanium.util.CommonUtils.genItemId('inner-toolbar'),
					width : '100%'
				}, {
					xtype : 'fieldpanel',
					cls : 'fieldpanel',
					itemId : Datanium.util.CommonUtils.genItemId('fieldpanel'),
					bodyPadding : 0,
					header : false,
					width : '100%'
				} ]
			}, {
				itemId : Datanium.util.CommonUtils.genItemId('datapanel'),
				xtype : 'datapanel',
				region : 'center',
				floatable : false,
				collapsible : false,
				layout : 'fit',
				header : false,
				minWidth : 400
			} ]

		} ]
	} ]
});
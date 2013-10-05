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
		// xtype : 'leftpanel'
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
				itemId : Datanium.util.CommonUtils.genItemId('datapanel'),
				// xtype : 'datapanel',
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
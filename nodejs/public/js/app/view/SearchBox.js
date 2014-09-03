Ext.define('Datanium.view.SearchBox', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.searchbox',
	border : false,
	layout : {
		type : 'hbox',
		align : 'stretch'
	},
	initComponent : function() {
		Ext.apply(this, {
			defaults : {
				border : false
			},
			items : [ {
				xtype : 'searchcombo',
				width : '100%',
				itemId : Datanium.util.CommonUtils.genItemId('searchcombo')
			} ]
		});
		this.callParent();
	}
});
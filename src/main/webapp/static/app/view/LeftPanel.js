Ext.define('Datanium.view.LeftPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.leftpanel',
	border : false,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		Ext.apply(this, {
			defaults : {
				border : false
			},
			items : [ {
				xtype : 'cubecombo',
				itemId : Datanium.util.CommonUtils.genItemId('cubecombo'),
				flex : 0
			}, {
				xtype : 'accordion',
				flex : 1
			} ]
		});
		this.callParent();
	}
});
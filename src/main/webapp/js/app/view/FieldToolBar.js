Ext.define('Datanium.view.FieldToolBar', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.fieldtb',

	defaults : {
	// reorderable : true
	},
	// autoDestroy : false,
	initComponent : function() {
		Ext.apply(this, {
			width : 380,
			items : []
		});
		this.callParent();
	}

});
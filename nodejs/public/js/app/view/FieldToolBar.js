Ext.define('Datanium.view.FieldToolBar', {
	extend : 'Ext.toolbar.Toolbar',
	alias : 'widget.fieldtb',
	initComponent : function() {
		Ext.apply(this, {
			items : []
		});
		this.callParent();
	}

});
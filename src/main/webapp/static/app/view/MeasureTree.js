Ext.define('Datanium.view.MeasureTree', {
	extend : 'Ext.tree.Panel',
	xtype : 'check-tree',
	alias : 'widget.measureTree',
	title : 'Measures',
	rootVisible : false,
	useArrows : true,
	displayField : 'text',

	initComponent : function() {
		this.store = Ext.create('Ext.data.TreeStore', {
			model : 'Datanium.model.Measure',
			proxy : {
				type : 'memory',
				reader : {
					type : 'json',
					idProperty : 'uniqueName',
					root : 'children'
				}
			},
			listeners : {
				load : function() {
				}
			},
			folderSort : true,
			sorters : [ {
				property : 'caption',
				direction : 'ASC'
			} ]
		});
		this.callParent();
	}
});
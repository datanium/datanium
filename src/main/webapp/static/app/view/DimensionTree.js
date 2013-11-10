Ext.define('Datanium.view.DimensionTree', {
	extend : 'Ext.tree.Panel',
	xtype : 'check-tree',
	alias : 'widget.dimensionTree',
	title : 'Dimensions',
	rootVisible : false,
	useArrows : true,
	displayField : 'text',

	initComponent : function() {
		this.store = Ext.create('Ext.data.TreeStore', {
			model : 'Datanium.model.Dimension',
			proxy : {
				type : 'memory',
				reader : {
					type : 'json',
					idProperty : 'uniqueName',
					root : 'children'
				}
			},
			folderSort : true,
			sorters : [ {
				property : 'caption',
				direction : 'ASC'
			} ]
		});
		this.tbar = [ {
			text : 'Get checked nodes',
			scope : this,
			handler : this.onCheckedNodesClick
		} ];
		this.callParent();
	},
	onCheckedNodesClick : function() {
		var records = this.getView().getChecked(), names = [];

		Ext.Array.each(records, function(rec) {
			names.push(rec.get('text'));
		});
		console.log(names);
	},
	listeners : {
		itemclick : function(me, record, item, index, e, eOpts) {
			console.log(record);
			var id = record.get('id');
			var text = record.get('text');
		}
	}
});
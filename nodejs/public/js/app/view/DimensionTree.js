/* deprecated */
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
		/*
		 * this.tbar = [ { text : 'Get checked nodes', scope : this, handler :
		 * this.onCheckedNodesClick } ];
		 */
		this.callParent();
		this.addEvents('treeValueChange');
	},
	listeners : {
		itemclick : function(me, record, item, index, e, eOpts) {
			var node = record;
			var checked = node.get('checked');
			if (checked != null) {
				if (checked) {
					node.set('checked', false);
				} else {
					node.set('checked', true);
				}
				Datanium.util.CommonUtils.updateQueryParam();
				this.fireEvent('treeValueChange');
			}
		}
	}
});
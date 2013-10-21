Ext.define('Datanium.view.DimensionTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.dimensionTree',
	title : 'Dimensions',
//	store : 'Dimensions',
	displayField : 'name',
	rootVisible : false,
	useArrows : true,
	cls : 'dimensionTree',
	viewConfig : {
		stripeRows : true,
		plugins : {
			ddGroup: 'organizerDD',
			ptype : 'treeviewdragdrop',
			displayField : 'name',
			nodeHighlightOnDrop : true,
			nodeHighlightColor : 'c3ffff',
			enableDrop : false,
			appendOnly: true
		}
	},

	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			
		});
                me.store = Ext.create('Ext.data.TreeStore', {
                   model : 'ERMDashboard.model.Dimension',
                   proxy : {
                        type : 'memory',
                        reader : {
                                type : 'json',
                                idProperty : 'uniqueName',
                                root : 'children'
                        }
                  },
                  folderSort: true,
                  sorters : [ {
                        property : 'name',
                        direction : 'ASC'
                  } ]
                });
		me.callParent();
	}
});
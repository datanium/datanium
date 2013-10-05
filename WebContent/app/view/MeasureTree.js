Ext.define('Datanium.view.MeasureTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.measureTree',
	title : 'Measures',
//	store : 'Measures',
	displayField : 'name',
	rootVisible : false,
	cls : 'measureTree',
	useArrows : true,
	viewConfig : {
		stripeRows : true,
		plugins : {
			ddGroup : 'organizerDD',
			ptype : 'treeviewdragdrop',
			displayField : 'name',
			nodeHighlightOnDrop : true,
			nodeHighlightColor : 'c3ffff',
			enableDrop : false,
			appendOnly: true
		}
	},

	initComponent : function() {
                this.store = Ext.create('Ext.data.TreeStore', {
                    model : 'ERMDashboard.model.Measure',

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
                    folderSort: true,
                    sorters : [ {
                            property : 'name',
                            direction : 'ASC'
                    } ]
                });
		this.callParent();
	}
});
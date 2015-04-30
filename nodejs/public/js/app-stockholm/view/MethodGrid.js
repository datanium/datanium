Ext.define('Stockholm.view.MethodGrid', {
	extend : 'Ext.grid.Panel',
	xtype : 'methodgrid',
	collapsible : true,
	autoScroll : true,
	multiSelect : true,
	viewConfig : {
		stripeRows : true,
		enableTextSelection : true
	},

	initComponent : function() {
		this.columns = [ {
			text : '方法名',
			width : 100,
			align : 'center',
			sortable : true,
			dataIndex : 'name',
			renderer : function(val) {
				var url = "#";
				return '<a href="' + url + '" target="_blank" style="text-decoration: none">' + val + '</a>';
			}
		}, {
			text : '表达式',
			width : 320,
			align : 'center',
			sortable : true,
			dataIndex : 'method'
		}, {
			text : '创建者',
			width : 85,
			align : 'center',
			sortable : true,
			dataIndex : 'user_name'
		}, {
			text : '创建时间',
			width : 75,
			align : 'center',
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			dataIndex : 'creation_date'
		}, {
			text : '更新时间',
			width : 75,
			align : 'center',
			sortable : true,
			renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			dataIndex : 'modification_date'
		}, {
			text : '应用',
			width : 53,
			align : 'center',
			sortable : true
		} ];

		this.dockedItems = [ {
			xtype : 'pagingtoolbar',
			store : this.store,
			dock : 'bottom',
			displayInfo : true,
			listeners : {
				afterrender : function() {
					Ext.Array.each(this.items.items, function(item) {
						item.hide();
					});
					this.child('tbfill').show();
					this.child('#displayItem').show();
				}
			}
		} ];
		this.callParent();
	}
});
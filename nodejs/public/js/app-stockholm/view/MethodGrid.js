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
		this.columns = [
				{
					text : '方法名',
					width : 100,
					align : 'center',
					sortable : true,
					dataIndex : 'name',
					renderer : function(val, metaData, record) {
						var methodId = record.get('method_id');
						var methodName = record.get('name');
						return '<a href="javascript:showTestMethod(' + methodId + ',\'' + methodName
								+ '\');" style="text-decoration: none">' + val + '</a>';
					}
				}, {
					text : '表达式',
					width : 280,
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
					xtype : 'checkcolumn',
					text : '应用',
					width : 46,
					sortable : false,
					align : 'center',
					menuDisabled : true,
					dataIndex : 'enable',
					stopSelection : false
				}, {
					xtype : 'actioncolumn',
					text : '删除',
					width : 46,
					sortable : false,
					align : 'center',
					menuDisabled : true,
					items : [ {
						icon : './img/delete.png',
						tooltip : '删除',
						scope : this,
						handler : this.onRemoveClick
					} ]
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
	},
	onRemoveClick : function(grid, rowIndex) {
		console.log('remove item');
		// this.getStore().removeAt(rowIndex);
	}
});

var showTestMethod = function(methodId, methodName) {
	if (methodId != null && methodId > 0) {
		var methodForm = Ext.create('widget.methodform');
		Ext.ModelMgr.getModel('Stockholm.model.Method').load(methodId, {
			success : function(method) {
				methodForm.loadRecord(method);
			}
		});
		Ext.create('Ext.window.Window', {
			layout : 'fit',
			modal : true,
			title : methodName,
			items : [ methodForm ]
		}).show();
	}
};
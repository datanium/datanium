Ext.define('Stockholm.view.MethodBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.methodbox',
	autoScroll : true,
	height : 480,
	width : 720,
	border : false,
	layout : 'fit',
	title : '选股方法',
	modal : true,
	buttonAlign : 'right',
	items : [ {
		header : false,
		id : 'methodGrid',
		xtype : 'methodgrid',
		store : 'Methods',
		dockedItems : []
	} ],
	buttons : [ {
		text : '新建方法',
		handler : function() {
			var methodForm = Ext.create('widget.methodform');
			var methodFormBox = Ext.create('widget.methodformbox');
			methodFormBox.add(methodForm);
			methodFormBox.show();
		}
	}, {
		text : '执行回测',
		handler : function() {
			var ids = '';
			var grid = Ext.getCmp('methodGrid');
			Ext.each(grid.getSelectionModel().getSelection(), function(row, index, value) {
				// console.log(row.data);
				ids = ids + row.data.method_id + ',';
			});
			ids = ids.slice(0, -1);
			// console.log(ids);
			Ext.Msg.show({
				title : '确认执行',
				msg : '即将根据最近50个交易日的数据进行回测，请确认。',
				fn : runBackTest,
				buttons : Ext.Msg.YESNO,
				icon : Ext.Msg.QUESTION,
				ids : ids
			});
			this.up('.window').close();
		}
	}, {
		text : '确定',
		handler : function() {
			this.up('.window').close();
		}
	} ]
});

var reloadMethodGrid = function() {
	var grid = Ext.getCmp('methodGrid');
	grid.getStore().reload({
		callback : function() {
			grid.getView().refresh();
		}
	});
}
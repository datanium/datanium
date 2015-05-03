Ext.define('Stockholm.view.MethodBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.methodbox',
	autoScroll : true,
	height : 400,
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
			Ext.create('Ext.window.Window', {
				layout : 'fit',
				id : 'methodDetailWindow',
				modal : true,
				title : '新建选股方法',
				items : [ methodForm ]
			}).show();
		}
	}, {
		text : '执行回测',
		handler : function() {
			console.log('run');
		}
	}, {
		text : '确定',
		handler : function() {
			reloadMethodGrid();
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
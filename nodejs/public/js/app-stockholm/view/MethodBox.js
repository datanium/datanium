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
		xtype : 'methodgrid',
		store : 'Methods',
		dockedItems : []
	} ],
	buttons : [ {
		text : '新建方法',
		handler : function() {
			console.log('add');
		}
	}, {
		text : '执行回测',
		handler : function() {
			console.log('run');
		}
	}, {
		text : '确定',
		handler : function() {
			console.log('ok');
		}
	} ]
});
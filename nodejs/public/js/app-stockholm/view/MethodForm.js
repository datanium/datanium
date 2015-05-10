Ext.define('Stockholm.view.MethodForm', {
	extend : 'Ext.form.Panel',
	xtype : 'methodform',
	width : 640,
	url : '/stockholm/methods/save',
	layout : 'anchor',
	bodyPadding : 10,
	fieldDefaults : {
		labelAlign : 'top',
		labelWidth : 100,
		labelStyle : 'font-weight:bold'
	},
	defaults : {
		anchor : '100%',
		margins : '0 0 10 0'
	},
	items : [ {
		xtype : 'hidden',
		name : 'method_id'
	}, {
		xtype : 'textfield',
		fieldLabel : '方法名',
		name : 'name',
		allowBlank : false
	}, {
		xtype : 'textareafield',
		fieldLabel : '描述',
		name : 'desc',
		height : 80,
		allowBlank : true
	}, {
		xtype : 'textareafield',
		fieldLabel : '表达式',
		name : 'method',
		height : 140,
		allowBlank : false
	} ],
	buttons : [ {
		text : '保存',
		formBind : true, // only enabled once the form is valid
		disabled : true,
		handler : function() {
			var form = this.up('form').getForm();
			if (form.isValid()) {
				form.submit({
					success : function(form, action) {
						Ext.Msg.alert('Success', action.result.msg);
						closeMthFormWin();
						reloadMethodGrid();
					},
					failure : function(form, action) {
						closeMthFormWin();
						reloadMethodGrid();
						Ext.Msg.alert('Failed', action.result.msg);
					}
				});
			}
		}
	}, {
		text : '取消',
		handler : function() {
			closeMthFormWin();
		}
	} ]
});

var closeMthFormWin = function() {
	var window = Ext.getCmp('methodDetailWindow');
	window.close();
}
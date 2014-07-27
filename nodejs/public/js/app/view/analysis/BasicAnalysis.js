Ext.define('Datanium.view.analysis.BasicAnalysis', {
	extend : 'Ext.form.Panel',
	alias : 'widget.basic-analysis',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'fit',
			region : 'center',
			margin : '5 0 0 0',
			style : 'background:#fff',
			title : 'Basic Analysis',
			overflowY : 'scroll',
			defaults : {
				margin : '5 25 5 10'
			}
		});
		this.items = [ {
			xtype : 'fieldset',
			title : 'Input Parameters',
			defaultType : 'textfield'
		}, {
			xtype : 'fieldset',
			title : 'Basic Statistic',
			defaultType : 'textfield'
		} ]
		this.callParent();
	}
});

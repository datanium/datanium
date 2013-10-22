Ext.define('Datanium.util.CommonUtils', {
	statics : {
		genItemId : function(xtype, key) {
			if (key != null && key != '')
				return 'dtnm-' + xtype + '-' + Datanium.GlobalData.tabindex + '-' + key;
			return 'dtnm-' + xtype + '-' + Datanium.GlobalData.tabindex;
		},
		getCurrentTab : function(tab) {
			return Ext.getCmp('mainBox').getActiveTab();
		},
		getCmpInActiveTab : function(selector) {
			return this.getCurrentTab().down(selector);
		}
	}
});
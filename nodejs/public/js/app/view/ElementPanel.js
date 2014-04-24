Ext.define('Datanium.view.ElementPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.elementPanel',
	padding : 10,
	defaults : {},
	initComponent : function() {
		Ext.apply(this, {});
		this.items = [];
		this.callParent();
		this.addEvents('refreshElementPanel');
		this.addEvents('selectionChange');
		this.on('refreshElementPanel', function() {
			if (Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel') != null) {
				var ep = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel');
				ep.removeAll();
				var dims = Datanium.GlobalData.qubeInfo.dimensions;
				var msrs = Datanium.GlobalData.qubeInfo.measures;
				Ext.Array.each(dims, function(d) {
					var btn = {
						itemId : d.uniqueName,
						xtype : 'splitbutton',
						text : d.text,
						iconCls : 'fa fa-bars',
						cls : 'elementBtn',
						enableToggle : true,
						textAlign : 'left',
						toggleHandler : function() {
							Datanium.util.CommonUtils.updateQueryParamByEP();
							Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('selectionChange');
						},
						menu : [
								{
									iconCls : 'fa fa-times-circle-o',
									text : 'Remove',
									handler : function() {
										Datanium.util.CommonUtils.removeElement(this.parentMenu.ownerButton.itemId);
										this.parentMenu.ownerButton.destroy();
										Datanium.util.CommonUtils.updateQueryParamByEP();
										Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
												'selectionChange');
									}
								}, {
									iconCls : 'fa fa-filter',
									text : 'Filter',
									handler : function() {

									}
								} ]
					}
					ep.add(btn);
				});
				Ext.Array.each(msrs, function(m) {
					var btn = {
						itemId : m.uniqueName,
						xtype : 'splitbutton',
						text : m.text + ' - ' + m.data_source,
						params : {
							data_type : m.data_type,
							data_source : m.data_source
						},
						iconCls : 'fa fa-bar-chart-o',
						cls : 'elementBtn',
						enableToggle : true,
						textAlign : 'left',
						toggleHandler : function() {
							Datanium.util.CommonUtils.updateQueryParamByEP();
							Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('selectionChange');
						},
						menu : [ {
							iconCls : 'fa fa-times-circle-o',
							text : 'Remove',
							handler : function() {
								Datanium.util.CommonUtils.removeElement(this.parentMenu.ownerButton.itemId);
								this.parentMenu.ownerButton.destroy();
								Datanium.util.CommonUtils.updateQueryParamByEP();
								Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel')
										.fireEvent('selectionChange');
							}
						} ]
					}
					ep.add(btn);
				});
				ep.doLayout();
				Datanium.util.CommonUtils.updateQueryParamByEP();
				Datanium.util.CommonUtils.refreshAll();
			}
		});
	}
});
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
						uniqueName : d.uniqueName,
						xtype : 'splitbutton',
						text : d.text,
						tooltip : d.text,
						tooltipType : 'title',
						iconCls : 'fa fa-bars',
						eleType : 'dim',
						cls : 'elementBtn',
						enableToggle : true,
						textAlign : 'left',
						toggleHandler : function(me) {
							Datanium.util.CommonUtils.updateQueryParamByEP(me.uniqueName);
							Datanium.util.CommonUtils.markPrimary();
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
								},
								{
									iconCls : 'fa fa-filter',
									text : 'Filter',
									handler : function() {
										var btn = this.parentMenu.ownerButton;
										Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
												'popFilter', btn.uniqueName, btn.text);
									}
								} ]
					}
					ep.add(btn);
				});
				Ext.Array.each(msrs, function(m) {
					var btn = {
						uniqueName : m.uniqueName,
						xtype : 'splitbutton',
						text : Datanium.util.CommonUtils.limitLabelLength(m.text + ' - ' + m.data_source, 32),
						tooltip : m.text + ' - ' + m.data_source,
						tooltipType : 'title',
						params : {
							data_type : m.data_type,
							data_source : m.data_source
						},
						iconCls : 'fa fa-bar-chart-o',
						eleType : 'mea',
						cls : 'elementBtn',
						enableToggle : true,
						textAlign : 'left',
						toggleHandler : function() {
							Datanium.util.CommonUtils.updateQueryParamByEP();
							Datanium.util.CommonUtils.markPrimary();
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
				Datanium.util.CommonUtils.updateEPSelection();
				//Datanium.util.CommonUtils.refreshAll();
				//Datanium.GlobalData.queryParam.primaryDimension = null;
			}
		});
	}
});
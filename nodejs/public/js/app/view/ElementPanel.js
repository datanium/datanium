Ext.define('Datanium.view.ElementPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.elementPanel',
	padding : 10,
	defaults : {},
	title : 'My Dataset',
	initComponent : function() {
		Ext.apply(this, {});
		this.items = [];
		this.callParent();
		this.addEvents('refreshElementPanel');
		this.addEvents('selectionChange');
		this.on('refreshElementPanel', function(indicators) {
			if (Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel') != null) {
				var ep = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel');
				ep.removeAll();
				var dims = Datanium.GlobalData.qubeInfo.dimensions;
				var msrs = Datanium.GlobalData.qubeInfo.measures;
				Ext.Array.each(dims,
						function(d) {
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
									if (me.pressed) {
										me.menu.items.items[0].setIconCls('fa fa-check-circle');
										me.menu.items.items[0].setText(Datanium.GlobalStatic.label_unapply);
									} else {
										me.menu.items.items[0].setIconCls('fa fa-check');
										me.menu.items.items[0].setText(Datanium.GlobalStatic.label_apply);
									}
									Datanium.util.CommonUtils.updateQueryParamByEP(me.uniqueName);
									Datanium.util.CommonUtils.markPrimary();
									Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
											'selectionChange');
								},
								menu : [
										{
											iconCls : 'fa fa-check',
											text : Datanium.GlobalStatic.label_apply,
											handler : function() {
												var btn = this.parentMenu.ownerButton;
												btn.toggle();
											}
										},
										{
											iconCls : 'fa fa-trash-o',
											text : Datanium.GlobalStatic.label_remove,
											handler : function() {
												Datanium.util.CommonUtils
														.removeElement(this.parentMenu.ownerButton.uniqueName);
												this.parentMenu.ownerButton.destroy();
												Datanium.util.CommonUtils.updateQueryParamByEP();
												Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
														'selectionChange');
											}
										},
										{
											iconCls : 'fa fa-filter',
											text : Datanium.GlobalStatic.label_filter,
											handler : function() {
												var btn = this.parentMenu.ownerButton;
												Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
														'popFilter', btn.uniqueName, btn.text);
											}
										},
										{
											iconCls : 'fa fa-times-circle-o',
											text : Datanium.GlobalStatic.label_clean_filter,
											handler : function() {
												var btn = this.parentMenu.ownerButton;
												var key = btn.uniqueName;
												delete Datanium.GlobalData.queryParam.filters[key];
												if (key == Datanium.GlobalData.queryParam.primaryFilter)
													Datanium.GlobalData.queryParam.isSplit = false;
												Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
														'submitFilter');
											}
										} ]
							};
							ep.add(btn);
						});
				Ext.Array.each(msrs,
						function(m) {
							var btn = {
								uniqueName : m.uniqueName,
								xtype : 'splitbutton',
								// text :
								// Datanium.util.CommonUtils.limitLabelLength(m.text
								// + ' - ' + m.data_source, 32),
								text : Datanium.util.CommonUtils.limitLabelLength(m.text, 32),
								tooltip : m.text,
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
								toggleHandler : function(me) {
									if (me.pressed) {
										me.menu.items.items[0].setIconCls('fa fa-check-circle');
										me.menu.items.items[0].setText(Datanium.GlobalStatic.label_unapply);
									} else {
										me.menu.items.items[0].setIconCls('fa fa-check');
										me.menu.items.items[0].setText(Datanium.GlobalStatic.label_apply);
									}
									Datanium.util.CommonUtils.updateQueryParamByEP();
									Datanium.util.CommonUtils.markPrimary();
									Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
											'selectionChange');
								},
								menu : [
										{
											iconCls : 'fa fa-check',
											text : Datanium.GlobalStatic.label_apply,
											handler : function() {
												var btn = this.parentMenu.ownerButton;
												btn.toggle();
											}
										},
										{
											iconCls : 'fa fa-info-circle',
											text : Datanium.GlobalStatic.label_desc,
											handler : function() {
												var btn = this.parentMenu.ownerButton;
												Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
														'popDesc', btn.uniqueName, btn.text);
											}
										},
										{
											iconCls : 'fa fa-trash-o',
											text : Datanium.GlobalStatic.label_remove,
											handler : function() {
												Datanium.util.CommonUtils
														.removeElement(this.parentMenu.ownerButton.uniqueName);
												this.parentMenu.ownerButton.destroy();
												Datanium.util.CommonUtils.updateQueryParamByEP();
												Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
														'selectionChange');
											}
										} ]
							}
							ep.add(btn);
						});
				ep.doLayout();
				Datanium.util.CommonUtils.updateEPSelection();
				// Datanium.util.CommonUtils.refreshAll();
				// Datanium.GlobalData.queryParam.primaryDimension = null;

				// toggle indicator button when it is added
				if (indicators != null) {
					var indicator = indicators[0];
					Ext.Array.each(ep.items.items, function(rec, idx) {
						if (indicator.uniqueName === rec.uniqueName) {
							ep.items.items[idx].toggle(true);
						}
					});
				}
			}
		});
	}
});
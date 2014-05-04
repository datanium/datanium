var popSelection;
Ext.define('Datanium.view.FilterBox', {
	alias : 'widget.filterbox',
	border : false,
	show : function() {
		var popup = Ext.create('Ext.window.MessageBox', {
			bodyPadding : 5,
			autoScroll : true,
			modal : true,
			maxHeight : 480,
			maxWidth : 850
		});

		popup.show({
			title : 'Select ' + Datanium.GlobalData.popDimension,
			buttons : Ext.Msg.OKCANCEL,
			buttonText : {
				ok : 'Submit'
			},
			fn : this.submitFilter
		});
		popSelection = [];
		var dimValues = Datanium.GlobalData.dimensionValues;
		var key = Datanium.GlobalData.popDimensionKey;
		if (key in Datanium.GlobalData.queryParam.filters)
			popSelection = eval('Datanium.GlobalData.queryParam.filters.' + key);
		var buttons = [];
		Ext.Array.each(dimValues, function(rec, index) {
			var btn = {
				uniqueName : rec.name,
				xtype : 'button',
				text : Datanium.util.CommonUtils.limitLabelLength(rec.name, 23),
				tooltip : rec.name,
				tooltipType : 'title',
				iconCls : 'fa fa-check-square-o',
				enableToggle : true,
				textAlign : 'left',
				width : 180,
				toggleHandler : function(me) {
					if (me.pressed) {
						Ext.Array.each(popSelection, function(rec, index) {
							if (rec == me.uniqueName) {
								return;
							}
						});
						popSelection.push(me.uniqueName);
					} else {
						Ext.Array.each(popSelection, function(rec, index) {
							if (rec == me.uniqueName) {
								popSelection.splice(index, 1);
							}
						});
					}
				}
			};
			// toggle selected buttons
			var key = Datanium.GlobalData.popDimensionKey;
			var selections = eval('Datanium.GlobalData.queryParam.filters.' + key);
			Ext.Array.each(selections, function(sel, index) {
				if (btn.uniqueName == sel) {
					btn.pressed = true;
				}
			});
			buttons.push(btn);
		});
		var btnPanel = Ext.create('Ext.panel.Panel', {
			header : false,
			layout : {
				type : 'table',
				columns : 4,
				tdAttrs : {
					style : 'padding: 5px 10px;'
				}
			},
			items : buttons
		});
		popup.add(btnPanel);
		popup.setWidth(850);
		popup.center();
	},
	submitFilter : function(buttonId, text, opt) {
		if (buttonId == 'ok') {
			var key = Datanium.GlobalData.popDimensionKey;
			// time dimension no quotes
			if (key == 'year') {
				popSelection = popSelection.join(",");
			} else {
				popSelection = "'" + popSelection.join("','") + "'";
			}
			if (popSelection.length > 0) {
				eval('Datanium.GlobalData.queryParam.filters.' + key + '=[' + popSelection + ']');
				console.log(Datanium.GlobalData.queryParam.filters);
				Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('submitFilter');
			}
		}
	}
});
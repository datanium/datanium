var popSelection = [];
var isTimeDim = false;

Ext.define('Datanium.view.FilterBox', {
	alias : 'widget.filterbox',
	border : false,
	show : function() {
		var popup = Ext.create('Ext.window.MessageBox', {
			bodyPadding : 5,
			autoScroll : true,
			modal : true,
			bodyBorder : true,
			maxHeight : 480,
			maxWidth : 850
		});

		popup.show({
			msg : 'Select ' + Datanium.GlobalData.popDimension,
			padding : 0,
			buttons : Ext.Msg.YESNOCANCEL,
			buttonText : {
				yes : 'Submit',
				no : 'Clear'
			},
			fn : this.submitFilter
		});
		var dimValues = Datanium.GlobalData.dimensionValues;
		var key = Datanium.GlobalData.popDimensionKey;
		isTimeDim = Datanium.util.CommonUtils.checkTimeDim(key);
		if (isTimeDim) {
			// time dimension
			popSelection = [];
			var timeStore = Ext.create('Ext.data.Store', {
				fields : [ 'name' ],
				data : dimValues
			});
			var f = eval('Datanium.GlobalData.queryParam.filters.' + Datanium.GlobalData.popDimensionKey);
			var start = null;
			var end = null;
			if (f != null) {
				start = f.time_start;
				end = f.time_end;
			}
			// console.log('start:' + start + ' end:' + end);
			var timeSelectPanel = Ext.create('Ext.panel.Panel', {
				id : 'timeSelPanel',
				header : false,
				bodyPadding : 10,
				items : [ {
					id : 'time_start_picker',
					xtype : 'combobox',
					editable : false,
					fieldLabel : 'From',
					store : timeStore,
					valueField : 'name',
					displayField : 'name',
					queryMode : 'local',
					listConfig : {
						maxHeight : 120
					},
					value : start
				}, {
					id : 'time_end_picker',
					xtype : 'combobox',
					editable : false,
					fieldLabel : 'To',
					store : timeStore,
					valueField : 'name',
					displayField : 'name',
					queryMode : 'local',
					listConfig : {
						maxHeight : 120
					},
					value : end
				} ]
			});
			popup.add(timeSelectPanel);
			popup.setWidth(320);
		} else {
			// non-time dimension
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
					iconCls : 'fa fa-square-o',
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
							if (popSelection.length >= 10) {
								Ext.MessageBox.alert("Alert", "Sorry, you cannot select more than 10 filter values.");
								me.toggle();
							} else {
								popSelection.push(me.uniqueName);
								me.setIconCls('fa fa-check-square-o');
							}
						} else {
							Ext.Array.each(popSelection, function(rec, index) {
								if (rec == me.uniqueName) {
									popSelection.splice(index, 1);
									me.setIconCls('fa fa-square-o');
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
						btn.iconCls = 'fa fa-check-square-o';
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
		}
		popup.center();
	},
	submitFilter : function(buttonId, text) {
		if (buttonId == 'yes' && popSelection.length > 0) {
			Datanium.GlobalData.queryParam.primaryFilter = Datanium.GlobalData.popDimensionKey;
			Datanium.util.CommonUtils.splitFilter(popSelection);
			var epBtns = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').items.items;
			Ext.Array.each(epBtns, function(rec, idx) {
				if (rec.uniqueName == Datanium.GlobalData.queryParam.primaryFilter) {
					if (!rec.pressed)
						epBtns[idx].toggle();
				}
			});
		} else if (buttonId == 'yes' && isTimeDim) {
			var startVal = Ext.getCmp('time_start_picker').getValue();
			var endVal = Ext.getCmp('time_end_picker').getValue();
			if (startVal != null || endVal != null) {
				eval('Datanium.GlobalData.queryParam.filters.' + Datanium.GlobalData.popDimensionKey + '={time_start:'
						+ startVal + ',time_end:' + endVal + '}');
			} else {
				console.log('time is not selected');
				if (isTimeDim)
					Ext.getCmp('timeSelPanel').destroy();
				return;
			}

		} else if (buttonId == 'no') {
			// Datanium.GlobalData.queryParam.split = null;
			var key = Datanium.GlobalData.popDimensionKey;
			delete Datanium.GlobalData.queryParam.filters[key];
			if (key == Datanium.GlobalData.queryParam.primaryFilter)
				Datanium.GlobalData.queryParam.isSplit = false;
			// Datanium.util.CommonUtils.clearPopDimFilter();
		} else if (buttonId == 'cancel') {
			if (isTimeDim)
				Ext.getCmp('timeSelPanel').destroy();
			return;
		}
		Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('submitFilter');
		if (isTimeDim)
			Ext.getCmp('timeSelPanel').destroy();
	}
});
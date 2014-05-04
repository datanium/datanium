Ext.define('Datanium.util.CommonUtils', {
	statics : {
		genItemId : function(xtype, key) {
			if (key != null && key != '')
				return 'dtnm-' + xtype + '-' + Datanium.GlobalData.tabindex + '-' + key;
			return 'dtnm-' + xtype + '-' + Datanium.GlobalData.tabindex;
		},
		getCmpSearchKey : function(xtype, key) {
			return '#' + Datanium.util.CommonUtils.genItemId(xtype, key);
		},
		getCurrentTab : function() {
			return Ext.getCmp('mainBox').getActiveTab();
		},
		getCmpInActiveTab : function(selector) {
			return this.getCurrentTab().down(selector);
		},
		getCmpInContainer : function(containerId, selector) {
			var container = Ext.getCmp(containerId);
			if (container) {
				return container.down(selector);
			}
		},
		updateQueryParam : function() {
			var dimensionTree = Datanium.util.CommonUtils.getCmpInActiveTab('dimensionTree');
			var dimensions = dimensionTree.getView().getChecked(), dimNodes = [];
			Ext.Array.each(dimensions, function(rec) {
				var id = rec.get('id');
				var name = rec.get('text');
				var dimItem = {
					uniqueName : id,
					text : name,
					data_type : 'dimension',
					field_type : 'row',
					displayOrder : 0,
					display : true
				}
				dimNodes.push(dimItem);
			});
			var measureTree = Datanium.util.CommonUtils.getCmpInActiveTab('measureTree');
			var measures = measureTree.getView().getChecked(), meaNodes = [];
			Ext.Array.each(measures, function(rec) {
				var id = rec.get('id');
				var name = rec.get('text');
				var meaItem = {
					uniqueName : id,
					text : name,
					data_type : 'measure',
					field_type : 'column',
					displayOrder : 0,
					display : true
				}
				meaNodes.push(meaItem);
			});
			var queryParam = Datanium.GlobalData.queryParam;
			queryParam.dimensions = dimNodes;
			queryParam.measures = meaNodes;
			Datanium.util.CommonUtils.updateFields();
		},
		updateQueryParamByEP : function(toggleDimension) {
			var epItems = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').items;
			var dimNodes = [];
			var meaNodes = [];
			Ext.Array.each(epItems.items, function(rec) {
				var id = rec.uniqueName;
				var eleType = rec.eleType;
				var name = rec.tooltip;
				var params = rec.params;
				if (!rec.pressed && toggleDimension == Datanium.GlobalData.queryParam.primaryDimension) {
					Datanium.GlobalData.queryParam.primaryDimension = null;
				}
				if (id != null && rec.pressed) {
					if (eleType == 'mea') {
						var meaItem = {
							uniqueName : id,
							text : name,
							data_type : params.data_type,
							field_type : 'column',
							displayOrder : 0,
							display : true
						}
						meaNodes.push(meaItem);
					} else {
						var dimItem = {
							uniqueName : id,
							text : name,
							data_type : 'dimension',
							field_type : 'row',
							// is_primary : false,
							displayOrder : 0,
							display : true
						}
						if (toggleDimension == id && Datanium.GlobalData.queryParam.primaryDimension == null) {
							// dimItem.is_primary = true;
							Datanium.GlobalData.queryParam.primaryDimension = id;
						}
						dimNodes.push(dimItem);
					}
				}
			});
			if (Datanium.GlobalData.queryParam.primaryDimension == null && dimNodes.length > 0) {
				dimNodes[0].is_primary = true;
				Datanium.GlobalData.queryParam.primaryDimension = dimNodes[0].uniqueName;
			}
			var queryParam = Datanium.GlobalData.queryParam;
			queryParam.dimensions = dimNodes;
			queryParam.measures = meaNodes;
			Datanium.GlobalData.QueryResult = null;
			Datanium.util.CommonUtils.updateFields();
		},
		updateFields : function() {
			var dimField = Datanium.util.CommonUtils.getCmpInActiveTab(Datanium.util.CommonUtils
					.getCmpSearchKey('dimField'));
			var meaField = Datanium.util.CommonUtils.getCmpInActiveTab(Datanium.util.CommonUtils
					.getCmpSearchKey('meaField'));
			dimField.removeAll();
			meaField.removeAll();
			var queryParam = Datanium.GlobalData.queryParam;
			if ('dimensions' in queryParam) {
				Ext.Array.each(queryParam.dimensions, function(rec, index) {
					var dim = rec;
					var field = {
						uniqueName : dim.uniqueName,
						text : dim.text,
						cls : 'fieldBtn-d'
					};
					dimField.add(field);
				});
			}
			if ('measures' in queryParam) {
				Ext.Array.each(queryParam.measures, function(rec, index) {
					var mea = rec;
					var field = {
						uniqueName : mea.uniqueName,
						text : mea.text,
						cls : 'fieldBtn-m'
					};
					meaField.add(field);
				});
			}
			// console.log(dimField);
			// console.log(meaField);
			// console.log(Datanium.GlobalData.queryParam);
		},
		pushElements2Array : function(items, array) {
			Ext.Array.each(items, function(item) {
				var dupFlag = false;
				Ext.Array.each(array, function(rec) {
					if (item.uniqueName == rec.uniqueName) {
						dupFlag = true;
						return false;
					}
				});
				if (!dupFlag) {
					array.push(item);
				}
			});
			return array;
		},
		refreshAll : function() {
			Datanium.util.CommonUtils.generateGrid();
			Datanium.util.CommonUtils.generateChart();
		},
		removeElement : function(uniqueName) {
			var dims = Datanium.GlobalData.qubeInfo.dimensions;
			var meas = Datanium.GlobalData.qubeInfo.measures;
			var i;
			for (i = dims.length - 1; i >= 0; i -= 1) {
				if (dims[i].uniqueName === uniqueName) {
					Datanium.GlobalData.qubeInfo.dimensions.splice(i, 1);
				}
			}
			for (i = meas.length - 1; i >= 0; i -= 1) {
				if (meas[i].uniqueName === uniqueName) {
					Datanium.GlobalData.qubeInfo.measures.splice(i, 1);
				}
			}
		},
		destroyChart : function() {
			if (Datanium.util.CommonUtils.getCmpInActiveTab('columnchart') != null) {
				Datanium.util.CommonUtils.getCmpInActiveTab('columnchart').destroy();
			}
			if (Datanium.util.CommonUtils.getCmpInActiveTab('stackchart') != null) {
				Datanium.util.CommonUtils.getCmpInActiveTab('stackchart').destroy();
			}
			if (Datanium.util.CommonUtils.getCmpInActiveTab('linechart') != null) {
				Datanium.util.CommonUtils.getCmpInActiveTab('linechart').destroy();
			}
		},
		generateChart : function() {
			Datanium.util.CommonUtils.destroyChart();
			var classname = 'widget.' + Datanium.GlobalData.chartMode;
			var chart = Ext.create(classname, {
				itemId : Datanium.util.CommonUtils.genItemId(Datanium.GlobalData.chartMode),
				region : 'center',
				floatable : false,
				collapsible : false,
				header : false
			});
			Datanium.util.CommonUtils.getCmpInActiveTab('datachartview').insert(chart);
		},
		destroyGrid : function() {
			if (Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid') != null) {
				Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid').destroy();
			}
		},
		generateGrid : function() {
			Datanium.util.CommonUtils.destroyGrid();
			var grid = Ext.create('widget.dynamicdatagrid', {
				xtype : 'dynamicdatagrid',
				itemId : Datanium.util.CommonUtils.genItemId('dynamicdatagrid'),
				region : 'center',
				floatable : false,
				collapsible : false,
				header : false
			});
			Datanium.util.CommonUtils.getCmpInActiveTab('datagridview').insert(grid);
		},
		getStoreTemplate : function() {
			var storeTemplate = {
				extend : 'Ext.data.Store',
				autoLoad : true,
				proxy : {
					type : 'memory',
					reader : {
						type : 'json',
						root : 'result'
					}
				}
			};
			return storeTemplate;
		},
		limitLabelLength : function(label, len) {
			if (label != null && label.length > len) {
				return label.substr(0, len) + '...';
			} else {
				return label;
			}
		},
		markPrimary : function() {
			var primDim = Datanium.GlobalData.queryParam.primaryDimension;
			var dimField = Datanium.util.CommonUtils.getCmpInActiveTab(Datanium.util.CommonUtils
					.getCmpSearchKey('dimField'));
			Ext.Array.each(dimField.items.items, function(rec, index) {
				if (rec.uniqueName == primDim) {
					var txt = rec.text;
					dimField.items.items[index].setText("* " + txt);
				}
			});
			var elemtPanel = Datanium.util.CommonUtils.getCmpInActiveTab(Datanium.util.CommonUtils
					.getCmpSearchKey('elementPanel'));
			Ext.Array.each(elemtPanel.items.items, function(rec, index) {
				if (rec.eleType == 'dim') {
					var txt = rec.text;
					var starFlag = txt.indexOf("* ") > -1;
					if (rec.uniqueName == primDim) {
						if (!starFlag) {
							elemtPanel.items.items[index].setText("* " + txt);
						} else if (!rec.pressed) {
							var newTxt = txt.substr(2, txt.length - 2);
							elemtPanel.items.items[index].setText(newTxt);
						}
					} else {
						if (starFlag) {
							var newTxt = txt.substr(2, txt.length - 2);
							elemtPanel.items.items[index].setText(newTxt);
						}
					}
				}
			});
		}
	}
});
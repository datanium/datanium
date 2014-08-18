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
			// return Ext.getCmp('mainBox').getActiveTab();
			return Ext.getCmp('mainBox');
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
						if (toggleDimension == id) {
							if (Datanium.GlobalData.queryParam.primaryDimension == null
									|| Datanium.GlobalData.queryParam.primaryDimension == '') {
								// dimItem.is_primary = true;
								Datanium.GlobalData.queryParam.primaryDimension = id;
							}
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
		updateEPSelection : function() {
			var epItems = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').items;
			var queryParam = Datanium.GlobalData.queryParam;
			var dimNodes = queryParam.dimensions;
			var meaNodes = queryParam.measures;
			var autoRun = Datanium.GlobalData.autoRun;
			Datanium.GlobalData.autoRun = false;
			Ext.Array.each(epItems.items, function(rec, idx) {
				var id = rec.uniqueName;
				Ext.Array.each(dimNodes, function(d) {
					if (id === d.uniqueName) {
						epItems.items[idx].toggle();
					}
				});
				Ext.Array.each(meaNodes, function(m) {
					if (id === m.uniqueName) {
						epItems.items[idx].toggle();
					}
				});
			});
			Datanium.GlobalData.autoRun = autoRun;
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
		updateFilterFields : function() {
			var fltField = Datanium.util.CommonUtils.getCmpInActiveTab(Datanium.util.CommonUtils
					.getCmpSearchKey('fltField'));
			fltField.removeAll();
			var queryParam = Datanium.GlobalData.queryParam;
			var dimensions = queryParam.dimensions;
			if ('filters' in queryParam) {
				for (key in queryParam.filters) {
					Ext.Array.each(dimensions, function(dim) {
						if (key == dim.uniqueName) {
							var field = {
								uniqueName : key,
								text : dim.text,
								cls : 'fieldBtn-f'
							};
							fltField.add(field);
						}
					});
				}
			}
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
			var classname = 'widget.'
					+ (Datanium.GlobalData.chartMode == '' ? 'columnchart' : Datanium.GlobalData.chartMode);
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
		},
		scaleLg10 : function(number) {
			if (number <= 0)
				return NaN;
			else
				return (Math.log(number) / Math.LN10).toFixed(3);
		},
		scaleLn : function(number) {
			if (number <= 0)
				return NaN;
			else
				return Math.log(number).toFixed(3);
		},
		getScaleFactor : function(array) {
			var sum = 0;
			for ( var i = 0; i < array.length; i++) {
				sum += array[i];
			}
			var avg = sum / array.length;
			return 1000 / avg;
		},
		isNumber : function(n) {
			return !isNaN(parseFloat(n));
		},
		scaleMeasures : function(queryResult, yFields) {
			for ( var j = 0; j < yFields.length; j++) {
				var numbers = [];
				for ( var i = 0; i < queryResult.result.length; i++) {
					if (yFields[j] in queryResult.result[i]) {
						var number = (queryResult.result[i])[yFields[j]];
						numbers.push(number);
					}
				}
				// console.log(numbers);
				var sf = Datanium.util.CommonUtils.getScaleFactor(numbers);
				// console.log(sf);
				if (Datanium.util.CommonUtils.isNumber(sf)) {
					for ( var i = 0; i < queryResult.result.length; i++) {
						if (yFields[j] in queryResult.result[i]) {
							var number = (queryResult.result[i])[yFields[j]];
							(queryResult.result[i])[yFields[j]] = number * sf;
						}
					}
				}
			}
			return queryResult;
		},
		getSplitMeasures : function(measure, splitValue) {
			var returnArray = [];
			Ext.Array.each(splitValue, function(rec, index) {
				var cvtVal = rec;
				if (typeof rec === 'string')
					cvtVal = Datanium.util.CommonUtils.convertSplitValue(rec);
				var obj = {
					uniqueName : measure.uniqueName + '_' + cvtVal,
					text : measure.text + ' - ' + rec,
					display : true
				};
				returnArray.push(obj);
			});
			return returnArray;
		},
		convertSplitValue : function(str) {
			var returnStr = str.trim().replace(/ |-|&|\(|\)|\,|\./g, '');
			return returnStr;
		},
		markSelection : function(selectedItem) {
			var menuItems = selectedItem.parentMenu.items.items;
			Ext.Array.each(menuItems, function(item, i) {
				item.setIconCls('');
			});
			selectedItem.setIconCls('fa fa-star-o');
		},
		clearPopDimFilter : function() {
			var key = Datanium.GlobalData.popDimensionKey;
			var selections = eval('Datanium.GlobalData.queryParam.filters.' + key + '=[]');
		},
		splitFilter : function(popSelection) {
			var key = Datanium.GlobalData.queryParam.primaryFilter;
			// time dimension no quotes
			var popSelStr = '';
			if (key == 'year') {
				popSelStr = popSelection.join(",");
			} else {
				popSelStr = "'" + popSelection.join("','") + "'";
			}
			if (popSelStr.length > 0) {
				// console.log('Datanium.GlobalData.queryParam.filters.' + key +
				// '=[' + popSelStr + ']');
				eval('Datanium.GlobalData.queryParam.filters.' + key + '=[' + popSelStr + ']');
				var splitObj = {
					dimensions : key,
					splitValue : popSelection
				};
				Datanium.GlobalData.queryParam.split = splitObj;
				Datanium.GlobalData.queryParam.isSplit = true;
			}
		},
		cleanData : function() {
			Datanium.GlobalData.queryParam = {
				dimensions : [],
				measures : [],
				groups : [],
				filters : {},
				primaryDimension : null,
				split : {
					dimensions : null,
					splitValue : []
				},
				isSplit : false
			};
			Datanium.GlobalData.QueryResult = null;
			Datanium.GlobalData.QueryResult4Chart = null;
			Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel');
		}
	}
});
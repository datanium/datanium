Ext
		.define(
				'Datanium.util.CommonUtils',
				{
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
						updateQueryParamByEP : function(toggleDimension) {
							var epItems = Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').items;
							var dimNodes = [];
							var meaNodes = [];
							Ext.Array.each(epItems.items,
									function(rec) {
										var id = rec.uniqueName;
										var eleType = rec.eleType;
										var name = rec.tooltip;
										var params = rec.params;
										if (!rec.pressed
												&& toggleDimension == Datanium.GlobalData.queryParam.primaryDimension) {
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
														// dimItem.is_primary =
														// true;
														Datanium.GlobalData.queryParam.primaryDimension = id;
													}
												}
												dimNodes.push(dimItem);
											}
										} else if (!rec.pressed && toggleDimension === id) {
											Datanium.util.CommonUtils.removeColumnConvert(id);
										}
									});
							if (Datanium.GlobalData.queryParam.primaryDimension == null && dimNodes.length > 0) {
								dimNodes[0].is_primary = true;
								Datanium.GlobalData.queryParam.primaryDimension = dimNodes[0].uniqueName;
							}
							var queryParam = Datanium.GlobalData.queryParam;
							queryParam.dimensions = dimNodes;
							queryParam.measures = meaNodes;
							Datanium.GlobalData.queryResult = null;
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
										epItems.items[idx].toggle(true);
									}
								});
								Ext.Array.each(meaNodes, function(m) {
									if (id === m.uniqueName) {
										epItems.items[idx].toggle(true);
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
										cls : 'fieldBtn-d',
										handler : function(me) {
											Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
													'popFilter', me.uniqueName, me.text);
										}
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
										cls : 'fieldBtn-m',
										handler : function(me) {
											Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
													'popDesc', me.uniqueName, me.text);
										}
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
												cls : 'fieldBtn-f',
												handler : function(me) {
													Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel')
															.fireEvent('popFilter', me.uniqueName, me.text);
												}
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
							var isEmpty = (Datanium.GlobalData.queryParam.dimensions == null || Datanium.GlobalData.queryParam.dimensions.length == 0)
									&& (Datanium.GlobalData.queryParam.measures == null || Datanium.GlobalData.queryParam.measures.length == 0);
							var showFieldBtn = Ext.getCmp('show_field_panel_btn');
							if (isEmpty) {
								showFieldBtn.toggle(false);
							} else {
								showFieldBtn.toggle(true);
							}
							var autoScaleBtn = Ext.getCmp('auto_scale_btn');
							if (Datanium.GlobalData.queryParam.measures != null
									&& Datanium.GlobalData.queryParam.measures.length > 1
									|| Datanium.GlobalData.queryParam.isSplit == true
									|| Datanium.GlobalData.queryParam.isSplit == 'true') {
								autoScaleBtn.enable();
							} else {
								autoScaleBtn.toggle(false);
								autoScaleBtn.disable();
							}
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
							Datanium.util.CommonUtils.checkEnableFilter();
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
									+ (Datanium.GlobalData.chartMode == '' ? 'columnchart'
											: Datanium.GlobalData.chartMode);
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
							var returnStr = str.trim().replace(/ |-|&|\(|\)|\,|\.|\'|\uFF08|\uFF09/g, '');
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
							if (key == 'year' || key == 'month' || key == 'yearmonth') {
								popSelStr = popSelection.join(",");
							} else {
								popSelStr = "'" + popSelection.join("','") + "'";
							}
							if (popSelStr.length > 0) {
								// console.log('Datanium.GlobalData.queryParam.filters.'
								// + key +
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
							Datanium.GlobalData.queryResult = null;
							Datanium.GlobalData.queryResult4Chart = null;
							Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel')
									.fireEvent('refreshElementPanel');
							Datanium.util.CommonUtils.refreshAll();
							Datanium.GlobalData.queryParam.primaryDimension = null;
							Datanium.util.CommonUtils.updateFilterFields();
							Datanium.util.CommonUtils.updateFields();
						},
						checkEnableFilter : function() {
							var dims = Datanium.GlobalData.qubeInfo.dimensions;
							if (dims != null && dims.length > 0) {
								Datanium.util.CommonUtils.reloadApplyFilterMenu(dims);
								Ext.getCmp('apply_filter_btn').enable();
							} else
								Ext.getCmp('apply_filter_btn').disable();
						},
						reloadApplyFilterMenu : function(dims) {
							console.log('reloadApplyFilterMenu');
							var appFilterBtn = Ext.getCmp('apply_filter_btn');
							if (dims != null && dims.length > 0) {
								appFilterBtn.menu.removeAll();
								Ext.Array.each(dims, function(dim) {
									var item = new Ext.menu.Item({
										iconCls : 'fa fa-bars',
										text : dim.text,
										handler : function() {
											Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent(
													'popFilter', dim.uniqueName, dim.text);
										}
									});
									appFilterBtn.menu.add(item);
								});
							}
						},
						checkTimeDim : function(dim) {
							if (dim == 'year' || dim == 'month' || dim == 'yearmonth')
								return true;
							else
								return false;
						},
						getChartModeStr : function() {
							if (Datanium.GlobalData.chartMode == 'columnchart') {
								return Datanium.GlobalStatic.label_column_chart;
							}
							if (Datanium.GlobalData.chartMode == 'stackchart') {
								return Datanium.GlobalStatic.label_stack_chart;
							}
							if (Datanium.GlobalData.chartMode == 'linechart') {
								return Datanium.GlobalStatic.label_line_chart;
							}
						},
						getChartModeStar : function(chartMode) {
							if (Datanium.GlobalData.chartMode == chartMode) {
								return 'fa fa-star-o';
							} else {
								return '';
							}
						},
						addFilter : function(filterName, filterValue) {
							var dimensions = Datanium.GlobalData.queryParam.dimensions;
							var isDimExist = false;
							Ext.Array.each(dimensions, function(item) {
								if (item.uniqueName == filterName) {
									isDimExist = true;
									return;
								}
							});
							if (!isDimExist) {
								var filterText = '';
								Ext.Array.each(Datanium.GlobalData.qubeInfo.dimensions, function(rec) {
									if (rec.uniqueName == filterName)
										filterText = rec.text;
								});
								var dim = {
									data_type : "dimension",
									display : true,
									displayOrder : 0,
									text : filterText,
									uniqueName : filterName
								};
								Datanium.GlobalData.queryParam.dimensions.push(dim);
							}

							if ('filters' in Datanium.GlobalData.queryParam === false) {
								Datanium.GlobalData.queryParam.filters = {};
							}
							if (filterName in Datanium.GlobalData.queryParam.filters === false) {
								eval('Datanium.GlobalData.queryParam.filters.' + filterName + '=[\'' + filterValue
										+ '\'];')
							} else {
								eval('Datanium.GlobalData.queryParam.filters.' + filterName + '.push(\'' + filterValue
										+ '\');')
							}
							Datanium.GlobalData.queryParam.primaryFilter = filterName;
							Datanium.GlobalData.queryParam.split = {
								dimensions : filterName,
								splitValue : eval('Datanium.GlobalData.queryParam.filters.' + filterName)
							};
							Datanium.GlobalData.queryParam.isSplit = true;
						},
						mergeObjects : function(obj1, obj2) {
							var obj3 = {};
							for ( var attrname in obj1) {
								obj3[attrname] = obj1[attrname];
							}
							for ( var attrname in obj2) {
								obj3[attrname] = obj2[attrname];
							}
							return obj3;
						},
						columnConvert : function(originKey) {
							if (Datanium.GlobalData.queryParam.columns == null)
								Datanium.GlobalData.queryParam.columns = [];
							if (Datanium.GlobalData.queryParam.columns.indexOf(originKey) < 0) {
								Datanium.GlobalData.queryParam.columns.push(originKey);
							} else {
								var index = Datanium.GlobalData.queryParam.columns.indexOf(originKey);
								Datanium.GlobalData.queryParam.columns.splice(index, 1);
							}
						},
						removeColumnConvert : function(column) {
							if (Datanium.GlobalData.queryParam.columns != null) {
								var index = Datanium.GlobalData.queryParam.columns.indexOf(column);
								if (index >= 0) {
									Datanium.GlobalData.queryParam.columns.splice(index, 1);
								}
							}
						},
						columnLock : function(uniqueName) {
							if (Datanium.GlobalData.queryParam.locking == null)
								Datanium.GlobalData.queryParam.locking = [];
							if (Datanium.GlobalData.queryParam.locking.indexOf(uniqueName) < 0) {
								Datanium.GlobalData.queryParam.locking.push(uniqueName);
							} else {
								var index = Datanium.GlobalData.queryParam.locking.indexOf(uniqueName);
								Datanium.GlobalData.queryParam.locking.splice(index, 1);
							}
						},
						objClone : function(obj) {
							var ret = new Object();
							for ( var p in obj) {
								ret[p] = obj[p];
							}
							return ret;
						},
						getDimenionKeys : function() {
							var dimKeys = [];
							if (Datanium.GlobalData.queryParam !== null
									&& Datanium.GlobalData.queryParam.dimensions !== null) {
								Datanium.GlobalData.queryParam.dimensions.forEach(function(dim) {
									dimKeys.push(dim.uniqueName);
								});
							}
							return dimKeys;
						}
					}
				});
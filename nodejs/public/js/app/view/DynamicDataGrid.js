var store_template = {
	extend : 'Ext.data.Store',
	autoLoad : true,
	pageSize : 25,
	proxy : {
		type : 'memory',
		enablePaging : false,
		reader : {
			type : 'json',
			root : 'result',
			totalProperty : 'total'
		}
	}
};

var fields = [];
var columns = [];
var groups = [];

function generateDynamicModel(field) {
	columns = columnFactory(fields);
	var dataFields = getResultHeader(columns);
	modelFactory('DynamicGridModel', dataFields);
	storeFactory('DynamicGridStore', store_template, 'DynamicGridModel', dataFields);
	DynamicGridStore.load();
	return DynamicGridStore;
}

function storeFactory(name, template, model, dataFields) {
	template.model = model;
	if (Datanium.GlobalData.queryResult != null) {
		var result = Datanium.GlobalData.queryResult;
		template.data = converData(result, dataFields);
	}
	// console.log(template);
	eval(name + " = Ext.create('Ext.data.Store'," + Ext.encode(template) + ");");
}

function modelFactory(name, fields) {
	var model = {
		extend : 'Ext.data.Model',
		fields : fields
	};
	eval("Ext.define('" + name + "'," + Ext.encode(model) + ");");
}

function columnFactory(fields) {
	var temp_columns = [];
	var dimColumns = Datanium.GlobalData.queryParam.columns;

	// add normal columns
	for ( var i = 0; i < fields.length; i++) {
		var validFlag = false;
		if (fields[i].data_type === 'dimension' && dimColumns != null) {
			validFlag = dimColumns.indexOf(fields[i].uniqueName) < 0;
		} else {
			if (dimColumns == null || dimColumns.length === 0) {
				validFlag = true;
			}
		}
		if (validFlag) {
			var column = {
				text : "<strong>" + fields[i].text + "</strong>",
				uniqueName : fields[i].uniqueName,
				originKey : fields[i].uniqueName,
				name : fields[i].text,
				sortable : true,
				dataIndex : fields[i].uniqueName,
				data_type : fields[i].data_type,
				displayOrder : fields[i].displayOrder,
				align : "auto"
			};
			columnCellStyle(column, fields[i]);

			temp_columns.push(column);
		}
	}

	// add column dimension
	temp_columns = addColumnDim(fields, dimColumns, temp_columns);

	temp_columns.sort(function(col1, col2) {
		return col1.displayOrder - col2.displayOrder;
	});
	var outputColumns = [];
	for ( var i = 0; i < temp_columns.length; i++) {
		outputColumns.push(temp_columns[i]);
	}
	return outputColumns;
}

var getDataColumns = function(fields) {
	var dataColumns = []
	fields.forEach(function(f) {
		if (f['data_type'] != 'dimension') {
			dataColumns.push(f);
		}
	});
	return dataColumns;
}

var addColumnDim = function(fields, dimColumns, temp_columns) {
	var outputResult = [];
	if (Datanium.GlobalData.queryResult !== null && dimColumns != null && dimColumns.length > 0) {
		var result = Datanium.GlobalData.queryResult.result;
		var dataColumns = getDataColumns(fields);
		var allColumnValues = [];
		dimColumns.forEach(function(col) {
			var columnValues = [];
			result.forEach(function(rec) {
				if (columnValues.indexOf(rec[col]) < 0) {
					columnValues.push(rec[col]);
				}
			});
			allColumnValues.push(columnValues);
		});
		dataColumns.forEach(function(dc) {
			var column = {
				text : "<strong>" + dc.text + "</strong>",
				uniqueName : dc.uniqueName,
				name : dc.text,
				displayOrder : dc.displayOrder,
				align : "auto",
				columns : []
			};
			column.columns = getSubColumns(dimColumns, allColumnValues, 0, dc);
			temp_columns.push(column);
		});
	}
	return temp_columns;
}

var getSubColumns = function(dimColumns, allColumnValues, idx, column) {
	var subColumns = [];
	if (allColumnValues === null || allColumnValues.length === idx) {
		return null;
	}
	allColumnValues[idx].forEach(function(value) {
		var subColumn = {
			text : "<strong>" + value + "</strong>",
			uniqueName : column.uniqueName + '/' + value,
			originKey : dimColumns[idx],
			name : value,
			sortable : true,
			dataIndex : column.uniqueName + '/' + value,
			data_type : column.data_type,
			displayOrder : column.displayOrder,
			align : "auto",
			columns : []
		};
		subColumn.columns = getSubColumns(dimColumns, allColumnValues, idx + 1, subColumn);
		subColumns.push(subColumn);
	});
	return subColumns;
}

var converData = function(data, dataFields) {
	if (data == null || data.result == null)
		return null;
	var dimColumns = Datanium.GlobalData.queryParam.columns;
	if (dimColumns == null)
		return data.result;
	var dimenionKeys = Datanium.util.CommonUtils.getDimenionKeys();
	var tempResult = [].concat(data.result);
	dimColumns.forEach(function(dim) {
		tempResult.forEach(function(rec, index) {
			if (dim in rec) {
				var newRec = {};
				for ( var propertyName in rec) {
					if (dimenionKeys.indexOf(propertyName) < 0) {
						newRec[propertyName + '/' + rec[dim]] = rec[propertyName];
					} else if (propertyName !== dim) {
						newRec[propertyName] = rec[propertyName];
					}
				}
				tempResult[index] = newRec;
			}
		});
	});
	var dimRows = []
	dimenionKeys.forEach(function(dim) {
		if (dimColumns.indexOf(dim) < 0) {
			dimRows.push(dim);
		}
	});
	var returnResult = mergeResult(dataFields, dimRows, tempResult);

	var returnData = {
		total : returnResult.length,
		result : returnResult
	};
	return returnData;
}

var mergeResult = function(dataFields, dimRows, tempResult) {
	var returnResult = [];
	var dimValueArray = [];
	tempResult.forEach(function(rec) {
		var dimValue = {};
		var dimExist = false;
		dimRows.forEach(function(d) {
			dimValue[d] = rec[d];
		});
		dimValueArray.every(function(dv) {
			if (JSON.stringify(dv) === JSON.stringify(dimValue)) {
				dimExist = true;
				return false;
			}
			return true;
		});
		if (dimExist) {
			returnResult.forEach(function(rr, idx) {
				if (JSON.stringify(rr).replace(/ |\{|\}/g, '')
						.indexOf(JSON.stringify(dimValue).replace(/ |\{|\}/g, '')) >= 0) {
					returnResult[idx] = Datanium.util.CommonUtils.mergeObjects(returnResult[idx], rec);
				}
			});
		} else {
			dimValueArray.push(dimValue);
			var obj = Datanium.util.CommonUtils.mergeObjects({}, rec);
			returnResult.push(obj);
		}
		// console.log('dimValue:' + dimValue);
		// console.log('dimExist:' + dimExist);
		// console.log('returnResult:' + returnResult);
	});
	return returnResult;
}

function columnCellStyle(column, field) {
	if ("width" in field) {
		column.width = field.width;
	} else {
		var labelLength = field.text.length;
		var columnWidth = columnWidthGen(labelLength);
		column.width = columnWidth;
	}

	var rendererVal = "";
	if (field.data_type == 'number') {
		column.tdCls = "x-grid-cell-inner-right";
		rendererVal = rendererVal + "value = Ext.util.Format.number(value, '0,000.####');";
	} else if (field.data_type == 'percentage') {
		column.tdCls = "x-grid-cell-inner-right";
		rendererVal = rendererVal + "value = Ext.util.Format.number(value, '00.##%');";
	} else {
		column.tdCls = "x-grid-cell-inner-left";
	}

	if ("link_location" in field) {
		if (field.link_location == "cell") {
			rendererVal = rendererVal + "value = '<a href=\"#" + field.link_target + "\">' + value + '</a>';";
		}
	}

	if (rendererVal.length > 0) {
		column.renderer = function(value, metadata) {
			eval(rendererVal);
			return value;
		};
	}
}

function columnWidthGen(labelLength) {
	var width = labelLength * 8;
	if (width % 100 > 50) {
		width = 100;
	}
	if (width > 200) {
		width = 200;
	}
	if (width < 100) {
		width = 100;
	}
	return width;
}

function getResultHeader(columns) {
	var headers = [];
	if (columns !== null) {
		columns.forEach(function(col) {
			if (col.columns == null || col.columns.length === 0) {
				headers.push(col.uniqueName);
			} else {
				headers = headers.concat(getResultHeader(col.columns));
			}
		});
	}
	return headers;
}

Ext.define('Datanium.view.DynamicDataGrid', {
	extend : 'Ext.grid.Panel',
	xtype : 'grouped-header-grid',
	alias : 'widget.dynamicdatagrid',
	initComponent : function() {
		Ext.apply(this, {
			columnLines : true,
			autoHeight : true,
			autoWidth : true,
			forceFit : false,
			border : false,
			viewConfig : {
				stripeRows : true
			}
		});
		fields = [];
		columns = [];
		groups = [];
		var fields_json = null;
		if (Datanium.GlobalData.enableQuery) {
			if (Datanium.GlobalData.queryParam != null) {
				fields_json = Datanium.GlobalData.queryParam;
			} else {
				fields = [];
				columns = [];
				groups = [];
			}
		}
		if (fields_json != null) {
			if ("dimensions" in fields_json) {
				for ( var i = 0; i < fields_json.dimensions.length; i++) {
					var f = fields_json.dimensions[i];
					f.field_type = 'row';
					if (f.display)
						fields.push(f);
				}
				for ( var i = 0; i < fields_json.measures.length; i++) {
					var f = fields_json.measures[i];
					f.field_type = 'column';
					if (f.display)
						fields.push(f);
				}
				// for ( var i = 0; i < fields_json.groups.length; i++) {
				// groups.push(fields_json.groups[i]);
				// }
			}
		}
		// console.log(fields);
		// console.log(fields_json);
		// console.log(results_json);
		var store = generateDynamicModel(fields);
		this.dockedItems = [ {
			xtype : 'pagingtoolbar',
			store : store,
			dock : 'bottom',
			displayInfo : true,
			listeners : {
				afterrender : function() {
					Ext.Array.each(this.items.items, function(item) {
						item.hide();
					});
					this.child('tbfill').show();
					this.child('#displayItem').show();
				}
			}
		} ];
		this.store = store;
		this.columns = columns;
		this.callParent();

		this.addEvents('refreshDatagrid');
		this.on('refreshDatagrid', function() {
			console.log('refreshDatagrid');
			if (Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid') != null) {
				Datanium.util.CommonUtils.destroyGrid();
				Datanium.util.CommonUtils.generateGrid();
			}
		});

	}
});

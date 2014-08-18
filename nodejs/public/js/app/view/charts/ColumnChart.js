var chart_store_template = Datanium.util.CommonUtils.getStoreTemplate();

function genColumnChartStore(template, fields) {
	template.fields = mergeFields(fields);
	if (Datanium.GlobalData.QueryResult4Chart != null) {
		var queryResult = JSON.parse(JSON.stringify(Datanium.GlobalData.QueryResult4Chart));
		if (Datanium.GlobalData.autoScale) {
			template.data = Datanium.util.CommonUtils.scaleMeasures(queryResult, yFields);
		} else {
			template.data = Datanium.GlobalData.QueryResult4Chart;
		}
	}
	eval("ColumnChartStore = Ext.create('Ext.data.Store'," + Ext.encode(template) + ");");
	ColumnChartStore.load();
	return ColumnChartStore;
}

function mergeFields(fields) {
	if (xFields.length > 1) {
		fields = [];
		fields.push(xFieldsLabel);
		fields.push.apply(fields, yFields);
	}
	return fields;
}

var fields = [];
var xFields = [];
var yFields = [];
var xFieldsLabel = "";

Ext.define('Datanium.view.charts.ColumnChart', {
	extend : 'Ext.chart.Chart',
	alias : 'widget.columnchart',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'fit',
			region : 'center',
			style : 'background:#fff',
			animate : true,
			insetPadding : 50,
			shadow : true,
			hidden : true,
			legend : {
				position : 'right',
				visible : Datanium.GlobalData.showLegend
			}
		});
		fields = [];
		xFields = [];
		yFields = [];
		yFieldsTxt = [];
		xFieldsLabel = "";
		var fields_json = null;
		if (Datanium.GlobalData.enableQuery) {
			if (Datanium.GlobalData.queryParam != null) {
				fields_json = Datanium.GlobalData.queryParam;
				if (Datanium.GlobalData.QueryResult4Chart != null) {
					this.hidden = false;
				}
			}
		}
		if (fields_json != null) {
			if ("dimensions" in fields_json) {
				for ( var i = 0; i < fields_json.dimensions.length; i++) {
					var f = fields_json.dimensions[i];
					f.field_type = 'xField';
					if (f.display && f.uniqueName == Datanium.GlobalData.queryParam.primaryDimension) {
						fields.push(f.uniqueName);
						xFields.push(f.uniqueName);
						if (xFieldsLabel.length > 0) {
							xFieldsLabel = xFieldsLabel + "/" + f.uniqueName;
						} else {
							xFieldsLabel = f.uniqueName;
						}
					}
				}
				for ( var i = 0; i < fields_json.measures.length; i++) {
					if (fields_json.isSplit && fields_json.isSplit !== 'false') {
						var splitMeasures = Datanium.util.CommonUtils.getSplitMeasures(fields_json.measures[i],
								fields_json.split.splitValue);
						for ( var j = 0; j < splitMeasures.length; j++) {
							var f = splitMeasures[j];
							f.field_type = 'yField';
							if (f.display) {
								fields.push(f.uniqueName);
								yFields.push(f.uniqueName);
								yFieldsTxt.push(f.text);
							}
						}
					} else {
						var f = fields_json.measures[i];
						f.field_type = 'yField';
						if (f.display) {
							fields.push(f.uniqueName);
							yFields.push(f.uniqueName);
							yFieldsTxt.push(f.text);
						}
					}
				}
			}
		}
		var store = genColumnChartStore(chart_store_template, fields);
		this.store = store;
		// console.log(fields);
		// console.log(xFields);
		// console.log(xFieldsLabel);
		// console.log(yFields);
		// console.log(fields_json);
		// console.log(results_json);
		var yLabel = function() {
			return ''
		};
		if (!Datanium.GlobalData.autoScale) {
			yLabel = Ext.util.Format.numberRenderer('0,0.###');
		}
		this.axes = [ {
			type : 'Numeric',
			position : 'left',
			fields : yFields,
			label : {
				renderer : yLabel
			},
			grid : true,
			minimum : 0
		}, {
			type : 'Category',
			position : 'bottom',
			fields : xFieldsLabel,
			label : {
				rotate : {
					degrees : 330
				}
			}
		} ];
		var s = [ {
			type : 'column',
			axis : 'left',
			highlight : true,
			/*
			 * label : { display : 'insideEnd', 'text-anchor' : 'middle', field : [
			 * 'China', 'US' ], renderer : Ext.util.Format.numberRenderer('0'),
			 * orientation : 'horizontal', color : '#fff' },
			 */
			xField : xFieldsLabel,
			yField : yFields,
			title : yFieldsTxt
		} ]
		if (!Datanium.GlobalData.autoScale) {
			s.tips = {
				style : 'background:#fff; text-align: center;',
				trackMouse : true,
				width : 140,
				height : 28,
				renderer : function(storeItem, item) {
					this.setTitle(storeItem.get(item.yField) + '');
					this.width = this.title.length * 10;
				}
			};
		}
		this.series = s;
		this.callParent();
	}
});

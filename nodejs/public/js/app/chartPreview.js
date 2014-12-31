Ext.require('Ext.chart.*');
Ext.require([ 'Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite', 'Ext.window.MessageBox' ]);

var reports = [];

Ext.onReady(function() {
	var thumbDivWidth = $('div.thumbnail:first').width();
	var thumbDivHeight = thumbDivWidth * 0.657;

	reports.forEach(function(rptid) {
		var queryUrl = '/c/' + rptid;
		var requestConfig = {
			disableCaching : false,
			url : queryUrl,
			timeout : 300000,
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText, true);
				var queryParam = result.queryParam;
				var queryResult4Chart = result.chart;
				var chartMode = result.chartMode;
				var autoScale = result.autoScale;
				// console.log('Query execution time: ' + result.execute_time +
				// ' ms.')

				var chart_store_template = Datanium.util.CommonUtils.getStoreTemplate();

				function genColumnChartStore(template, fields) {
					template.fields = mergeFields(fields);
					if (queryResult4Chart != null) {
						var queryResult = JSON.parse(JSON.stringify(queryResult4Chart));
						if (autoScale) {
							template.data = Datanium.util.CommonUtils.scaleMeasures(queryResult, yFields);
						} else {
							template.data = queryResult4Chart;
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

				function generateSeries() {
					var series = [];
					if (chartMode == 'columnchart' || chartMode == 'stackchart') {
						series = [ {
							type : 'column',
							axis : 'left',
							xField : xFieldsLabel,
							yField : yFields,
							stacked : chartMode == 'stackchart'
						} ]
					} else if (chartMode == 'linechart') {
						Ext.Array.each(yFields, function(yfld, index) {
							var s = {
								type : 'line',
								axis : false,
								highlight : true,
								smooth : true,
								showMarkers : false,
								fill : true,
								xField : xFieldsLabel,
								yField : yfld
							};
							series.push(s);
						});
					}
					return series;
				}

				fields = [];
				xFields = [];
				yFields = [];
				yFieldsTxt = [];
				xFieldsLabel = "";

				if (queryParam != null) {
					if ("dimensions" in queryParam) {
						for ( var i = 0; i < queryParam.dimensions.length; i++) {
							var f = queryParam.dimensions[i];
							f.field_type = 'xField';
							if (f.display && f.uniqueName == queryParam.primaryDimension) {
								fields.push(f.uniqueName);
								xFields.push(f.uniqueName);
								if (xFieldsLabel.length > 0) {
									xFieldsLabel = xFieldsLabel + "/" + f.uniqueName;
								} else {
									xFieldsLabel = f.uniqueName;
								}
							}
						}
						for ( var i = 0; i < queryParam.measures.length; i++) {
							if (queryParam.isSplit && queryParam.isSplit !== 'false') {
								var splitMeasures = Datanium.util.CommonUtils.getSplitMeasures(queryParam.measures[i],
										queryParam.split.splitValue);
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
								var f = queryParam.measures[i];
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

				var yLabel = function() {
					return ''
				};
				if (!autoScale) {
					yLabel = function(v) {
						if (v > 1000000000)
							return String(v / 1000000000) + ' B';
						if (v > 1000000)
							return String(v / 1000000) + ' M';
						if (v > 1000)
							return String(v / 1000) + ' K';
						return Ext.util.Format.number(v, '0,0.###');
					};
				}

				var chart = Ext.create('Ext.chart.Chart', {
					style : 'background:#fff',
					animate : true,
					shadow : true,
					store : genColumnChartStore(chart_store_template, fields),
					legend : {
						visible : false
					},
					axes : [ {
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
							renderer : function(v) {
								return '';
							}
						}
					} ],
					series : generateSeries(yFields, xFieldsLabel)
				});

				Ext.create('Ext.panel.Panel', {
					width : thumbDivWidth,
					height : thumbDivHeight,
					items : chart,
					layout : 'fit',
					renderTo : Ext.get('rptThumbnail_' + rptid)
				});
			},
			failure : function() {
				console.log('Load chart error: ' + rptid);
			}
		};
		Ext.Ajax.request(requestConfig);
	});
});
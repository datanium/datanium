Ext.define('Datanium.view.analysis.DemoAnalysis', {
	extend : 'Ext.form.Panel',
	alias : 'widget.demo-analysis',
	initComponent : function() {
		Ext.apply(this, {
			region : 'center',
			style : 'background:#fff',
			title : 'Analysis Mode',
			header : false,
			overflowY : 'scroll',
			defaults : {
				margin : '5 25 10 10'
			}
		});
		this.items = [ {
			xtype : 'fieldset',
			title : 'Basic Analysis',
			defaultType : 'panel',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			// basic
			items : [ {
				xtype : 'gridpanel',
				margin : '6 5 14 5',
				store : 'DemoAnalysisStats',
				columns : [ {
					text : 'Indicator',
					sortable : true,
					dataIndex : 'indicator'
				}, {
					text : 'Year',
					sortable : true,
					dataIndex : 'year'
				}, {
					text : 'Min',
					sortable : true,
					dataIndex : 'min'
				}, {
					text : 'Max',
					sortable : true,
					dataIndex : 'max'
				}, {
					text : 'Mean',
					sortable : true,
					dataIndex : 'mean'
				}, {
					text : 'Median',
					sortable : true,
					dataIndex : 'median'
				}, {
					text : 'STD',
					sortable : true,
					dataIndex : 'std'
				} ]
			}, {
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisBoxes',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'indicator' ]
					} ],
					series : [ {
						type : 'column',
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'indicator',
						yField : 'data',
						title : 'boxplot'
					} ]
				} ]
			} ]
		},
		// time series
		{
			xtype : 'fieldset',
			title : 'Time Series Analysis',
			defaultType : 'panel',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			items : [ {
				xtype : 'splitbutton',
				cls : 'analysisIndicatorBtn',
				margin : '6 5 14 5',
				scale : 'medium',
				text : 'Sample Indicator A',
				handler : function() {
					this.showMenu();
				},
				menu : [ {
					iconCls : 'fa fa-star-o',
					text : 'Sample Indicator A',
					handler : function() {
					}
				}, {
					text : 'Sample Indicator B',
					handler : function() {
					}
				}, {
					text : 'Sample Indicator C',
					handler : function() {
					}
				} ]
			},
			// observed
			{
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisTimes',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						title : 'Observed',
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data',
						title : 'Sample Inidator A'
					} ]
				} ]
			},
			// trend
			{
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisTimesT',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						title : 'Trend',
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data',
						title : 'Sample Inidator A'
					} ]
				} ]
			},
			// seasonal
			{
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisTimesS',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						title : 'Seasonal',
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data',
						title : 'Sample Inidator A'
					} ]
				} ]
			},
			// random
			{
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisTimesR',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						title : 'Random',
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data',
						title : 'Sample Inidator A'
					} ]
				} ]
			},
			// forecast
			{
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisTimesF',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data' ],
						title : 'Forecast',
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data',
						title : 'Sample Inidator A'
					} ]
				} ]
			} ]
		},
		// correlation
		{
			xtype : 'fieldset',
			title : 'Correlation Analysis',
			defaultType : 'panel',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			items : [ {
				xtype : 'splitbutton',
				cls : 'analysisIndicatorBtn',
				margin : '6 5 14 5',
				scale : 'medium',
				text : 'Sample Indicator A',
				handler : function() {
					this.showMenu();
				},
				menu : [ {
					iconCls : 'fa fa-star-o',
					text : 'Sample Indicator A',
					handler : function() {
					}
				}, {
					text : 'Sample Indicator C',
					handler : function() {
					}
				} ]
			}, {
				xtype : 'splitbutton',
				cls : 'analysisIndicatorBtn',
				margin : '6 5 14 5',
				scale : 'medium',
				text : 'Sample Indicator B',
				handler : function() {
					this.showMenu();
				},
				menu : [ {
					iconCls : 'fa fa-star-o',
					text : 'Sample Indicator B',
					handler : function() {
					}
				}, {
					text : 'Sample Indicator C',
					handler : function() {
					}
				} ]
			}, {
				layout : 'border',
				border : false,
				height : 220,
				items : [ {
					xtype : 'chart',
					layout : 'fit',
					style : 'background:#fff',
					animate : true,
					insetPadding : 20,
					shadow : true,
					legend : {
						position : 'right'
					},
					store : 'DemoAnalysisCors',
					axes : [ {
						type : 'Numeric',
						position : 'left',
						fields : [ 'data1', 'data2' ],
						grid : true
					}, {
						type : 'Category',
						position : 'bottom',
						fields : [ 'year' ]
					} ],
					series : [ {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data1',
						title : 'Sample Inidator A'
					}, {
						type : 'line',
						smooth : true,
						highlight : {
							size : 3,
							radius : 3
						},
						axis : 'left',
						xField : 'year',
						yField : 'data2',
						title : 'Sample Inidator B'
					} ]
				} ]
			}, {
				xtype : 'gridpanel',
				margin : '6 5 14 5',
				store : 'DemoAnalysisCovs',
				columns : [ {
					text : 'Time Offsets',
					sortable : true,
					dataIndex : 'time_offsets'
				}, {
					text : 'X Expected Value',
					sortable : true,
					dataIndex : 'ux'
				}, {
					text : 'Y Expected Value',
					sortable : true,
					dataIndex : 'uy'
				}, {
					text : 'X STD',
					sortable : true,
					dataIndex : 'qx'
				}, {
					text : 'Y STD',
					sortable : true,
					dataIndex : 'qy'
				}, {
					text : 'Covariance',
					sortable : true,
					dataIndex : 'cov'
				}, {
					text : 'Correlation Coeffient',
					sortable : true,
					dataIndex : 'corr'
				} ]
			} ]
		} ];
		this.callParent();
	},

// buttons : [ {
// text : 'Execute'
// } ]
});

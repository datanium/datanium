Ext.define('Datanium.controller.GridController', {
	extend : 'Ext.app.Controller',
	views : [ 'GridView', 'DynamicDataGrid' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'dimensionTree' : {
				treeValueChange : this.onTreeChange
			},
			'measureTree' : {
				treeValueChange : this.onTreeChange
			},
			'datagridview' : {
				afterrender : this.onGridPanelReady,
				beforeshow : this.onGridPanelShow
			}
		});
	},
	generateRpt : function(manualRun) {
		if (Datanium.GlobalData.autoRun || (manualRun != null && manualRun)) {
			var dataViewBox = Datanium.util.CommonUtils.getCmpInActiveTab('datapanel');
			var mask = new Ext.LoadMask(dataViewBox, {
				msg : Datanium.GlobalStatic.label_loading
			});
			Datanium.GlobalData.QueryResult = null;
			if (this.isQueryValid()) {
				var queryUrl = '/data/result';
				if (Datanium.GlobalData.queryParam.isSplit && Datanium.GlobalData.queryParam.isSplit !== 'false') {
					queryUrl = '/data/split';
				}
				var queryParam = Datanium.GlobalData.queryParam;
				var requestConfig = {
					url : queryUrl,
					jsonData : queryParam,
					timeout : 300000,
					success : function(response) {
						mask.destroy();
						var result = Ext.JSON.decode(response.responseText, true);
						Datanium.GlobalData.QueryResult = result.grid;
						Datanium.GlobalData.QueryResult4Chart = result.chart;
						Datanium.util.CommonUtils.refreshAll();
						console.log('Query execution time: ' + result.execute_time + ' ms.')
					},
					failure : function() {
						mask.destroy();
					}
				};
				Ext.Ajax.request(requestConfig);
				mask.show();
			} else {
				this.cleanRpt();
			}
		}
		Datanium.util.CommonUtils.checkEnableFilter();
	},
	cleanRpt : function() {
		Datanium.util.CommonUtils.refreshAll();
	},
	isQueryValid : function() {
		var queryParam = Datanium.GlobalData.queryParam;
		if (!queryParam) {
			Datanium.GlobalData.enableQuery = false;
			return false;
		}
		if (this.checkCount(queryParam.dimensions) > 0 && this.checkCount(queryParam.measures) > 0) {
			Datanium.GlobalData.enableQuery = true;
			return true;
		}
		Datanium.GlobalData.enableQuery = false;
		return false;
	},
	checkCount : function(fields) {
		var count = 0;
		if (fields == null)
			return count;
		Ext.Array.forEach(fields, function(field) {
			count += 1;
		});
		return count;
	},
	onTreeChange : function(me) {
		console.log('onTreeChange');
		this.generateRpt();
	},
	onGridPanelReady : function(me) {
		console.log('onGridPanelReady');
		Datanium.util.CommonUtils.generateGrid();
	},
	onGridPanelShow : function() {
		console.log('onGridPanelShow');
	}
});
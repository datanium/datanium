Ext.define('Datanium.controller.GridController', {
	extend : 'Ext.app.Controller',
	views : [ 'GridView', 'DynamicDataGrid' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'dimensionTree' : {
				selectionchange : this.onTreeChange
			},
			'measureTree' : {
				selectionchange : this.onTreeChange
			},
			'datagridview' : {
				afterrender : this.onGridPanelReady
			}
		});
	},
	generateRpt : function(manualRun) {
		var dataViewBox = Datanium.util.CommonUtils.getCmpInActiveTab('datapanel');
		var mask = new Ext.LoadMask(dataViewBox, {
			msg : "Loading..."
		});
		console.log(1);
		if (this.isQueryValid()) {
			console.log(2);
			var queryParam = Datanium.GlobalData.queryParam;
			queryParam.cubeName = Datanium.util.CommonUtils.getCmpInActiveTab('cubecombo').getValue();
			console.log(queryParam);
			var requestConfig = {
				url : 'ajax/query.json',
				jsonData : queryParam,
				timeout : 300000,
				success : function(response) {
					mask.destroy();
					var result = Ext.JSON.decode(response.responseText, true);
					Datanium.GlobalData.QueryResult = result;
					Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid').fireEvent('refreshDatagrid');
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
	},
	setQueryParam : function() {
		
	},
	cleanRpt : function() {
		Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid').fireEvent('refreshDatagrid');
	},
	isQueryValid : function() {
		var queryParam = Datanium.GlobalData.queryParam;
		if (!queryParam)
			return false;
		if (this.checkCount(queryParam.dimensions) > 0 && this.checkCount(queryParam.measures) > 0) {
			Datanium.GlobalData.enableQuery = true;
			return true;
		}
		Datanium.GlobalData.enableQuery = false;
		return false;
	},
	checkCount : function(fields) {
		var count = 0;
		Ext.Array.forEach(fields, function(field) {
			count += 1;
		});
		return count;
	},
	onTreeChange : function(me) {
		console.log('onTreeChange');
		this.setQueryParam();
		this.generateRpt();
	},
	onGridPanelReady : function() {
		console.log('onGridPanelReady');
		var datagrid = Ext.create('widget.dynamicdatagrid', {
			itemId : Datanium.util.CommonUtils.genItemId('dynamicdatagrid'),
			region : 'center',
			floatable : false,
			collapsible : false,
			header : false
		});
		Datanium.util.CommonUtils.getCmpInActiveTab('datagridview').insert(datagrid);
	}
});
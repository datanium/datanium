var store_template = {
	extend : 'Ext.data.Store',
	autoLoad : true,
	pageSize : 25,
	proxy : {
		type : 'memory',
		enablePaging : true,
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

function destoryGrid(cmpId, parent) {
	if (parent != null) {
		parent.down('dynamicdatagrid').destroy();
	} else {
		console.log(Datanium.util.CommonUtils.getCmpInActiveTab(cmpId));
		Datanium.util.CommonUtils.getCmpInActiveTab(cmpId).destroy();
	}
	fields = [];
	columns = [];
	groups = [];
}

function generateDynamicModel(fields_json, results_json) {
	modelFactory('DynamicGridModel', []);
	storeFactory('DynamicGridStore', store_template, 'DynamicGridModel');
	DynamicGridStore.load();
	return DynamicGridStore;
}

function storeFactory(name, template, model) {
	template.model = model;
	eval(name + " = Ext.create('Ext.data.Store'," + Ext.encode(template) + ");");
}

function modelFactory(name, fields) {
	var model = {
		extend : 'Ext.data.Model',
		fields : fields
	};
	eval("Ext.define('" + name + "'," + Ext.encode(model) + ");");
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
			title : 'Result',
			viewConfig : {
				stripeRows : true
			}
		});
		fields = [];
		columns = [];
		groups = [];
		var fields_json = null;
		var results_json = null;
		if (Datanium.GlobalData.enableQuery) {
			if (Datanium.GlobalData.queryParam != null) {
				fields_json = Datanium.GlobalData.queryParam;
				if (Datanium.GlobalData.QueryResult != null) {
					results_json = Datanium.GlobalData.QueryResult.queryOutput;
				}
			} else {
				fields = [];
				columns = [];
				groups = [];
			}
		}
		if (fields_json != null) {
			if ("rows" in fields_json) {
				for ( var i = 0; i < fields_json.rows.length; i++) {
					var f = fields_json.rows[i];
					f.field_type = 'row';
					if (f.display)
						fields.push(f);
				}
				for ( var i = 0; i < fields_json.columns.length; i++) {
					var f = fields_json.columns[i];
					f.field_type = 'column';
					if (f.display)
						fields.push(f);
				}
				for ( var i = 0; i < fields_json.groups.length; i++) {
					groups.push(fields_json.groups[i]);
				}
			}
		}
		console.log(fields);
		console.log(fields_json);
		console.log(results_json);
		var store = generateDynamicModel(fields, results_json);
		this.dockedItems = [ {
			xtype : 'pagingtoolbar',
			store : store,
			dock : 'bottom',
			displayInfo : true,
			refreshText : false
		} ];
		this.store = store;
		this.columns = columns;
		console.log(this.store);
		console.log(this.columns);
		this.callParent();
		this.addEvents('refreshDatagrid');
		this.on('refreshDatagrid',
				function() {
					if (Datanium.util.CommonUtils.getCmpInActiveTab('dynamicdatagrid') != null) {
						var activeItemId = Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout()
								.getActiveItem().id;
						Datanium.util.CommonUtils.getCmpInActiveTab('datagridview').insert(0,
								Ext.create('Datanium.view.DynamicDataGrid', {
									xtype : 'dynamicdatagrid',
									itemId : Datanium.util.CommonUtils.genItemId('dynamicdatagrid'),
									region : 'center',
									floatable : false,
									collapsible : false,
									header : false
								}).show());
					}
				});
	}
});

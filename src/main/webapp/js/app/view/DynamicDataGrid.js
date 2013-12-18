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
		// console.log(this.store);
		// console.log(this.columns);
		this.callParent();
		this.addEvents('refreshDatagrid');
		this.on('refreshDatagrid', function() {

		});

	}
});

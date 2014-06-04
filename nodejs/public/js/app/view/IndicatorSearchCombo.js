Ext.define('Datanium.view.IndicatorSearchCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.searchcombo',
	displayField : 'text',
	valueField : 'uniqueName',
	queryMode : 'remote',
	minChars : 1,
	hideTrigger : true,
	lastQuery : '',
	store : 'Indicators',
	typeAhead : true,
	forceFit : true,
	selectOnFocus : true,
	forceSelection : false,
	allowBlank : true,
	emptyText : 'Eg. GDP, Consumer Price, Interest Rate.',
	height : 22,
	margin : '5 5',
	listeners : {
		afterrender : function() {
			this.focus();
		}
	}
});
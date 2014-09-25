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
	forceFit : true,
	selectOnFocus : true,
	forceSelection : false,
	allowBlank : true,
	emptyText : 'Quick search for indicators. Eg. GDP, Consumer Price, Interest Rate.',
	autoSelect : false,
	typeAhead : false,
	height : 26,
	margin : '1 0 5 5',
	fieldLabel : ' ',
	labelSeparator : '',
	labelCls : 'fa fa-search fa-2x',
	labelClsExtra : 'searchboxLabel',
	labelWidth : 24,
	listeners : {
		afterrender : function() {
			this.focus();
		}
	}
});
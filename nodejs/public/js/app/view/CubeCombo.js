/* deprecated */
Ext.define('Datanium.view.CubeCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.cubecombo',
	displayField : 'caption',
	valueField : 'uniqueName',
	queryMode : 'local',
	triggerAction : 'all',
	lastQuery : '',
	store : 'CubeNames',
	typeAhead : true,
	forceFit : true,
	selectOnFocus : true,
	forceSelection : false,
	allowBlank : true,
	emptyText : 'Select Your Cube',
	height : 22,
	margin : '5 5'
});
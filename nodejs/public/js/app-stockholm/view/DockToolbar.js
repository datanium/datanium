Ext
		.define(
				'Stockholm.view.DockToolbar',
				{
					extend : 'Ext.toolbar.Toolbar',
					xtype : 'basic-buttons',
					cls : 'button-view',
					alias : 'widget.dock-toolbar',
					shadow : 'drop',
					shadowOffset : 10,
					items : [
							{
								xtype : 'label',
								text : '当日推荐',
								margin : '5 12 0 12'
							},
							{
								xtype : 'tbseparator',
								height : 16,
								margins : '0 0 0 1'
							},
							{
								id : 'dateSelect',
								xtype : 'combobox',
								margin : '5 12 0 12',
								width : 100,
								store : 'JobDates',
								queryMode : 'remote',
								displayField : 'date_str',
								valueField : 'date_str',
								listeners : {
									'select' : function(me) {
										var key = me.getValue();
										var grid = Ext.getCmp('stockGrid');
										grid.store.load({
											params : {
												targetDate : key
											},
											callback : function(records, operation, success) {
												// do something after the load
												// finishes
											},
											scope : this
										});
									}
								}
							},
							{
								xtype : 'tbseparator',
								height : 16,
								margins : '0 0 0 1'
							},
							{
								id : 'prevBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-chevron-left"></i>',
								action : 'prev-day'
							},
							{
								id : 'nextBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-chevron-right"></i>',
								action : 'next-day'
							},
							{
								xtype : 'tbseparator',
								height : 16,
								margins : '0 0 0 1'
							},
							{
								id : 'runTestBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-play-circle-o"></i> 执行回测',
								action : 'run-test'
							},
							{
								id : 'showMethodBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-folder-o"></i> 选股方法',
								action : 'show-method'
							},
							{
								xtype : 'tbseparator',
								height : 16,
								margins : '0 0 0 1'
							},
							{
								id : 'basicStBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-search"></i> 显示基本指标',
								enableToggle : true,
								pressed : true,
								action : 'show-basic-st'
							},
							{
								id : 'advStBtn',
								scale : 'medium',
								tooltipType : 'title',
								html : '<i class="fa fa-search"></i> 显示详细指标',
								enableToggle : true,
								pressed : false,
								action : 'show-adv-st'
							},
							/*
							 * { scale : 'medium', tooltipType : 'title', html : '<i
							 * class="fa fa-search"></i> 显示收益回测', enableToggle :
							 * true, pressed : true, action : 'show-back-test' },
							 */
							{
								xtype : 'tbseparator',
								height : 16,
								margins : '0 0 0 1'
							},
							{
								xtype : 'label',
								html : '<a href="https://github.com/benitoro/stockholm" target="_blank" style="text-decoration: none">Powered by Stockholm</a>',
								margin : '5 12 0 12'
							} ]
				});
/*
	Atlas Project in Multimedia Cartography
	Institute of Cartography and Geoinformation
	ETH Zurich
	Author: Hansruedi Bär baer@karto.baug.ethz.ch
	Versions
	2013-2-4: Added comments
*/

/*
	Load additional classes including direct dependencies.
*/
Ext.require([
	'Ext.util.CSS'
]);

/*
	This method is called after DOM construction and class loading
*/
Ext.onReady(function() {
	console.info('Atlas Project in Multimedia Cartography')
	console.info(new Date());
});

/*
	This section represents the Atlas application.
*/
Ext.application({
	name: 'Atlas Project in Multimedia Cartography',

	// The launch function is called after the page is loaded. Describes the appearance and behaviour of the atlas user interface.
	launch: function() {

		// This function is used for loading maps
		function sendMessage(msg) {
			var iframe = Ext.get('map').dom;

			function loadMap() {
				if (params.data) {
					var win = iframe.contentWindow;
					win.postMessage({ method: 'loadMap', params: params }, '*');
				}
			}

			switch (msg.method) {
				case 'loadMap':
				var params = content[msg.id];
				if (iframe['data-ref'] != params.src) {
					// Loads a new map into the iframe
					iframe['data-ref'] = params.src;
					iframe.src = params.src;
					iframe.onload = function(evt) {
						loadMap();
					}
				}
				else {
					// Reuses the map but loads with new parameters.
					loadMap();
				}
				break;
				case 'buttonClick': 
				
				
				//alert('clicked');
				
				var win = iframe.contentWindow;
				win.postMessage({ id: msg.id, pressed: msg.pressed }, '*');
				
				
				
				break;
			}
		}

		// Displays a document in a child window.
		function createChildWindow(parentId, title, src) {
			var parent = Ext.get(parentId);
			var inset = 50;
			Ext.create('Ext.window.Window', {
				title: title,
				x: parent.getLeft() + inset,
				y: parent.getTop() + inset,
				height: parent.getHeight() - 2 * inset,
				width: parent.getWidth() - 2 * inset,
				layout: 'fit',
				items: {
					xtype : 'component',
					autoEl: {
						style: { backgroundColor: '#fff' },
						tag: 'iframe',
						src: src,
						border: false
					}
				},
			}).show();
		}

		// Displays a document in a browser window.
		function createBrowserWindow(parentId, title, src) {
			var parent = Ext.get(parentId);
			var inset = 100;
			var left =  window.screenX + inset;
			var top = window.screenY + inset;
			var height = window.outerHeight - 2 * inset;
			var width = window.outerWidth - 2 * inset;
			var options = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=true';
			var browserWindow = window.open(src, title, options);
			browserWindow.focus();
		}

		window.addEventListener('message', function (evt) {
			var data = evt.data;
			var method = data.method;
			switch (method) {
				case 'loadMap':
				break;
				case 'mapInfo':
					var panel = Ext.get('map-info').dom;
					console.log('map-info', panel);
				break;
			}
	    });

		var currentMapId;

		// Atlas contents: lists all map ids, resources and parameters, if any.
		// Every map of the atlas needs an entry.
		var content = {
			osm_processed: { src: '../Maps/maps/mashups/osm/osm-imageprocessed.html' },
			osm_restricted: { src: '../Maps/maps/mashups/osm/osm-restricted.html' },
			//mapquest: { src: '../Maps/maps/mashups/osm/mapquest.html' },// It is not done yet
			google: { src: '../Maps/maps/mashups/googlemaps/googlemap.html' },
			bing: { src: '../Maps/maps/mashups/bing/bingmaps.html' },
			interaction: { src: '../Maps/maps/vector-maps/interaction.html' },
			projection: { src: '../Maps/maps/vector-maps/projection.html' },
			foreigners: {
				src: '../Maps/maps/vector-maps/statistics.html',
				data: './bfs/px-d-40-3B01.px',
				extract: [[0, '*', 2, 0, 0], [0, '*', 0, 0, 0]],
				calculate: ['v', 'return 100 * parseInt(v[0]) / parseInt(v[1]);'],
				layerNum: 1,
				breakValues: [5, 10, 15, 20, 25, 30],
				colorBrewer: ['sequential', 'RdPu', 7]
			},
			male_female: {
				src: '../Maps/maps/vector-maps/statistics.html',
				data: './bfs/px-d-40-3B01.px',
				extract: [[0, '*', 0, 1, 0], [0, '*', 0, 2, 0]],
				calculate: ['v', 'return 100 * parseInt(v[1]) / (parseInt(v[0]) + parseInt(v[1]));'],
				layerNum: 1,
				breakValues: [45, 47.5, 50, 52.5, 55],
				colorBrewer: ['diverging', 'RdYlGn', 6]
			},
			mmkarto2012: { src: '../Maps/maps/mmkarto2012/exercise9/index.svg' },
			wms_ch: { src: '../Maps/maps/wms/ch_wms.html' },
			wms_world: { src: '../Maps/maps/wms/world_wms.html' },
			wms_greece: { src: '../Maps/maps/Corfu/greece_wms.html' },
			ge_activity_rate: { src: '../Maps/maps/google-earth/Erwerb.html' },
			ge_cantons: { src: '../Maps/maps/google-earth/Kantone.html' },
			ge_gas_network: { src: '../Maps/maps/google-earth/Gasnetz.html' },
			airports: { src: '../Maps/maps/d3/USFlights.html' },
			culture_map: { src: '../Maps/maps/Bern/Bern_mapquest.html' },
			saas_fee: { src: '../Maps/maps/saastal/SaasFee_V3.html' },
			europe_map: { src: '../Maps/maps/europe/europe.html' },
			europe_map_bm: { src: '../Maps/maps/europe/europe_bm.html' },
			europe_map_pl: { src: '../Maps/maps/europe/europe_pl.html' },
			europe_map_wsd: { src: '../Maps/maps/europe/europe_wsd.html' },
		}
		
		
		// to determine window width   
		// source: http://de.selfhtml.org/javascript/beispiele/fensterueberwachen.htm
		function Fensterweite () {
			if (window.innerWidth) {
				return window.innerWidth;
			} else if (document.body && document.body.offsetWidth) {
				return document.body.offsetWidth;
			} else {
				return 0;
			}
		}
		
		function neuAufbau () {
			if (Weite != Fensterweite() )
				location.href = location.href;
		}
		
		
		/* Überwachung von Netscape initialisieren */
		if (!window.Weite && window.innerWidth) {
			window.onresize = neuAufbau;
			Weite = Fensterweite();
		}
		
		
		// end of window width part
		
		
		

		// The viewport is the container for all interface elements.
		Ext.create('Ext.container.Viewport', {
			/* A border layout divides the viewport in 5 part: center, north, west, east, and south. */
			layout: 'border',
			items: [{
				// A toolbar is placed at the top.
				region: 'north',
				html: '<h2 class="x-pamel-header">Touristic Atlas of Europe</h2>',
				xtype: 'toolbar',
				height: 60,
				// Toolbar menus follow here.
				items: [{ xtype: 'tbfill' },
						{
					// First menu is about this atlas project.
					id: 'Europe',
					text: 'Europe Maps',
					xtype: 'splitbutton',
					width: (400+window.innerWidth*0.10)/4,
					// Menu entries follow here.
					menu: new Ext.menu.Menu({
						items: [
									// Imprint is the first menu entry.
									{
									text: 'Price Level Map',
									// width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									sendMessage({method: 'loadMap', id: 'europe_map_pl'});
									Ext.getCmp('panel_down').setDisabled(true);
									Ext.getCmp('tab_cultural').setDisabled(true);
									Ext.getCmp('tab_summer').setDisabled(true);
									Ext.getCmp('tab_winter').setDisabled(true);
									Ext.getCmp('bbar_all').setDisabled(true);
									Ext.getCmp('bbar_none').setDisabled(true);
									}
									}
									},
									{
									text: 'Big-Mac Index Map',
									// width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									sendMessage({method: 'loadMap', id: 'europe_map_bm'});
									Ext.getCmp('panel_down').setDisabled(true);
									Ext.getCmp('tab_cultural').setDisabled(true);
									Ext.getCmp('tab_summer').setDisabled(true);
									Ext.getCmp('tab_winter').setDisabled(true);
									Ext.getCmp('bbar_all').setDisabled(true);
									Ext.getCmp('bbar_none').setDisabled(true);}
									}
									},
									{
									text: 'Winter/Summer Destinations',
									// width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									Ext.getCmp('panel_down').setDisabled(true);
									Ext.getCmp('tab_cultural').setDisabled(true);
									Ext.getCmp('tab_summer').setDisabled(true);
									Ext.getCmp('tab_winter').setDisabled(true);
									Ext.getCmp('bbar_all').setDisabled(true);
									Ext.getCmp('bbar_none').setDisabled(true);
									sendMessage({method: 'loadMap', id: 'europe_map'});
									document.getElementById("info_low-body").innerHTML='<h2 style="margin:10px">Welcome to Europe</h2> Enjoy your selections and Point informations on this map and have a nice Day';		
									}
									}
									}
								]	
					}),
					// Listeners handle toolbar interactions.
					listeners: {
						// A click on a tree menu item start the loading of a map.
						click: function(view, rec, item, index, eventObj) {
						sendMessage({method: 'loadMap', id: 'europe_map'});
						Ext.getCmp('panel_down').setDisabled(true);
						Ext.getCmp('tab_cultural').setDisabled(true);
						Ext.getCmp('tab_summer').setDisabled(true);
						Ext.getCmp('tab_winter').setDisabled(true);
						Ext.getCmp('bbar_all').setDisabled(true);
						Ext.getCmp('bbar_none').setDisabled(true);
						document.getElementById("info_low-body").innerHTML='<h2 style="margin:10px">Welcome to Europe</h2> Enjoy your selections and Point informations on this map and have a nice Day';		
												
						}
					},
				},
				// drop down menu for cultural maps
				{	
					id: 'aboutCulture',
					text: 'Cultural Maps',
					xtype: 'splitbutton',
					width: (400+window.innerWidth*0.10)/4,
					// Menu entries follow here.
					menu: new Ext.menu.Menu({
						items: [
									// Imprint is the first menu entry.
									{
									text: 'Bern Map',
									width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									sendMessage({method: 'loadMap', id: 'culture_map'});
									Ext.getCmp('panel_down').setDisabled(false);
									Ext.getCmp('tab_cultural').setDisabled(false);
									Ext.getCmp('tab_summer').setDisabled(true);
									Ext.getCmp('tab_winter').setDisabled(true);
									Ext.getCmp('tab_cultural').show(true);
									Ext.getCmp('bbar_all').setDisabled(false);
									Ext.getCmp('bbar_none').setDisabled(false);}
									}
									}
								]	
					}),
					// Listeners handle toolbar interactions.
					listeners: {
						// A click on a tree menu item start the loading of a map.
						click: function(view, rec, item, index, eventObj) {
						sendMessage({method: 'loadMap', id: 'culture_map'});
						Ext.getCmp('panel_down').setDisabled(false);
						Ext.getCmp('tab_cultural').setDisabled(false);
						Ext.getCmp('tab_summer').setDisabled(true);
						Ext.getCmp('tab_winter').setDisabled(true);
						Ext.getCmp('tab_cultural').show(true);
						Ext.getCmp('bbar_all').setDisabled(false);
						Ext.getCmp('bbar_none').setDisabled(false);}
					},
				},

				// drop down menu for winter maps
				{
					id: 'aboutWinter',
					text: 'Winter Maps',
					xtype: 'splitbutton',
					width: (400+window.innerWidth*0.10)/4,
					// Menu entries follow here.
					menu: new Ext.menu.Menu({
						items: [
									// Imprint is the first menu entry.
									{
									text: 'Saas-Fee Map',
									width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									sendMessage({method: 'loadMap', id: 'saas_fee'});
									Ext.getCmp('panel_down').setDisabled(false);
									Ext.getCmp('tab_winter').setDisabled(false);
									Ext.getCmp('tab_cultural').setDisabled(true);
									Ext.getCmp('tab_summer').setDisabled(true);
									Ext.getCmp('tab_winter').show(true)
									Ext.getCmp('bbar_all').setDisabled(false);
									Ext.getCmp('bbar_none').setDisabled(false);;
									
									
									}
									}
									}
								]	
					}),
					// Listeners handle toolbar interactions.
					listeners: {
						// A click on a tree menu item start the loading of a map.
						click: function(view, rec, item, index, eventObj) {
					
						
						sendMessage({method: 'loadMap', id: 'saas_fee'});
						Ext.getCmp('panel_down').setDisabled(false);
						Ext.getCmp('tab_winter').setDisabled(false);
						Ext.getCmp('tab_cultural').setDisabled(true);
						Ext.getCmp('tab_summer').setDisabled(true);
						Ext.getCmp('tab_winter').show(true)
						Ext.getCmp('bbar_all').setDisabled(false);
						Ext.getCmp('bbar_none').setDisabled(false);;
						
						}
					},
				},

				// drop down menu for summer maps
				{
					id: 'aboutSummer',
					text: 'Summer Maps',
					xtype: 'splitbutton',
					width: (400+window.innerWidth*0.10)/4,
					// Menu entries follow here.
					menu: new Ext.menu.Menu({
						items: [
									// Imprint is the first menu entry.
									{
									text: 'Corfu Map',
									width: (400+window.innerWidth*0.10)/4,
									// This function is called when the menu item is selected.
									listeners: {
									// A click on a tree menu item start the loading of a map.
									click: function(view, rec, item, index, eventObj) {
									sendMessage({method: 'loadMap', id: 'wms_greece'});
									Ext.getCmp('panel_down').setDisabled(false);
									Ext.getCmp('tab_summer').setDisabled(false);
									Ext.getCmp('tab_cultural').setDisabled(true);
									Ext.getCmp('tab_winter').setDisabled(true);
									Ext.getCmp('tab_summer').show(true);
									Ext.getCmp('bbar_all').setDisabled(false);
									Ext.getCmp('bbar_none').setDisabled(false);}
									}
									}
								]	
					}),
					// Listeners handle toolbar interactions.
					listeners: {
						// A click on a tree menu item start the loading of a map.
						click: function(view, rec, item, index, eventObj) {
						sendMessage({method: 'loadMap', id: 'wms_greece'});
						Ext.getCmp('panel_down').setDisabled(false);
						Ext.getCmp('tab_summer').setDisabled(false);
						Ext.getCmp('tab_cultural').setDisabled(true);
						Ext.getCmp('tab_winter').setDisabled(true);
						Ext.getCmp('tab_summer').show(true);
						Ext.getCmp('bbar_all').setDisabled(false);
						Ext.getCmp('bbar_none').setDisabled(false);}
					},
				},
				
				/**
				{
					// Next menu is a map menu
					id: 'Summer Map',
					text: 'Corfu Map',
					width: (window.innerWidth*0.40)/4,					
					listeners: {
						// A click on a tree menu item start the loading of a map.
						click: function(view, rec, item, index, eventObj) {
						sendMessage({method: 'loadMap', id: 'wms_greece'});
						}
					}
				}*/
				],
			}, {
				// The right panel presents the atlas contents with tabs.
				region: 'east',
				id: 'panel_right',
				title: 'Atlas Contents',
				collapsible: true,
				resizable: true,
				resizeHandles: 'w',
				//activeTab: 0,
				layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'start',
				},
				width: 300,
				items: [
				
				
		{id: 'panel_down',
		 disabled: true,
		layout: {
			type: 'hbox',
			align: 'stretch',
			pack: 'start',
			},
			items:[
				{
					id: 'map-Attractions',
					
					//text: 'Attractions',
					enableToggle: true,
					xtype: 'button',
					flex: 1,
					pressed: true,
					icon: 'app/icon_attraction.png', // has to be 32by32 pixels!
					padding: '0 13 0 13',
					scale: 'large',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Attractions', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Hotels',
					//text: 'Hotels',
					enableToggle: true,
					xtype: 'button',//component
					flex: 1,
					pressed: true,
					icon: 'app/icon_hotel.png', // has to be 32by32 pixels!
					padding: '0 13 0 13',
					scale: 'large',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Hotels', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Food',
					//text: 'Food',
					enableToggle: true,
					xtype: 'button',//component
					flex: 1,
					pressed: true,
					icon: 'app/icon_fastfood.png', // has to be 32by32 pixels!
					padding: '0 13 0 13',
					scale: 'large',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Food', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Cafes-Bars',
					//text: 'Cafes-Bars',
					enableToggle: true,
					xtype: 'button',//component
					flex: 1,
					pressed: true,
					icon: 'app/icon_bar.png', // has to be 32by32 pixels!
					padding: '0 13 0 13',
					scale: 'large',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Cafes-Bars', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Stations',
					//text: 'Stations',
					enableToggle: true,
					xtype: 'button',//component
					flex: 1,
					pressed: true,
					icon: 'app/icon_station.png', // has to be 32by32 pixels!
					padding: '0 13 0 13',
					scale: 'large',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Stations', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				}
				
				]
			},
				
				{
				flex: 1,
				xtype: 'tabpanel',
				items: [
						/**{
					// The first tab presents a geographic atlas content as a tree.
					title: 'Geographical Info',
					xtype: 'treepanel',
					layout: 'fit',
					rootVisible: false,
					root: {
						// The atlas content tree structure is defined here...
						expanded: true,
						children: [{
							text: 'Base Map Selection', expanded: true, children: [{
								// A leaf indicates a map. Make sure you use a unique id and provide an entry in the 'content' object.
								id: 'google',
								text: 'Google Map', leaf: true
							}, {
								id: 'osm_processed',
								text: 'OpenStreetMap', leaf: true
							}, {
								id: 'bing',
								text: 'Bing Maps', leaf: true
							}, {
								id: 'wms_world',
								text: 'WMS Example', leaf: true
							}, {
								id: 'wms_greece',
								text: 'WMS Greece', leaf: true
							},{
								id: 'map_quest',
								text: 'MapQuest Open', leaf: true
							}, {
								id: 'saas_fee',
								text: 'Saas Fee Google Earth Map', leaf: true
							},
							/** {
								text: 'Europe', expanded: true, children: [{
									text: 'Switzerland', expanded: true, children: [{
										id: 'osm_restricted',
										text: 'OpenStreetMap', leaf: true
										
									}, {
										id: 'interaction',
										text: 'Interaction', leaf: true
									}, {
										id: 'projection',
										text: 'Projection', leaf: true
									}, {
										id: 'foreigners',
										text: 'Foreigners', leaf: true
									}, {
										id: 'male_female',
										text: 'Male/Female', leaf: true
									}, {
										id: 'mmkarto2012',
										text: 'Course "Multimedia and Web Cartography 2012"', leaf: true
									}, {
										id: 'wms_ch',
										text: 'WMS Example', leaf: true
									}, {
										id: 'ge_cantons',
										text: "Swiss Cantons 3D", leaf: true
									}, {
										id: 'ge_activity_rate',
										text: "Activity Rate", leaf: true
									}]
								}, {
									id: 'ge_gas_network',
									text: "Gas Network", leaf: true
								}]
							} */ 
							/**, {
								text: 'North America', expanded: true, children: [{
									text: 'USA', expanded: true, children: [{
										id: 'airports',
										text: 'Aiports and Flights', leaf: true
									}]
								}]
							}*/ /**]
						}]
				    },
					listeners: {
						// A click on a tree menu item start the loading of a map.
						itemclick: function(view, rec, item, index, eventObj) {
							currentMapId = rec.get('id');
							sendMessage({method: 'loadMap', id: rec.get('id')});
							
							
							//sendMessage({method: 'buttonClick', id: 'map-Attractions', pressed: true});
							//console.log('erledigt2');
						}
					},

				}, */
				 /*{
					// The second tab presents an alphabetic atlas content.
					title: 'Alphabetic',
					//id: 'tab1',
					//tabIndex: 2,
					xtype: 'treepanel',
					layout: 'fit',
					rootVisible: false,
					root: {
						expanded: true,
						children: [{
							text: 'A'
						}, {
							text: 'G', expanded: true, children: [{
								id: 'google',
								text: 'Google Map', leaf: true
							}]
						}, {
							text: 'O', expanded: true, children: [{
								id: 'osm_processed',
								text: 'OpenStreetMap', leaf: true
							}]
						}]
					},
					listeners: {
						itemclick: function(view, rec, item, index, eventObj) {
							currentMapId = rec.get('id');
							sendMessage({method: 'loadMap', id: rec.get('id')});
						}
					},
				}*/
				
				
				/*
					{
					// The third tab presents a thematic atlas content.
					title: 'Cultural Info',
					//id: 'tab2',
					//tabIndex: 2,
					xtype: 'fieldcontainer',
					
					
					//fieldLabel: 'Toppings',
					
					defaultType: 'checkboxfield',
					items: [{
						boxLabel: 'Anchovies',
						name: 'topping',
						inputValue: '1',
						id: 'checkbox1'
					}, {
						boxLabel: 'Artichoke Hearts',
						name: 'topping',
						inputValue: '2',
						checked: true,
						id: 'checkbox2'
					}, {
						boxLabel: 'Bacon',
						name: 'topping',
						inputValue: '3',
						id: 'checkbox3'
					}]
					
					
					
					/*
					title: 'Cultural Info',
					xtype: 'treepanel',
					layout: 'fit',
					 
					rootVisible: false,
					root: {
						expanded: true,
						children: [{
							text: 'Unesco Area', expanded: true, children: [{
								id: 'Unesco_Information',
								text: 'Area Information', leaf: true
							}, {
								id: 'Unesco_History',
								text: 'History', leaf: true
							}]
						}, 
						{
							text: 'Events Calendar', expanded: true, children: [{
								id: 'Unesco_Information',
								text: 'Area Information', leaf: true
							}, {
								id: 'Unesco_History',
								text: 'History', leaf: true
							}]
						}, {
							text: 'Arts', expanded: true, children: [{
								id: 'Museums',
								text: 'Museums', leaf: true
							}, {
								id: 'Art_Centers',
								text: 'Art Centers', leaf: true
							}, {
								id: 'Libraries',
								text: 'Libraries', leaf: true
							}, {
								id: 'Cinemas',
								text: 'Cinemas', leaf: true
							}, {
								id: 'Theaters',
								text: 'Theaters', leaf: true
							}]
						}, {
							text: 'Historic Points', expanded: true, children: [{
								id: 'Archaelogical_Sites',
								text: 'Archaelogical Sites', leaf: true
							}, {
								id: 'Memorials',
								text: 'Memorials', leaf: true
							}]
						}, {
							text: 'Places of worship',
						}, {
							text: 'Sports Centers',
						}

						] 
					}*/
					/*
					,
					listeners: {
						itemclick: function(view, rec, item, index, eventObj) {
							currentMapId = rec.get('id');
							sendMessage({method: 'loadMap', id: rec.get('id')});
						}
					},
				},*/
				/*
				{	//charis: cultural map
					title: 'Cultural Info',
					xtype: 'checkboxgroup',
					fieldLabel: 'Cultural',
					columns: 1,
					defaultType: 'checkboxfield',
					items: [
						{xtype: 'component', html: 'Additional Information', cls:'x-form-check-group-label'},
						{
						boxLabel: 'Arts',
						name: 'cb-cultural-1',
						inputValue: '1',
						id: 'checkboxB1',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Arts', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Arts', pressed: this.checked});
							}
						},
					},  {
						boxLabel: 'Places of Worship',
						name: 'cb-cultural-2',
						inputValue: '2',
						id: 'checkboxB2',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Worship', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Worship', pressed: this.checked});
							}
						},
					},	{
						boxLabel: 'Historic Points',
						name: 'cb-cultural-3',
						inputValue: '3',
						id: 'checkboxB3',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Historic', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Historic', pressed: this.checked});
							}
						},
					},  {
						boxLabel: 'Sports',
						name: 'cb-cultural-4',
						inputValue: '4',
						checked: true,
						id: 'checkboxB4',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Sports', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Sports', pressed: this.checked});
							}
						},
					},
				]	
				//					
				*/
				
							{ // cultural infos
				title: ' Cultural',
				autoScroll:true,
				disabled: true,
				id: 'tab_cultural',
            xtype: 'checkboxgroup',
            fieldLabel: 'Additional Information',
            // Put all controls in a single column with width 100%
            columns: 1,
            items: [
                {
				boxLabel: 'Arts',
				name: 'cb-col-1',
				inputValue: '1',
				id: 'checkbox14',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Arts_button', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Arts_button', pressed: this.checked});
							}
						},				
				},{
				boxLabel: 'Places of Worship',
				name: 'cb-col-2',
				inputValue: '2',
				//checked: true,
				id: 'checkbox15',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Worship_button', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Worship_button', pressed: this.checked});
							}
						},				
				},{
				boxLabel: 'Sports',
				name: 'cb-col-3',
				inputValue: '3',
				//checked: true,
				id: 'checkbox16',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Sports_button', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Sports_button', pressed: this.checked});
							}
						},
				},{
				boxLabel: 'Historic Points',
				name: 'cb-col-4',
				inputValue: '4',
				//checked: true,
				id: 'checkbox17',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Historic_button', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Historic_button', pressed: this.checked});
							}
						},
				}
            ]	
        }
				
				,{ // Winter infos
					// The third tab presents a thematic atlas content.
					title: 'Winter',
					autoScroll:true,
					disabled: true,
					id: 'tab_winter',
					//tabIndex: 2,
					xtype: 'checkboxgroup',
					//fieldLabel: 'Winter',
					//cls: 'x-check-group-alt',  // macht nur e hintergrundfarb... 
					columns: 1,
					
					
					defaultType: 'checkboxfield',  // gilt als xtype für sämtliche untenstehende items
					items: [
						{xtype: 'component', html: 'Daily needs', cls:'x-form-check-group-label', margin: '0 0 0 10'},
						{
						boxLabel: 'Shops',
						name: 'cb-winter-1',
						inputValue: '1',
						id: 'checkbox1'
					}, {
						boxLabel: 'bank&atm',
						name: 'cb-winter-2',
						inputValue: '2',
						checked: true,
						id: 'checkbox2'
					},  {
						boxLabel: 'pharmacy',
						name: 'cb-winter-3',
						inputValue: '3',
						checked: true,
						id: 'checkbox3',
						
					},
					
					{xtype: 'component', html: 'Nature', cls:'x-form-check-group-label', margin: '0 0 0 10'},
					{
						boxLabel: 'glaciers',
						name: 'cb-winter-4',
						inputValue: '4',
						id: 'checkbox4'
					},{
						boxLabel: 'forest',
						name: 'cb-winter-5',
						inputValue: '5',
						id: 'checkbox5'
					},{
						boxLabel: 'peaks',
						name: 'cb-winter-6',
						inputValue: '6',
						id: 'checkbox6'
					},
					{xtype: 'component', html: 'Others', cls:'x-form-check-group-label', margin: '0 0 0 5'},
					{
						boxLabel: 'skilifts',
						name: 'cb-winter-7',
						inputValue: '7',
						id: 'checkbox7',
						margin: '0 0 0 10',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Skilifts', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Skilifts', pressed: this.checked});
							}
						},
					},{
						boxLabel: 'metro',
						name: 'cb-winter-8',
						inputValue: '8',
						id: 'checkbox8',
						margin: '0 0 0 10',
					},{
						boxLabel: 'parking',
						name: 'cb-winter-9',
						inputValue: '9',
						id: 'checkbox9',
						margin: '0 0 0 10',
						listeners: {
							change: function() {
								sendMessage({method: 'buttonClick', id: 'Parking', pressed: this.checked});
								console.log({method: 'buttonClick', id: 'Parking', pressed: this.checked});
							}
						},
					},{
						boxLabel: 'sport points',
						name: 'cb-winter-10',
						inputValue: '10',
						id: 'checkbox10',
						margin: '0 0 0 10',
					}
					
					]
					
					
			
					// no longer needed: 
					
					/*
					,
					listeners: {
							click: function() {
							currentMapId = rec.get('id');
							sendMessage({method: 'buttonClick', id: 'Parking', pressed: this.checked});
							console.log('test checkboxes');
						}
					},
					*/
					
				}
				
				
				
				,
				{ // summer infos
				title: ' Summer',
				id: 'tab_summer',
				autoScroll:true,
				disabled: true,
            xtype: 'checkboxgroup',
            fieldLabel: 'Single Column',
            // Put all controls in a single column with width 100%
            columns: 1,
            items: [
                {
				boxLabel: 'Item 1',
				name: 'cb-col-1',
				inputValue: '1',
				id: 'checkbox11'
				},{
				boxLabel: 'Item 2',
				name: 'cb-col-2',
				inputValue: '2',
				checked: true,
				id: 'checkbox12'
				},{
				boxLabel: 'Item 3',
				name: 'cb-col-3',
				inputValue: '3',
				checked: true,
				id: 'checkbox13',
				}
            ]	
        }
		,

		// luca
		
		{ // Europe infos
				title: ' Europe',
				id: 'europe_ls',
				autoScroll:true,
				disabled: false,
            //xtype: 'checkboxgroup',
				class: "olControlLayerSwitcher",
            /*items: [
                }
				} 
            ]	*/
        }
		
				
				]	
				
				,
				bbar: [
				
				/*{
					text: 'Select Bacon',
					handler: function () {
						Ext.getCmp('checkbox3').setValue(true);
					}
				}, '-', */
				{
					text: 'Select All',
					id: 'bbar_all',
					disabled: true,
					handler: function () {
						Ext.getCmp('checkbox1').setValue(true);
						Ext.getCmp('checkbox2').setValue(true);
						Ext.getCmp('checkbox3').setValue(true);
						Ext.getCmp('checkbox4').setValue(true);
						Ext.getCmp('checkbox5').setValue(true);
						Ext.getCmp('checkbox6').setValue(true);
						Ext.getCmp('checkbox7').setValue(true);
						Ext.getCmp('checkbox8').setValue(true);
						Ext.getCmp('checkbox9').setValue(true);
						Ext.getCmp('checkbox10').setValue(true);
						Ext.getCmp('checkbox11').setValue(true);
						Ext.getCmp('checkbox12').setValue(true);
						Ext.getCmp('checkbox13').setValue(true);
						Ext.getCmp('checkbox14').setValue(true);
						Ext.getCmp('checkbox15').setValue(true);
						Ext.getCmp('checkbox16').setValue(true);
						Ext.getCmp('checkbox17').setValue(true);
					}
				}, '-', {
					text: 'Deselect All',
					id: 'bbar_none',
					disabled: true,
					handler: function () {
						Ext.getCmp('checkbox1').setValue(false);
						Ext.getCmp('checkbox2').setValue(false);
						Ext.getCmp('checkbox3').setValue(false);
						Ext.getCmp('checkbox4').setValue(false);
						Ext.getCmp('checkbox5').setValue(false);
						Ext.getCmp('checkbox6').setValue(false);
						Ext.getCmp('checkbox7').setValue(false);
						Ext.getCmp('checkbox8').setValue(false);
						Ext.getCmp('checkbox9').setValue(false);
						Ext.getCmp('checkbox10').setValue(false);
						Ext.getCmp('checkbox11').setValue(false);
						Ext.getCmp('checkbox12').setValue(false);						
						Ext.getCmp('checkbox13').setValue(false);
						Ext.getCmp('checkbox14').setValue(false);
						Ext.getCmp('checkbox15').setValue(false);
						Ext.getCmp('checkbox16').setValue(false);
						Ext.getCmp('checkbox17').setValue(false);
					}
				}]
				
				
				
				

					},{
					// The right panel presents the atlas contents with tabs.
					title: 'Map Content',
					id: 'info_low',
					xtype: 'panel',
					width: 300,
					flex: 1,
					//height : 350,
					autoScroll:true,
					//padding: '10 10 10 10',
					html: '<h3 style="margin:10px">Please choose a map!</h3>',
					bodyStyle:{"background-color":'#DDDDDD'},
					
					}]
			}, /*{
				// We currently use the section.
				region: 'south',
				xtype: 'panel',//
				
				
				//panel.add(button1);
				title: 'Standard Touristic Information',
				id: 'panel_down2',
				collapsible: true,
				resizable: false,
				resizeHandles: 'n',
				height: 60,
				border: true,//
				
				
				items: [
				{
					id: 'map-Attractions2',
					text: 'Attractions',
					enableToggle: true,
					xtype: 'button',//component
					width: '20%',//window.innerWidth/5,
					pressed: true,
					//cls: 'floater',
					iconCls: 'add',
					iconAlign: 'right',
					//cls:'x-btn-text-icon'
					//icon: 'http://sencha.com/favicon.ico',
					icon: 'app/Statue.png',
					listeners: {
						click: function() {
						// this == the button, as we are in the local scope
						// this.setText('I was clicked!');
						sendMessage({method: 'buttonClick', id: 'map-Attractions', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Hotels2',
					text: 'Hotels',
					enableToggle: true,
					xtype: 'button',//component
					width: '20%',//window.innerWidth/5
					pressed: true,
					iconAlign: 'right',
					icon: 'app/Hotel.png',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Hotels', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Food2',
					text: 'Food',
					enableToggle: true,
					xtype: 'button',//component
					width: '20%',//window.innerWidth/5
					pressed: true,
					iconAlign: 'right',
					icon: 'app/fastfood.png',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Food', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Cafes-Bars2',
					text: 'Cafes-Bars',
					enableToggle: true,
					xtype: 'button',//component
					width: '20%',//window.innerWidth/5
					pressed: true,
					iconAlign: 'right',
					icon: 'app/bar.png',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Cafes-Bars', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},
				{
					id: 'map-Stations2',
					text: 'Stations',
					enableToggle: true,
					xtype: 'button',//component
					width: '20%',//window.innerWidth/5-2
					pressed: true,
					iconAlign: 'right',
					icon: 'app/bus.png',
					listeners: {
						click: function() {
						sendMessage({method: 'buttonClick', id: 'map-Stations', pressed: this.pressed});
						console.log(this.pressed,this);
					}
					}
				},],
				//renderTo: Ext.getBody()
			}*/
			
			, {
				// The map finally is presented in the center as an 'iframe', an embedded element.
				region: 'center',
				border: false,
				xtype: 'component',
				id: 'map',
				autoEl: {
					style: { backgroundColor: '#fff' },
					tag: 'iframe',
					cls: 'map-frame',
					border: false
				},
			}]	
		});
		
		
		
		// initialize information of buttons needs to be set in other file!!!
	}
});
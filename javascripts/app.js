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
			ge_activity_rate: { src: '../Maps/maps/google-earth/Erwerb.html' },
			ge_cantons: { src: '../Maps/maps/google-earth/Kantone.html' },
			ge_gas_network: { src: '../Maps/maps/google-earth/Gasnetz.html' },
			airports: { src: '../Maps/maps/d3/USFlights.html' }
		}
		
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
					id: 'aboutEurope',
					text: 'Europe Maps',
					xtype: 'splitbutton',
					width: 200,
					// Menu entries follow here.
					menu: new Ext.menu.Menu({
						items: [
							// Imprint is the first menu entry.
							{
								text: 'Price Level Map',
								width: 200,
								// This function is called when the menu item is selected.
								handler: function() {
									// We present the imprint document in a window.
									createBrowserWindow('map', 'Imprint', 'resources/html/imprint.html');
								}
							},
							{
								text: 'Big-Mac Index Map',
								width: 200,
								// This function is called when the menu item is selected.
								handler: function() {
									// We present the imprint document in a window.
									createBrowserWindow('map', 'Imprint', 'resources/html/imprint.html');
								}
							},
							{
								text: 'Temperature Map',
								width: 200,
								// This function is called when the menu item is selected.
								handler: function() {
									// We present the imprint document in a window.
									createBrowserWindow('map', 'Imprint', 'resources/html/imprint.html');
								}
							}
						]	
					}),
					// Listeners handle toolbar interactions.
					listeners: {
						// Handles click event in the toolbar item.
						click: function(view, rec, item, index, eventObj) {
							// We present an 'about' document in a window.
							createChildWindow('map', 'About this Atlas', 'resources/html/about.html');
						}
					},
				},
				{
					// Next menu is a map menu
					id: 'Culture Map',
					text: 'Bern Map',
					width: 200,
					/*xtype: 'splitbutton',
					menu: new Ext.menu.Menu({
						items: [
							{
								text: 'Open Map in New Window...',
								handler: function() {
									// We present the current map in a new browser window.
									var url = Ext.get('map').dom.src;
									window.open(url, url, 'scrollbars=yes,location=no', false);
								}
							},
							{
								text: 'Show Map URL',
								handler: function() {
									// We show the URL of the current map.
									var url = Ext.get('map').dom.src;
									alert('URL: ' + url);
								}
							}
				        ]
				    }),*/
					listeners: {
						// We present extra information about the current map.
						click: function(view, rec, item, index, eventObj) {
							// If the map file name is 'map.html', an info file 'map_info.html' is expected in the same directory.
							var mapName = content[currentMapId].src;
							var infoName = mapName.substr(0, mapName.lastIndexOf('.')) + '_info.html';
							createChildWindow('map', 'About this Map', infoName);
						}
					},
				},
				{
					// Next menu is a map menu
					id: 'Winter Map',
					text: 'Saas-Fee Map',
					width: 200,					
					/*xtype: 'splitbutton',
					menu: new Ext.menu.Menu({
						items: [
							{
								text: 'Open Map in New Window...',
								handler: function() {
									// We present the current map in a new browser window.
									var url = Ext.get('map').dom.src;
									window.open(url, url, 'scrollbars=yes,location=no', false);
								}
							},
							{
								text: 'Show Map URL',
								handler: function() {
									// We show the URL of the current map.
									var url = Ext.get('map').dom.src;
									alert('URL: ' + url);
								}
							}
				        ]
				    }),*/
					listeners: {
						// We present extra information about the current map.
						click: function(view, rec, item, index, eventObj) {
							// If the map file name is 'map.html', an info file 'map_info.html' is expected in the same directory.
							var mapName = content[currentMapId].src;
							var infoName = mapName.substr(0, mapName.lastIndexOf('.')) + '_info.html';
							createChildWindow('map', 'About this Map', infoName);
						}
					},
				}, 
				{
					// Next menu is a map menu
					id: 'Summer Map',
					text: 'Corfu Map',
					width: 200,					
					/*xtype: 'splitbutton',
					menu: new Ext.menu.Menu({
						items: [
							{
								text: 'Open Map in New Window...',
								handler: function() {
									// We present the current map in a new browser window.
									var url = Ext.get('map').dom.src;
									window.open(url, url, 'scrollbars=yes,location=no', false);
								}
							},
							{
								text: 'Show Map URL',
								handler: function() {
									// We show the URL of the current map.
									var url = Ext.get('map').dom.src;
									alert('URL: ' + url);
								}
							}
				        ]
				    }),*/
					listeners: {
						// We present extra information about the current map.
						click: function(view, rec, item, index, eventObj) {
							// If the map file name is 'map.html', an info file 'map_info.html' is expected in the same directory.
							var mapName = content[currentMapId].src;
							var infoName = mapName.substr(0, mapName.lastIndexOf('.')) + '_info.html';
							createChildWindow('map', 'About this Map', infoName);
						}
					},
				},],
			}, {
				// The right panel presents the atlas contents with tabs.
				region: 'east',
				title: 'Special Touristic Information',
				collapsible: true,
				resizable: true,
				resizeHandles: 'w',
				width: 260,
				xtype: 'tabpanel',
				activeTab: 0,
				items: [{
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
								id: 'map_quest',
								text: 'MapQuest Open', leaf: true
							}, /* {
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
							} *//**, {
								text: 'North America', expanded: true, children: [{
									text: 'USA', expanded: true, children: [{
										id: 'airports',
										text: 'Aiports and Flights', leaf: true
									}]
								}]
							}*/]
						}]
				    },
					listeners: {
						// A click on a tree menu item start the loading of a map.
						itemclick: function(view, rec, item, index, eventObj) {
							currentMapId = rec.get('id');
							sendMessage({method: 'loadMap', id: rec.get('id')});
						}
					},
					
				}, /* {
					// The second tab presents an alphabetic atlas content.
					title: 'Alphabetic',
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
				}, */{
					// The third tab presents a thematic atlas content.
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
					},
					listeners: {
						itemclick: function(view, rec, item, index, eventObj) {
							currentMapId = rec.get('id');
							sendMessage({method: 'loadMap', id: rec.get('id')});
						}
					},
				}]
			}, {
				// We currently use the section.
				region: 'south',
				xtype: 'panel',//
				/* JPanel buttonBar = new JPanel();
				buttonBar.setLayout( (new GridLayout(1,3) );
				buttonBar.add(button1);
				buttonBar.add(button1);
				buttonBar.add(button1); */
				//panel.add(button1);
				title: 'Standard Touristic Information',
				collapsible: true,
				resizable: false,
				resizeHandles: 'n',
				height: 60,
				border: true,//
				items: [
				{
					id: 'map-Attractions',
					text: 'Attractions',
					xtype: 'button',//component
					width: 255
				},
				{
					id: 'map-Hotels',
					text: 'Hotels',
					xtype: 'button',//component
					width: 256
				},
				{
					id: 'map-Food',
					text: 'Food',
					xtype: 'button',//component
					width: 256
				},
				{
					id: 'map-Cafes-Bars',
					text: 'Cafes-Bars',
					xtype: 'button',//component
					width: 256
				},
				{
					id: 'map-Stations',
					text: 'Stations',
					xtype: 'button',//component
					width: 255
				},],
				renderTo: Ext.getBody()
			}, {
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
	}
});

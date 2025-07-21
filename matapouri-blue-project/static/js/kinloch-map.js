class KinlochMap {
    constructor(containerId = 'map') {
        this.containerId = containerId;
        this.map = null;
        this.currentLayer = null;
        this.trails = [];
        this.pointsOfInterest = [];
        this.trailLayers = [];
        this.poiLayers = [];
        this.trackDetails = [];
        this.trackMarkers = [];
        this.waterTaxiRoutes = [];
        this.waterTaxiMarkers = [];
        this.waterTaxiLayers = [];
        this.taxiRouteLayeres = [];
        this.imageMarkers = [];
        this.ticked = false;
        
        // Auto-initialize when container is provided
        if (this.containerId) {
            this.init();
        }
    }

    init() {
        console.log('KinlochMap: Initializing map...');
        
        // Check if map container exists
        const mapContainer = document.getElementById(this.containerId);
        if (!mapContainer) {
            console.error('KinlochMap: Map container not found');
            return;
        }
        
        // Initialize the map centered on Kinloch area - zoomed closer between Whakaipo and Kawakawa headlands
        this.map = L.map(this.containerId, {
            center: [-38.6634, 175.9200], // Centered on Kinloch between headlands
            zoom: 14, // Adjusted zoom for better view between headlands
            zoomControl: false,
            scrollWheelZoom: true,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true
        });
        
        console.log('KinlochMap: Map initialized successfully - v6.1 - Adjusted zoom to 14 between headlands');

        // Add OpenStreetMap Cycle Map layer (Thunderforest OpenCycleMap) with trail detail
        this.currentLayer = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=' + window.THUNDERFOREST_API_KEY, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>',
            maxZoom: 18,
            opacity: 0.9
        }).addTo(this.map);

        // Clear background overlay to show authentic OpenStreetMap layer
        document.getElementById(this.containerId).style.backgroundColor = 'transparent';
        
        // Force remove any blue overlays by setting the map container and all parent elements to transparent
        const mapElement = document.getElementById(this.containerId);
        if (mapElement) {
            mapElement.style.backgroundColor = 'transparent';
            mapElement.style.background = 'transparent';
            
            // Also clear parent container backgrounds
            const parentContainer = mapElement.parentElement;
            if (parentContainer) {
                parentContainer.style.backgroundColor = 'transparent';
                parentContainer.style.background = 'transparent';
            }
        }
        
        // Initialize points of interest
        this.initializePointsOfInterest();
        
        // Points of interest markers removed - only GPS image markers remain
        
        // Initialize track details
        this.initializeTrackDetails();
        
        // Initialize water taxi routes
        this.initializeWaterTaxiRoutes();
        
        // Add water taxi routes to map
        this.addWaterTaxiRoutesToMap();
        
        // Add GPS images to map
        this.addGPSImagesToMap();
        
        // Add track details to map
        this.addTrackDetailsToMap();
        

        
        // For Discover page, show all map elements immediately
        this.showMapElements();
        
        // Trail lines removed per user request
        
        // Track details removed per user request - using original OpenStreetMap track details
        
        // Water taxi routes removed - using authentic OpenStreetMap trail details only
        
        // Add map key
        this.addMapKey();
        
        // Add discover box to map
        this.addDiscoverBox();

        // Add weather widget to map
        this.addWeatherWidget();

        // Add zoom event listener for marker scaling
        this.map.on('zoomend', () => {
            this.updateMarkerSize();
        });
        
        // Add click-to-remove functionality for discover box
        this.setupDiscoverBoxRemoval();
    }

    initializeTrails() {
        // Authentic Great Lake Trails data with official times and distances
        this.trails = [
            {
                name: "K2K Trail",
                coordinates: [
                    [-38.6634, 175.9200], // Kinloch start
                    [-38.6620, 175.9150],
                    [-38.6600, 175.9100],
                    [-38.6580, 175.9050],
                    [-38.6570, 175.9000],
                    [-38.6560, 175.8950],
                    [-38.6550, 175.8900],
                    [-38.6540, 175.8850],
                    [-38.6530, 175.8800],
                    [-38.6520, 175.8750],
                    [-38.6510, 175.8700],
                    [-38.6500, 175.8650],
                    [-38.6490, 175.8600],
                    [-38.6480, 175.8550],
                    [-38.6470, 175.8500],
                    [-38.6460, 175.8450],
                    [-38.6450, 175.8400],
                    [-38.6440, 175.8350],
                    [-38.6430, 175.8300],
                    [-38.6420, 175.8250],
                    [-38.6410, 175.8200],
                    [-38.6400, 175.8150],
                    [-38.6390, 175.8100],
                    [-38.6380, 175.8050],
                    [-38.6370, 175.8000],
                    [-38.6360, 175.7950],
                    [-38.6350, 175.7900],
                    [-38.6340, 175.7850],
                    [-38.6330, 175.7800],
                    [-38.6320, 175.7750],
                    [-38.6525, 175.9055] // Kawakawa Bay end
                ],
                distance: "9 km",
                walkingTime: "2 hours",
                cyclingTime: "1 hour 30 minutes",
                difficulty: "Intermediate",
                description: "Kinloch to Kawakawa Bay via Codgers Rock lookout",
                highlights: ["Codgers Rock lookout", "Native bush", "Lake views", "Elevation gain 320m"]
            },
            {
                name: "W2K Trail",
                coordinates: [
                    [-38.6735, 175.9205], // Whakaipo Bay start
                    [-38.6720, 175.9180],
                    [-38.6710, 175.9160],
                    [-38.6700, 175.9140],
                    [-38.6690, 175.9120],
                    [-38.6680, 175.9100],
                    [-38.6670, 175.9080],
                    [-38.6660, 175.9060],
                    [-38.6650, 175.9040],
                    [-38.6640, 175.9020],
                    [-38.6634, 175.9200] // Kinloch end
                ],
                distance: "14 km",
                walkingTime: "4 hours 30 minutes",
                cyclingTime: "2 hours",
                difficulty: "Intermediate",
                description: "Whakaipo Bay to Kinloch via Whangamata headland",
                highlights: ["Headland views", "Tongariro National Park views", "Pumice track", "Excellent drainage"]
            },
            {
                name: "Whangamata Stream Trail",
                coordinates: [
                    [-38.6634, 175.9200], // Kinloch start
                    [-38.6520, 175.9260],
                    [-38.6500, 175.9280],
                    [-38.6480, 175.9300],
                    [-38.6460, 175.9320],
                    [-38.6440, 175.9340],
                    [-38.6420, 175.9360],
                    [-38.6400, 175.9380],
                    [-38.6380, 175.9400],
                    [-38.6360, 175.9420],
                    [-38.6340, 175.9440],
                    [-38.6320, 175.9460],
                    [-38.6300, 175.9480],
                    [-38.6280, 175.9500] // Whangamata Road end
                ],
                distance: "3 km",
                walkingTime: "1 hour 30 minutes",
                cyclingTime: "45 minutes",
                difficulty: "Easy",
                description: "Forest trail following Whangamata Stream from lake to road",
                highlights: ["Historic water wheel", "Trout viewing", "Native forest", "Stream-side walking"]
            },
            {
                name: "Otaketake Trail",
                coordinates: [
                    [-38.6634, 175.9200], // Kinloch start
                    [-38.6620, 175.9180],
                    [-38.6610, 175.9160],
                    [-38.6600, 175.9140],
                    [-38.6590, 175.9120],
                    [-38.6580, 175.9100],
                    [-38.6570, 175.9080],
                    [-38.6560, 175.9060],
                    [-38.6550, 175.9040],
                    [-38.6540, 175.9020],
                    [-38.6530, 175.9000],
                    [-38.6520, 175.8980],
                    [-38.6510, 175.8960],
                    [-38.6500, 175.8940],
                    [-38.6750, 175.8980] // Orakau carpark end
                ],
                distance: "12 km",
                walkingTime: "3 hours",
                cyclingTime: "1 hour 30 minutes",
                difficulty: "Intermediate",
                description: "Kinloch to Orakau carpark through native bush",
                highlights: ["Native birdlife", "Lake Taupo viewpoints", "Forest canopy", "Stream crossings"]
            },
            {
                name: "Orakau Track",
                coordinates: [
                    [-38.6750, 175.8980], // Orakau carpark start
                    [-38.6720, 175.8960],
                    [-38.6690, 175.8940],
                    [-38.6660, 175.8920],
                    [-38.6630, 175.8900],
                    [-38.6600, 175.8880],
                    [-38.6570, 175.8860],
                    [-38.6540, 175.8840],
                    [-38.6510, 175.8820],
                    [-38.6480, 175.8800],
                    [-38.6450, 175.8780],
                    [-38.6420, 175.8760],
                    [-38.6390, 175.8740],
                    [-38.6360, 175.8720],
                    [-38.6525, 175.9055] // Kawakawa Bay end
                ],
                distance: "10 km",
                walkingTime: "2 hours 30 minutes",
                cyclingTime: "1 hour 15 minutes",
                difficulty: "Intermediate",
                description: "Orakau carpark to Kawakawa Bay with downhill flow",
                highlights: ["Downhill flow", "Wetlands", "Boardwalks", "Waterfalls", "160m elevation gain"]
            },
            {
                name: "Waihaha Trail",
                coordinates: [
                    [-38.6920, 175.9050], // Waihaha River Bridge start
                    [-38.6900, 175.9030],
                    [-38.6880, 175.9010],
                    [-38.6860, 175.8990],
                    [-38.6840, 175.8970],
                    [-38.6820, 175.8950],
                    [-38.6800, 175.8930],
                    [-38.6780, 175.8910],
                    [-38.6760, 175.8890],
                    [-38.6740, 175.8870],
                    [-38.6720, 175.8850],
                    [-38.6700, 175.8830],
                    [-38.6680, 175.8810],
                    [-38.6660, 175.8790],
                    [-38.6640, 175.8770],
                    [-38.6620, 175.8750],
                    [-38.6600, 175.8730],
                    [-38.6580, 175.8710],
                    [-38.6560, 175.8690],
                    [-38.6540, 175.8670],
                    [-38.6520, 175.8650] // Kotukutuku Landing end
                ],
                distance: "30 km (13km Waihaha + 17km Waihora)",
                walkingTime: "3.5 hours Waihaha section",
                cyclingTime: "1.5 hours Waihaha section",
                difficulty: "Intermediate",
                description: "Most remote section with flowing corners and switchbacks",
                highlights: ["Remote wilderness", "Flowing corners", "Switchbacks", "Waterfall finish", "Shuttle required"]
            }
        ];
    }

    initializePointsOfInterest() {
        // GPS-located images from uploaded files
        this.gpsImages = [
            {
                name: "Canoe at K2K",
                coordinates: [-38.664957, 175.869339],
                image: "/attached_assets/Canoe at K2K -38.664957, 175.869339_1752636070985.jpeg",
                description: "Canoeing at K2K trail location"
            },
            {
                name: "K2K headland",
                coordinates: [-38.67338, 175.86766],
                image: "/attached_assets/K2K headland -38.67338, 175.86766_1752636070985.jpeg",
                description: "Scenic headland view on K2K trail"
            },
            {
                name: "K2K campsite",
                coordinates: [-38.665705, 175.870004],
                image: "/attached_assets/K2K campsite -38.665705, 175.870004_1752636070985.jpeg",
                description: "Camping facilities at K2K"
            },
            {
                name: "Ferry grove Stream Trail",
                coordinates: [-38.652070, 175.925961],
                image: "/attached_assets/Ferry grove Stream Trail -38.652070, 175.925961_1752636070985.jpeg",
                description: "Ferry grove on stream trail"
            },
            {
                name: "General Store",
                coordinates: [-38.662909, 175.919794],
                image: "/attached_assets/General Store -38.662909, 175.919794_1752636070985.jpeg",
                description: "Local general store"
            },
            {
                name: "Paddle K2K headland",
                coordinates: [-38.66611, 175.88317],
                image: "/attached_assets/Paddle K2K headland -38.66611, 175.88317_1752636070985.jpeg",
                description: "Paddling at K2K headland"
            },
            {
                name: "K2K rocks",
                coordinates: [-38.66611, 175.88317],
                image: "/attached_assets/K2K rocks -38.66611, 175.88317_1752636070985.jpeg",
                description: "Rocky formations at K2K"
            },
            {
                name: "Lookout k2k",
                coordinates: [-38.661847, 175.878319],
                image: "/attached_assets/Lookout k2k  -38.66288, 175.87418_1752636070985.jpeg",
                description: "Scenic lookout on K2K trail"
            },
            {
                name: "Camping at k2k",
                coordinates: [-38.665967, 175.870165],
                image: "/attached_assets/Camping at k2k -38.665967, 175.870165_1752636070985.jpeg",
                description: "Camping area at K2K"
            },
            {
                name: "Blue Heron",
                coordinates: [-38.659732, 175.913504],
                image: "/attached_assets/Blue Heron -38.659732, 175.913504_1752636070985.jpeg",
                description: "Blue heron wildlife spotting"
            },

            {
                name: "Forrest Whangamata Stream",
                coordinates: [-38.643665, 175.928364],
                image: "/attached_assets/Forrest Whangamata Stream  -38.643665, 175.928364_1752636070985.jpeg",
                description: "Forest section of Whangamata Stream"
            },
            {
                name: "Crystal clear water",
                coordinates: [-38.66005, 175.90309],
                image: "/attached_assets/Crystal clear water-38.66005, 175.90309_1752636070985.jpeg",
                description: "Crystal clear lake water"
            },
            {
                name: "K2K riding",
                coordinates: [-38.657763, 175.910039],
                image: "/attached_assets/K2K riding. -38.657763, 175.910039_1752636070985.jpeg",
                description: "Mountain biking on K2K trail"
            },
            {
                name: "K2K cliffs",
                coordinates: [-38.667619, 175.868867],
                image: "/attached_assets/K2K cliffs -38.667619, 175.868867_1752636070985.jpeg",
                description: "Cliff formations along K2K"
            },
            {
                name: "Lookout secret bay",
                coordinates: [-38.657792, 175.897508],
                image: "/attached_assets/Lookout secret bay -38.657792, 175.897508_1752636070985.jpeg",
                description: "Secret bay lookout point"
            },
            {
                name: "K2K to beach",
                coordinates: [-38.658161, 175.910881],
                image: "/attached_assets/K2K to beach -38.658161, 175.910881_1752636070986.jpeg",
                description: "K2K trail access to beach"
            },
            {
                name: "Hidden valley K2K",
                coordinates: [-38.661587, 175.875535],
                image: "/attached_assets/Hidden valley K2K 1 -38.661587, 175.875535_1752636070986.jpeg",
                description: "Hidden valley on K2K trail"
            },
            {
                name: "Autumn Whangamata Stream Trail",
                coordinates: [-38.643029, 175.928423],
                image: "/attached_assets/Autumn Whangamata Stream Trail -38.643029, 175.928423_1752636070986.jpeg",
                description: "Autumn colors on Whangamata Stream Trail"
            },
            {
                name: "Reef",
                coordinates: [-38.65984, 175.89716],
                image: "/attached_assets/Reef -38.65984, 175.89716_1752636070986.jpeg",
                description: "Underwater reef formation"
            },
            {
                name: "Whangamata Stream Trail",
                coordinates: [-38.650838, 175.926068],
                image: "/attached_assets/Whangamata Stream Trail -38.650838, 175.926068_1752636232614.jpeg",
                description: "Main Whangamata Stream Trail"
            },
            {
                name: "Secret beach",
                coordinates: [-38.658689, 175.903392],
                image: "/attached_assets/Secret beach -38.658689, 175.903392_1752636232614.jpeg",
                description: "Hidden beach location"
            },
            {
                name: "Water Taxi",
                coordinates: [-38.666216, 175.869876],
                image: "/attached_assets/Water Taxi -38.666216, 175.869876_1752636232615.jpeg",
                description: "Water taxi pickup point"
            },
            {
                name: "Water Wheel",
                coordinates: [-38.652656, 175.925255],
                image: "/attached_assets/Whang water wheel -38.652656, 175.925255_1752636232615.jpeg",
                description: "Historic water wheel on Whangamata Stream"
            },
            {
                name: "Secret beach 2",
                coordinates: [-38.658232, 175.901864],
                image: "/attached_assets/Secret beach 2 -38.658232, 175.901864_1752636232615.jpeg",
                description: "Another hidden beach location"
            },
            {
                name: "Otaketake Lookout",
                coordinates: [-38.652639, 175.901976],
                image: "/attached_assets/Otaketake Lookout -38.652639, 175.901976_1752650694790.jpeg",
                description: "Scenic lookout at Otaketake"
            },
            {
                name: "Headland lookout 4",
                coordinates: [-38.69355, 175.92276],
                image: "/attached_assets/Headland lookout 4 -38.69355, 175.92276_1752650694790.jpeg",
                description: "Fourth headland lookout viewpoint"
            },
            {
                name: "Kawakawa Bay shelter",
                coordinates: [-38.6653687, 175.8701089],
                image: "/attached_assets/Kawakawa Bay shelter -38.6653687, 175.8701089_1752650694790.jpeg",
                description: "Shelter at Kawakawa Bay"
            },
            {
                name: "First K2K bridge",
                coordinates: [-38.657325, 175.902985],
                image: "/attached_assets/First K2K bridge -38.657325, 175.902985_1752650694790.jpeg",
                description: "First bridge on K2K trail"
            },
            {
                name: "Headland loop lookout 2",
                coordinates: [-38.69392, 175.90686],
                image: "/attached_assets/Headland loop lookout 2 -38.69392, 175.90686_1752650694790.jpeg",
                description: "Second headland loop lookout"
            },
            {
                name: "Headland Loop Sign",
                coordinates: [-38.689873, 175.918365],
                image: "/attached_assets/Headland Loop Sign -38.689873, 175.918365_1752650694790.jpeg",
                description: "Trail sign for headland loop"
            },
            {
                name: "Whangamata Bay",
                coordinates: [-38.66353, 175.91364],
                image: "/attached_assets/Whangamata Bay -38.66353, 175.91364_1752650694790.jpeg",
                description: "Beautiful Whangamata Bay view"
            },
            {
                name: "K2K bay waters edge",
                coordinates: [-38.665822, 175.869972],
                image: "/attached_assets/K2K bay waters edge -38.665822, 175.869972_1752650694790.jpeg",
                description: "Waters edge at K2K bay"
            },
            {
                name: "W2K Start Headland Loop",
                coordinates: [-38.689831, 175.918128],
                image: "/attached_assets/W2K Start Headland Loop -38.689831, 175.918128_1752650694790.jpeg",
                description: "Starting point of W2K headland loop"
            },
            {
                name: "Headland loop Lookout 1",
                coordinates: [-38.68690, 175.91109],
                image: "/attached_assets/Headland loop Lookout 1 -38.68690, 175.91109_1752650694790.jpeg",
                description: "First headland loop lookout"
            },
            {
                name: "Headland loop lookout 3",
                coordinates: [-38.69988, 175.90957],
                image: "/attached_assets/Headland loop lookout 3 -38.69988, 175.90957_1752650694790.jpeg",
                description: "Third headland loop lookout"
            }
        ];

        // Points of interest with facilities and services
        this.pointsOfInterest = [
            {
                name: "General Store",
                coordinates: [-38.662909, 175.919794],
                type: "store",
                description: "Local general store for supplies and refreshments"
            },
            {
                name: "Kinloch Golf Club (Public)",
                coordinates: [-38.6634, 175.9200],
                type: "golf_public",
                description: "18-hole championship golf course open to public"
            },
            {
                name: "Kinloch Lodge Golf Course (Private)",
                coordinates: [-38.6640, 175.9180],
                type: "golf_private",
                description: "Private luxury golf course and lodge"
            },
            {
                name: "Whakaiapo Campsite",
                coordinates: [-38.6735, 175.9205],
                type: "camping",
                description: "DOC campsite at Whakaiapo Bay"
            },
            {
                name: "Kawakawa Bay Campsite",
                coordinates: [-38.6525, 175.9055],
                type: "camping",
                description: "DOC campsite at Kawakawa Bay"
            },
            {
                name: "Rock Climbing Kawakawa Bay",
                coordinates: [-38.6500, 175.9040],
                type: "climbing",
                description: "Popular rock climbing area at Kawakawa Bay"
            },
            {
                name: "Rock Climbing W2K Track Start",
                coordinates: [-38.6735, 175.9205],
                type: "climbing",
                description: "Rock climbing area near W2K track start"
            },
            {
                name: "Whangamata Stream Water Wheel",
                coordinates: [-38.652656, 175.925255],
                type: "historic",
                description: "Historic water wheel with trout viewing channel"
            },
            {
                name: "Trout Nursery",
                coordinates: [-38.6520, 175.9260],
                type: "wildlife",
                description: "Trout spawning area in Whangamata Stream"
            },
            {
                name: "Seven Oaks Access Track",
                coordinates: [-38.6580, 175.9120],
                type: "access",
                description: "Access track from Seven Oaks to K2K trail"
            }
        ];

        // Water taxi routes with costs and times
        this.waterTaxiRoutes = [
            {
                name: "Kinloch to Kawakawa Bay",
                coordinates: [
                    [-38.6634, 175.9200], // Kinloch Marina
                    [-38.6620, 175.9180],
                    [-38.6610, 175.9150],
                    [-38.6600, 175.9120],
                    [-38.6590, 175.9090],
                    [-38.6580, 175.9060],
                    [-38.6570, 175.9030],
                    [-38.6560, 175.9000],
                    [-38.6550, 175.8970],
                    [-38.6540, 175.8940],
                    [-38.6530, 175.8910],
                    [-38.6525, 175.9055] // Kawakawa Bay
                ],
                duration: "20 minutes",
                cost: "$25-35 per person",
                operator: "Bay2Bay Water Taxi",
                description: "Return water taxi from K2K trail end"
            },
            {
                name: "Kinloch to Whakaipo Bay",
                coordinates: [
                    [-38.6634, 175.9200], // Kinloch Marina
                    [-38.6650, 175.9210],
                    [-38.6670, 175.9220],
                    [-38.6690, 175.9230],
                    [-38.6710, 175.9240],
                    [-38.6735, 175.9205] // Whakaipo Bay
                ],
                duration: "15 minutes",
                cost: "$20-30 per person",
                operator: "Bay2Bay Water Taxi",
                description: "Access to W2K trail start"
            },
            {
                name: "Waihaha to Kinloch",
                coordinates: [
                    [-38.6520, 175.8650], // Kotukutuku Landing
                    [-38.6540, 175.8680],
                    [-38.6560, 175.8720],
                    [-38.6580, 175.8760],
                    [-38.6600, 175.8800],
                    [-38.6620, 175.8840],
                    [-38.6634, 175.9200] // Kinloch Marina
                ],
                duration: "30-40 minutes",
                cost: "$45-60 per person",
                operator: "Bay2Bay Water Taxi",
                description: "Return from Waihaha-Waihora trail end"
            }
        ];
    }

    initializeTrackDetails() {
        // Track details with route timing information
        this.trackDetails = [
            {
                name: "**Silver leaf Way access to K2K**",
                coordinates: [-38.657675, 175.907582],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "2.5 hours",
                        bikingTime: "1.5 hours",
                        distance: "8.5 km"
                    },
                    {
                        destination: "_Route to K2K Lookout_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "5.2 km"
                    }
                ],
                description: "K2K trail access from Silver leaf Way"
            },
            {
                name: "**Seven Oaks access to K2K**",
                coordinates: [-38.658278, 175.903462],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "2.5 hours",
                        bikingTime: "1.5 hours",
                        distance: "8.2 km"
                    },
                    {
                        destination: "_Route to K2K Lookout_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "5.0 km"
                    }
                ],
                description: "K2K trail access from Seven Oaks"
            },
            {
                name: "**Kawakawa Bay lookout**",
                coordinates: [-38.661788, 175.878577],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "2.5 hours",
                        bikingTime: "1.5 hours",
                        distance: "8.5 km"
                    }
                ],
                description: "Scenic lookout at Kawakawa Bay end of K2K trail"
            },
            {
                name: "**Lisland Drive access to K2K**",
                coordinates: [-38.659258, 175.912914],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "2.5 hours",
                        bikingTime: "1.5 hours",
                        distance: "7.8 km"
                    }
                ],
                description: "K2K trail access from Lisland Drive"
            },
            {
                name: "**Whangamata Stream Trail**",
                coordinates: [-38.659445, 175.914097],
                routes: [
                    {
                        destination: "_Route to Whangamata RD (One way)_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "4.5 km"
                    },
                    {
                        destination: "_Route to water wheel (One way)_",
                        walkingTime: "45 minutes",
                        bikingTime: "25 minutes",
                        distance: "2.8 km"
                    }
                ],
                description: "Stream trail through native forest"
            },
            {
                name: "**Water Wheel**",
                coordinates: [-38.652667, 175.925100],
                routes: [
                    {
                        destination: "_Route to Whangamata RD (One way)_",
                        walkingTime: "1 hour",
                        bikingTime: "30 minutes",
                        distance: "3.2 km"
                    }
                ],
                description: "Historic water wheel on Whangamata Stream"
            },
            {
                name: "**Whangamata Beach and Shop location**",
                coordinates: [-38.663087, 175.919850],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "2 hours",
                        bikingTime: "1 hour",
                        distance: "6.5 km"
                    }
                ],
                description: "Beach access and local facilities"
            },
            {
                name: "**Orakau Track**",
                coordinates: [-38.66464, 175.86955],
                routes: [
                    {
                        destination: "_Route to Whangamata RD (One way)_",
                        walkingTime: "2.5 hours",
                        bikingTime: "1.5 hours",
                        distance: "8.0 km"
                    }
                ],
                description: "Forest track through farmland"
            },
            {
                name: "**Orakau Track End**",
                coordinates: [-38.61543, 175.86502],
                routes: [
                    {
                        destination: "_Route to Kawakawa Bay (One way)_",
                        walkingTime: "4 hours",
                        bikingTime: "2.5 hours",
                        distance: "12.5 km"
                    }
                ],
                description: "Southern end of Orakau Track"
            },
            {
                name: "**Otaketake Track**",
                coordinates: [-38.657289, 175.901177],
                routes: [
                    {
                        destination: "_Route to Kawakawa RD (One way)_",
                        walkingTime: "3 hours",
                        bikingTime: "2 hours",
                        distance: "9.5 km"
                    }
                ],
                description: "Forest track with stream crossings"
            },
            {
                name: "**Otaketake Track End**",
                coordinates: [-38.62093, 175.88386],
                routes: [
                    {
                        destination: "_Route to K2K (One way)_",
                        walkingTime: "3.5 hours",
                        bikingTime: "2.5 hours",
                        distance: "11.0 km"
                    }
                ],
                description: "Southern end of Otaketake Track"
            },
            {
                name: "**Kinloch marina**",
                coordinates: [-38.662911, 175.921149],
                routes: [
                    {
                        destination: "_Route to start of W2K (One way)_",
                        walkingTime: "15 minutes",
                        bikingTime: "8 minutes",
                        distance: "1.2 km"
                    }
                ],
                description: "Marina with water taxi and W2K access"
            },
            {
                name: "**Whakaipo Bay Track W2K**",
                coordinates: [-38.668025, 175.924550],
                routes: [
                    {
                        destination: "_Route to Whakaipo Bay (One way)_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "4.8 km"
                    },
                    {
                        destination: "_Route to Headland Loop_",
                        walkingTime: "2 hours",
                        bikingTime: "1 hour",
                        distance: "6.2 km"
                    }
                ],
                description: "W2K trail start point"
            },
            {
                name: "**Headland Loop intersection**",
                coordinates: [-38.689479, 175.918053],
                routes: [
                    {
                        destination: "_Route around headland and back to here_",
                        walkingTime: "2 hours",
                        bikingTime: "1 hour",
                        distance: "6.5 km"
                    },
                    {
                        destination: "_Route to Whakaipo Bay_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "4.8 km"
                    }
                ],
                description: "Headland loop junction"
            },
            {
                name: "**Headland Loop & W2K intersection**",
                coordinates: [-38.693993, 175.920714],
                routes: [
                    {
                        destination: "_Route back to Headland loop intersection_",
                        walkingTime: "30 minutes",
                        bikingTime: "15 minutes",
                        distance: "2.1 km"
                    },
                    {
                        destination: "_Route to Whakaipo Bay_",
                        walkingTime: "2 hours",
                        bikingTime: "1 hour",
                        distance: "6.8 km"
                    },
                    {
                        destination: "_Route back to Kinloch Marina_",
                        walkingTime: "3 hours",
                        bikingTime: "1.5 hours",
                        distance: "9.5 km"
                    }
                ],
                description: "Main trail intersection point"
            },
            {
                name: "**Whakaiapo Bay**",
                coordinates: [-38.68270, 175.95772],
                routes: [
                    {
                        destination: "_Route back to Headland loop intersection_",
                        walkingTime: "1.5 hours",
                        bikingTime: "45 minutes",
                        distance: "4.8 km"
                    },
                    {
                        destination: "_Route back to Kinloch Marina_",
                        walkingTime: "3 hours",
                        bikingTime: "1.5 hours",
                        distance: "9.5 km"
                    }
                ],
                description: "Scenic bay at end of W2K trail"
            }
        ];
    }

    initializeWaterTaxiRoutes() {
        this.waterTaxiRoutes = [
            {
                name: "Kinloch to Waihora Bay",
                coordinates: [
                    [-38.6636300, 175.9214300],
                    [-38.6644900, 175.9190300],
                    [-38.6663500, 175.9150600],
                    [-38.6693600, 175.9085400],
                    [-38.6745200, 175.8995200],
                    [-38.6800200, 175.8892300],
                    [-38.6817600, 175.8823600],
                    [-38.6835700, 175.8749800],
                    [-38.6848398, 175.8645916],
                    [-38.6848733, 175.8548927],
                    [-38.6852400, 175.8449400],
                    [-38.6843700, 175.8303500],
                    [-38.6851700, 175.8206500],
                    [-38.6862500, 175.8123200],
                    [-38.6865147, 175.8003902],
                    [-38.6850408, 175.7897472],
                    [-38.6802837, 175.7764864]
                ],
                description: "Water taxi route to Waihora Bay"
            },
            {
                name: "Waihora Bay to Kawakawa Bay",
                coordinates: [
                    [-38.6802837, 175.7764864],
                    [-38.6850408, 175.7897472],
                    [-38.6865147, 175.8003902],
                    [-38.6862500, 175.8123200],
                    [-38.6851700, 175.8206500],
                    [-38.6843700, 175.8303500],
                    [-38.6820928, 175.8388853],
                    [-38.6787100, 175.8461800],
                    [-38.6750200, 175.8533000],
                    [-38.6707686, 175.8596134],
                    [-38.6680043, 175.8629179],
                    [-38.6660100, 175.8656200],
                    [-38.6646400, 175.8674900],
                    [-38.6643350, 175.8687110]
                ],
                description: "Water taxi route between bays"
            },
            {
                name: "Kinloch to Kawakawa Bay",
                coordinates: [
                    [-38.6636300, 175.9214300],
                    [-38.6644900, 175.9190300],
                    [-38.6663500, 175.9150600],
                    [-38.6693600, 175.9085400],
                    [-38.6745200, 175.8995200],
                    [-38.6800200, 175.8892300],
                    [-38.6817600, 175.8823600],
                    [-38.6818900, 175.8766100],
                    [-38.6810900, 175.8683700],
                    [-38.6777400, 175.8639900],
                    [-38.6705000, 175.8636500],
                    [-38.6673300, 175.8652400],
                    [-38.6652700, 175.8670600],
                    [-38.6643350, 175.8687110]
                ],
                description: "Direct water taxi route to Kawakawa Bay"
            }
        ];
        
        // Water taxi pickup point at Kinloch Marina (updated location)
        this.waterTaxiPickup = {
            name: "Venture Beyond Water Taxi",
            coordinates: [-38.6636300, 175.9214300],
            description: "Water taxi services to western bays",
            website: "https://www.venturebeyond.nz/",
            services: [
                "Kinloch to Waihora Bay: $85 per person",
                "Kinloch to Kawakawa Bay: $65 per person", 
                "Return trips available",
                "Scenic waterfall tours",
                "Great Lake Trails transport"
            ],
            operatingHours: "Daily departures - bookings essential",
            contact: "Book online or call for availability"
        };
    }

    addTrailsToMap() {
        // Trail lines removed per user request
        this.trailLayers = [];
    }

    addPointsOfInterestToMap() {
        // Points of interest markers removed - only GPS image markers with white borders remain
        this.poiLayers = [];
    }

    addGPSImagesToMap() {
        // Clear existing GPS image layers
        if (this.imageMarkers) {
            this.imageMarkers.forEach(marker => {
                this.map.removeLayer(marker);
            });
        }
        this.imageMarkers = [];

        // Filter out GPS images that don't have valid image files
        const validGPSImages = this.gpsImages.filter(imageData => 
            imageData.image && imageData.image.length > 0
        );

        validGPSImages.forEach(imageData => {
            // Create a larger invisible circle for easier clicking
            const clickArea = L.circleMarker(imageData.coordinates, {
                radius: 15,
                fillColor: 'transparent',
                color: 'transparent',
                weight: 0,
                opacity: 0,
                fillOpacity: 0
            }).addTo(this.map);

            // Create the visible red dot
            const marker = L.circleMarker(imageData.coordinates, {
                radius: 6,
                fillColor: '#ff0000',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(this.map);



            // Add click events to both the clickArea and visible marker
            const showPopup = (e) => {
                this.showImagePopup(imageData, e.latlng);
            };

            clickArea.on('click', showPopup);
            marker.on('click', showPopup);
            marker.on('mouseover', showPopup);

            this.imageMarkers.push(marker);
            this.imageMarkers.push(clickArea);
        });

        // Initialize marker size update on first load
        this.updateMarkerSize();
    }

    addTrackDetailsToMap() {
        // Create blue dots for track details with route timing information
        this.trackMarkers = [];
        
        this.trackDetails.forEach((track, index) => {
            // Create blue dot with white border for track details
            const marker = L.circleMarker(track.coordinates, {
                radius: 8,
                fillColor: '#4169E1',
                color: '#FFFFFF',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            });
            
            // Add click event to show track details
            marker.on('click', (e) => {
                this.showTrackDetails(track, e.latlng);
            });
            
            // Store marker for visibility control
            this.trackMarkers.push(marker);
        });
        
        console.log(`KinlochMap: Created ${this.trackMarkers.length} track detail markers`);
    }

    addWaterTaxiRoutesToMap() {
        // Clear existing water taxi layers
        if (this.waterTaxiLayers) {
            this.waterTaxiLayers.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
        this.waterTaxiLayers = [];

        // Add water taxi routes as dark blue dashed lines with smooth curves
        this.waterTaxiRoutes.forEach(route => {
            const polyline = L.polyline(route.coordinates, {
                color: '#003366',
                weight: 3,
                opacity: 0.20,
                dashArray: '10, 10',
                smoothFactor: 3.0,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(this.map);

            this.waterTaxiLayers.push(polyline);

            // Add dark blue dot only at the start point with travel time
            const startCoord = route.coordinates[0];

            // Start point dot with travel time
            const startDot = L.circleMarker(startCoord, {
                radius: 8,
                fillColor: '#003366',
                color: '#FFFFFF',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(this.map);

            // Add click handler for route times
            startDot.on('click', (e) => {
                this.showWaterTaxiRouteTime(route, 'start', e.latlng);
            });

            this.waterTaxiLayers.push(startDot);
        });

        // Add water taxi pickup point (dark blue dot)
        const taxiMarker = L.circleMarker(this.waterTaxiPickup.coordinates, {
            radius: 10,
            fillColor: '#003366',
            color: '#FFFFFF',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(this.map);

        taxiMarker.on('click', (e) => {
            this.showWaterTaxiInfo(this.waterTaxiPickup, e.latlng);
        });

        this.waterTaxiLayers.push(taxiMarker);
    }

    addMapKey() {
        console.log('addMapKey function called');
        
        // Remove any existing map keys (both classes)
        const existingKeys = document.querySelectorAll('.map-key-fixed, .map-key');
        existingKeys.forEach(key => key.remove());
        
        // Create key element with fixed positioning to viewport
        const keyDiv = document.createElement('div');
        keyDiv.className = 'map-key';
        // Use CSS class styling instead of inline styles
        
        keyDiv.innerHTML = `
            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #fff;">KEY</h4>
            <div style="display: flex; align-items: center; margin: 8px 0;">
                <div style="width: 12px; height: 12px; background: #FF0000; border: 2px solid #FFFFFF; border-radius: 50%; margin-right: 10px; flex-shrink: 0;"></div>
                <span style="color: #fff;">Click to show images of locations.</span>
            </div>
            <div style="display: flex; align-items: center; margin: 8px 0;">
                <div style="width: 12px; height: 12px; background: #4169E1; border: 2px solid #FFFFFF; border-radius: 50%; margin-right: 10px; flex-shrink: 0;"></div>
                <span style="color: #fff;">Click for track details.</span>
            </div>
            <div style="display: flex; align-items: center; margin: 8px 0;">
                <div style="width: 20px; height: 3px; background: #003366; margin-right: 10px; border-style: dashed; border-width: 1px 0; border-color: #003366; flex-shrink: 0;"></div>
                <span style="color: #fff;">Water taxi route.</span>
            </div>
            <div style="display: flex; align-items: center; margin: 8px 0;">
                <div style="width: 12px; height: 12px; background: #003366; border: 2px solid #FFFFFF; border-radius: 50%; margin-right: 10px; flex-shrink: 0;"></div>
                <span style="color: #fff;">Water taxi information.</span>
            </div>
        `;
        
        // Add to document body for fixed positioning
        document.body.appendChild(keyDiv);
        
        console.log('Map key added to body with fixed positioning:', keyDiv);
        
        // Double-check it's visible
        setTimeout(() => {
            const addedKey = document.querySelector('.map-key');
            if (addedKey) {
                console.log('Map key confirmed in DOM:', addedKey.getBoundingClientRect());
            } else {
                console.error('Map key not found in DOM after adding');
            }
        }, 100);
    }

    showTrackDetails(track, latlng) {
        // Generate routes HTML with proper formatting
        let routesHTML = '';
        if (track.routes && track.routes.length > 0) {
            track.routes.forEach(route => {
                routesHTML += `
                    <div style="margin: 15px 0; padding: 10px; background: #333333; border-radius: 5px;">
                        <div style="font-weight: bold; color: #ffffff; margin-bottom: 8px;">
                            ${route.destination}
                        </div>
                        <div style="margin: 5px 0; color: #ffffff;">
                            <strong>Distance:</strong> ${route.distance}
                        </div>
                        <div style="margin: 5px 0; color: #ffffff;">
                            <strong>Walk time:</strong> ${route.walkingTime}
                        </div>
                        <div style="margin: 5px 0; color: #ffffff;">
                            <strong>Ride Time:</strong> ${route.bikingTime}
                        </div>
                    </div>
                `;
            });
        }

        const popupContent = `
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 400px;
                padding: 15px;
                background-color: #000000;
                border-radius: 8px;
                color: #ffffff;
            ">
                <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px; font-weight: bold;">
                    ${track.name}
                </h3>
                <div style="margin: 10px 0 15px 0; font-style: italic; color: #cccccc;">
                    ${track.description}
                </div>
                ${routesHTML}
            </div>
        `;

        L.popup({
            maxWidth: 450,
            className: 'track-details-popup'
        })
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(this.map);
    }

    showWaterTaxiInfo(taxiInfo, latlng) {
        const popupContent = `
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 400px;
                padding: 15px;
            ">
                <img src="/attached_assets/Water Taxi -38.666216, 175.869876_1752636232615.jpeg" 
                     style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;" 
                     alt="Water Taxi">
                
                <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 18px; font-weight: bold;">
                    ${taxiInfo.name}
                </h3>
                
                <div style="margin: 15px 0;">
                    <strong>Services & Pricing:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${taxiInfo.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Operating Hours:</strong> ${taxiInfo.operatingHours}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Booking:</strong> ${taxiInfo.contact}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Route Times:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        <li>Kinloch to Waihora Bay: 45 minutes</li>
                        <li>Kinloch to Kawakawa Bay: 30 minutes</li>
                    </ul>
                </div>
                
                <div style="margin: 20px 0 0 0; text-align: center;">
                    <a href="${taxiInfo.website}" target="_blank" style="
                        display: inline-block;
                        background: #003366;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">Visit Website</a>
                </div>
                
                <div style="margin: 15px 0 0 0; font-style: italic; color: #666; text-align: center;">
                    Experience the hidden western bays of Lake Taupo with professional water taxi services.
                </div>
            </div>
        `;

        L.popup({
            maxWidth: 450,
            className: 'water-taxi-popup'
        })
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(this.map);
    }

    showWaterTaxiRouteTime(route, pointType, latlng) {
        let timeInfo = '';
        
        if (route.name === "Kinloch to Waihora Bay") {
            timeInfo = "Journey time: 45 minutes";
        } else if (route.name === "Waihora Bay to Kawakawa Bay") {
            timeInfo = "Journey time: 25 minutes";
        } else if (route.name === "Kinloch to Kawakawa Bay") {
            timeInfo = "Journey time: 30 minutes";
        }

        const popup = L.popup({
            closeButton: true,
            className: 'custom-popup route-time-popup'
        }).setLatLng(latlng).setContent(`
            <div class="popup-content">
                <h4>${route.name}</h4>
                <p><strong>${timeInfo}</strong></p>
                <p>${route.description}</p>
            </div>
        `).openOn(this.map);
    }

    updateMarkerSize() {
        const zoom = this.map.getZoom();
        const baseRadius = 6;
        const minRadius = 3;
        const maxRadius = 10;
        
        // Calculate radius based on zoom level (higher zoom = larger markers)
        let newRadius = baseRadius + (zoom - 12) * 0.8;
        newRadius = Math.max(minRadius, Math.min(maxRadius, newRadius));

        // Update all image markers
        this.imageMarkers.forEach(marker => {
            if (marker instanceof L.CircleMarker && marker.options.fillColor === '#ff0000') {
                marker.setRadius(newRadius);
            }
        });
        

    }
    
    addDiscoverBox() {
        console.log('addDiscoverBox function called');
        
        // Remove any existing discover boxes first
        const existingBoxes = document.querySelectorAll('.discover-kinloch-box, .discover-box');
        existingBoxes.forEach(box => box.remove());
        
        // Create discover box element following the same pattern as map key
        const discoverBox = document.createElement('div');
        discoverBox.className = 'discover-box';
        // Use CSS class styling instead of inline styles to avoid duplicates
        
        discoverBox.innerHTML = `
            <h3>Discover Kinloch</h3>
            <p>Explore the beauty and adventure Kinloch has to offer with our interactive navigation guide. Find detailed track times, distances, and difficulty levels, along with points of interest, local attractions, scenic images, and live weather updates—everything you need to plan your perfect day out!</p>
            <div class="discover-close">Click to remove</div>
        `;
        
        // Add click handler to remove the box
        discoverBox.addEventListener('click', () => {
            discoverBox.style.display = 'none';
        });
        
        // Add to body like the map key
        document.body.appendChild(discoverBox);
        console.log('Discover box added to body with fixed positioning:', discoverBox.getBoundingClientRect());
        
        // Store reference for visibility control
        this.discoverBox = discoverBox;
    }
    
    setupDiscoverBoxRemoval() {
        if (this.discoverBox) {
            // Make entire box clickable to remove
            this.discoverBox.addEventListener('click', () => {
                this.discoverBox.style.display = 'none';
            });
        }
    }

    addWeatherWidget() {
        console.log('addWeatherWidget function called');
        
        // Remove any existing weather widget first
        const existingWeatherWidget = document.querySelector('.weather-widget');
        if (existingWeatherWidget) {
            existingWeatherWidget.remove();
        }
        
        // Create weather widget element following the same pattern as discover box
        const weatherWidget = document.createElement('div');
        weatherWidget.className = 'weather-widget';
        weatherWidget.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            left: 20px !important;
            background: rgba(0, 0, 0, 0.5) !important;
            border-radius: 15px !important;
            padding: 20px !important;
            max-width: 300px !important;
            min-width: 280px !important;
            z-index: 1000 !important;
            pointer-events: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            transition: opacity 0.3s ease !important;
            color: #ffffff !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            cursor: pointer !important;
        `;
        
        weatherWidget.innerHTML = `
            <div id="weather-current">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div id="weather-icon" style="font-size: 24px; margin-right: 10px;">🌤️</div>
                    <div>
                        <div style="font-size: 16px; font-weight: bold;">Kinloch, NZ</div>
                        <div id="weather-temp" style="font-size: 20px; font-weight: bold;">--°C</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <div>💨 <span id="weather-wind">--</span></div>
                    <div>💧 <span id="weather-humidity">--</span></div>
                </div>
                <div style="text-align: center; font-size: 12px; margin-top: 10px; opacity: 0.7;">
                    Click for 7-day forecast
                </div>
            </div>
            <div id="weather-forecast" style="display: none; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">7-Day Forecast</div>
                <div id="forecast-content"></div>
            </div>
        `;
        
        // Add to body like the discover box
        document.body.appendChild(weatherWidget);
        console.log('Weather widget added to body with fixed positioning:', weatherWidget.getBoundingClientRect());
        
        // Store reference for visibility control
        this.weatherWidget = weatherWidget;
        
        // Load weather data
        this.loadWeatherData();
        
        // Set up click handler for forecast expansion
        this.setupWeatherWidgetExpansion();
    }

    async loadWeatherData() {
        try {
            // Kinloch, Waikato coordinates
            const lat = -38.6634;
            const lon = 175.9200;
            
            // Fetch current weather and 7-day forecast from Open-Meteo API
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Pacific/Auckland&forecast_days=7`);
            
            const data = await response.json();
            console.log('Weather data loaded:', data);
            
            // Update current weather
            this.updateCurrentWeather(data.current);
            
            // Update 7-day forecast
            this.updateForecast(data.daily);
            
        } catch (error) {
            console.error('Error loading weather data:', error);
            document.getElementById('weather-temp').textContent = 'Error';
        }
    }

    updateCurrentWeather(current) {
        const temp = Math.round(current.temperature_2m);
        const humidity = current.relative_humidity_2m;
        const windSpeed = Math.round(current.wind_speed_10m);
        const windDirection = this.getWindDirection(current.wind_direction_10m);
        const weatherIcon = this.getWeatherIcon(current.weather_code);
        
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        document.getElementById('weather-icon').textContent = weatherIcon;
        document.getElementById('weather-wind').textContent = `${windSpeed} km/h ${windDirection}`;
        document.getElementById('weather-humidity').textContent = `${humidity}%`;
    }

    updateForecast(daily) {
        const forecastContent = document.getElementById('forecast-content');
        let forecastHtml = '';
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Today' : days[date.getDay()];
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const precipitation = Math.round(daily.precipitation_sum[i]);
            const weatherIcon = this.getWeatherIcon(daily.weather_code[i]);
            
            forecastHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0; padding: 5px 0;">
                    <div style="min-width: 50px;">${dayName}</div>
                    <div style="font-size: 16px;" title="Weather code: ${daily.weather_code[i]}">${weatherIcon}</div>
                    <div style="text-align: right;">
                        <span style="font-weight: bold;">${maxTemp}°</span> / ${minTemp}°
                        ${precipitation > 0 ? ` 💧${precipitation}mm` : ''}
                    </div>
                </div>
            `;
        }
        
        forecastContent.innerHTML = forecastHtml;
    }

    getWeatherIcon(weatherCode) {
        const weatherIcons = {
            0: '☀',   // Clear sky - simple sun
            1: '⛅',   // Mainly clear - sun behind small cloud
            2: '⛅',   // Partly cloudy
            3: '☁',   // Overcast - cloud only
            45: '≡',  // Fog - horizontal lines
            48: '≡',  // Depositing rime fog
            51: '☂',  // Light drizzle - simple umbrella
            53: '☂',  // Moderate drizzle
            55: '☂',  // Dense drizzle
            61: '☂',  // Slight rain
            63: '☂',  // Moderate rain
            65: '☂',  // Heavy rain
            71: '❄',  // Slight snow
            73: '❄',  // Moderate snow
            75: '❄',  // Heavy snow
            80: '☂',  // Light rain showers
            81: '☂',  // Moderate rain showers
            82: '☂',  // Heavy rain showers
            95: '⚡',  // Thunderstorm - lightning bolt
            96: '⚡',  // Thunderstorm with hail
            99: '⚡'   // Thunderstorm with heavy hail
        };
        
        return weatherIcons[weatherCode] || '⛅';
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16];
    }

    setupWeatherWidgetExpansion() {
        if (this.weatherWidget) {
            this.weatherWidget.addEventListener('click', () => {
                const forecast = document.getElementById('weather-forecast');
                if (forecast.style.display === 'none' || forecast.style.display === '') {
                    forecast.style.display = 'block';
                } else {
                    forecast.style.display = 'none';
                }
            });
        }
    }

    showImagePopup(imageData, latlng) {
        const popup = L.popup({
            maxWidth: 680,
            className: 'image-popup-clear',
            closeButton: true,
            autoClose: true
        })
        .setLatLng(latlng)
        .setContent(`
            <div class="image-popup-content" style="text-align: center; padding: 0; background: transparent;">
                <div class="image-container" style="
                    width: 640px; 
                    height: 386px; 
                    border: 15px solid white; 
                    border-radius: 30px; 
                    overflow: hidden; 
                    display: block; 
                    background: transparent; 
                    margin: 0 auto; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: relative;
                ">
                    <img src="${imageData.image}" style="
                        width: 100%; 
                        height: 100%; 
                        object-fit: cover;
                        display: block;
                        border-radius: 15px;
                    " alt="${imageData.name}" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\"color: #666; font-size: 12px; text-align: center; padding: 15px; font-style: italic; background: rgba(255,255,255,0.9); border-radius: 15px;\\">Image not available</div>';">
                </div>
                <div style="
                    text-align: center; 
                    margin-top: 10px; 
                    font-size: 16px; 
                    font-weight: bold; 
                    color: #333; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">${imageData.name}</div>
            </div>
        `)
        .openOn(this.map);
    }

    showTrailInfo(trail, latlng) {
        const highlightsHtml = trail.highlights ? 
            `<p><strong>Highlights:</strong> ${trail.highlights.join(', ')}</p>` : '';
        
        const popup = L.popup({
            maxWidth: 300,
            className: 'trail-popup'
        })
            .setLatLng(latlng)
            .setContent(`
                <div class="trail-popup">
                    <h4>${trail.name}</h4>
                    <p><strong>Distance:</strong> ${trail.distance}</p>
                    <p><strong>Walking Time:</strong> ${trail.walkingTime}</p>
                    <p><strong>Cycling Time:</strong> ${trail.cyclingTime}</p>
                    <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
                    <p>${trail.description}</p>
                    ${highlightsHtml}
                </div>
            `)
            .openOn(this.map);
    }

    showPOIInfo(poi, latlng) {
        const popup = L.popup()
            .setLatLng(latlng)
            .setContent(`
                <div class="poi-popup">
                    <h4>${poi.name}</h4>
                    <p><strong>Type:</strong> ${poi.type}</p>
                    <p>${poi.description}</p>
                </div>
            `)
            .openOn(this.map);
    }

    addWaterTaxiRoutes() {
        // Clear existing water taxi route layers
        if (this.taxiRouteLayeres) {
            this.taxiRouteLayeres.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
        this.taxiRouteLayeres = [];

        this.waterTaxiRoutes.forEach(route => {
            const polyline = L.polyline(route.coordinates, {
                color: '#0066CC',
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 5'
            }).addTo(this.map);

            polyline.on('click', (e) => {
                const popup = L.popup({
                    maxWidth: 250,
                    className: 'water-taxi-popup'
                })
                    .setLatLng(e.latlng)
                    .setContent(`
                        <div class="water-taxi-popup">
                            <h4>${route.name}</h4>
                            <p><strong>Duration:</strong> ${route.duration}</p>
                            <p><strong>Cost:</strong> ${route.cost}</p>
                            <p><strong>Operator:</strong> ${route.operator}</p>
                            <p style="font-size: 10px; color: #666;">${route.description}</p>
                        </div>
                    `)
                    .openOn(this.map);
            });

            this.taxiRouteLayeres.push(polyline);
        });
    }

    toggleMapVisibility(showWelcome) {
        console.log('KinlochMap: toggleMapVisibility called with showWelcome:', showWelcome);
        const mapKey = document.querySelector('.map-key');
        const discoverBox = document.querySelector('.discover-kinloch-box');
        const weatherWidget = document.querySelector('.weather-widget');
        
        if (showWelcome) {
            // Welcome mode - show 20% more map (increased opacity from 0.3 to 0.5)
            this.currentLayer.setOpacity(0.9);
            document.getElementById(this.containerId).style.backgroundColor = 'transparent';
            // Hide map key
            if (mapKey) {
                mapKey.style.display = 'none';
                mapKey.style.visibility = 'hidden';
                mapKey.style.opacity = '0';
            }
            // Hide discover box
            if (discoverBox) {
                discoverBox.style.display = 'none';
                discoverBox.style.visibility = 'hidden';
                discoverBox.style.opacity = '0';
            }
            // Hide weather widget
            if (weatherWidget) {
                weatherWidget.style.display = 'none';
                weatherWidget.style.visibility = 'hidden';
                weatherWidget.style.opacity = '0';
            }
            // Hide all map markers and lines
            this.hideMapElements();
            console.log('KinlochMap: Set to welcome mode, key and markers hidden');
        } else {
            // Map mode - full opacity to show authentic OpenStreetMap trails
            this.currentLayer.setOpacity(1.0);
            document.getElementById(this.containerId).style.backgroundColor = 'transparent';
            // Show map key
            if (mapKey) {
                mapKey.style.display = 'block';
                mapKey.style.visibility = 'visible';
                mapKey.style.opacity = '1';
            }
            // Show discover box
            if (discoverBox) {
                discoverBox.style.display = 'block';
                discoverBox.style.visibility = 'visible';
                discoverBox.style.opacity = '1';
            }
            // Show weather widget
            if (weatherWidget) {
                weatherWidget.style.display = 'block';
                weatherWidget.style.visibility = 'visible';
                weatherWidget.style.opacity = '1';
            }
            // Show all map markers and lines
            this.showMapElements();
            console.log('KinlochMap: Set to map mode, key and markers visible');
        }
    }

    hideMapElements() {
        // Hide GPS image markers (red dots)
        if (this.imageMarkers) {
            this.imageMarkers.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
        
        // Hide track detail markers (blue dots)
        if (this.trackMarkers) {
            this.trackMarkers.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
        
        // Hide water taxi routes (dashed lines)
        if (this.taxiRouteLayeres) {
            this.taxiRouteLayeres.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
        
        // Hide water taxi markers (dark blue dots)
        if (this.waterTaxiLayers) {
            this.waterTaxiLayers.forEach(layer => {
                this.map.removeLayer(layer);
            });
        }
    }

    showMapElements() {
        // Show GPS image markers (red dots)
        if (this.imageMarkers) {
            this.imageMarkers.forEach(layer => {
                this.map.addLayer(layer);
            });
        }
        
        // Show track detail markers (blue dots)
        if (this.trackMarkers) {
            this.trackMarkers.forEach(layer => {
                this.map.addLayer(layer);
            });
        }
        
        // Show water taxi routes (dashed lines)
        if (this.taxiRouteLayeres) {
            this.taxiRouteLayeres.forEach(layer => {
                this.map.addLayer(layer);
            });
        }
        
        // Show water taxi markers (dark blue dots)
        if (this.waterTaxiLayers) {
            this.waterTaxiLayers.forEach(layer => {
                this.map.addLayer(layer);
            });
        }
    }
}

// Make KinlochMap available globally but don't auto-initialize
window.KinlochMap = KinlochMap;

// Initialize only when explicitly called (for compatibility)
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, KinlochMap class available');
    
    // Only initialize if we're on a page that has a map container
    if (document.getElementById('map')) {
        console.log('Map container found, but waiting for explicit initialization');
    } else {
        console.log('No map container found, skipping initialization');
    }
});
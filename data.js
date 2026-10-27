/**
 * AI Traveller - Comprehensive Indian Destinations & Travel Dataset
 * Illustrative travel data with realistic rates, attractions, hotels, and logistics.
 */

const TRAVEL_DATA = {
  // Common origin cities and approximate driving/travel distances (in km) to destinations
  // Used to calibrate realistic transport costs per person
  origins: [
    { id: "agra", name: "Agra", state: "Uttar Pradesh" },
    { id: "delhi", name: "Delhi NCR", state: "Delhi" },
    { id: "jaipur", name: "Jaipur", state: "Rajasthan" },
    { id: "mumbai", name: "Mumbai", state: "Maharashtra" },
    { id: "bangalore", name: "Bangalore", state: "Karnataka" },
    { id: "chandigarh", name: "Chandigarh", state: "Punjab/Haryana" },
    { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh" },
    { id: "kolkata", name: "Kolkata", state: "West Bengal" },
    { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat" }
  ],

  // Distances in km between major origins and destinations for transport cost scaling
  distances: {
    "agra": {
      "jaipur": 240, "rishikesh": 380, "shimla": 520, "manali": 740,
      "udaipur": 630, "varanasi": 600, "amritsar": 650, "mussoorie": 430,
      "nainital": 340, "goa": 1720, "agra": 0, "delhi": 210
    },
    "delhi": {
      "jaipur": 280, "rishikesh": 240, "shimla": 340, "manali": 530,
      "udaipur": 660, "varanasi": 820, "amritsar": 450, "mussoorie": 290,
      "nainital": 300, "goa": 1880, "agra": 210, "delhi": 0
    },
    "jaipur": {
      "jaipur": 0, "rishikesh": 500, "shimla": 600, "manali": 790,
      "udaipur": 395, "varanasi": 840, "amritsar": 670, "mussoorie": 550,
      "nainital": 560, "goa": 1520, "agra": 240, "delhi": 280
    },
    "mumbai": {
      "jaipur": 1150, "rishikesh": 1600, "shimla": 1720, "manali": 1940,
      "udaipur": 760, "varanasi": 1500, "amritsar": 1700, "mussoorie": 1650,
      "nainital": 1620, "goa": 580, "agra": 1200, "delhi": 1400
    },
    "bangalore": {
      "jaipur": 1950, "rishikesh": 2350, "shimla": 2450, "manali": 2680,
      "udaipur": 1700, "varanasi": 1850, "amritsar": 2500, "mussoorie": 2400,
      "nainital": 2380, "goa": 560, "agra": 1880, "delhi": 2150
    },
    "chandigarh": {
      "jaipur": 500, "rishikesh": 210, "shimla": 115, "manali": 300,
      "udaipur": 880, "varanasi": 1050, "amritsar": 230, "mussoorie": 190,
      "nainital": 450, "goa": 2050, "agra": 470, "delhi": 250
    },
    "lucknow": {
      "jaipur": 570, "rishikesh": 510, "shimla": 760, "manali": 980,
      "udaipur": 950, "varanasi": 310, "amritsar": 890, "mussoorie": 580,
      "nainital": 390, "goa": 1780, "agra": 330, "delhi": 530
    }
  },

  // Base transport rate multipliers per km per person (round trip factor included)
  transportRates: {
    train: { baseRatePerKm: 2.2, minFare: 500, speedLabel: "Comfortable AC Chair Car / 3-Tier" },
    bus: { baseRatePerKm: 1.8, minFare: 400, speedLabel: "AC Volvo Sleeper / Semi-Sleeper" },
    car: { baseRatePerKm: 4.8, minFare: 1200, speedLabel: "Dedicated Outstation Cab / Fuel" },
    flight: { baseRatePerKm: 7.5, minFare: 3500, speedLabel: "Domestic Flight (Direct/Connecting)" }
  },

  // Comprehensive destinations list (all 12 required destinations from India)
  destinations: [
    {
      id: "jaipur",
      name: "Jaipur",
      state: "Rajasthan",
      country: "India",
      latitude: 26.9124,
      longitude: 75.7873,
      aliases: ["jaipur", "pink city", "rajasthan", "amer"],
      category: "Heritage",
      tagline: "The Majestic Pink City of Royals & Palaces",
      description: "Immerse yourself in Rajasthan's royal heritage with awe-inspiring hilltop forts, ornate pink sandstone palaces, lively bazaars, and delectable Rajputana cuisine.",
      heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603288940356-9b044c50cbe1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["History", "Shopping", "Food", "Heritage", "Temples"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "October to March",
      climate: "Pleasant winters (12°C - 24°C), Warm summers",
      
      // Daily local expenses
      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 700,
        premium: 1400
      },
      dailyLocalTransportGroup: {
        budget: 600,
        standard: 1200,
        premium: 2200
      },

      // Recommended hotels linked to this destination
      hotels: [
        {
          id: "jpr-h1",
          name: "Heritage Haveli Stay & Inn",
          tier: "Budget",
          area: "Bani Park, Jaipur",
          nightlyRate: 1600,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["Free Wi-Fi", "Courtyard Restaurant", "AC", "Travel Desk"],
          description: "Charming traditional Rajasthani courtyard architecture with authentic hospitality and proximity to the railway station.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "jpr-h2",
          name: "Royal Orchid Central Jaipur",
          tier: "Standard",
          area: "MI Road, Jaipur",
          nightlyRate: 3200,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Rooftop Pool", "Buffet Breakfast", "City View", "Free Parking"],
          description: "Contemporary 4-star comfort located in the vibrant heart of the city, walking distance from local craft markets.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "jpr-h3",
          name: "Shahpura Haveli & Palace Suites",
          tier: "Premium",
          area: "Amer Road, Jaipur",
          nightlyRate: 6800,
          roomCapacity: 2,
          rating: 4.8,
          amenities: ["Heritage Luxury", "Folk Performances", "Fine Dining", "Spa"],
          description: "Opulent royal suites decorated with fresco paintings, antique brass chandeliers, and panoramic views of the Aravalli hills.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      // Curated attractions with entry fees
      attractions: [
        { name: "Amber Fort & Palace", fee: 100, durationHours: 3.5, category: "History", highlights: "Sheesh Mahal, hilltop ramparts, elephant walkway" },
        { name: "Hawa Mahal (Palace of Winds)", fee: 50, durationHours: 1.5, category: "History", highlights: "953 latticed honeycomb windows, street view" },
        { name: "City Palace & Museum", fee: 300, durationHours: 2.5, category: "Heritage", highlights: "Chandra Mahal, royal textiles, armory collection" },
        { name: "Jantar Mantar Astronomical Observatory", fee: 50, durationHours: 1.5, category: "History", highlights: "World's largest stone sundial, UNESCO heritage" },
        { name: "Nahargarh Fort Sunset Viewpoint", fee: 50, durationHours: 2.0, category: "Nature", highlights: "Panoramic twilight view of the entire Jaipur city" },
        { name: "Johari & Bapu Bazaars", fee: 0, durationHours: 2.5, category: "Shopping", highlights: "Kundan jewelry, blue pottery, bandhani dupattas" },
        { name: "Birla Mandir & Albert Hall Museum", fee: 40, durationHours: 2.0, category: "Temples", highlights: "Carved white marble temple and Indo-Saracenic museum" }
      ],

      activities: [
        "Savoring Pyaz Kachori and Lassi at MI Road",
        "Watching the sunset over Nahargarh Fort with local chai",
        "Exploring royal courtyards and sound & light show at Amber",
        "Handicrafts and block-printed textiles shopping in old bazaars"
      ]
    },

    {
      id: "rishikesh",
      name: "Rishikesh",
      state: "Uttarakhand",
      country: "India",
      latitude: 30.0869,
      longitude: 78.2676,
      aliases: ["rishikesh", "laxman jhula", "uttarakhand", "ganga", "tapovan"],
      category: "Adventure",
      tagline: "Yoga Capital of the World & River Rafting Paradise",
      description: "Nestled in the Himalayan foothills along the sacred emerald Ganges, Rishikesh seamlessly combines spiritual tranquillity with high-octane white-water adventures.",
      heroImage: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1626014303757-646629f69b71?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Adventure", "Temples", "Nature", "Mountains"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "September to May",
      climate: "Refreshing mountain breeze, cool evenings (10°C - 26°C)",

      dailyFoodCostPerPerson: {
        budget: 300,
        standard: 600,
        premium: 1200
      },
      dailyLocalTransportGroup: {
        budget: 500,
        standard: 900,
        premium: 1800
      },

      hotels: [
        {
          id: "rsh-h1",
          name: "Ganga Riverside Ashray",
          tier: "Budget",
          area: "Tapovan, Rishikesh",
          nightlyRate: 1400,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Mountain View", "Free Wi-Fi", "Yoga Deck", "Organic Cafe"],
          description: "Clean, scenic backpacker-friendly lodge with yoga classes and a serene rooftop looking over Tapovan hills.",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "rsh-h2",
          name: "Divine Resort & Spa Ganges",
          tier: "Standard",
          area: "Laxman Jhula Road",
          nightlyRate: 3400,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["River Facing Balcony", "Ayurvedic Spa", "Outdoor Dining", "AC"],
          description: "Unmatched direct views of the turquoise Ganges and Laxman Jhula, featuring hearty multi-cuisine dining.",
          image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "rsh-h3",
          name: "Aloha On The Ganges Luxury Resort",
          tier: "Premium",
          area: "Tapovan Ghats",
          nightlyRate: 7500,
          roomCapacity: 2,
          rating: 4.8,
          amenities: ["Infinity Pool", "Private Ghat", "Fine Dining", "Wellness Spa"],
          description: "A 5-star haven on the river bank offering cliffside infinity pool sessions and guided morning meditation.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Triveni Ghat Evening Maha Aarti", fee: 0, durationHours: 2.0, category: "Temples", highlights: "Flute chants, thousands of floating oil lamps on the Ganges" },
        { name: "Ram Jhula & Laxman Jhula Suspension Bridges", fee: 0, durationHours: 2.0, category: "Nature", highlights: "Scenic pedestrian footbridges overlooking the rapids" },
        { name: "Beatles Ashram (Chaurasi Kutia)", fee: 150, durationHours: 2.5, category: "History", highlights: "Meditation domes, Beatles graffiti murals, tranquil forest setting" },
        { name: "Ganga White-Water Rafting (16km Shivpuri to Nim Beach)", fee: 650, durationHours: 3.5, category: "Adventure", highlights: "Thrilling Grade III rapids, cliff jumping, body surfing" },
        { name: "Neer Garh Waterfall Hike", fee: 30, durationHours: 2.5, category: "Nature", highlights: "Natural jade wading pools hidden amidst lush tropical flora" },
        { name: "Vashistha Cave (Gufa)", fee: 0, durationHours: 2.0, category: "Temples", highlights: "Ancient meditative cave right beside the riverbank" }
      ],

      activities: [
        "White water rafting along Grade III & IV Himalayan rapids",
        "Watching the mesmerizing brass-lamp Aarti at Triveni Ghat",
        "Sipping lemon ginger tea at a river-cliff cafe in Tapovan",
        "Morning yoga class overlooking the misty Ganges"
      ]
    },

    {
      id: "manali",
      name: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      latitude: 32.2574,
      longitude: 77.1748,
      aliases: ["manali", "kullu", "solang", "himachal", "rohtang", "old manali"],
      category: "Mountains",
      tagline: "Snow-Capped Peaks, Pine Valleys & Alpine Wonders",
      description: "Set on the banks of the roaring Beas River in Kullu Valley, Manali provides spectacular snowscapes, cedar pine forests, roaring waterfalls, and adventure sports.",
      heroImage: "https://images.unsplash.com/photo-1626014303757-646629f69b71?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1626014303757-646629f69b71?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Mountains", "Adventure", "Nature"],
      idealDuration: { min: 3, max: 5, label: "3 - 5 Days" },
      bestTimeToVisit: "October to June (Snow in Dec-Feb)",
      climate: "Alpine coolness, snowfall in winter (-2°C to 18°C)",

      dailyFoodCostPerPerson: {
        budget: 400,
        standard: 750,
        premium: 1500
      },
      dailyLocalTransportGroup: {
        budget: 700,
        standard: 1400,
        premium: 2600
      },

      hotels: [
        {
          id: "mnl-h1",
          name: "Snow Pine Valley Lodge",
          tier: "Budget",
          area: "Old Manali",
          nightlyRate: 1500,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["Apple Orchard View", "Wood Fireplace", "Free Wi-Fi", "Cafe"],
          description: "Traditional cedar wood construction nestled inside Old Manali's apple orchards, steps away from bohemian cafes.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "mnl-h2",
          name: "The Himalayan Pine Cottages",
          tier: "Standard",
          area: "Log Huts Area, Manali",
          nightlyRate: 3500,
          roomCapacity: 2,
          rating: 4.7,
          amenities: ["Snow Peak Views", "Hot Water 24/7", "Heated Rooms", "Restaurant"],
          description: "Spacious alpine cottages surrounded by majestic pine trees, offering warm wooden decor and panoramic balcony vistas.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "mnl-h3",
          name: "Span Resort & Luxury Spa",
          tier: "Premium",
          area: "Kullu-Manali Highway",
          nightlyRate: 8500,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Private Beas River Access", "Heated Pool", "Luxury Spa", "Gourmet Dining"],
          description: "Iconic luxury property sprawling across manicured gardens directly along the Beas River with snow mountain backdrops.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Solang Valley Snow & Adventure Park", fee: 50, durationHours: 4.0, category: "Adventure", highlights: "Ziplining, paragliding, zorbing, and ropeway cable car" },
        { name: "Atal Tunnel & Sissu Waterfall Day Excursion", fee: 0, durationHours: 4.5, category: "Mountains", highlights: "World's longest highway tunnel above 10,000 ft into Lahaul valley" },
        { name: "Hadimba Devi Ancient Wooden Temple", fee: 20, durationHours: 1.5, category: "Temples", highlights: "4-tier pagoda wooden architecture built in 1553 in deodar forest" },
        { name: "Jogini Waterfalls Trek", fee: 0, durationHours: 3.0, category: "Nature", highlights: "Picturesque forest trail passing through Apple orchards & small villages" },
        { name: "Old Manali Bohemian Street & Mall Road", fee: 0, durationHours: 2.5, category: "Shopping", highlights: "Handmade woolens, wooden souvenirs, Tibetan cafes" },
        { name: "Vashisht Natural Hot Sulphur Springs", fee: 0, durationHours: 1.5, category: "Nature", highlights: "Geothermal medicinal baths with ancient stone temples" }
      ],

      activities: [
        "Paragliding over the snow-kissed Solang Valley",
        "Driving through the engineering wonder of Atal Tunnel into Lahaul",
        "Relaxing by the rushing rapids of Beas river with hot Maggi & tea",
        "Shopping for warm Pashmina shawls and wooden craft on Mall Road"
      ]
    },

    {
      id: "udaipur",
      name: "Udaipur",
      state: "Rajasthan",
      country: "India",
      latitude: 24.5854,
      longitude: 73.7125,
      aliases: ["udaipur", "city of lakes", "lake pichola", "rajasthan", "fateh sagar"],
      category: "Heritage",
      tagline: "The Romantic City of Lakes & Marble Splendour",
      description: "Often dubbed the Venice of the East, Udaipur enchants travellers with tranquil azure lakes, shimmering white marble palaces, vibrant art studios, and rooftop dining at twilight.",
      heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Heritage", "History", "Food", "Shopping", "Nature"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "September to March",
      climate: "Temperate winter (10°C - 27°C)",

      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 700,
        premium: 1500
      },
      dailyLocalTransportGroup: {
        budget: 500,
        standard: 1000,
        premium: 2000
      },

      hotels: [
        {
          id: "udp-h1",
          name: "Lake Pichola Heritage View Inn",
          tier: "Budget",
          area: "Lal Ghat, Udaipur",
          nightlyRate: 1700,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["Rooftop Restaurant", "Lake Pichola View", "Free Wi-Fi", "AC"],
          description: "Cozy traditional guesthouse located right along Lal Ghat with stunning water views of the City Palace.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "udp-h2",
          name: "Radisson Blu Udaipur Palace Resort",
          tier: "Standard",
          area: "Fateh Sagar Lake",
          nightlyRate: 3800,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Two-Tier Pool", "Multi-Cuisine Buffet", "Garden View", "Spa"],
          description: "Upscale palatial architecture overlooking Lake Fateh Sagar with royal domes, lush lawns, and modern comfort.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "udp-h3",
          name: "The Grand Jagmandir Heritage Suites",
          tier: "Premium",
          area: "Lake Pichola Island",
          nightlyRate: 9200,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Boat Transfers", "Private Butler", "Lakefront Dining", "Royal Spa"],
          description: "Live like Mewar royalty on an exclusive island palace with marble carved arches and silver candlelit dinners.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "City Palace Complex & Crystal Gallery", fee: 330, durationHours: 3.0, category: "Heritage", highlights: "Rajasthan's largest palace complex, mirror mosaics, lake balconies" },
        { name: "Lake Pichola Sunset Boat Cruise", fee: 400, durationHours: 1.5, category: "Nature", highlights: "Gliding past Jag Mandir and the Lake Palace under golden hour" },
        { name: "Bagore Ki Haveli & Dharohar Folk Dance", fee: 100, durationHours: 2.0, category: "History", highlights: "Chari pot balance dance, Rajasthani puppet show on lakefront" },
        { name: "Saheliyon Ki Bari (Garden of the Maids)", fee: 20, durationHours: 1.5, category: "Nature", highlights: "Lush gardens, marble fountains, lotus ponds, and pavilions" },
        { name: "Sajjangarh Monsoon Palace", fee: 60, durationHours: 2.0, category: "History", highlights: "Hilltop palace commanding views across all five surrounding lakes" },
        { name: "Jagdish Temple & Hathi Pol Market", fee: 0, durationHours: 2.0, category: "Shopping", highlights: "1651 carved Vishnu temple and miniature Mewari painting stalls" }
      ],

      activities: [
        "Romantic sunset boat cruise on Lake Pichola",
        "Watching the world-famous Dharohar folk dance at Bagore Ki Haveli",
        "Dining on laal maas and dal baati at a candlelit rooftop terrace",
        "Browsing miniature paintings and handcrafted leather journals"
      ]
    },

    {
      id: "goa",
      name: "Goa",
      state: "Goa",
      country: "India",
      latitude: 15.2993,
      longitude: 74.1240,
      aliases: ["goa", "panaji", "calangute", "baga", "anjuna", "palolem"],
      category: "Beaches",
      tagline: "Sun-Drenched Beaches, Portuguese Heritage & Tropical Vibe",
      description: "India's premier coastal haven blends swaying coconut palms, golden sands, lively beach shacks, Portuguese baroque architecture, and tantalizing coastal seafood.",
      heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Beaches", "Food", "History", "Adventure", "Nature"],
      idealDuration: { min: 3, max: 6, label: "3 - 6 Days" },
      bestTimeToVisit: "November to March",
      climate: "Sunny coastal breeze, warm tropical days (22°C - 32°C)",

      dailyFoodCostPerPerson: {
        budget: 450,
        standard: 900,
        premium: 1800
      },
      dailyLocalTransportGroup: {
        budget: 700,
        standard: 1300,
        premium: 2400
      },

      hotels: [
        {
          id: "goa-h1",
          name: "Palolem Beachside Palm Haven",
          tier: "Budget",
          area: "South Goa",
          nightlyRate: 1800,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Beach Access 50m", "Free Wi-Fi", "Hammocks", "Seafood Cafe"],
          description: "Laidback coastal cottages surrounded by coconut trees, walking distance to tranquil South Goa waters.",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "goa-h2",
          name: "Fairfield by Marriott Calangute",
          tier: "Standard",
          area: "North Goa",
          nightlyRate: 3900,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Outdoor Pool", "Breakfast Included", "Fitness Center", "Bar"],
          description: "Modern comfort centrally placed in North Goa near Calangute and Baga beaches with refreshing poolside drinks.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "goa-h3",
          name: "Taj Fort Aguada Beach Resort & Spa",
          tier: "Premium",
          area: "Sinquerim, Candolim",
          nightlyRate: 9800,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Private Beach Front", "Heritage Fort View", "Jiva Spa", "Fine Dining"],
          description: "Historic 5-star cliffside sanctuary offering breathtaking Arabian Sea sunsets and vintage Portuguese elegance.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Fort Aguada & 17th Century Lighthouse", fee: 50, durationHours: 2.0, category: "History", highlights: "Panoramic view of Arabian Sea, Portuguese defense bastion" },
        { name: "Basilica of Bom Jesus (UNESCO Site)", fee: 0, durationHours: 2.0, category: "History", highlights: "St. Francis Xavier sacred tomb, baroque gilded altarpiece" },
        { name: "Calangute & Baga Beach Watersports", fee: 500, durationHours: 3.5, category: "Adventure", highlights: "Parasailing, jet ski, banana ride, energetic beach shacks" },
        { name: "Fontainhas Latin Quarter Walking Tour", fee: 0, durationHours: 2.5, category: "History", highlights: "Pastel colored Portuguese heritage houses and cozy bakeries" },
        { name: "Dudhsagar Waterfalls Safari Excursion", fee: 550, durationHours: 5.0, category: "Nature", highlights: "Four-tiered milky waterfall cascading down Western Ghats" },
        { name: "Anjuna Flea Market / Sunset Shack Session", fee: 0, durationHours: 2.5, category: "Shopping", highlights: "Bohemian jewelry, live music, fresh coconut water" }
      ],

      activities: [
        "Parasailing and jet skiing over the Arabian Sea",
        "Strolling the pastel-colored alleys of Fontainhas Latin Quarter",
        "Savoring Goan prawn curry and bebinca at a beach shack",
        "Sunset sailing cruise along the Mandovi River"
      ]
    },

    {
      id: "nainital",
      name: "Nainital",
      state: "Uttarakhand",
      country: "India",
      latitude: 29.3919,
      longitude: 79.4542,
      aliases: ["nainital", "naini lake", "uttarakhand", "kumaon", "mallital"],
      category: "Nature",
      tagline: "The Emerald Lake City in the Kumaon Hills",
      description: "Surrounded by seven towering lush green peaks, Nainital centers around the pear-shaped Naini Lake, dotted with colorful sailboats and fringed by bustling promenade markets.",
      heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1626014303757-646629f69b71?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Nature", "Mountains", "Shopping"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "March to June & September to November",
      climate: "Cool mountain temperatures (8°C - 22°C)",

      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 650,
        premium: 1300
      },
      dailyLocalTransportGroup: {
        budget: 500,
        standard: 1000,
        premium: 1900
      },

      hotels: [
        {
          id: "ntl-h1",
          name: "Lakecrest View Guest House",
          tier: "Budget",
          area: "Tallital, Nainital",
          nightlyRate: 1500,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Naini Lake View", "Free Wi-Fi", "Room Heater", "Balcony"],
          description: "Cozy hillside hotel situated close to Tallital bus stand with quick access to the lake and local eateries.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "ntl-h2",
          name: "The Manu Maharani Hotel & Spa",
          tier: "Standard",
          area: "Grassmere, Mallital",
          nightlyRate: 3600,
          roomCapacity: 2,
          rating: 4.7,
          amenities: ["Panoramic Lake View", "Heated Rooms", "Fine Dining", "Courtyard"],
          description: "Elevated resort providing pristine sweeping views of Naini lake, landscaped terraces, and warm hospitality.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "ntl-h3",
          name: "The Naini Retreat by Leisure Hotels",
          tier: "Premium",
          area: "Ayatpatta Slopes",
          nightlyRate: 7800,
          roomCapacity: 2,
          rating: 4.8,
          amenities: ["Colonial Heritage", "Bonfire Evenings", "Spa", "Forest Setting"],
          description: "Former royal summer residence of the Maharaja of Pilibhit, nestled in oak and deodar forests overlooking the valley.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Naini Lake Boating & Yachting", fee: 210, durationHours: 1.5, category: "Nature", highlights: "Paddling and gondola rides surrounded by rolling green hills" },
        { name: "Naina Devi Himalayan Temple", fee: 0, durationHours: 1.0, category: "Temples", highlights: "Sacred Shakti Peeth on the northern shore of Naini Lake" },
        { name: "Snow View Point & Aerial Ropeway Cable Car", fee: 300, durationHours: 2.5, category: "Mountains", highlights: "Cable car ride showing Nanda Devi and Trishul snow peaks" },
        { name: "Eco Cave Gardens", fee: 60, durationHours: 2.0, category: "Nature", highlights: "Interconnected natural animal-shaped caves and musical fountain" },
        { name: "Mall Road & Tibetan Bazaar Stroll", fee: 0, durationHours: 2.0, category: "Shopping", highlights: "Decorative handmade candles, woolen shawls, and steaming momos" },
        { name: "Tiffin Top (Dorothy's Seat) Hike", fee: 0, durationHours: 3.0, category: "Nature", highlights: "Pine forest trail offering 360-degree vista of Nainital town" }
      ],

      activities: [
        "Boating across the emerald waters of Naini Lake",
        "Riding the aerial ropeway for snow-peak panoramic views",
        "Exploring winding passages of Eco Cave Gardens",
        "Tasting hot thukpa and momos along Tibetan Market"
      ]
    },

    {
      id: "shimla",
      name: "Shimla",
      state: "Himachal Pradesh",
      country: "India",
      latitude: 31.1048,
      longitude: 77.1734,
      aliases: ["shimla", "kufri", "mall road", "himachal", "chail"],
      category: "Mountains",
      tagline: "The Queen of Hill Stations & Colonial Charm",
      description: "Former summer capital of British India, Shimla features Gothic Victorian architecture, the scenic pedestrian Mall Road, and panoramic vistas of snow-dusted Himalayan ranges.",
      heroImage: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1626014303757-646629f69b71?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Mountains", "History", "Nature", "Shopping"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "March to June & December to February",
      climate: "Crisp mountain climate (0°C to 20°C)",

      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 700,
        premium: 1400
      },
      dailyLocalTransportGroup: {
        budget: 600,
        standard: 1100,
        premium: 2100
      },

      hotels: [
        {
          id: "sml-h1",
          name: "Ridge View Pine Stay",
          tier: "Budget",
          area: "Near Circular Road",
          nightlyRate: 1600,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Mountain Valley View", "Room Heater", "Free Wi-Fi", "Restaurant"],
          description: "Comfortable hillside retreat situated within walking distance of the lift to Mall Road.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "sml-h2",
          name: "Radisson Hotel Shimla",
          tier: "Standard",
          area: "Goodwood Estate, Lower Jakhu",
          nightlyRate: 3700,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Heated Swimming Pool", "Cedar Forest View", "Spa", "Buffet Breakfast"],
          description: "Set amid serene deodar groves with contemporary rooms and elevated vistas of the Shivalik range.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "sml-h3",
          name: "Wildflower Hall, An Oberoi Resort",
          tier: "Premium",
          area: "Charabra, Shimla",
          nightlyRate: 9900,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Open-Air Heated Whirlpool", "Lord Kitchener Heritage", "Forest Treks", "Fine Dining"],
          description: "One of India's most celebrated mountain resorts, situated 8,250 feet above sea level in virgin pine woods.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "The Ridge & Christ Church", fee: 0, durationHours: 2.0, category: "History", highlights: "Neo-Gothic 1857 church with stained glass, open public square" },
        { name: "Jakhu Temple & Giant Hanuman Statue", fee: 0, durationHours: 2.5, category: "Temples", highlights: "Shimla's highest hill peak (8,054 ft) with ropeway cable car" },
        { name: "Mall Road & Lakkar Bazaar", fee: 0, durationHours: 2.5, category: "Shopping", highlights: "No-vehicle pedestrian walkway with heritage wooden toys and woolens" },
        { name: "Viceregal Lodge & Botanical Gardens", fee: 100, durationHours: 2.5, category: "History", highlights: "Historic British mansion where Partition talks were held" },
        { name: "Kufri Adventure Park & Snow Fun", fee: 250, durationHours: 3.5, category: "Adventure", highlights: "Horse riding, go-karting, panoramic Himalayan vistas" },
        { name: "Chadwick Falls Forest Walk", fee: 0, durationHours: 2.0, category: "Nature", highlights: "Cascading waterfall nestled in thick deodar and pine forest" }
      ],

      activities: [
        "Riding the historic UNESCO Kalka-Shimla Toy Train",
        "Evening walks along the vehicle-free Ridge and Mall Road",
        "Taking the ropeway up to Jakhu Temple above the clouds",
        "Exploring colonial British archives at Viceregal Lodge"
      ]
    },

    {
      id: "varanasi",
      name: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
      latitude: 25.3176,
      longitude: 82.9739,
      aliases: ["varanasi", "banaras", "kashi", "ganga ghats", "uttar pradesh", "sarnath"],
      category: "Spiritual",
      tagline: "The Sacred Spiritual Soul of Ancient India",
      description: "One of the oldest continuously inhabited cities on earth, Varanasi is an intoxicating sensory experience of river ghats, temple chants, incense, and profound spiritual ceremonies.",
      heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Spiritual", "Temples", "History", "Food"],
      idealDuration: { min: 2, max: 3, label: "2 - 3 Days" },
      bestTimeToVisit: "October to March",
      climate: "Pleasant winter mornings (10°C - 25°C)",

      dailyFoodCostPerPerson: {
        budget: 300,
        standard: 600,
        premium: 1200
      },
      dailyLocalTransportGroup: {
        budget: 500,
        standard: 900,
        premium: 1800
      },

      hotels: [
        {
          id: "vns-h1",
          name: "Ghatside Heritage Guesthouse",
          tier: "Budget",
          area: "Dashashwamedh Ghat",
          nightlyRate: 1400,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["Ganges River View", "Free Wi-Fi", "Rooftop Yoga", "AC"],
          description: "Centuries-old stone townhouse with a rooftop breakfast terrace right next to the main Ganga Aarti ghat.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "vns-h2",
          name: "Radisson Hotel Varanasi",
          tier: "Standard",
          area: "Cantonment, Varanasi",
          nightlyRate: 3400,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Outdoor Swimming Pool", "Buffet Breakfast", "Free Parking", "Bar"],
          description: "Peaceful 5-star haven in the clean Cantonment district, offering quiet luxury after energetic ghat explorations.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "vns-h3",
          name: "BrijRama Palace Heritage Hotel",
          tier: "Premium",
          area: "Darbhanga Ghat",
          nightlyRate: 8800,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Private Boat Arrival", "Royal Palace Interiors", "Flute Recitals", "Fine Dining"],
          description: "18th-century Maratha palace perched right on the Ganges, reached exclusively by private wooden boat.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Dashashwamedh Ghat Grand Ganga Aarti", fee: 0, durationHours: 2.0, category: "Spiritual", highlights: "Spectacular multi-tiered brass oil lamps, conch shells, devotional atmosphere" },
        { name: "Kashi Vishwanath Jyotirlinga Temple & Corridor", fee: 0, durationHours: 2.5, category: "Temples", highlights: "One of the 12 sacred Jyotirlingas with modern river corridor access" },
        { name: "Sunrise Ganges Rowing Boat Ride", fee: 250, durationHours: 2.0, category: "Spiritual", highlights: "Morning bathers, cremations at Manikarnika Ghat, ancient palatial facades" },
        { name: "Sarnath Buddhist Sacred Ruins & Museum", fee: 50, durationHours: 3.0, category: "History", highlights: "Where Lord Buddha gave his first sermon, Dhamek Stupa, Ashoka Lion Capital" },
        { name: "Assi Ghat & Subah-e-Banaras Morning Chants", fee: 0, durationHours: 2.0, category: "Spiritual", highlights: "Vedic morning fire rituals, classical Indian music, and yoga" },
        { name: "Banarasi Silk Weaver Workshops & Old Alleyways", fee: 0, durationHours: 2.5, category: "Shopping", highlights: "Handloom silk brocade weaving, authentic Banarasi saree studios" }
      ],

      activities: [
        "Drifting along the river at sunrise while temple bells chime",
        "Experiencing the grandeur of the evening Dashashwamedh Aarti",
        "Sipping thick malai lassi and hot banarasi kachori jalebi",
        "Discovering ancient Buddhist stupas and teachings in Sarnath"
      ]
    },

    {
      id: "amritsar",
      name: "Amritsar",
      state: "Punjab",
      country: "India",
      latitude: 31.6340,
      longitude: 74.8723,
      aliases: ["amritsar", "golden temple", "punjab", "wagah", "harmandir"],
      category: "Culture",
      tagline: "The Golden Temple of Peace, Valour & Gastronomy",
      description: "Heart of Punjab, Amritsar is home to the radiant Golden Temple, the patriotic Wagah Border ceremony, poignant historic memorials, and North India's most mouth-watering culinary delicacies.",
      heroImage: "https://images.unsplash.com/photo-1603288940356-9b044c50cbe1?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1603288940356-9b044c50cbe1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Temples", "History", "Food", "Culture"],
      idealDuration: { min: 2, max: 3, label: "2 - 3 Days" },
      bestTimeToVisit: "October to March",
      climate: "Crisp sunny winters (8°C - 22°C)",

      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 650,
        premium: 1300
      },
      dailyLocalTransportGroup: {
        budget: 500,
        standard: 950,
        premium: 1900
      },

      hotels: [
        {
          id: "asr-h1",
          name: "City Center Heritage Inn",
          tier: "Budget",
          area: "Heritage Street, Amritsar",
          nightlyRate: 1500,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["5 min walk to Golden Temple", "Free Wi-Fi", "AC", "24hr Desk"],
          description: "Clean, comfortable modern stay located on pedestrian-only Heritage Street right opposite Town Hall.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "asr-h2",
          name: "Hyatt Regency Amritsar",
          tier: "Standard",
          area: "MBM Farms, GT Road",
          nightlyRate: 3500,
          roomCapacity: 2,
          rating: 4.7,
          amenities: ["Outdoor Pool", "Punjab Bistro", "Complimentary Shuttle to Temple", "Spa"],
          description: "Luxury upscale property offering renowned Punjabi hospitality, plush bedding, and an exquisite breakfast buffet.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "asr-h3",
          name: "Welcomheritage Ranjit's SVAASA",
          tier: "Premium",
          area: "Mall Road, Amritsar",
          nightlyRate: 7200,
          roomCapacity: 2,
          rating: 4.8,
          amenities: ["200-Year Heritage Haveli", "Organic Dining", "Ayurvedic Spa", "Lush Lawn"],
          description: "Stately 19th-century colonial brick haveli with courtyard dining, vintage heirlooms, and tranquility.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Harmandir Sahib (The Golden Temple) & Amrit Sarovar", fee: 0, durationHours: 3.5, category: "Temples", highlights: "Gold-gilded sanctum, 24/7 community Langar kitchen serving 100k daily" },
        { name: "Wagah Border Beating Retreat Ceremony", fee: 0, durationHours: 4.0, category: "Culture", highlights: "Electrifying military drill and patriotic retreat with neighboring Pakistan" },
        { name: "Jallianwala Bagh Historic Memorial", fee: 0, durationHours: 1.5, category: "History", highlights: "Bullet-marked martyrs' wall, eternal flame, and museum gallery" },
        { name: "Partition Museum at Town Hall", fee: 20, durationHours: 2.0, category: "History", highlights: "Moving oral history archives, personal artifacts, and refugee testimonials" },
        { name: "Gobindgarh Fort & Sound-Light Show", fee: 150, durationHours: 2.5, category: "History", highlights: "Historic Sikh defense fortress with 7D Maharaja Ranjit Singh show" },
        { name: "Legendary Street Food Trail (Kesar Da Dhaba & Kulchas)", fee: 100, durationHours: 2.0, category: "Food", highlights: "Crisp butter-dripping Amritsari kulcha, dal makhani, and sweet lassi" }
      ],

      activities: [
        "Volunteering at the historic Langar kitchen in the Golden Temple",
        "Cheering enthusiastically at the high-energy Wagah Border ceremony",
        "Savoring piping hot Amritsari kulchas loaded with desi ghee",
        "Reflecting on national history at Partition Museum"
      ]
    },

    {
      id: "mussoorie",
      name: "Mussoorie",
      state: "Uttarakhand",
      country: "India",
      latitude: 30.4598,
      longitude: 78.0644,
      aliases: ["mussoorie", "queen of hills", "kempty falls", "uttarakhand", "dehradun", "mall road mussoorie"],
      category: "Mountains",
      tagline: "The Majestic Queen of the Hills with Doon Valley Views",
      description: "Perched atop a horseshoe ridge overlooking the twinkling Doon Valley, Mussoorie offers cascading waterfalls, romantic sunset points, and classic colonial hill-station charm.",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["Mountains", "Nature", "Shopping"],
      idealDuration: { min: 2, max: 3, label: "2 - 3 Days" },
      bestTimeToVisit: "March to June & September to November",
      climate: "Pleasant misty hills (10°C - 24°C)",

      dailyFoodCostPerPerson: {
        budget: 350,
        standard: 650,
        premium: 1350
      },
      dailyLocalTransportGroup: {
        budget: 550,
        standard: 1050,
        premium: 2000
      },

      hotels: [
        {
          id: "msr-h1",
          name: "Cloud End Hill View Resort",
          tier: "Budget",
          area: "Library Chowk, Mussoorie",
          nightlyRate: 1550,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Valley View", "Room Heater", "Free Wi-Fi", "Terrace Cafe"],
          description: "Comfortable hillside rooms near Library Chowk with views looking down toward the Dehradun valley.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "msr-h2",
          name: "Fortune Resort Grace Mussoorie",
          tier: "Standard",
          area: "Library Bazaar, The Mall",
          nightlyRate: 3600,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Doon Valley Panorama", "Spa", "Game Room", "Buffet Breakfast"],
          description: "Refined 4-star property perched gracefully on the hillside overlooking the twinkling lights of Doon Valley.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "msr-h3",
          name: "JW Marriott Mussoorie Walnut Grove Resort",
          tier: "Premium",
          area: "Kempty Falls Road",
          nightlyRate: 9500,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Cedar Valley Facing", "Indoor Heated Pool", "Cedar Spa", "Fine Dining"],
          description: "Superb 5-star mountain luxury amidst pristine walnut groves, offering outdoor fire pits and bespoke hill treks.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Kempty Falls & Ropeway", fee: 100, durationHours: 3.0, category: "Nature", highlights: "Iconic mountain waterfall cascading into a plunge pool with cable car" },
        { name: "Gun Hill Cable Car & Sunset Lookout", fee: 150, durationHours: 2.0, category: "Mountains", highlights: "Second highest peak in Mussoorie providing 360-degree Himalayan views" },
        { name: "Camel's Back Road Scenic Walk", fee: 0, durationHours: 2.0, category: "Nature", highlights: "Peaceful 3km morning walk flanked by deodar trees and rock formations" },
        { name: "George Everest's House & Peak Trek", fee: 30, durationHours: 3.5, category: "History", highlights: "Estate of the surveyor of Mount Everest offering jaw-dropping valley drops" },
        { name: "Lal Tibba Scenic Viewpoint", fee: 50, durationHours: 1.5, category: "Mountains", highlights: "Highest point in Landour with high-powered telescopes for snow peaks" },
        { name: "Mall Road & Landour Bakehouse", fee: 0, durationHours: 2.5, category: "Food", highlights: "Artisanal apple pies, ginger tea, vintage bookstores, and Tibetan shops" }
      ],

      activities: [
        "Cable car ride up to Gun Hill for sunset over the Doon Valley",
        "Trekking to George Everest peak for panoramic mountain ridges",
        "Sipping lemon tea with warm apple pie at Landour Bakehouse",
        "Relaxing walk along quiet pine-fringed Camel's Back Road"
      ]
    },

    {
      id: "agra",
      name: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      latitude: 27.1767,
      longitude: 78.0081,
      aliases: ["agra", "taj mahal", "agra fort", "uttar pradesh", "mehtab bagh"],
      category: "Heritage",
      tagline: "The City of the Taj & Magnificent Mughal Wonders",
      description: "Home to the world-renowned Taj Mahal, Agra is an immortal monument to love, Mughal architectural brilliance, monumental red sandstone forts, and delectable petha confections.",
      heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["History", "Heritage", "Food", "Shopping"],
      idealDuration: { min: 1, max: 2, label: "1 - 2 Days" },
      bestTimeToVisit: "October to March",
      climate: "Cool winter mornings (10°C - 24°C)",

      dailyFoodCostPerPerson: {
        budget: 300,
        standard: 600,
        premium: 1200
      },
      dailyLocalTransportGroup: {
        budget: 450,
        standard: 900,
        premium: 1800
      },

      hotels: [
        {
          id: "agr-h1",
          name: "Taj View Inn & Guesthouse",
          tier: "Budget",
          area: "Tajganj, Agra",
          nightlyRate: 1400,
          roomCapacity: 2,
          rating: 4.3,
          amenities: ["Rooftop Taj View", "Free Wi-Fi", "AC", "10 min walk to Taj"],
          description: "Friendly family-run inn in Tajganj with a rooftop cafe serving breakfast with a direct view of the marble dome.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "agr-h2",
          name: "Courtyard by Marriott Agra",
          tier: "Standard",
          area: "Fatehabad Road, Agra",
          nightlyRate: 3400,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Outdoor Pool", "Buffet Breakfast", "Fitness Center", "Spa"],
          description: "Contemporary 5-star haven along Fatehabad Road with manicured gardens and international culinary spread.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "agr-h3",
          name: "The Oberoi Amarvilas Agra",
          tier: "Premium",
          area: "Taj East Gate Road",
          nightlyRate: 9800,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["Every Room Taj View", "Terraced Lawns", "Mughal Spa", "Buggy Transfers"],
          description: "World-famous palatial sanctuary situated just 600 meters from the Taj Mahal, with uninterrupted private dome views.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Taj Mahal Sunrise Visit", fee: 50, durationHours: 3.0, category: "Heritage", highlights: "UNESCO World Wonder, pure white Makrana marble, symmetrical Persian gardens" },
        { name: "Agra Fort & Jahangiri Mahal", fee: 50, durationHours: 2.5, category: "History", highlights: "Grand red sandstone palace where Emperor Shah Jahan spent his final years" },
        { name: "Mehtab Bagh (Moonlight Garden)", fee: 25, durationHours: 1.5, category: "Nature", highlights: "Lush botanical park on opposite Yamuna bank giving reflective Taj sunsets" },
        { name: "Fatehpur Sikri Imperial Complex (Excursion)", fee: 50, durationHours: 3.5, category: "History", highlights: "Buland Darwaza, Salim Chishti Dargah, Panch Mahal royal court" },
        { name: "Tomb of I'timād-ud-Daulah (Baby Taj)", fee: 30, durationHours: 1.5, category: "Heritage", highlights: "Delicate pietra dura marble inlay work, precursor to the Taj Mahal" },
        { name: "Sadar Bazaar & Kinari Bazaar", fee: 0, durationHours: 2.0, category: "Shopping", highlights: "Agra petha confections, marble inlay souvenirs, leather craft" }
      ],

      activities: [
        "Capturing the golden glow of sunrise on the Taj Mahal marble",
        "Exploring royal courtyards and palaces inside Agra Fort",
        "Watching sunset reflect across the Yamuna from Mehtab Bagh",
        "Tasting authentic Angoori and Paan Petha at Panchhi Petha"
      ]
    },

    {
      id: "delhi",
      name: "Delhi",
      state: "Delhi NCR",
      country: "India",
      latitude: 28.6139,
      longitude: 77.2090,
      aliases: ["delhi", "new delhi", "delhi ncr", "old delhi", "connaught place"],
      category: "Culture",
      tagline: "India's Timeless Capital of Dynasties & Modern Energy",
      description: "A monumental city where Mughal fortifications and British colonial boulevards meet bustling tech corridors, world-class street cuisine, and thriving contemporary arts.",
      heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603288940356-9b044c50cbe1?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["History", "Food", "Shopping", "Culture", "Heritage"],
      idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
      bestTimeToVisit: "October to March",
      climate: "Cool pleasant winters (10°C - 24°C)",

      dailyFoodCostPerPerson: {
        budget: 400,
        standard: 800,
        premium: 1600
      },
      dailyLocalTransportGroup: {
        budget: 600,
        standard: 1200,
        premium: 2200
      },

      hotels: [
        {
          id: "del-h1",
          name: "Bloomrooms @ New Delhi Station",
          tier: "Budget",
          area: "Paharganj / Central Delhi",
          nightlyRate: 1800,
          roomCapacity: 2,
          rating: 4.4,
          amenities: ["Metro Access 200m", "Free Wi-Fi", "Clean Crisp Pods", "AC"],
          description: "Vibrant, ultra-clean designer hotel conveniently situated opposite New Delhi Railway Station and Airport Express Metro.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "del-h2",
          name: "The Park New Delhi",
          tier: "Standard",
          area: "Connaught Place, Central Delhi",
          nightlyRate: 3800,
          roomCapacity: 2,
          rating: 4.6,
          amenities: ["Outdoor Pool", "Agni Lounge", "Breakfast Buffet", "Fitness Center"],
          description: "Sophisticated boutique design hotel overlooking the historic 18th-century observatory Jantar Mantar at Connaught Place.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "del-h3",
          name: "The Imperial New Delhi",
          tier: "Premium",
          area: "Janpath, Connaught Place",
          nightlyRate: 9500,
          roomCapacity: 2,
          rating: 4.9,
          amenities: ["1931 Art Deco Heritage", "Palatial Gardens", "Imperial Spa", "Fine Dining"],
          description: "Legendary luxury hotel with museum-quality colonial art, royal palms, and legendary high tea at 1911 restaurant.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
        }
      ],

      attractions: [
        { name: "Qutub Minar & Mehrauli Archaeological Park", fee: 50, durationHours: 2.5, category: "History", highlights: "73m soaring victory tower, iron pillar, Indo-Islamic calligraphy" },
        { name: "Humayun's Tomb (UNESCO Heritage)", fee: 50, durationHours: 2.0, category: "Heritage", highlights: "Magnificent garden tomb that inspired the Taj Mahal design" },
        { name: "Red Fort (Lal Qila) & Jama Masjid", fee: 50, durationHours: 3.0, category: "History", highlights: "Diwan-i-Khas, massive ramparts, India's largest congregational mosque" },
        { name: "India Gate & Kartavya Path Walk", fee: 0, durationHours: 1.5, category: "History", highlights: "42m war memorial arch and illuminated national boulevard" },
        { name: "Old Delhi Chandni Chowk Food Trail", fee: 50, durationHours: 3.0, category: "Food", highlights: "Paranthe Wali Gali, Karim's kebabs, Natraj dahi bhalle, jalebis" },
        { name: "Dilli Haat Crafts & Food Village", fee: 30, durationHours: 2.5, category: "Shopping", highlights: "Pan-Indian regional craft stalls, tribal art, and state food pavilions" },
        { name: "Lotus Temple & Akshardham (Excursion)", fee: 0, durationHours: 3.0, category: "Temples", highlights: "Baha'i flower architecture and carved sandstone mandir complex" }
      ],

      activities: [
        "Cycle rickshaw tour through aromatic spices of Khari Baoli",
        "Feasting on hot paranthas and butter chicken in Old Delhi",
        "Sunset stroll past illuminated fountain pools along Kartavya Path",
        "Exploring contemporary art exhibits at National Gallery of Modern Art"
      ]
    }
  ],

  // Frequently Asked Questions data
  faqs: [
    {
      q: "How does AI Traveller calculate estimated trip budgets?",
      a: "Our calculator computes comprehensive costs using: Round-trip transport based on distance and vehicle type; Accommodation based on number of rooms needed (travellers ÷ room capacity) and nights (duration - 1); Daily meals per person; Group local transit; Attraction entrance fees; and a mandatory 10% emergency reserve. All prices are transparent illustrative estimates to assist your planning."
    },
    {
      q: "How are hotel rooms calculated for groups?",
      a: "Rooms are calculated strictly based on standard room capacity (typically 2 persons per room). For example, 4 travellers require Math.ceil(4 / 2) = 2 rooms. A 3-day trip involves 2 overnight stays (3 days - 1 = 2 nights). If a trip is 1 day, 0 hotel nights are charged."
    },
    {
      q: "What does the 10% Emergency Reserve cover?",
      a: "Every generated trip includes an automatic 10% safety buffer added to the planned subtotal. This accounts for unexpected taxi fares, hydration, tips, spontaneous snack stops, or minor price fluctuations."
    },
    {
      q: "Are the prices real-time bookings or illustrative estimates?",
      a: "The estimates provided on AI Traveller are illustrative baseline estimates based on realistic market averages across Indian tourist hubs. They do not represent live inventory or confirmed airline/hotel tickets. We transparently disclose all demo figures."
    },
    {
      q: "Where are my saved trips stored?",
      a: "Your saved itineraries are stored securely inside your browser's localStorage. They remain saved across page refreshes on your current device and browser without requiring an account or sending private data to a server."
    }
  ],

  // Pre-seeded customer reviews across Indian destinations
  defaultReviews: [
    {
      id: "rev-manali-1",
      author: "Aarav Sharma",
      destinationId: "manali",
      destinationName: "Manali",
      rating: 5,
      title: "Solang Valley Snow & Old Manali Cafes Were Unforgettable!",
      text: "We planned a 4-day group trip to Manali following AI Traveller's budget breakdown. The transport via Volvo sleeper was smooth and within budget. Solang Valley adventure sports and evening strolls in Old Manali were magical! Total expenses matched the estimated breakdown almost to the rupee.",
      visitDate: "2026-09-12",
      createdAt: "2026-09-16T10:30:00.000Z",
      helpfulCount: 24
    },
    {
      id: "rev-goa-1",
      author: "Pooja Hegde",
      destinationId: "goa",
      destinationName: "Goa",
      rating: 5,
      title: "Perfect Beach Getaway Within Our Target Budget",
      text: "Finding affordable beach hotels with good room capacity is usually tough, but the recommendations here were spot-on. Palolem kayaking at sunrise and sunset at Chapora Fort made our holiday memorable. The 10% emergency buffer came in handy for scooter rentals and beach shack snacks!",
      visitDate: "2026-08-28",
      createdAt: "2026-09-02T14:15:00.000Z",
      helpfulCount: 19
    },
    {
      id: "rev-jaipur-1",
      author: "Rohan & Sneha Patel",
      destinationId: "jaipur",
      destinationName: "Jaipur",
      rating: 5,
      title: "Royal Heritage Experience with Total Cost Transparency",
      text: "Amber Fort Sheesh Mahal, Hawa Mahal morning photography, and authentic Rajasthani thali at Chokhi Dhani were incredible. Having the exact entrance fees pre-calculated saved us from carrying excess cash or facing unexpected ticketing surprises.",
      visitDate: "2026-10-04",
      createdAt: "2026-10-08T09:45:00.000Z",
      helpfulCount: 31
    },
    {
      id: "rev-rishikesh-1",
      author: "Vikramaditya Rao",
      destinationId: "rishikesh",
      destinationName: "Rishikesh",
      rating: 5,
      title: "Thrilling White-Water Rafting & Divine Ganga Aarti",
      text: "Rafting down the Ganges rapids followed by evening Parmarth Niketan Ganga Aarti was soul-stirring. The day-by-day dynamic schedule allocated just the right amount of time for both adventure sports and peaceful spiritual immersion.",
      visitDate: "2026-09-20",
      createdAt: "2026-09-24T16:20:00.000Z",
      helpfulCount: 15
    },
    {
      id: "rev-udaipur-1",
      author: "Ananya Deshmukh",
      destinationId: "udaipur",
      destinationName: "Udaipur",
      rating: 4,
      title: "Lake Pichola Sunset Boat Cruise is Pure Magic",
      text: "The City Palace architecture and sunset views from Jag Mandir are breathtaking. A couple minor auto rickshaw surge fares occurred during peak hours, but our pre-allocated local transit budget covered it easily. Highly recommend staying near the lake.",
      visitDate: "2026-07-15",
      createdAt: "2026-07-20T11:00:00.000Z",
      helpfulCount: 12
    },
    {
      id: "rev-varanasi-1",
      author: "Kavita Nair",
      destinationId: "varanasi",
      destinationName: "Varanasi",
      rating: 5,
      title: "Sunrise Boat Ride Along Dashashwamedh Ghat",
      text: "Varanasi is an experience unlike anywhere else on earth. The dawn boat ride watching rituals on the ghats, followed by piping hot kachori jalebi in the ancient gullies, was priceless. The Google Maps directions made navigating the narrow lanes much easier.",
      visitDate: "2026-10-01",
      createdAt: "2026-10-05T18:10:00.000Z",
      helpfulCount: 22
    },
    {
      id: "rev-shimla-1",
      author: "Gurpreet Singh",
      destinationId: "shimla",
      destinationName: "Shimla",
      rating: 4,
      title: "Crisp Mountain Air & Heritage Toy Train Journey",
      text: "The toy train ride from Kalka to Shimla was straight out of a storybook. Mall Road in the evening had a wonderful colonial charm. The live weather forecast feature accurately predicted chilly evening drops so we packed our woolen jackets accordingly!",
      visitDate: "2026-09-30",
      createdAt: "2026-10-03T13:40:00.000Z",
      helpfulCount: 17
    },
    {
      id: "rev-amritsar-1",
      author: "Meera Sen",
      destinationId: "amritsar",
      destinationName: "Amritsar",
      rating: 5,
      title: "Harmandir Sahib Langar & Electric Wagah Border Ceremony",
      text: "The serenity of the Golden Temple and the community langar serving thousands with devotion was deeply humbling. Wagah Border energy in the afternoon was electrifying. Kulchas at Kulcha Land are an absolute must!",
      visitDate: "2026-08-14",
      createdAt: "2026-08-18T12:00:00.000Z",
      helpfulCount: 28
    }
  ]
};

// Export to window for browser vanilla JS usage
if (typeof window !== "undefined") {
  window.TRAVEL_DATA = TRAVEL_DATA;
}

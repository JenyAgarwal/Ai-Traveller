/**
 * AI Traveller - "Explore Near Your City" dataset (Agra and places within 100 km)
 *
 * - homeCity: the city the user lives in. Distances are measured from these coordinates.
 * - places:   sightseeing spots. Coordinates are approximate (straight-line distance is used).
 *             `wiki` is the Wikipedia article title used to load a real photo at runtime.
 * - cafes:    real cafes from Google Places (name, rating, rating count, place_id, coordinates).
 * - hotels:   real hotels from Google Places. `tier` is a rough guide (Budget / Mid-range /
 *             Premium / Luxury) written by hand; nightly rates are NOT included because they
 *             change daily. Edit `tier` if you know better.
 *
 * Photos for cafes and hotels: add an `image` URL (https://...) to any entry to show your own
 * photo. Without it the card shows a placeholder plus a "See photos" link to Google Maps.
 */

const EXPLORE_DATA = {
  homeCity: {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    lat: 27.1767,
    lng: 78.0081
  },

  radiusOptions: [25, 50, 75, 100],
  defaultRadiusKm: 100,

  places: [
    {
      id: "taj-mahal",
      name: "Taj Mahal",
      wiki: "Taj Mahal",
      category: "Heritage",
      lat: 27.1751, lng: 78.0421,
      description: "Ivory-white marble mausoleum built by Shah Jahan (1632-1653). Best seen at sunrise. Closed to visitors on Fridays.",
      durationHours: 3
    },
    {
      id: "agra-fort",
      name: "Agra Fort",
      wiki: "Agra Fort",
      category: "Heritage",
      lat: 27.1795, lng: 78.0211,
      description: "Red sandstone Mughal fortress with palaces, halls and courtyards overlooking the Yamuna river.",
      durationHours: 2
    },
    {
      id: "itimad-ud-daulah",
      name: "Itimad-ud-Daulah (Baby Taj)",
      wiki: "I'timad-ud-Daulah",
      category: "Heritage",
      lat: 27.1953, lng: 78.0219,
      description: "Marble tomb famous for its intricate pietra dura inlay work. A quieter alternative to the Taj.",
      durationHours: 1
    },
    {
      id: "akbars-tomb",
      name: "Akbar's Tomb (Sikandra)",
      wiki: "Akbar's Tomb",
      category: "Heritage",
      lat: 27.2201, lng: 77.9503,
      description: "Mausoleum of Emperor Akbar set in a large garden with deer and peacocks.",
      durationHours: 1.5
    },
    {
      id: "fatehpur-sikri",
      name: "Fatehpur Sikri",
      wiki: "Fatehpur Sikri",
      category: "Heritage",
      lat: 27.0945, lng: 77.6609,
      description: "Abandoned Mughal capital with the Buland Darwaza, Jama Masjid and Panch Mahal. UNESCO World Heritage Site.",
      durationHours: 3
    },
    {
      id: "keoladeo",
      name: "Keoladeo National Park (Bharatpur)",
      wiki: "Keoladeo National Park",
      category: "Nature",
      lat: 27.18, lng: 77.52,
      description: "UNESCO wetland and bird sanctuary. Best from November to February; cycle-rickshaws or a guided walk.",
      durationHours: 3
    },
    {
      id: "mathura",
      name: "Mathura",
      wiki: "Mathura",
      category: "Spiritual",
      lat: 27.4924, lng: 77.6737,
      description: "Birthplace of Lord Krishna, with the Krishna Janmabhoomi temple complex and ghats on the Yamuna.",
      durationHours: 4
    },
    {
      id: "vrindavan",
      name: "Vrindavan",
      wiki: "Vrindavan",
      category: "Spiritual",
      lat: 27.58, lng: 77.699,
      description: "Town of hundreds of temples linked to Krishna's childhood, including the Banke Bihari temple.",
      durationHours: 3
    },
    {
      id: "govardhan",
      name: "Govardhan Hill",
      wiki: "Govardhan",
      category: "Spiritual",
      lat: 27.495, lng: 77.459,
      description: "Sacred hill believed to have been lifted by Krishna. Devotees walk the 21 km parikrama around it.",
      durationHours: 3
    }
  ],

  cafes: [
    {
      id: "the-salt-cafe",
      name: "The Salt Cafe",
      area: "Fatehabad Road, near Taj Mahal",
      lat: 27.15733, lng: 78.04984,
      rating: 4.6, ratingCount: 11654, priceLevel: null,
      placeId: "ChIJFRKBVjRxdDkRg_GPt2_UvCU",
      tags: ["Rooftop", "Multi-cuisine"]
    },
    {
      id: "chia-taj-view",
      name: "Chia Taj View Cafe",
      area: "Kinari Bazaar, near South Gate",
      lat: 27.16897, lng: 78.04314,
      rating: 4.6, ratingCount: 956, priceLevel: 2,
      placeId: "ChIJFbvYcUpxdDkR6yWdcPN3sos",
      tags: ["Rooftop", "Taj view"]
    },
    {
      id: "roastery-coffee",
      name: "Roastery Coffee House",
      area: "Taj East Gate Road, Tajganj",
      lat: 27.16198, lng: 78.05912,
      rating: 4.8, ratingCount: 272, priceLevel: 2,
      placeId: "ChIJ8ZdvZvdxdDkRGMxpAEDzkY0",
      tags: ["Coffee"]
    },
    {
      id: "london-coffee-club",
      name: "London Coffee Club",
      area: "Taj Nagari Phase 1, near TDI Mall",
      lat: 27.16001, lng: 78.05796,
      rating: 4.8, ratingCount: 3279, priceLevel: 2,
      placeId: "ChIJl85NVQBxdDkRmg1jB1CzyqU",
      tags: ["Coffee", "Chill-out"]
    },
    {
      id: "good-vibes-cafe",
      name: "Good Vibes Cafe",
      area: "Shilpgram Road, Taj Nagari",
      lat: 27.16384, lng: 78.05347,
      rating: 4.7, ratingCount: 3485, priceLevel: 2,
      placeId: "ChIJR3xaPQ5xdDkRhMUJdjWpcpU",
      tags: ["Cafe", "Breakfast"]
    },
    {
      id: "taj-cafe-rooftop",
      name: "Taj Cafe Restaurant (A/C Roof Top)",
      area: "Kinari Bazaar, near South Gate",
      lat: 27.16904, lng: 78.04253,
      rating: 4.8, ratingCount: 1119, priceLevel: 2,
      placeId: "ChIJ5WH8nhhxdDkRIagM88TaeaQ",
      tags: ["Rooftop", "Air-conditioned"]
    },
    {
      id: "vairo-cafe",
      name: "Vairo Cafe (Rooftop)",
      area: "Sabji Mandi, Basai",
      lat: 27.15699, lng: 78.05393,
      rating: 4.9, ratingCount: 88, priceLevel: 2,
      placeId: "ChIJWyUwm7ZxdDkRr6X96Ni6TCA",
      tags: ["Rooftop"]
    },
    {
      id: "hippie-cafe",
      name: "The Hippie Cafe",
      area: "Chowk Kagziyan, Kinari Bazaar",
      lat: 27.16918, lng: 78.04317,
      rating: 4.4, ratingCount: 184, priceLevel: 2,
      placeId: "ChIJkQ_zKjJxdDkR92xA8Xd9kY8",
      tags: ["Budget-friendly", "Backpacker favourite"]
    }
  ],

  hotels: [
    {
      id: "oberoi-amarvilas",
      name: "The Oberoi Amarvilas",
      area: "Taj East Gate Road, Paktola",
      tier: "Luxury",
      lat: 27.168, lng: 78.04901,
      rating: 4.7, ratingCount: 5131,
      placeId: "ChIJwanh0htxdDkRpaBl2MhumtY",
      tags: ["Taj view", "Spa"]
    },
    {
      id: "jaypee-palace",
      name: "Jaypee Palace Hotel & Convention Centre",
      area: "Fatehabad Road, Tajganj",
      tier: "Luxury",
      lat: 27.15386, lng: 78.07138,
      rating: 4.6, ratingCount: 11970,
      placeId: "ChIJiyOpxDxxdDkRW_46vNftrZQ",
      tags: ["Pool", "Conference centre"]
    },
    {
      id: "radisson-agra",
      name: "Radisson Hotel Agra",
      area: "Fatehabad Road, Taj Nagri",
      tier: "Premium",
      lat: 27.1587, lng: 78.05365,
      rating: 4.6, ratingCount: 24537,
      placeId: "ChIJUxFmmA9xdDkR3DpaV2nlAi4",
      tags: ["Pool", "Restaurant"]
    },
    {
      id: "trident-agra",
      name: "Trident, Agra",
      area: "Fatehabad Road, near TDI Mall",
      tier: "Premium",
      lat: 27.15941, lng: 78.05991,
      rating: 4.5, ratingCount: 3591,
      placeId: "ChIJEbASKiZ3dDkRQxQOsXwI2Ws",
      tags: ["Pool", "Gym"]
    },
    {
      id: "orchid-retreat",
      name: "The Orchid Retreat",
      area: "Shilpgram Road, Taj Nagari",
      tier: "Mid-range",
      lat: 27.16462, lng: 78.05469,
      rating: 4.9, ratingCount: 639,
      placeId: "ChIJ_XpeSa5xdDkRx1U0NE9Lpe0",
      tags: ["Near Taj East Gate"]
    },
    {
      id: "atulyaa-taj",
      name: "Hotel Atulyaa Taj",
      area: "Taj East Gate Road, Forest Colony",
      tier: "Mid-range",
      lat: 27.16834, lng: 78.05071,
      rating: 4.4, ratingCount: 5232,
      placeId: "ChIJnQczA7RxdDkRPF_9n_2i85c",
      tags: ["Walk to Taj"]
    },
    {
      id: "maya-hotel",
      name: "Maya Hotel & Restaurant",
      area: "Fatehabad Road, Purani Mandi",
      tier: "Budget",
      lat: 27.16629, lng: 78.03732,
      rating: 4.4, ratingCount: 1965,
      placeId: "ChIJVTDafiRxdDkRGxu9x-O_glE",
      tags: ["Restaurant", "Budget-friendly"]
    },
    {
      id: "royal-phoenix",
      name: "Hotel Royal Phoenix",
      area: "Bijli Ghar Road, Rakabganj",
      tier: "Budget",
      lat: 27.16926, lng: 78.01607,
      rating: 4.5, ratingCount: 1743,
      placeId: "ChIJc5JVAUB3dDkR8dlB-o6RlLQ",
      tags: ["Budget-friendly"]
    }
  ]
};

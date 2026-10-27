# AI Traveller — Your Next Adventure, Within Budget.

> A modern, responsive, budget-first travel discovery and itinerary planning web application built exclusively with standard **HTML5**, **CSS3**, and browser-native **Vanilla JavaScript**.

---

## 🌟 Overview

**AI Traveller** is an interactive travel-planning website designed to eliminate travel budget anxiety. By calculating realistic, distance-scaled group transport costs, guest-capacity-verified hotel requirements, daily dining, local transit, sightseeing monument fees, and an automatic 10% emergency safety cushion, it provides upfront budget clarity before booking a single ticket.

---

## 🚀 How to Run the Website

There are **zero build steps, no npm packages, and no backend dependencies**.

### Option 1: Directly Open in Browser (Recommended)
Simply double-click `index.html` or open it with your web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Using Any Simple Local Server
From the project folder, you may run:
```bash
# Python 3
python -m http.server 8000

# or Node http-server (if installed)
npx serve .
```
Then visit `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```
ai-traveller/
├── index.html        # Semantic HTML5 markup, accessible landmarks, modal dialog & drawer
├── style.css         # Modern design system (Midnight Navy, Teal & Turquoise accents)
├── script.js         # Modular Vanilla JavaScript logic, budget calculator, ranking engine
├── data.js           # Comprehensive Indian destinations dataset (12 hubs), hotels, fares
└── README.md         # Full project documentation, formulas & customization guide
```

---

## 🧮 Budget Calculation Engine

AI Traveller follows an audited, integer-safe mathematical formula accounting for the realities of group travel:

1. **Round-Trip Transport Cost**:
   $$\text{Transport Cost} = \text{Round-trip fare per person} \times \text{Number of Travellers}$$
   *(Scaled dynamically based on travel distance from origin and transport mode: Train, Bus, Outstation Cab, or Flight).*

2. **Accommodation Nights & Room Requirement**:
   $$\text{Nights} = \max(0, \text{Duration} - 1)$$
   $$\text{Required Rooms} = \lceil \text{Travellers} / \text{Room Capacity} \rceil$$
   *(Standard room capacity is 2 guests/room. **A 1-day trip has 0 nights and ₹0 accommodation charge**).*

3. **Accommodation Cost**:
   $$\text{Accommodation Cost} = \text{Nightly Room Rate} \times \text{Required Rooms} \times \text{Nights}$$

4. **Food & Dining Cost**:
   $$\text{Food Cost} = \text{Daily Food Cost per Person} \times \text{Travellers} \times \text{Duration}$$

5. **Local Group Transit Cost**:
   $$\text{Local Transit Cost} = \text{Daily Group Cab/Auto Rate} \times \text{Duration}$$

6. **Sightseeing & Attraction Tickets**:
   $$\text{Attraction Cost} = \text{Attraction Fees per Person} \times \text{Travellers}$$

7. **Subtotal**:
   $$\text{Subtotal} = \text{Transport} + \text{Accommodation} + \text{Food} + \text{Local Transit} + \text{Attractions}$$

8. **Emergency Reserve (10%)**:
   $$\text{Emergency Reserve} = \text{round}(\text{Subtotal} \times 0.10)$$

9. **Total Estimated Trip Cost**:
   $$\text{Total Estimated Trip Cost} = \text{Subtotal} + \text{Emergency Reserve}$$

10. **Per-Person Cost & Remaining Budget**:
    $$\text{Per-Person Cost} = \text{round}(\text{Total Cost} / \text{Travellers})$$
    $$\text{Remaining Budget} = \text{Total Group Budget} - \text{Total Estimated Trip Cost}$$

> [!IMPORTANT]
> A destination is marked **"Within Budget"** if and only if $\text{Total Estimated Trip Cost} \le \text{Total Group Budget}$. If it exceeds the budget, it is prominently labeled **"Over Budget"** with a warning badge showing the exact shortfall.

---

## 🧠 Smart Destination Recommendation Algorithm

The engine evaluates each destination against user search parameters using a weighted composite score (0 - 100%):

- **Budget Feasibility (45% weight)**: Highest score for destinations comfortably within budget that preserve a sensible buffer.
- **Interest Alignment (35% weight)**: Measures overlap between user-selected interests (Mountains, Beaches, Nature, History, Temples, Adventure, Food, Shopping) and destination tags.
- **Duration Suitability (15% weight)**: Compares requested trip duration against the destination's recommended minimum/maximum stay length.
- **Distance & Accessibility (5% weight)**: Considers physical distance from the selected origin city.

---

## 🛠️ Modifying Destinations & Adding New Cities

All travel destination data resides in `data.js` under `TRAVEL_DATA.destinations`.

To add or modify a destination:
```javascript
{
  id: "coorg",
  name: "Coorg",
  state: "Karnataka",
  category: "Nature", // Mountains, Heritage, Spiritual, Beaches, Culture, Nature
  tagline: "The Scotland of India & Coffee Highlands",
  description: "Misty hills, lush coffee estates, and waterfalls...",
  heroImage: "https://images.unsplash.com/...",
  tags: ["Nature", "Mountains", "Adventure"],
  idealDuration: { min: 2, max: 4, label: "2 - 4 Days" },
  bestTimeToVisit: "October to March",
  climate: "Pleasant hill breezes (15°C - 25°C)",
  
  dailyFoodCostPerPerson: { budget: 350, standard: 700, premium: 1400 },
  dailyLocalTransportGroup: { budget: 500, standard: 1000, premium: 2000 },
  
  hotels: [
    {
      id: "crg-h1",
      name: "Coffee Estate Homestay",
      tier: "Budget",
      nightlyRate: 1600,
      roomCapacity: 2,
      rating: 4.4,
      amenities: ["Plantation Walk", "Breakfast", "Wi-Fi"],
      image: "..."
    }
  ],
  
  attractions: [
    { name: "Abbey Falls", fee: 15, durationHours: 2.0, category: "Nature", highlights: "Cascading roar through coffee bushes" }
  ],
  
  activities: [
    "Walking through aromatic coffee plantations",
    "River rafting at Barapole"
  ]
}
```

---

## 💾 Saved Trips (Browser Storage)

- Trips saved using the **Save Trip** button are persisted in the browser's standard `localStorage` under `ai_traveller_saved_trips_v1`.
- Saved itineraries survive page refreshes and browser restarts on the same machine.
- Saved trips are strictly local to your browser and are never transmitted to external servers.

---

## ⚠️ Important Disclosure & Limitations

1. **Illustrative Sample Estimates**: Rates for trains, hotels, and attractions represent realistic market baseline averages across Indian hubs. They are intended for travel budgeting and planning, not guaranteed live inventory.
2. **Offline-Ready Architecture**: The application operates with zero server-side prerequisites, making it effortless to deploy onto GitHub Pages, Netlify, Vercel, or any static file host.
3. **Extensibility**: The codebase has been cleanly decoupled (`data.js`, `script.js`, `style.css`) to allow seamless future integration with live flight/hotel APIs, authentication, and secure backends.

---

&copy; 2026 AI Traveller. "Your Next Adventure, Within Budget."

---

## 🌐 Language & 🌗 Theme

- **Language** (navbar dropdown): English and हिन्दी. Navigation, planner labels and section headings translate; destination descriptions stay in English. Add more languages in the `I18N` object in `features.js`.
- **Theme** (moon/sun button in the navbar): Light or Dark. The choice is remembered in the browser (`localStorage`, key `ai_traveller_theme`).

## 🗺️ Explore Near Your City

The **Explore Around Your City** section lists places to visit, cafes and hotels within a chosen distance (25, 50, 75 or 100 km) of your home city, sorted by distance, with photos.

- Data lives in `explore-data.js` (`EXPLORE_DATA`). The home city is Agra by default (`homeCity`).
- Distances are straight-line (great-circle) estimates computed from coordinates in the data file.
- **Places to visit** photos load automatically from each place's Wikipedia article (`wiki` field).
- **Cafes and hotels** show a photo if you add an `image` URL to the entry. Without one, the card shows a placeholder and a **See photos & reviews** link that opens the place on Google Maps.
- Hotel `tier` labels (Budget / Mid-range / Premium / Luxury) are hand-written guides. Nightly rates are intentionally not included, because they change daily.

## 💰 Budget Minimum

The group budget must be at least **₹500** (input minimum and validation in `script.js`).

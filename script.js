/**
 * AI Traveller - Core Travel Platform Engine
 * Upgraded Vanilla JavaScript implementation of:
 * - Budget calculations & capacity-verified room allocations
 * - Smart destination recommendation scoring
 * - Direct destination search & geocoding resolution
 * - Live Open-Meteo Weather API integration with 5-day forecast & travel advice
 * - Official Google Maps & Directions integration with transport mode switcher
 * - Customer reviews & rating system with localStorage persistence & XSS protection
 * - Dynamic day-by-day itineraries and saved trips
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const state = {
    currentSearchParams: null,
    calculatedResults: [],
    activeFilter: "all",
    activeSort: "match",
    selectedDestinationItem: null, // Active primary showcase destination
    modalDestinationItem: null,    // Item currently viewed in modal dialog
    savedTrips: [],
    reviews: [],
    reviewsFilterDest: "all",
    reviewsSort: "newest",
    mapsTravelMode: "driving",     // driving | transit | walking | bicycling
    weatherRequestId: 0,
    weatherCache: {},              // In-memory cache { [key]: { timestamp, data } }
    selectedStarRating: 0
  };

  const SAVED_TRIPS_STORAGE_KEY = "ai_traveller_saved_trips_v1";
  const REVIEWS_STORAGE_KEY = "ai_traveller_customer_reviews_v1";

  // ---------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // ---------------------------------------------------------------------------
  const elements = {
    navbar: document.getElementById("navbar"),
    navLinks: document.getElementById("nav-links"),
    menuToggle: document.getElementById("menu-toggle"),
    navSavedBtn: document.getElementById("nav-saved-btn"),
    savedBadgeCount: document.getElementById("saved-badge-count"),

    // Planner Form & Search Inputs
    plannerForm: document.getElementById("trip-planner-form"),
    destinationInput: document.getElementById("destination-input"),
    btnClearDest: document.getElementById("btn-clear-dest"),
    destFeedbackBar: document.getElementById("dest-feedback-bar"),
    destinationPills: document.getElementById("destination-pills"),
    originSelect: document.getElementById("origin-select"),
    travellersInput: document.getElementById("travellers-input"),
    budgetInput: document.getElementById("budget-input"),
    durationInput: document.getElementById("duration-input"),
    travelDateInput: document.getElementById("travel-date-input"),
    accommodationSelect: document.getElementById("accommodation-select"),
    formErrorAlert: document.getElementById("form-error-alert"),
    formErrorMsg: document.getElementById("form-error-msg"),
    generateTripBtn: document.getElementById("generate-trip-btn"),
    exploreAllBtn: document.getElementById("explore-all-btn"),
    budgetPerPersonBadge: document.getElementById("budget-per-person-badge"),
    bppText: document.getElementById("bpp-text"),

    // Primary Selected Destination Showcase
    showcaseSection: document.getElementById("selected-destination-showcase"),
    showcaseModifyBtn: document.getElementById("showcase-modify-btn"),
    showcaseKicker: document.getElementById("showcase-kicker"),
    showcaseName: document.getElementById("showcase-name"),
    showcaseLocation: document.getElementById("showcase-location"),
    showcaseCategory: document.getElementById("showcase-category"),
    showcaseTagline: document.getElementById("showcase-tagline"),
    showcaseFeasibilityBadge: document.getElementById("showcase-feasibility-badge"),
    showcaseSaveBtn: document.getElementById("showcase-save-btn"),
    showcasePrintBtn: document.getElementById("showcase-print-btn"),
    showcaseHeroImg: document.getElementById("showcase-hero-img"),
    showcaseIdealStay: document.getElementById("showcase-ideal-stay"),
    showcaseBestTime: document.getElementById("showcase-best-time"),
    showcaseDistance: document.getElementById("showcase-distance"),
    showcaseDesc: document.getElementById("showcase-desc"),
    showcaseRouteInfo: document.getElementById("showcase-route-info"),
    showcaseEstTotal: document.getElementById("showcase-est-total"),
    showcasePerPerson: document.getElementById("showcase-per-person"),
    showcaseSavings: document.getElementById("showcase-savings"),
    showcaseActivities: document.getElementById("showcase-activities"),

    // Live Weather Hub in Showcase
    weatherCard: document.getElementById("weather-card"),
    weatherSubtitle: document.getElementById("weather-subtitle"),
    btnRefreshWeather: document.getElementById("btn-refresh-weather"),
    weatherLoading: document.getElementById("weather-loading"),
    weatherError: document.getElementById("weather-error"),
    weatherErrorMsg: document.getElementById("weather-error-msg"),
    btnRetryWeather: document.getElementById("btn-retry-weather"),
    weatherContent: document.getElementById("weather-content"),
    weatherCurrentTemp: document.getElementById("weather-current-temp"),
    weatherCurrentIcon: document.getElementById("weather-current-icon"),
    weatherCurrentDesc: document.getElementById("weather-current-desc"),
    weatherCurrentFeels: document.getElementById("weather-current-feels"),
    weatherCurrentTime: document.getElementById("weather-current-time"),
    weatherHumidity: document.getElementById("weather-humidity"),
    weatherWind: document.getElementById("weather-wind"),
    weatherPrecip: document.getElementById("weather-precip"),
    weatherAdviceBox: document.getElementById("weather-advice-box"),
    weatherAdviceText: document.getElementById("weather-advice-text"),
    weatherForecastStrip: document.getElementById("weather-forecast-strip"),

    // Google Maps Hub in Showcase
    mapsCard: document.getElementById("maps-card"),
    mapsRouteLabel: document.getElementById("maps-route-label"),
    mapsModeOptions: document.getElementById("maps-mode-options"),
    gmapsDirectionsLink: document.getElementById("gmaps-directions-link"),
    gmapsDirectionsText: document.getElementById("gmaps-directions-text"),
    gmapsExploreLink: document.getElementById("gmaps-explore-link"),
    gmapsIframe: document.getElementById("gmaps-iframe"),
    attractionsMapsList: document.getElementById("attractions-maps-list"),

    // Showcase Tabs
    showcaseTabBtns: document.querySelectorAll(".showcase-tab-btn"),
    showcaseTabPanes: document.querySelectorAll(".showcase-tab-pane"),
    scBudgetHeaderGuests: document.getElementById("sc-budget-header-guests"),
    scBudgetHeaderDays: document.getElementById("sc-budget-header-days"),
    scBudgetTbody: document.getElementById("sc-budget-tbody"),
    scBudgetTfoot: document.getElementById("sc-budget-tfoot"),
    scBudgetNote: document.getElementById("sc-budget-note"),
    scHotelRoomsSummary: document.getElementById("sc-hotel-rooms-summary"),
    scHotelsGrid: document.getElementById("sc-hotels-grid"),
    scItinDuration: document.getElementById("sc-itin-duration"),
    scItineraryTimeline: document.getElementById("sc-itinerary-timeline"),
    scReviewsTitle: document.getElementById("sc-reviews-title"),
    scReviewsSub: document.getElementById("sc-reviews-sub"),
    scReviewsContainer: document.getElementById("sc-reviews-container"),
    scWriteReviewLink: document.getElementById("sc-write-review-link"),

    // Results Comparison Section
    resultsSection: document.getElementById("results"),
    resultsHeadline: document.getElementById("results-headline"),
    resultsSubheadline: document.getElementById("results-subheadline"),
    resultsSummaryTags: document.getElementById("results-summary-tags"),
    destinationsContainer: document.getElementById("destinations-container"),
    emptyResults: document.getElementById("empty-results"),
    emptyStateMsg: document.getElementById("empty-state-msg"),
    emptyResetFilterBtn: document.getElementById("empty-reset-filter-btn"),
    sortSelect: document.getElementById("sort-select"),
    filterButtons: document.querySelectorAll(".filter-btn"),

    // Reviews Section
    reviewsSection: document.getElementById("reviews"),
    reviewAvgScore: document.getElementById("review-avg-score"),
    reviewAvgStars: document.getElementById("review-avg-stars"),
    reviewTotalCount: document.getElementById("review-total-count"),
    reviewsDistributionBars: document.getElementById("reviews-distribution-bars"),
    btnOpenReviewForm: document.getElementById("btn-open-review-form"),
    reviewFormContainer: document.getElementById("review-form-container"),
    reviewFormAlert: document.getElementById("review-form-alert"),
    reviewFormAlertText: document.getElementById("review-form-alert-text"),
    reviewSubmitForm: document.getElementById("review-submit-form"),
    reviewNameInput: document.getElementById("review-name-input"),
    reviewDestSelect: document.getElementById("review-dest-select"),
    starPicker: document.getElementById("star-picker"),
    starPickerLabel: document.getElementById("star-picker-label"),
    reviewRatingValue: document.getElementById("review-rating-value"),
    reviewTitleInput: document.getElementById("review-title-input"),
    reviewBodyInput: document.getElementById("review-body-input"),
    reviewCharCount: document.getElementById("review-char-count"),
    reviewVisitDate: document.getElementById("review-visit-date"),
    btnCancelReview: document.getElementById("btn-cancel-review"),
    btnSubmitReview: document.getElementById("btn-submit-review"),
    reviewFilterDest: document.getElementById("review-filter-dest"),
    reviewSortSelect: document.getElementById("review-sort-select"),
    reviewsGrid: document.getElementById("reviews-grid"),
    reviewsEmptyState: document.getElementById("reviews-empty-state"),
    btnEmptyWriteReview: document.getElementById("btn-empty-write-review"),

    // Modal
    destinationModal: document.getElementById("destination-modal"),
    modalCloseBtn: document.getElementById("modal-close-btn"),
    modalBackBtn: document.getElementById("modal-back-btn"),
    modalPrintBtn: document.getElementById("modal-print-btn"),
    modalSaveBtn: document.getElementById("modal-save-btn"),
    modalHeroImg: document.getElementById("modal-hero-img"),
    modalCategory: document.getElementById("modal-category"),
    modalDestTitle: document.getElementById("modal-dest-title"),
    modalDestLocation: document.getElementById("modal-dest-location"),
    modalOverviewDesc: document.getElementById("modal-overview-desc"),
    modalBestTime: document.getElementById("modal-best-time"),
    modalClimate: document.getElementById("modal-climate"),
    modalIdealDuration: document.getElementById("modal-ideal-duration"),
    modalActivitiesList: document.getElementById("modal-activities-list"),
    modalWeatherContainer: document.getElementById("modal-weather-container"),
    modalMapsContainer: document.getElementById("modal-maps-container"),
    modalBudgetTbody: document.getElementById("modal-budget-tbody"),
    modalBudgetTfoot: document.getElementById("modal-budget-tfoot"),
    modalBudgetFeasibilityNote: document.getElementById("modal-budget-feasibility-note"),
    modalRoomsSummary: document.getElementById("modal-rooms-summary"),
    modalHotelsContainer: document.getElementById("modal-hotels-container"),
    modalItineraryDuration: document.getElementById("modal-itinerary-duration"),
    modalItineraryContainer: document.getElementById("modal-itinerary-container"),
    modalReviewsContainer: document.getElementById("modal-reviews-container"),
    modalTabBtns: document.querySelectorAll(".modal-tabs .tab-btn"),
    modalTabPanels: document.querySelectorAll(".modal-body .tab-panel"),

    // Saved Trips Drawer
    savedDrawer: document.getElementById("saved-drawer"),
    savedDrawerBackdrop: document.getElementById("saved-drawer-backdrop"),
    closeSavedDrawerBtn: document.getElementById("close-saved-drawer-btn"),
    savedTripsList: document.getElementById("saved-trips-list"),
    clearAllSavedBtn: document.getElementById("clear-all-saved-btn"),

    // Other UI elements
    faqList: document.getElementById("faq-list"),
    toastContainer: document.getElementById("toast-container"),
    heroTrySampleBtn: document.getElementById("hero-try-sample-btn")
  };

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------
  function init() {
    loadSavedTrips();
    loadCustomerReviews();
    populateDestinationSelectOptions();
    initNavbarScroll();
    initMobileNav();
    initFormInteractions();
    initShowcaseInteractions();
    initReviewsInteractions();
    initFAQs();
    initFeaturedCards();
    initModalEvents();
    initSavedDrawerEvents();

    // Set minimum date for travel date picker to today
    const today = new Date().toISOString().split("T")[0];
    if (elements.travelDateInput) {
      elements.travelDateInput.min = today;
    }
    if (elements.reviewVisitDate) {
      elements.reviewVisitDate.max = today;
    }

    // Automatically trigger initial recommendation (Jaipur sample, Agra origin, 4 travellers, ₹40k) - silent init without scrolling
    handleFormSubmit(false, false);
    updateLiveBudgetPreview();
  }

  // ---------------------------------------------------------------------------
  // NAVBAR & NAVIGATION
  // ---------------------------------------------------------------------------
  function initNavbarScroll() {
    window.addEventListener("scroll", function () {
      if (elements.navbar) {
        if (window.scrollY > 40) {
          elements.navbar.classList.add("scrolled");
        } else {
          elements.navbar.classList.remove("scrolled");
        }
      }
    }, { passive: true });
  }

  function initMobileNav() {
    if (!elements.menuToggle || !elements.navLinks) return;

    elements.menuToggle.addEventListener("click", function () {
      const isOpen = elements.navLinks.classList.toggle("open");
      elements.menuToggle.classList.toggle("active");
      elements.menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu on link click
    elements.navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        elements.navLinks.classList.remove("open");
        elements.menuToggle.classList.remove("active");
        elements.menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------------------------------------------------------------------------
  // DESTINATION LOOKUP & GEOCODING
  // ---------------------------------------------------------------------------
  /**
   * Resolves a destination query entered by user.
   * Matches against local dataset (id, name, aliases, state, category)
   * Returns matching destination object or null.
   */
  function lookupDestination(query) {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery || cleanQuery === "all" || cleanQuery === "any") return null;

    const destinations = window.TRAVEL_DATA.destinations || [];

    // 1. Direct ID match
    let match = destinations.find(d => d.id.toLowerCase() === cleanQuery);
    if (match) return match;

    // 2. Direct Name match
    match = destinations.find(d => d.name.toLowerCase() === cleanQuery);
    if (match) return match;

    // 3. Aliases match
    match = destinations.find(d => d.aliases && d.aliases.some(a => a.toLowerCase() === cleanQuery));
    if (match) return match;

    // 4. StartsWith / Includes in Name or State
    match = destinations.find(d => d.name.toLowerCase().startsWith(cleanQuery));
    if (match) return match;

    match = destinations.find(d => cleanQuery.includes(d.name.toLowerCase()));
    if (match) return match;

    match = destinations.find(d => d.aliases && d.aliases.some(a => cleanQuery.includes(a.toLowerCase())));
    if (match) return match;

    return null;
  }

  /**
   * Asynchronously attempts to resolve an entered location using Open-Meteo Geocoding
   * if not found in local catalog, ensuring we gracefully handle any city.
   */
  async function resolveLocationOnline(query) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.results || data.results.length === 0) return null;

      // Prefer Indian location if available
      const indianMatch = data.results.find(r => r.country_code === "IN") || data.results[0];
      return indianMatch;
    } catch (e) {
      console.warn("Geocoding lookup failed:", e);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // FORM & INPUT INTERACTIONS
  // ---------------------------------------------------------------------------
  function initFormInteractions() {
    // Destination input change & clear button
    if (elements.destinationInput && elements.btnClearDest) {
      elements.destinationInput.addEventListener("input", function () {
        const hasVal = this.value.trim().length > 0;
        elements.btnClearDest.style.display = hasVal ? "flex" : "none";
        hideDestFeedback();
      });

      elements.btnClearDest.addEventListener("click", function () {
        elements.destinationInput.value = "";
        elements.btnClearDest.style.display = "none";
        hideDestFeedback();
        elements.destinationInput.focus();

        // Update pills: select 'all'
        document.querySelectorAll(".destination-chip").forEach(c => {
          c.classList.toggle("active", c.dataset.dest === "all");
        });
      });
    }

    // Destination quick pick pills
    document.querySelectorAll(".destination-chip").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".destination-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");

        const destVal = this.dataset.dest;
        if (destVal === "all") {
          elements.destinationInput.value = "";
          if (elements.btnClearDest) elements.btnClearDest.style.display = "none";
          hideDestFeedback();
        } else {
          const destObj = window.TRAVEL_DATA.destinations.find(d => d.id === destVal);
          if (destObj) {
            elements.destinationInput.value = destObj.name;
            if (elements.btnClearDest) elements.btnClearDest.style.display = "flex";
            showDestFeedback(`Selected: ${destObj.name}, ${destObj.state}`, "success");
          }
        }

        // Trigger immediate plan generation with auto-scroll
        handleFormSubmit(false, true);
      });
    });

    // Preset chips: Origin
    document.querySelectorAll(".origin-chip").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".origin-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        elements.originSelect.value = this.dataset.origin;
      });
    });

    // Preset chips: Travellers
    document.querySelectorAll(".traveller-chip").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".traveller-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        elements.travellersInput.value = this.dataset.val;
        updateLiveBudgetPreview();
      });
    });

    // Preset chips: Budget
    document.querySelectorAll(".budget-chip").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".budget-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        elements.budgetInput.value = this.dataset.val;
        updateLiveBudgetPreview();
      });
    });

    // Live budget & travellers input change listeners
    if (elements.budgetInput) {
      elements.budgetInput.addEventListener("input", updateLiveBudgetPreview);
    }
    if (elements.travellersInput) {
      elements.travellersInput.addEventListener("input", updateLiveBudgetPreview);
    }

    // Preset chips: Duration
    document.querySelectorAll(".duration-chip").forEach(chip => {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".duration-chip").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        elements.durationInput.value = this.dataset.val;
      });
    });

    // Radio cards selection effect
    document.querySelectorAll(".radio-card input").forEach(radio => {
      radio.addEventListener("change", function () {
        const groupName = this.name;
        document.querySelectorAll(`.radio-card input[name="${groupName}"]`).forEach(r => {
          r.closest(".radio-card").classList.remove("active");
        });
        this.closest(".radio-card").classList.add("active");
      });
    });

    // Hero "Try This Example" button
    if (elements.heroTrySampleBtn) {
      elements.heroTrySampleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        elements.destinationInput.value = "Jaipur";
        if (elements.btnClearDest) elements.btnClearDest.style.display = "flex";
        elements.originSelect.value = "agra";
        elements.travellersInput.value = "4";
        elements.budgetInput.value = "40000";
        elements.durationInput.value = "3";
        const trainRadio = document.querySelector('input[name="transportMode"][value="train"]');
        if (trainRadio) {
          trainRadio.checked = true;
          trainRadio.dispatchEvent(new Event("change"));
        }
        updateLiveBudgetPreview();
        handleFormSubmit(false, true);
      });
    }

    // Smooth glide for all "Plan My Trip" anchor links (Navbar & Hero)
    document.querySelectorAll('a[href="#planner"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const plannerSection = document.getElementById("planner");
        if (plannerSection) {
          const navHeight = elements.navbar ? elements.navbar.offsetHeight : 70;
          const targetTop = plannerSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
          if (elements.destinationInput) {
            setTimeout(() => elements.destinationInput.focus(), 350);
          }
        }
      });
    });

    // Form submission with smooth auto-scroll to plan
    elements.plannerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmit(false, true);
    });

    // Explore All Recommendations button
    if (elements.exploreAllBtn) {
      elements.exploreAllBtn.addEventListener("click", function () {
        elements.destinationInput.value = "";
        if (elements.btnClearDest) elements.btnClearDest.style.display = "none";
        hideDestFeedback();
        document.querySelectorAll(".destination-chip").forEach(c => {
          c.classList.toggle("active", c.dataset.dest === "all");
        });
        handleFormSubmit(true, true); // force all recommendations view with auto-scroll
      });
    }

    // "Modify Plan" return button in results showcase
    if (elements.showcaseModifyBtn) {
      elements.showcaseModifyBtn.addEventListener("click", function () {
        const plannerSection = document.getElementById("planner");
        if (plannerSection) {
          const navHeight = elements.navbar ? elements.navbar.offsetHeight : 70;
          const targetTop = plannerSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
          if (elements.destinationInput) {
            setTimeout(() => elements.destinationInput.focus(), 350);
          }
        }
      });
    }

    // Filter buttons
    elements.filterButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        elements.filterButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        state.activeFilter = this.dataset.filter;
        renderFilteredAndSortedResults();
      });
    });

    // Sort select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener("change", function () {
        state.activeSort = this.value;
        renderFilteredAndSortedResults();
      });
    }

    // Empty state reset button
    if (elements.emptyResetFilterBtn) {
      elements.emptyResetFilterBtn.addEventListener("click", function () {
        state.activeFilter = "all";
        elements.filterButtons.forEach(b => {
          b.classList.toggle("active", b.dataset.filter === "all");
        });
        renderFilteredAndSortedResults();
      });
    }
  }

  function updateLiveBudgetPreview() {
    if (!elements.bppText || !elements.budgetInput || !elements.travellersInput) return;
    const b = parseFloat(elements.budgetInput.value) || 0;
    const t = parseInt(elements.travellersInput.value, 10) || 1;
    const perPerson = Math.round(b / Math.max(1, t));
    elements.bppText.innerHTML = `Est. <strong>₹${formatNumber(perPerson)}</strong> / person for ${t} traveller${t > 1 ? "s" : ""}`;
  }

  function showDestFeedback(message, type = "success") {
    if (!elements.destFeedbackBar) return;
    elements.destFeedbackBar.className = `dest-feedback-bar ${type}`;
    elements.destFeedbackBar.innerHTML = `
      <span>${type === "success" ? "✓" : "⚠️"}</span>
      <span>${escapeHTML(message)}</span>
    `;
    elements.destFeedbackBar.style.display = "flex";
  }

  function hideDestFeedback() {
    if (elements.destFeedbackBar) {
      elements.destFeedbackBar.style.display = "none";
    }
  }

  function getFormInputs() {
    const destinationQuery = elements.destinationInput ? elements.destinationInput.value.trim() : "";
    const origin = elements.originSelect.value.trim();
    const travellers = parseInt(elements.travellersInput.value, 10);
    const budget = parseFloat(elements.budgetInput.value);
    const duration = parseInt(elements.durationInput.value, 10);
    const travelDate = elements.travelDateInput ? elements.travelDateInput.value.trim() : "";
    const accommodation = elements.accommodationSelect.value;

    const styleEl = document.querySelector('input[name="travelStyle"]:checked');
    const travelStyle = styleEl ? styleEl.value : "Budget";

    const transportEl = document.querySelector('input[name="transportMode"]:checked');
    const transportMode = transportEl ? transportEl.value : "train";

    const selectedInterests = [];
    document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
      selectedInterests.push(cb.value);
    });

    return {
      destinationQuery,
      origin,
      travellers,
      budget,
      duration,
      travelDate,
      accommodation,
      travelStyle,
      transportMode,
      interests: selectedInterests
    };
  }

  function validateInputs(params) {
    if (!params.origin) {
      return "Please select your starting origin city.";
    }
    if (isNaN(params.travellers) || params.travellers < 1 || params.travellers > 100) {
      return "Number of travellers must be between 1 and 100.";
    }
    if (isNaN(params.budget) || params.budget < 500) {
      return "Please enter a group budget of at least ₹500 INR.";
    }
    if (isNaN(params.duration) || params.duration < 1 || params.duration > 30) {
      return "Trip duration must be between 1 and 30 days.";
    }
    return null;
  }

  function showError(message) {
    if (!elements.formErrorAlert || !elements.formErrorMsg) return;
    elements.formErrorMsg.textContent = message;
    elements.formErrorAlert.style.display = "flex";
    elements.formErrorAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideError() {
    if (elements.formErrorAlert) {
      elements.formErrorAlert.style.display = "none";
    }
  }

  async function handleFormSubmit(forceShowAll = false, autoScroll = true) {
    const params = getFormInputs();
    const error = validateInputs(params);

    if (error) {
      showError(error);
      return;
    }
    hideError();

    // Trigger visual loading feedback on Plan My Trip button if user-initiated
    if (autoScroll && elements.generateTripBtn) {
      elements.generateTripBtn.classList.add("btn-loading");
      elements.generateTripBtn.disabled = true;
      elements.generateTripBtn.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span class="btn-text">Crafting Your Itinerary...</span>
      `;
    }

    state.currentSearchParams = params;

    // 1. Evaluate all destinations for comparison grid
    const evaluatedResults = rankDestinations(window.TRAVEL_DATA.destinations, params);
    state.calculatedResults = evaluatedResults;

    // 2. Resolve destination if user typed a specific destination
    let targetedDest = null;
    if (!forceShowAll && params.destinationQuery) {
      targetedDest = lookupDestination(params.destinationQuery);

      if (!targetedDest) {
        // Destination not recognized in catalog
        showDestFeedback(`Could not locate destination "${params.destinationQuery}". Showing all curated destinations. Try Manali, Goa, Jaipur, Rishikesh, Shimla, Udaipur, or Varanasi.`, "warning");
      } else {
        showDestFeedback(`Planning visit to ${targetedDest.name}, ${targetedDest.state}!`, "success");
      }
    } else {
      hideDestFeedback();
    }

    // 3. Render Results Banner & Grid
    renderResultsBanner(params, evaluatedResults);
    renderFilteredAndSortedResults();

    // 4. Update and display Selected Destination Showcase
    if (targetedDest) {
      const matchedItem = evaluatedResults.find(r => r.destination.id === targetedDest.id) || {
        destination: targetedDest,
        budget: calculateTripBudget(targetedDest, params),
        matchScore: 98
      };
      displaySelectedDestinationShowcase(matchedItem, params);
    } else {
      // By default or when "All" selected, showcase top match
      const topMatch = evaluatedResults[0];
      if (topMatch) {
        displaySelectedDestinationShowcase(topMatch, params);
      }
    }

    // Reveal results section smoothly
    elements.resultsSection.style.display = "block";
    elements.resultsSection.classList.remove("results-reveal-active");
    // Force DOM reflow to restart CSS animation smoothly
    void elements.resultsSection.offsetWidth;
    elements.resultsSection.classList.add("results-reveal-active");

    // Automatically slide/glide to the generated plan view if user triggered
    if (autoScroll) {
      setTimeout(() => {
        const targetEl = (targetedDest || !forceShowAll) && elements.showcaseSection && elements.showcaseSection.style.display !== "none"
          ? elements.showcaseSection
          : elements.resultsSection;

        if (targetEl) {
          const navHeight = elements.navbar ? elements.navbar.offsetHeight : 70;
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
        }

        // Restore button state
        if (elements.generateTripBtn) {
          elements.generateTripBtn.classList.remove("btn-loading");
          elements.generateTripBtn.disabled = false;
          elements.generateTripBtn.innerHTML = `
            <svg class="btn-main-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span class="btn-text">Plan My Trip</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          `;
        }
      }, 260);
    }
  }

  // ---------------------------------------------------------------------------
  // ACCURATE BUDGET CALCULATOR
  // ---------------------------------------------------------------------------
  function calculateTripBudget(dest, params) {
    const travellers = params.travellers;
    const duration = params.duration;
    const totalBudget = params.budget;
    const origin = params.origin;
    const transportMode = params.transportMode || "train";
    const travelStyle = params.travelStyle || "Budget";
    const accommodationPref = params.accommodation || "any";

    // 1. Distance & Round-Trip Transport Cost Calculation
    const originDistances = window.TRAVEL_DATA.distances[origin] || {};
    let distanceKm = originDistances[dest.id];
    if (distanceKm === undefined) {
      distanceKm = (origin === dest.id) ? 25 : 500;
    }

    const transportRateConfig = window.TRAVEL_DATA.transportRates[transportMode] || window.TRAVEL_DATA.transportRates.train;
    let transportCostPerPerson;
    if (distanceKm <= 30) {
      transportCostPerPerson = 250;
    } else {
      const calculatedFare = Math.round(distanceKm * transportRateConfig.baseRatePerKm);
      transportCostPerPerson = Math.max(transportRateConfig.minFare, calculatedFare);
    }
    const transportTotal = transportCostPerPerson * travellers;

    // 2. Overnight Stays & Room Calculation (1-day trip = 0 hotel nights!)
    const nights = Math.max(0, duration - 1);

    let targetHotelTier = "Standard";
    if (accommodationPref !== "any") {
      targetHotelTier = accommodationPref;
    } else {
      targetHotelTier = travelStyle;
    }

    let selectedHotel = dest.hotels.find(h => h.tier.toLowerCase() === targetHotelTier.toLowerCase()) || dest.hotels[0];
    const roomCapacity = selectedHotel.roomCapacity || 2;
    const requiredRooms = Math.ceil(travellers / roomCapacity);
    const accommodationTotal = nights > 0 ? (selectedHotel.nightlyRate * requiredRooms * nights) : 0;

    // 3. Food Cost Calculation
    const styleKey = travelStyle.toLowerCase();
    const foodCostPerPersonDaily = dest.dailyFoodCostPerPerson[styleKey] || dest.dailyFoodCostPerPerson.standard;
    const foodTotal = foodCostPerPersonDaily * travellers * duration;

    // 4. Local Group Transport Cost Calculation
    const localTransportDaily = dest.dailyLocalTransportGroup[styleKey] || dest.dailyLocalTransportGroup.standard;
    const localTransportTotal = localTransportDaily * duration;

    // 5. Sightseeing & Attraction Fees Calculation
    const plannedAttractionsCount = Math.min(dest.attractions.length, Math.max(2, duration * 2));
    const plannedAttractions = dest.attractions.slice(0, plannedAttractionsCount);
    const attractionFeesPerPerson = plannedAttractions.reduce((sum, att) => sum + (att.fee || 0), 0);
    const attractionTotal = attractionFeesPerPerson * travellers;

    // 6. Subtotal
    const subtotal = transportTotal + accommodationTotal + foodTotal + localTransportTotal + attractionTotal;

    // 7. 10% Emergency Reserve
    const emergencyReserve = Math.round(subtotal * 0.10);

    // 8. Total Estimated Trip Cost
    const totalEstimatedCost = subtotal + emergencyReserve;

    // 9. Per-Person Cost
    const perPersonCost = Math.round(totalEstimatedCost / travellers);

    // 10. Remaining Budget & Affordability Status
    const remainingBudget = totalBudget - totalEstimatedCost;
    const isAffordable = remainingBudget >= 0;
    const budgetUsagePercent = Math.min(100, Math.round((totalEstimatedCost / totalBudget) * 100));

    return {
      destinationId: dest.id,
      distanceKm,
      transportMode,
      transportCostPerPerson,
      transportTotal,
      nights,
      requiredRooms,
      roomCapacity,
      selectedHotel,
      accommodationTotal,
      foodCostPerPersonDaily,
      foodTotal,
      localTransportDaily,
      localTransportTotal,
      plannedAttractions,
      attractionFeesPerPerson,
      attractionTotal,
      subtotal,
      emergencyReserve,
      totalEstimatedCost,
      perPersonCost,
      remainingBudget,
      isAffordable,
      budgetUsagePercent
    };
  }

  // ---------------------------------------------------------------------------
  // RANKING ALGORITHM
  // ---------------------------------------------------------------------------
  function rankDestinations(destinationsList, params) {
    const results = [];

    destinationsList.forEach(dest => {
      const budgetCalc = calculateTripBudget(dest, params);

      // A. Feasibility Score (Weight: 45%)
      let feasibilityScore = 0;
      if (budgetCalc.isAffordable) {
        const savingsRatio = budgetCalc.remainingBudget / params.budget;
        if (savingsRatio >= 0.05 && savingsRatio <= 0.40) {
          feasibilityScore = 100;
        } else if (savingsRatio > 0.40) {
          feasibilityScore = 90;
        } else {
          feasibilityScore = 95;
        }
      } else {
        const deficitPercent = Math.abs(budgetCalc.remainingBudget) / params.budget;
        if (deficitPercent <= 0.15) feasibilityScore = 60;
        else if (deficitPercent <= 0.35) feasibilityScore = 35;
        else feasibilityScore = 10;
      }

      // B. Interest Matching Score (Weight: 35%)
      let interestScore = 50;
      if (params.interests && params.interests.length > 0) {
        let matchedCount = 0;
        params.interests.forEach(interest => {
          if (dest.tags.includes(interest) || dest.category === interest) {
            matchedCount++;
          }
        });
        const matchRatio = matchedCount / params.interests.length;
        interestScore = Math.round(matchRatio * 100);
      }

      // C. Duration Suitability Score (Weight: 15%)
      let durationScore = 70;
      if (params.duration >= dest.idealDuration.min && params.duration <= dest.idealDuration.max) {
        durationScore = 100;
      } else if (params.duration < dest.idealDuration.min) {
        durationScore = 60;
      } else {
        durationScore = 80;
      }

      // D. Distance Feasibility Score (Weight: 5%)
      let distanceScore = 80;
      if (budgetCalc.distanceKm < 400) distanceScore = 100;
      else if (budgetCalc.distanceKm < 800) distanceScore = 85;
      else if (budgetCalc.distanceKm < 1400) distanceScore = 70;
      else distanceScore = 50;

      const totalMatchScore = Math.round(
        (feasibilityScore * 0.45) +
        (interestScore * 0.35) +
        (durationScore * 0.15) +
        (distanceScore * 0.05)
      );

      results.push({
        destination: dest,
        budget: budgetCalc,
        matchScore: totalMatchScore
      });
    });

    return results;
  }

  // ---------------------------------------------------------------------------
  // LIVE WEATHER INTEGRATION (Open-Meteo APIs)
  // ---------------------------------------------------------------------------
  /**
   * Converts WMO weather codes into human-readable descriptions and SVG icons.
   */
  function parseWeatherCode(code) {
    // Standard WMO weather interpretation code (WW)
    if (code === 0) {
      return {
        description: "Clear Sky",
        category: "Clear",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      };
    }
    if (code === 1 || code === 2) {
      return {
        description: code === 1 ? "Mainly Clear" : "Partly Cloudy",
        category: "Partly Cloudy",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#00A896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M20 12h2"></path><path d="M19.07 4.93l-1.41 1.41"></path><path d="M15.5 13.5A4.5 4.5 0 0 0 11 9c-1.5 0-2.8.7-3.6 1.8A4 4 0 0 0 4 14.5a3.5 3.5 0 0 0 3.5 3.5h11a3 3 0 0 0 0-6c-.3 0-.7 0-1 .1"></path></svg>`
      };
    }
    if (code === 3) {
      return {
        description: "Overcast / Cloudy",
        category: "Cloudy",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`
      };
    }
    if (code === 45 || code === 48) {
      return {
        description: "Foggy & Mist",
        category: "Fog",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="4" y1="16" x2="20" y2="16"></line><line x1="6" y1="20" x2="18" y2="20"></line></svg>`
      };
    }
    if (code >= 51 && code <= 57) {
      return {
        description: "Light Drizzle",
        category: "Rain",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><line x1="8" y1="19" x2="8" y2="21"></line><line x1="12" y1="19" x2="12" y2="21"></line><line x1="16" y1="19" x2="16" y2="21"></line></svg>`
      };
    }
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return {
        description: code >= 80 ? "Rain Showers" : "Steady Rain",
        category: "Rain",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`
      };
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return {
        description: "Snowfall & Flurries",
        category: "Snow",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line></svg>`
      };
    }
    if (code >= 95) {
      return {
        description: "Thunderstorm",
        category: "Thunderstorm",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>`
      };
    }
    return {
      description: "Mild & Pleasant",
      category: "Clear",
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#00A896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle></svg>`
    };
  }

  /**
   * Generates practical travel weather advice based on actual forecast data.
   */
  function generateWeatherAdvice(current, daily) {
    const currentCode = current.weather_code;
    const currentTemp = current.temperature_2m;
    const maxTemp = (daily && daily.temperature_2m_max) ? Math.max(...daily.temperature_2m_max) : currentTemp;
    const minTemp = (daily && daily.temperature_2m_min) ? Math.min(...daily.temperature_2m_min) : currentTemp;
    const maxPrecip = (daily && daily.precipitation_probability_max) ? Math.max(...daily.precipitation_probability_max) : 0;

    if (currentCode >= 95 || (daily && daily.weather_code && daily.weather_code.some(c => c >= 95))) {
      return "Thunderstorm conditions forecasted: advise checking local forecasts before outdoor mountain or water activities.";
    }
    if (maxPrecip > 35 || currentCode >= 51 && currentCode <= 67 || (daily && daily.weather_code && daily.weather_code.some(c => c >= 61 && c <= 82))) {
      return `Rain expected (${maxPrecip}% peak probability): consider carrying an umbrella, light waterproof jacket, and covered footwear.`;
    }
    if (minTemp < 12 || (currentCode >= 71 && currentCode <= 86)) {
      return `Chilly conditions expected (${minTemp}°C night low): recommend packing thermal layers, woolens, and warm socks.`;
    }
    if (maxTemp > 33) {
      return `High daytime temperatures forecasted (${maxTemp}°C peak): stay well-hydrated, use sunscreen, and schedule outdoor fort/monument walks before 11 AM.`;
    }
    return "Pleasant conditions expected: ideal weather for sightseeing, walking tours, and open-air exploration!";
  }

  /**
   * Fetches live weather from Open-Meteo for a given destination.
   */
  async function fetchLiveWeather(dest) {
    if (!dest) return null;

    const cacheKey = `${dest.latitude.toFixed(3)},${dest.longitude.toFixed(3)}`;
    const now = Date.now();

    // Check 10-minute cache
    if (state.weatherCache[cacheKey] && (now - state.weatherCache[cacheKey].timestamp < 600000)) {
      return state.weatherCache[cacheKey].data;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.latitude}&longitude=${dest.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo Weather API responded with HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (!data.current) {
      throw new Error("Malformed weather payload returned from Open-Meteo.");
    }

    state.weatherCache[cacheKey] = {
      timestamp: now,
      data: data
    };

    return data;
  }

  /**
   * Updates the Live Weather UI components in the Showcase Card and the Modal.
   */
  async function updateDestinationWeather(dest) {
    if (!elements.weatherCard) return;

    const reqId = ++state.weatherRequestId;

    // Show loading state
    elements.weatherLoading.style.display = "flex";
    elements.weatherContent.style.display = "none";
    elements.weatherError.style.display = "none";

    elements.weatherSubtitle.textContent = `Real-time forecast for ${dest.name}, ${dest.state}`;

    try {
      const data = await fetchLiveWeather(dest);

      // Verify request is still the latest to prevent race conditions
      if (reqId !== state.weatherRequestId) return;

      const current = data.current;
      const daily = data.daily;
      const weatherInfo = parseWeatherCode(current.weather_code);

      // Current values
      elements.weatherCurrentTemp.textContent = Math.round(current.temperature_2m * 10) / 10;
      elements.weatherCurrentIcon.innerHTML = weatherInfo.iconSvg;
      elements.weatherCurrentDesc.textContent = weatherInfo.description;
      elements.weatherCurrentFeels.textContent = `${Math.round(current.apparent_temperature * 10) / 10}°C`;

      const obsTimeStr = current.time ? formatObservationTime(current.time) : "Live observation";
      elements.weatherCurrentTime.textContent = `Live observation: ${obsTimeStr}`;

      elements.weatherHumidity.textContent = `${current.relative_humidity_2m || 0}%`;
      elements.weatherWind.textContent = `${current.wind_speed_10m || 0} km/h`;

      const currentPrecip = (daily && daily.precipitation_probability_max && daily.precipitation_probability_max[0] !== undefined)
        ? `${daily.precipitation_probability_max[0]}%`
        : "0%";
      elements.weatherPrecip.textContent = currentPrecip;

      // Practical Travel Advice
      const advice = generateWeatherAdvice(current, daily);
      elements.weatherAdviceText.textContent = advice;

      // 5-Day Forecast Strip
      renderForecastStrip(daily);

      // Render into Modal Tab if present
      renderModalWeatherTab(dest, current, daily, weatherInfo, advice);

      // Show content
      elements.weatherLoading.style.display = "none";
      elements.weatherContent.style.display = "block";
    } catch (err) {
      if (reqId !== state.weatherRequestId) return;
      console.warn("Weather fetch error:", err);

      elements.weatherLoading.style.display = "none";
      elements.weatherContent.style.display = "none";
      elements.weatherError.style.display = "flex";
      elements.weatherErrorMsg.textContent = "Live weather is currently unavailable. Please check your network or try again.";

      if (elements.modalWeatherContainer) {
        elements.modalWeatherContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
            <p>Live weather forecast could not be loaded at this moment.</p>
            <button class="btn btn-secondary btn-sm" onclick="window.AITraveller.retryWeather()">Retry Live Weather</button>
          </div>
        `;
      }
    }
  }

  function formatObservationTime(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return isoString;
    }
  }

  function renderForecastStrip(daily) {
    if (!elements.weatherForecastStrip || !daily || !daily.time) return;
    elements.weatherForecastStrip.innerHTML = "";

    const daysCount = Math.min(5, daily.time.length);
    for (let i = 0; i < daysCount; i++) {
      const dateStr = daily.time[i];
      const code = daily.weather_code[i];
      const maxT = Math.round(daily.temperature_2m_max[i]);
      const minT = Math.round(daily.temperature_2m_min[i]);
      const precip = (daily.precipitation_probability_max && daily.precipitation_probability_max[i] !== undefined)
        ? daily.precipitation_probability_max[i]
        : 0;

      const dayName = i === 0 ? "Today" : getDayAbbreviation(dateStr);
      const wInfo = parseWeatherCode(code);

      const item = document.createElement("div");
      item.className = "forecast-item";
      item.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <div class="forecast-icon-mini">${wInfo.iconSvg}</div>
        <div class="forecast-temp-range">
          <span>${maxT}°</span> / <span class="low">${minT}°</span>
        </div>
        <span class="forecast-precip">${precip}% rain</span>
      `;
      elements.weatherForecastStrip.appendChild(item);
    }
  }

  function getDayAbbreviation(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short" });
  }

  function renderModalWeatherTab(dest, current, daily, weatherInfo, advice) {
    if (!elements.modalWeatherContainer) return;

    elements.modalWeatherContainer.innerHTML = `
      <div style="background: var(--color-bg-subtle); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h4 style="font-family: var(--font-heading); color: var(--color-primary); font-size: 1.3rem;">
              ${escapeHTML(dest.name)} Live Weather
            </h4>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">
              Latitude: ${dest.latitude.toFixed(3)}°N • Longitude: ${dest.longitude.toFixed(3)}°E
            </span>
          </div>
          <span class="pill-success" style="font-size: 0.78rem;">Live Open-Meteo API</span>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 48px; height: 48px;">${weatherInfo.iconSvg}</div>
            <div>
              <span style="font-size: 2.2rem; font-weight: 800; color: var(--color-primary);">${Math.round(current.temperature_2m * 10) / 10}°C</span>
              <span style="display: block; font-size: 0.85rem; color: var(--color-text-muted);">Feels like ${Math.round(current.apparent_temperature * 10) / 10}°C</span>
            </div>
          </div>
          <div style="border-left: 1px solid var(--color-border); padding-left: 1.25rem;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary);">${escapeHTML(weatherInfo.description)}</div>
            <div style="font-size: 0.82rem; color: var(--color-text-muted);">Humidity: ${current.relative_humidity_2m}% • Wind: ${current.wind_speed_10m} km/h</div>
          </div>
        </div>

        <div class="weather-advice-box" style="margin-top: 1.25rem; margin-bottom: 0;">
          <span class="advice-icon">💡</span>
          <div class="advice-text">
            <strong>Travel Advisory:</strong>
            <span>${escapeHTML(advice)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // GOOGLE MAPS & DIRECTIONS ENGINE
  // ---------------------------------------------------------------------------
  /**
   * Constructs official URL-encoded Google Maps search link.
   * Format: https://www.google.com/maps/search/?api=1&query=DESTINATION
   */
  function getGoogleMapsSearchUrl(query) {
    const url = new URL("https://www.google.com/maps/search/");
    url.searchParams.set("api", "1");
    url.searchParams.set("query", query);
    return url.toString();
  }

  /**
   * Constructs official URL-encoded Google Maps directions link with travelmode.
   * Format: https://www.google.com/maps/dir/?api=1&origin=STARTING_CITY&destination=DESTINATION&travelmode=MODE
   */
  function getGoogleMapsDirectionsUrl(origin, destination, mode = "driving") {
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    if (mode) {
      url.searchParams.set("travelmode", mode);
    }
    return url.toString();
  }

  /**
   * Updates the Google Maps & Directions UI in the Active Showcase Card.
   */
  function updateDestinationMaps(dest, originCityId) {
    if (!elements.mapsCard) return;

    const originName = getCityName(originCityId) + ", India";
    const destName = `${dest.name}, ${dest.state}, India`;
    const mode = state.mapsTravelMode || "driving";

    elements.mapsRouteLabel.textContent = `Route: ${getCityName(originCityId)} → ${dest.name}`;
    elements.gmapsDirectionsText.textContent = `Directions (${capitalize(mode)})`;

    // 1. Directions link
    const directionsUrl = getGoogleMapsDirectionsUrl(originName, destName, mode);
    elements.gmapsDirectionsLink.href = directionsUrl;

    // 2. Explore Destination link
    const searchUrl = getGoogleMapsSearchUrl(destName);
    elements.gmapsExploreLink.href = searchUrl;

    // 3. Embedded Google Maps Iframe (non-blocking fallback)
    const embedQuery = encodeURIComponent(`${dest.name}, ${dest.state}, India`);
    elements.gmapsIframe.src = `https://maps.google.com/maps?q=${embedQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

    // 4. Attractions list with Google Maps Actions
    renderAttractionsMapsList(dest, originName);

    // 5. Update Modal Maps Tab
    renderModalMapsTab(dest, originName, directionsUrl, searchUrl, embedQuery);
  }

  function renderAttractionsMapsList(dest, originName) {
    if (!elements.attractionsMapsList) return;
    elements.attractionsMapsList.innerHTML = "";

    const mode = state.mapsTravelMode || "driving";

    dest.attractions.slice(0, 5).forEach(att => {
      const attQuery = `${att.name}, ${dest.name}, India`;
      const attSearchUrl = getGoogleMapsSearchUrl(attQuery);
      const attDirUrl = getGoogleMapsDirectionsUrl(originName, attQuery, mode);

      const row = document.createElement("div");
      row.className = "attraction-map-row";
      row.innerHTML = `
        <div class="attraction-map-info">
          <span class="attraction-map-name">${escapeHTML(att.name)}</span>
          <span class="attraction-map-meta">${escapeHTML(att.category)} • Entry: ₹${att.fee} • ~${att.durationHours}h</span>
        </div>
        <div class="attraction-map-actions">
          <a href="${attSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn-map-pill" title="View monument on Google Maps">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Map
          </a>
          <a href="${attDirUrl}" target="_blank" rel="noopener noreferrer" class="btn-map-pill" title="Get directions to monument">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            Directions
          </a>
        </div>
      `;
      elements.attractionsMapsList.appendChild(row);
    });
  }

  function renderModalMapsTab(dest, originName, directionsUrl, searchUrl, embedQuery) {
    if (!elements.modalMapsContainer) return;

    elements.modalMapsContainer.innerHTML = `
      <div style="background: var(--color-bg-subtle); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h4 style="font-family: var(--font-heading); color: var(--color-primary); font-size: 1.25rem;">
              Google Maps Navigation
            </h4>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">
              From ${escapeHTML(originName.replace(", India", ""))} to ${escapeHTML(dest.name)}
            </span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              Open Route Directions
            </a>
            <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              View on Google Maps
            </a>
          </div>
        </div>

        <div style="border-radius: var(--radius-sm); overflow: hidden; height: 260px; margin-bottom: 1.25rem; background: #E2E8F0;">
          <iframe title="Destination map view" src="https://maps.google.com/maps?q=${embedQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>

        <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">
          Attractions Direct Navigation Links:
        </h5>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${dest.attractions.map(att => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--color-bg-card); border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;">
              <span><strong>${escapeHTML(att.name)}</strong> (${escapeHTML(att.category)})</span>
              <div style="display: flex; gap: 0.4rem;">
                <a href="${getGoogleMapsSearchUrl(att.name + ', ' + dest.name + ', India')}" target="_blank" rel="noopener noreferrer" class="btn-map-pill">Map</a>
                <a href="${getGoogleMapsDirectionsUrl(originName, att.name + ', ' + dest.name + ', India', state.mapsTravelMode)}" target="_blank" rel="noopener noreferrer" class="btn-map-pill">Directions</a>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // ACTIVE SELECTED DESTINATION SHOWCASE
  // ---------------------------------------------------------------------------
  function displaySelectedDestinationShowcase(item, params) {
    state.selectedDestinationItem = item;
    const dest = item.destination;
    const b = item.budget;

    // 1. Text & Meta Information
    elements.showcaseName.textContent = dest.name;
    elements.showcaseLocation.textContent = `${dest.state}, ${dest.country || "India"}`;
    elements.showcaseCategory.textContent = dest.category;
    elements.showcaseTagline.textContent = dest.tagline;

    // Feasibility status badge
    if (b.isAffordable) {
      elements.showcaseFeasibilityBadge.innerHTML = `
        <span class="status-badge affordable" style="font-size: 0.9rem; padding: 0.4rem 0.9rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Within Budget (+₹${formatNumber(b.remainingBudget)} saved)
        </span>
      `;
    } else {
      elements.showcaseFeasibilityBadge.innerHTML = `
        <span class="status-badge over-budget" style="font-size: 0.9rem; padding: 0.4rem 0.9rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Over Budget by ₹${formatNumber(Math.abs(b.remainingBudget))}
        </span>
      `;
    }

    // Save trip button in showcase
    const isSaved = isTripSaved(dest.id);
    elements.showcaseSaveBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      ${isSaved ? "Saved in Trips" : "Save Trip"}
    `;

    // Media & Overview
    elements.showcaseHeroImg.src = dest.heroImage;
    elements.showcaseHeroImg.alt = `${dest.name} travel photography`;
    elements.showcaseIdealStay.textContent = `Ideal: ${dest.idealDuration.label}`;
    elements.showcaseBestTime.textContent = `Best: ${dest.bestTimeToVisit}`;
    elements.showcaseDistance.textContent = `Distance: ${b.distanceKm} km`;
    elements.showcaseDesc.textContent = dest.description;

    elements.showcaseRouteInfo.textContent = `${getCityName(params.origin)} to ${dest.name} (${b.distanceKm} km)`;
    elements.showcaseEstTotal.textContent = `₹${formatNumber(b.totalEstimatedCost)}`;
    elements.showcaseEstTotal.style.color = b.isAffordable ? "var(--color-primary)" : "var(--color-danger)";
    elements.showcasePerPerson.textContent = `₹${formatNumber(b.perPersonCost)} / person`;
    elements.showcaseSavings.textContent = b.isAffordable
      ? `+₹${formatNumber(b.remainingBudget)} saved`
      : `-₹${formatNumber(Math.abs(b.remainingBudget))} shortfall`;
    elements.showcaseSavings.style.color = b.isAffordable ? "var(--color-success)" : "var(--color-danger)";

    elements.showcaseActivities.innerHTML = "";
    dest.activities.forEach(act => {
      const li = document.createElement("li");
      li.textContent = act;
      elements.showcaseActivities.appendChild(li);
    });

    // 2. Fetch and render Live Weather (Open-Meteo)
    updateDestinationWeather(dest);

    // 3. Render Google Maps & Directions
    updateDestinationMaps(dest, params.origin);

    // 4. Render Tabs inside Showcase (Budget, Hotels, Itinerary, Reviews)
    renderShowcaseBudgetTable(item, params);
    renderShowcaseHotels(dest, b, params);
    renderShowcaseItinerary(dest, params);
    renderShowcaseReviews(dest.id);

    // Reveal Showcase
    elements.showcaseSection.style.display = "block";
  }

  function initShowcaseInteractions() {
    // Mode switcher buttons for Google Maps
    if (elements.mapsModeOptions) {
      elements.mapsModeOptions.querySelectorAll(".mode-chip").forEach(btn => {
        btn.addEventListener("click", function () {
          elements.mapsModeOptions.querySelectorAll(".mode-chip").forEach(b => b.classList.remove("active"));
          this.classList.add("active");
          state.mapsTravelMode = this.dataset.mode;

          if (state.selectedDestinationItem) {
            updateDestinationMaps(state.selectedDestinationItem.destination, state.currentSearchParams.origin);
          }
        });
      });
    }

    // Refresh weather button
    if (elements.btnRefreshWeather) {
      elements.btnRefreshWeather.addEventListener("click", function () {
        if (state.selectedDestinationItem) {
          // Clear cache key to force fresh API fetch
          const dest = state.selectedDestinationItem.destination;
          const cacheKey = `${dest.latitude.toFixed(3)},${dest.longitude.toFixed(3)}`;
          delete state.weatherCache[cacheKey];
          updateDestinationWeather(dest);
          showToast("Refreshing live weather observation...", "success");
        }
      });
    }

    // Retry weather button
    if (elements.btnRetryWeather) {
      elements.btnRetryWeather.addEventListener("click", function () {
        if (state.selectedDestinationItem) {
          updateDestinationWeather(state.selectedDestinationItem.destination);
        }
      });
    }

    // Save trip button in showcase
    if (elements.showcaseSaveBtn) {
      elements.showcaseSaveBtn.addEventListener("click", function () {
        if (!state.selectedDestinationItem) return;
        toggleSaveTrip(state.selectedDestinationItem);
        const isSaved = isTripSaved(state.selectedDestinationItem.destination.id);
        elements.showcaseSaveBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          ${isSaved ? "Saved in Trips" : "Save Trip"}
        `;
      });
    }

    // Print button in showcase
    if (elements.showcasePrintBtn) {
      elements.showcasePrintBtn.addEventListener("click", function () {
        window.print();
      });
    }

    // Tab buttons in showcase
    elements.showcaseTabBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        elements.showcaseTabBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const targetId = this.dataset.target;
        elements.showcaseTabPanes.forEach(pane => {
          pane.classList.toggle("active", pane.id === targetId);
        });
      });
    });

    // Write review link in showcase tab
    if (elements.scWriteReviewLink) {
      elements.scWriteReviewLink.addEventListener("click", function (e) {
        if (state.selectedDestinationItem) {
          elements.reviewDestSelect.value = state.selectedDestinationItem.destination.id;
        }
        openReviewForm();
      });
    }
  }

  function renderShowcaseBudgetTable(item, params) {
    const b = item.budget;
    elements.scBudgetHeaderGuests.textContent = `${params.travellers} travellers`;
    elements.scBudgetHeaderDays.textContent = `${params.duration} days`;

    elements.scBudgetTbody.innerHTML = `
      <tr>
        <td><strong>1. Round-Trip Transport</strong></td>
        <td>₹${formatNumber(b.transportCostPerPerson)} / person × ${params.travellers} travellers (${capitalize(params.transportMode)})</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.transportTotal)}</td>
      </tr>
      <tr>
        <td><strong>2. Accommodation</strong></td>
        <td>
          ${b.nights > 0 
            ? `₹${formatNumber(b.selectedHotel.nightlyRate)} / night × ${b.requiredRooms} rooms × ${b.nights} nights` 
            : `1-day trip: 0 hotel nights charged`}
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">Stay: ${escapeHTML(b.selectedHotel.name)} (${b.selectedHotel.tier})</div>
        </td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.accommodationTotal)}</td>
      </tr>
      <tr>
        <td><strong>3. Meals & Daily Food</strong></td>
        <td>₹${formatNumber(b.foodCostPerPersonDaily)} / person / day × ${params.travellers} travellers × ${params.duration} days</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.foodTotal)}</td>
      </tr>
      <tr>
        <td><strong>4. Local Group Transit</strong></td>
        <td>₹${formatNumber(b.localTransportDaily)} / day × ${params.duration} days (Local cabs, autos, fuel)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.localTransportTotal)}</td>
      </tr>
      <tr>
        <td><strong>5. Sightseeing & Tickets</strong></td>
        <td>₹${formatNumber(b.attractionFeesPerPerson)} fees / person × ${params.travellers} travellers (${b.plannedAttractions.length} monuments)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.attractionTotal)}</td>
      </tr>
      <tr style="background: var(--color-bg-subtle);">
        <td><strong>Subtotal Planned Expenses</strong></td>
        <td>Sum of items 1 through 5</td>
        <td style="text-align: right; font-weight: 800; color: var(--color-primary);">₹${formatNumber(b.subtotal)}</td>
      </tr>
      <tr>
        <td><strong>6. Emergency Reserve (10%)</strong></td>
        <td>Automatic 10% safety cushion for unexpected expenses</td>
        <td style="text-align: right; font-weight: 700; color: var(--color-secondary);">₹${formatNumber(b.emergencyReserve)}</td>
      </tr>
    `;

    elements.scBudgetTfoot.innerHTML = `
      <tr>
        <td colspan="2">TOTAL ESTIMATED TRIP COST (Group)</td>
        <td style="text-align: right; color: ${b.isAffordable ? "var(--color-primary)" : "var(--color-danger)"}; font-weight: 800;">
          ₹${formatNumber(b.totalEstimatedCost)}
        </td>
      </tr>
      <tr style="font-size: 0.92rem; color: var(--color-text-muted);">
        <td colspan="2">Cost Per Person (${params.travellers} Travellers)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.perPersonCost)}</td>
      </tr>
      <tr style="font-size: 0.95rem;">
        <td colspan="2">Total Stated Budget</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(params.budget)}</td>
      </tr>
      <tr style="font-size: 1rem; color: ${b.isAffordable ? "var(--color-success)" : "var(--color-danger)"};">
        <td colspan="2">${b.isAffordable ? "Estimated Budget Surplus (Savings)" : "Estimated Budget Deficit (Over Budget)"}</td>
        <td style="text-align: right; font-weight: 800;">
          ${b.isAffordable ? "+₹" + formatNumber(b.remainingBudget) : "-₹" + formatNumber(Math.abs(b.remainingBudget))}
        </td>
      </tr>
    `;

    if (b.isAffordable) {
      elements.scBudgetNote.innerHTML = `
        <div class="pill-success" style="display: flex; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
          ✅ This destination fits comfortably within your ₹${formatNumber(params.budget)} budget with an estimated ₹${formatNumber(b.remainingBudget)} reserve remaining.
        </div>
      `;
    } else {
      elements.scBudgetNote.innerHTML = `
        <div style="background: var(--color-danger-bg); color: var(--color-danger); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.88rem;">
          ⚠️ This trip exceeds your budget by ₹${formatNumber(Math.abs(b.remainingBudget))}. Consider opting for budget hotel stays, travelling by train/bus, or extending the budget by ~₹${formatNumber(Math.abs(b.remainingBudget))}.
        </div>
      `;
    }
  }

  function renderShowcaseHotels(dest, b, params) {
    elements.scHotelRoomsSummary.textContent = `${b.requiredRooms} room(s) required for ${params.travellers} traveller(s) based on standard ${b.roomCapacity} guests per room.`;
    elements.scHotelsGrid.innerHTML = "";

    dest.hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.className = "hotel-card";

      const totalHotelCost = b.nights > 0 ? (hotel.nightlyRate * b.requiredRooms * b.nights) : 0;
      const amenitiesList = hotel.amenities.map(a => `<span class="attraction-pill">${escapeHTML(a)}</span>`).join(" ");

      card.innerHTML = `
        <div class="hotel-media">
          <img src="${escapeHTML(hotel.image)}" alt="${escapeHTML(hotel.name)}" loading="lazy">
        </div>
        <div class="hotel-body">
          <span class="hotel-tier-badge">${escapeHTML(hotel.tier)} Tier</span>
          <h4 class="hotel-name">${escapeHTML(hotel.name)}</h4>
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 0.4rem;">${escapeHTML(hotel.area)} • ⭐ ${hotel.rating}</p>
          <p style="font-size: 0.84rem; color: var(--color-text-main); margin-bottom: 0.6rem; line-height: 1.4;">${escapeHTML(hotel.description)}</p>
          <div style="margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
            ${amenitiesList}
          </div>
          <div class="hotel-price">
            ₹${formatNumber(hotel.nightlyRate)} <span style="font-size: 0.8rem; font-weight: 500; color: var(--color-text-muted);">/ room / night</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-secondary); padding-top: 0.4rem; border-top: 1px dashed var(--color-border);">
            Group Total (${b.nights} nights): ₹${formatNumber(totalHotelCost)}
          </div>
        </div>
      `;
      elements.scHotelsGrid.appendChild(card);
    });
  }

  function renderShowcaseItinerary(dest, params) {
    elements.scItinDuration.textContent = `${params.duration} Days (${Math.max(0, params.duration - 1)} Nights)`;
    elements.scItineraryTimeline.innerHTML = "";

    const days = generateDynamicItinerary(dest, params.duration, params.interests);

    days.forEach(day => {
      const dayEl = document.createElement("div");
      dayEl.className = "timeline-day";

      const activitiesHtml = day.activities.map(act => `
        <div class="timeline-activity-item">
          <div>
            <strong style="color: var(--color-primary);">${escapeHTML(act.time)}:</strong>
            <span style="color: var(--color-text-muted); margin-left: 0.35rem;">${escapeHTML(act.text)}</span>
          </div>
          ${act.cost > 0 ? `<span style="font-size: 0.78rem; font-weight: 700; color: var(--color-secondary); white-space: nowrap;">Entry: ₹${act.cost}</span>` : ""}
        </div>
      `).join("");

      dayEl.innerHTML = `
        <h4>${escapeHTML(day.title)}</h4>
        <div class="timeline-activities">
          ${activitiesHtml}
        </div>
      `;

      elements.scItineraryTimeline.appendChild(dayEl);
    });
  }

  function renderShowcaseReviews(destId) {
    if (!elements.scReviewsContainer) return;
    elements.scReviewsContainer.innerHTML = "";

    const destReviews = state.reviews.filter(r => r.destinationId === destId);
    elements.scReviewsTitle.textContent = `Reviews for ${getDestinationNameById(destId)}`;
    elements.scReviewsSub.textContent = destReviews.length > 0 
      ? `Displaying ${destReviews.length} verified traveller review(s).`
      : "No reviews submitted for this destination yet.";

    if (destReviews.length === 0) {
      elements.scReviewsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--color-text-muted); grid-column: 1 / -1;">
          <p>No customer reviews yet for this destination. Share your experience!</p>
        </div>
      `;
      return;
    }

    destReviews.forEach(r => {
      const card = createReviewCardElement(r);
      elements.scReviewsContainer.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // PERSONALIZED DAY-BY-DAY ITINERARY GENERATOR
  // ---------------------------------------------------------------------------
  function generateDynamicItinerary(dest, duration, interests) {
    const itinerary = [];
    const attractions = [...dest.attractions];
    let attractionIndex = 0;

    for (let day = 1; day <= duration; day++) {
      let dayTitle = "";
      const dayActivities = [];

      if (day === 1) {
        dayTitle = `Day 1: Arrival, Check-In & First Explorations in ${dest.name}`;
        dayActivities.push({
          time: "Morning",
          text: `Depart from origin and arrive in ${dest.name}. Transfer to hotel and complete check-in procedures.`,
          cost: 0
        });

        if (attractions[attractionIndex]) {
          const att = attractions[attractionIndex++];
          dayActivities.push({
            time: "Afternoon",
            text: `Visit ${att.name}. ${att.highlights} (~${att.durationHours} hrs).`,
            cost: att.fee
          });
        }

        dayActivities.push({
          time: "Evening",
          text: `Explore vibrant local streets, witness evening aarti/sunset, and enjoy regional local delicacies for dinner.`,
          cost: 0
        });

      } else if (day === duration) {
        dayTitle = `Day ${day}: Final Sights, Souvenirs & Journey Home`;

        if (attractions[attractionIndex]) {
          const att = attractions[attractionIndex++];
          dayActivities.push({
            time: "Morning",
            text: `Morning visit to ${att.name} before crowd buildup (~${att.durationHours} hrs).`,
            cost: att.fee
          });
        } else {
          dayActivities.push({
            time: "Morning",
            text: `Relaxed breakfast and sunrise stroll around the local heritage promenade or lakeside.`,
            cost: 0
          });
        }

        dayActivities.push({
          time: "Midday",
          text: `Hotel check-out. Pick up authentic handicrafts, regional sweets, and souvenirs at the local bazaar.`,
          cost: 0
        });

        dayActivities.push({
          time: "Afternoon / Evening",
          text: `Board return transport back home with memorable travel photos and experiences.`,
          cost: 0
        });

      } else {
        dayTitle = `Day ${day}: Immersive Exploration & Curated Experiences`;

        if (attractions[attractionIndex]) {
          const att = attractions[attractionIndex++];
          dayActivities.push({
            time: "Morning",
            text: `Guided excursion to ${att.name}. ${att.highlights} (~${att.durationHours} hrs).`,
            cost: att.fee
          });
        }

        if (attractions[attractionIndex]) {
          const att = attractions[attractionIndex++];
          dayActivities.push({
            time: "Afternoon",
            text: `Explore ${att.name} followed by authentic local thali / cuisine stop.`,
            cost: att.fee
          });
        } else {
          const curAct = dest.activities[(day - 2) % dest.activities.length];
          dayActivities.push({
            time: "Afternoon",
            text: `${curAct}. Leisure exploration of scenic viewpoints and cafes.`,
            cost: 0
          });
        }

        dayActivities.push({
          time: "Evening",
          text: `Cultural music performance, local tea tasting, or serene sunset vantage point.`,
          cost: 0
        });
      }

      itinerary.push({
        dayNumber: day,
        title: dayTitle,
        activities: dayActivities
      });
    }

    return itinerary;
  }

  // ---------------------------------------------------------------------------
  // COMPARISON RESULTS GRID
  // ---------------------------------------------------------------------------
  function renderResultsBanner(params, results) {
    const originName = getCityName(params.origin);
    const affordableCount = results.filter(r => r.budget.isAffordable).length;

    elements.resultsHeadline.textContent = `Recommended Destinations from ${originName}`;
    elements.resultsSubheadline.textContent = `Found ${results.length} total options (${affordableCount} comfortably within your ₹${formatNumber(params.budget)} budget). Click any card to view its live weather, maps & full itinerary.`;

    elements.resultsSummaryTags.innerHTML = `
      <span class="summary-tag">📍 From: <strong>${escapeHTML(originName)}</strong></span>
      <span class="summary-tag">👥 <strong>${params.travellers} Travellers</strong></span>
      <span class="summary-tag">💰 Budget: <strong>₹${formatNumber(params.budget)}</strong></span>
      <span class="summary-tag">🗓️ Duration: <strong>${params.duration} Days</strong> (${Math.max(0, params.duration - 1)} Nights)</span>
      <span class="summary-tag">🚂 Mode: <strong>${capitalize(params.transportMode)}</strong></span>
      <span class="summary-tag">✨ Style: <strong>${params.travelStyle}</strong></span>
    `;
  }

  function renderFilteredAndSortedResults() {
    let list = [...state.calculatedResults];

    // Apply Filter
    if (state.activeFilter === "affordable") {
      list = list.filter(item => item.budget.isAffordable);
    } else if (state.activeFilter !== "all") {
      list = list.filter(item => item.destination.category.toLowerCase() === state.activeFilter.toLowerCase());
    }

    // Apply Sorting
    switch (state.activeSort) {
      case "cost-low":
        list.sort((a, b) => a.budget.totalEstimatedCost - b.budget.totalEstimatedCost);
        break;
      case "savings":
        list.sort((a, b) => b.budget.remainingBudget - a.budget.remainingBudget);
        break;
      case "duration":
        list.sort((a, b) => {
          const midA = (a.destination.idealDuration.min + a.destination.idealDuration.max) / 2;
          const midB = (b.destination.idealDuration.min + b.destination.idealDuration.max) / 2;
          return Math.abs(midA - state.currentSearchParams.duration) - Math.abs(midB - state.currentSearchParams.duration);
        });
        break;
      case "match":
      default:
        list.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    // Handle Empty State
    if (list.length === 0) {
      elements.destinationsContainer.innerHTML = "";
      elements.emptyResults.style.display = "block";

      if (state.activeFilter === "affordable") {
        elements.emptyStateMsg.textContent = `None of the destinations fit within ₹${formatNumber(state.currentSearchParams.budget)} for ${state.currentSearchParams.travellers} travellers over ${state.currentSearchParams.duration} days. Try increasing your budget, switching to train/bus, or reducing trip duration.`;
      } else {
        elements.emptyStateMsg.textContent = `No destinations found matching category "${state.activeFilter}". Try resetting your filter to view all options.`;
      }
      return;
    }

    elements.emptyResults.style.display = "none";
    elements.destinationsContainer.innerHTML = "";

    // Render Cards
    list.forEach(item => {
      const card = createDestinationCard(item);
      elements.destinationsContainer.appendChild(card);
    });
  }

  function createDestinationCard(item) {
    const dest = item.destination;
    const b = item.budget;
    const isSaved = isTripSaved(dest.id);

    const card = document.createElement("article");
    card.className = "dest-card";
    card.setAttribute("data-id", dest.id);

    const statusBadge = b.isAffordable
      ? `<span class="status-badge affordable">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
           Within Budget (₹${formatNumber(b.remainingBudget)} saved)
         </span>`
      : `<span class="status-badge over-budget">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
           Over Budget by ₹${formatNumber(Math.abs(b.remainingBudget))}
         </span>`;

    let barColor = "var(--color-secondary)";
    if (b.budgetUsagePercent > 100) {
      barColor = "var(--color-danger)";
    } else if (b.budgetUsagePercent > 85) {
      barColor = "var(--color-warning)";
    }

    const attractionsSnippet = dest.attractions.slice(0, 3).map(a => `<span class="attraction-pill">${escapeHTML(a.name)}</span>`).join("");

    card.innerHTML = `
      <div class="card-media">
        <img src="${escapeHTML(dest.heroImage)}" alt="${escapeHTML(dest.name)}" loading="lazy">
        <span class="badge-match">⚡ ${item.matchScore}% Match</span>
        <span class="badge-category">${escapeHTML(dest.category)}</span>
      </div>

      <div class="card-content">
        <div class="card-title-row">
          <h3 class="dest-title">${escapeHTML(dest.name)}</h3>
          <span class="dest-location">${escapeHTML(dest.state)}</span>
        </div>
        <p class="dest-tagline">${escapeHTML(dest.tagline)}</p>

        <div class="attraction-tags">
          ${attractionsSnippet}
        </div>

        <div class="card-budget-box">
          <div class="budget-status-row">
            <span>Budget Feasibility:</span>
            ${statusBadge}
          </div>

          <div class="progress-track" title="${b.budgetUsagePercent}% of budget">
            <div class="progress-fill" style="width: ${Math.min(100, b.budgetUsagePercent)}%; background: ${barColor};"></div>
          </div>

          <div class="budget-stats-grid" style="margin-top: 0.85rem;">
            <div>
              <span class="bstat-label">Estimated Total</span>
              <span class="bstat-value" style="color: ${b.isAffordable ? "var(--color-primary)" : "var(--color-danger)"};">
                ₹${formatNumber(b.totalEstimatedCost)}
              </span>
            </div>
            <div>
              <span class="bstat-label">Per Person</span>
              <span class="bstat-value">₹${formatNumber(b.perPersonCost)}</span>
            </div>
          </div>

          <div style="font-size: 0.76rem; color: var(--color-text-muted); display: flex; justify-content: space-between; border-top: 1px dashed var(--color-border); padding-top: 0.4rem;">
            <span>Hotel: ${b.nights} nights (${b.requiredRooms} rooms)</span>
            <span>Incl. 10% reserve</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary btn-sm view-details-btn">
            View Details & Itinerary
          </button>
          <button class="btn-icon-save ${isSaved ? "saved" : ""}" title="${isSaved ? "Saved to Trips" : "Save Trip"}" aria-label="Save Trip">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Click on Card selects and showcases destination
    card.addEventListener("click", function (e) {
      if (e.target.closest(".btn-icon-save")) return;
      displaySelectedDestinationShowcase(item, state.currentSearchParams);
      if (e.target.closest(".view-details-btn")) {
        openDestinationModal(item);
      } else {
        if (elements.showcaseSection) {
          const navHeight = elements.navbar ? elements.navbar.offsetHeight : 70;
          const targetTop = elements.showcaseSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      }
    });

    const saveBtn = card.querySelector(".btn-icon-save");
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSaveTrip(item, saveBtn);
    });

    return card;
  }

  // ---------------------------------------------------------------------------
  // DESTINATION DETAILS MODAL
  // ---------------------------------------------------------------------------
  function openDestinationModal(item) {
    state.modalDestinationItem = item;
    const dest = item.destination;
    const b = item.budget;
    const params = state.currentSearchParams;

    elements.modalHeroImg.src = dest.heroImage;
    elements.modalHeroImg.alt = dest.name;
    elements.modalCategory.textContent = dest.category;
    elements.modalDestTitle.textContent = dest.name;
    elements.modalDestLocation.textContent = `${dest.state}, India • Origin: ${getCityName(params.origin)} (${b.distanceKm} km)`;

    // Tab 1: Overview
    elements.modalOverviewDesc.textContent = dest.description;
    elements.modalBestTime.textContent = dest.bestTimeToVisit;
    elements.modalClimate.textContent = dest.climate;
    elements.modalIdealDuration.textContent = dest.idealDuration.label;

    elements.modalActivitiesList.innerHTML = "";
    dest.activities.forEach(act => {
      const li = document.createElement("li");
      li.textContent = act;
      elements.modalActivitiesList.appendChild(li);
    });

    // Tab 2: Detailed Budget Breakdown Table
    renderModalBudgetTable(item, params);

    // Tab 3: Recommended Hotels
    renderModalHotels(dest, b, params);

    // Tab 4: Day-by-Day Dynamic Itinerary
    renderModalItinerary(dest, params);

    // Tab 5: Live Weather & Maps
    updateDestinationWeather(dest);
    updateDestinationMaps(dest, params.origin);

    // Tab 6: Reviews in Modal
    renderModalReviewsTab(dest.id);

    // Update Save button state inside modal
    const isSaved = isTripSaved(dest.id);
    elements.modalSaveBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      ${isSaved ? "Saved in Trips" : "Save Trip"}
    `;

    // Reset to first tab
    switchModalTab("tab-overview");

    // Show modal
    elements.destinationModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function renderModalBudgetTable(item, params) {
    const b = item.budget;
    const tbody = elements.modalBudgetTbody;
    tbody.innerHTML = `
      <tr>
        <td><strong>1. Round-Trip Transport</strong></td>
        <td>₹${formatNumber(b.transportCostPerPerson)} / person × ${params.travellers} travellers (${capitalize(params.transportMode)})</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.transportTotal)}</td>
      </tr>
      <tr>
        <td><strong>2. Accommodation</strong></td>
        <td>
          ${b.nights > 0 
            ? `₹${formatNumber(b.selectedHotel.nightlyRate)} / night × ${b.requiredRooms} rooms × ${b.nights} nights` 
            : `1-day trip: 0 hotel nights charged`}
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">Stay: ${escapeHTML(b.selectedHotel.name)} (${b.selectedHotel.tier})</div>
        </td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.accommodationTotal)}</td>
      </tr>
      <tr>
        <td><strong>3. Meals & Daily Food</strong></td>
        <td>₹${formatNumber(b.foodCostPerPersonDaily)} / person / day × ${params.travellers} travellers × ${params.duration} days</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.foodTotal)}</td>
      </tr>
      <tr>
        <td><strong>4. Local Group Transit</strong></td>
        <td>₹${formatNumber(b.localTransportDaily)} / day × ${params.duration} days (Local cabs, autos, fuel)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.localTransportTotal)}</td>
      </tr>
      <tr>
        <td><strong>5. Sightseeing & Tickets</strong></td>
        <td>₹${formatNumber(b.attractionFeesPerPerson)} fees / person × ${params.travellers} travellers (${b.plannedAttractions.length} monuments)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.attractionTotal)}</td>
      </tr>
      <tr style="background: var(--color-bg-subtle);">
        <td><strong>Subtotal Planned Expenses</strong></td>
        <td>Sum of items 1 through 5</td>
        <td style="text-align: right; font-weight: 800; color: var(--color-primary);">₹${formatNumber(b.subtotal)}</td>
      </tr>
      <tr>
        <td><strong>6. Emergency Reserve (10%)</strong></td>
        <td>Automatic 10% safety cushion for unexpected expenses</td>
        <td style="text-align: right; font-weight: 700; color: var(--color-secondary);">₹${formatNumber(b.emergencyReserve)}</td>
      </tr>
    `;

    const tfoot = elements.modalBudgetTfoot;
    tfoot.innerHTML = `
      <tr>
        <td colspan="2">TOTAL ESTIMATED TRIP COST (Group)</td>
        <td style="text-align: right; color: ${b.isAffordable ? "var(--color-primary)" : "var(--color-danger)"}; font-weight: 800;">
          ₹${formatNumber(b.totalEstimatedCost)}
        </td>
      </tr>
      <tr style="font-size: 0.92rem; color: var(--color-text-muted);">
        <td colspan="2">Cost Per Person (${params.travellers} Travellers)</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(b.perPersonCost)}</td>
      </tr>
      <tr style="font-size: 0.95rem;">
        <td colspan="2">Your Total Stated Budget</td>
        <td style="text-align: right; font-weight: 700;">₹${formatNumber(params.budget)}</td>
      </tr>
      <tr style="font-size: 1rem; color: ${b.isAffordable ? "var(--color-success)" : "var(--color-danger)"};">
        <td colspan="2">${b.isAffordable ? "Estimated Budget Surplus (Savings)" : "Estimated Budget Deficit (Over Budget)"}</td>
        <td style="text-align: right; font-weight: 800;">
          ${b.isAffordable ? "+₹" + formatNumber(b.remainingBudget) : "-₹" + formatNumber(Math.abs(b.remainingBudget))}
        </td>
      </tr>
    `;

    if (b.isAffordable) {
      elements.modalBudgetFeasibilityNote.innerHTML = `
        <div class="pill-success" style="display: flex; padding: 0.75rem 1rem; border-radius: var(--radius-md);">
          ✅ This destination fits comfortably within your ₹${formatNumber(params.budget)} budget with an estimated ₹${formatNumber(b.remainingBudget)} reserve remaining.
        </div>
      `;
    } else {
      elements.modalBudgetFeasibilityNote.innerHTML = `
        <div style="background: var(--color-danger-bg); color: var(--color-danger); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.88rem;">
          ⚠️ This trip exceeds your budget by ₹${formatNumber(Math.abs(b.remainingBudget))}. Consider opting for budget hotel stays, travelling by train/bus, or extending the budget by ~₹${formatNumber(Math.abs(b.remainingBudget))}.
        </div>
      `;
    }
  }

  function renderModalHotels(dest, b, params) {
    elements.modalRoomsSummary.textContent = `${b.requiredRooms} room(s) required for ${params.travellers} traveller(s) based on standard ${b.roomCapacity} guests per room.`;
    elements.modalHotelsContainer.innerHTML = "";

    dest.hotels.forEach(hotel => {
      const card = document.createElement("div");
      card.className = "hotel-card";

      const totalHotelCost = b.nights > 0 ? (hotel.nightlyRate * b.requiredRooms * b.nights) : 0;
      const amenitiesList = hotel.amenities.map(a => `<span class="attraction-pill">${escapeHTML(a)}</span>`).join(" ");

      card.innerHTML = `
        <div class="hotel-media">
          <img src="${escapeHTML(hotel.image)}" alt="${escapeHTML(hotel.name)}" loading="lazy">
        </div>
        <div class="hotel-body">
          <span class="hotel-tier-badge">${escapeHTML(hotel.tier)} Tier</span>
          <h4 class="hotel-name">${escapeHTML(hotel.name)}</h4>
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 0.4rem;">${escapeHTML(hotel.area)} • ⭐ ${hotel.rating}</p>
          <p style="font-size: 0.84rem; color: var(--color-text-main); margin-bottom: 0.6rem; line-height: 1.4;">${escapeHTML(hotel.description)}</p>
          <div style="margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
            ${amenitiesList}
          </div>
          <div class="hotel-price">
            ₹${formatNumber(hotel.nightlyRate)} <span style="font-size: 0.8rem; font-weight: 500; color: var(--color-text-muted);">/ room / night</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-secondary); padding-top: 0.4rem; border-top: 1px dashed var(--color-border);">
            Group Total (${b.nights} nights): ₹${formatNumber(totalHotelCost)}
          </div>
        </div>
      `;
      elements.modalHotelsContainer.appendChild(card);
    });
  }

  function renderModalItinerary(dest, params) {
    elements.modalItineraryDuration.textContent = `${params.duration} Days (${Math.max(0, params.duration - 1)} Nights)`;
    elements.modalItineraryContainer.innerHTML = "";

    const days = generateDynamicItinerary(dest, params.duration, params.interests);

    days.forEach(day => {
      const dayEl = document.createElement("div");
      dayEl.className = "timeline-day";

      const activitiesHtml = day.activities.map(act => `
        <div class="timeline-activity-item">
          <div>
            <strong style="color: var(--color-primary);">${escapeHTML(act.time)}:</strong>
            <span style="color: var(--color-text-muted); margin-left: 0.35rem;">${escapeHTML(act.text)}</span>
          </div>
          ${act.cost > 0 ? `<span style="font-size: 0.78rem; font-weight: 700; color: var(--color-secondary); white-space: nowrap;">Entry: ₹${act.cost}</span>` : ""}
        </div>
      `).join("");

      dayEl.innerHTML = `
        <h4>${escapeHTML(day.title)}</h4>
        <div class="timeline-activities">
          ${activitiesHtml}
        </div>
      `;

      elements.modalItineraryContainer.appendChild(dayEl);
    });
  }

  function renderModalReviewsTab(destId) {
    if (!elements.modalReviewsContainer) return;
    elements.modalReviewsContainer.innerHTML = "";

    const destReviews = state.reviews.filter(r => r.destinationId === destId);

    if (destReviews.length === 0) {
      elements.modalReviewsContainer.innerHTML = `
        <div style="padding: 2.5rem 1rem; text-align: center; color: var(--color-text-muted);">
          <p>No customer reviews submitted for this destination yet.</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="window.AITraveller.openReviewFormFromModal('${destId}')">
            Write the First Review
          </button>
        </div>
      `;
      return;
    }

    const reviewsGrid = document.createElement("div");
    reviewsGrid.className = "reviews-grid";
    destReviews.forEach(r => {
      reviewsGrid.appendChild(createReviewCardElement(r));
    });

    elements.modalReviewsContainer.appendChild(reviewsGrid);
  }

  function switchModalTab(tabId) {
    elements.modalTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    elements.modalTabPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === tabId);
    });
  }

  function initModalEvents() {
    elements.modalTabBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        switchModalTab(this.dataset.tab);
      });
    });

    elements.modalCloseBtn.addEventListener("click", closeModal);
    elements.modalBackBtn.addEventListener("click", closeModal);

    elements.destinationModal.addEventListener("click", function (e) {
      if (e.target === elements.destinationModal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && elements.destinationModal.classList.contains("open")) {
        closeModal();
      }
    });

    elements.modalSaveBtn.addEventListener("click", function () {
      if (!state.modalDestinationItem) return;
      toggleSaveTrip(state.modalDestinationItem);
      const isSaved = isTripSaved(state.modalDestinationItem.destination.id);
      elements.modalSaveBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        ${isSaved ? "Saved in Trips" : "Save Trip"}
      `;
    });

    elements.modalPrintBtn.addEventListener("click", function () {
      window.print();
    });
  }

  function closeModal() {
    elements.destinationModal.classList.remove("open");
    document.body.style.overflow = "";
    state.modalDestinationItem = null;
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER REVIEWS & RATINGS SYSTEM
  // ---------------------------------------------------------------------------
  function loadCustomerReviews() {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        state.reviews = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading reviews from localStorage:", e);
      state.reviews = [];
    }

    // Seed default reviews if none in storage
    if (!state.reviews || !Array.isArray(state.reviews) || state.reviews.length === 0) {
      state.reviews = [...(window.TRAVEL_DATA.defaultReviews || [])];
      persistCustomerReviews();
    }

    recalculateReviewStats();
    renderReviewsGrid();
  }

  function persistCustomerReviews() {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(state.reviews));
    } catch (e) {
      console.warn("Unable to persist reviews to localStorage:", e);
      showToast("Local storage quota exceeded or unavailable.", "error");
    }
  }

  function populateDestinationSelectOptions() {
    const destinations = window.TRAVEL_DATA.destinations || [];

    if (elements.reviewDestSelect) {
      elements.reviewDestSelect.innerHTML = `<option value="" disabled selected>Select a destination</option>`;
      destinations.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.state})`;
        elements.reviewDestSelect.appendChild(opt);
      });
    }

    if (elements.reviewFilterDest) {
      elements.reviewFilterDest.innerHTML = `<option value="all" selected>All Destinations</option>`;
      destinations.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.state})`;
        elements.reviewFilterDest.appendChild(opt);
      });
    }
  }

  function recalculateReviewStats() {
    const totalCount = state.reviews.length;
    if (totalCount === 0) {
      if (elements.reviewAvgScore) elements.reviewAvgScore.textContent = "0.0";
      if (elements.reviewAvgStars) elements.reviewAvgStars.textContent = "☆☆☆☆☆";
      if (elements.reviewTotalCount) elements.reviewTotalCount.textContent = "0 verified reviews";
      if (elements.reviewsDistributionBars) elements.reviewsDistributionBars.innerHTML = "";
      return;
    }

    const sumRatings = state.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avgRating = (sumRatings / totalCount).toFixed(1);

    if (elements.reviewAvgScore) elements.reviewAvgScore.textContent = avgRating;
    if (elements.reviewTotalCount) elements.reviewTotalCount.textContent = `Based on ${totalCount} verified traveller reviews`;

    if (elements.reviewAvgStars) {
      const roundedStars = Math.round(Number(avgRating));
      let starsHtml = "";
      for (let i = 1; i <= 5; i++) {
        starsHtml += (i <= roundedStars) ? "★" : "☆";
      }
      elements.reviewAvgStars.textContent = starsHtml;
    }

    // Distribution breakdown
    if (elements.reviewsDistributionBars) {
      elements.reviewsDistributionBars.innerHTML = "";
      for (let star = 5; star >= 1; star--) {
        const count = state.reviews.filter(r => Math.round(Number(r.rating)) === star).length;
        const percent = Math.round((count / totalCount) * 100);

        const row = document.createElement("div");
        row.className = "dist-bar-row";
        row.innerHTML = `
          <span class="dist-label">${star} ★</span>
          <div class="dist-track">
            <div class="dist-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="dist-count">${count} (${percent}%)</span>
        `;
        elements.reviewsDistributionBars.appendChild(row);
      }
    }
  }

  function initReviewsInteractions() {
    // Open review form button
    if (elements.btnOpenReviewForm) {
      elements.btnOpenReviewForm.addEventListener("click", openReviewForm);
    }

    if (elements.btnEmptyWriteReview) {
      elements.btnEmptyWriteReview.addEventListener("click", openReviewForm);
    }

    // Cancel review form
    if (elements.btnCancelReview) {
      elements.btnCancelReview.addEventListener("click", closeReviewForm);
    }

    // Star rating picker
    if (elements.starPicker) {
      const starBtns = elements.starPicker.querySelectorAll(".star-picker-btn");
      const labelEl = elements.starPickerLabel;

      const starLabels = {
        1: "1 Star - Poor",
        2: "2 Stars - Fair",
        3: "3 Stars - Good",
        4: "4 Stars - Great",
        5: "5 Stars - Exceptional"
      };

      starBtns.forEach(btn => {
        const val = parseInt(btn.dataset.value, 10);

        // Hover effect
        btn.addEventListener("mouseenter", function () {
          starBtns.forEach(b => {
            const bVal = parseInt(b.dataset.value, 10);
            b.classList.toggle("hover-active", bVal <= val);
          });
          if (labelEl) labelEl.textContent = starLabels[val] || `${val} Stars`;
        });

        // Click selection
        btn.addEventListener("click", function () {
          state.selectedStarRating = val;
          elements.reviewRatingValue.value = val;
          starBtns.forEach(b => {
            const bVal = parseInt(b.dataset.value, 10);
            b.classList.toggle("selected", bVal <= val);
            b.setAttribute("aria-checked", bVal === val ? "true" : "false");
          });
          if (labelEl) labelEl.textContent = starLabels[val] || `${val} Stars`;
        });
      });

      elements.starPicker.addEventListener("mouseleave", function () {
        starBtns.forEach(b => {
          b.classList.remove("hover-active");
          const bVal = parseInt(b.dataset.value, 10);
          b.classList.toggle("selected", bVal <= state.selectedStarRating);
        });
        if (labelEl) {
          labelEl.textContent = state.selectedStarRating > 0
            ? starLabels[state.selectedStarRating]
            : "Select Rating";
        }
      });
    }

    // Character counter for review textarea
    if (elements.reviewBodyInput && elements.reviewCharCount) {
      elements.reviewBodyInput.addEventListener("input", function () {
        const len = this.value.length;
        elements.reviewCharCount.textContent = `${len} / 1000`;
        if (len < 15) {
          elements.reviewCharCount.style.color = "var(--color-danger)";
        } else {
          elements.reviewCharCount.style.color = "var(--color-text-muted)";
        }
      });
    }

    // Submit review form
    if (elements.reviewSubmitForm) {
      elements.reviewSubmitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleReviewSubmit();
      });
    }

    // Filter reviews by destination
    if (elements.reviewFilterDest) {
      elements.reviewFilterDest.addEventListener("change", function () {
        state.reviewsFilterDest = this.value;
        renderReviewsGrid();
      });
    }

    // Sort reviews
    if (elements.reviewSortSelect) {
      elements.reviewSortSelect.addEventListener("change", function () {
        state.reviewsSort = this.value;
        renderReviewsGrid();
      });
    }
  }

  function openReviewForm() {
    if (!elements.reviewFormContainer) return;
    elements.reviewFormContainer.style.display = "block";
    elements.reviewFormContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    if (elements.reviewNameInput) elements.reviewNameInput.focus();
  }

  function closeReviewForm() {
    if (!elements.reviewFormContainer) return;
    elements.reviewFormContainer.style.display = "none";
    hideReviewError();
  }

  function showReviewError(msg) {
    if (!elements.reviewFormAlert || !elements.reviewFormAlertText) return;
    elements.reviewFormAlertText.textContent = msg;
    elements.reviewFormAlert.style.display = "flex";
  }

  function hideReviewError() {
    if (elements.reviewFormAlert) {
      elements.reviewFormAlert.style.display = "none";
    }
  }

  function validateReviewInputs(author, destinationId, rating, title, text) {
    if (!author || author.trim().length < 2) {
      return "Please enter your display name (at least 2 characters).";
    }
    if (!destinationId) {
      return "Please select the destination you visited.";
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return "Please select a star rating from 1 to 5 stars.";
    }
    if (!title || title.trim().length < 3) {
      return "Please provide a catchy review title (at least 3 characters).";
    }
    if (!text || text.trim().length < 15) {
      return "Please share your travel experience (minimum 15 characters).";
    }
    if (text.trim().length > 1000) {
      return "Review text cannot exceed 1000 characters.";
    }
    return null;
  }

  function handleReviewSubmit() {
    const author = elements.reviewNameInput.value.trim();
    const destinationId = elements.reviewDestSelect.value;
    const rating = parseInt(elements.reviewRatingValue.value, 10);
    const title = elements.reviewTitleInput.value.trim();
    const text = elements.reviewBodyInput.value.trim();
    const visitDate = elements.reviewVisitDate ? elements.reviewVisitDate.value : "";

    const validationError = validateReviewInputs(author, destinationId, rating, title, text);
    if (validationError) {
      showReviewError(validationError);
      return;
    }
    hideReviewError();

    // Debounce accidental double submissions
    if (elements.btnSubmitReview) {
      elements.btnSubmitReview.disabled = true;
      elements.btnSubmitReview.textContent = "Submitting Review...";
    }

    const destObj = window.TRAVEL_DATA.destinations.find(d => d.id === destinationId);
    const destinationName = destObj ? destObj.name : capitalize(destinationId);

    const newReview = {
      id: "rev_" + Date.now(),
      author: author,
      destinationId: destinationId,
      destinationName: destinationName,
      rating: rating,
      title: title,
      text: text,
      visitDate: visitDate,
      createdAt: new Date().toISOString(),
      helpfulCount: 0
    };

    // Prepend to top of reviews collection
    state.reviews.unshift(newReview);
    persistCustomerReviews();
    recalculateReviewStats();
    renderReviewsGrid();

    // Reset form
    elements.reviewSubmitForm.reset();
    state.selectedStarRating = 0;
    if (elements.starPicker) {
      elements.starPicker.querySelectorAll(".star-picker-btn").forEach(b => b.classList.remove("selected", "hover-active"));
      if (elements.starPickerLabel) elements.starPickerLabel.textContent = "Select Rating";
    }
    if (elements.reviewCharCount) elements.reviewCharCount.textContent = "0 / 1000";

    if (elements.btnSubmitReview) {
      elements.btnSubmitReview.disabled = false;
      elements.btnSubmitReview.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Submit Review
      `;
    }

    closeReviewForm();
    showToast(`Thank you, ${author}! Your review for ${destinationName} was published successfully.`, "success");

    // Also update destination showcase reviews if currently matching
    if (state.selectedDestinationItem && state.selectedDestinationItem.destination.id === destinationId) {
      renderShowcaseReviews(destinationId);
    }
  }

  function renderReviewsGrid() {
    if (!elements.reviewsGrid) return;
    elements.reviewsGrid.innerHTML = "";

    let list = [...state.reviews];

    // Filter by destination
    if (state.reviewsFilterDest !== "all") {
      list = list.filter(r => r.destinationId === state.reviewsFilterDest);
    }

    // Sort reviews
    switch (state.reviewsSort) {
      case "highest":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        list.sort((a, b) => a.rating - b.rating);
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    if (list.length === 0) {
      elements.reviewsEmptyState.style.display = "block";
      return;
    }

    elements.reviewsEmptyState.style.display = "none";
    list.forEach(r => {
      const card = createReviewCardElement(r);
      elements.reviewsGrid.appendChild(card);
    });
  }

  /**
   * Creates a review card strictly using DOM manipulation and textContent to prevent XSS.
   */
  function createReviewCardElement(r) {
    const card = document.createElement("article");
    card.className = "review-card";

    // Card Header
    const header = document.createElement("div");
    header.className = "review-card-header";

    const authorBox = document.createElement("div");
    authorBox.className = "review-author-box";

    const authorName = document.createElement("h4");
    authorName.className = "review-author-name";
    authorName.textContent = r.author; // Safe XSS

    const authorDest = document.createElement("span");
    authorDest.className = "review-author-dest";
    authorDest.textContent = `📍 ${r.destinationName || getDestinationNameById(r.destinationId)}`;

    authorBox.appendChild(authorName);
    authorBox.appendChild(authorDest);

    const dateBadge = document.createElement("span");
    dateBadge.className = "review-date-badge";
    dateBadge.textContent = formatDateLabel(r.createdAt);

    header.appendChild(authorBox);
    header.appendChild(dateBadge);

    // Stars row
    const starsRow = document.createElement("div");
    starsRow.className = "review-stars-row";
    let starStr = "";
    for (let i = 1; i <= 5; i++) {
      starStr += (i <= r.rating) ? "★" : "☆";
    }
    starsRow.textContent = starStr;

    // Review Title
    const titleEl = document.createElement("h5");
    titleEl.className = "review-card-title";
    titleEl.textContent = r.title; // Safe XSS

    // Review Body Text
    const bodyEl = document.createElement("p");
    bodyEl.className = "review-card-body";
    bodyEl.textContent = r.text; // Safe XSS

    // Footer
    const footer = document.createElement("div");
    footer.className = "review-card-footer";

    const visitMeta = document.createElement("span");
    visitMeta.textContent = r.visitDate ? `Visited: ${r.visitDate}` : "Verified Traveller";

    const helpfulBtn = document.createElement("button");
    helpfulBtn.type = "button";
    helpfulBtn.className = "review-helpful-btn";
    helpfulBtn.innerHTML = `<span>👍</span> Helpful (${r.helpfulCount || 0})`;

    helpfulBtn.addEventListener("click", function () {
      if (!this.classList.contains("voted")) {
        r.helpfulCount = (r.helpfulCount || 0) + 1;
        this.classList.add("voted");
        this.innerHTML = `<span>👍</span> Helpful (${r.helpfulCount})`;
        persistCustomerReviews();
      }
    });

    footer.appendChild(visitMeta);
    footer.appendChild(helpfulBtn);

    card.appendChild(header);
    card.appendChild(starsRow);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    card.appendChild(footer);

    return card;
  }

  function formatDateLabel(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return "Recent";
    }
  }

  function getDestinationNameById(id) {
    const d = window.TRAVEL_DATA.destinations.find(dest => dest.id === id);
    return d ? d.name : capitalize(id);
  }

  // ---------------------------------------------------------------------------
  // SAVED TRIPS & LOCALSTORAGE MANAGEMENT
  // ---------------------------------------------------------------------------
  function loadSavedTrips() {
    try {
      const stored = localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
      if (stored) {
        state.savedTrips = JSON.parse(stored);
        if (!Array.isArray(state.savedTrips)) state.savedTrips = [];
      }
    } catch (e) {
      console.warn("Unable to load saved trips from localStorage:", e);
      state.savedTrips = [];
    }
    updateSavedBadge();
  }

  function persistSavedTrips() {
    try {
      localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(state.savedTrips));
      updateSavedBadge();
    } catch (e) {
      console.warn("Unable to save trips to localStorage:", e);
      showToast("Storage quota exceeded or disabled.", "error");
    }
  }

  function isTripSaved(destId) {
    return state.savedTrips.some(t => t.destinationId === destId);
  }

  function toggleSaveTrip(item, optionalButtonEl) {
    const dest = item.destination;
    const b = item.budget;
    const params = state.currentSearchParams;

    const existingIndex = state.savedTrips.findIndex(t => t.destinationId === dest.id);

    if (existingIndex >= 0) {
      state.savedTrips.splice(existingIndex, 1);
      persistSavedTrips();
      showToast(`Removed ${dest.name} from saved trips.`, "success");
      if (optionalButtonEl) {
        optionalButtonEl.classList.remove("saved");
        const svg = optionalButtonEl.querySelector("svg");
        if (svg) svg.setAttribute("fill", "none");
      }
    } else {
      const newSavedItem = {
        id: "trip_" + Date.now(),
        destinationId: dest.id,
        destinationName: dest.name,
        state: dest.state,
        image: dest.heroImage,
        originCity: params.origin,
        travellers: params.travellers,
        budget: params.budget,
        duration: params.duration,
        transportMode: params.transportMode,
        travelStyle: params.travelStyle,
        totalCost: b.totalEstimatedCost,
        isAffordable: b.isAffordable,
        savedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };

      state.savedTrips.push(newSavedItem);
      persistSavedTrips();
      showToast(`Saved ${dest.name} to your trips!`, "success");
      if (optionalButtonEl) {
        optionalButtonEl.classList.add("saved");
        const svg = optionalButtonEl.querySelector("svg");
        if (svg) svg.setAttribute("fill", "currentColor");
      }
    }

    renderSavedTripsList();
  }

  function updateSavedBadge() {
    if (elements.savedBadgeCount) {
      elements.savedBadgeCount.textContent = state.savedTrips.length;
    }
  }

  function renderSavedTripsList() {
    if (!elements.savedTripsList) return;
    elements.savedTripsList.innerHTML = "";

    if (state.savedTrips.length === 0) {
      elements.savedTripsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--color-text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: #94A3B8;">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <h4 style="font-family: var(--font-heading); color: var(--color-primary); margin-bottom: 0.5rem;">No Saved Trips Yet</h4>
          <p style="font-size: 0.9rem;">Plan an itinerary and click "Save Trip" to keep it handy for offline review.</p>
        </div>
      `;
      return;
    }

    state.savedTrips.forEach(trip => {
      const card = document.createElement("div");
      card.className = "saved-card";

      card.innerHTML = `
        <div class="saved-card-header">
          <div>
            <h4>${escapeHTML(trip.destinationName)}</h4>
            <span class="saved-card-date">${escapeHTML(trip.state)} • Saved on ${trip.savedAt}</span>
          </div>
          <button class="btn-delete-saved" data-id="${trip.id}" title="Delete saved trip" aria-label="Delete saved trip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>

        <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
          From ${escapeHTML(getCityName(trip.originCity))} • ${trip.travellers} Guests • ${trip.duration} Days
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.85rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">Est. Cost:</span>
            <strong style="font-family: var(--font-heading); color: var(--color-primary); margin-left: 0.25rem;">
              ₹${formatNumber(trip.totalCost)}
            </strong>
          </div>
          <span class="status-badge ${trip.isAffordable ? "affordable" : "over-budget"}">
            ${trip.isAffordable ? "Within Budget" : "Over Budget"}
          </span>
        </div>

        <button class="btn btn-secondary btn-sm open-saved-btn" style="width: 100%;">
          View Itinerary & Details
        </button>
      `;

      card.querySelector(".btn-delete-saved").addEventListener("click", function () {
        deleteSavedTrip(trip.id);
      });

      card.querySelector(".open-saved-btn").addEventListener("click", function () {
        closeSavedDrawer();
        const dest = window.TRAVEL_DATA.destinations.find(d => d.id === trip.destinationId);
        if (dest) {
          const params = {
            origin: trip.originCity,
            travellers: trip.travellers,
            budget: trip.budget,
            duration: trip.duration,
            accommodation: "any",
            travelStyle: trip.travelStyle || "Budget",
            transportMode: trip.transportMode || "train",
            interests: []
          };
          state.currentSearchParams = params;
          const budget = calculateTripBudget(dest, params);
          const item = { destination: dest, budget, matchScore: 95 };
          displaySelectedDestinationShowcase(item, params);
          openDestinationModal(item);
        }
      });

      elements.savedTripsList.appendChild(card);
    });
  }

  function deleteSavedTrip(tripId) {
    state.savedTrips = state.savedTrips.filter(t => t.id !== tripId);
    persistSavedTrips();
    renderSavedTripsList();
    renderFilteredAndSortedResults();
    showToast("Trip removed from saved list.", "success");
  }

  function initSavedDrawerEvents() {
    if (elements.navSavedBtn) {
      elements.navSavedBtn.addEventListener("click", openSavedDrawer);
    }
    if (elements.closeSavedDrawerBtn) {
      elements.closeSavedDrawerBtn.addEventListener("click", closeSavedDrawer);
    }
    if (elements.savedDrawerBackdrop) {
      elements.savedDrawerBackdrop.addEventListener("click", closeSavedDrawer);
    }
    if (elements.clearAllSavedBtn) {
      elements.clearAllSavedBtn.addEventListener("click", function () {
        if (state.savedTrips.length === 0) return;
        if (confirm("Are you sure you want to remove all saved trips?")) {
          state.savedTrips = [];
          persistSavedTrips();
          renderSavedTripsList();
          renderFilteredAndSortedResults();
          showToast("All saved trips cleared.", "success");
        }
      });
    }
  }

  function openSavedDrawer() {
    renderSavedTripsList();
    elements.savedDrawer.classList.add("open");
    elements.savedDrawerBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeSavedDrawer() {
    elements.savedDrawer.classList.remove("open");
    elements.savedDrawerBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ---------------------------------------------------------------------------
  // FEATURED DESTINATIONS PRE-FILL
  // ---------------------------------------------------------------------------
  function initFeaturedCards() {
    document.querySelectorAll(".feat-card").forEach(card => {
      const destId = card.dataset.destId;
      card.addEventListener("click", () => {
        const dest = window.TRAVEL_DATA.destinations.find(d => d.id === destId);
        if (dest) {
          if (elements.destinationInput) elements.destinationInput.value = dest.name;
          if (elements.btnClearDest) elements.btnClearDest.style.display = "flex";
          elements.durationInput.value = dest.idealDuration.min || 3;

          document.querySelectorAll(".destination-chip").forEach(c => {
            c.classList.toggle("active", c.dataset.dest === destId);
          });

          elements.plannerForm.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            handleFormSubmit();
          }, 250);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // FAQS ACCORDION
  // ---------------------------------------------------------------------------
  function initFAQs() {
    if (!elements.faqList) return;
    elements.faqList.innerHTML = "";

    const faqs = window.TRAVEL_DATA.faqs || [];
    faqs.forEach((faq, idx) => {
      const item = document.createElement("div");
      item.className = "faq-item" + (idx === 0 ? " active" : "");

      item.innerHTML = `
        <button class="faq-question" aria-expanded="${idx === 0 ? "true" : "false"}">
          <span>${escapeHTML(faq.q)}</span>
          <svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="faq-answer" style="${idx === 0 ? "max-height: 250px;" : ""}">
          <p>${escapeHTML(faq.a)}</p>
        </div>
      `;

      const btn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      btn.addEventListener("click", function () {
        const isActive = item.classList.toggle("active");
        btn.setAttribute("aria-expanded", isActive ? "true" : "false");
        if (isActive) {
          answer.style.maxHeight = answer.scrollHeight + 40 + "px";
        } else {
          answer.style.maxHeight = "0";
        }
      });

      elements.faqList.appendChild(item);
    });
  }

  // ---------------------------------------------------------------------------
  // TOAST ALERTS
  // ---------------------------------------------------------------------------
  function showToast(message, type = "success") {
    if (!elements.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${type === "success" 
          ? '<polyline points="20 6 9 17 4 12"></polyline>' 
          : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
      </svg>
      <span>${escapeHTML(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ---------------------------------------------------------------------------
  // HELPER UTILITIES
  // ---------------------------------------------------------------------------
  function formatNumber(num) {
    if (isNaN(num)) return "0";
    return Number(num).toLocaleString("en-IN");
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getCityName(originId) {
    const orig = window.TRAVEL_DATA.origins.find(o => o.id === originId);
    return orig ? orig.name : capitalize(originId);
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------------------------------------------------------------------------
  // EXPORT TO WINDOW (For Automated Testing & Diagnostics)
  // ---------------------------------------------------------------------------
  window.AITraveller = {
    state,
    calculateTripBudget,
    rankDestinations,
    generateDynamicItinerary,
    lookupDestination,
    resolveLocationOnline,
    fetchLiveWeather,
    parseWeatherCode,
    generateWeatherAdvice,
    getGoogleMapsSearchUrl,
    getGoogleMapsDirectionsUrl,
    validateInputs,
    validateReviewInputs,
    getFormInputs,
    handleFormSubmit,
    retryWeather: function () {
      if (state.selectedDestinationItem) {
        updateDestinationWeather(state.selectedDestinationItem.destination);
      }
    },
    openReviewFormFromModal: function (destId) {
      closeModal();
      if (elements.reviewDestSelect) elements.reviewDestSelect.value = destId;
      openReviewForm();
    }
  };

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

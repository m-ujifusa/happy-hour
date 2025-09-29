class HappyHourApp {
    constructor() {
        this.venues = [];
        this.filteredVenues = [];
        this.neighborhoods = new Set();

        this.initializeElements();
        this.bindEvents();
        this.loadData();
    }

    initializeElements() {
        this.elements = {
            dayFilter: document.getElementById('day-filter'),
            neighborhoodFilter: document.getElementById('neighborhood-filter'),
            timeFilter: document.getElementById('time-filter'),
            searchInput: document.getElementById('search-input'),
            happyHourNowBtn: document.getElementById('happy-hour-now'),
            resetFiltersBtn: document.getElementById('reset-filters'),
            resultsCount: document.getElementById('results-count'),
            venuesGrid: document.getElementById('venues-grid'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error')
        };
    }

    bindEvents() {
        this.elements.dayFilter.addEventListener('change', () => this.applyFilters());
        this.elements.neighborhoodFilter.addEventListener('change', () => this.applyFilters());
        this.elements.timeFilter.addEventListener('change', () => this.applyFilters());
        this.elements.searchInput.addEventListener('input', () => this.applyFilters());
        this.elements.happyHourNowBtn.addEventListener('click', () => this.filterByCurrentTime());
        this.elements.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
    }

    async loadData() {
        try {
            this.showLoading();

            // Load data from local JSON file
            let data;
            try {
                const response = await fetch('./data/venues.json');
                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error('Could not load venues data');
                }
            } catch (error) {
                console.log('Loading sample data...');
                data = this.getSampleData();
            }

            this.venues = data;
            this.filteredVenues = [...this.venues];
            this.populateNeighborhoods();
            this.renderVenues();
            this.hideLoading();

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError();
        }
    }

    getSampleData() {
        return [
            {
                name: "The Bulldog Lowertown",
                address: "237 6th St E, St Paul, MN 55101",
                neighborhood: "Lowertown",
                phone: "(651) 221-0750",
                website: "https://thebulldoglowertown.com",
                priceRange: "$$",
                happyHours: {
                    monday: "3:00 PM - 6:00 PM",
                    tuesday: "3:00 PM - 6:00 PM",
                    wednesday: "3:00 PM - 6:00 PM",
                    thursday: "3:00 PM - 6:00 PM",
                    friday: "3:00 PM - 6:00 PM",
                    saturday: "",
                    sunday: ""
                },
                foodDeals: "$1 off appetizers, $6 wings",
                drinkDeals: "$4 draft beer, $5 well cocktails, $6 house wine",
                tags: ["wings", "beer", "cocktails", "sports-bar"]
            },
            {
                name: "Psycho Suzi's Motor Lounge",
                address: "1900 Marshall St NE, Minneapolis, MN 55413",
                neighborhood: "Northeast",
                phone: "(612) 788-9069",
                website: "https://psychosuzis.com",
                priceRange: "$$$",
                happyHours: {
                    monday: "4:00 PM - 6:00 PM",
                    tuesday: "4:00 PM - 6:00 PM",
                    wednesday: "4:00 PM - 6:00 PM",
                    thursday: "4:00 PM - 6:00 PM",
                    friday: "4:00 PM - 6:00 PM",
                    saturday: "",
                    sunday: "4:00 PM - 6:00 PM"
                },
                foodDeals: "Half-price appetizers",
                drinkDeals: "$2 off tiki cocktails, $4 beer specials",
                tags: ["tiki", "cocktails", "patio", "riverfront"]
            },
            {
                name: "Parlour Bar",
                address: "730 N Washington Ave, Minneapolis, MN 55401",
                neighborhood: "North Loop",
                phone: "(612) 354-3135",
                website: "https://parlourbar.com",
                priceRange: "$$$",
                happyHours: {
                    monday: "5:00 PM - 7:00 PM",
                    tuesday: "5:00 PM - 7:00 PM",
                    wednesday: "5:00 PM - 7:00 PM",
                    thursday: "5:00 PM - 7:00 PM",
                    friday: "5:00 PM - 7:00 PM",
                    saturday: "",
                    sunday: ""
                },
                foodDeals: "Discounted bar bites",
                drinkDeals: "$7 cocktails, $5 beer, $8 wine",
                tags: ["upscale", "cocktails", "burgers", "north-loop"]
            },
            {
                name: "The Groveland Tap",
                address: "1834 Saint Clair Ave, St Paul, MN 55105",
                neighborhood: "Highland Park",
                phone: "(651) 699-5058",
                website: "https://grovelandtap.com",
                priceRange: "$$",
                happyHours: {
                    monday: "3:00 PM - 6:00 PM",
                    tuesday: "3:00 PM - 6:00 PM",
                    wednesday: "3:00 PM - 6:00 PM",
                    thursday: "3:00 PM - 6:00 PM",
                    friday: "3:00 PM - 6:00 PM",
                    saturday: "",
                    sunday: ""
                },
                foodDeals: "$5 appetizers, $8 pizza",
                drinkDeals: "$3.50 taps, $4 wine, $5 wells",
                tags: ["neighborhood", "pizza", "beer", "family-friendly"]
            },
            {
                name: "Barrel Theory Beer Company",
                address: "248 7th St E, St Paul, MN 55101",
                neighborhood: "Lowertown",
                phone: "(651) 444-3016",
                website: "https://barreltheory.com",
                priceRange: "$$",
                happyHours: {
                    monday: "",
                    tuesday: "4:00 PM - 6:00 PM",
                    wednesday: "4:00 PM - 6:00 PM",
                    thursday: "4:00 PM - 6:00 PM",
                    friday: "4:00 PM - 6:00 PM",
                    saturday: "",
                    sunday: ""
                },
                foodDeals: "Food truck specials vary",
                drinkDeals: "$1 off all beers",
                tags: ["brewery", "craft-beer", "food-truck"]
            }
        ];
    }

    populateNeighborhoods() {
        this.neighborhoods.clear();
        this.venues.forEach(venue => {
            this.neighborhoods.add(venue.neighborhood);
        });

        const neighborhoodSelect = this.elements.neighborhoodFilter;

        // Clear existing options except first
        while (neighborhoodSelect.children.length > 1) {
            neighborhoodSelect.removeChild(neighborhoodSelect.lastChild);
        }

        // Add neighborhood options
        Array.from(this.neighborhoods).sort().forEach(neighborhood => {
            const option = document.createElement('option');
            option.value = neighborhood.toLowerCase();
            option.textContent = neighborhood;
            neighborhoodSelect.appendChild(option);
        });
    }

    applyFilters() {
        const dayFilter = this.elements.dayFilter.value;
        const neighborhoodFilter = this.elements.neighborhoodFilter.value;
        const timeFilter = this.elements.timeFilter.value;
        const searchTerm = this.elements.searchInput.value.toLowerCase();

        console.log('=== APPLY FILTERS ===');
        console.log('Day filter:', dayFilter);
        console.log('Neighborhood filter:', neighborhoodFilter);
        console.log('Time filter:', timeFilter);
        console.log('Search term:', searchTerm);
        console.log('Total venues before filtering:', this.venues.length);

        this.filteredVenues = this.venues.filter(venue => {
            // Day filter
            if (dayFilter && !venue.happyHours[dayFilter]) {
                return false;
            }

            // Neighborhood filter
            if (neighborhoodFilter && venue.neighborhood.toLowerCase() !== neighborhoodFilter) {
                return false;
            }

            // Time filter
            if (timeFilter && !this.venueHasHappyHourAtTime(venue, timeFilter)) {
                return false;
            }

            // Search filter
            if (searchTerm) {
                const searchableText = [
                    venue.name,
                    venue.neighborhood,
                    venue.address,
                    venue.foodDeals,
                    venue.drinkDeals,
                    venue.tags.join(' ')
                ].join(' ').toLowerCase();

                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        console.log('Venues after filtering:', this.filteredVenues.length);
        console.log('Filtered venue names:', this.filteredVenues.map(v => v.name));

        this.renderVenues();
    }

    venueHasHappyHourAtTime(venue, filterTime) {
        // Convert filter time to minutes (e.g., "12:00" -> 720 minutes)
        const filterMinutes = this.timeToMinutes(filterTime + ':00');

        console.log(`Checking venue "${venue.name}" for time ${filterTime} (${filterMinutes} minutes)`);

        // Check all days for happy hours that include this time
        for (const [day, hours] of Object.entries(venue.happyHours)) {
            if (!hours) continue;

            console.log(`  ${day}: "${hours}"`);

            // Parse time range (e.g., "3:00 PM - 6:00 PM")
            const timeRange = this.parseTimeRange(hours);
            console.log(`    Parsed range:`, timeRange);

            if (!timeRange) continue;

            // Check if filter time falls within this range
            if (filterMinutes >= timeRange.start && filterMinutes <= timeRange.end) {
                console.log(`    ✅ Match! ${filterMinutes} is between ${timeRange.start} and ${timeRange.end}`);
                return true;
            } else {
                console.log(`    ❌ No match. ${filterMinutes} not between ${timeRange.start} and ${timeRange.end}`);
            }
        }

        console.log(`  No matches found for venue "${venue.name}"`);
        return false;
    }

    timeToMinutes(timeString) {
        // Convert various time formats to minutes since midnight
        // Handles: "11:00 AM", "11am", "11:00", "11"
        const timeMatch = timeString.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/i);
        if (!timeMatch) return null;

        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2] || '0');
        const period = timeMatch[3]?.toUpperCase();

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        } else if (!period) {
            // 24-hour format - no conversion needed
        }

        return hours * 60 + minutes;
    }

    parseTimeRange(timeString) {
        // Handle special cases first
        if (!timeString || timeString.toLowerCase().includes('n/a') || timeString.toLowerCase() === 'closed') {
            return null;
        }

        if (timeString.toLowerCase().includes('all day')) {
            return { start: 0, end: 24 * 60 - 1 }; // All day (0:00 to 23:59)
        }

        if (timeString.toLowerCase().includes('close')) {
            // Handle "6pm-Close" - assume close is 2 AM
            const startMatch = timeString.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
            if (startMatch) {
                const startMinutes = this.timeToMinutes(startMatch[0]);
                return { start: startMinutes, end: 2 * 60 }; // 2 AM
            }
        }

        // Parse various time range formats
        // Handles: "11am - 2pm", "3:00 PM - 6:00 PM", "11:00 - 14:00"
        const rangeMatch = timeString.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)/i);
        if (!rangeMatch) return null;

        const startMinutes = this.timeToMinutes(rangeMatch[1]);
        const endMinutes = this.timeToMinutes(rangeMatch[2]);

        if (startMinutes === null || endMinutes === null) return null;

        return {
            start: startMinutes,
            end: endMinutes
        };
    }

    filterByCurrentTime() {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

        console.log(`=== HAPPY HOUR NOW ===`);
        console.log(`Current day: ${currentDay}`);
        console.log(`Current time: ${currentTime} minutes (${Math.floor(currentTime/60)}:${String(currentTime%60).padStart(2,'0')})`);

        // Clear other filters first, then apply "Happy Hour Now" logic
        this.elements.dayFilter.value = '';
        this.elements.neighborhoodFilter.value = '';
        this.elements.timeFilter.value = '';
        this.elements.searchInput.value = '';

        this.filteredVenues = this.venues.filter(venue => {
            const todayHours = venue.happyHours[currentDay];
            console.log(`Checking ${venue.name}: today's hours = "${todayHours}"`);

            if (!todayHours) return false;

            // Use the same parsing logic as the time filter
            const timeRange = this.parseTimeRange(todayHours);
            console.log(`  Parsed range:`, timeRange);

            if (!timeRange) return false;

            const isActive = currentTime >= timeRange.start && currentTime <= timeRange.end;
            console.log(`  ${isActive ? '✅' : '❌'} Current time ${currentTime} vs range ${timeRange.start}-${timeRange.end}`);

            return isActive;
        });

        console.log(`Active venues: ${this.filteredVenues.length}`);

        this.elements.happyHourNowBtn.classList.add('active');
        this.renderVenues();
    }

    resetFilters() {
        this.elements.dayFilter.value = '';
        this.elements.neighborhoodFilter.value = '';
        this.elements.timeFilter.value = '';
        this.elements.searchInput.value = '';
        this.elements.happyHourNowBtn.classList.remove('active');

        this.filteredVenues = [...this.venues];
        this.renderVenues();
    }

    renderVenues() {
        const grid = this.elements.venuesGrid;
        const count = this.elements.resultsCount;

        // Update count
        count.textContent = `${this.filteredVenues.length} venues found`;

        // Clear grid
        grid.innerHTML = '';

        // Render venues
        this.filteredVenues.forEach(venue => {
            const card = this.createVenueCard(venue);
            grid.appendChild(card);
        });
    }

    createVenueCard(venue) {
        const card = document.createElement('div');
        card.className = 'venue-card';

        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
        const todayHours = venue.happyHours[currentDay];

        card.innerHTML = `
            <div class="venue-header">
                <div>
                    <h3 class="venue-name">${venue.name}</h3>
                    <p class="venue-neighborhood">${venue.neighborhood}</p>
                </div>
                <button class="details-btn" onclick="showVenueDetails('${venue.name.replace(/'/g, "\\'")}')">
                    View Details
                </button>
            </div>

            <p class="venue-address">${venue.address}</p>
            <a href="tel:${venue.phone}" class="venue-phone">${venue.phone}</a>

            <div class="happy-hours">
                <h4>Happy Hour Times</h4>
                ${Object.entries(venue.happyHours).map(([day, hours]) => `
                    <div class="day-hours">
                        <span class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <span class="hours-time ${day === currentDay && hours ? 'active' : ''}">${hours || 'Closed'}</span>
                    </div>
                `).join('')}
            </div>

            ${venue.tags && venue.tags.length > 0 ? `
                <div class="venue-tags">
                    ${venue.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;

        return card;
    }

    showLoading() {
        this.elements.loading.style.display = 'block';
        this.elements.venuesGrid.style.display = 'none';
        this.elements.error.style.display = 'none';
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
        this.elements.venuesGrid.style.display = 'grid';
        this.elements.error.style.display = 'none';
    }

    showError() {
        this.elements.loading.style.display = 'none';
        this.elements.venuesGrid.style.display = 'none';
        this.elements.error.style.display = 'block';
    }
}

// Global app instance for modal functions
let happyHourApp;

// Modal functions
function showVenueDetails(venueName) {
    const venue = happyHourApp.venues.find(v => v.name === venueName);
    if (!venue) return;

    const modal = document.getElementById('venue-modal');
    const modalName = document.getElementById('modal-venue-name');
    const modalDetails = document.getElementById('modal-venue-details');

    modalName.textContent = venue.name;

    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];

    modalDetails.innerHTML = `
        <div class="modal-section">
            <h3>📍 Location</h3>
            <p><strong>Address:</strong> ${venue.address}</p>
            <p><strong>Neighborhood:</strong> ${venue.neighborhood}</p>
            <p><strong>Phone:</strong> <a href="tel:${venue.phone}">${venue.phone}</a></p>
            ${venue.website ? `<p><strong>Website:</strong> <a href="${venue.website}" target="_blank">${venue.website}</a></p>` : ''}
            <div id="venue-map" class="venue-map"></div>
        </div>

        ${venue.drinkDeals || venue.foodDeals ? `
            <div class="modal-section">
                <h3>🍺 Happy Hour Specials</h3>
                ${venue.drinkDeals ? `
                    <div class="deals-item">
                        <h4>Drink Specials</h4>
                        <p>${venue.drinkDeals}</p>
                    </div>
                ` : ''}
                ${venue.foodDeals ? `
                    <div class="deals-item">
                        <h4>Food Specials</h4>
                        <p>${venue.foodDeals}</p>
                    </div>
                ` : ''}
            </div>
        ` : `
            <div class="modal-section">
                <h3>🍺 Happy Hour Specials</h3>
                <p class="no-deals">No special deals information available.</p>
            </div>
        `}
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Initialize Google Map after modal is shown
    setTimeout(() => initializeVenueMap(venue), 100);
}

function initializeVenueMap(venue) {
    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps not loaded, showing fallback link');
        const mapContainer = document.getElementById('venue-map');
        if (mapContainer) {
            const encodedAddress = encodeURIComponent(venue.address);
            mapContainer.innerHTML = `
                <div class="map-fallback">
                    <p>📍 <a href="https://www.google.com/maps/search/?api=1&query=${encodedAddress}" target="_blank" class="map-link">
                        View on Google Maps
                    </a></p>
                </div>
            `;
        }
        return;
    }

    const mapContainer = document.getElementById('venue-map');
    if (!mapContainer) return;

    // Create geocoder to convert address to coordinates
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: venue.address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Create map
            const map = new google.maps.Map(mapContainer, {
                center: location,
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                styles: [
                    {
                        featureType: 'poi.business',
                        elementType: 'all',
                        stylers: [{ visibility: 'simplified' }]
                    }
                ]
            });

            // Create marker
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: venue.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2563eb">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32)
                }
            });

            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="map-info-window">
                        <h4>${venue.name}</h4>
                        <p>${venue.address}</p>
                        <p><strong>Phone:</strong> ${venue.phone}</p>
                        <p><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}" target="_blank">Get Directions</a></p>
                    </div>
                `
            });

            // Show info window on marker click
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

        } else {
            // Fallback if geocoding fails
            const encodedAddress = encodeURIComponent(venue.address);
            mapContainer.innerHTML = `
                <div class="map-fallback">
                    <p>📍 <a href="https://www.google.com/maps/search/?api=1&query=${encodedAddress}" target="_blank" class="map-link">
                        View on Google Maps
                    </a></p>
                </div>
            `;
        }
    });
}

function closeVenueDetails() {
    const modal = document.getElementById('venue-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeVenueDetails();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVenueDetails();
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    happyHourApp = new HappyHourApp();
});
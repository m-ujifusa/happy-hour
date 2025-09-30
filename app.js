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
            searchHHBtn: document.getElementById('search-hh'),
            resetFiltersBtn: document.getElementById('reset-filters'),
            resultsCount: document.getElementById('results-count'),
            venuesGrid: document.getElementById('venues-grid'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error')
        };
    }

    bindEvents() {
        this.elements.searchHHBtn.addEventListener('click', () => this.applyFilters());
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
            this.setDefaultDay();
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

    setDefaultDay() {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        this.elements.dayFilter.value = currentDay;
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
            // Day filter - check if day has happy hour (not empty string, N/A, or No HH)
            if (dayFilter) {
                const dayHours = venue.happyHours[dayFilter];
                if (!dayHours || dayHours.trim() === '' ||
                    dayHours.toLowerCase().includes('n/a') ||
                    dayHours.toLowerCase().includes('no hh')) {
                    return false;
                }
            }

            // Neighborhood filter
            if (neighborhoodFilter && venue.neighborhood.toLowerCase() !== neighborhoodFilter) {
                return false;
            }

            // Time filter
            if (timeFilter && !this.venueHasHappyHourAtTime(venue, timeFilter, dayFilter)) {
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

    venueHasHappyHourAtTime(venue, filterTime, specificDay = null) {
        // Parse the filter time (24-hour format from select)
        const searchHour = parseInt(filterTime.split(':')[0]);
        const searchMinute = parseInt(filterTime.split(':')[1]) || 0;

        console.log(`\n=== Checking ${venue.name} for time ${filterTime} (${searchHour}:${searchMinute}) ===`);

        // Determine which days to check
        const daysToCheck = specificDay ? [specificDay] : Object.keys(venue.happyHours);
        console.log(`Checking days: ${daysToCheck.join(', ')}`);

        for (const day of daysToCheck) {
            const hours = venue.happyHours[day];
            console.log(`\n${day}: "${hours}"`);

            if (!hours || hours.trim() === '' ||
                hours.toLowerCase().includes('n/a') ||
                hours.toLowerCase().includes('no hh')) {
                console.log(`  → Skipped (empty, N/A, or No HH)`);
                continue;
            }

            // Special case: "all day" only matches if we're filtering by that specific day
            if (hours.toLowerCase().includes('all day')) {
                if (specificDay) {
                    console.log(`  → ✓ Match (all day on ${specificDay})`);
                    return true;
                } else {
                    console.log(`  → Skipped (all day, but no specific day filter)`);
                    continue;
                }
            }
            if (hours.toLowerCase().includes('close') && searchHour >= 18) {
                console.log(`  → ✓ Match (close and after 6pm)`);
                return true;
            }

            // Split by comma or semicolon to handle multiple time windows
            // e.g., "11am - 2pm, 5pm - 7pm" or "11am - 2pm; 5pm - 7pm"
            const timeWindows = hours.split(/[,;]/).map(w => w.trim());
            console.log(`  → Found ${timeWindows.length} time window(s)`);

            for (const window of timeWindows) {
                // Parse time range - handle multiple formats:
                // "3:00 PM - 6:00 PM" or "11am - 2pm" or "6pm-Close"
                const timeRangeMatch = window.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);

                if (timeRangeMatch) {
                    const [_, startHour, startMin = '0', startPeriod, endHour, endMin = '0', endPeriod] = timeRangeMatch;

                    // Convert to 24-hour format
                    let start24 = parseInt(startHour);
                    if (startPeriod.toLowerCase() === 'pm' && start24 !== 12) start24 += 12;
                    if (startPeriod.toLowerCase() === 'am' && start24 === 12) start24 = 0;

                    let end24 = parseInt(endHour);
                    if (endPeriod.toLowerCase() === 'pm' && end24 !== 12) end24 += 12;
                    if (endPeriod.toLowerCase() === 'am' && end24 === 12) end24 = 0;

                    // Create time values for comparison (hour * 60 + minutes)
                    const startTime = start24 * 60 + parseInt(startMin);
                    const endTime = end24 * 60 + parseInt(endMin);
                    const searchTime = searchHour * 60 + searchMinute;

                    console.log(`    → Window "${window}": ${start24}:${startMin.padStart(2,'0')} - ${end24}:${endMin.padStart(2,'0')} | Search: ${searchHour}:${searchMinute.toString().padStart(2,'0')}`);

                    // Check if search time falls within range
                    if (searchTime >= startTime && searchTime <= endTime) {
                        console.log(`    → ✓ Match found!`);
                        return true;
                    } else {
                        console.log(`    → ✗ No match (outside range)`);
                    }
                } else {
                    console.log(`    → Could not parse time window: "${window}"`);
                }
            }
        }

        console.log(`\n→ Final result: NO MATCH\n`);
        return false;
    }


    resetFilters() {
        this.elements.dayFilter.value = '';
        this.elements.neighborhoodFilter.value = '';
        this.elements.timeFilter.value = '';
        this.elements.searchInput.value = '';

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
        card.style.cursor = 'pointer';
        card.onclick = () => showVenueDetails(venue.name);

        // Get the currently selected day filter
        const selectedDay = this.elements.dayFilter.value;
        const displayHours = venue.happyHours[selectedDay] || 'Closed';

        card.innerHTML = `
            <div class="venue-header">
                <button class="venue-name-btn">
                    ${venue.name}
                </button>
            </div>

            <p class="venue-address">${venue.address}</p>

            <div class="happy-hours">
                <h4>Happy Hour Times</h4>
                <div class="day-hours">
                    <span class="day-name">${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
                    <span class="hours-time active">${displayHours}</span>
                </div>
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

        <div class="modal-section">
            <h3>🕒 Happy Hour Schedule</h3>
            <div class="happy-hours">
                ${Object.entries(venue.happyHours).map(([day, hours]) => `
                    <div class="day-hours">
                        <span class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <span class="hours-time ${day === currentDay ? 'active' : ''}">${hours || 'Closed'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
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
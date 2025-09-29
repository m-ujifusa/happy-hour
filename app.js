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
        const searchTerm = this.elements.searchInput.value.toLowerCase();

        this.filteredVenues = this.venues.filter(venue => {
            // Day filter
            if (dayFilter && !venue.happyHours[dayFilter]) {
                return false;
            }

            // Neighborhood filter
            if (neighborhoodFilter && venue.neighborhood.toLowerCase() !== neighborhoodFilter) {
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

        this.renderVenues();
    }

    filterByCurrentTime() {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

        this.filteredVenues = this.venues.filter(venue => {
            const todayHours = venue.happyHours[currentDay];
            if (!todayHours) return false;

            // Parse time range (e.g., "3:00 PM - 6:00 PM")
            const timeMatch = todayHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/);
            if (!timeMatch) return false;

            const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;

            let startTimeMinutes = parseInt(startHour) * 60 + parseInt(startMin);
            let endTimeMinutes = parseInt(endHour) * 60 + parseInt(endMin);

            // Convert to 24-hour format
            if (startPeriod === 'PM' && parseInt(startHour) !== 12) {
                startTimeMinutes += 12 * 60;
            }
            if (endPeriod === 'PM' && parseInt(endHour) !== 12) {
                endTimeMinutes += 12 * 60;
            }
            if (startPeriod === 'AM' && parseInt(startHour) === 12) {
                startTimeMinutes -= 12 * 60;
            }
            if (endPeriod === 'AM' && parseInt(endHour) === 12) {
                endTimeMinutes -= 12 * 60;
            }

            return currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
        });

        this.elements.happyHourNowBtn.classList.add('active');
        this.renderVenues();
    }

    resetFilters() {
        this.elements.dayFilter.value = '';
        this.elements.neighborhoodFilter.value = '';
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

            <div class="venue-deals">
                ${venue.foodDeals ? `
                    <div class="deals-section">
                        <div class="deals-title">Food Deals</div>
                        <div class="deals-content">${venue.foodDeals}</div>
                    </div>
                ` : ''}
                ${venue.drinkDeals ? `
                    <div class="deals-section">
                        <div class="deals-title">Drink Deals</div>
                        <div class="deals-content">${venue.drinkDeals}</div>
                    </div>
                ` : ''}
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
        </div>

        <div class="modal-section">
            <h3>🕐 Happy Hour Schedule</h3>
            <div class="schedule-grid">
                ${Object.entries(venue.happyHours).map(([day, hours]) => `
                    <div class="schedule-row ${day === currentDay && hours ? 'today' : ''}">
                        <span class="schedule-day">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <span class="schedule-hours">${hours || 'No Happy Hour'}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        ${venue.drinkDeals || venue.foodDeals ? `
            <div class="modal-section">
                <h3>🍺 Special Deals</h3>
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
        ` : ''}

        ${venue.tags && venue.tags.length > 0 ? `
            <div class="modal-section">
                <h3>🏷️ Tags</h3>
                <div class="tags-container">
                    ${venue.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        ` : ''}
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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
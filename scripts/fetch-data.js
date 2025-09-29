const https = require('https');
const fs = require('fs');
const path = require('path');

async function fetchGoogleSheetsData() {
    const sheetsId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetsId) {
        console.error('❌ GOOGLE_SHEETS_ID environment variable not set');
        process.exit(1);
    }

    console.log('📊 Fetching data from Google Sheets...');

    try {
        // Google Sheets CSV export URL
        const url = `https://docs.google.com/spreadsheets/d/${sheetsId}/export?format=csv`;

        const csvData = await fetchUrl(url);
        const venues = parseCSVData(csvData);

        console.log(`✅ Parsed ${venues.length} venues`);

        // Save to JSON file
        const outputPath = path.join(__dirname, '../data/venues.json');
        fs.writeFileSync(outputPath, JSON.stringify(venues, null, 2));

        console.log(`💾 Saved data to ${outputPath}`);

    } catch (error) {
        console.error('❌ Error fetching data:', error.message);
        process.exit(1);
    }
}

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const makeRequest = (requestUrl) => {
            https.get(requestUrl, (response) => {
                // Handle redirects
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    console.log(`Following redirect to: ${response.headers.location}`);
                    makeRequest(response.headers.location);
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }

                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => resolve(data));
            }).on('error', reject);
        };

        makeRequest(url);
    });
}

function parseCSVData(csvData) {
    const lines = csvData.trim().split('\n');

    if (lines.length === 0) {
        throw new Error('No data found in Google Sheets');
    }

    // Parse header row
    const headers = parseCSVLine(lines[0]);
    console.log('📋 Headers found:', headers);

    // Parse data rows
    const venues = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = parseCSVLine(line);

        // Pad values if row has fewer columns than headers
        while (values.length < headers.length) {
            values.push('');
        }

        const venueData = {};
        headers.forEach((header, index) => {
            venueData[header] = values[index] || '';
        });

        // Skip rows without a name
        if (!venueData.Name || !venueData.Name.trim()) {
            continue;
        }

        const processedVenue = processVenueData(venueData);
        venues.push(processedVenue);
    }

    return venues;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Double quote escape
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add final field
    result.push(current.trim());

    return result;
}

function processVenueData(rawData) {
    // Extract happy hours for each day
    const happyHours = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
        const dayKey = day.toLowerCase();
        const hours = rawData[day] || '';
        happyHours[dayKey] = hours.trim();
    });

    // Process tags
    const tags = [];
    if (rawData.Tags) {
        rawData.Tags.split(',').forEach(tag => {
            const cleanTag = tag.trim().toLowerCase();
            if (cleanTag) tags.push(cleanTag);
        });
    }

    // Create venue object
    return {
        name: rawData.Name.trim(),
        address: rawData.Address.trim(),
        neighborhood: rawData.Neighborhood.trim(),
        phone: rawData.Phone.trim(),
        website: rawData.Website.trim(),
        priceRange: rawData['Price Range']?.trim() || '$$',
        happyHours,
        foodDeals: rawData['Food Deals']?.trim() || '',
        drinkDeals: rawData['Drink Deals']?.trim() || '',
        tags
    };
}

// Run if called directly
if (require.main === module) {
    fetchGoogleSheetsData();
}

module.exports = { fetchGoogleSheetsData };
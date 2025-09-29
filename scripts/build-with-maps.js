const fs = require('fs');
const path = require('path');

function buildWithMapsKey() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('⚠️  GOOGLE_MAPS_API_KEY not found. Maps will use fallback links.');
        return;
    }

    console.log('🗺️  Injecting Google Maps API key...');

    // Read the HTML file
    const indexPath = path.join(__dirname, '../index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');

    // Replace the placeholder comment with the actual script tag
    const mapsScript = `<script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"></script>`;

    htmlContent = htmlContent.replace(
        '    <!-- Google Maps script will be injected during build -->',
        `    ${mapsScript}`
    );

    // Write back to the file
    fs.writeFileSync(indexPath, htmlContent);

    console.log('✅ Google Maps API key injected successfully');
}

// Run if called directly
if (require.main === module) {
    buildWithMapsKey();
}

module.exports = { buildWithMapsKey };
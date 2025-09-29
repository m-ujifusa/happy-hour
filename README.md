# Minneapolis Happy Hour Finder 🍻

A free, open-source website that helps people find ongoing happy hours at bars and restaurants in the Minneapolis metro area.

## ✨ Features

- **Smart Filtering**: Filter by day, neighborhood, price range
- **"Happy Hour Now"**: Shows only venues with active happy hours
- **Mobile Responsive**: Works great on all devices
- **Real-time Updates**: Automatically syncs with Google Sheets data
- **Zero Cost**: Hosted for free on GitHub Pages

## 🚀 Quick Start

### For Users
Visit the live site: `https://your-username.github.io/happy-hour`

### For Developers

1. **Fork this repository** to your GitHub account

2. **Set up Google Sheets:**
   - Create a Google Sheet with your happy hour data
   - Follow the template in `google-sheets-template.md`
   - Publish to web as CSV (File → Publish to web)
   - Copy the sheet ID from the URL

3. **Configure GitHub Secrets:**
   - Go to your repo Settings → Secrets and variables → Actions
   - Add secret: `GOOGLE_SHEETS_ID` with your sheet ID

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main", folder: "/ (root)"

5. **Done!** Your site will be live at `https://your-username.github.io/happy-hour`

## 🏃‍♂️ Local Development

```bash
# Run locally (requires Python)
npm run dev
# Visit http://localhost:3000

# Test data fetching
GOOGLE_SHEETS_ID=your_sheet_id npm run fetch-data
```

## 📊 How It Works

1. **Google Sheets** stores venue data (manually maintained)
2. **GitHub Actions** fetches new data every 4 hours
3. **GitHub Pages** serves the static website for free
4. **No servers needed** - everything runs in the browser

## 📋 Data Format

Your Google Sheets should have these columns:
- **Name** - Venue name
- **Address** - Full address
- **Neighborhood** - Area/district
- **Phone** - Contact number
- **Website** - Venue website
- **Price Range** - $, $$, $$$, or $$$$
- **Monday-Sunday** - Happy hour times (e.g., "3:00 PM - 6:00 PM")
- **Food Deals** - Description of food specials
- **Drink Deals** - Description of drink specials
- **Tags** - Comma-separated tags (e.g., "wings,beer,patio")

## 🤝 Contributing

1. Add venues to the Google Sheet
2. Submit issues for bugs or feature requests
3. Create pull requests for code improvements

## 💡 Future Ideas

- Venue submission form
- Web scraping for automatic updates
- Mobile app version
- Integration with social media
- User reviews and ratings
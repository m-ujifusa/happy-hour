# Google Sheets Template for Minneapolis Happy Hour Data

## Setup Instructions

1. **Create a new Google Sheet** with the following column headers in the first row:

```
Name | Address | Neighborhood | Phone | Website | Price Range | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday | Food Deals | Drink Deals | Tags
```

2. **Make the sheet public:**
   - File → Publish to the web
   - Choose "Entire Document" and "Comma-separated values (.csv)"
   - Check "Automatically republish when changes are made"
   - Click "Publish"

3. **Get the Spreadsheet ID:**
   From your Google Sheets URL, copy the **Spreadsheet ID** (NOT the Sheet ID):
   ```
   URL: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0

   ✅ Spreadsheet ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms  (what we need)
   ❌ Sheet ID (gid): 0  (specific tab number - not needed)
   ```
   The Spreadsheet ID is the long string between `/d/` and `/edit`.

4. **Add to GitHub Secrets:**
   - Go to your repo Settings → Secrets and variables → Actions
   - Add secret: `GOOGLE_SHEETS_ID` with your Spreadsheet ID

## Column Descriptions

| Column | Description | Example |
|--------|-------------|---------|
| Name | Venue name | "The Bulldog Lowertown" |
| Address | Full street address | "237 6th St E, St Paul, MN 55101" |
| Neighborhood | Area/district name | "Lowertown" |
| Phone | Phone number | "(651) 221-0750" |
| Website | Website URL | "https://thebulldoglowertown.com" |
| Price Range | $ to $$$$ | "$$" |
| Monday-Sunday | Happy hour times for each day | "3:00 PM - 6:00 PM" or leave blank |
| Food Deals | Description of food specials | "$1 off appetizers, $6 wings" |
| Drink Deals | Description of drink specials | "$4 draft beer, $5 well cocktails" |
| Tags | Comma-separated tags | "wings,beer,cocktails,sports-bar" |

## Sample Data Rows

### Row 1:
```
The Bulldog Lowertown | 237 6th St E, St Paul, MN 55101 | Lowertown | (651) 221-0750 | https://thebulldoglowertown.com | $$ | 3:00 PM - 6:00 PM | 3:00 PM - 6:00 PM | 3:00 PM - 6:00 PM | 3:00 PM - 6:00 PM | 3:00 PM - 6:00 PM | | | $1 off appetizers, $6 wings | $4 draft beer, $5 well cocktails, $6 house wine | wings,beer,cocktails,sports-bar
```

### Row 2:
```
Psycho Suzi's Motor Lounge | 1900 Marshall St NE, Minneapolis, MN 55413 | Northeast | (612) 788-9069 | https://psychosuzis.com | $$$ | 4:00 PM - 6:00 PM | 4:00 PM - 6:00 PM | 4:00 PM - 6:00 PM | 4:00 PM - 6:00 PM | 4:00 PM - 6:00 PM | | 4:00 PM - 6:00 PM | Half-price appetizers | $2 off tiki cocktails, $4 beer specials | tiki,cocktails,patio,riverfront
```

### Row 3:
```
Parlour Bar | 730 N Washington Ave, Minneapolis, MN 55401 | North Loop | (612) 354-3135 | https://parlourbar.com | $$$ | 5:00 PM - 7:00 PM | 5:00 PM - 7:00 PM | 5:00 PM - 7:00 PM | 5:00 PM - 7:00 PM | 5:00 PM - 7:00 PM | | | Discounted bar bites | $7 cocktails, $5 beer, $8 wine | upscale,cocktails,burgers,north-loop
```

## Time Format

Use the format: `H:MM AM/PM - H:MM AM/PM`

Examples:
- `3:00 PM - 6:00 PM`
- `4:30 PM - 7:00 PM`
- `11:00 AM - 2:00 PM`

Leave the cell blank if there's no happy hour that day.

## Common Tags

Suggested tags for consistency:
- **Food**: wings, burgers, pizza, appetizers, tacos, oysters
- **Drinks**: beer, cocktails, wine, tiki, craft-beer, sports-bar
- **Atmosphere**: upscale, neighborhood, dive-bar, rooftop, patio
- **Features**: live-music, trivia, karaoke, food-truck, brewery
- **Location**: downtown, northeast, north-loop, uptown, lowertown

## Neighborhoods

Common Minneapolis/St. Paul neighborhoods:
- Downtown Minneapolis
- North Loop
- Northeast
- Uptown
- Lowertown
- Highland Park
- Cathedral Hill
- Midway
- Como
- Grand Avenue

## Troubleshooting

### "Could not load venues data" Error

This usually means the Spreadsheet ID is wrong. Check:

1. **Using Spreadsheet ID, not Sheet ID:**
   ```
   ❌ Wrong: 0 (this is a Sheet ID/gid)
   ✅ Correct: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

2. **Sheet is published to web:**
   - File → Publish to the web → Publish
   - Must be "Comma-separated values (.csv)"
   - "Automatically republish when changes are made" should be checked

3. **Test the CSV URL manually:**
   Replace `YOUR_SPREADSHEET_ID` and visit:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/export?format=csv
   ```
   You should see CSV data, not an error page.

### Multi-tab Spreadsheets

If your happy hour data is on a specific tab (not the first one):

1. Get the Sheet ID (gid) from the URL: `#gid=123456789`
2. Update `scripts/fetch-data.js` to include the gid:
   ```javascript
   const url = `https://docs.google.com/spreadsheets/d/${sheetsId}/export?format=csv&gid=123456789`;
   ```
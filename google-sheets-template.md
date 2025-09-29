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
   - Copy the sheet ID from the URL (the long string between `/d/` and `/edit`)

3. **Set the Google Sheets ID environment variable** in your Lambda function:
   ```
   GOOGLE_SHEETS_ID=your_google_sheets_id_here
   ```

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
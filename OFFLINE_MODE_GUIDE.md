# Offline Mode Guide

## Overview

The 90 Days Ascension Journey app is designed to work **even when the backend/Supabase service is unavailable**. This ensures you can always track your progress, even during service outages.

## How It Works

### Automatic Detection
- When the backend/Supabase service is unavailable, the app automatically switches to **offline mode**
- All your progress is saved to **LocalStorage** (browser storage)
- You can continue using the app normally

### Offline Mode Features
✅ **Full functionality** - All features work with LocalStorage
✅ **Progress tracking** - Your daily completions are saved locally
✅ **XP & Streaks** - Gamification system works offline
✅ **Journey data** - All journey content is available
✅ **No data loss** - Everything is saved locally

### What Happens When Service Returns
- When the backend comes back online, you can:
  - Continue using the app (it will sync when possible)
  - Your local data remains intact
  - No data is lost during offline periods

## Visual Indicators

### Offline Mode Banner
When the service is unavailable, you'll see a yellow banner at the top:
- **Message**: "Offline Mode Active"
- **Info**: "Backend service unavailable. App is working with LocalStorage. Your progress is saved locally."
- **Dismissible**: You can close the banner if needed

### Error Messages
- Login/Register errors will show: "Backend service is temporarily unavailable. The app will work in offline mode using LocalStorage."
- The app will continue to function normally

## Technical Details

### Offline Mode Flag
- Stored in LocalStorage: `ascension_offline_mode = 'true'`
- Automatically set when service errors are detected
- Can be manually cleared if needed

### Data Storage
All data is stored in LocalStorage with these keys:
- `ascensionProgress` - Your journey progress
- `ascensionXP` - XP and level data
- `ascensionStreaks` - Streak information
- `ascensionAchievements` - Unlocked achievements
- `ascensionTheme` - Theme preference

### Service Detection
The app detects service unavailability through:
- Network errors (Failed to fetch, Connection refused)
- HTTP 503 errors (Service Unavailable)
- Supabase-specific errors (SUPABASE_UNAVAILABLE)

## Manual Offline Mode

If you want to force offline mode (for testing or if you prefer local-only):

1. Open browser console (F12)
2. Run: `localStorage.setItem('ascension_offline_mode', 'true')`
3. Refresh the page

To exit offline mode:
1. Open browser console (F12)
2. Run: `localStorage.removeItem('ascension_offline_mode')`
3. Refresh the page

## Troubleshooting

### App Not Working Offline
- Check browser console for errors
- Ensure LocalStorage is enabled in your browser
- Try clearing browser cache and reloading

### Data Not Saving
- Check browser storage limits (LocalStorage has ~5-10MB limit)
- Ensure you're not in private/incognito mode (some browsers restrict LocalStorage)
- Check browser permissions

### Service Still Showing Errors
- The app should automatically handle service errors
- If errors persist, check the browser console
- Try refreshing the page

## Best Practices

1. **Regular Backups**: Export your data periodically (Settings page)
2. **Browser Choice**: Use a modern browser with LocalStorage support
3. **Stay Updated**: Keep the app updated for best offline support
4. **Check Service Status**: If offline mode persists, check Supabase dashboard

## Future Enhancements

- Automatic sync when service returns
- Data export/import functionality
- Cloud backup options
- Conflict resolution for synced data

---

**Note**: Offline mode ensures you never lose progress, even during service outages. Your discipline journey continues uninterrupted! 🚀


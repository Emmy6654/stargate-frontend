# PWA Installation Guide for Stargate Dashboard

The Stargate dashboard is a Progressive Web App (PWA) that can be installed on iOS, Android, and desktop browsers for a native app-like experience. This guide explains how to install the dashboard on different platforms.

## What is a PWA?

A Progressive Web App is a web application that can be installed on your device and used offline or with limited connectivity. The Stargate dashboard PWA provides:

- **Offline access** - Access your dashboard even without internet
- **App-like experience** - Runs in full screen without browser UI
- **Fast loading** - Cached assets load instantly
- **Push notifications** - Receive updates about transactions and disputes
- **Home screen icon** - Quick access from your device home screen

## Installation on iOS

### Requirements

- iPhone or iPad running iOS 11.3 or later
- Safari browser

### Steps

1. **Open Safari** and navigate to your Stargate dashboard URL (e.g., `https://dashboard.stargate.finance`)

2. **Sign in** to your merchant account

3. **Tap the Share button** (the square with an arrow at the bottom of the screen)

4. **Scroll down** and tap **"Add to Home Screen"**

5. **Enter a name** for the app (default is "Stargate Dashboard")

6. **Tap "Add"** in the top-right corner

The dashboard will now appear as an icon on your home screen. Tap it to launch the app in full-screen mode.

### iOS Tips

- The app will open in full-screen Safari without the address bar
- You can still access browser features by swiping down from the top
- The app will use your device's storage for offline data
- To remove the app, long-press the icon and select "Remove App"

## Installation on Android

### Requirements

- Android device running Android 5.0 or later
- Chrome, Firefox, Edge, or Samsung Internet browser

### Steps (Chrome)

1. **Open Chrome** and navigate to your Stargate dashboard URL

2. **Sign in** to your merchant account

3. **Tap the menu button** (three dots in the top-right corner)

4. **Tap "Install app"** or **"Add to Home screen"**

5. **Confirm** the installation by tapping "Install"

The dashboard will now appear as an icon on your home screen.

### Steps (Firefox)

1. **Open Firefox** and navigate to your Stargate dashboard URL

2. **Sign in** to your merchant account

3. **Tap the menu button** (three horizontal lines at the bottom)

4. **Tap "Install"**

5. **Confirm** the installation

### Steps (Samsung Internet)

1. **Open Samsung Internet** and navigate to your Stargate dashboard URL

2. **Sign in** to your merchant account

3. **Tap the menu button** (three dots in the bottom-right corner)

4. **Tap "Add page to"** → **"Home screen"**

5. **Enter a name** and tap "Add"

### Android Tips

- The app will open in full-screen mode without the browser UI
- You can uninstall the app like any other Android app
- The app will use your device's storage for offline data
- Some browsers may show a notification when the app is ready to install

## Installation on Desktop (Chrome, Edge, Brave)

### Requirements

- Windows, macOS, or Linux
- Chrome, Edge, or Brave browser

### Steps

1. **Open your browser** and navigate to your Stargate dashboard URL

2. **Sign in** to your merchant account

3. **Look for the install prompt** - You should see an install icon in the address bar (looks like a computer with a plus sign) or a banner at the top of the page

4. **Click the install icon** or **"Install"** button

5. **Confirm** the installation

The dashboard will now appear in your applications menu and on your desktop (depending on your OS).

### Desktop Tips

- On Windows, the app will appear in your Start Menu and can be pinned to the taskbar
- On macOS, the app will appear in your Applications folder and Launchpad
- On Linux, the app will appear in your applications menu
- The app runs in its own window without browser UI
- You can uninstall the app like any other application

## Using the Installed App

### Offline Access

The dashboard caches essential data and pages, allowing you to:

- View your dashboard overview
- Check recent transactions and invoices
- Access your settings and profile

**Note:** Real-time data updates require an internet connection.

### Notifications

If you've enabled notifications:

- You'll receive alerts about new transactions
- Dispute updates will notify you immediately
- Payment confirmations will be sent to your device

To enable notifications, look for the notification settings in your dashboard preferences.

### Syncing Data

When you reconnect to the internet:

- The app automatically syncs any changes you made offline
- New data from the server is fetched and cached
- Your dashboard will be fully up-to-date

## Troubleshooting

### App Won't Install

**On iOS:**
- Ensure you're using Safari (not Chrome or Firefox)
- Check that you're signed in to your account
- Try clearing Safari cache: Settings → Safari → Clear History and Website Data

**On Android:**
- Ensure the website meets PWA requirements (HTTPS, manifest.json, service worker)
- Try a different browser if one doesn't work
- Clear browser cache and try again

**On Desktop:**
- Ensure you're using a supported browser (Chrome, Edge, or Brave)
- Check that the site is served over HTTPS
- Try refreshing the page and looking for the install prompt again

### App Crashes or Won't Load

1. **Force refresh** the app (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on macOS)
2. **Clear app cache** - Uninstall and reinstall the app
3. **Check your internet connection** - Some features require connectivity
4. **Update your browser** to the latest version

### Offline Features Not Working

- Ensure you've visited the dashboard while online first (to cache data)
- Check that your device has sufficient storage space
- Some features (like real-time updates) require an internet connection

### Notifications Not Working

1. **Check permissions** - Ensure you've granted notification permissions to the app
2. **Check browser settings** - Verify notifications are enabled for the dashboard domain
3. **Restart the app** - Close and reopen the installed app
4. **Update your browser** to the latest version

## Uninstalling the App

### iOS

1. Long-press the app icon on your home screen
2. Tap "Remove App"
3. Tap "Remove from Home Screen"

### Android

1. Long-press the app icon on your home screen
2. Tap "Uninstall app"
3. Confirm the uninstallation

### Desktop

**Windows:**
- Settings → Apps → Apps & features → Find "Stargate Dashboard" → Uninstall

**macOS:**
- Finder → Applications → Find "Stargate Dashboard" → Drag to Trash

**Linux:**
- Use your application menu or package manager to uninstall

## Best Practices

1. **Keep your browser updated** - PWA features improve with browser updates
2. **Enable notifications** - Stay informed about important events
3. **Use a strong password** - Your dashboard contains sensitive business data
4. **Regularly sync data** - Ensure your offline changes are synced to the server
5. **Clear cache periodically** - Free up device storage by clearing old cached data

## Support

If you encounter issues installing or using the PWA:

1. Check this guide for troubleshooting steps
2. Visit the [Stargate documentation](https://docs.stargate.finance)
3. Contact support through your dashboard
4. Check your browser's developer console for error messages (F12 or Cmd+Option+I)

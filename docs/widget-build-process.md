# Widget SDK Build Process

This document explains how the Stargate widget SDK is built, configured, and tested locally.

## Overview

The widget SDK (`stargate-widget.js`) is a lightweight, embeddable JavaScript library that merchants can add to their websites to enable Stargate payments. The build process is separate from the main Next.js application and uses a custom Node.js build script.

## Build Script

The widget is built using `npm run build:widget`, which executes `/scripts/build-widget.mjs`.

### Build Process

```bash
npm run build:widget
```

This script:

1. **Creates the `dist/` directory** if it doesn't exist
2. **Reads the source widget** from `widget/stargate-widget.js`
3. **Minifies the code** by:
   - Removing all comments (both `/* */` and `//` style)
   - Collapsing multiple whitespace into single spaces
   - Removing newlines
4. **Writes the minified output** to `dist/stargate-widget.js`
5. **Logs the file size** to the console

### Example Output

```
dist/stargate-widget.js written (2847 bytes)
```

## Widget Source Code

The widget source is located at `/widget/stargate-widget.js` and is a self-contained IIFE (Immediately Invoked Function Expression) that:

- Exposes a global `StargateWidget` object
- Provides a `mount()` function for programmatic usage
- Supports auto-mounting via script tags with data attributes
- Handles DOM ready state detection

### Key Features

#### Auto-Mount via Script Tag

Merchants can add a single line to their HTML:

```html
<script src="https://your-domain/widget/stargate-widget.js" data-invoice-id="INV-123"></script>
```

The widget automatically:
- Detects the script tag
- Creates a button element
- Inserts it after the script tag
- Configures it with the provided invoice ID

#### Programmatic Mount

Merchants can also mount the widget manually:

```javascript
StargateWidget.mount(document.getElementById('pay-btn'), {
  invoiceId: 'INV-123',
  label: 'Pay Now',
  origin: 'https://your-domain',
  target: '_blank'
});
```

#### Data Attributes

The script tag supports these data attributes:

- `data-invoice-id` (required) - The invoice ID to pay
- `data-target` (optional) - ID of an element to mount the button into
- `data-label` (optional) - Custom button label (default: "Pay Now")
- `data-origin` (optional) - Base URL for the payment page
- `data-link-target` (optional) - Target for the payment link (default: "_blank")

## Output Format

The built widget is a single, minified JavaScript file with:

- **No external dependencies** - Pure vanilla JavaScript
- **No build tool requirements** - Works in any browser
- **Minimal size** - Typically 2-3 KB minified
- **Global namespace** - Exposes `window.StargateWidget`

## Integration with Vercel

The `vercel.json` configuration includes a rewrite rule that maps the public widget URL to the built file:

```json
{
  "rewrites": [
    { "source": "/widget/stargate-widget.js", "destination": "/dist/stargate-widget.js" }
  ]
}
```

This allows merchants to load the widget from a clean URL:

```html
<script src="https://your-domain/widget/stargate-widget.js"></script>
```

While the actual file is served from the `dist/` directory.

## Build Configuration

### Package.json Script

```json
{
  "scripts": {
    "build:widget": "node scripts/build-widget.mjs"
  }
}
```

### Full Build Command

The production build includes both the Next.js app and the widget:

```json
{
  "buildCommand": "npm run build && npm run build:widget"
}
```

This ensures both are built together during deployment.

## Local Testing

### Build the Widget

```bash
npm run build:widget
```

This creates `/dist/stargate-widget.js`.

### Test with Local Server

1. **Start the development server:**

```bash
npm run dev
```

2. **Create a test HTML file** (e.g., `test-widget.html`):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Stargate Widget Test</h1>
  
  <!-- Auto-mount test -->
  <h2>Auto-Mount Test</h2>
  <script 
    src="http://localhost:3000/widget/stargate-widget.js" 
    data-invoice-id="test-invoice-123"
  ></script>

  <!-- Programmatic mount test -->
  <h2>Programmatic Mount Test</h2>
  <div id="pay-button"></div>
  <script>
    // Wait for widget to load
    setTimeout(() => {
      if (window.StargateWidget) {
        StargateWidget.mount(document.getElementById('pay-button'), {
          invoiceId: 'test-invoice-456',
          label: 'Custom Pay Button',
          origin: 'http://localhost:3000'
        });
      }
    }, 100);
  </script>
</body>
</html>
```

3. **Open the test file** in your browser and verify:
   - The button appears
   - Clicking it opens the payment page
   - The button styling is correct
   - Hover effects work

### Test with Production Build

```bash
npm run build
npm run build:widget
npm run start
```

Then access the test file at `http://localhost:3000/test-widget.html`.

## Debugging

### Check the Built File

```bash
cat dist/stargate-widget.js
```

### Verify File Size

```bash
ls -lh dist/stargate-widget.js
```

### Browser Console

Open your browser's developer console (F12) and check for:

- `[StargateWidget]` log messages
- Any JavaScript errors
- Network requests to the payment page

### Enable Source Maps (Development)

To debug the minified code, you can modify the build script to preserve formatting:

```javascript
// In scripts/build-widget.mjs, comment out minification:
// const minified = src; // Use original source for debugging
```

## Performance Considerations

### File Size

- **Minified:** ~2-3 KB
- **Gzipped:** ~1-1.5 KB

The small size ensures fast loading on merchant websites.

### Loading Strategy

Merchants should load the widget asynchronously to avoid blocking page rendering:

```html
<!-- Recommended: Async loading -->
<script async src="https://your-domain/widget/stargate-widget.js" data-invoice-id="INV-123"></script>

<!-- Alternative: Defer loading -->
<script defer src="https://your-domain/widget/stargate-widget.js" data-invoice-id="INV-123"></script>
```

### Caching

The widget is served with standard HTTP caching headers. Merchants should:

- Cache the widget file aggressively (e.g., 1 year)
- Use versioning in the URL if updates are frequent
- Monitor for breaking changes in widget updates

## Updating the Widget

### Making Changes

1. **Edit `/widget/stargate-widget.js`**
2. **Rebuild:** `npm run build:widget`
3. **Test locally** with the test HTML file
4. **Commit and push** to trigger production deployment

### Backward Compatibility

When updating the widget:

- Maintain the `StargateWidget.mount()` API
- Keep the data attribute names the same
- Add new features as optional parameters
- Document breaking changes clearly

## Troubleshooting

### Widget Not Loading

1. **Check the script URL** - Ensure it's correct and accessible
2. **Check browser console** - Look for CORS or network errors
3. **Verify the file exists** - Run `npm run build:widget` and check `/dist/stargate-widget.js`
4. **Check Vercel rewrite** - Ensure the rewrite rule is active in production

### Button Not Appearing

1. **Check the invoice ID** - Ensure `data-invoice-id` is provided
2. **Check the target element** - If using `data-target`, verify the element exists
3. **Check browser console** - Look for `[StargateWidget]` error messages
4. **Verify DOM ready** - Ensure the script is loaded after the target element

### Payment Page Not Opening

1. **Check the origin** - Ensure `data-origin` or `StargateWidgetConfig.origin` is set correctly
2. **Check CORS** - Verify the payment page allows embedding
3. **Check browser console** - Look for security warnings

### Styling Issues

1. **Check CSS conflicts** - The widget uses inline styles; ensure no global CSS overrides them
2. **Check z-index** - If the button is hidden, increase the z-index
3. **Check viewport** - Ensure the button container has sufficient space

## Related Documentation

- [Widget SDK & Event Schema](./widget-sdk.md) - Event schemas and postMessage details
- [Theming & Branding Customisation Guide](./theming-and-branding.md) - Customizing widget appearance
- [Vercel Configuration Guide](./vercel-config.md) - Deployment configuration

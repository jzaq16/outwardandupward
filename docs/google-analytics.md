# Google Analytics 4 Implementation Guide

This document explains how Google Analytics 4 (GA4) is implemented on the Outward & Upward website.

## Overview

Google Analytics 4 is integrated to track page views, user interactions, and site performance across all pages. The implementation is designed to work seamlessly with the Single Page Application (SPA) architecture and will automatically track all current and future pages without requiring additional configuration.

## Implementation Details

### 1. GA4 Script Integration

**File**: [index.html](file:///Users/derekjohanson/Documents/Coding/outwardandupward/index.html)

The Google Analytics gtag.js script is loaded in the `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-D7QS4FVWNL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-D7QS4FVWNL');
</script>
```

**Measurement ID**: `G-D7QS4FVWNL`

### 2. Analytics Utility Module

**File**: [src/utils/analytics.js](file:///Users/derekjohanson/Documents/Coding/outwardandupward/src/utils/analytics.js)

This module provides two main functions:

#### `trackPageView(path, title)`
Tracks page views in Google Analytics. Called automatically when routes change.

**Parameters:**
- `path` - The page path (e.g., `/about`, `/posts/my-post`)
- `title` - The page title

**Development Mode**: Automatically disabled on localhost to prevent polluting production data. Logs to console instead.

#### `trackEvent(eventName, eventParams)`
Tracks custom events (available for future use).

**Parameters:**
- `eventName` - The name of the event
- `eventParams` - Additional parameters for the event (optional)

### 3. Router Integration

**File**: [src/main.js](file:///Users/derekjohanson/Documents/Coding/outwardandupward/src/main.js)

The analytics module is imported and integrated into the `renderPage()` function:

```javascript
import { trackPageView } from './utils/analytics.js';

// ... in renderPage() function ...

// Track page view in Google Analytics
const pageTitle = document.title;
trackPageView(window.location.pathname, pageTitle);
```

This ensures that every route change is automatically tracked, including:
- Home page
- About page
- All Posts page
- Individual post pages
- Contact page
- Any future pages you add

## Verification

### Using Google Analytics Real-Time Reports

1. Navigate to your [Google Analytics dashboard](https://analytics.google.com/)
2. Select your property (Outward & Upward)
3. Go to **Reports** → **Real-time**
4. Visit your production site and navigate between pages
5. You should see page views appearing in real-time

### Using Google Analytics Debugger (Optional)

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable the debugger
3. Open your browser's Developer Console
4. Navigate your site and see detailed GA events logged

## Development vs Production

- **Development (localhost)**: Analytics tracking is disabled. Events are logged to the console for debugging.
- **Production**: Full analytics tracking is enabled.

To test analytics in development, temporarily modify the hostname check in `src/utils/analytics.js`.

## Future Enhancements

The `trackEvent()` function is available for tracking custom interactions such as:
- Button clicks
- Form submissions
- Social media shares
- External link clicks
- Video plays

Example usage:
```javascript
import { trackEvent } from './utils/analytics.js';

// Track a button click
trackEvent('button_click', {
  button_name: 'Subscribe',
  location: 'footer'
});
```

## Troubleshooting

### Page views not appearing in GA4

1. Verify you're viewing the production site (not localhost)
2. Check that the Measurement ID is correct in `index.html`
3. Use the Google Analytics Debugger to see if events are being sent
4. Allow 24-48 hours for data to fully populate in standard reports (Real-time should work immediately)

### Testing on localhost

Modify the hostname check in `src/utils/analytics.js`:

```javascript
// Comment out this line to enable tracking on localhost
// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
```

**Remember to uncomment before deploying to production!**

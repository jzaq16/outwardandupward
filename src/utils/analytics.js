/**
 * Google Analytics utility module
 * Handles page view tracking and custom event tracking for GA4
 */

/**
 * Track a page view in Google Analytics
 * @param {string} path - The page path (e.g., '/about', '/posts/my-post')
 * @param {string} title - The page title
 */
export function trackPageView(path, title) {
    // Only track in production (not on localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[Analytics - Dev Mode] Page view:', { path, title });
        return;
    }

    // Check if gtag is available
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title,
            page_location: window.location.href
        });
    }
}

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - The name of the event
 * @param {Object} eventParams - Additional parameters for the event
 */
export function trackEvent(eventName, eventParams = {}) {
    // Only track in production (not on localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[Analytics - Dev Mode] Event:', eventName, eventParams);
        return;
    }

    // Check if gtag is available
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventParams);
    }
}

# Vercel Configuration Guide

This document explains the `vercel.json` configuration file, which defines build settings, security headers, and URL rewrites for the Stargate frontend deployment on Vercel.

## Overview

The `vercel.json` file contains:
- Build configuration
- Global security headers
- Route-specific headers
- URL rewrites for the widget SDK

## Configuration Breakdown

### Build Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build && npm run build:widget",
  "regions": ["iad1"]
}
```

- **framework**: Specifies Next.js as the framework, enabling Vercel's Next.js optimizations
- **buildCommand**: Runs both the main Next.js build and the widget SDK build (Rollup)
- **regions**: Deploys to the `iad1` (Northern Virginia) region for optimal latency

### Security Headers

#### Global Headers (All Routes)

```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
  ]
}
```

- **X-Content-Type-Options: nosniff** - Prevents browsers from MIME-sniffing responses, mitigating XSS attacks
- **Referrer-Policy: strict-origin-when-cross-origin** - Only sends referrer to same-origin requests, protecting user privacy
- **Strict-Transport-Security** - Enforces HTTPS for 2 years (63072000 seconds), includes subdomains, and preload list

#### Dashboard Headers (`/dashboard/*`)

```json
{
  "source": "/dashboard/(.*)",
  "headers": [
    { "key": "X-Frame-Options", "value": "DENY" }
  ]
}
```

- **X-Frame-Options: DENY** - Prevents the dashboard from being embedded in iframes, protecting against clickjacking attacks

#### Payment Page Headers (`/pay/*`)

```json
{
  "source": "/pay/(.*)",
  "headers": [
    { "key": "Content-Security-Policy", "value": "frame-ancestors https://*.stargate.finance" }
  ]
}
```

- **Content-Security-Policy: frame-ancestors** - Allows the payment page to be embedded only in iframes from `*.stargate.finance` subdomains, enabling merchant integration while maintaining security

### URL Rewrites

```json
{
  "rewrites": [
    { "source": "/widget/stargate-widget.js", "destination": "/dist/stargate-widget.js" }
  ]
}
```

- **Widget Rewrite** - Maps `/widget/stargate-widget.js` to `/dist/stargate-widget.js`, allowing merchants to load the widget from a clean URL while the actual file is built in the `dist` directory by the Rollup build process

## Deployment Workflow

1. Push to the repository
2. Vercel detects changes and runs `npm run build && npm run build:widget`
3. Next.js builds the main application
4. Rollup builds the widget SDK to `/dist/stargate-widget.js`
5. Vercel applies headers and rewrites
6. Application is deployed to the `iad1` region

## Local Testing

To test the configuration locally:

```bash
npm run build
npm run build:widget
npm run start
```

The rewrite rule can be tested by accessing `/widget/stargate-widget.js` in your browser, which should serve the built widget file.

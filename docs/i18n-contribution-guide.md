# i18n Contribution Guide: Adding New Locales

This guide explains how to add a new language to the Stargate hosted checkout page using `next-intl`.

## Overview

The Stargate frontend uses `next-intl` for internationalization (i18n). The hosted checkout page supports multiple languages, and new locales can be added by following this process.

## Prerequisites

- Familiarity with the project structure
- Access to the translation files
- Understanding of the target language

## Step-by-Step Process

### 1. Create Translation Files

Translation files are stored in the `messages` directory. Create a new JSON file for your locale:

```
messages/
├── en.json          (English)
├── es.json          (Spanish)
├── fr.json          (French)
└── [locale].json    (Your new locale)
```

**File naming convention**: Use the ISO 639-1 language code (e.g., `de` for German, `ja` for Japanese, `zh` for Chinese).

### 2. Structure Translation Files

Each translation file should follow this structure:

```json
{
  "checkout": {
    "title": "Secure Payment",
    "description": "Complete your payment securely",
    "amount": "Amount",
    "currency": "Currency",
    "submit": "Pay Now",
    "cancel": "Cancel"
  },
  "errors": {
    "invalid_amount": "Please enter a valid amount",
    "payment_failed": "Payment failed. Please try again.",
    "network_error": "Network error. Please check your connection."
  },
  "success": {
    "title": "Payment Successful",
    "message": "Your payment has been processed successfully."
  }
}
```

### 3. Update Configuration

Update the `next-intl` configuration to include your new locale:

**File**: `next.config.mjs` or `i18n.config.ts`

```typescript
export const locales = ['en', 'es', 'fr', 'de']; // Add your locale here
export const defaultLocale = 'en';
```

### 4. Update Middleware

Ensure the middleware recognizes your new locale:

**File**: `middleware.ts`

The middleware should automatically detect and route requests to the correct locale based on the `locales` array in your configuration.

### 5. Test Your Locale

#### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the checkout page with your locale:
   ```
   http://localhost:3000/[locale]/pay/[invoice-id]
   ```

3. Verify that:
   - All text displays correctly in your language
   - No missing translation keys
   - Special characters and formatting are preserved
   - RTL languages (if applicable) display correctly

#### Validation

Run the type checker to ensure all translation keys are valid:

```bash
npm run typecheck
```

### 6. Add Locale Selector (Optional)

If you want users to be able to select the language, update the locale selector component:

**File**: `components/payment/LocaleSelector.tsx` (or similar)

```typescript
const locales = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, // Add your locale
];
```

### 7. Submit Your Contribution

1. Create a new branch:
   ```bash
   git checkout -b feat/i18n-[locale]
   ```

2. Commit your changes:
   ```bash
   git add messages/[locale].json next.config.mjs
   git commit -m "feat(i18n): Add [locale] language support"
   ```

3. Push and create a pull request:
   ```bash
   git push origin feat/i18n-[locale]
   ```

## Translation Best Practices

### Key Guidelines

- **Consistency**: Use consistent terminology across all translation files
- **Context**: Provide context for translators when strings are ambiguous
- **Length**: Keep translations concise; some languages require more space
- **Formatting**: Preserve HTML tags and special characters
- **Pluralization**: Handle plural forms correctly for your language
- **Date/Time**: Use locale-specific date and time formats

### Example: Handling Pluralization

```json
{
  "items": {
    "one": "1 item",
    "other": "{count} items"
  }
}
```

### Example: Handling Variables

```json
{
  "greeting": "Hello, {name}!",
  "payment_amount": "You are paying {amount} {currency}"
}
```

## Common Issues and Solutions

### Issue: Missing Translation Keys

**Problem**: Some keys are not translated in your locale file.

**Solution**: 
- Compare your translation file with the English version
- Add any missing keys
- Run `npm run typecheck` to identify missing keys

### Issue: Special Characters Not Displaying

**Problem**: Accented characters or special symbols appear as boxes.

**Solution**:
- Ensure your JSON file is saved as UTF-8
- Verify the character encoding in your editor
- Check that the server is configured to serve UTF-8 content

### Issue: RTL Language Display Issues

**Problem**: Right-to-left languages display incorrectly.

**Solution**:
- Add `dir="rtl"` to the HTML element for RTL locales
- Update CSS to support RTL layout
- Test with a browser's RTL extension

## Supported Locales

Currently supported locales:
- `en` - English
- `es` - Spanish
- `fr` - French

To add a new locale, follow the steps above and submit a pull request.

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [Unicode CLDR](http://cldr.unicode.org/)

## Questions?

If you have questions about adding a new locale, please:
1. Check the existing translation files for examples
2. Review the `next-intl` documentation
3. Open an issue on GitHub with your question

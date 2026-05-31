# Figma Design Token Export Guide

This guide explains how to export design tokens from Figma and sync them with the Tailwind config and CSS variables.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Exporting Tokens from Figma](#exporting-tokens-from-figma)
3. [Token Structure](#token-structure)
4. [Syncing with Tailwind Config](#syncing-with-tailwind-config)
5. [Syncing with CSS Variables](#syncing-with-css-variables)
6. [Automation](#automation)
7. [Best Practices](#best-practices)

---

## Prerequisites

### Figma Setup

1. **Install Figma Tokens Plugin**:
   - Open Figma
   - Go to Assets → Plugins → Browse plugins
   - Search for "Tokens Studio for Figma"
   - Click "Install"

2. **Figma File Structure**:
   - Create a dedicated "Design Tokens" file in your Figma workspace
   - Organize tokens by category: Colors, Typography, Spacing, Shadows, etc.

### Local Setup

1. **Install Dependencies**:
   ```bash
   npm install --save-dev @tokens-studio/sd-transforms
   npm install --save-dev style-dictionary
   ```

2. **Project Structure**:
   ```
   stargate-frontend/
   ├── tokens/
   │   ├── figma-tokens.json      # Exported from Figma
   │   ├── config.json            # Style Dictionary config
   │   └── output/
   │       ├── tailwind.js        # Generated Tailwind config
   │       └── css-variables.css  # Generated CSS variables
   ├── tailwind.config.ts
   └── app/globals.css
   ```

---

## Exporting Tokens from Figma

### Step 1: Set Up Token Groups

In Figma Tokens plugin:

1. Create token groups for each category:
   - `colors` - Brand and semantic colors
   - `typography` - Font families, sizes, weights
   - `spacing` - Padding, margin, gap values
   - `shadows` - Box shadows
   - `borderRadius` - Border radius values
   - `breakpoints` - Responsive breakpoints

### Step 2: Define Tokens

Example color tokens:

```json
{
  "colors": {
    "primary": {
      "50": { "value": "#f0f9ff", "type": "color" },
      "100": { "value": "#e0f2fe", "type": "color" },
      "500": { "value": "#0ea5e9", "type": "color" },
      "900": { "value": "#0c2d6b", "type": "color" }
    },
    "semantic": {
      "success": { "value": "{colors.primary.500}", "type": "color" },
      "error": { "value": "#ef4444", "type": "color" },
      "warning": { "value": "#f59e0b", "type": "color" }
    }
  }
}
```

### Step 3: Export from Figma

1. In Figma Tokens plugin, click "Export"
2. Choose export format: **JSON**
3. Copy the JSON output
4. Save to `tokens/figma-tokens.json`

### Step 4: Validate JSON

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('tokens/figma-tokens.json')))"
```

---

## Token Structure

### Naming Convention

Use dot notation for nested tokens:

```
{category}.{subcategory}.{variant}
```

Examples:
- `colors.primary.500`
- `typography.heading.lg`
- `spacing.padding.md`
- `shadows.elevation.high`

### Token Types

| Type | Example | Usage |
|------|---------|-------|
| `color` | `#0ea5e9` | Colors |
| `sizing` | `16px` | Width, height |
| `spacing` | `8px` | Padding, margin, gap |
| `typography` | Font family, size, weight | Text styles |
| `shadow` | `0 4px 6px rgba(0,0,0,0.1)` | Box shadows |
| `borderRadius` | `8px` | Border radius |

---

## Syncing with Tailwind Config

### Step 1: Create Style Dictionary Config

Create `tokens/config.json`:

```json
{
  "source": ["tokens/figma-tokens.json"],
  "platforms": {
    "tailwind": {
      "transformGroup": "js",
      "buildPath": "tokens/output/",
      "files": [
        {
          "destination": "tailwind.js",
          "format": "javascript/module-exports",
          "filter": {
            "attributes": {
              "category": ["colors", "spacing", "typography", "shadows", "borderRadius"]
            }
          }
        }
      ]
    }
  }
}
```

### Step 2: Generate Tailwind Tokens

```bash
npx style-dictionary build --config tokens/config.json
```

This generates `tokens/output/tailwind.js`:

```javascript
export const tokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      900: '#0c2d6b'
    },
    semantic: {
      success: '#0ea5e9',
      error: '#ef4444',
      warning: '#f59e0b'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
};
```

### Step 3: Update Tailwind Config

Update `tailwind.config.ts`:

```typescript
import { tokens } from './tokens/output/tailwind.js';

export default {
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontSize: tokens.typography?.fontSize,
      boxShadow: tokens.shadows,
      borderRadius: tokens.borderRadius,
    },
  },
  plugins: [],
};
```

### Step 4: Use in Components

```tsx
// Now you can use Tailwind classes with design tokens
export function Button() {
  return (
    <button className="bg-primary-500 text-white px-md py-sm rounded-lg shadow-elevation-high">
      Click me
    </button>
  );
}
```

---

## Syncing with CSS Variables

### Step 1: Update Style Dictionary Config

Modify `tokens/config.json` to include CSS output:

```json
{
  "source": ["tokens/figma-tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "tokens/output/",
      "files": [
        {
          "destination": "css-variables.css",
          "format": "css/variables",
          "selector": ":root"
        }
      ]
    }
  }
}
```

### Step 2: Generate CSS Variables

```bash
npx style-dictionary build --config tokens/config.json
```

This generates `tokens/output/css-variables.css`:

```css
:root {
  --colors-primary-50: #f0f9ff;
  --colors-primary-100: #e0f2fe;
  --colors-primary-500: #0ea5e9;
  --colors-primary-900: #0c2d6b;
  --colors-semantic-success: #0ea5e9;
  --colors-semantic-error: #ef4444;
  --colors-semantic-warning: #f59e0b;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### Step 3: Import in Global CSS

Update `app/globals.css`:

```css
@import './tokens/output/css-variables.css';

body {
  background-color: var(--colors-background);
  color: var(--colors-text);
  font-family: var(--typography-body-font-family);
}

.button {
  background-color: var(--colors-primary-500);
  padding: var(--spacing-md);
  border-radius: var(--spacing-sm);
}
```

### Step 4: Use in Components

```tsx
export function Card() {
  return (
    <div style={{
      backgroundColor: 'var(--colors-background)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--spacing-sm)',
      boxShadow: 'var(--shadows-elevation-high)'
    }}>
      Content
    </div>
  );
}
```

---

## Automation

### Add NPM Script

Update `package.json`:

```json
{
  "scripts": {
    "tokens:export": "style-dictionary build --config tokens/config.json",
    "tokens:watch": "style-dictionary build --config tokens/config.json --watch"
  }
}
```

### GitHub Actions Workflow

Create `.github/workflows/sync-tokens.yml`:

```yaml
name: Sync Design Tokens

on:
  workflow_dispatch:
  schedule:
    - cron: '0 9 * * 1' # Weekly on Monday at 9 AM

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Export tokens from Figma
        run: npm run tokens:export
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
      
      - name: Commit changes
        run: |
          git config user.name "Token Bot"
          git config user.email "bot@stargate.example.com"
          git add tokens/output/
          git commit -m "chore: sync design tokens from Figma" || true
          git push
```

### Manual Export Script

Create `scripts/export-tokens.mjs`:

```javascript
import fetch from 'node-fetch';
import fs from 'fs';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = 'your-figma-file-id';

async function exportTokens() {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_ID}/variables/local`,
    {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    }
  );

  const data = await response.json();
  fs.writeFileSync('tokens/figma-tokens.json', JSON.stringify(data, null, 2));
  console.log('✓ Tokens exported successfully');
}

exportTokens().catch(console.error);
```

---

## Best Practices

### 1. Version Control

- Commit generated files (`tailwind.js`, `css-variables.css`)
- Keep `figma-tokens.json` in version control
- Review token changes in pull requests

### 2. Naming Consistency

- Use kebab-case for CSS variables: `--colors-primary-500`
- Use camelCase for JavaScript: `colorsPrimary500`
- Use dot notation in Figma: `colors.primary.500`

### 3. Token Organization

```
colors/
  ├── primary/
  │   ├── 50, 100, 200, ..., 900
  ├── semantic/
  │   ├── success, error, warning
  ├── neutral/
  │   ├── background, surface, text

typography/
  ├── heading/
  │   ├── lg, md, sm
  ├── body/
  │   ├── lg, md, sm

spacing/
  ├── xs, sm, md, lg, xl, 2xl
```

### 4. Documentation

- Document token purpose and usage
- Include examples in Figma file
- Keep this guide updated

### 5. Testing

```bash
# Validate generated files
npm run tokens:export
npm run build
npm run typecheck
```

### 6. Dark Mode Support

Define separate token sets for light and dark modes:

```json
{
  "colors": {
    "background": {
      "light": { "value": "#ffffff", "type": "color" },
      "dark": { "value": "#1a1a1a", "type": "color" }
    }
  }
}
```

Then use CSS variables with media queries:

```css
:root {
  --colors-background: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --colors-background: #1a1a1a;
  }
}
```

---

## Troubleshooting

### Tokens Not Updating

1. Verify `figma-tokens.json` is exported correctly
2. Check Style Dictionary config syntax
3. Run `npm run tokens:export` manually
4. Clear build cache: `rm -rf .next`

### CSS Variables Not Applied

1. Verify `css-variables.css` is imported in `globals.css`
2. Check CSS variable names match usage
3. Inspect element in DevTools to see computed styles
4. Verify no CSS specificity conflicts

### Tailwind Classes Not Working

1. Verify `tailwind.config.ts` imports tokens correctly
2. Run `npm run build` to regenerate Tailwind CSS
3. Check for typos in class names
4. Verify tokens are exported to `tokens/output/tailwind.js`

---

## Resources

- [Tokens Studio for Figma](https://tokens.studio/)
- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

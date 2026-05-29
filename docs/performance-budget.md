# Performance Budget

This document defines Core Web Vitals targets for the Stargate frontend and explains how they are measured in CI.

## Core Web Vitals Targets

The Stargate frontend aims to maintain excellent performance across all pages. The following targets are based on Google's Core Web Vitals recommendations:

### 1. Largest Contentful Paint (LCP)

**Target**: ≤ 2.5 seconds

**Definition**: The time when the largest content element becomes visible to the user.

**Why it matters**: LCP directly impacts perceived page load speed. Users expect pages to be interactive within 2.5 seconds.

**Optimization strategies**:
- Optimize images (use WebP, lazy loading)
- Minimize JavaScript bundle size
- Use code splitting for route-based chunks
- Implement server-side rendering (SSR) where applicable
- Cache static assets aggressively

### 2. Cumulative Layout Shift (CLS)

**Target**: ≤ 0.1

**Definition**: The sum of all unexpected layout shifts that occur during the page's lifetime.

**Why it matters**: Layout shifts create a poor user experience, especially on payment pages where users need to click buttons.

**Optimization strategies**:
- Reserve space for images and ads before they load
- Avoid inserting content above existing content
- Use `transform` and `opacity` for animations instead of layout-affecting properties
- Set explicit dimensions for media elements
- Use `font-display: swap` for web fonts

### 3. First Input Delay (FID) / Interaction to Next Paint (INP)

**Target**: ≤ 100ms (FID) / ≤ 200ms (INP)

**Definition**: 
- **FID**: Time from user interaction to browser response
- **INP**: Time from interaction to visual feedback (newer metric replacing FID)

**Why it matters**: Users expect immediate feedback when interacting with the page. Delays create frustration.

**Optimization strategies**:
- Break up long JavaScript tasks (> 50ms)
- Use Web Workers for heavy computations
- Defer non-critical JavaScript
- Optimize event handlers
- Use `requestIdleCallback` for non-urgent work

## Measurement in CI

### Automated Performance Testing

Performance metrics are measured in the CI pipeline using Lighthouse and Playwright:

**File**: `.github/workflows/frontend-ci.yml`

#### Lighthouse Audits

Lighthouse runs automated audits on key pages:

```bash
npm run lighthouse
```

**Pages audited**:
- `/` (Marketing site)
- `/dashboard` (Merchant dashboard)
- `/pay/[id]` (Payment page)

**Metrics collected**:
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)
- Performance Score (0-100)

#### Playwright Performance Tests

Playwright runs performance tests to measure real-world metrics:

```bash
npm run test:performance
```

**Tests include**:
- Page load time
- Time to interactive (TTI)
- First paint (FP)
- First contentful paint (FCP)

### CI Configuration

The CI pipeline fails if performance metrics exceed thresholds:

```yaml
# Example CI configuration
- name: Run Lighthouse
  run: npm run lighthouse
  
- name: Check Performance Budgets
  run: |
    if [ $(lighthouse-score) -lt 90 ]; then
      echo "Performance score below 90"
      exit 1
    fi
```

### Local Performance Testing

Developers can test performance locally before committing:

```bash
# Run Lighthouse audit
npm run lighthouse

# Run performance tests
npm run test:performance

# Build and analyze bundle size
npm run build
npm run analyze
```

## Performance Monitoring

### Real User Monitoring (RUM)

In production, performance metrics are collected from real users:

**Metrics tracked**:
- Page load time
- Time to interactive
- Core Web Vitals (LCP, CLS, FID/INP)
- JavaScript errors
- API response times

**Tools**:
- Web Vitals library
- Sentry for error tracking
- Custom analytics

### Alerting

Performance regressions trigger alerts:

- **LCP > 3s**: Warning
- **LCP > 4s**: Critical
- **CLS > 0.15**: Warning
- **CLS > 0.25**: Critical
- **INP > 300ms**: Warning
- **INP > 500ms**: Critical

## Performance Budget Breakdown

### JavaScript Bundle Size

**Target**: ≤ 200KB (gzipped)

**Current**: ~150KB (gzipped)

**Breakdown**:
- Next.js framework: ~50KB
- React: ~40KB
- UI components: ~30KB
- Utilities and hooks: ~20KB
- Third-party libraries: ~10KB

### CSS Bundle Size

**Target**: ≤ 50KB (gzipped)

**Current**: ~35KB (gzipped)

**Breakdown**:
- Tailwind CSS: ~30KB
- Custom styles: ~5KB

### Image Optimization

**Target**: All images optimized and lazy-loaded

**Guidelines**:
- Use WebP format with fallbacks
- Compress images to < 100KB
- Lazy load images below the fold
- Use responsive images with `srcset`

## Optimization Checklist

Before deploying to production, verify:

- [ ] Lighthouse performance score ≥ 90
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1
- [ ] INP ≤ 200ms
- [ ] JavaScript bundle ≤ 200KB (gzipped)
- [ ] CSS bundle ≤ 50KB (gzipped)
- [ ] All images optimized and lazy-loaded
- [ ] No console errors or warnings
- [ ] No layout shifts during page load
- [ ] All interactive elements respond within 100ms

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Next.js Performance](https://nextjs.org/learn/seo/web-performance)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Performance Budget Calculator](https://www.performancebudget.io/)

## Continuous Improvement

Performance is an ongoing process. Regular reviews and optimizations help maintain excellent user experience:

1. **Monthly reviews**: Analyze performance metrics and identify trends
2. **Quarterly audits**: Deep dive into performance bottlenecks
3. **User feedback**: Incorporate user feedback on perceived performance
4. **Technology updates**: Stay current with performance best practices

## Questions?

For questions about performance budgets or optimization strategies:
1. Review the resources above
2. Check existing performance tests
3. Open an issue on GitHub with your question

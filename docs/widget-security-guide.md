# Widget SDK Security Guide

This guide covers security best practices for integrating the Stargate Widget SDK into your application.

## Table of Contents

1. [Content Security Policy (CSP)](#content-security-policy-csp)
2. [postMessage Origin Validation](#postmessage-origin-validation)
3. [XSS Prevention](#xss-prevention)
4. [Iframe Sandboxing](#iframe-sandboxing)
5. [Data Handling](#data-handling)
6. [Common Vulnerabilities](#common-vulnerabilities)

---

## Content Security Policy (CSP)

The hosted checkout page enforces strict CSP headers to prevent injection attacks.

### Required CSP Headers

When hosting the widget, ensure these CSP directives are set:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://cdn.stargate.example.com;
  style-src 'self' 'unsafe-inline';
  frame-ancestors 'self' https://*.example.com;
  connect-src 'self' https://api.stargate.example.com;
  img-src 'self' data: https:;
  font-src 'self' data:;
```

### For Integrators

If embedding the widget in your application:

1. **Allow widget origin in `frame-ancestors`**:
   ```
   frame-ancestors 'self' https://widget.stargate.example.com;
   ```

2. **Whitelist widget scripts in `script-src`**:
   ```
   script-src 'self' https://widget.stargate.example.com;
   ```

3. **Allow widget API calls in `connect-src`**:
   ```
   connect-src 'self' https://api.stargate.example.com;
   ```

### Testing CSP

Use browser DevTools to verify CSP violations:
- Open DevTools → Console
- Look for CSP violation warnings
- Adjust headers if legitimate resources are blocked

---

## postMessage Origin Validation

The widget communicates with parent pages via `postMessage`. Always validate the origin to prevent malicious scripts from intercepting messages.

### Receiving Messages from Widget

```javascript
window.addEventListener('message', (event) => {
  // ✅ ALWAYS validate the origin
  if (event.origin !== 'https://widget.stargate.example.com') {
    console.warn('Ignoring message from untrusted origin:', event.origin);
    return;
  }

  // Validate message type
  if (!event.data || typeof event.data !== 'object') {
    return;
  }

  const { type, payload } = event.data;

  switch (type) {
    case 'STARGATE_LOADED':
      console.log('Widget loaded successfully');
      break;
    case 'STARGATE_PAID':
      console.log('Payment completed:', payload);
      // Update your UI, redirect user, etc.
      break;
    case 'STARGATE_ERROR':
      console.error('Payment error:', payload);
      break;
    default:
      console.warn('Unknown message type:', type);
  }
});
```

### Sending Messages to Widget

```javascript
const widgetFrame = document.getElementById('stargate-widget');

// ✅ Always specify the exact origin
widgetFrame.contentWindow.postMessage(
  {
    type: 'CONFIGURE',
    payload: { theme: 'dark' }
  },
  'https://widget.stargate.example.com' // Exact origin, not '*'
);
```

### Common Mistakes

❌ **Don't use wildcard origin**:
```javascript
// INSECURE - allows any origin
window.postMessage(data, '*');
```

❌ **Don't skip origin validation**:
```javascript
// INSECURE - accepts messages from any source
window.addEventListener('message', (event) => {
  processPayment(event.data); // No origin check!
});
```

---

## XSS Prevention

### Input Sanitization

Never pass unsanitized user input to the widget:

```javascript
// ❌ INSECURE
const userInput = req.query.description;
widget.postMessage({
  type: 'SET_DESCRIPTION',
  payload: userInput // Could contain malicious scripts
}, origin);

// ✅ SECURE
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.clean(userInput);
widget.postMessage({
  type: 'SET_DESCRIPTION',
  payload: sanitized
}, origin);
```

### Avoid innerHTML with Dynamic Content

```javascript
// ❌ INSECURE
document.getElementById('payment-info').innerHTML = userProvidedHTML;

// ✅ SECURE
const div = document.createElement('div');
div.textContent = userProvidedText; // textContent escapes HTML
document.getElementById('payment-info').appendChild(div);
```

### Template Literals

```javascript
// ❌ INSECURE - if userInput contains HTML
const html = `<div>${userInput}</div>`;
container.innerHTML = html;

// ✅ SECURE - use textContent or a template engine with auto-escaping
const div = document.createElement('div');
div.textContent = userInput;
container.appendChild(div);
```

---

## Iframe Sandboxing

When embedding the widget in an iframe, use the `sandbox` attribute to restrict capabilities:

```html
<!-- ✅ SECURE - restrictive sandbox -->
<iframe
  id="stargate-widget"
  src="https://widget.stargate.example.com/pay/invoice-123"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  title="Stargate Payment Widget"
></iframe>
```

### Sandbox Attributes Explained

| Attribute | Purpose |
|-----------|---------|
| `allow-same-origin` | Allows widget to access its own origin (required for API calls) |
| `allow-scripts` | Allows JavaScript execution (required for widget functionality) |
| `allow-forms` | Allows form submission (required for payment forms) |
| `allow-popups` | Allows wallet popups (required for Freighter/Albedo) |

### Avoid These

❌ **Don't use `allow-top-navigation`** - prevents widget from breaking out of iframe
❌ **Don't use `allow-pointer-lock`** - unnecessary and risky
❌ **Don't omit sandbox entirely** - removes all protections

---

## Data Handling

### Sensitive Data

Never log or store sensitive payment information:

```javascript
// ❌ INSECURE
console.log('Payment data:', paymentData); // Logs to browser console

// ✅ SECURE
console.log('Payment processed'); // Log only non-sensitive info
// Store sensitive data server-side only
```

### HTTPS Only

Always use HTTPS when:
- Hosting the widget
- Communicating with the API
- Embedding the widget in your application

```javascript
// ❌ INSECURE
const widgetUrl = 'http://widget.stargate.example.com'; // HTTP

// ✅ SECURE
const widgetUrl = 'https://widget.stargate.example.com'; // HTTPS
```

### API Keys

Never expose API keys in client-side code:

```javascript
// ❌ INSECURE - API key visible in browser
const apiKey = 'sk_live_abc123';
fetch('https://api.stargate.example.com/payments', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// ✅ SECURE - API key on server only
// Client calls your backend, which calls Stargate API
fetch('/api/payments', {
  method: 'POST',
  body: JSON.stringify(paymentData)
});
```

---

## Common Vulnerabilities

### 1. Man-in-the-Middle (MITM) Attacks

**Risk**: Attacker intercepts communication between widget and API

**Mitigation**:
- Always use HTTPS
- Validate SSL certificates
- Use HSTS headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 2. Clickjacking

**Risk**: Attacker overlays invisible iframe to trick users into clicking

**Mitigation**:
- Use `X-Frame-Options` header: `X-Frame-Options: SAMEORIGIN`
- Use CSP `frame-ancestors` directive
- Validate user intent before processing payments

### 3. Cross-Site Request Forgery (CSRF)

**Risk**: Attacker tricks user into making unintended requests

**Mitigation**:
- Use CSRF tokens for state-changing operations
- Validate `Origin` and `Referer` headers
- Use `SameSite` cookie attribute: `SameSite=Strict`

### 4. Malicious Widget Injection

**Risk**: Attacker injects fake widget to steal payment data

**Mitigation**:
- Always load widget from official Stargate domain
- Verify widget integrity using Subresource Integrity (SRI):
  ```html
  <script
    src="https://widget.stargate.example.com/sdk.js"
    integrity="sha384-abc123..."
    crossorigin="anonymous"
  ></script>
  ```

### 5. Session Hijacking

**Risk**: Attacker steals session tokens to impersonate user

**Mitigation**:
- Use secure, httpOnly cookies: `Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict`
- Implement session timeout
- Validate session on every request
- Use HTTPS only

---

## Security Checklist

- [ ] CSP headers configured correctly
- [ ] postMessage origin validation implemented
- [ ] All user input sanitized
- [ ] HTTPS enforced everywhere
- [ ] API keys stored server-side only
- [ ] Iframe sandbox attributes set
- [ ] X-Frame-Options header configured
- [ ] HSTS header enabled
- [ ] SameSite cookie attribute set
- [ ] Subresource Integrity (SRI) enabled for external scripts
- [ ] Regular security audits scheduled
- [ ] Dependencies kept up-to-date

---

## Reporting Security Issues

If you discover a security vulnerability, please email security@stargate.example.com instead of using the public issue tracker.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [postMessage Security](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

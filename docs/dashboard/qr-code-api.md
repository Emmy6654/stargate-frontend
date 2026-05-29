# Payment Link QR Code Generation

This document explains how Stargate generates QR codes for payment links, the available size parameters, and how to embed QR codes in third-party applications.

---

## Overview

Every Stargate payment link has a corresponding QR code that encodes the hosted checkout URL. Scanning the QR code takes the payer directly to the checkout page where they can connect a Stellar wallet and complete the payment.

QR codes are generated client-side using the [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) library and can be exported as **PNG** or **SVG** from the dashboard Share modal. For programmatic use, the checkout URL itself is the QR code payload — any standard QR code library can encode it.

---

## Checkout URL format

The URL encoded in every payment link QR code follows this pattern:

```
https://<checkout-domain>/pay/<invoice-id>
```

| Segment | Description |
|---------|-------------|
| `checkout-domain` | Your Stargate checkout domain (e.g., `checkout.stargate.dev` or your custom domain). |
| `invoice-id` | The unique invoice identifier returned when the invoice is created (e.g., `inv_abc123`). |

**Example:**

```
https://checkout.stargate.dev/pay/inv_abc123
```

---

## Generating a QR code via the dashboard

### Share modal

1. Go to **Payment Links** (`/dashboard/payment-links`).
2. Click **Share** on any payment link card.
3. The Share modal renders a **180 × 180 px** QR code encoding the checkout URL.
4. Use the download buttons to export:
   - **PNG** — raster image, suitable for print and most digital uses.
   - **SVG** — scalable vector, ideal for high-DPI displays and design tools.

### Invoice detail page

The invoice detail page (`/dashboard/invoices/[id]`) also renders a **240 × 240 px** QR code of the payment URL directly on the page, alongside a **Copy payment URL** button.

---

## Size parameters

The QR code size is controlled by the `size` prop (in pixels) passed to the rendering component. The dashboard uses these defaults:

| Context | Size | Format |
|---------|------|--------|
| Share modal (display) | 180 × 180 px | Canvas (PNG export) |
| Share modal (download) | 180 × 180 px | SVG export |
| Invoice detail page | 240 × 240 px | SVG |
| Stellar address QR (Settings) | 180 × 180 px | SVG |

When generating QR codes programmatically, choose a size based on the intended use:

| Use case | Recommended size |
|----------|-----------------|
| Email / web thumbnail | 150 – 200 px |
| Printed receipt or flyer | 300 – 400 px (minimum 2 cm physical size) |
| Large-format print / poster | 600 px+ |
| Favicon / icon | Not recommended — QR codes require sufficient resolution to scan. |

> **Tip:** Always test scannability at the intended display size. A QR code that is too small or printed at low DPI may fail to scan.

---

## Error correction level

The dashboard uses error correction level **M** (Medium, ~15% data recovery). This is a good balance between data density and fault tolerance.

| Level | Recovery capacity | Use when |
|-------|------------------|----------|
| `L` | ~7% | Clean digital displays only. |
| `M` | ~15% | General use — dashboard default. |
| `Q` | ~25% | Printed materials that may get dirty or worn. |
| `H` | ~30% | Logos overlaid on the QR code, or harsh environments. |

---

## Embedding QR codes in third-party apps

### Option 1 — Encode the checkout URL yourself

The simplest integration: take the checkout URL from the Stargate API and pass it to any QR code library in your stack.

**Node.js (server-side)**

```javascript
const QRCode = require('qrcode');

const checkoutUrl = 'https://checkout.stargate.dev/pay/inv_abc123';

// Generate a PNG data URL
const dataUrl = await QRCode.toDataURL(checkoutUrl, {
  width: 300,
  errorCorrectionLevel: 'M',
});

// Or write directly to a file
await QRCode.toFile('./payment-qr.png', checkoutUrl, {
  width: 300,
  errorCorrectionLevel: 'M',
});
```

**Python**

```python
import qrcode

checkout_url = "https://checkout.stargate.dev/pay/inv_abc123"

img = qrcode.make(checkout_url)
img.save("payment-qr.png")
```

**React (client-side)**

```tsx
import { QRCodeSVG } from 'qrcode.react';

export function PaymentQR({ invoiceId }: { invoiceId: string }) {
  const checkoutUrl = `https://checkout.stargate.dev/pay/${invoiceId}`;

  return (
    <QRCodeSVG
      value={checkoutUrl}
      size={240}
      level="M"
      includeMargin
    />
  );
}
```

### Option 2 — Download from the dashboard and embed statically

1. Open the Share modal for the payment link.
2. Click **Download SVG** or **Download PNG**.
3. Host the downloaded file on your CDN or embed it directly in your app, email template, or printed material.

This approach is best for fixed-amount, long-lived payment links (e.g., a donation page or a product listing).

### Option 3 — Retrieve the checkout URL via the API and generate on-the-fly

Use the Stargate REST API to fetch the invoice and extract the `payment_url` field, then generate the QR code dynamically.

**Fetch the invoice**

```http
GET /invoices/{id}
Authorization: Bearer <api_key>
```

**Response (excerpt)**

```json
{
  "id": "inv_abc123",
  "payment_url": "https://checkout.stargate.dev/pay/inv_abc123",
  "gross_usdc": "49.00",
  "status": "pending",
  "expires_at": "2026-05-30T12:00:00Z"
}
```

**Generate the QR code from `payment_url`**

```javascript
const response = await fetch('https://api.stargate.dev/invoices/inv_abc123', {
  headers: { Authorization: `Bearer ${process.env.STARGATE_API_KEY}` },
});
const invoice = await response.json();

// Pass invoice.payment_url to your QR code library
const qrDataUrl = await QRCode.toDataURL(invoice.payment_url, { width: 300 });
```

---

## Stellar URI QR codes

The Settings page generates a different type of QR code for your **Stellar settlement address**. This QR code encodes a `web+stellar:` URI rather than a checkout URL:

```
web+stellar:pay?destination=G...
```

This format is understood by Stellar-compatible wallets (e.g., Lobstr, Solar) and allows anyone to initiate a direct USDC transfer to your address by scanning the code. It is separate from the payment link QR codes described above and is not used in the hosted checkout flow.

---

## Security considerations

- **Always verify payments on the backend.** A QR code scan initiates the checkout flow but does not guarantee payment. Listen for the `invoice.paid` webhook event or poll the invoice status endpoint to confirm settlement.
- **QR codes do not expire on their own.** The underlying invoice has an `expires_at` timestamp. Once an invoice expires, the checkout page will show an expiry message even if the QR code is still being scanned.
- **Do not embed API keys in QR codes.** QR codes should only encode the public checkout URL — never credentials or signed tokens.

---

## Related resources

- [Dashboard User Guide](./guide.md) — full walkthrough of the Payment Links page and Share modal.
- [Widget SDK — postMessage Events](../widget-sdk.md) — events emitted by the embedded checkout widget.
- [Widget Integration Guide](../widget/integration.md) — embedding the checkout widget in your own page.
- [Theming & Branding](../theming-and-branding.md) — customising the checkout page appearance.

# Merchant Dashboard User Guide

This guide covers every section of the Stargate merchant dashboard — from reviewing transactions and creating payment links to managing your team, configuring webhooks, and updating account settings.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Transactions](#2-transactions)
3. [Invoices](#3-invoices)
4. [Payment Links](#4-payment-links)
5. [Scheduled Payments](#5-scheduled-payments)
6. [Revenue Analytics](#6-revenue-analytics)
7. [Wallets](#7-wallets)
8. [Disputes](#8-disputes)
9. [Team](#9-team)
10. [Webhooks](#10-webhooks)
11. [Settings](#11-settings)

---

## 1. Overview

The dashboard home page (`/dashboard`) gives you a snapshot of your account at a glance.

| Widget | Description |
|--------|-------------|
| Onboarding checklist | Step-by-step tasks to complete your account setup. Disappears once all steps are done. |
| Stats cards | Total revenue, paid invoices, pending invoices, and conversion rate for the current period. |
| Recent invoices | The 10 most recent invoices with status badges and quick links to each detail page. |
| Balance widget | Your current USDC settlement balance and the next scheduled payout date. |

---

## 2. Transactions

**Path:** `/dashboard/transactions`

The Transactions page shows every invoice payment that has been processed through your account.

### Columns

| Column | Description |
|--------|-------------|
| Transaction | The unique invoice ID (monospace). |
| Amount | Gross amount the buyer paid in USDC. |
| Net | Amount after Stargate fees. |
| Status | Current payment status (see badge reference below). |
| Created | Date and time the invoice was created. |
| Action | Link to the full invoice detail page. |

### Filtering and export

- Use the **search bar** to filter by invoice ID, reference, or status keyword.
- Click **Export** (top-right) to download the current view as a CSV file.

### Status badges

| Status | Meaning |
|--------|---------|
| `pending` | Invoice created, awaiting payment. |
| `paid` | Payment confirmed on the Stellar network. |
| `expired` | Invoice passed its expiry time without payment. |
| `cancelled` | Invoice was manually cancelled. |
| `settlement_ready` | Funds are queued for the next payout cycle. |

---

## 3. Invoices

**Path:** `/dashboard/invoices`

Invoices are the core billing primitive in Stargate. Each invoice maps to a unique Stellar USDC payment address and generates a hosted checkout URL.

### Listing invoices

- **Search** by invoice ID or description using the search field.
- **Filter by status** using the dropdown (`All`, `Pending`, `Paid`, `Expired`, `Cancelled`).
- Results are **paginated** — use the Previous / Next buttons at the bottom to navigate pages.

### Creating an invoice

1. Click **Create Invoice** (top-right of the list page) or navigate to `/dashboard/invoices/new`.
2. Fill in the required fields:
   - **Amount** — the USDC amount the buyer will pay.
   - **Description** — a short label shown on the checkout page.
   - **Expiry** — how long the invoice stays open (default: 24 hours).
3. Click **Create**. You will be redirected to the invoice detail page.

### Invoice detail page

**Path:** `/dashboard/invoices/[id]`

The detail page shows:

- Full invoice metadata (ID, amount, fee, net, status, timestamps).
- A **QR code** of the payment URL — buyers can scan it directly.
- A **Copy payment URL** button.
- A **timeline** of all status changes with timestamps.
- A **Refund** button (visible on paid invoices).
- A **Cancel** button (visible on pending invoices).

---

## 4. Payment Links

**Path:** `/dashboard/payment-links`

Payment links are shareable, hosted checkout pages backed by Stargate invoices. They are ideal for social media, email campaigns, and embedded buttons.

### Actions per link

| Button | What it does |
|--------|-------------|
| Copy | Copies the checkout URL to your clipboard. |
| Protect | Opens the **Password Protection** modal — set or clear a password that buyers must enter before seeing the checkout. |
| Share | Opens the **Share modal** with a QR code, a copy button, and PNG / SVG download options. |
| Open | Opens the live checkout page in a new tab. |

### Creating a payment link

1. Click **New link** (top-right).
2. Complete the invoice creation form (same fields as a regular invoice).
3. The resulting invoice URL is your payment link — share it anywhere.

### Password protection

When a password is set on a link, a lock icon appears on the card. Buyers who visit the URL are prompted to enter the password before the checkout loads. To remove protection, open the Protect modal and clear the password field.

### Sharing and QR codes

The Share modal provides:

- A **180 × 180 px QR code** (canvas-rendered) encoding the checkout URL.
- A **Copy** button for the raw URL.
- **Download PNG** — exports the QR code as a raster image.
- **Download SVG** — exports the QR code as a scalable vector graphic.

> For embedding QR codes in third-party apps, see the [QR Code API guide](./qr-code-api.md).

---

## 5. Scheduled Payments

**Path:** `/dashboard/scheduled-payments`

Schedule one-off or recurring outgoing USDC payments to any Stellar address.

### Scheduling a payment

1. Click **Schedule Payment**.
2. In the modal, enter:
   - **Recipient name** and **Stellar address** (`G...`).
   - **Amount** in USDC.
   - **Date** and **time** for the first execution.
   - **Recurrence** — One-off, Weekly, or Monthly.
3. Click **Save**. The payment appears in the list with a `pending` badge.

### Managing scheduled payments

- Each card shows the recipient, amount, next execution date/time, and recurrence type.
- Click the **trash icon** to delete a scheduled payment before it executes.

---

## 6. Revenue Analytics

**Path:** `/dashboard/revenue`

The Revenue page provides charts and KPIs to help you understand payment performance over time.

### Period selector

Switch between **Daily**, **Weekly**, and **Monthly** views using the buttons in the top-right corner. All charts and stats update to reflect the selected period.

### Stats cards

| Metric | Description |
|--------|-------------|
| Total Revenue | Cumulative USDC received in the period. |
| Total Transactions | Number of paid invoices. |
| Avg. Order Value | Mean payment amount per transaction. |
| Conversion Rate | Percentage of checkout page views that resulted in a completed payment. |

Each card shows a percentage change indicator (green = up, red = down) compared to the previous equivalent period.

### Charts

- **Revenue bar chart** — daily/weekly/monthly revenue bars for the selected period.
- **Top Payment Links** — ranked list of your highest-earning payment links by total volume.
- **Conversion Funnel** — four-stage funnel: Page Views → Started Checkout → Wallet Connected → Payment Completed.

---

## 7. Wallets

**Path:** `/dashboard/wallets`

The Wallets page shows your settlement balances and lets you configure payout destinations.

### Balance cards

Three balance cards are displayed by default:

| Currency | Network | Status |
|----------|---------|--------|
| USDC | Stellar | `live` |
| USD | Bank payout | `processing` |
| EUR | Bank payout | `pending` |

### Crypto settlement address

Enter your Stellar `G...` address in the input field to set where USDC settlements are sent. Click:

- **Verify ownership** — confirms you control the address.
- **Open explorer** — opens the address on Stellar Expert.

### Payout preview

The right-hand card shows:

- **Available** — current USDC balance ready for payout.
- **Network fee** — estimated Stellar transaction fee.
- **Estimated net** — what you will receive after fees.

Click **Start payout** to initiate an immediate settlement.

---

## 8. Disputes

**Path:** `/dashboard/disputes`

The Disputes page lets you track and respond to payment disputes raised by buyers.

### Summary cards

Four cards at the top show counts for: Total, Open, Under Review, and Resolved disputes.

### Filtering

Use the **status filter** (All, Open, Under Review, Resolved, Won, Lost) to narrow the list.

### Dispute table

Each row shows the dispute ID, amount, reason, status badge, customer email, and creation date. Click a row to open the dispute detail page.

### Dispute detail page

**Path:** `/dashboard/disputes/[id]`

- **Timeline** — chronological log of all dispute events.
- **Respond** — submit a written response to the dispute.
- **Upload evidence** — attach supporting files (screenshots, receipts, correspondence).

### Exporting disputes

Click **Export** (top-right) to download the current filtered list as a CSV file.

---

## 9. Team

**Path:** `/dashboard/team`

Invite teammates and assign roles to control what each person can do in the dashboard.

### Roles

| Role | Permissions |
|------|-------------|
| `owner` | Full access including billing and team management. |
| `admin` | Can invite members, manage settings, and view all data. |
| `developer` | API key access, webhook configuration, and read-only dashboard. |
| `finance` | View transactions, revenue, and export reports. |

### Inviting a member

1. Click **Invite Member** (visible to `owner` and `admin` roles).
2. Enter the invitee's email address and select a role.
3. Click **Send Invite**. The invitee receives an email with an activation link.

### Managing members

Each member card shows their name, email, role badge, and status (`active` or `pending`). Admins and owners can:

- **Change role** — update a member's role from the card menu.
- **Remove member** — revoke access immediately.
- **Resend invite** — re-send the activation email to a pending member.

---

## 10. Webhooks

**Path:** `/dashboard/webhooks`

Webhooks let Stargate push real-time event notifications to your server whenever something happens to an invoice or settlement.

### Registering an endpoint

1. Enter your **endpoint URL** (must be `https://`).
2. Optionally enter a **signing secret** — Stargate will include an HMAC-SHA256 signature header on every delivery so you can verify authenticity.
3. Select one or more **event types** to subscribe to:
   - `invoice.paid`
   - `invoice.expired`
   - `invoice.cancelled`
   - `settlement.completed`
4. Click **Register**.

### Delivery logs

Click **Logs** on any registered endpoint to expand the **Webhook Delivery Log** panel. Each entry shows the event type, HTTP response code, delivery timestamp, and a retry button for failed deliveries.

### Event simulator

Use the **Event simulator** card (right column) to send a test payload to any registered endpoint without triggering a real transaction. Select an event type and click **Send test event**.

### Verifying signatures

Every delivery includes an `X-Stargate-Signature` header. Verify it on your server:

```javascript
const crypto = require('crypto');

function verifySignature(rawBody, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Retry policy

Failed deliveries (non-2xx response or timeout) are retried up to **5 times** with exponential back-off: 1 min → 5 min → 30 min → 2 h → 8 h. You can also trigger a manual retry from the delivery log.

---

## 11. Settings

**Path:** `/dashboard/settings`

### Merchant settings

| Field | Description |
|-------|-------------|
| Merchant name | Display name shown on hosted checkout pages. |
| Stellar address | Your `G...` settlement address where USDC payouts are sent. |
| Settlement cadence | How often payouts are triggered — **Daily** or **Weekly**. |
| Checkout domain | Optional custom domain for your hosted checkout (e.g., `pay.yourcompany.com`). |

After saving, a **QR code** of your Stellar address is displayed so you can share it for direct USDC transfers.

### API key

Click **Generate API key** to create a secret key for programmatic access to the Stargate API. The key is shown **once** — copy it immediately and store it securely. To manage scopes and IP restrictions, use the [API Keys page](/dashboard/developers/api-keys).

### IP allowlist

Restrict API key usage to specific IP ranges. Select an API key from the dropdown, then add CIDR blocks (e.g., `203.0.113.0/24`). Requests from unlisted IPs are rejected with `403 Forbidden`.

### Checkout domain

Configure a custom domain for your hosted checkout pages. Enter your domain and follow the DNS verification steps shown in the **Custom Domain** panel.

### Payment page branding

Customise the look of your hosted checkout:

| Setting | Description |
|---------|-------------|
| Logo | Upload a PNG or SVG logo displayed at the top of the checkout. |
| Primary colour | Hex colour used for buttons and accents. |
| Background colour | Checkout page background. |
| Button text | Label on the main payment button. |

See the [Theming & Branding guide](../theming-and-branding.md) for full CSS variable reference.

### Security — Two-factor authentication

Click **Set Up Two-Factor Authentication** to enable TOTP-based 2FA on your account:

1. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.).
2. Enter the 6-digit code to verify.
3. Save your backup codes in a secure location.

To disable 2FA, use the **Two-Factor Management** panel and enter a valid TOTP code.

### Audit log

**Path:** `/dashboard/settings/audit-log`

Click **Audit Log** (top-right of the Settings page) to view a timestamped record of all account actions — logins, settings changes, API key creation, team invites, and more. Useful for compliance and security reviews.

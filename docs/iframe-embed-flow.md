# Iframe Embed Flow and Security Policy

This document describes how to embed the Stargate payment widget using an `<iframe>`, the required `Content-Security-Policy` header (`frame-ancestors`), and the `postMessage` event schema used for communication between the iframe and the parent page.

## Embedding the Widget

To embed the widget, include the following HTML snippet on your page:

```html
<iframe
  src="https://checkout.stargate.dev/pay/{invoiceId}"
  width="100%"
  height="600"
  frameborder="0"
  title="Stargate Payment Widget"
></iframe>
```

- Replace `{invoiceId}` with the actual invoice identifier.
- The iframe loads the widget from the Stargate checkout domain.

## Security: `frame-ancestors` Policy

The server serving the widget must send a `Content‑Security‑Policy` header that restricts which origins are allowed to embed the iframe. The current policy is defined in `vercel.json`:

```json
"Content-Security-Policy": "frame-ancestors https://*.stargate.finance"
```

This means only pages whose origin matches `https://*.stargate.finance` are permitted to embed the widget. If you host the widget on a different domain, update the CSP accordingly.

## `postMessage` Event Schema

The widget communicates with the parent page via the `window.postMessage` API. All events share the following base shape:

```ts
interface StargateEventBase {
  type: string;            // e.g. 'STARGATE_LOADED', 'STARGATE_PAID', 'STARGATE_ERROR'
  invoiceId: string;       // The invoice identifier involved in the event
}
```

Specific events extend this base shape:

- **STARGATE_LOADED** – emitted when the widget is ready.

  ```ts
  interface StargateLoaded extends StargateEventBase {
    type: 'STARGATE_LOADED';
  }
  ```

- **STARGATE_PAID** – emitted after a successful payment.

  ```ts
  interface StargatePaid extends StargateEventBase {
    type: 'STARGATE_PAID';
    txHash: string;        // Stellar transaction hash
  }
  ```

- **STARGATE_ERROR** – emitted when an error occurs.

  ```ts
  interface StargateError extends StargateEventBase {
    type: 'STARGATE_ERROR';
    code: string;          // Machine‑readable error code
    message: string;       // Human‑readable description
  }
  ```

### Listening for Events

```js
window.addEventListener('message', (event) => {
  // Verify the origin first
  if (event.origin !== 'https://checkout.stargate.dev') return;

  const { type, invoiceId, txHash, code, message } = event.data;
  switch (type) {
    case 'STARGATE_LOADED':
      console.log('Widget loaded for invoice', invoiceId);
      break;
    case 'STARGATE_PAID':
      console.log('Payment complete!', { invoiceId, txHash });
      break;
    case 'STARGATE_ERROR':
      console.error(`[${code}] ${message}`);
      break;
    default:
      // ignore unknown messages
  }
});
```

> **Important:** Always validate `event.origin` in production to prevent spoofed messages.

---

For a full reference of all events, see the existing **Widget SDK – postMessage Event Schema** documentation in `docs/widget-sdk.md`.

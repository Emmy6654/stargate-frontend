# Stargate Frontend

Next.js merchant dashboard, public payment pages, wallet integration, webhook settings, and embeddable widget.

The dashboard follows the Stargate frontend design prompt kit: B2B navigation, transactions, payment links, wallets, webhooks, team controls, developer docs, and a hosted checkout flow.

## Local Development

```sh
cp .env.local.example .env.local
npm install
npm run dev
```

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run build:widget
```

The from-scratch product prompt kit lives at `../docs/stargate-product-build-prompts.md`.

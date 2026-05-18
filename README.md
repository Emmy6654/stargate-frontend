# Stargate Frontend

Next.js marketing site, merchant dashboard, public payment pages, wallet integration, webhook settings, and embeddable widget.

The frontend follows the Stargate design prompt kit: dark fintech hero, B2B navigation, transactions, payment links, wallets, webhooks, team controls, developer docs, hosted checkout, and the widget SDK.

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

## Production

```sh
cp .env.production.example .env.production
npm run build
npm run build:widget
```

`vercel.json` contains the production build command, global security headers, hosted-checkout frame policy, and widget rewrite used by the deployment workflow.

Production deploys require these GitHub secrets on `dreamgeneX/stargate-frontend`:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Production URLs should be stored as GitHub repository variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

## License

MIT

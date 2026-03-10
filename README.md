# DevMetrics — FastSpring Integration POC

A Next.js demo app built to showcase FastSpring's embedded checkout and SBL. The app simulates a SaaS pricing and purchase flow with two integration patterns, localized pricing, webhook processing, and a live event log.

**Live demo:** [fastspring-demo.vercel.app](https://fastspring-demo.vercel.app)

---

## What's in here

### Homepage (`/`)
- Product names and pricing pulled live from the FastSpring REST API
- Localized currency display via a hidden SBL iframe — prices update to the visitor's local currency on load via the `onFSData` callback
- Popup checkout triggered by the SBL `add()` and `checkout()` methods
- Live event log that surfaces incoming webhook events in real time

### Store page (`/store`)
- Split-view layout: plan selector on the left, embedded checkout iframe on the right
- Selecting a plan sends a `postMessage` to the iframe, which calls `fastspring.builder.add()` — no page reload

### API routes
| Route | Description |
|---|---|
| `GET /api/products` | Lists all product paths from FastSpring |
| `GET /api/products/:path` | Fetches full product detail |
| `GET /api/storefronts/:id/products` | Fetches product list for a storefront |
| `GET /api/country` | Returns visitor country from `x-vercel-ip-country` header |
| `POST /api/webhook` | Receives and verifies FastSpring webhook events (HMAC-SHA256) |
| `GET /api/events` | Returns stored webhook events for the event log |

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_FASTSPRING_STOREFRONT=your-store.test.onfastspring.com/your-storefront
FASTSPRING_API_USERNAME=your-api-username
FASTSPRING_API_PASSWORD=your-api-password
FASTSPRING_WEBHOOK_SECRET=your-webhook-secret
```

- **`NEXT_PUBLIC_FASTSPRING_STOREFRONT`** — the storefront path used by the SBL script. Found in your FastSpring dashboard under Storefronts.
- **`FASTSPRING_API_USERNAME` / `FASTSPRING_API_PASSWORD`** — API credentials from FastSpring dashboard → Integrations → API Credentials.
- **`FASTSPRING_WEBHOOK_SECRET`** — the HMAC secret configured on your webhook endpoint in the FastSpring dashboard.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Webhook events (local)

To receive webhook events locally, use a tunnel like [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Then set `https://<your-ngrok-url>/api/webhook` as the webhook endpoint in your FastSpring dashboard.

---

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [FastSpring SBL](https://fastspring.com/docs/store-builder-library/)
- Deployed on [Vercel](https://vercel.com)

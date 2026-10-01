# Grain Conference Intelligence

A lightweight conference prioritization and field-capture tool for Grain's sales team.

## What it does

- Ranks fintech, payments, treasury, travel, and SaaS conferences by ICP fit.
- Shows planning coverage by month, geography, and trip clusters.
- Lets a salesperson capture leads quickly from a phone or laptop.
- Detects repeat contacts across conferences using email, name similarity, company similarity, and domain signals.
- Generates an AI-assisted follow-up coach note with a configurable OpenAI API key, with a transparent local fallback for demos.
- Provides a HubSpot handoff path through a configurable private app token, webhook URL, or CSV export.

## Run locally

Open `index.html` directly in a browser, or run:

```bash
npm start
```

For a syntax check:

```bash
npm run check
```

## Updating the conference data

Conference data lives in `app.js` in the `conferences` array. A non-developer can update:

- `name`
- `startDate` and `endDate`
- `city`, `country`, `region`
- `vertical`
- `audience`
- `personas`
- `estimatedBuyerDensity`, `fxFit`, and `travelFit`
- `source` and `sourceLabel`

## Scoring logic

Each event gets a 100-point ICP score:

- Persona fit: up to 30 points based on relevant attendee personas and buyer density.
- FX relevance: up to 25 points.
- Audience quality: up to 15 points, using a log scale so huge generic events do not automatically win.
- Travel wedge bonus: up to 8 points when travel wholesalers, OTAs, or travel tech are strongly present.
- Cluster leverage: up to 8 points when another relevant event is nearby in time or geography.

Tiers:

- Tier A: 78+
- Tier B: 62-77
- Tier C: below 62

## AI and integrations

API keys are not hardcoded. They are entered in the browser and stored in local storage for the demo. For production, the same payloads should go through a small serverless proxy so private tokens are never exposed in a browser.

HubSpot push supports:

- Direct CRM contact payload for a HubSpot private app token.
- Webhook URL for Zapier, Make, or a serverless integration.
- CSV export for offline or low-connectivity show-floor workflows.

## Notes for reviewers

This is intentionally scoped as a shippable first version, not a full CRM. The main product bet is that sales reps need fast capture, prioritization, and relationship interpretation more than a complete admin database during a conference.

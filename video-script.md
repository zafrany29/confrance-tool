# 5-10 Minute Walkthrough Script

## 1. Open with the salesperson workflow

"This tool is built for Grain's sales team deciding where to spend conference time, then capturing and following up on leads while they are physically at the event. I kept the app deliberately lightweight: one browser-based workspace, editable data, no complex build pipeline, and API keys configured by the user."

Show the first screen:

- Point out Tier A count, trip clusters, relationship signals, and captured leads.
- Filter by `Payments`, `Travel`, or `Middle East`.
- Open a conference score detail.

## 2. Explain scoring and prioritization

"The scoring model is optimized for Grain's ICP, not generic event size. I score persona fit, FX relevance, audience quality, travel-wholesaler relevance, and trip-cluster leverage. Audience uses a capped/log-style contribution because a huge event is not automatically better if the buying persona is diluted."

Defend the tradeoff:

- Money20/20 scores high because it concentrates payments and fintech buyers.
- ACT scores well even with smaller attendance because treasury is directly responsible for currency risk.
- Travel events get a bonus only when they are likely to contain wholesalers, OTAs, or travel tech companies with cross-border exposure.

## 3. Show planning view

"The planning view answers two questions: are we overloading certain months, and can we cluster travel? For example, Middle East fintech events cluster in September, and London travel events cluster in June. That lets a manager assign one owner and pre-book meetings instead of treating each event as a separate trip."

Show:

- Calendar density.
- Trip clusters.
- Coverage gaps.

## 4. Show field capture

"On the show floor, speed matters more than completeness, so the primary path is now scan-first. A rep can scan a conference badge, business card, or QR code and let the app prefill the form. Manual entry stays as the backup for blurry images, blocked camera access, or incomplete badges."

Demo:

- Click scan badge, scan card, or scan QR.
- Explain that live extraction uses the configured OpenAI key, while the demo fallback fills sample data when no key is present.
- Select a conference if needed.
- Use quick tags like `FX exposure` and `Follow up today`.
- Save the lead.
- Point out the disabled conversation recording button as a future path: record the conversation, transcribe later, and summarize the pain, owner, urgency, and next step into the lead notes.

## 5. Explain cross-conference intelligence

"The relationship tracking is the most important non-obvious part. The app does not just count duplicate names. It matches exact email first, then fuzzy name plus company similarity, and also company domain when available. That handles cases like 'Maya Cohen' becoming 'Maya K. Cohen', a company shortening its name, or a title changing between events."

Show relationship cards:

- Maya is a warming relationship because the conversation progressed from problem confirmed to follow-up requested, with a title change suggesting more authority.
- Jonas is a watch signal because he has repeated low-intent conversations without a clear buying owner.

Mention edge cases:

- Same name at different companies should not match unless email/domain or company similarity supports it.
- Job changes are surfaced rather than hidden.
- The nudge is intentionally calibrated: warming contacts get a specific next step; low-intent repeat contacts get lighter nurture.

## 6. Show AI feature

"I chose AI for follow-up coaching because it is a language and judgment task, not just a rules table. The AI gets the lead notes, conference context, and relationship history, then produces lead quality, relationship arc, next action, and a concise follow-up email."

Show:

- Select a lead.
- Generate a coach note.
- Mention the API key is configurable and not hardcoded.
- If no API key is set, show the local fallback and explain it keeps the demo usable.

## 7. Show HubSpot path

"The HubSpot handoff supports three paths. In a real team I would use a serverless proxy or webhook so private app tokens never live in the browser. For the assignment, the app shows the exact CRM contact payload, supports a configurable webhook, and includes CSV export for low-connectivity situations."

Show:

- Pick a lead.
- Click push selected lead without credentials to show payload.
- Mention configurable webhook and token fields.
- Export CSV.

## 8. Explain AI-assisted build process

"I used AI to accelerate product scoping, generate the first implementation, and stress-test the evaluator criteria against the design. The useful part was compressing boilerplate and quickly exploring matching/scoring approaches. The parts that needed human judgment were the sales workflow, avoiding a generic CRUD app, deciding what to leave out, and making the AI feature fit the actual rep workflow."

## 9. What I would build next

"With another week, I would add authenticated team accounts, real HubSpot OAuth, a serverless AI/proxy layer, editable conference records in the UI, calendar assignment by rep, enrichment from conference exhibitor lists, and analytics on which events produce meetings and opportunities after the show."

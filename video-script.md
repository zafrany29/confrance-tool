# 5-10 Minute Walkthrough Script

## 0:00-0:45 - Opening

"Hi, this is my Grain Conference Intelligence tool. I built it for a salesperson or sales manager who needs to decide which conferences are worth covering, capture leads quickly at the event, and understand whether the same person showing up across conferences is warming up or just casually browsing.

The main idea is not to replace a CRM. It is a fast conference workflow: prioritize events, scan or enter leads, score the lead, track repeat contacts, and hand off clean data to HubSpot or CSV."

Show the app home screen.

Point out:

- `must-cover events`
- `clusterable trips`
- `repeat-contact signals`
- `saved leads`

## 0:45-2:00 - Live Demo From A Salesperson's Perspective

"As a salesperson, I start by looking at which events are worth my time. I can filter conferences by vertical, region, or minimum tier, then open a score explanation instead of just trusting a black-box number."

Demo:

- Open `Pick events`.
- Click a conference score badge.
- Show the score popup.

"Then I can move into planning. The planner shows which months are crowded and where events can be clustered into one trip. That matters because conference ROI is not only about event quality. It is also about travel leverage and whether one rep can cover multiple high-fit events in the same trip."

Demo:

- Open `Plan trips`.
- Click a trip cluster.

"At the event, the rep can use the `Scan leads` view. The form starts with no conference selected, then badge/card/QR scans try to detect the conference from the image text or QR payload. A rep can scan a badge, business card, or QR code, then review the fields, add personal notes, quick tags, and save the lead."

Demo:

- Open `Scan leads`.
- Show scan buttons: badge, card, QR.
- Mention `Clear form`.
- Use sample asset if available.
- Save or explain saved lead flow.

## 2:00-3:20 - Scoring And Prioritization Logic

"There are three scoring layers: conference score, lead score, and relationship score. Each score is clickable and explains why it got that number."

Conference scoring:

"Conference scoring is tuned to Grain's ICP, not generic event size. I score:

- persona fit
- FX relevance
- audience quality
- travel-wholesaler or OTA relevance
- trip-cluster leverage

Audience quality is capped and log-scaled, so a huge generic event does not automatically beat a smaller but more concentrated treasury or payments event."

Lead scoring:

"Lead scoring combines conference fit, ICP signal, and conversation stage. For example, someone at a high-fit payments event who has a confirmed problem or asked for follow-up should rank above someone who only had booth curiosity."

Demo:

- Open `Saved leads`.
- Click a lead score.

Relationship scoring:

"Relationship score looks at whether repeated conversations are actually getting warmer. It includes repeat engagement, intent progression, title movement, conference quality, and match confidence."

Demo:

- Open `Repeat buyers`.
- Click relationship score.

## 3:20-4:45 - Cross-Conference Contact Tracking

"The relationship tracking is the most important non-obvious part of the project. I did not want to only count duplicate names, because that creates false positives.

The matching order is:

- exact email match
- name similarity plus company similarity
- name similarity plus company domain

That handles common conference edge cases. For example, the same person may appear as `Maya Cohen` in one event and `Maya K. Cohen` in another. A company name may be shortened. A title may change. The app groups the likely same person, then surfaces the title movement and conversation progression instead of hiding it."

Mention edge cases:

- "Same name at different companies should not match unless company or domain evidence supports it."
- "A job title change is useful signal, not just messy data."
- "Repeated low-intent booth scans are flagged as `Watch`, not treated as hot leads."
- "Exact email is strongest; fuzzy similarity is useful but lower confidence."

Use examples:

"In the demo data, Maya is warming because the relationship progressed and there is a stronger follow-up path. Jon is more of a watch signal because there are repeat conversations but not enough evidence of increasing intent."

## 4:45-6:00 - AI Tools And Where They Helped

"I used AI in two ways: as a product-building assistant and as an optional feature inside the app.

For building, AI helped me move faster on boilerplate, parser logic, UI copy, and edge-case brainstorming. It was especially useful for turning a large single-file prototype into a cleaner split codebase and for thinking through scoring explanations.

Where it got in the way was accuracy and overconfidence. For example, browser-to-API calls and OCR workflows have practical limitations: CORS, API quota, image quality, and bad OCR text. I had to test the behavior, add clear fallbacks, and make the UI honest about what happened.

Inside the app, the AI coach is optional. If an OpenAI API key is configured, it can generate a follow-up recommendation and email draft from lead context. If not, the app still works locally. Badge/card/QR capture uses local QR detection and Tesseract OCR in the browser, so scanning can work without paid API tokens."

Demo:

- Open `Coach & sync`.
- Show AI settings.
- Show coach note or fallback.
- Mention no API keys are hardcoded.

## 6:00-7:15 - HubSpot And Handoff

"For handoff, I built three paths because sales teams do not always have perfect connectivity or production credentials during a conference.

The app can:

- show a CRM-ready HubSpot contact payload
- send to a configurable webhook
- export CSV

In production, I would not put private app tokens directly in the browser. I would use a small serverless proxy or OAuth flow. But for this project, the payload and handoff model are visible and testable."

Demo:

- Pick a lead in `Coach & sync`.
- Click `Send selected lead` without credentials to show payload.
- Mention CSV export.

## 7:15-8:30 - What I Would Build Next

"If I had another week, I would focus on productionizing the workflow:

1. Add authenticated team accounts and shared lead storage instead of local browser storage.
2. Add a serverless proxy for OpenAI and HubSpot so tokens are never exposed client-side.
3. Add proper HubSpot OAuth and duplicate contact handling.
4. Make conference data editable in the UI, with an admin workflow for adding events.
5. Improve OCR with cropping, confidence display, and better phone/name/company parsing from bounding boxes.
6. Add calendar assignment by rep and meeting targets per conference.
7. Track post-event outcomes: meetings booked, opportunities created, and pipeline influenced, so the scoring model can be improved with real results."

## Closing

"The product bet here is that conference work fails when capture, prioritization, and follow-up are disconnected. This tool keeps those steps in one lightweight workflow: decide where to go, capture the contact quickly, understand the relationship, and hand off the next action."

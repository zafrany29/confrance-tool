// AI coach, CRM/webhook handoff, and import/export flows.

async function generateAiCoachNote() {
  const lead = getSelectedLead("#aiLeadSelect");
  if (!lead) return;
  syncOpenAiSettingsFromUi();
  const prompt = buildAiPrompt(lead);
  $("#aiOutput").textContent = settings.openAiKey ? "Generating with OpenAI..." : "Generating offline coach note...";

  if (!settings.openAiKey) {
    $("#aiOutput").textContent = `${localCoachNote(lead)}\n\nOffline fallback used because no OpenAI API key is saved.`;
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openAiKey}`,
      },
      body: JSON.stringify({
        model: settings.openAiModel || DEFAULT_MODEL,
        input: prompt,
        max_output_tokens: 450,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI returned ${response.status}${detail ? `: ${detail.slice(0, 240)}` : ""}`);
    }
    const data = await response.json();
    $("#aiOutput").textContent = data.output_text || JSON.stringify(data, null, 2);
  } catch (error) {
    $("#aiOutput").textContent =
      `Live OpenAI call failed: ${error.message}\n\nShowing offline fallback instead.\n\n${localCoachNote(lead)}\n\nFor a hosted static app, use a small serverless proxy if browser CORS blocks direct API calls.`;
  }
}

function buildAiPrompt(lead) {
  const conference = getConference(lead.conferenceId);
  const related = getRelationshipGroups().find((group) => group.leads.some((item) => item.id === lead.id));
  return `You are a sales coach for Grain, an FX risk management company selling to PSPs, travel wholesalers, cross-border payment companies, and finance teams with currency exposure.

Lead:
- Name: ${lead.name}
- Company: ${lead.company}
- Title: ${lead.title || "Unknown"}
- Phone: ${lead.phone || "Unknown"}
- Conference: ${conference.name}
- Signal: ${lead.signal}
- Conversation stage: ${lead.stage}
- Tags: ${lead.tags.join(", ") || "None"}
- Notes: ${lead.notes || "None"}

Known relationship history:
${(related?.leads || [lead])
  .map((item) => `- ${getConference(item.conferenceId).name}: ${item.stage}; ${item.notes || "no notes"}`)
  .join("\n")}

Return:
1. Lead quality: High, Medium, or Low with one sentence.
2. Relationship arc: warming, stalled, or unknown with evidence.
3. Best next action for the rep.
4. A concise follow-up email under 120 words.`;
}

async function copyAiPrompt() {
  const lead = getSelectedLead("#aiLeadSelect");
  if (!lead) return;
  await navigator.clipboard.writeText(buildAiPrompt(lead));
  $("#aiOutput").textContent = "Prompt copied. Paste it into ChatGPT or another approved AI tool to draft the follow-up.";
}

function localCoachNote(lead) {
  const conference = getConference(lead.conferenceId);
  const score = leadQualityScore(lead);
  const quality = score >= 75 ? "High" : score >= 52 ? "Medium" : "Low";
  const group = getRelationshipGroups().find((item) => item.leads.some((groupLead) => groupLead.id === lead.id));
  const signal = relationshipSignal(group?.leads || [lead]);
  return `Offline coach note

Lead quality: ${quality} (${score}/100)
Why: ${lead.signal}; ${lead.stage}; ${conference.name} is Tier ${scoreConference(conference).tier} for Grain.

Relationship arc: ${signal.label}
${signal.summary}

Best next action:
${lead.stage.includes("follow") || lead.stage.includes("Budget") ? "Send a same-day follow-up with a CFO/finance-oriented CTA and ask for a 20-minute working session." : "Ask one qualifying question before booking time: who owns FX margin leakage or hedging policy today?"}

Draft follow-up:
Subject: Good speaking at ${conference.name}

Hi ${lead.name.split(" ")[0]},

Good speaking at ${conference.name}. Your note about ${lead.notes ? lead.notes.split(".")[0].toLowerCase() : "currency exposure"} sounded close to the kind of margin risk Grain helps payments and travel teams manage.

Worth a 20-minute conversation next week to map where FX exposure is showing up and whether there is a practical hedge workflow for it?

Best,
Grain team`;
}

function leadQualityScore(lead) {
  return leadScoreBreakdown(lead).total;
}

async function pushLead() {
  const lead = getSelectedLead("#hubspotLeadSelect");
  if (!lead) return;
  const payload = buildHubspotPayload(lead);
  $("#hubspotOutput").textContent = "Sending lead...";

  if (settings.webhookUrl) {
    try {
      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "grain-conference-intelligence", lead, hubspotPayload: payload }),
      });
      $("#hubspotOutput").textContent = `Lead sent to webhook. Status ${response.status}.\n\n${JSON.stringify(payload, null, 2)}`;
      return;
    } catch (error) {
      $("#hubspotOutput").textContent = `Webhook failed: ${error.message}\n\nPayload is still ready to copy:\n${JSON.stringify(payload, null, 2)}`;
      return;
    }
  }

  if (settings.hubspotToken) {
    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.hubspotToken}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await response.text();
      $("#hubspotOutput").textContent = `HubSpot response ${response.status}.\n\n${body}`;
      return;
    } catch (error) {
      $("#hubspotOutput").textContent =
        `Direct HubSpot send failed: ${error.message}. Use the webhook option if the static host blocks browser-to-HubSpot requests.\n\n${JSON.stringify(payload, null, 2)}`;
      return;
    }
  }

  $("#hubspotOutput").textContent =
    `No HubSpot token or webhook configured. This is the CRM-ready payload for a private app, Zapier, Make, or a serverless proxy.\n\n${JSON.stringify(payload, null, 2)}`;
}

function buildHubspotPayload(lead) {
  const conference = getConference(lead.conferenceId);
  const [firstname, ...rest] = lead.name.split(" ");
  return {
    properties: {
      email: lead.email,
      phone: lead.phone,
      firstname,
      lastname: rest.join(" "),
      company: lead.company,
      jobtitle: lead.title,
      lifecyclestage: "lead",
      hs_lead_status: "NEW",
      conference_name: conference.name,
      conference_date: conference.startDate,
      conference_icp_score: String(scoreConference(conference).score),
      grain_icp_signal: lead.signal,
      grain_conversation_stage: lead.stage,
      grain_field_notes: lead.notes,
      grain_tags: lead.tags.join("; "),
    },
  };
}

function exportCsv() {
  const rows = [
    ["Name", "Company", "Email", "Phone", "Title", "Conference", "Signal", "Stage", "Notes", "Tags"],
    ...leads.map((lead) => [
      lead.name,
      lead.company,
      lead.email,
      lead.phone,
      lead.title,
      getConference(lead.conferenceId).name,
      lead.signal,
      lead.stage,
      lead.notes,
      lead.tags.join("; "),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
  downloadFile("grain-conference-leads.csv", csv, "text/csv;charset=utf-8");
}

function exportJson() {
  downloadFile(
    "grain-conference-leads.json",
    JSON.stringify(leads, null, 2),
    "application/json;charset=utf-8",
  );
}

async function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    leads = normalizeImportedLeads(JSON.parse(await file.text()));
    saveLeads();
    renderAll();
  } catch (error) {
    alert(`Could not load leads JSON: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function normalizeImportedLeads(data) {
  if (!Array.isArray(data)) throw new Error("Expected an array of leads");
  return data.map((lead) => ({
    id: lead.id || crypto.randomUUID(),
    conferenceId: getConference(lead.conferenceId)?.id || conferences[0].id,
    name: String(lead.name || "").trim() || "Unknown lead",
    company: String(lead.company || "").trim() || "Unknown company",
    email: String(lead.email || "").trim(),
    phone: String(lead.phone || "").trim(),
    title: String(lead.title || "").trim(),
    signal: leadSignals.includes(lead.signal) ? lead.signal : leadSignals[0],
    stage: leadStages.includes(lead.stage) ? lead.stage : leadStages[0],
    notes: String(lead.notes || "").trim(),
    tags: Array.isArray(lead.tags) ? lead.tags.map(String) : [],
    createdAt: lead.createdAt || new Date().toISOString(),
  }));
}


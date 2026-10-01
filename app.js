const storageKeys = {
  leads: "grainConferenceLeads",
  settings: "grainConferenceSettings",
};

const conferences = [
  {
    id: "money2020-usa-2026",
    name: "Money20/20 USA",
    startDate: "2026-10-18",
    endDate: "2026-10-21",
    city: "Las Vegas",
    country: "USA",
    region: "North America",
    vertical: "Fintech / Payments",
    audience: 11000,
    personas: ["PSP", "Fintech", "Banking", "Cross-border payments"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 4,
    source: "https://www.money2020.com/",
    sourceLabel: "Money20/20 official site",
    reason:
      "Highest-density room for payment leaders, PSPs, banks, and fintech operators with budget and partnership intent.",
  },
  {
    id: "finovatefall-2026",
    name: "FinovateFall",
    startDate: "2026-09-09",
    endDate: "2026-09-11",
    city: "New York",
    country: "USA",
    region: "North America",
    vertical: "Fintech / Banking",
    audience: 2000,
    personas: ["Fintech", "Banking", "Embedded finance"],
    estimatedBuyerDensity: 8,
    fxFit: 6,
    travelFit: 2,
    source: "https://finovate.com/category/finovatefall-2026/",
    sourceLabel: "Finovate event coverage",
    reason:
      "Strong discovery venue for fintech innovators and bank decision makers; smaller than Money20/20 but more demo-driven.",
  },
  {
    id: "merchant-payments-ecosystem-2026",
    name: "Merchant Payments Ecosystem",
    startDate: "2026-03-17",
    endDate: "2026-03-19",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    vertical: "Payments",
    audience: 1500,
    personas: ["Merchant acquiring", "PSP", "Payment orchestration"],
    estimatedBuyerDensity: 8,
    fxFit: 8,
    travelFit: 3,
    source: "https://www.merchantpaymentsecosystem.com/forms/speaking-proposal",
    sourceLabel: "MPE event page",
    reason:
      "Focused payments audience where cross-border settlement, orchestration, and merchant margin topics are natural openings.",
  },
  {
    id: "seamless-me-2026",
    name: "Seamless Middle East",
    startDate: "2026-09-22",
    endDate: "2026-09-24",
    city: "Dubai",
    country: "UAE",
    region: "Middle East",
    vertical: "Fintech / Commerce",
    audience: 10000,
    personas: ["Fintech", "Retail commerce", "Banking", "Payments"],
    estimatedBuyerDensity: 7,
    fxFit: 8,
    travelFit: 5,
    source: "https://terrapinn.com/exhibition/seamless-middle-east-fintech/agenda.stm",
    sourceLabel: "Seamless agenda",
    reason:
      "Regional payments and commerce hub with high cross-border relevance for Gulf, Africa, and South Asia flows.",
  },
  {
    id: "money2020-me-2026",
    name: "Money20/20 Middle East",
    startDate: "2026-09-14",
    endDate: "2026-09-16",
    city: "Riyadh",
    country: "Saudi Arabia",
    region: "Middle East",
    vertical: "Fintech / Payments",
    audience: 38500,
    personas: ["Fintech", "Banking", "Payments", "Investors"],
    estimatedBuyerDensity: 8,
    fxFit: 8,
    travelFit: 4,
    source: "https://en.wikipedia.org/wiki/Money20/20_Middle_East",
    sourceLabel: "Money20/20 Middle East summary",
    reason:
      "Large regional ecosystem event; useful when paired with Dubai to create a Middle East payments trip cluster.",
  },
  {
    id: "itb-berlin-2026",
    name: "ITB Berlin",
    startDate: "2026-03-03",
    endDate: "2026-03-05",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    vertical: "Travel",
    audience: 100000,
    personas: ["Travel wholesalers", "OTAs", "Business travel", "Travel tech"],
    estimatedBuyerDensity: 6,
    fxFit: 7,
    travelFit: 10,
    source: "https://www.itb.com/de/presse/pressemitteilungen/news_28609.html",
    sourceLabel: "ITB Berlin press release",
    reason:
      "Massive B2B travel marketplace; especially valuable for travel wholesalers and platforms with multi-currency exposure.",
  },
  {
    id: "business-travel-show-europe-2026",
    name: "Business Travel Show Europe",
    startDate: "2026-06-24",
    endDate: "2026-06-25",
    city: "London",
    country: "UK",
    region: "Europe",
    vertical: "Travel / SaaS",
    audience: 2400,
    personas: ["Business travel", "TMC", "Corporate travel buyers"],
    estimatedBuyerDensity: 6,
    fxFit: 6,
    travelFit: 9,
    source: "https://www.businesstravelshoweurope.com/exhibit/attends",
    sourceLabel: "Business Travel Show audience page",
    reason:
      "Good travel-finance crossover, particularly for companies managing supplier payments and FX leakage.",
  },
  {
    id: "act-annual-2026",
    name: "ACT Annual Conference",
    startDate: "2026-05-12",
    endDate: "2026-05-13",
    city: "Liverpool",
    country: "UK",
    region: "Europe",
    vertical: "Treasury",
    audience: 1200,
    personas: ["Corporate treasury", "CFO office", "Risk management"],
    estimatedBuyerDensity: 7,
    fxFit: 10,
    travelFit: 1,
    source: "https://www.treasurers.org/node/434421",
    sourceLabel: "ACT conference page",
    reason:
      "Direct access to treasury practitioners who already own currency risk policy and hedging decisions.",
  },
  {
    id: "payments-leaders-usa-2026",
    name: "Payments Leaders' Summit USA",
    startDate: "2026-06-24",
    endDate: "2026-06-25",
    city: "Nashville",
    country: "USA",
    region: "North America",
    vertical: "Payments",
    audience: 500,
    personas: ["Senior payment leaders", "Budget holders", "PSP"],
    estimatedBuyerDensity: 9,
    fxFit: 7,
    travelFit: 2,
    source: "https://www.payments-leaderssummit.com/attend",
    sourceLabel: "Payments Leaders' Summit official site",
    reason:
      "Smaller curated summit with senior payment leaders; likely fewer scans but better meeting quality.",
  },
  {
    id: "saastr-annual-2026",
    name: "SaaStr Annual",
    startDate: "2026-05-12",
    endDate: "2026-05-14",
    city: "San Francisco Bay Area",
    country: "USA",
    region: "North America",
    vertical: "SaaS",
    audience: 10000,
    personas: ["SaaS finance", "RevOps", "Founders"],
    estimatedBuyerDensity: 5,
    fxFit: 5,
    travelFit: 1,
    source: "https://www.saastrannual.com/",
    sourceLabel: "SaaStr official site",
    reason:
      "Useful secondary room for SaaS companies with global revenue, but less concentrated around payments and FX ownership.",
  },
  {
    id: "travel-tech-show-2026",
    name: "TravelTech Show",
    startDate: "2026-06-24",
    endDate: "2026-06-25",
    city: "London",
    country: "UK",
    region: "Europe",
    vertical: "Travel Tech",
    audience: 4500,
    personas: ["Travel tech", "OTAs", "Travel wholesalers"],
    estimatedBuyerDensity: 6,
    fxFit: 7,
    travelFit: 10,
    source: "https://www.traveltech-show.com/",
    sourceLabel: "TravelTech Show official site",
    reason:
      "Strong for Grain's travel-wholesaler wedge and naturally clusters with Business Travel Show Europe in London.",
  },
  {
    id: "tradetech-fx-europe-2026",
    name: "TradeTech FX Europe",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    vertical: "Treasury / FX",
    audience: 600,
    personas: ["Corporate treasury", "FX risk", "Institutional finance"],
    estimatedBuyerDensity: 8,
    fxFit: 10,
    travelFit: 1,
    source: "https://eco-cdn.iqpc.com/eco/files/event_content/tradetech-fx-eu-2026-draft-agenda-1wglMj2NLrWciPgWNpBzBX89ZoRmVpiMw5unDbebb.pdf",
    sourceLabel: "TradeTech FX Europe agenda",
    reason:
      "Direct FX-risk room with treasury and finance operators; smaller, but unusually specific to Grain's currency-risk narrative.",
  },
];

const sampleLeads = [
  {
    id: "lead-1",
    conferenceId: "itb-berlin-2026",
    name: "Maya Cohen",
    company: "AtlasPay Travel",
    email: "maya.cohen@atlaspay.example",
    title: "Director of Payments",
    signal: "Travel wholesaler or OTA",
    stage: "Problem confirmed",
    notes: "Large EUR and GBP supplier exposure. Wants a sharper way to protect margin without slowing bookings.",
    tags: ["FX exposure", "Travel flow"],
    createdAt: "2026-03-04T11:30:00.000Z",
  },
  {
    id: "lead-2",
    conferenceId: "money2020-me-2026",
    name: "Maya K. Cohen",
    company: "AtlasPay",
    email: "maya.cohen@atlaspay.example",
    title: "VP Payments",
    signal: "Cross-border payments",
    stage: "Asked for follow-up",
    notes: "New title. Asked for CFO-ready material and named Q4 budget review.",
    tags: ["CFO owner", "Follow up today"],
    createdAt: "2026-09-15T09:10:00.000Z",
  },
  {
    id: "lead-3",
    conferenceId: "merchant-payments-ecosystem-2026",
    name: "Jonas Richter",
    company: "Northstar Acquiring",
    email: "jonas@northstar.example",
    title: "Partnerships Lead",
    signal: "PSP or merchant acquiring",
    stage: "Quick booth scan",
    notes: "Interested in partner story but no owned problem yet.",
    tags: ["Payments volume"],
    createdAt: "2026-03-18T16:45:00.000Z",
  },
  {
    id: "lead-4",
    conferenceId: "finovatefall-2026",
    name: "Jon Richter",
    company: "Northstar Payments",
    email: "jonas@northstar.example",
    title: "Director, Strategic Partnerships",
    signal: "PSP or merchant acquiring",
    stage: "Quick booth scan",
    notes: "Second conversation, still researching vendors. Asked broad pricing questions.",
    tags: ["Payments volume"],
    createdAt: "2026-09-10T14:05:00.000Z",
  },
];

let leads = loadJson(storageKeys.leads, sampleLeads);
let settings = loadJson(storageKeys.settings, {
  openAiKey: "",
  openAiModel: "gpt-4.1-mini",
  hubspotToken: "",
  webhookUrl: "",
});
let activeTags = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFilters();
  initLeadForm();
  initSettings();
  initActions();
  renderAll();
});

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveLeads() {
  localStorage.setItem(storageKeys.leads, JSON.stringify(leads));
}

function saveSettings() {
  localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
}

function initNavigation() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => item.classList.remove("active"));
      $$(".view").forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      $(`#${tab.dataset.view}`).classList.add("active");
    });
  });
}

function initFilters() {
  const verticals = unique(conferences.map((event) => event.vertical));
  const regions = unique(conferences.map((event) => event.region));
  fillSelect($("#verticalFilter"), verticals, "all");
  fillSelect($("#regionFilter"), regions, "all");
  ["#searchInput", "#verticalFilter", "#regionFilter", "#tierFilter"].forEach((id) => {
    $(id).addEventListener("input", renderConferences);
  });
}

function fillSelect(select, options, keepFirstValue = null) {
  const first = keepFirstValue ? select.querySelector(`option[value="${keepFirstValue}"]`) : null;
  select.innerHTML = "";
  if (first) select.append(first);
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    select.append(element);
  });
}

function initLeadForm() {
  fillSelect(
    $("#leadConference"),
    conferences.map((conference) => conference.name),
  );
  $("#leadForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedConference = conferences.find((conference) => conference.name === $("#leadConference").value);
    const lead = {
      id: crypto.randomUUID(),
      conferenceId: selectedConference.id,
      name: $("#leadName").value.trim(),
      company: $("#leadCompany").value.trim(),
      email: $("#leadEmail").value.trim(),
      title: $("#leadTitle").value.trim(),
      signal: $("#leadSignal").value,
      stage: $("#leadStage").value,
      notes: $("#leadNotes").value.trim(),
      tags: activeTags,
      createdAt: new Date().toISOString(),
    };
    leads = [lead, ...leads];
    activeTags = [];
    saveLeads();
    event.target.reset();
    $$(".quick-tags button").forEach((button) => button.classList.remove("active"));
    renderAll();
  });

  $$(".quick-tags button").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.tag;
      activeTags = activeTags.includes(tag)
        ? activeTags.filter((item) => item !== tag)
        : [...activeTags, tag];
      button.classList.toggle("active", activeTags.includes(tag));
      button.style.background = activeTags.includes(tag) ? "var(--mint)" : "";
    });
  });
}

function initSettings() {
  $("#openAiKey").value = settings.openAiKey;
  $("#openAiModel").value = settings.openAiModel;
  $("#hubspotToken").value = settings.hubspotToken;
  $("#webhookUrl").value = settings.webhookUrl;

  ["openAiKey", "openAiModel", "hubspotToken", "webhookUrl"].forEach((id) => {
    $(`#${id}`).addEventListener("input", (event) => {
      settings[id] = event.target.value.trim();
      saveSettings();
    });
  });
}

function initActions() {
  $("#resetData").addEventListener("click", () => {
    leads = sampleLeads;
    saveLeads();
    renderAll();
  });
  $("#runAi").addEventListener("click", generateAiCoachNote);
  $("#copyAiPrompt").addEventListener("click", copyAiPrompt);
  $("#pushHubspot").addEventListener("click", pushLead);
  $("#exportCsv").addEventListener("click", exportCsv);
}

function renderAll() {
  renderSummary();
  renderConferences();
  renderPlanner();
  renderLeads();
  renderRelationships();
  renderLeadSelectors();
  renderSources();
}

function renderSummary() {
  $("#tierA").textContent = conferences.filter((event) => scoreConference(event).tier === "A").length;
  $("#tripClusters").textContent = getClusters().length;
  $("#relationshipSignals").textContent = getRelationshipGroups().filter((group) => group.leads.length > 1).length;
  $("#capturedLeads").textContent = leads.length;
}

function renderConferences() {
  const grid = $("#conferenceGrid");
  const search = $("#searchInput").value.toLowerCase();
  const vertical = $("#verticalFilter").value;
  const region = $("#regionFilter").value;
  const tier = $("#tierFilter").value;
  grid.innerHTML = "";

  const filtered = conferences
    .map((conference) => ({ ...conference, fit: scoreConference(conference) }))
    .filter((conference) => {
      const haystack = [
        conference.name,
        conference.city,
        conference.country,
        conference.region,
        conference.vertical,
        conference.personas.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const passesTier =
        tier === "all" ||
        conference.fit.tier === "A" ||
        (tier === "B" && ["A", "B"].includes(conference.fit.tier));
      return (
        haystack.includes(search) &&
        (vertical === "all" || conference.vertical === vertical) &&
        (region === "all" || conference.region === region) &&
        passesTier
      );
    })
    .sort((a, b) => b.fit.score - a.fit.score);

  filtered.forEach((conference) => {
    const template = $("#conferenceCardTemplate").content.cloneNode(true);
    const badge = template.querySelector(".tier-badge");
    badge.textContent = `Tier ${conference.fit.tier} · ${conference.fit.score}`;
    badge.classList.add(`tier-${conference.fit.tier.toLowerCase()}`);
    template.querySelector(".date-pill").textContent = formatDateRange(conference);
    template.querySelector("h3").textContent = conference.name;
    template.querySelector(".meta").textContent =
      `${conference.city}, ${conference.country} · ${conference.vertical} · ~${formatNumber(conference.audience)} attendees`;
    template.querySelector(".reason").textContent = conference.reason;
    template.querySelector(".score-bar span").style.width = `${conference.fit.score}%`;
    template.querySelector(".score-details").addEventListener("click", () => {
      alert(
        `${conference.name}\n\nICP score: ${conference.fit.score}/100\nTier: ${conference.fit.tier}\n\n${conference.fit.explanation}`,
      );
    });
    template.querySelector(".capture-here").addEventListener("click", () => {
      openView("field");
      $("#leadConference").value = conference.name;
      $("#leadName").focus();
    });
    grid.append(template);
  });

  if (!filtered.length) {
    grid.innerHTML = '<p class="insight-item">No conferences match these filters.</p>';
  }
}

function renderPlanner() {
  const timeline = $("#monthTimeline");
  const byMonth = conferences.reduce((acc, conference) => {
    const month = new Date(`${conference.startDate}T00:00:00`).getMonth();
    acc[month] = acc[month] || [];
    acc[month].push(conference);
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(byMonth).map((items) => items.length));
  timeline.innerHTML = "";

  for (let month = 0; month < 12; month += 1) {
    const count = byMonth[month]?.length || 0;
    const row = document.createElement("div");
    row.className = "month-row";
    row.innerHTML = `
      <strong>${new Date(2026, month, 1).toLocaleString("en", { month: "short" })}</strong>
      <span class="month-bar"><span style="width: ${maxCount ? (count / maxCount) * 100 : 0}%"></span></span>
      <span>${count}</span>
    `;
    timeline.append(row);
  }

  renderInsightList(
    $("#clusterList"),
    getClusters().map((cluster) => ({
      title: `${cluster.region} · ${cluster.label}`,
      body: `${cluster.events.map((event) => event.name).join(", ")}. Suggested owner: ${cluster.owner}.`,
    })),
  );

  const highFitByRegion = conferences
    .filter((event) => scoreConference(event).tier === "A")
    .reduce((acc, event) => {
      acc[event.region] = (acc[event.region] || 0) + 1;
      return acc;
    }, {});

  renderInsightList($("#gapList"), [
    {
      title: "Treasury is under-covered outside Europe",
      body: "Most pure treasury signal is UK/EU. Add North America treasury events before Q4 planning.",
    },
    {
      title: "Travel wedge clusters in March and June",
      body: "ITB Berlin and London travel events are concentrated. Use pre-booked meetings instead of booth-only coverage.",
    },
    {
      title: "Middle East has high event density in September",
      body: `A ${highFitByRegion["Middle East"] || 0}-event Tier A cluster supports one regional trip instead of separate visits.`,
    },
  ]);
}

function renderLeads() {
  renderInsightList(
    $("#leadFeed"),
    leads.slice(0, 8).map((lead) => {
      const conference = getConference(lead.conferenceId);
      return {
        title: `${lead.name} · ${lead.company}`,
        body: `${conference.name} · ${lead.stage} · ${lead.signal}${lead.tags.length ? ` · ${lead.tags.join(", ")}` : ""}`,
      };
    }),
    "No leads captured yet.",
  );
}

function renderRelationships() {
  const list = $("#relationshipList");
  list.innerHTML = "";
  const groups = getRelationshipGroups().filter((group) => group.leads.length > 1);

  groups.forEach((group) => {
    const sorted = [...group.leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const conferencesMet = unique(sorted.map((lead) => getConference(lead.conferenceId).name));
    const signal = relationshipSignal(sorted);
    const titleShift =
      normalizeTitle(first.title) !== normalizeTitle(last.title)
        ? `Title changed from ${first.title || "unknown"} to ${last.title || "unknown"}.`
        : "No meaningful title change detected.";
    const article = document.createElement("article");
    article.className = "relationship-card";
    article.innerHTML = `
      <header>
        <div>
          <h3>${last.name}</h3>
          <p class="meta">${last.company} · ${conferencesMet.length} conferences · ${sorted.length} conversations</p>
        </div>
        <span class="tag ${signal.kind === "warming" ? "signal-warm" : "signal-watch"}">${signal.label}</span>
      </header>
      <p>${signal.summary}</p>
      <ul>
        <li>${titleShift}</li>
        <li>Matched by ${group.matchReason}.</li>
        <li>Seen at ${conferencesMet.join(", ")}.</li>
      </ul>
    `;
    list.append(article);
  });

  if (!groups.length) {
    list.innerHTML = '<p class="insight-item">No repeat-contact patterns yet. Capture a few leads to surface relationship arcs.</p>';
  }
}

function renderLeadSelectors() {
  const options = leads.map((lead) => {
    const conference = getConference(lead.conferenceId);
    return `${lead.name} · ${lead.company} · ${conference.name}`;
  });
  fillSelect($("#aiLeadSelect"), options);
  fillSelect($("#hubspotLeadSelect"), options);
}

function renderSources() {
  const list = $("#sourceList");
  list.innerHTML = "";
  unique(conferences.map((event) => `${event.sourceLabel}|${event.source}`)).forEach((source) => {
    const [label, url] = source.split("|");
    const item = document.createElement("li");
    item.innerHTML = `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
    list.append(item);
  });
}

function renderInsightList(container, items, emptyText = "No items yet.") {
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = `<p class="insight-item">${emptyText}</p>`;
    return;
  }
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "insight-item";
    div.innerHTML = `<strong>${item.title}</strong><p>${item.body}</p>`;
    container.append(div);
  });
}

function scoreConference(event) {
  const personaFit = Math.min(30, event.personas.length * 5 + event.estimatedBuyerDensity * 2);
  const fxRelevance = event.fxFit * 2.5;
  const audienceQuality = Math.min(15, Math.log10(event.audience) * 4);
  const travelBonus = event.travelFit >= 8 ? 8 : event.travelFit >= 5 ? 4 : 0;
  const clusterBonus = getClusters(false).some((cluster) => cluster.events.some((item) => item.id === event.id)) ? 8 : 0;
  const score = Math.round(personaFit + fxRelevance + audienceQuality + travelBonus + clusterBonus);
  const tier = score >= 78 ? "A" : score >= 62 ? "B" : "C";
  const explanation =
    `Persona fit ${Math.round(personaFit)}/30, FX relevance ${Math.round(fxRelevance)}/25, ` +
    `audience quality ${Math.round(audienceQuality)}/15, travel wedge ${travelBonus}/8, cluster leverage ${clusterBonus}/8.`;
  return { score: Math.min(score, 100), tier, explanation };
}

function getClusters(includeOwner = true) {
  const clusters = [];
  for (let i = 0; i < conferences.length; i += 1) {
    for (let j = i + 1; j < conferences.length; j += 1) {
      const first = conferences[i];
      const second = conferences[j];
      const days = Math.abs(daysBetween(first.startDate, second.startDate));
      const sameRegion = first.region === second.region;
      const sameCity = first.city === second.city;
      if ((sameCity && days <= 21) || (sameRegion && days <= 10)) {
        clusters.push({
          region: sameCity ? first.city : first.region,
          label: days === 0 ? "same week" : `${days} days apart`,
          events: [first, second],
          owner: includeOwner ? recommendOwner([first, second]) : "",
        });
      }
    }
  }
  return clusters;
}

function recommendOwner(events) {
  const text = events.flatMap((event) => event.personas).join(" ").toLowerCase();
  if (text.includes("travel")) return "Travel/FX specialist";
  if (text.includes("treasury")) return "Treasury AE";
  return "Payments AE";
}

function getRelationshipGroups() {
  const groups = [];
  leads.forEach((lead) => {
    const existing = groups.find((group) => isSameContact(group.leads[0], lead).same);
    if (existing) {
      existing.leads.push(lead);
      existing.matchReason = isSameContact(existing.leads[0], lead).reason;
    } else {
      groups.push({ leads: [lead], matchReason: "initial record" });
    }
  });
  return groups;
}

function isSameContact(a, b) {
  if (a.id === b.id) return { same: true, reason: "same record" };
  if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) {
    return { same: true, reason: "exact email" };
  }
  const aDomain = getDomain(a.email);
  const bDomain = getDomain(b.email);
  const nameClose = similarity(normalizeName(a.name), normalizeName(b.name)) >= 0.78;
  const companyClose = similarity(normalizeName(a.company), normalizeName(b.company)) >= 0.72;
  if (nameClose && (companyClose || (aDomain && aDomain === bDomain))) {
    return { same: true, reason: aDomain === bDomain ? "name plus company domain" : "name plus company similarity" };
  }
  return { same: false, reason: "not enough evidence" };
}

function relationshipSignal(items) {
  const stages = items.map((item) => item.stage);
  const hasProgression = stages.includes("Asked for follow-up") || stages.includes("Budget or owner identified");
  const repeatedLowIntent = items.length > 1 && stages.every((stage) => stage === "Quick booth scan");
  if (hasProgression) {
    return {
      kind: "warming",
      label: "Warming",
      summary:
        "Repeat engagement has moved beyond booth curiosity. Nudge the owner with a specific next step and reference the earlier pain.",
    };
  }
  if (repeatedLowIntent) {
    return {
      kind: "watch",
      label: "Watch",
      summary:
        "Multiple conversations without increasing intent. Keep useful content flowing, but avoid over-investing until a pain owner appears.",
    };
  }
  return {
    kind: "warming",
    label: "Developing",
    summary: "Repeat contact is worth a concise follow-up that tests urgency and confirms the business owner.",
  };
}

async function generateAiCoachNote() {
  const lead = getSelectedLead("#aiLeadSelect");
  if (!lead) return;
  const prompt = buildAiPrompt(lead);
  $("#aiOutput").textContent = "Generating...";

  if (!settings.openAiKey) {
    $("#aiOutput").textContent = localCoachNote(lead);
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
        model: settings.openAiModel || "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 450,
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI returned ${response.status}`);
    }
    const data = await response.json();
    $("#aiOutput").textContent = data.output_text || JSON.stringify(data, null, 2);
  } catch (error) {
    $("#aiOutput").textContent =
      `${localCoachNote(lead)}\n\nLive AI call failed: ${error.message}. For a hosted static app, use a small serverless proxy if browser CORS blocks direct API calls.`;
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
  $("#aiOutput").textContent = "Prompt copied. Paste it into ChatGPT or another approved AI tool.";
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
  const conference = getConference(lead.conferenceId);
  const base = scoreConference(conference).score * 0.45;
  const signalScore = {
    "Cross-border payments": 25,
    "PSP or merchant acquiring": 23,
    "Travel wholesaler or OTA": 22,
    "Corporate treasury": 24,
    "Marketplace or SaaS finance": 16,
    "Low fit / partner curiosity": 6,
  }[lead.signal];
  const stageScore = {
    "Quick booth scan": 5,
    "Problem confirmed": 16,
    "Budget or owner identified": 25,
    "Asked for follow-up": 22,
    "Existing opportunity": 28,
  }[lead.stage];
  return Math.min(100, Math.round(base + signalScore + stageScore));
}

async function pushLead() {
  const lead = getSelectedLead("#hubspotLeadSelect");
  if (!lead) return;
  const payload = buildHubspotPayload(lead);
  $("#hubspotOutput").textContent = "Pushing...";

  if (settings.webhookUrl) {
    try {
      const response = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "grain-conference-intelligence", lead, hubspotPayload: payload }),
      });
      $("#hubspotOutput").textContent = `Webhook sent with status ${response.status}.\n\n${JSON.stringify(payload, null, 2)}`;
      return;
    } catch (error) {
      $("#hubspotOutput").textContent = `Webhook failed: ${error.message}\n\n${JSON.stringify(payload, null, 2)}`;
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
      $("#hubspotOutput").textContent = `HubSpot returned ${response.status}.\n\n${body}`;
      return;
    } catch (error) {
      $("#hubspotOutput").textContent =
        `Direct HubSpot call failed: ${error.message}. Use the webhook option if the static host blocks browser-to-HubSpot requests.\n\n${JSON.stringify(payload, null, 2)}`;
      return;
    }
  }

  $("#hubspotOutput").textContent =
    `No HubSpot token or webhook configured. This is the exact contact payload to send through a private app, Zapier, Make, or a serverless proxy.\n\n${JSON.stringify(payload, null, 2)}`;
}

function buildHubspotPayload(lead) {
  const conference = getConference(lead.conferenceId);
  const [firstname, ...rest] = lead.name.split(" ");
  return {
    properties: {
      email: lead.email,
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
    ["Name", "Company", "Email", "Title", "Conference", "Signal", "Stage", "Notes", "Tags"],
    ...leads.map((lead) => [
      lead.name,
      lead.company,
      lead.email,
      lead.title,
      getConference(lead.conferenceId).name,
      lead.signal,
      lead.stage,
      lead.notes,
      lead.tags.join("; "),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "grain-conference-leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function getSelectedLead(selector) {
  const label = $(selector).value;
  return leads.find((lead) => `${lead.name} · ${lead.company} · ${getConference(lead.conferenceId).name}` === label);
}

function getConference(id) {
  return conferences.find((conference) => conference.id === id);
}

function openView(id) {
  $(`.tab[data-view="${id}"]`).click();
}

function formatDateRange(conference) {
  const start = new Date(`${conference.startDate}T00:00:00`);
  const end = new Date(`${conference.endDate}T00:00:00`);
  const month = start.toLocaleString("en", { month: "short" });
  return `${month} ${start.getDate()}-${end.getDate()}`;
}

function formatNumber(number) {
  return new Intl.NumberFormat("en", { notation: number >= 10000 ? "compact" : "standard" }).format(number);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function daysBetween(a, b) {
  return (new Date(`${a}T00:00:00`) - new Date(`${b}T00:00:00`)) / 86400000;
}

function getDomain(email = "") {
  return email.includes("@") ? email.split("@")[1].toLowerCase() : "";
}

function normalizeName(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\b(vp|director|head|lead|payments|payment|travel|group|inc|ltd|llc)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value = "") {
  return value.toLowerCase().replace(/[^a-z ]/g, "").trim();
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  return (longer.length - levenshtein(longer, shorter)) / longer.length;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

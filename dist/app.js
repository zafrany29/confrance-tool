﻿const storageKeys = {
  leads: "grainConferenceLeads",
  settings: "grainConferenceSettings",
};

const DEFAULT_MODEL = "gpt-4.1-mini";
const LEADS_DATA_URL = "data/leads.json";
const SEPARATOR = " - ";

const leadSignals = [
  "Cross-border payments",
  "PSP or merchant acquiring",
  "Travel wholesaler or OTA",
  "Corporate treasury",
  "Marketplace or SaaS finance",
  "Low fit / partner curiosity",
];

const leadStages = [
  "Quick booth scan",
  "Problem confirmed",
  "Budget or owner identified",
  "Asked for follow-up",
  "Existing opportunity",
];

const signalScores = {
  "Cross-border payments": 25,
  "PSP or merchant acquiring": 23,
  "Travel wholesaler or OTA": 22,
  "Corporate treasury": 24,
  "Marketplace or SaaS finance": 16,
  "Low fit / partner curiosity": 6,
};

const stageScores = {
  "Quick booth scan": 5,
  "Problem confirmed": 16,
  "Budget or owner identified": 25,
  "Asked for follow-up": 22,
  "Existing opportunity": 28,
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
    personas: ["PSP", "Fintech", "Banking", "Cross-border payments", "Payment leaders", "CFO / Finance"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 3,
    source: "https://us.money2020.com/",
    sourceLabel: "Money20/20 USA official page",
    reason: "Money20/20 reports 11,000+ senior attendees from 3,400+ companies, including banks, payment companies, and fintechs. Strong room for international payments and multi-currency exposure.",
  },
  {
    id: "wtm-london-2026",
    name: "WTM London",
    startDate: "2026-11-03",
    endDate: "2026-11-05",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    vertical: "Travel / Tourism",
    audience: 46000,
    personas: ["Travel wholesalers", "Tour operators", "OTAs", "DMCs", "Travel technology", "Travel buyers"],
    estimatedBuyerDensity: 7,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.wtm.com/london/en-gb.html",
    sourceLabel: "WTM London official page",
    reason: "WTM reports 46,000+ attendees and 5,500+ buyers. Tour operators, OTAs, DMCs, and accommodation businesses frequently collect and pay in multiple currencies.",
  },
  {
    id: "phocuswright-conference-2026",
    name: "The Phocuswright Conference",
    startDate: "2026-11-17",
    endDate: "2026-11-19",
    city: "Fort Lauderdale",
    country: "USA",
    region: "North America",
    vertical: "Travel Tech",
    audience: 1200,
    personas: ["OTAs", "Travel technology", "Hotels", "Airlines", "Travel finance", "Tour operators", "Travel executives"],
    estimatedBuyerDensity: 9,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.phocuswrightconference.com/",
    sourceLabel: "Phocuswright official page",
    reason: "Concentrated travel decision-maker audience with a high share of C-level and VP-level attendees. Smaller event, but unusually relevant for Grain's travel vertical.",
  },
  {
    id: "imtm-tel-aviv-2027",
    name: "IMTM - International Mediterranean Tourism Market",
    startDate: "2027-02-16",
    endDate: "2027-02-17",
    city: "Tel Aviv",
    country: "Israel",
    region: "Middle East",
    vertical: "Travel / Tourism",
    audience: 17000,
    personas: ["Travel wholesalers", "Tour operators", "Travel agencies", "DMCs", "Hotels", "Travel buyers"],
    estimatedBuyerDensity: 7,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.imtm-telaviv.com/",
    sourceLabel: "IMTM official page",
    reason: "Israel's flagship B2B tourism marketplace. Travel wholesalers, agencies, and international tourism companies commonly manage multi-currency supplier and customer flows.",
  },
  {
    id: "fintech-meetup-2027",
    name: "Fintech Meetup",
    startDate: "2027-02-22",
    endDate: "2027-02-24",
    city: "Las Vegas",
    country: "USA",
    region: "North America",
    vertical: "Fintech / Financial Services",
    audience: 5000,
    personas: ["Fintech", "Banks", "Payment companies", "Financial institutions", "Merchants", "Fintech founders"],
    estimatedBuyerDensity: 9,
    fxFit: 8,
    travelFit: 3,
    source: "https://fintechmeetup.com/",
    sourceLabel: "Fintech Meetup official page",
    reason: "Curated double-opt-in meeting format with banks, merchants, fintechs, and financial institutions. Useful for targeted meetings rather than booth-only scans.",
  },
  {
    id: "markethub-asia-2027",
    name: "MarketHub Asia",
    startDate: "2027-02-23",
    endDate: "2027-02-26",
    city: "Cebu",
    country: "Philippines",
    region: "Asia Pacific",
    vertical: "Travel Wholesale / Travel Tech",
    audience: null,
    personas: ["Travel wholesalers", "Wholesale distributors", "Global travel agencies", "Hotels", "Travel technology", "DMCs"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 10,
    source: "https://www.hbxgroup.com/markethub",
    sourceLabel: "HBX Group MarketHub page",
    reason: "B2B travel event for wholesale distributors, global travel agencies, hoteliers, and travel trade decision-makers with frequent cross-currency settlement needs.",
  },
  {
    id: "mpe-2027",
    name: "Merchant Payments Ecosystem (MPE)",
    startDate: "2027-03-09",
    endDate: "2027-03-11",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    vertical: "Payments / Merchant Payments",
    audience: 1600,
    personas: ["PSP", "Acquirer", "Fintech", "Merchant", "Payment provider", "Payment orchestration"],
    estimatedBuyerDensity: 10,
    fxFit: 9,
    travelFit: 3,
    source: "https://www.merchantpaymentsecosystem.com/",
    sourceLabel: "MPE official page",
    reason: "Very concentrated payments audience. Particularly attractive for Grain's PSP, acquirer, payment orchestration, and cross-border payments ICP.",
  },
  {
    id: "itb-berlin-2027",
    name: "ITB Berlin",
    startDate: "2027-03-16",
    endDate: "2027-03-18",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    vertical: "Travel / Tourism",
    audience: 97000,
    personas: ["Travel wholesalers", "Tour operators", "OTAs", "Hotels", "Travel technology", "DMCs", "Travel buyers"],
    estimatedBuyerDensity: 6,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.itb.com/en",
    sourceLabel: "ITB Berlin official page",
    reason: "Massive B2B travel marketplace. International tour operators, accommodation providers, and travel platforms can have significant multi-currency receivables and supplier payments.",
  },
  {
    id: "eurofinance-west-coast-2027",
    name: "EuroFinance Treasury & Cash Management Summit San Francisco",
    startDate: "2027-03-16",
    endDate: "2027-03-17",
    city: "San Francisco",
    country: "USA",
    region: "North America",
    vertical: "Treasury / FX",
    audience: null,
    personas: ["Corporate treasurers", "CFO / Finance", "FX risk managers", "Cash management", "Scale-ups", "Multinational companies"],
    estimatedBuyerDensity: 10,
    fxFit: 10,
    travelFit: 1,
    source: "https://www.eurofinance.com/treasury-cash-management-summit-west-coast/",
    sourceLabel: "EuroFinance West Coast official page",
    reason: "Extremely direct Grain fit for corporate treasurers managing cross-border cash flow, real-time payments, liquidity, and FX risk.",
  },
  {
    id: "international-payments-conference-2027",
    name: "International Payments Conference (IPC)",
    startDate: "2027-04-05",
    endDate: "2027-04-07",
    city: "Washington, D.C.",
    country: "USA",
    region: "North America",
    vertical: "Payments / Fintech",
    audience: null,
    personas: ["Payment companies", "Fintech", "Payment executives", "Financial institutions", "Payments compliance", "Payment technology"],
    estimatedBuyerDensity: 8,
    fxFit: 8,
    travelFit: 1,
    source: "https://www.ipa.org/ipc.html",
    sourceLabel: "Innovative Payments Association IPC page",
    reason: "Specialized payments gathering focused on payment innovation, regulation, and companies building payment products.",
  },
  {
    id: "smarter-faster-payments-2027",
    name: "Smarter Faster Payments 2027",
    startDate: "2027-04-11",
    endDate: "2027-04-14",
    city: "Washington, D.C.",
    country: "USA",
    region: "North America",
    vertical: "Payments",
    audience: null,
    personas: ["Payment companies", "Banks", "Fintech", "Payment strategists", "Finance teams", "Payment technology"],
    estimatedBuyerDensity: 8,
    fxFit: 7,
    travelFit: 1,
    source: "https://payments.nacha.org/",
    sourceLabel: "Nacha Smarter Faster Payments page",
    reason: "Payments-industry conference bringing together payments experts, influencers, and fintech solution providers.",
  },
  {
    id: "transact-2027",
    name: "TRANSACT 2027",
    startDate: "2027-04-19",
    endDate: "2027-04-21",
    city: "Las Vegas",
    country: "USA",
    region: "North America",
    vertical: "Payments / Merchant Acquiring",
    audience: null,
    personas: ["PSP", "Payment processors", "Acquirers", "Fintech", "Platforms", "Merchants", "Payment executives"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 2,
    source: "https://etatransact.com/register/",
    sourceLabel: "TRANSACT official page",
    reason: "Strong payments prospecting opportunity bringing together issuers, processors, fintech founders, platforms, and merchants.",
  },
  {
    id: "markethub-europe-2027",
    name: "MarketHub Europe",
    startDate: "2027-04-20",
    endDate: "2027-04-23",
    city: "Rhodes",
    country: "Greece",
    region: "Europe",
    vertical: "Travel Wholesale / Travel Tech",
    audience: null,
    personas: ["Travel wholesalers", "Wholesale distributors", "Global travel agencies", "Hotels", "Travel technology", "Tourism decision-makers"],
    estimatedBuyerDensity: 10,
    fxFit: 10,
    travelFit: 10,
    source: "https://www.hbxgroup.com/markethub",
    sourceLabel: "HBX Group MarketHub page",
    reason: "Highly targeted B2B travel distribution event with businesses that often have meaningful cross-border currency exposure.",
  },
  {
    id: "pay360-2027",
    name: "PAY360",
    startDate: "2027-04-21",
    endDate: "2027-04-22",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    vertical: "Payments",
    audience: 7000,
    personas: ["PSP", "Payments executives", "Banks", "Fintech", "Payment infrastructure", "Merchants"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 2,
    source: "https://pay360event.com/",
    sourceLabel: "PAY360 official page",
    reason: "Dedicated payments event with a high concentration of senior payments professionals, fintechs, banks, payment infrastructure teams, and decision-makers.",
  },
  {
    id: "money2020-asia-2027",
    name: "Money20/20 Asia",
    startDate: "2027-04-27",
    endDate: "2027-04-29",
    city: "Bangkok",
    country: "Thailand",
    region: "Asia Pacific",
    vertical: "Fintech / Payments",
    audience: 4000,
    personas: ["PSP", "Fintech", "Banking", "Cross-border payments", "Payment leaders", "Financial institutions"],
    estimatedBuyerDensity: 9,
    fxFit: 9,
    travelFit: 3,
    source: "https://www.money2020.com/",
    sourceLabel: "Money20/20 official page",
    reason: "Asia-Pacific edition of Money20/20. The region contains significant cross-border commerce, payment, and currency flows.",
  },
  {
    id: "payments-canada-summit-2027",
    name: "Payments Canada SUMMIT",
    startDate: "2027-05-04",
    endDate: "2027-05-06",
    city: "Toronto",
    country: "Canada",
    region: "North America",
    vertical: "Payments / Financial Infrastructure",
    audience: 2000,
    personas: ["Payment companies", "Banks", "Fintech", "Payment infrastructure", "Payment executives", "Financial institutions"],
    estimatedBuyerDensity: 8,
    fxFit: 8,
    travelFit: 1,
    source: "https://www.thesummit.ca/",
    sourceLabel: "Payments Canada SUMMIT official page",
    reason: "Strong concentration of payments infrastructure, financial institutions, and fintech decision-makers.",
  },
  {
    id: "saastr-ai-annual-2027",
    name: "SaaStr AI Annual",
    startDate: "2027-05-11",
    endDate: "2027-05-12",
    city: "San Mateo",
    country: "USA",
    region: "North America",
    vertical: "SaaS / B2B Technology",
    audience: 10000,
    personas: ["SaaS founders", "CFO / Finance", "CEOs", "B2B executives", "Marketplace leaders", "Scale-ups"],
    estimatedBuyerDensity: 6,
    fxFit: 6,
    travelFit: 1,
    source: "https://www.saastrannual.com/",
    sourceLabel: "SaaStr official page",
    reason: "Useful for fast-growing SaaS and marketplace companies expanding internationally and developing meaningful FX exposure, but less concentrated than payments or treasury events.",
  },
  {
    id: "phocuswright-europe-2027",
    name: "Phocuswright Europe",
    startDate: "2027-05-24",
    endDate: "2027-05-26",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    vertical: "Travel Tech",
    audience: null,
    personas: ["OTAs", "Travel technology", "Travel platforms", "Hotels", "Travel executives", "Travel investors", "Tour operators"],
    estimatedBuyerDensity: 9,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.phocuswright.com/events",
    sourceLabel: "Phocuswright events page",
    reason: "Strong concentration of senior digital travel, distribution, and technology decision-makers.",
  },
  {
    id: "money2020-europe-2027",
    name: "Money20/20 Europe",
    startDate: "2027-06-08",
    endDate: "2027-06-10",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    vertical: "Fintech / Payments",
    audience: 7400,
    personas: ["PSP", "Fintech", "Banking", "Cross-border payments", "Payment leaders", "Financial institutions"],
    estimatedBuyerDensity: 10,
    fxFit: 10,
    travelFit: 3,
    source: "https://europe.money2020.com/",
    sourceLabel: "Money20/20 Europe official page",
    reason: "Excellent concentration of European payments and fintech prospects with cross-border currency exposure.",
  },
  {
    id: "traveltech-show-2027",
    name: "TravelTech Show",
    startDate: "2027-06-23",
    endDate: "2027-06-24",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    vertical: "Travel Tech",
    audience: 700,
    personas: ["Travel technology buyers", "OTAs", "Tour operators", "Travel platforms", "Payments", "Travel finance"],
    estimatedBuyerDensity: 9,
    fxFit: 8,
    travelFit: 10,
    source: "https://traveltech-show.com/",
    sourceLabel: "TravelTech Show official page",
    reason: "Smaller but highly targeted travel technology event with potentially high buyer density for Grain.",
  },
  {
    id: "sibos-2027",
    name: "Sibos",
    startDate: "2027-09-20",
    endDate: "2027-09-23",
    city: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    vertical: "Banking / Payments / Financial Infrastructure",
    audience: 12500,
    personas: ["Banks", "Payments", "Transaction banking", "Fintech", "Treasury", "Cross-border payments", "FX"],
    estimatedBuyerDensity: 9,
    fxFit: 10,
    travelFit: 2,
    source: "https://www.sibos.com/about/future-sibos",
    sourceLabel: "Sibos future events page",
    reason: "Highly concentrated gathering of banks, transaction banking teams, payment infrastructure providers, and fintechs. Strong cross-border payments and FX relevance.",
  },
  {
    id: "iftm-paris-2027",
    name: "IFTM - International & French Travel Market",
    startDate: "2027-10-05",
    endDate: "2027-10-07",
    city: "Paris",
    country: "France",
    region: "Europe",
    vertical: "Travel / Tourism",
    audience: 34638,
    personas: ["Travel agencies", "Tour operators", "Travel wholesalers", "Travel managers", "Travel technology", "MICE buyers", "Travel purchasing managers"],
    estimatedBuyerDensity: 7,
    fxFit: 8,
    travelFit: 10,
    source: "https://www.iftm.fr/en-gb.html",
    sourceLabel: "IFTM official page",
    reason: "Large B2B travel trade show with a significant travel-agency audience and many businesses exposed to international supplier and customer currencies.",
  },
  {
    id: "eurofinance-international-2027",
    name: "EuroFinance International Treasury Management",
    startDate: "2027-10-06",
    endDate: "2027-10-08",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    vertical: "Treasury / FX",
    audience: 2700,
    personas: ["Corporate treasurer", "CFO / Finance", "FX risk", "Cash management", "Banks", "Treasury technology"],
    estimatedBuyerDensity: 10,
    fxFit: 10,
    travelFit: 1,
    source: "https://www.eurofinance.com/international-treasury-event/",
    sourceLabel: "EuroFinance International Treasury page",
    reason: "Exceptionally strong direct fit for Grain, bringing together senior treasury professionals responsible for FX risk, liquidity, cross-border payments, and treasury transformation.",
  },
];

const sampleLeads = [
  {
    id: "lead-1",
    conferenceId: "itb-berlin-2027",
    name: "Maya Cohen",
    company: "AtlasPay Travel",
    email: "maya.cohen@atlaspay.example",
    title: "Director of Payments",
    signal: "Travel wholesaler or OTA",
    stage: "Problem confirmed",
    notes: "Large EUR and GBP supplier exposure. Wants a sharper way to protect margin without slowing bookings.",
    tags: ["FX exposure", "Travel flow"],
    createdAt: "2027-03-16T11:30:00.000Z",
  },
  {
    id: "lead-2",
    conferenceId: "wtm-london-2026",
    name: "Maya K. Cohen",
    company: "AtlasPay",
    email: "maya.cohen@atlaspay.example",
    title: "VP Payments",
    signal: "Cross-border payments",
    stage: "Asked for follow-up",
    notes: "New title. Asked for CFO-ready material and named Q4 budget review.",
    tags: ["CFO owner", "Follow up today"],
    createdAt: "2026-11-03T09:10:00.000Z",
  },
  {
    id: "lead-3",
    conferenceId: "mpe-2027",
    name: "Jonas Richter",
    company: "Northstar Acquiring",
    email: "jonas@northstar.example",
    title: "Partnerships Lead",
    signal: "PSP or merchant acquiring",
    stage: "Quick booth scan",
    notes: "Interested in partner story but no owned problem yet.",
    tags: ["Payments volume"],
    createdAt: "2027-03-09T16:45:00.000Z",
  },
  {
    id: "lead-4",
    conferenceId: "pay360-2027",
    name: "Jon Richter",
    company: "Northstar Payments",
    email: "jonas@northstar.example",
    title: "Director, Strategic Partnerships",
    signal: "PSP or merchant acquiring",
    stage: "Quick booth scan",
    notes: "Second conversation, still researching vendors. Asked broad pricing questions.",
    tags: ["Payments volume"],
    createdAt: "2027-04-21T14:05:00.000Z",
  },
];

let leads = loadJson(storageKeys.leads, []);
let settings = loadJson(storageKeys.settings, {
  openAiKey: "",
  openAiModel: DEFAULT_MODEL,
  hubspotToken: "",
  webhookUrl: "",
});
let activeTags = [];
let leadListState = {
  search: "",
  signal: "all",
  stage: "all",
  conferenceId: "all",
  sort: "newest",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", async () => {
  await loadInitialLeads();
  initNavigation();
  initFilters();
  initLeadControls();
  initLeadForm();
  initScanCapture();
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

async function loadInitialLeads() {
  if (leads.length) {
    leads = normalizeImportedLeads(leads);
    saveLeads();
    return;
  }
  leads = await loadSeedLeads();
  saveLeads();
}

async function loadSeedLeads() {
  try {
    const response = await fetch(LEADS_DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${LEADS_DATA_URL}`);
    return normalizeImportedLeads(await response.json());
  } catch {
    return sampleLeads;
  }
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
      const view = $(`#${tab.dataset.view}`);
      view.classList.add("active");
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

function initLeadControls() {
  fillSelect($("#leadSignalFilter"), leadSignals, "all");
  fillSelect($("#leadStageFilter"), leadStages, "all");
  fillSelect(
    $("#leadConferenceFilter"),
    conferences.map((conference) => ({ value: conference.id, label: conference.name })),
    "all",
  );

  $("#leadSearch").addEventListener("input", (event) => {
    leadListState.search = event.target.value.trim().toLowerCase();
    renderLeads();
  });
  $("#leadSignalFilter").addEventListener("input", (event) => {
    leadListState.signal = event.target.value;
    renderLeads();
  });
  $("#leadStageFilter").addEventListener("input", (event) => {
    leadListState.stage = event.target.value;
    renderLeads();
  });
  $("#leadConferenceFilter").addEventListener("input", (event) => {
    leadListState.conferenceId = event.target.value;
    renderLeads();
  });
  $("#leadSort").addEventListener("input", (event) => {
    leadListState.sort = event.target.value;
    renderLeads();
  });
}

function fillSelect(select, options, keepFirstValue = null) {
  const first = keepFirstValue ? select.querySelector(`option[value="${keepFirstValue}"]`) : null;
  select.innerHTML = "";
  if (first) select.append(first);
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = typeof option === "string" ? option : option.value;
    element.textContent = typeof option === "string" ? option : option.label;
    select.append(element);
  });
}

function initLeadForm() {
  fillSelect(
    $("#leadConference"),
    conferences.map((conference) => conference.name),
  );
  fillSelect($("#leadSignal"), leadSignals);
  fillSelect($("#leadStage"), leadStages);
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

function initScanCapture() {
  $("#scanBadge").addEventListener("click", () => $("#badgeImageInput").click());
  $("#scanCard").addEventListener("click", () => $("#cardImageInput").click());
  $("#scanQr").addEventListener("click", () => $("#qrImageInput").click());
  $("#badgeImageInput").addEventListener("change", (event) => handleLeadImage(event, "badge"));
  $("#cardImageInput").addEventListener("change", (event) => handleLeadImage(event, "business card"));
  $("#qrImageInput").addEventListener("change", (event) => handleLeadImage(event, "qr code"));
  $("#recordConversation").addEventListener("click", () => {
    setScanStatus(
      "Recording is next",
      "Future version: record the conversation, transcribe it, and add pain, urgency, owner, and next step to the lead notes.",
    );
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

async function handleLeadImage(event, scanType) {
  const file = event.target.files?.[0];
  if (!file) return;

  const dataUrl = await readFileAsDataUrl(file);
  $("#scanPreview").src = dataUrl;
  $("#scanPreview").hidden = false;
  setScanStatus("Reading image", `Trying to extract lead details from the ${scanType}.`);

  try {
    const extracted =
      scanType === "qr code"
        ? await extractLeadFromQrOrImage(file, dataUrl)
        : settings.openAiKey
          ? await extractLeadFromImage(dataUrl, scanType)
          : demoExtractedLead(scanType);
    fillLeadForm(extracted);
    setScanStatus(
      settings.openAiKey ? "Fields filled from scan" : "Demo fields filled",
      settings.openAiKey
        ? "Review the fields, add a quick conversation note, then save."
        : "No AI key is configured, so demo data shows how scan-to-fill works.",
    );
  } catch (error) {
    setScanStatus(
      "Scan did not read cleanly",
      `${error.message}. Try a clearer image or type the missing fields manually.`,
    );
  } finally {
    event.target.value = "";
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Could not read the selected image")));
    reader.readAsDataURL(file);
  });
}

async function extractLeadFromImage(dataUrl, scanType) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.openAiKey}`,
    },
    body: JSON.stringify({
      model: settings.openAiModel || DEFAULT_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `Extract lead details from this conference ${scanType}. Return only JSON with these keys: ` +
                "name, company, email, title, signal, notes. " +
                `Use one signal from: ${leadSignals.join(", ")}. ` +
                "If a field is missing, return an empty string. Keep notes short and factual.",
            },
            { type: "input_image", image_url: dataUrl },
          ],
        },
      ],
      max_output_tokens: 350,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned ${response.status}`);
  }

  const data = await response.json();
  const text = data.output_text || "";
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text;
  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error("The extraction response was not valid JSON");
  }
}

function demoExtractedLead(scanType) {
  if (scanType === "badge") {
    return {
      name: "Daniel Park",
      company: "NomadPay",
      email: "daniel.park@nomadpay.example",
      title: "Head of Cross-Border Payments",
      signal: "Cross-border payments",
      notes: "Captured from demo conference badge. Confirm FX exposure and payment volume before follow-up.",
    };
  }
  if (scanType === "qr code") {
    return {
      name: "Ari Levin",
      company: "BridgeRoute Payments",
      email: "ari.levin@bridgeroute.example",
      title: "VP Treasury Operations",
      signal: "Cross-border payments",
      notes: "Captured from demo QR code. Ask about treasury owner, settlement currencies, and hedge workflow.",
    };
  }
  return {
    name: "Elena Rossi",
    company: "VistaBeds Wholesale",
    email: "elena.rossi@vistabeds.example",
    title: "Finance Director",
    signal: "Travel wholesaler or OTA",
    notes: "Captured from demo business card. Ask about supplier currency exposure and margin leakage.",
  };
}

function fillLeadForm(lead) {
  if (lead.name) $("#leadName").value = lead.name;
  if (lead.company) $("#leadCompany").value = lead.company;
  if (lead.email) $("#leadEmail").value = lead.email;
  if (lead.title) $("#leadTitle").value = lead.title;
  if (lead.signal) $("#leadSignal").value = lead.signal;
  if (lead.notes) {
    $("#leadNotes").value = $("#leadNotes").value
      ? `${$("#leadNotes").value}\n${lead.notes}`
      : lead.notes;
  }
}

function setScanStatus(title, body) {
  $("#scanStatus").innerHTML = `<strong>${title}</strong><p>${body}</p>`;
}

function initActions() {
  $("#resetData").addEventListener("click", async () => {
    leads = await loadSeedLeads();
    saveLeads();
    renderAll();
  });
  $("#runAi").addEventListener("click", generateAiCoachNote);
  $("#copyAiPrompt").addEventListener("click", copyAiPrompt);
  $("#pushHubspot").addEventListener("click", pushLead);
  $("#exportCsv").addEventListener("click", exportCsv);
  $("#exportJson").addEventListener("click", exportJson);
  $("#importJsonButton").addEventListener("click", () => $("#importJsonInput").click());
  $("#importJsonInput").addEventListener("change", importJson);
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
    badge.textContent = `Tier ${conference.fit.tier}${SEPARATOR}${conference.fit.score}`;
    badge.classList.add(`tier-${conference.fit.tier.toLowerCase()}`);
    template.querySelector(".date-pill").textContent = formatDateRange(conference);
    template.querySelector("h3").textContent = conference.name;
    template.querySelector(".meta").textContent =
      `${conference.city}, ${conference.country}${SEPARATOR}${conference.vertical}${SEPARATOR}${formatAudience(conference.audience)}`;
    template.querySelector(".reason").textContent = conference.reason;
    template.querySelector(".score-bar span").style.width = `${conference.fit.score}%`;
    template.querySelector(".score-details").addEventListener("click", () => {
      openScoreDialog(conference);
    });
    template.querySelector(".capture-here").addEventListener("click", () => {
      openView("field");
      $("#leadConference").value = conference.name;
    });
    grid.append(template);
  });

  if (!filtered.length) {
    grid.innerHTML = '<p class="insight-item">No events match this filter set. Loosen the tier, region, or search term.</p>';
  }
}

function openScoreDialog(conference) {
  const dialog = $("#scoreDialog");
  const fit = scoreConference(conference);
  $("#scoreDialogTitle").textContent = `${conference.name}${SEPARATOR}Tier ${fit.tier}${SEPARATOR}${fit.score}/100`;
  $("#scoreDialogBody").innerHTML = `
    ${scoreMetric("Persona fit", fit.parts.personaFit, 30)}
    ${scoreMetric("FX relevance", fit.parts.fxRelevance, 25)}
    ${scoreMetric("Audience quality", fit.parts.audienceQuality, 15)}
    ${scoreMetric("Travel wedge", fit.parts.travelBonus, 8)}
    ${scoreMetric("Cluster leverage", fit.parts.clusterBonus, 8)}
    <p class="score-note">${conference.reason}</p>
    <p class="score-note">Use Tier A for must-cover events, Tier B for targeted meetings, and Tier C for opportunistic coverage.</p>
  `;
  dialog.showModal();
}

function scoreMetric(label, value, max) {
  const percent = Math.round((value / max) * 100);
  return `
    <div class="score-metric">
      <strong>${label}</strong>
      <span class="score-bar"><span style="width: ${percent}%"></span></span>
      <span>${Math.round(value)}/${max}</span>
    </div>
  `;
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
      title: `${cluster.region}${SEPARATOR}${cluster.label}`,
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
  const feed = $("#leadFeed");
  const visibleLeads = getVisibleLeads();
  feed.innerHTML = "";

  if (!visibleLeads.length) {
    feed.innerHTML = '<p class="insight-item">No saved leads match this view. Clear filters or scan a new lead.</p>';
    return;
  }

  visibleLeads.forEach((lead) => {
    const conference = getConference(lead.conferenceId);
    const relationshipCount = getRelationshipCount(lead);
    const card = document.createElement("article");
    const header = document.createElement("header");
    const identity = document.createElement("div");
    const name = document.createElement("h4");
    const company = document.createElement("p");
    const score = document.createElement("span");
    const meta = document.createElement("div");
    const notes = document.createElement("p");

    card.className = "lead-card";
    score.className = "lead-score";
    meta.className = "lead-meta";
    name.textContent = lead.name;
    company.textContent = `${lead.company}${lead.title ? `${SEPARATOR}${lead.title}` : ""}`;
    score.textContent = leadQualityScore(lead);
    notes.textContent = lead.notes || "No field notes yet. Add the pain, owner, urgency, or promised next step.";

    identity.append(name, company);
    header.append(identity, score);
    [conference.name, lead.stage, lead.signal, `${relationshipCount} touch${relationshipCount === 1 ? "" : "es"}`].forEach(
      (label) => meta.append(createTag(label)),
    );
    card.append(header, meta, notes);
    feed.append(card);
  });
}

async function extractLeadFromQrOrImage(file, dataUrl) {
  const qrValue = await decodeQrImage(file);
  if (qrValue) {
    return parseQrLead(qrValue);
  }
  return settings.openAiKey ? extractLeadFromImage(dataUrl, "qr code") : demoExtractedLead("qr code");
}

async function decodeQrImage(file) {
  if (!("BarcodeDetector" in window)) return "";
  const detector = new BarcodeDetector({ formats: ["qr_code"] });
  const bitmap = await createImageBitmap(file);
  try {
    const codes = await detector.detect(bitmap);
    return codes[0]?.rawValue || "";
  } finally {
    bitmap.close?.();
  }
}

function parseQrLead(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("QR code was empty");

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    return parseVCard(trimmed);
  }
  if (/^MECARD:/i.test(trimmed)) {
    return parseMeCard(trimmed);
  }

  try {
    const url = new URL(trimmed);
    const params = url.searchParams;
    return {
      name: params.get("name") || params.get("fullName") || "",
      company: params.get("company") || params.get("org") || "",
      email: params.get("email") || "",
      title: params.get("title") || "",
      signal: params.get("signal") || "Cross-border payments",
      notes: params.get("notes") || `QR source: ${url.hostname}`,
    };
  } catch {
    throw new Error("QR code did not contain a recognized lead format");
  }
}

function parseVCard(value) {
  const field = (name) => {
    const line = value.split(/\r?\n/).find((item) => item.toUpperCase().startsWith(`${name}:`));
    return line ? line.slice(line.indexOf(":") + 1).trim() : "";
  };
  return {
    name: field("FN") || field("N").replaceAll(";", " ").trim(),
    company: field("ORG"),
    email: field("EMAIL"),
    title: field("TITLE"),
    signal: "Cross-border payments",
    notes: "Captured from QR vCard.",
  };
}

function parseMeCard(value) {
  const body = value.replace(/^MECARD:/i, "").replace(/;$/, "");
  const parts = Object.fromEntries(
    body
      .split(";")
      .map((part) => part.split(":"))
      .filter(([key, val]) => key && val)
      .map(([key, ...rest]) => [key.toUpperCase(), rest.join(":")]),
  );
  return {
    name: (parts.N || "").replace(",", " ").trim(),
    company: parts.ORG || "",
    email: parts.EMAIL || "",
    title: parts.TITLE || "",
    signal: "Cross-border payments",
    notes: "Captured from QR meCard.",
  };
}

function getVisibleLeads() {
  return leads
    .filter((lead) => {
      const conference = getConference(lead.conferenceId);
      const searchable = [
        lead.name,
        lead.company,
        lead.email,
        lead.title,
        lead.signal,
        lead.stage,
        lead.notes,
        lead.tags.join(" "),
        conference.name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(leadListState.search) &&
        (leadListState.signal === "all" || lead.signal === leadListState.signal) &&
        (leadListState.stage === "all" || lead.stage === leadListState.stage) &&
        (leadListState.conferenceId === "all" || lead.conferenceId === leadListState.conferenceId)
      );
    })
    .sort(compareLeads);
}

function compareLeads(a, b) {
  const sorters = {
    newest: () => dateValue(b.createdAt) - dateValue(a.createdAt),
    oldest: () => dateValue(a.createdAt) - dateValue(b.createdAt),
    quality: () => leadQualityScore(b) - leadQualityScore(a),
    relationship: () => getRelationshipCount(b) - getRelationshipCount(a),
    conference: () => scoreConference(getConference(b.conferenceId)).score - scoreConference(getConference(a.conferenceId)).score,
    stage: () => (stageScores[b.stage] || 0) - (stageScores[a.stage] || 0),
    company: () => a.company.localeCompare(b.company),
  };
  const primary = (sorters[leadListState.sort] || sorters.newest)();
  return primary || dateValue(b.createdAt) - dateValue(a.createdAt);
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
          <p class="meta">${last.company}${SEPARATOR}${conferencesMet.length} conferences${SEPARATOR}${sorted.length} conversations</p>
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
    list.innerHTML = '<p class="insight-item">No repeat contacts yet. As reps scan more leads, this view will flag warming or stalled relationships.</p>';
  }
}

function renderLeadSelectors() {
  const options = leads.map((lead) => ({ value: lead.id, label: leadLabel(lead) }));
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

function createTag(label) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = label;
  return tag;
}

function scoreConference(event) {
  const personaFit = Math.min(30, event.personas.length * 5 + event.estimatedBuyerDensity * 2);
  const fxRelevance = event.fxFit * 2.5;
  const audienceQuality = event.audience ? Math.min(15, Math.log10(event.audience) * 4) : 8;
  const travelBonus = event.travelFit >= 8 ? 8 : event.travelFit >= 5 ? 4 : 0;
  const clusterBonus = getClusters(false).some((cluster) => cluster.events.some((item) => item.id === event.id)) ? 8 : 0;
  const score = Math.round(personaFit + fxRelevance + audienceQuality + travelBonus + clusterBonus);
  const tier = score >= 78 ? "A" : score >= 62 ? "B" : "C";
  const explanation =
    `Persona fit ${Math.round(personaFit)}/30, FX relevance ${Math.round(fxRelevance)}/25, ` +
    `audience quality ${Math.round(audienceQuality)}/15, travel wedge ${travelBonus}/8, cluster leverage ${clusterBonus}/8.`;
  return {
    score: Math.min(score, 100),
    tier,
    explanation,
    parts: { personaFit, fxRelevance, audienceQuality, travelBonus, clusterBonus },
  };
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
    let matchResult = null;
    const existing = groups.find((group) => {
      matchResult = isSameContact(group.leads[0], lead);
      return matchResult.same;
    });
    if (existing && matchResult) {
      existing.leads.push(lead);
      existing.matchReason = matchResult.reason;
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
        model: settings.openAiModel || DEFAULT_MODEL,
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
  const conference = getConference(lead.conferenceId);
  const base = scoreConference(conference).score * 0.45;
  const signalScore = signalScores[lead.signal] || 0;
  const stageScore = stageScores[lead.stage] || 0;
  return Math.min(100, Math.round(base + signalScore + stageScore));
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
    title: String(lead.title || "").trim(),
    signal: leadSignals.includes(lead.signal) ? lead.signal : leadSignals[0],
    stage: leadStages.includes(lead.stage) ? lead.stage : leadStages[0],
    notes: String(lead.notes || "").trim(),
    tags: Array.isArray(lead.tags) ? lead.tags.map(String) : [],
    createdAt: lead.createdAt || new Date().toISOString(),
  }));
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getSelectedLead(selector) {
  const id = $(selector).value;
  return leads.find((lead) => lead.id === id);
}

function getConference(id) {
  return conferences.find((conference) => conference.id === id);
}

function leadLabel(lead) {
  return [lead.name, lead.company, getConference(lead.conferenceId).name].join(SEPARATOR);
}

function getRelationshipCount(lead) {
  const group = getRelationshipGroups().find((item) => item.leads.some((groupLead) => groupLead.id === lead.id));
  return group?.leads.length || 1;
}

function dateValue(value) {
  return new Date(value).getTime() || 0;
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

function formatAudience(audience) {
  return audience ? `~${formatNumber(audience)} attendees` : "audience not public";
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


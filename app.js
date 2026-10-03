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
let conferencePage = 1;
let clusterPage = 1;
let leadPage = 1;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

document.addEventListener("DOMContentLoaded", async () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  await loadInitialLeads();
  initNavigation();
  initFilters();
  initLeadControls();
  initLeadForm();
  initScanCapture();
  initSettings();
  initActions();
  initDialogs();
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

function loadInitialLeads() {
  if (!Array.isArray(leads)) {
    leads = normalizeImportedLeads(demoLeads);
    saveLeads();
    return;
  }
  if (leads.length) {
    leads = normalizeImportedLeads(leads);
    saveLeads();
    return;
  }
  leads = normalizeImportedLeads(demoLeads);
  saveLeads();
}

function saveSettings() {
  localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
}

function syncOpenAiSettingsFromUi() {
  const saved = loadJson(storageKeys.settings, {});
  const keyInput = $("#openAiKey");
  const modelInput = $("#openAiModel");
  const openAiKey = keyInput?.value.trim() || saved.openAiKey || "";
  const openAiModel = modelInput?.value.trim() || saved.openAiModel || DEFAULT_MODEL;

  settings = {
    ...settings,
    ...saved,
    openAiKey,
    openAiModel,
  };

  if (keyInput && keyInput.value !== settings.openAiKey) keyInput.value = settings.openAiKey;
  if (modelInput && modelInput.value !== settings.openAiModel) modelInput.value = settings.openAiModel;

  return settings;
}

function initNavigation() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => item.classList.remove("active"));
      $$(".view").forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      const view = $(`#${tab.dataset.view}`);
      view.classList.add("active");
      scrollToPageTop();
    });
  });
}

function scrollToPageTop() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.documentElement.scrollTo?.({ top: 0, left: 0, behavior: "smooth" });
    document.body.scrollTo?.({ top: 0, left: 0, behavior: "smooth" });
  });
}

function scrollToElementTop(element, options = {}) {
  if (!element) return;
  requestAnimationFrame(() => {
    const headerOffset = $(".topbar")?.offsetHeight || 0;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
    if (options.onlyWhenBelow && window.scrollY <= top + 24) return;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "smooth" });
  });
}

function preserveScrollPosition(callback) {
  const scrollingElement = document.scrollingElement || document.documentElement;
  const top = scrollingElement.scrollTop;
  const left = scrollingElement.scrollLeft;
  callback();
  scrollingElement.scrollTo({ top, left, behavior: "auto" });
  requestAnimationFrame(() => {
    scrollingElement.scrollTo({ top, left, behavior: "auto" });
  });
}

function initFilters() {
  const verticals = unique(conferences.map((event) => event.vertical));
  const regions = unique(conferences.map((event) => event.region));
  fillSelect($("#verticalFilter"), verticals, "all");
  fillSelect($("#regionFilter"), regions, "all");
  ["#searchInput", "#verticalFilter", "#regionFilter", "#tierFilter"].forEach((id) => {
    $(id).addEventListener("input", () => {
      conferencePage = 1;
      renderConferences();
    });
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
    leadPage = 1;
    renderLeads();
  });
  $("#leadSignalFilter").addEventListener("input", (event) => {
    leadListState.signal = event.target.value;
    leadPage = 1;
    renderLeads();
  });
  $("#leadStageFilter").addEventListener("input", (event) => {
    leadListState.stage = event.target.value;
    leadPage = 1;
    renderLeads();
  });
  $("#leadConferenceFilter").addEventListener("input", (event) => {
    leadListState.conferenceId = event.target.value;
    leadPage = 1;
    renderLeads();
  });
  $("#leadSort").addEventListener("input", (event) => {
    leadListState.sort = event.target.value;
    leadPage = 1;
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
    [{ value: "", label: "Select conference" }, ...conferences.map((conference) => conference.name)],
  );
  fillSelect($("#leadSignal"), leadSignals);
  fillSelect($("#leadStage"), leadStages);
  $("#leadForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedConference = conferences.find((conference) => conference.name === $("#leadConference").value);
    if (!selectedConference) {
      $("#leadConference").focus();
      alert("Choose a conference before saving this lead.");
      return;
    }
    const lead = {
      id: crypto.randomUUID(),
      conferenceId: selectedConference.id,
      name: $("#leadName").value.trim(),
      company: $("#leadCompany").value.trim(),
      email: $("#leadEmail").value.trim(),
      phone: $("#leadPhone").value.trim(),
      title: $("#leadTitle").value.trim(),
      signal: $("#leadSignal").value,
      stage: $("#leadStage").value,
      notes: $("#leadNotes").value.trim(),
      tags: activeTags,
      createdAt: new Date().toISOString(),
    };
    leads = [lead, ...leads];
    saveLeads();
    clearLeadForm();
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

  $("#clearLeadForm").addEventListener("click", clearLeadForm);
}

function clearLeadForm() {
  $("#leadForm").reset();
  activeTags = [];
  $$(".quick-tags button").forEach((button) => {
    button.classList.remove("active");
    button.style.background = "";
  });
  ["badgeImageInput", "cardImageInput", "qrImageInput"].forEach((id) => {
    const input = $(`#${id}`);
    if (input) input.value = "";
  });
  const preview = $("#scanPreview");
  preview.removeAttribute("src");
  preview.hidden = true;
  setScanStatus(
    "Start with a scan",
    "Use badge, card, or QR capture to prefill the lead. Local OCR is used when no AI key is available.",
  );
}

function initActions() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("#saveOpenAiSettings")) {
      saveOpenAiSettings();
    }
  });
  onClick("#runAi", generateAiCoachNote);
  onClick("#copyAiPrompt", copyAiPrompt);
  onClick("#pushHubspot", pushLead);
  onClick("#exportCsv", exportCsv);
  onClick("#exportJson", exportJson);
  onClick("#importJsonButton", () => $("#importJsonInput")?.click());
  $("#importJsonInput")?.addEventListener("change", importJson);
}

function onClick(selector, handler) {
  $(selector)?.addEventListener("click", handler);
}

function initDialogs() {
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
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
  const pagination = getPaginationContainer("conferencePagination", grid);
  const search = $("#searchInput").value.toLowerCase();
  const vertical = $("#verticalFilter").value;
  const region = $("#regionFilter").value;
  const tier = $("#tierFilter").value;
  grid.innerHTML = "";
  pagination.innerHTML = "";

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / CONFERENCES_PER_PAGE));
  conferencePage = Math.min(conferencePage, totalPages);
  const visibleConferences = paginate(filtered, conferencePage, CONFERENCES_PER_PAGE);

  visibleConferences.forEach((conference) => {
    const template = $("#conferenceCardTemplate").content.cloneNode(true);
    template.querySelector(".conference-card").classList.add(`event-tier-${conference.fit.tier.toLowerCase()}`);
    const badge = template.querySelector(".tier-badge");
    badge.setAttribute("role", "button");
    badge.setAttribute("tabindex", "0");
    badge.setAttribute("aria-label", `Why ${conference.name} scored ${conference.fit.score}`);
    badge.textContent = `Tier ${conference.fit.tier}${SEPARATOR}${conference.fit.score}`;
    badge.classList.add(`tier-${conference.fit.tier.toLowerCase()}`);
    badge.addEventListener("click", () => openScoreDialog(conference));
    badge.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openScoreDialog(conference);
      }
    });
    template.querySelector(".date-pill").textContent = formatDateRange(conference);
    template.querySelector("h3").textContent = conference.name;
    template.querySelector(".meta").textContent =
      `${conference.city}, ${conference.country}${SEPARATOR}${conference.vertical}${SEPARATOR}${formatAudience(conference.audience)}`;
    template.querySelector(".reason").textContent = conference.reason;
    template.querySelector(".score-bar span").style.width = `${conference.fit.score}%`;
    template.querySelector(".capture-here").addEventListener("click", () => {
      openView("field");
      $("#leadConference").value = conference.name;
    });
    const registerLink = template.querySelector(".register-event");
    registerLink.href = conference.conferenceURL || conference.source;
    registerLink.setAttribute("aria-label", `Register for ${conference.name} on ${conference.sourceLabel}`);
    grid.append(template);
  });

  if (!filtered.length) {
    grid.innerHTML = '<p class="insight-item">No events match this filter set. Loosen the tier, region, or search term.</p>';
    return;
  }

  renderPagination(pagination, {
    currentPage: conferencePage,
    totalPages,
    onPageChange: (page) => {
      conferencePage = page;
      renderConferences();
      scrollToPageTop();
    },
  });
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

  renderClusterList(getClusters());

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

function renderClusterList(clusters) {
  const list = $("#clusterList");
  const pagination = getPaginationContainer("clusterPagination", list);
  list.innerHTML = "";
  pagination.innerHTML = "";

  if (!clusters.length) {
    list.innerHTML = '<p class="insight-item">No trip clusters found yet.</p>';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(clusters.length / CLUSTERS_PER_PAGE));
  clusterPage = Math.min(clusterPage, totalPages);
  const visibleClusters = paginate(clusters, clusterPage, CLUSTERS_PER_PAGE);

  visibleClusters.forEach((cluster, index) => {
    const clusterIndex = (clusterPage - 1) * CLUSTERS_PER_PAGE + index;
    const item = document.createElement("article");
    item.className = "insight-item cluster-item";
    item.innerHTML = `
      <strong>${cluster.region}${SEPARATOR}${cluster.label}</strong>
      <p>${cluster.events.map((event) => event.name).join(", ")}. Suggested owner: ${cluster.owner}.</p>
      <button class="ghost-button small" type="button">View details</button>
    `;
    item.querySelector("button").addEventListener("click", () => openClusterDialog(cluster, clusterIndex));
    list.append(item);
  });

  renderPagination(pagination, {
    currentPage: clusterPage,
    totalPages,
    onPageChange: (page) => {
      preserveScrollPosition(() => {
        clusterPage = page;
        renderClusterList(clusters);
      });
    },
  });
}

function openClusterDialog(cluster, index) {
  $("#clusterDialogTitle").textContent = `${cluster.region}${SEPARATOR}${cluster.label}`;
  $("#clusterDialogBody").innerHTML = `
    <p class="score-note">Suggested owner: <strong>${cluster.owner}</strong>. Cluster ${index + 1} groups events that are close enough in timing or city to consider one coordinated trip.</p>
    <div class="detail-list">
      ${cluster.events
        .map((event) => {
          const fit = scoreConference(event);
          return `
            <article class="detail-row">
              <strong>${event.name}</strong>
              <p>${formatFullDateRange(event)}${SEPARATOR}${event.city}, ${event.country}</p>
              <p>${event.vertical}${SEPARATOR}Tier ${fit.tier}${SEPARATOR}${fit.score}/100${SEPARATOR}${formatAudience(event.audience)}</p>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
  $("#clusterDialog").showModal();
}

function paginate(items, currentPage, pageSize) {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function getPaginationContainer(id, anchor) {
  let container = $(`#${id}`);
  if (!container) {
    container = document.createElement("nav");
    container.id = id;
    container.className = "pagination";
    container.setAttribute("aria-label", id === "conferencePagination" ? "Conference pages" : "Trip cluster pages");
    anchor.insertAdjacentElement("afterend", container);
  }
  return container;
}

function renderPagination(container, { currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";
  const controls = document.createElement("div");
  controls.className = "pagination-controls";
  controls.append(createPageButton("<", currentPage - 1, currentPage === 1, false, onPageChange, "Previous page"));

  for (let page = 1; page <= totalPages; page += 1) {
    controls.append(createPageButton(String(page), page, false, page === currentPage, onPageChange, `Page ${page}`));
  }

  controls.append(createPageButton(">", currentPage + 1, currentPage === totalPages, false, onPageChange, "Next page"));
  container.append(controls);
}

function createPageButton(label, page, disabled, active, onPageChange, ariaLabel = label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "page-button active" : "page-button";
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.disabled = disabled;
  if (active) button.setAttribute("aria-current", "page");
  button.addEventListener("mousedown", (event) => event.preventDefault());
  button.addEventListener("click", () => onPageChange(page));
  return button;
}

function renderLeads() {
  const feed = $("#leadFeed");
  const pagination = getPaginationContainer("leadPagination", feed);
  const visibleLeads = getVisibleLeads();
  feed.innerHTML = "";
  pagination.innerHTML = "";

  if (!visibleLeads.length) {
    feed.innerHTML = '<p class="insight-item">No saved leads match this view. Clear filters or scan a new lead.</p>';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / LEADS_PER_PAGE));
  leadPage = Math.min(leadPage, totalPages);
  const pagedLeads = paginate(visibleLeads, leadPage, LEADS_PER_PAGE);

  pagedLeads.forEach((lead) => {
    const conference = getConference(lead.conferenceId);
    const relationshipCount = getRelationshipCount(lead);
    const card = document.createElement("article");
    const header = document.createElement("header");
    const identity = document.createElement("div");
    const name = document.createElement("h4");
    const company = document.createElement("p");
    const score = document.createElement("button");
    const meta = document.createElement("div");
    const notes = document.createElement("p");

    card.className = "lead-card";
    score.className = "lead-score";
    score.type = "button";
    meta.className = "lead-meta";
    name.textContent = lead.name;
    company.textContent = `${lead.company}${lead.title ? `${SEPARATOR}${lead.title}` : ""}${lead.phone ? `${SEPARATOR}${lead.phone}` : ""}`;
    score.textContent = leadQualityScore(lead);
    score.setAttribute("aria-label", `Why ${lead.name} scored ${score.textContent}`);
    score.addEventListener("click", () => openLeadScoreDialog(lead));
    notes.textContent = lead.notes || "No field notes yet. Add the pain, owner, urgency, or promised next step.";

    identity.append(name, company);
    header.append(identity, score);
    [conference.name, lead.stage, lead.signal, `${relationshipCount} touch${relationshipCount === 1 ? "" : "es"}`].forEach(
      (label) => meta.append(createTag(label)),
    );
    card.append(header, meta, notes);
    feed.append(card);
  });

  renderPagination(pagination, {
    currentPage: leadPage,
    totalPages,
    onPageChange: (page) => {
      leadPage = page;
      renderLeads();
      scrollToPageTop();
    },
  });
}

function openLeadScoreDialog(lead) {
  const conference = getConference(lead.conferenceId);
  const breakdown = leadScoreBreakdown(lead);
  const quality = leadQualityLabel(breakdown.total);
  $("#leadScoreDialogTitle").textContent = `${lead.name}${SEPARATOR}${breakdown.total}/100${SEPARATOR}${quality}`;
  $("#leadScoreDialogBody").innerHTML = `
    ${scoreMetric("Conference fit", breakdown.conferenceFit, 45)}
    ${scoreMetric("ICP signal", breakdown.signalFit, 25)}
    ${scoreMetric("Conversation stage", breakdown.stageFit, 28)}
    <div class="detail-list">
      <article class="detail-row">
        <strong>conclution</strong>
        <p>${leadScoreMeaning(breakdown.total)}</p>
      </article>
      <article class="detail-row">
        <strong>Conference fit</strong>
        <p>${conference.name} is Tier ${scoreConference(conference).tier} for Grain. This category converts the conference ICP score into up to 45 lead points.</p>
      </article>
      <article class="detail-row">
        <strong>ICP signal</strong>
        <p>${lead.signal} adds ${breakdown.signalFit}/25 based on how directly the lead maps to Grain's strongest buying triggers.</p>
      </article>
      <article class="detail-row">
        <strong>Conversation stage</strong>
        <p>${lead.stage} adds ${breakdown.stageFit}/28 based on urgency, owner clarity, and whether there is a concrete follow-up path.</p>
      </article>
    </div>
  `;
  $("#leadScoreDialog").showModal();
}

function leadScoreBreakdown(lead) {
  const conferenceFit = Math.round(scoreConference(getConference(lead.conferenceId)).score * 0.45);
  const signalFit = signalScores[lead.signal] || 0;
  const stageFit = stageScores[lead.stage] || 0;
  return {
    conferenceFit,
    signalFit,
    stageFit,
    total: Math.min(100, Math.round(conferenceFit + signalFit + stageFit)),
  };
}

function leadQualityLabel(score) {
  if (score >= 75) return "High intent";
  if (score >= 52) return "Medium intent";
  return "Low intent";
}

function leadScoreMeaning(score) {
  if (score >= 75) return "Prioritize same-day follow-up. The event context, ICP signal, and conversation stage suggest a strong chance of a relevant buyer conversation.";
  if (score >= 52) return "Worth follow-up, but qualify the business owner and urgency before investing heavy sales time.";
  return "Treat as light nurture or partner curiosity unless a clearer pain, owner, or budget signal appears.";
}

function getVisibleLeads() {
  return leads
    .filter((lead) => {
      const conference = getConference(lead.conferenceId);
      const searchable = [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
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
    const relationshipScore = relationshipScoreBreakdown(group);
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
        <div class="relationship-actions">
          <button class="lead-score relationship-score" type="button" aria-label="Why ${last.name} scored ${relationshipScore.total}">
            ${relationshipScore.total}
          </button>
          <span class="tag ${signal.kind === "warming" ? "signal-warm" : "signal-watch"}">${signal.label}</span>
        </div>
      </header>
      <p>${signal.summary}</p>
      <ul>
        <li>${titleShift}</li>
        <li>Matched by ${group.matchReason}.</li>
        <li>Seen at ${conferencesMet.join(", ")}.</li>
      </ul>
    `;
    article.querySelector(".relationship-score").addEventListener("click", () => openRelationshipScoreDialog(group));
    list.append(article);
  });

  if (!groups.length) {
    list.innerHTML = '<p class="insight-item">No repeat contacts yet. As reps scan more leads, this view will flag warming or stalled relationships.</p>';
  }
}

function openRelationshipScoreDialog(group) {
  const sorted = [...group.leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const breakdown = relationshipScoreBreakdown(group);
  const signal = relationshipSignal(sorted);
  const conferencesMet = unique(sorted.map((lead) => getConference(lead.conferenceId).name));

  $("#relationshipScoreDialogTitle").textContent = `${last.name}${SEPARATOR}${breakdown.total}/100${SEPARATOR}${relationshipScoreLabel(breakdown.total)}`;
  $("#relationshipScoreDialogBody").innerHTML = `
    ${scoreMetric("Repeat engagement", breakdown.touchFit, 22)}
    ${scoreMetric("Intent progression", breakdown.intentFit, 26)}
    ${scoreMetric("Title movement", breakdown.titleFit, 16)}
    ${scoreMetric("Conference quality", breakdown.conferenceFit, 24)}
    ${scoreMetric("Match confidence", breakdown.matchFit, 12)}
    <div class="detail-list">
      <article class="detail-row">
        <strong>Conclusion</strong>
        <p>${relationshipScoreMeaning(breakdown.total, signal)}</p>
      </article>
      <article class="detail-row">
        <strong>Repeat engagement</strong>
        <p>${sorted.length} conversations across ${conferencesMet.length} conference${conferencesMet.length === 1 ? "" : "s"}: ${conferencesMet.join(", ")}.</p>
      </article>
      <article class="detail-row">
        <strong>Intent progression</strong>
        <p>Started at ${first.stage}; latest stage is ${last.stage}. This measures whether the relationship is warming or just repeating low-intent chats.</p>
      </article>
      <article class="detail-row">
        <strong>Title movement</strong>
        <p>${normalizeTitle(first.title) !== normalizeTitle(last.title) ? `Title changed from ${first.title || "unknown"} to ${last.title || "unknown"}.` : "No title change detected yet."}</p>
      </article>
      <article class="detail-row">
        <strong>Match confidence</strong>
        <p>Records were grouped by ${group.matchReason}. Exact email matches are stronger than name/company similarity.</p>
      </article>
    </div>
  `;
  $("#relationshipScoreDialog").showModal();
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
          label: days === 0 ? "same week" : days === 1 ? "1 day apart" : `${days} days apart`,
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

function relationshipScoreBreakdown(group) {
  const sorted = [...group.leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const conferencesMet = unique(sorted.map((lead) => lead.conferenceId));
  const highestStage = Math.max(...sorted.map((lead) => stageScores[lead.stage] || 0));
  const latestStage = stageScores[last.stage] || 0;
  const repeatedLowIntent = sorted.length > 1 && sorted.every((lead) => lead.stage === "Quick booth scan");
  const titleChanged = normalizeTitle(first.title) !== normalizeTitle(last.title);
  const averageConferenceScore =
    sorted.reduce((sum, lead) => sum + scoreConference(getConference(lead.conferenceId)).score, 0) / sorted.length;

  const touchFit = Math.min(22, 8 + sorted.length * 5 + Math.max(0, conferencesMet.length - 1) * 3);
  const intentFit = repeatedLowIntent ? 6 : Math.min(26, Math.round((highestStage + latestStage) / 2));
  const titleFit = titleChanged ? 16 : normalizeTitle(last.title) ? 8 : 3;
  const conferenceFit = Math.round(averageConferenceScore * 0.24);
  const matchFit = group.matchReason.includes("email")
    ? 12
    : group.matchReason.includes("domain")
      ? 10
      : group.matchReason.includes("similarity")
        ? 8
        : 6;

  return {
    touchFit,
    intentFit,
    titleFit,
    conferenceFit,
    matchFit,
    total: Math.min(100, Math.round(touchFit + intentFit + titleFit + conferenceFit + matchFit)),
  };
}

function relationshipScoreLabel(score) {
  if (score >= 78) return "Warm relationship";
  if (score >= 55) return "Developing";
  return "Watch";
}

function relationshipScoreMeaning(score, signal) {
  if (score >= 78) {
    return "Prioritize a specific next step. The repeated engagement, intent, and event quality indicate a relationship worth active sales attention.";
  }
  if (score >= 55) {
    return "Keep the relationship moving, but qualify urgency and ownership before committing heavy follow-up time.";
  }
  return signal.kind === "watch"
    ? "Repeated contact is visible, but intent has not increased. Keep useful context flowing and wait for a clearer business owner or pain."
    : "There is enough signal to monitor, but not enough evidence yet for a high-priority relationship push.";
}


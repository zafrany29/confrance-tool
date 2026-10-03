// Shared DOM, formatting, scoring, and matching utilities.

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
  return conferences.find((conference) => conference.id === id) || conferences[0];
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

function formatFullDateRange(conference) {
  const start = new Date(`${conference.startDate}T00:00:00`);
  const end = new Date(`${conference.endDate}T00:00:00`);
  const startText = start.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  const endText = end.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  return startText === endText ? startText : `${startText} - ${endText}`;
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

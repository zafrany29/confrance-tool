// Lead capture, QR decoding, local OCR, and scan-to-form helpers.

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

async function handleLeadImage(event, scanType) {
  const file = event.target.files?.[0];
  if (!file) return;

  syncOpenAiSettingsFromUi();
  const dataUrl = await readFileAsDataUrl(file);
  $("#scanPreview").src = dataUrl;
  $("#scanPreview").hidden = false;
  setScanStatus("Reading image", `Trying to extract lead details from the ${scanType}.`);

  try {
    const extracted =
      scanType === "qr code"
        ? await extractLeadFromQrOrImage(file, dataUrl)
        : await extractLeadFromCapturedImage(file, dataUrl, scanType);
    fillLeadForm(extracted.lead);
    setScanStatus(...scanStatusForMethod(extracted, scanType));
  } catch (error) {
    setScanStatus(
      "Scan did not read cleanly",
      `${error.message}. Try a clearer image or type the missing fields manually.`,
    );
  } finally {
    event.target.value = "";
  }
}

async function extractLeadFromCapturedImage(file, dataUrl, scanType) {
  const qrValue = await decodeQrImage(file);
  if (qrValue) {
    try {
      return { lead: parseQrLead(qrValue), method: "qr" };
    } catch {
      // Some conference badge QR codes contain check-in URLs instead of lead details.
    }
  }

  if (settings.openAiKey) {
    try {
      return { lead: await extractLeadFromImage(dataUrl, scanType), method: "openai" };
    } catch (error) {
      const lead = await extractLeadWithLocalOcr(dataUrl, scanType);
      return { lead, method: "ocr", warning: `OpenAI failed: ${error.message}` };
    }
  }

  return { lead: await extractLeadWithLocalOcr(dataUrl, scanType), method: "ocr" };
}

function scanStatusForMethod(extracted, scanType) {
  if (extracted.method === "qr") {
    return ["Fields filled from QR", "Review the fields, add a quick conversation note, then save."];
  }
  if (extracted.method === "openai") {
    return ["Fields filled from OpenAI scan", "Review the fields, add a quick conversation note, then save."];
  }
  return [
    "Fields filled with local OCR",
    `${extracted.warning ? `${extracted.warning}. ` : ""}Local OCR is free and runs in the browser, but badge/card parsing may need review.`,
  ];
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
                "name, company, email, phone, title, conferenceName, signal, notes. " +
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
    const detail = await response.text();
    throw new Error(`OpenAI returned ${response.status}${detail ? `: ${detail.slice(0, 240)}` : ""}`);
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

async function extractLeadWithLocalOcr(dataUrl, scanType) {
  if (!window.Tesseract?.recognize) {
    throw new Error("Local OCR library did not load");
  }

  const ocrImage = await prepareImageForOcr(dataUrl);
  const result = await window.Tesseract.recognize(ocrImage, "eng", {
    tessedit_pageseg_mode: "6",
    preserve_interword_spaces: "1",
    logger: (progress) => {
      if (progress.status === "recognizing text") {
        setScanStatus("Reading image with local OCR", `${Math.round((progress.progress || 0) * 100)}% complete.`);
      }
    },
  });
  return parseOcrLead(result.data || {}, scanType);
}

function prepareImageForOcr(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const scale = Math.min(4, Math.max(2, 1600 / Math.max(image.width, image.height)));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const gray = pixels.data[i] * 0.299 + pixels.data[i + 1] * 0.587 + pixels.data[i + 2] * 0.114;
        const contrasted = gray < 150 ? Math.max(0, gray - 35) : Math.min(255, gray + 45);
        pixels.data[i] = contrasted;
        pixels.data[i + 1] = contrasted;
        pixels.data[i + 2] = contrasted;
      }
      context.putImageData(pixels, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    });
    image.addEventListener("error", () => reject(new Error("Could not prepare image for local OCR")));
    image.src = dataUrl;
  });
}

function parseOcrLead(data, scanType) {
  const ocrLines = getOcrLineItems(data);
  const lines = unique(ocrLines.map((item) => item.text).filter((line) => line.length >= 2));
  const joined = lines.join(" ");
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = findPhoneNumber(lines, email);
  const positioned = extractPositionedLead(ocrLines, email, phone);
  const title = positioned.title || findTitleLine(lines, "", "", email);
  const company = positioned.company || findCompanyLine(lines, email, title);
  const name = positioned.name || findNameLine(lines, company, email, title);
  const conference = findConferenceInText(joined);

  if (!email && !name && !company) {
    throw new Error("Local OCR could not find lead details");
  }

  return {
    name,
    company,
    email,
    phone,
    title,
    conferenceId: conference?.id || "",
    conferenceName: conference?.name || "",
    signal: inferSignalFromText(joined),
    notes: buildCaptureNote(scanType, { name, company, title, email, phone }),
  };
}

function buildCaptureNote(scanType, lead = {}) {
  const capturedAt = new Date().toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const details = [
    lead.name,
    [lead.title, lead.company].filter(Boolean).join(" at "),
    lead.email,
    lead.phone,
  ].filter(Boolean);

  return [
    `Scanned ${scanType} on ${capturedAt}.`,
    details.length ? `Contact: ${details.join(" - ")}.` : "Contact: review scanned details.",
    "",
    "Personal notes:",
    "",
  ].join("\n");
}

function getOcrLineItems(data) {
  const sourceLines = Array.isArray(data.lines) && data.lines.length
    ? data.lines
    : String(data.text || "")
      .split(/\r?\n/)
      .map((text) => ({ text }));

  return sourceLines
    .map((line, index) => {
      const text = cleanOcrLine(line.text || "");
      const bbox = line.bbox || {};
      return {
        text,
        index,
        confidence: Number(line.confidence) || 0,
        bbox: {
          x0: Number(bbox.x0) || 0,
          y0: Number(bbox.y0) || index * 20,
          x1: Number(bbox.x1) || 0,
          y1: Number(bbox.y1) || index * 20 + 12,
        },
      };
    })
    .filter((line) => line.text.length >= 2)
    .sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0);
}

function extractPositionedLead(ocrLines, email, phone) {
  const anchor = ocrLines.find((line) => email && line.text.includes(email)) ||
    ocrLines.find((line) => phone && normalizePhone(line.text).includes(normalizePhone(phone))) ||
    null;
  const averageHeight = averageLineHeight(ocrLines);
  const nearby = anchor
    ? ocrLines.filter((line) => {
      const verticalDistance = Math.abs(lineCenterY(line) - lineCenterY(anchor));
      const closeHorizontally = overlapsHorizontally(line, anchor) || Math.abs(lineCenterX(line) - lineCenterX(anchor)) < 280;
      return verticalDistance <= averageHeight * 7 && closeHorizontally;
    })
    : ocrLines;
  const nearbyTexts = nearby.map((line) => line.text);

  const title = findTitleLine(nearbyTexts, "", "", email);
  const titleLine = nearby.find((line) => line.text === title);
  const company = findCompanyNearAnchor(nearby, titleLine, email) || findCompanyLine(nearbyTexts, email, title);
  const companyLine = nearby.find((line) => line.text === company);
  const name = findNameNearTitle(nearby, titleLine, companyLine, email) || findNameLine(nearbyTexts, company, email, title);

  return { name, company, title };
}

function findNameNearTitle(lines, titleLine, companyLine, email) {
  const upperBound = titleLine?.bbox.y0 ?? companyLine?.bbox.y0 ?? Infinity;
  const candidates = lines
    .filter((line) => line.bbox.y1 <= upperBound + averageLineHeight(lines) * 0.8)
    .filter((line) => !line.text.includes(email) && !isEventNoise(line.text) && !looksLikeContactLine(line.text))
    .map((line) => ({ line, score: scoreNameLine(line.text, line.index, lines.map((item) => item.text), titleLine?.text || "") }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.line.bbox.y0 - a.line.bbox.y0);
  return candidates[0]?.line.text || "";
}

function findCompanyNearAnchor(lines, titleLine, email) {
  const lowerBound = titleLine?.bbox.y1 ?? -Infinity;
  const candidates = lines
    .filter((line) => line.bbox.y0 >= lowerBound - averageLineHeight(lines) * 0.6)
    .map((line) => ({ line, score: scoreCompanyLine(line.text, titleLine?.text || "", email) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.line.bbox.y0 - b.line.bbox.y0);
  return candidates[0]?.line.text || "";
}

function findPhoneNumber(lines, email) {
  const candidates = lines
    .filter((line) => !line.includes(email) && !isEventNoise(line))
    .map((line) => line.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,}\d{3,4}/)?.[0] || "")
    .map((phone) => phone.trim())
    .filter((phone) => normalizePhone(phone).length >= 7);
  return candidates[0] || "";
}

function normalizePhone(value = "") {
  return value.replace(/\D/g, "");
}

function lineCenterX(line) {
  return (line.bbox.x0 + line.bbox.x1) / 2;
}

function lineCenterY(line) {
  return (line.bbox.y0 + line.bbox.y1) / 2;
}

function overlapsHorizontally(a, b) {
  return Math.max(a.bbox.x0, b.bbox.x0) <= Math.min(a.bbox.x1, b.bbox.x1);
}

function averageLineHeight(lines) {
  const heights = lines.map((line) => line.bbox.y1 - line.bbox.y0).filter((height) => height > 0);
  return heights.length ? heights.reduce((sum, height) => sum + height, 0) / heights.length : 20;
}

function findConferenceInText(text = "") {
  const normalizedText = normalizeConferenceText(text);
  if (!normalizedText) return null;

  const scored = conferences
    .map((conference) => {
      const names = unique([
        conference.name,
        conference.name.replace(/\s+/g, ""),
        conference.name.replace(/20\/20/g, "2020"),
        conference.sourceLabel,
      ]);
      const aliases = [
        ...names,
        ...(conference.name.includes("Money20/20") ? ["Money 20/20", "Money2020", "Money 2020"] : []),
      ];
      const match = aliases.some((alias) => normalizedText.includes(normalizeConferenceText(alias)));
      return { conference, score: match ? normalizeConferenceText(conference.name).length : 0 };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.conference || null;
}

function normalizeConferenceText(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/20\s*\/\s*20/g, "2020")
    .replace(/[^a-z0-9]+/g, "");
}

function cleanOcrLine(line) {
  return line
    .replace(/[|]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.)]+$/g, "")
    .trim();
}

function findNameLine(lines, company, email, title) {
  const candidates = lines
    .map((line, index) => ({ line: line.replace(email, "").trim(), index }))
    .filter(({ line }) => line && line !== company && line !== title && !isEventNoise(line) && !looksLikeContactLine(line))
    .map((item) => ({
      ...item,
      score: scoreNameLine(item.line, item.index, lines, title),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.line || "";
}

function findCompanyLine(lines, email, title) {
  const domainCompany = email ? email.split("@")[1].split(".")[0] : "";
  const fromDomain = lines.find((line) => {
    const normalized = normalizeName(line);
    return (
      domainCompany &&
      normalized.includes(normalizeName(domainCompany)) &&
      line !== title &&
      !looksLikePersonName(line) &&
      !looksLikeContactLine(line)
    );
  });
  if (fromDomain) return fromDomain;

  return (
    lines
      .map((line) => ({ line, score: scoreCompanyLine(line, title, email) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.line || ""
  );
}

function findTitleLine(lines, name, company, email) {
  return (
    lines.find((line) => {
      const lower = line.toLowerCase();
      return (
        line !== name &&
        line !== company &&
        !line.includes(email) &&
        !isEventNoise(line) &&
        /\b(chief|ceo|cfo|coo|vp|vice president|director|head|manager|lead|founder|treasury|finance|payments|sales|partnerships|operations)\b/.test(lower)
      );
    }) || ""
  );
}

function scoreNameLine(line, index, lines, title) {
  const words = line.split(" ").filter(Boolean);
  let score = 0;
  if (words.length >= 2 && words.length <= 4) score += 3;
  if (looksLikePersonName(line)) score += 4;
  if (/[0-9@]/.test(line)) score -= 5;
  if (/\b(pay|payments|solutions|systems|group|inc|ltd|llc|conference|attendee|usa)\b/i.test(line)) score -= 4;
  if (title && Math.abs(index - lines.indexOf(title)) <= 2) score += 2;
  return score;
}

function scoreCompanyLine(line, title, email) {
  let score = 0;
  if (line === title || line.includes(email) || isEventNoise(line) || looksLikePersonName(line)) return 0;
  if (/\b(inc|ltd|llc|group|solutions|systems|technologies|technology|capital|ventures|wholesale)\b/i.test(line)) score += 5;
  if (/\b(pay|payments|bank|finance|travel|tour|hotel|booking|settlement)\b/i.test(line)) score += 2;
  if (line.split(" ").length <= 5) score += 1;
  return score;
}

function looksLikePersonName(line) {
  return /^[A-Z][A-Za-z.'-]+(?: [A-Z][A-Za-z.'-]+){1,3}$/.test(line);
}

function looksLikeContactLine(line) {
  return /@|www\.|https?:|(?:\+?\d[\d .()-]{6,})/i.test(line);
}

function isEventNoise(line) {
  return /\b(money|conference|attendee|exhibitor|booth|floor|usa|europe|asia|sponsor|pass|badge|scan|qr)\b/i.test(line);
}

function inferSignalFromText(text) {
  const lower = text.toLowerCase();
  if (/\b(travel|tour|hotel|booking|ota|wholesale|dmc)\b/.test(lower)) return "Travel wholesaler or OTA";
  if (/\b(treasury|cfo|finance|hedg|fx|currency)\b/.test(lower)) return "Corporate treasury";
  if (/\b(psp|merchant|acquir|payments?|card|settlement)\b/.test(lower)) return "PSP or merchant acquiring";
  if (/\b(marketplace|saas|platform)\b/.test(lower)) return "Marketplace or SaaS finance";
  return "Cross-border payments";
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
  $("#leadName").value = lead.name || "";
  $("#leadCompany").value = lead.company || "";
  $("#leadEmail").value = lead.email || "";
  $("#leadPhone").value = lead.phone || "";
  $("#leadTitle").value = lead.title || "";
  const scannedConference =
    conferences.find((conference) => conference.id === lead.conferenceId) ||
    findConferenceInText(lead.conferenceName || "");
  if (scannedConference) {
    $("#leadConference").value = scannedConference.name;
  }
  if (lead.signal) $("#leadSignal").value = lead.signal;
  $("#leadNotes").value = lead.notes || "";
}

function setScanStatus(title, body) {
  $("#scanStatus").innerHTML = `<strong>${title}</strong><p>${body}</p>`;
}



async function extractLeadFromQrOrImage(file, dataUrl) {
  const qrValue = await decodeQrImage(file);
  if (qrValue) {
    return { lead: parseQrLead(qrValue), method: "qr" };
  }
  return extractLeadFromCapturedImage(file, dataUrl, "qr code");
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
    const lead = {
      name: params.get("name") || params.get("fullName") || "",
      company: params.get("company") || params.get("org") || "",
      email: params.get("email") || "",
      phone: params.get("phone") || params.get("tel") || "",
      title: params.get("title") || "",
      conferenceName: params.get("conference") || params.get("conferenceName") || params.get("event") || "",
      signal: params.get("signal") || "Cross-border payments",
      notes: params.get("notes") || "",
    };
    const conference = findConferenceInText(lead.conferenceName || trimmed);
    if (conference) {
      lead.conferenceId = conference.id;
      lead.conferenceName = conference.name;
    }
    return { ...lead, notes: lead.notes || buildCaptureNote("QR code", lead) };
  } catch {
    throw new Error("QR code did not contain a recognized lead format");
  }
}

function parseVCard(value) {
  const field = (name) => {
    const line = value.split(/\r?\n/).find((item) => item.toUpperCase().startsWith(`${name}:`));
    return line ? line.slice(line.indexOf(":") + 1).trim() : "";
  };
  const lead = {
    name: field("FN") || field("N").replaceAll(";", " ").trim(),
    company: field("ORG"),
    email: field("EMAIL"),
    phone: field("TEL"),
    title: field("TITLE"),
    signal: "Cross-border payments",
  };
  return { ...lead, notes: buildCaptureNote("QR code", lead) };
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
  const lead = {
    name: (parts.N || "").replace(",", " ").trim(),
    company: parts.ORG || "",
    email: parts.EMAIL || "",
    phone: parts.TEL || "",
    title: parts.TITLE || "",
    signal: "Cross-border payments",
  };
  return { ...lead, notes: buildCaptureNote("QR code", lead) };
}


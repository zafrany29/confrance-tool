// Settings form and persisted integration credentials.

function initSettings() {
  $("#openAiKey").value = settings.openAiKey;
  $("#openAiModel").value = settings.openAiModel;
  $("#hubspotToken").value = settings.hubspotToken;
  $("#webhookUrl").value = settings.webhookUrl;
  updateOpenAiSettingsStatus(
    settings.openAiKey ? "AI settings are saved in this browser." : "No OpenAI key saved yet.",
    settings.openAiKey ? "saved" : "idle",
  );

  ["openAiKey", "openAiModel"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => {
      updateOpenAiSettingsStatus("Unsaved changes.", "dirty");
    });
  });

  ["hubspotToken", "webhookUrl"].forEach((id) => {
    $(`#${id}`).addEventListener("input", (event) => {
      settings[id] = event.target.value.trim();
      saveSettings();
    });
  });
}

function saveOpenAiSettings() {
  settings.openAiKey = $("#openAiKey").value.trim();
  settings.openAiModel = $("#openAiModel").value.trim() || DEFAULT_MODEL;
  $("#openAiModel").value = settings.openAiModel;
  saveSettings();
  syncOpenAiSettingsFromUi();

  const saved = loadJson(storageKeys.settings, {});
  const isSaved = saved.openAiKey === settings.openAiKey && saved.openAiModel === settings.openAiModel;
  const button = $("#saveOpenAiSettings");
  const originalText = button.textContent;

  if (isSaved && settings.openAiKey) {
    updateOpenAiSettingsStatus("Saved. AI scan and coach can use this key.", "saved");
    button.textContent = "Saved";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
    return;
  }

  if (isSaved) {
    updateOpenAiSettingsStatus("Saved model setting. No OpenAI key is saved.", "idle");
    return;
  }

  updateOpenAiSettingsStatus("Could not confirm save. Try again.", "error");
}

function updateOpenAiSettingsStatus(message, state = "idle") {
  const status = $("#openAiSettingsStatus");
  status.textContent = message;
  status.dataset.state = state;
}


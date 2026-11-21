'use strict';
// Local preview loader, same pattern as the existing article preview shells.
// The static .html payload itself never contains scripts, styles or host chrome.
const target = document.querySelector('[data-preview-payload]');
fetch(target.dataset.previewPayload)
  .then(response => {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.text();
  })
  .then(html => { target.innerHTML = html; document.documentElement.dataset.previewReady = 'true'; })
  .catch(error => { target.textContent = 'Vorschau nicht verfügbar: ' + error.message + '. Bitte über den lokalen HTTP-Server öffnen.'; });

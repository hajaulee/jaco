// popup.js
const activeTabFilter = { active: true, currentWindow: true };
const el = (elId) => document.getElementById(elId);

el('translateBtn').addEventListener('click', () => {
  chrome.tabs.query(activeTabFilter, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "startTranslation" }, (response) => {
      if (response && response.status) {
        el('status').innerText = response.status;
      }
    });
  });
});

el('autoTranslation').addEventListener('change', () => {
  const checked = el('autoTranslation').checked;
  chrome.tabs.query(activeTabFilter, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'saveAutoTranslation', data: checked
    }, (response) => {
      if (response) {
        // do nothing;
      }
    })
  })
})

// Init 
chrome.tabs.query(activeTabFilter, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "readAutoTranslation" }, (response) => {
    if (response) {
      el('autoTranslation').checked = response.result == 'true';
    }
  });
})
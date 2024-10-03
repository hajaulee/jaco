// popup.js
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";

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
      action: 'saveStorage', key: KEY_AUTO_TRAN, data: checked
    }, (response) => {
      if (response) {
        // do nothing;
      }
    })
  })
});

el('useHanviet').addEventListener('change', () => {
  const checked = el('useHanviet').checked;
  chrome.tabs.query(activeTabFilter, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'saveStorage', key: KEY_USE_HANVIET, data: checked
    }, (response) => {
      if (response) {
        // do nothing;
      }
    })
  })
});

// Init 
chrome.tabs.query(activeTabFilter, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "readStorage", key: KEY_AUTO_TRAN }, (response) => {
    if (response) {
      el('autoTranslation').checked = response.result == 'true';
    }
  });

  chrome.tabs.sendMessage(tabs[0].id, { action: "readStorage", key: KEY_USE_HANVIET }, (response) => {
    if (response) {
      el('useHanviet').checked = response.result == 'true';
    }
  });
})
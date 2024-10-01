// popup.js

document.getElementById('translateBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startTranslation" }, (response) => {
        if (response && response.status) {
          document.getElementById('status').innerText = response.status;
        }
      });
    });
  });
  
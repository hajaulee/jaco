// popup.js
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";

const activeTabFilter = { active: true, currentWindow: true };

const el = (elId) => document.getElementById(elId);
const extractHost = url => url.split("/")[2];



/* 
***************************
*   FUNCTION
*
***************************
*/

function withCurrentTab(func) {
  chrome.tabs.query(activeTabFilter, (tabs) => {
    func(tabs[0]);
  });
}

async function readStorage(key) {
  return new Promise((resolve, reject) => {
    withCurrentTab((tab) => {
      chrome.runtime.sendMessage({ action: "readStorage", key: key, url: extractHost(tab.url) }, (response) => {
        if (response) {
          resolve(response.result);
        } else {
          reject(response)
        }
      });
    })
  })
}

async function saveStorage(key, data) {
  return new Promise((resolve, reject) => {
    withCurrentTab((tab) => {
      chrome.runtime.sendMessage({
        action: 'saveStorage', key: key, data: data, url: extractHost(tab.url)
      }, (response) => {
        if (response) {
          resolve(response.result);
        } else {
          reject(resolve)
        }
      })
    });
  });
}


/* 
***************************
*   INIT
*
***************************
*/

readStorage(KEY_AUTO_TRAN).then(result => {
  el('autoTranslation').checked = result == 'true';
});
readStorage(KEY_USE_HANVIET).then(result => {
  el('useHanviet').checked = result == 'true';
});


withCurrentTab((tab) => {
  chrome.runtime.sendMessage({ action: "injectContentScript", tab: tab });
});

/* 
***************************
*   EVENT
*
***************************
*/


el('translateBtn').addEventListener('click', () => {
  withCurrentTab((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "startTranslation" }, (response) => {
      if (response && response.status) {
        el('status').innerText = response.status;
      }
    });
  });
});

el('autoTranslation').addEventListener('change', () => {
  const checked = el('autoTranslation').checked;
  saveStorage(KEY_AUTO_TRAN, checked);
});

el('useHanviet').addEventListener('change', () => {
  const checked = el('useHanviet').checked;
  saveStorage(KEY_USE_HANVIET, checked);
});


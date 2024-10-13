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


function initConverterDemo(){
  const conveter = new Converter();
  const codeMapFetching = fetch("./code_map.json").then(res => res.json());
  const hanvietFetching = fetch("./hanviet_dict.json").then(res => res.json());
  Promise.all([codeMapFetching, hanvietFetching]).then(values => {
      conveter.updateResources(values[0], values[1]);
  });
  const textInput = document.getElementById('textInput');
  const textOutput = document.getElementById('textOutput');

  function convertInput() {
      textOutput.innerHTML = conveter.convert(textInput.innerText, useHanviet.checked).trim().replace(/\n/g, '<br>');
  }

  textInput.addEventListener('keyup', () => convertInput());
  textInput.addEventListener('change', () => convertInput());
  useHanviet.addEventListener('change', () => convertInput());
  conveter.ready.then(() => {
      convertInput();
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
  if (result == 'true'){
    el('translateBtn').click();
  }
});
readStorage(KEY_USE_HANVIET).then(result => {
  el('useHanviet').checked = result == 'true';
});


withCurrentTab((tab) => {
  chrome.runtime.sendMessage({ action: "injectContentScript", tab: tab });
});


initConverterDemo();

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


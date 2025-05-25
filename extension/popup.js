// popup.js
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";
const KEY_JACO_FONT= "JacoFont";
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

function updateFont() {
      const font = el("fontSelection").value;
      const textOutput = el('textOutput');
      // Remove current jaco-font-* class
      textOutput.classList.remove(...[...textOutput.classList].filter(c => c.startsWith('jaco-font-')));
      // Add selected jaco-font-x class
      if (font) {
          textOutput.classList.add(`jaco-font-${font}`);
      }
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
  const fontSelection = document.getElementById('fontSelection');

  function convertInput() {
      textOutput.innerHTML = conveter.convert(textInput.innerText, useHanviet.checked).trim().replace(/\n/g, '<br>');
  }

  textInput.addEventListener('keyup', () => convertInput());
  textInput.addEventListener('change', () => convertInput());
  useHanviet.addEventListener('change', () => convertInput());
  conveter.ready.then(() => {
      convertInput();
  });

  fontSelection.addEventListener('change', () => {
    updateFont();
    withCurrentTab((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: "updateFont", data: fontSelection.value }, (response) => {
        if (response && response.status) {
          el('status').innerText = response.status;
        }
      });
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
  if (result == 'true'){
    el('translateBtn').click();
  }
});
readStorage(KEY_USE_HANVIET).then(result => {
  el('useHanviet').checked = result == 'true';
});
readStorage(KEY_JACO_FONT).then(result => {
  el('fontSelection').value = result || "maru";
  updateFont();
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

el("fontSelection").addEventListener('change', (event) => {
  const font = event.target.value;
  saveStorage(KEY_JACO_FONT, font)
});

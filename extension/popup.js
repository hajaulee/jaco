// popup.js
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";
const KEY_JACO_FONT= "JacoFont";
const activeTabFilter = { active: true, currentWindow: true };

const global = {
  fontDownloaded: false,
  translatorExecuted: false,
  useHanviet: true,
  autoTranslation: false,
  loadedFonts: {},
  supportedFonts: []
};
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

function addFontFace(fontCode, fontName, fontUrl) {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontName}';
      src: url('${fontUrl}');
    }
    .jaco-font-${fontCode} {
        font-family: ${fontName}, Arial, Verdana, sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

function updateFont() {
      const font = el("fontSelection").value;
      const textOutput = el('textOutput');

      if (global.supportedFonts?.length > 0) {
        const fontInfo = global.supportedFonts.find(f => f.code === font);
        if (fontInfo) {
            // Add font face if not already added
            if (!global.loadedFonts[fontInfo.code]) {
              addFontFace(fontInfo.code, fontInfo.name, fontInfo.url);
              global.loadedFonts[fontInfo.code] = true;
            }
        }
      }

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
  el('fontSelection').value = [...el('fontSelection').children].map(it => it.value).includes(result) ? result : "maru";
  updateFont();
});


withCurrentTab((tab) => {
  chrome.runtime.sendMessage({ action: "injectContentScript", tab: tab });
});

fetch("https://hajaulee.github.io/jaco/extension/supported_fonts.json").then(res => res.json()).then(data => {
  global.supportedFonts = data;
  const fontSelection = el('fontSelection');
  data.forEach(font => {
    const option = document.createElement('option');
    option.value = font.code;
    option.textContent = font.name;
    if (font.code === "maru") {
      option.selected = true;
    }
    fontSelection.appendChild(option);
  });
  updateFont();
  readStorage(KEY_JACO_FONT).then(font => {
    if (font && data.includes(font)) {
      el('fontSelection').value = font;
    } else {
      el('fontSelection').value = "maru";
    }
    updateFont();
  });
}).catch(err => {
  console.error("Failed to fetch supported fonts:", err);
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
  const font = event.target.value || "maru";
  saveStorage(KEY_JACO_FONT, font)
});

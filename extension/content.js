// Translate all the text nodes on the page
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";
const KEY_JACO_FONT = "JacoFont";
const ONLINE_HANVIET_DICT_URL = "https://hajaulee.github.io/jaco/extension/hanviet_dict.json";

const getHost = () => location.href.split("/")[2];
const conveter = new Converter();
const textarea = document.createElement('textarea');

const global = {
  fontDownloaded: false,
  translatorExecuted: false,
  useHanviet: true,
  autoTranslation: false,
  loadedFonts: {},
};

const SUPPORTED_JACO_FONTS = [
  { 
    code: "maru", 
    name: "JacoMaru", 
    url: "https://hajaulee.github.io/Houf-Jaco-Maru/new_fonts/ttf/HoufJacoMaru-Light.ttf" 
  },
  { 
    code: "regular", 
    name: "HoufRegular", 
    url: "https://hajaulee.github.io/Houf-Jaco-Regular-Script/new_fonts/ttf/HoufRegularScript-Light.ttf" 
  },
];
/* 
***************************
*   FUNCTION
*
***************************
*/

async function urlContentToDataUri(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise(callback => {
      let reader = new FileReader();
      reader.onload = function () { callback(this.result) };
      reader.readAsDataURL(blob);
    }));
}


async function readStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "readStorage", key: key, url: getHost() }, response => {
      if (response) {
        resolve(response.result);
      }
      else {
        reject(response);
      }
    });
  })
}

async function readFontData() {
  const data =  await urlContentToDataUri(SUPPORTED_JACO_FONTS.find(f => f.code === global.jacoFont).url);
  global.loadedFonts[global.jacoFont] = data;
  global.fontDownloaded = true;
  return data;
}

function setupFontFamily(uriData) {
  const fontInfo = SUPPORTED_JACO_FONTS.find(f => f.code === global.jacoFont);
  if (!fontInfo) {
    console.error(`Font ${global.jacoFont} is not supported.`);
    return;
  }
  var newStyle = document.createElement('style');
  newStyle.appendChild(document.createTextNode(`
    @font-face {
        font-family: ${fontInfo.name};
        src: url("${uriData}");
    }  
  `));
  document.head.appendChild(newStyle);  
}

function decodeHtmlEntities(str) {
  textarea.innerHTML = str;
  return textarea.value;
}

async function translatePageContent(text) {
  return conveter.convertOnCodeMapReady(text, global.useHanviet);
}

// Walk through the document and replace text
async function walkAndTranslate(node) {
  const startTime = new Date().getTime();
  // console.log(new Date().toJSON(), `Start Translating`);

  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();

  while (textNode) {
    const originText = textNode.textContent.trim();
    const parentNode = textNode.parentNode;
    if (
      originText &&
      !['SCRIPT', 'STYLE'].includes(parentNode.nodeName) &&
      !parentNode.getAttribute('data-translator-origin')
    ) {
      try {
        parentNode.childNodes.forEach(async (childNode) => {
          if (childNode.nodeType == Node.TEXT_NODE) {
            const childNodeText = childNode.textContent.trim();
            let translatedText = await translatePageContent(childNodeText);
            childNode.data = decodeHtmlEntities(translatedText);
            parentNode.setAttribute('data-translator-origin', childNodeText);
            if (translatedText != childNodeText) {
              parentNode.classList.add("jaco-text");
              // Remove any existing jaco-font-* class
              parentNode.classList.remove(...[...parentNode.classList].filter(c => c.startsWith('jaco-font-')));
              if (global.jacoFont) {
                parentNode.classList.add(`jaco-font-${global.jacoFont}`);
              }
            }
          }
        });
      } catch (e) {
        // console.log(e, textNode.nodeType, textNode);
      }
    }
    textNode = walker.nextNode();
  }

  // console.log(new Date().toJSON(), `Done  Translating in ${(new Date().getTime() - startTime) / 1000}`);
  global.translatorExecuted = true;
  return 0;
}


async function init() {
  const codeMapFetching = fetch(chrome.runtime.getURL('code_map.json')).then(res => res.json());
  const hanvietFetching = fetch(ONLINE_HANVIET_DICT_URL).then(res => res.json());
  const useHanvietFetching = readStorage(KEY_USE_HANVIET);
  const autoTranslationFetching = readStorage(KEY_AUTO_TRAN);
  const [codeMap, hanviet, useHanviet, autoTranslation] = await Promise.all([codeMapFetching, hanvietFetching, useHanvietFetching, autoTranslationFetching]);
  
  global.useHanviet = useHanviet == 'true';
  global.autoTranslation = autoTranslation == 'true';
  await conveter.updateResources(codeMap, hanviet);

  if (global.autoTranslation) {
    readFontData().then(fontData => setupFontFamily(fontData));
    await walkAndTranslate(document.body);
  }
}


async function processRequest(request, sender, sendResponse) {
  if (request.action === "startTranslation") {
    const useHanviet = await readStorage(KEY_USE_HANVIET);
    const jacoFont = await readStorage(KEY_JACO_FONT);
    global.useHanviet = useHanviet == 'true';
    global.jacoFont = jacoFont ?? "maru";
    
    if (!global.loadedFonts[global.jacoFont]) {
      readFontData().then(fontData => setupFontFamily(fontData));
    }
    walkAndTranslate(document.body);
    sendResponse({ status: "Chuyển chữ thành công!" });
  } else if (request.action === "checkInjected"){
    console.log("Injected");
    sendResponse({status: true});
  } else if (request.action === "updateFont") {
    global.jacoFont = request.data;
    if (!global.loadedFonts[global.jacoFont]) {
      readFontData().then(fontData => setupFontFamily(fontData));
    }
    document.querySelectorAll('.jaco-text').forEach(el => {
      // Remove any existing jaco-font-* class
      el.classList.remove(...[...el.classList].filter(c => c.startsWith('jaco-font-')));
      if (global.jacoFont) {
        el.classList.add(`jaco-font-${global.jacoFont}`);
      }
    });
    sendResponse({ status: "Cập nhật font thành công!" });
  }
}

/* 
***************************
*   INIT
*
***************************
*/
// Download font
init();

setInterval(() => {
  if (global.translatorExecuted) {
    walkAndTranslate(document.body).then();
  }
}, 3000);


/*
***************************
*     EVENT
*
***************************
*/
// Listen for a message to start translation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  processRequest(request, sender, sendResponse);
  return true;
});

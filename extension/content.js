// Translate all the text nodes on the page
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";

const getHost = () => location.href.split("/")[2];
const conveter = new Converter();
const textarea = document.createElement('textarea');

const global = {
  fontDownloaded: false,
  translatorExecuted: false,
  useHanviet: true,
  autoTranslation: false
};


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
  const data =  await urlContentToDataUri("https://hajaulee.github.io/Houf-Jaco-Maru/new_fonts/ttf/HoufJacoMaru-Light.ttf");
  global.fontDownloaded = true;
  return data;
}

function setupFontFamily(uriData) {
  var newStyle = document.createElement('style');
  newStyle.appendChild(document.createTextNode(`
    @font-face {
        font-family: "JacoMaru";
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
  console.log(new Date().toJSON(), `Start Translating`);

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
            }
          }
        });
      } catch (e) {
        // console.log(e, textNode.nodeType, textNode);
      }
    }
    textNode = walker.nextNode();
  }

  console.log(new Date().toJSON(), `Done  Translating in ${(new Date().getTime() - startTime) / 1000}`);
  global.translatorExecuted = true;
  return 0;
}


async function init() {
  const codeMapFetching = fetch(chrome.runtime.getURL('code_map.json')).then(res => res.json());
  const hanvietFetching = fetch(chrome.runtime.getURL('hanviet_dict.json')).then(res => res.json());
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
    global.useHanviet = useHanviet == 'true';
    
    if (!global.fontDownloaded){
      readFontData().then(fontData => setupFontFamily(fontData));
    }
    walkAndTranslate(document.body);
    sendResponse({ status: "Chuyển chữ thành công!" });
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

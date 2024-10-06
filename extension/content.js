// Translate all the text nodes on the page
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";

const getHost = () => location.href.split("/")[2];
const conveter = new Converter();
const textarea = document.createElement('textarea');

const global = {
  translatorExecuted: false,
  useHanviet: true
};


/* 
***************************
*   FUNCTION
*
***************************
*/

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

function decodeHtmlEntities(str) {
  textarea.innerHTML = str;
  return textarea.value;
}

async function urlContentToDataUri(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise(callback => {
      let reader = new FileReader();
      reader.onload = function () { callback(this.result) };
      reader.readAsDataURL(blob);
    }));
}

async function translatePageContent(text) {
  return conveter.convertOnCodeMapReady(text, global.useHanviet);
}

// Walk through the document and replace text
async function walkAndTranslate(node) {
  global.translatorExecuted = true;
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
            childNode.textContent = decodeHtmlEntities(translatedText);
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
}


async function translateOnInit() {
  const useHanviet = await readStorage(KEY_USE_HANVIET);
  const autoTranslation = await readStorage(KEY_AUTO_TRAN);
  global.useHanviet = useHanviet == 'true';
  if (autoTranslation == "true") {
    conveter.ready.then(() => {
      walkAndTranslate(document.body).then();
    });
  }
}

/* 
***************************
*   INIT
*
***************************
*/
// Download font
urlContentToDataUri("https://hajaulee.github.io/Houf-Jaco-Maru/new_fonts/ttf/HoufJacoMaru-Light.ttf")
  .then((urlData) => {
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(`
      @font-face {
          font-family: "JacoMaru";
          src: url("${urlData}");
      }  
    `));
    document.head.appendChild(newStyle);

    const codeMapFetching = fetch(chrome.runtime.getURL('code_map.json')).then(res => res.json());
    const hanvietFetching = fetch(chrome.runtime.getURL('hanviet_dict.json')).then(res => res.json());
    Promise.all([codeMapFetching, hanvietFetching]).then(values => {
      conveter.updateResources(values[0], values[1]);
      translateOnInit();
    });

  })
  .catch((err) => {
    console.error(`Error: ${err}`);

  })


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
  if (request.action === "startTranslation") {
    readStorage(KEY_USE_HANVIET).then(result => {
      global.useHanviet = result == "true";
      walkAndTranslate(document.body).then(() => {
        sendResponse({ status: "Chuyển chữ thành công!" });
      });
    });
  }

  return true;
});

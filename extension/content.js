// Translate all the text nodes on the page
const KEY_AUTO_TRAN = "JacoAutoTranslation";
const KEY_USE_HANVIET = "UseHanViet";

const conveter = new Converter();
const textarea = document.createElement('textarea');
let translatorExecuted = false;

function decodeHtmlEntities(str) {
  textarea.innerHTML = str;
  return textarea.value;
}

async function urlContentToDataUri(url){
  return  fetch(url)
          .then( response => response.blob() )
          .then( blob => new Promise( callback =>{
              let reader = new FileReader() ;
              reader.onload = function(){ callback(this.result) } ;
              reader.readAsDataURL(blob) ;
          }) ) ;
}

function readAutoTranslation(){
  return localStorage.getItem(KEY_AUTO_TRAN);
}

function saveAutoTranslation(value) {
  return localStorage.setItem(KEY_AUTO_TRAN, value);
}

async function translatePageContent(text) {
  return conveter.convertOnCodeMapReady(text, localStorage.getItem(KEY_USE_HANVIET) == "true");
}

// Walk through the document and replace text
async function walkAndTranslate(node) {
  translatorExecuted = true;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();

  while (textNode) {
    const originText = textNode.textContent.trim();
    const parentNode = textNode.parentNode;
    if (
      originText && 
      !['SCRIPT', 'STYLE'].includes(parentNode.nodeName) &&
      !parentNode.getAttribute('data-translator-origin')
    ){      
      try{
        let translatedText = await translatePageContent(originText);
        textNode.textContent = decodeHtmlEntities(translatedText);
        parentNode.setAttribute('data-translator-origin', originText);
        parentNode.classList.add("jaco-text");
      } catch (e){
        // console.log(e, textNode.nodeType, textNode);
      }
    }
    textNode = walker.nextNode();
  }
}


/* 
***************************
*   INIT
*
***************************
*/
const codeMapFetching = fetch(chrome.runtime.getURL('code_map.json')).then(res => res.json());
const hanvietFetching = fetch(chrome.runtime.getURL('hanviet_dict.json')).then(res => res.json());
Promise.all([codeMapFetching, hanvietFetching]).then(values => {
    conveter.updateResources(values[0], values[1]);
});

window.addEventListener("load", () => {
  if (readAutoTranslation() == 'true'){
    conveter.ready.then(() => {
      walkAndTranslate(document.body).then();
    });
  }
});


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
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
    
  })


setInterval(() => {
  if (translatorExecuted){
    walkAndTranslate(document.body).then();
  }
}, 3000);
/*
***************************
*     RUNTIME ACTIONS
*
***************************
*/

// Listen for a message to start translation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTranslation") {
    walkAndTranslate(document.body).then(() => {
      sendResponse({ status: "Chuyển chữ thành công!" });
    });
    return true; // Keep the message channel open for sendResponse
  }

  if (request.action === "readStorage"){
    sendResponse({result: localStorage.getItem(request.key)})
  }

  if (request.action === "saveStorage"){
    localStorage.setItem(request.key, request.data);
    sendResponse({result: localStorage.getItem(request.key)});
  }
});

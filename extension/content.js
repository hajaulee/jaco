// Translate all the text nodes on the page
const conveter = new Converter();
const textarea = document.createElement('textarea');

function decodeHtmlEntities(str) {
  textarea.innerHTML = str;
  return textarea.value;
}

async function translatePageContent(text) {
  return Promise.resolve(conveter.convert(text))
}

fetch(chrome.runtime.getURL('code_map.json'))
  .then(res => res.text())
  .then(res => {
      conveter.updateCodeMap(JSON.parse(res))
  })

// Walk through the document and replace text
async function walkAndTranslate(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();

  while (textNode) {
    const originText = textNode.textContent.trim();
    const parentNode = textNode.parentNode;
    if (originText && !['SCRIPT', 'STYLE'].includes(parentNode.nodeName)){      
      try{
        let translatedText = await translatePageContent(originText);
        textNode.textContent = decodeHtmlEntities(translatedText);
        parentNode.setAttribute('data-translator-origin', originText.trim());
        parentNode.classList.add("jaco-text");
      } catch (e){
        // console.log(e, textNode.nodeType, textNode);
      }
    }
    textNode = walker.nextNode();
  }
}


// Listen for a message to start translation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTranslation") {
    walkAndTranslate(document.body).then(() => {
      sendResponse({ status: "Chuyển chữ thành công!" });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
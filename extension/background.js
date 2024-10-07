async function urlContentToDataUri(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise(callback => {
      let reader = new FileReader();
      reader.onload = function () { callback(this.result) };
      reader.readAsDataURL(blob);
    }));
}


chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});
  
// Listen for a message to start translation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "readStorage"){
    chrome.storage.local.get([request.url + request.key]).then((result) => {      
      sendResponse({result: String(result?.[request.url + request.key])})
    });
  }

  if (request.action === "saveStorage"){
    chrome.storage.local.set({ [request.url + request.key]: request.data }).then(() => {
      sendResponse({result: request.data});
    });
  }

  if (request.action === "readFontData"){
    urlContentToDataUri("https://hajaulee.github.io/Houf-Jaco-Maru/new_fonts/ttf/HoufJacoMaru-Light.ttf").then(data => {
      sendResponse({result: data});
    })
  }

  return true;
});
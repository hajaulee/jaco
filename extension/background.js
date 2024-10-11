/* 
***************************
*   FUNCTION
*
***************************
*/

function injectContentScript(tab, callback) {
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['styles.css']
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['converter.js', 'content.js']
  }, callback);
}

function processMenu(info, tab) {
  if (info.menuItemId === "startTranslation") {
    chrome.tabs.sendMessage(tab.id, { action: "startTranslation" }, (response) => {
      if (response && response.status) {
        console.log(response.status);
      }
    });
  }
}


/*
***************************
*     EVENT
*
***************************
*/
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');

  chrome.contextMenus.create({
    id: "startTranslation",
    title: "Chuyển chữ Jaco",
    contexts: ["page"]
  });

});

// When the user clicks the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {

  chrome.tabs.sendMessage(tab.id, { action: "checkInjected" }, (response) => {
    if (chrome.runtime.lastError) {
      injectContentScript(tab, () => {
        processMenu(info, tab);
      });
    } else {
      processMenu(info, tab);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "readStorage") {
    chrome.storage.local.get([request.url + request.key]).then((result) => {
      sendResponse({ result: String(result?.[request.url + request.key]) })
    });
  }

  if (request.action === "saveStorage") {
    chrome.storage.local.set({ [request.url + request.key]: request.data }).then(() => {
      sendResponse({ result: request.data });
    });
  }

  return true;
});
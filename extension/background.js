const global = {
  contentScriptMaintainerTimers: {}
}
/* 
***************************
*   FUNCTION
*
***************************
*/

function injectScriptAndCss(tab) {
  return new Promise((resolve, reject) => {
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['styles.css']
    });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['converter.js', 'content.js']
    }, () => { resolve(true) });
  });
}

function injectAndMaintainContentScript(tab) {
  return new Promise((resolve, reject) => {
    if (!global.contentScriptMaintainerTimers[tab.id]){
      const timer = setInterval(() => {
        chrome.tabs.sendMessage(tab.id, { action: "checkInjected" }, (response) => {
          if (chrome.runtime.lastError) {
            injectScriptAndCss(tab).then(() => resolve(true));
          } else {
            resolve(true);
          }
        });
      }, 3000);
      global.contentScriptMaintainerTimers[tab.id] = timer;
    }else {
      resolve(true);
    }
  })
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

  
  if (navigator.userAgent.includes("Mobile")){
    chrome.action.setPopup({ popup: "" });
  } else {
    chrome.action.setPopup({ popup: "popup.html" });
  }

  chrome.contextMenus.create({
    id: "startTranslation",
    title: "Chuyển chữ Jaco",
    contexts: ["page"]
  });


});

// When the user clicks the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  injectAndMaintainContentScript(tab).then(() => {
    processMenu(info, tab);
  });
});

// No popup in icon, show popup inside website
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['add_popup.js']
  });
});


// Message Event
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

  if (request.action === "injectContentScript"){
    injectAndMaintainContentScript(request.tab)
  }

  return true;
});
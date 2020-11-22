function getSelectText() {
  return new Promise((resolve) => {
        chrome.tabs.executeScript({
           code: "window.getSelection().toString();"
        }, function (selection) {
            resolve(selection[0])
        })
   })
}

function getPageSite() {
    return new Promise((resolve) => {
        chrome.tabs.executeScript({
           code: "window.location.href;"
        }, function (site) {
            resolve(site[0])
        })
   })
}

export { getSelectText, getPageSite }
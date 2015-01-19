var clickHandler = function(e) {
    var data = {};
    if (e.selectionText != undefined) {
        data = {"selection": e.selectionText};
    } else if (e.linkUrl != undefined) {
        data = {"url": e.linkUrl};
    } 
    
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, data);
    });
};

chrome.contextMenus.create({
    "title": "Get Movie Rating",
    "contexts": ["selection","link"],
    "onclick": clickHandler
});                        

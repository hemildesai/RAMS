chrome.browserAction.onClicked.addListener(function(tab){
	var tab_url = "https://www.google.com";
	chrome.tabs.create({ url: tab_url });
});
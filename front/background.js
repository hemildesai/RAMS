chrome.browserAction.onClicked.addListener(function(tab){
	var tab_url = "background.html";
	var viewTabUrl = chrome.tabs.getURL(tab_url);

	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];

		// If this view has the right URL and hasn't been used yet...
		if (view.location.href == viewTabUrl) {

		  // ...call one of its functions and set a property.
		  view.setImageUrl(imageUrl);
		  view.imageAlreadySet = true;
		  break; // we're done
		}
  }
});
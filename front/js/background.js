/* Chrome Extension button OnClick Action*/
chrome.browserAction.onClicked.addListener(function(tab){
	// Get current Tab URL
	var curr_tab_url = tab.url;

    localStorage["rams_server"] = "https://rams-asamanta94.c9users.io/"
    
	// Check for empty URL
	if(curr_tab_url == "about:blank" || curr_tab_url == "")
	{
		alert("Empty URL!");
		return;
	}
	else
	{
		if(localStorage.hasOwnProperty("Rams_usr_name"))
		{
			// Open RAMS window to store the URL
			var rams_user_tab = window.open("../html/usr_rsrc_tab.html");
			if(rams_user_tab != null)
				rams_user_tab.onload = function() {
					rams_user_tab.document.getElementById("rsrc_link").value = curr_tab_url;
				};
			else
				alert("Sorry\n");
		}
		// Check if user is already logged in
		else
		{
			window.open("../html/home_rams.html");
			return;
		}
	}
});
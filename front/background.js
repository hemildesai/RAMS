/* Global Tag list */
var tag_list = ["tag_1", "tag_2", "tag_3"];

/* Chrome Extension button OnClick Action*/
chrome.browserAction.onClicked.addListener(function(tab){
	// Get current Tab URL
	var curr_tab_url = tab.url;

	// Check for empty URL
	if(curr_tab_url == "about:blank" || curr_tab_url == "")
	{
		alert("Empty URL!");
		return;
	}
	else
	{
		// Check if user is already logged in
		if(checkIfLoggedIn() == false)
		{
			window.open("./front/login_sign_up.html");
			return;
		}

		// Open RAMS window to store the URL
		var rams_user_tab = window.open("./front/usr_rsrc_tab.html");
		if(rams_user_tab != null)
			rams_user_tab.onload = function() {
				rams_user_tab.document.getElementById("rsrc_input").value = curr_tab_url;
			};
		else
			alert("Sorry\n");
	}
});

function checkIfLoggedIn() {
	return true;
};
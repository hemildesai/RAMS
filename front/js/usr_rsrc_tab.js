document.getElementById("save_button").addEventListener("click", save_function);
document.getElementById("logout_button").addEventListener("click", logout_function);
document.getElementById("submit_button").addEventListener("click", search_function);

$(document).ready(function()
	{
		var navbar_p = document.getElementById("signed_in");
		navbar_p.innerHTML = localStorage["Rams_usr_name"];
	}
);

function save_function()
{
    var rsrc_link = document.getElementById("rsrc_link").value;
    var rsrc_name = document.getElementById("rsrc_name").value;
    var rsrc_desc = document.getElementById("rsrc_name").value;
    var rsrc_priv = document.getElementById("rsrc_priv").checked;

    if(rsrc_link == "" && rsrc_name == "")
	{
		document.getElementById("modal_p").innerHTML = "Resource Link and name cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(rsrc_link == "" && rsrc_name != "")
	{
		document.getElementById("modal_p").innerHTML = "Resource Link cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(rsrc_link != "" && rsrc_name == "")
	{
		document.getElementById("modal_p").innerHTML = "Resource Name cannot be empty.";
		$("#message_modal").modal();
		return;
	}

  var xhr = new XMLHttpRequest();
	var url = localStorage["rams_server"] + "api/resources";
	var params = JSON.stringify({user_id: localStorage["Rams_usr_name"], name: rsrc_name, link: rsrc_link, is_private: rsrc_priv});
	xhr.open("POST", url, true);

	xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			// alert(xhr.responseText);
			var json_data = JSON.parse(xhr.responseText);
			if(json_data["success"] == true)
			{
				window.open("../html/dashboard.html", "_self");
			}
			else
			{
				var error_data = json_data["errors"];
				var error_msg = "Error! Please try again later.";
				if(error_data.hasOwnProperty("password"))
					error_msg = error_data["password"];
				else if(error_data.hasOwnProperty("code"))
					error_msg = "Username already exists!";
				document.getElementById("modal_p").innerHTML = error_msg;
				$("#message_modal").modal();
			}
		}
	}
	xhr.send(params);
}

function logout_function() {

	localStorage["Rams_usr_name"] = "";
	localStorage["Rams_usr_tok"] = "";

	localStorage.removeItem("Rams_usr_name");
	localStorage.removeItem("Rams_usr_tok");

	window.open("../html/home_rams.html", "_self");
}

function search_function() {
	window.open("../search_client/index.html", "_self");
}
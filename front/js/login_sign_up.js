document.getElementById("login_button").addEventListener("click", login_function);
document.getElementById("sign_up_button").addEventListener("click", signUp_function);

function login_function()
{
	var users_user_name = document.getElementById("user_name").value;
	var users_user_pass = document.getElementById("user_pass").value;
	
	if(users_user_name == "" && users_user_pass == "")
	{
		document.getElementById("modal_p").innerHTML = "Username and password cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(users_user_name == "" && users_user_pass != "")
	{
		document.getElementById("modal_p").innerHTML = "Username cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(users_user_name != "" && users_user_pass == "")
	{
		document.getElementById("modal_p").innerHTML = "Password cannot be empty.";
		$("#message_modal").modal();
		return;
	}

	var xhr = new XMLHttpRequest();
	var url = localStorage["rams_server"] + "api/authenticate";
	var params = JSON.stringify({username:users_user_name, password:users_user_pass});
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			alert(xhr.responseText);
			var json_data = JSON.parse(xhr.responseText);
			if(json_data["success"] == true)
			{
				localStorage["Rams_usr_name"] = users_user_name;
				localStorage["Rams_usr_tok"] = json_data["token"];
				window.open("../html/dashboard.html", "_self");
			}
			else
			{
				var error_data = "Wrong Username or Password!";
				document.getElementById("modal_p").innerHTML = error_data;
				$("#message_modal").modal();
			}
		}
	}
	xhr.send(params);
}

function signUp_function()
{
	var users_user_name = document.getElementById("sign_user_name").value;
	var users_user_pass = document.getElementById("sign_user_pass").value;
	
	if(users_user_name == "" && users_user_pass == "")
	{
		document.getElementById("modal_p").innerHTML = "Username and password cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(users_user_name == "" && users_user_pass != "")
	{
		document.getElementById("modal_p").innerHTML = "Username cannot be empty.";
		$("#message_modal").modal();
		return;
	}
	else if(users_user_name != "" && users_user_pass == "")
	{
		document.getElementById("modal_p").innerHTML = "Password cannot be empty.";
		$("#message_modal").modal();
		return;
	}

	var xhr = new XMLHttpRequest();
    var url = localStorage["rams_server"] + "api/users";
	var params = JSON.stringify({username:users_user_name, password:users_user_pass});
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			alert(xhr.responseText);
			var json_data = JSON.parse(xhr.responseText);
			if(json_data["success"] == true)
			{
                localStorage["Rams_usr_name"] = users_user_name;
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
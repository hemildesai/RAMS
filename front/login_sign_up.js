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
	
	// var user = new User();
	
	var passed = false;
	
	$.ajax({
		type: "POST",
		url: "/user",
		data: {username: users_user_name, password: users_user_pass},
		success: function(data){
			passed = true;
		},
		dataType: "text"
	});
	
	if(passed == true)
    	window.open("./dashboard.html", "_self");
}

function signUp_function() {
	
	window.open("./dashboard.html", "_self");
}
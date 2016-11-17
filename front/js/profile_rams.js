$(document).ready(function() {
  
  var navbar_p = document.getElementById("signed_in");
	navbar_p.innerHTML = localStorage["Rams_usr_name"];
  
  var user_id_h = document.getElementById("usr_name_value");
  var text_usr = document.createTextNode(localStorage["Rams_usr_name"]);
  user_id_h.appendChild(text_usr);
  
  document.getElementById("change_btn").addEventListener("click", change_function);
});

function change_function() {
  var edit_div = document.getElementById("edit_div");
  edit_div.innerHTML = "";
  
  var form_pwd = document.createElement("form");
  
  /* Old Password */
  
  var form_div_old_pwd = document.createElement("div");
  form_div_old_pwd.class = "form-group";
  var old_pwd_lbl = document.createElement("label");
  var old_pwd_h = document.createElement("h2");
  var old_pwd_txt = document.createTextNode("Old Password");
  old_pwd_h.appendChild(old_pwd_txt);
  old_pwd_lbl.appendChild(old_pwd_h);
  var old_pwd_input = document.createElement("input");
  old_pwd_input.className = "form-control";
  old_pwd_input.id = "usr_old_pwd";
  old_pwd_input.type = "password";
  form_div_old_pwd.appendChild(old_pwd_lbl);
  form_div_old_pwd.appendChild(old_pwd_input);
  
  /* New Password */
  
  var form_div_new_pwd = document.createElement("div");
  form_div_new_pwd.class = "form-group";
  var new_pwd_lbl = document.createElement("label");
  var new_pwd_h = document.createElement("h2");
  var new_pwd_txt = document.createTextNode("New Password");
  new_pwd_h.appendChild(new_pwd_txt);
  new_pwd_lbl.appendChild(new_pwd_h);
  var new_pwd_input = document.createElement("input");
  new_pwd_input.className = "form-control";
  new_pwd_input.id = "usr_new_pwd";
  new_pwd_input.type = "password";
  form_div_new_pwd.appendChild(new_pwd_lbl);
  form_div_new_pwd.appendChild(new_pwd_input);
  
  br = document.createElement("br");
  br2 = document.createElement("br");
  
  var sub_btn = document.createElement("button");
  sub_btn.className = "btn btn-danger btn-lg";
  sub_btn.id = "new_pwd_sub";
  sub_btn.textContent = "Submit";
  
  form_pwd.appendChild(form_div_old_pwd);
  form_pwd.appendChild(form_div_new_pwd);
  edit_div.appendChild(form_pwd);
  edit_div.appendChild(br);
  edit_div.appendChild(sub_btn);
  edit_div.appendChild(br2);
  
  document.getElementById("new_pwd_sub").addEventListener("click", sub_function);
}

function sub_function() {
  var old_pwd = document.getElementById("usr_old_pwd").value;
  var new_pwd = document.getElementById("usr_new_pwd").value;
  
  if(old_pwd === "" && new_pwd === "")
  {
    document.getElementById("modal_p").innerHTML = "Old Password and New Password fields can't be empty";
		$("#message_modal").modal();
		return ;
  }
  else if(old_pwd !== "" && new_pwd === "")
  {
    document.getElementById("modal_p").innerHTML = "New Password field can't be empty";
		$("#message_modal").modal();
		return ;
  }
  else if(old_pwd === "" && new_pwd !== "")
  {
    document.getElementById("modal_p").innerHTML = "Old Password field can't be empty";
		$("#message_modal").modal();
		return ;
  }
  
  var xhr = new XMLHttpRequest();
  var url = localStorage["rams_server"] + "api/users/change";
  var params = JSON.stringify({username:localStorage["Rams_usr_name"], old_password:old_pwd, new_password:new_pwd});
  xhr.open("POST", url, true);
  
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
  
  xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			alert(xhr.responseText);
			var json_data = JSON.parse(xhr.responseText);
			if(json_data["success"] == true)
			{
				// localStorage["Rams_usr_name"] = users_user_name;
				// localStorage["Rams_usr_tok"] = json_data["token"];
				var title = document.getElementById("modal_t");
				title.innerHTML = "<code style=\"color:green\">Success!</code>";
				document.getElementById("modal_p").innerHTML = "Successfully chagned password.";
				$("#message_modal").modal();
				
				document.getElementById("modal_close_btn").addEventListener("click", function() {
				  window.open("../html/dashboard.html", "_self");
				});
			}
			else
			{
				// var error_data = "Wrong Username or Password!";
				document.getElementById("modal_p").innerHTML = "Old Password entered is incorrect.";
				$("#message_modal").modal();
			}
		}
	}
	xhr.send(params);
}
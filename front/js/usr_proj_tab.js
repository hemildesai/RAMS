document.getElementById("create_proj_btn").addEventListener("click", create_proj);

$(document).ready(function() {
  var data = "username=" + localStorage["Rams_usr_name"];

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.open("GET", localStorage["rams_server"] + "api/projects");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
  
  xhr.addEventListener("readystatechange", function ()
  {
    if (this.readyState === 4)
    {
      var json_data = JSON.parse(xhr.responseText);
      if(json_data.success == true)
      {
        
      }
      else
      {
        
      }
    }
  });
  
  xhr.send(null);
});

function create_proj()
{
  var proj_row = document.getElementById("create_proj_row");
  proj_row.innerHTML = "";
  
  var form_proj = document.createElement("form");
  var form_div = document.createElement("div");
  form_div.className = "form-group";
  
  var new_proj_lbl = document.createElement("label");
  var new_proj_h = document.createElement("h2");
  var new_proj_txt = document.createTextNode("<code style=\"color:green\">New Project *</code>");

  new_proj_h.innerHTML = "<code style=\"color:green\">New Project *</code>";
  new_proj_lbl.appendChild(new_proj_h);
  
  var new_proj_input = document.createElement("input");
  new_proj_input.className = "form-control";
  new_proj_input.id = "usr_new_proj";
  new_proj_input.type = "text";
  
  var submit_btn = document.createElement("button");
  submit_btn.className = "btn btn-primary";
  submit_btn.innerHTML = "Submit";
  submit_btn.id = "proj_submit";
  
  
  var br = document.createElement("br");
  var br2 = document.createElement("br");
  
  var lbl_check_box = document.createElement("label");
  lbl_check_box.innerHTML = "Private";
  var box = document.createElement("input");
  box.id = "priv_proj";
  box.type = "checkbox";
  
  form_div.appendChild(new_proj_lbl);
  form_div.appendChild(new_proj_input);
  form_div.appendChild(br);
  form_div.appendChild(box);
  form_div.appendChild(lbl_check_box);
  form_div.appendChild(br2);
  form_div.appendChild(submit_btn);
  
  form_proj.appendChild(form_div);
  proj_row.appendChild(form_proj);
  
  document.getElementById("proj_submit").addEventListener("click", submit_proj);
  // document.getElementById("proj_submit").addEventListener("click", submit_proj);
}

function submit_proj(event)
{
  event.preventDefault();
  
  var is_proj_priv = document.getElementById("priv_proj").checked;
  var usr_new_proj = document.getElementById("usr_new_proj").value;
  
  if(usr_new_proj == "")
  {
		document.getElementById("modal_p").innerHTML = "Project Name cannot be empty!";
		$("#message_modal").modal();
  }

  var xhr = new XMLHttpRequest();
  var data = JSON.stringify({title:usr_new_proj, is_private:is_proj_priv});
  
  xhr.open("POST", localStorage["rams_server"] + "api/projects", true);
  xhr.setRequestHeader("content-type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
  
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == 4 && xhr.status == 200)
    {
      var json_data = JSON.parse(xhr.responseText);
      console.log(json_data);
      if(json_data["success"] == true)
      {
        
      }
    }
  };
  
  xhr.send(data);
}
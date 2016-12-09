document.getElementById("create_proj_btn").addEventListener("click", create_proj);
// document.getElementById("col_btn").addEventListener("click", create_col_function);

var pages_resources;
var pages_projects;
var pages_collections;
var list_resources;
var list_projects;
var list_collections;
var curr_proj_page;
var curr_rsrc_page;

var proj_id;

function create_col_function()
{
  event.preventDefault();
  var id = Number(this.id.split('_')[2]);
  var proj_id = document.getElementById("proj_tbl").rows[id].cells[1].textContent;
  
  var form_div_col = "<form><div class=\"form-group\">" +
  "<input class=\"form-control\" type=\"text\" id=\"collection_title\"/><br>" +
  "<button class=\"btn btn-primary\" id=\"submit_col_btn\">Create</button>&nbsp;" +
  "</div></form>";
  document.getElementById("modal_h").style.color = "green";
  document.getElementById("modal_h").innerHTML = "New Collection";
  document.getElementById("modal_p").innerHTML = form_div_col;
  document.getElementById("submit_col_btn").addEventListener("click", function() {
    post_col(proj_id);
  });
  
  $("#message_modal").modal();
}

function post_col(proj_id)
{
  event.preventDefault();
  
  var collection_name = document.getElementById("collection_title").value;
  
  if(collection_name === "")
  {
    var error_data = "Collection Name cannot be empty";
		document.getElementById("modal_p").innerHTML = error_data;
		$("#message_modal").modal();
		return;
  }
  
  var xhr = new XMLHttpRequest();
  var url = localStorage["rams_server"] + "api/collections";
	var params = JSON.stringify({title:collection_name, project_id:proj_id});
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
		  console.log(this.responseText);
		  $("#message_modal").modal('hide');
		}
	}
	
	xhr.send(params);
}

function cancel_function()
{
  event.preventDefault();
  
  document.getElementById("row_btn").innerHTML = "<button class=\"btn btn-primary\" id=\"col_btn\">Create Collection</button>";
  document.getElementById("col_btn").addEventListener("click", create_col_function);
}

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
        var proj_tbl = document.getElementById("proj_tbl");
        var projects = json_data["projects"];
        var i = 0;
        if(projects.length <= 10)
          pages_projects = 1;
        else
          pages_projects = (projects.length/10);
        for(i = 0; i < 10; i++)
        {
          var proj = projects[i];
          var prow = document.createElement("tr");
          var pid = document.createElement("td");
          var ptitle = document.createElement("td");
          var ppriv = document.createElement("td");
          
          ptitle.innerHTML = proj["title"] + "<div class=\"btn-group pull-right\" role=\"group\"><button class=\"btn btn-primary\" id=\"proj_" + i + "\">Show Collections</button>&nbsp;<button class=\"btn btn-success\" id=\"create_col_" + i + "\">Create Collection</button></div>";
          pid.innerHTML = proj["id"];
          ppriv.innerHTML = (proj["is_private"] == 0 ? "false" : "true");
          
          prow.appendChild(ptitle);
          prow.appendChild(pid);
          prow.appendChild(ppriv);
          
          proj_tbl.appendChild(prow);
          
          document.getElementById("proj_" + i).addEventListener("click", show_collections);
          document.getElementById("create_col_" + i).addEventListener("click", create_col_function);
        }
        list_projects = projects;
        pagination_proj();
      }
      else
      {
        
      }
    }
  });
  
  xhr.send(null);
});

function pagination_proj()
{
  var ul_proj = document.createElement("ul");
  ul_proj.className = "pagination";
  var i = 0;
  for(i = 0; i < pages_projects; i++)
    ul_proj.innerHTML += "<li><a href=\"#\" id=\"page_proj_" + (i + 1) + "\">" + (i + 1) + "</li>";
  
  var center_div = document.createElement("center");
  center_div.innerHTML = "<div class=\"container-fluid\" id=\"pages_div\"></div>";
  var row_tbl = document.getElementById("row_tbl_proj");
  row_tbl.appendChild(center_div);
  document.getElementById("pages_div").appendChild(ul_proj);
  
  for(i = 0; i < pages_projects; i++)
    document.getElementById("page_proj_" + (i + 1)).addEventListener("click", page_proj_content);
}

function page_proj_content()
{
  var page_num = Number(this.id.split('_')[2]);
  var start = (page_num - 1) * 10;
  if(list_projects <= (start + 10))
    end = list_projects.length - (start);
  else
    end = 10;
  var i = 0;
  var proj_tbl = document.getElementById("proj_tbl");
  proj_tbl.innerHTML = "";
  for(i = 0; i < end; i++)
  {
    var proj = list_projects[start + i];
    proj_tbl.innerHTML += "<tr><td>" + proj["title"] + "<div class=\"btn-group pull-right\" role=\"group\"><button class=\"btn btn-primary\" id=\"proj_" + i + "\">Show Collections</button>&nbsp;<button class=\"btn btn-success\" id=\"create_col_" + i + "\">Create Collection</button></div>" + "</td><td>" + proj["id"] + "</td><td>" + (proj["is_private"] == 0 ? "false" : "true") + "</td></tr>";
    
    document.getElementById("proj_" + i).addEventListener("click", show_collections);
    document.getElementById("create_col_" + i).addEventListener("click", create_col_function);
  }
}

function show_collections()
{
  event.preventDefault();
  
  var id = this.id.split('_')[1];
  var proj_tbl = document.getElementById("proj_tbl");
  var proj_id = proj_tbl.rows[id].cells[1].textContent;
  
  var xhr = new XMLHttpRequest();
	var url = localStorage["rams_server"] + "api/projects/" + proj_id + "/collections";
	xhr.open("GET", url);

  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
		  var json_data = JSON.parse(this.responseText);
		  console.log(json_data);
		  var tbl_h = document.getElementById("proj_row_1");
		  tbl_h.innerHTML = "";
		  tbl_h.innerHTML = "<th>Collection Title</th><th>ID</th>";
		  
		  var proj_tbl = document.getElementById("proj_tbl");
		  proj_tbl.innerHTML = "";
		  
		  var end;
		  list_collections = json_data["project"]["collections"];
		  console.log(list_collections);
		  if(list_collections.length <= 25)
		  {
		    page_collections = 1;
		    end = list_collections.length;
		  }
		  else
		  {
		    page_collections = (list_collections.length/25) + 1;
		    end = 25;
		  }
		    
		  var i = 0;
		  for(i = 0; i < end; i++)
		  {
		    var col = list_collections[i];
		    proj_tbl.innerHTML += "<tr><td>" + col["title"] + "<button class=\"btn btn-primary pull-right\" id=\"col_btn_" + i + "\">Show Resources</button></td><td>" + col["id"] + "</td>";
		  }
		  
		  for(i = 0; i < end; i++)
		    document.getElementById("col_btn_" + i).addEventListener("click", show_resources);
		}
	}
	
	xhr.send(null);
}

function show_resources()
{
  event.preventDefault();
  var id = this.id.split('_')[2];
  var proj_tbl = document.getElementById("proj_tbl");
  var col_id = proj_tbl.rows[id].cells[1].textContent;
  console.log(col_id);
  
  var xhr = new XMLHttpRequest();
	var url = localStorage["rams_server"] + "api/collections/" + col_id + "/resources";
	xhr.open("GET", url);
	
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
		  var json_data = JSON.parse(this.responseText);
		  var tbl_h = document.getElementById("proj_row_1");
		  tbl_h.innerHTML = "";
		  tbl_h.innerHTML = "<th>Name</th><th>ID</th><th>Link</th><th>Description</th><th>Tags</th>";
		  var proj_tbl = document.getElementById("proj_tbl");
		  proj_tbl.innerHTML = "";
		  
		  list_resources = json_data["collection"]["resources"];
		  console.log(list_resources);
		  var end = 0;
		  if(list_resources.length <= 25)
		  {
		    pages_resources = 1;
		    end = list_resources.length;
		  }
		  else
		  {
		    pages_resources = (list_resources.length/25) + 1;
		    end = 25;
		  }
		  var i = 0;
		  for(i = 0; i < end; i++)
		  {
		    var rsrc = list_resources[i];
		    proj_tbl.innerHTML += "<tr><td>" + rsrc["name"] + "</td><td>" + rsrc["id"] + "</td><td>" + rsrc["link"]+ "<button class=\"btn btn-danger pull-right\" id=\"del_btn_" + i + "\">Delete from Collection</button></td><td>None</td><td>None</td></tr>";
		  }
		  curr_rsrc_page = 1;
		  
		}
	}
	
	xhr.send(null);
}

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
  
  var is_proj_priv = (document.getElementById("priv_proj").checked === true) ? 1 : 0;
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
      alert(json_data["success"]);
      if(json_data["success"] == true)
      {
        location.reload(true);
      }
    }
  };
  
  xhr.send(data);
}
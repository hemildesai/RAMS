document.getElementById("logout_button").addEventListener("click", logout_function);
document.getElementById("submit_button").addEventListener("click", search_function);

$(document).ready(function()
	{
		var navbar_p = document.getElementById("signed_in");
		navbar_p.innerHTML = localStorage["Rams_usr_name"];

		var xhr = new XMLHttpRequest();
		var url = localStorage["rams_server"] + "api/resources";
		var data = "username="+localStorage["Rams_usr_name"];
		xhr.open("GET", url);

		xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);

		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				var rsrc_tbody = document.getElementById("rsrc_tbl");
				var json_data = JSON.parse(xhr.responseText);
				if(json_data["success"] === true)
				{
					var resources_usr = json_data["resources"];
					var i = 0;
					for(i = 0; i < resources_usr.length; i++)
					{
						var rsrc = resources_usr[i];
						var rsrc_row = document.createElement("tr");
						var link_td = document.createElement("td");
						var name_td = document.createElement("td");
						var desc_td = document.createElement("td");
						var tag_td = document.createElement("td");

						var rsrc_a = document.createElement('a');
						var lnk_txt = document.createTextNode(rsrc["link"]);
						rsrc_a.appendChild(lnk_txt);
						rsrc_a.href = rsrc["link"];

						var link_txt = document.createTextNode(rsrc["link"]);
						var name_txt = document.createTextNode(rsrc["name"]);
						var desc_txt = document.createTextNode("None");
						var tag_txt = document.createTextNode("None");
						
						var delete_button = document.createElement("button");
						var del_btn_txt = document.createTextNode("Delete");
						delete_button.appendChild(del_btn_txt);
						delete_button.id = "del_btn_" + i;
						delete_button.className = "btn btn-danger pull-right";

						link_td.appendChild(rsrc_a);
						link_td.appendChild(delete_button);
						link_td.id = "link_td_" + i;
						name_td.appendChild(name_txt);
						name_td.id = "name_td_" + i;
						desc_td.appendChild(desc_txt);
						desc_td.id = "desc_td_" + i;
						tag_td.appendChild(tag_txt);
						tag_td.id = "tag_td_" + i;

						rsrc_row.appendChild(name_td);
						rsrc_row.appendChild(link_td);
						rsrc_row.appendChild(desc_td);
						rsrc_row.appendChild(tag_td);

            rsrc_row.id = "rsrc_" + i;
						rsrc_tbody.appendChild(rsrc_row);
						
						document.getElementById("del_btn_" + i).addEventListener("click", delete_function);
					}
				}
				else
				{
					var error_data = "Error Loading Resources!";
					document.getElementById("modal_p").innerHTML = error_data;
					$("#message_modal").modal();
				}
			}
		}
		xhr.send(data);
	}
);

function search_function() {
	window.open("../search_client/index.html", "_self");
}

function logout_function() {

	localStorage["Rams_usr_name"] = "";
	localStorage["Rams_usr_tok"] = "";

	localStorage.removeItem("Rams_usr_name");
	localStorage.removeItem("Rams_usr_tok");

	window.open("../html/home_rams.html", "_self");
}

function delete_function() {
  var num_id = this.id.split('_')[2];
  
  var xhr = new XMLHttpRequest();
  var url = localStorage["rams_server"] + "api/resources/delete";
  
  var rsrc_tbl = document.getElementById("rsrc_tbl");
  rsrc_tbl.deleteRow(num_id);
  
  var i = 0;
  for(i = num_id; i < rsrc_tbl.rows.length; i++)
  {
    var rsrc_row = rsrc_tbl.rows[i];
    rsrc_row.id = "rsrc_" + i;
    
    var delete_btn_rw = rsrc_row.cells[1].children[1];
    delete_btn_rw.id = "del_btn_" + i;
  }
}
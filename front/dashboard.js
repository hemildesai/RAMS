document.getElementById("logout_button").addEventListener("click", logout_function);
document.getElementById("submit_button").addEventListener("click", search_function);

$(document).ready(function() 
	{
		var navbar_p = document.getElementById("signed_in");
		navbar_p.innerHTML = localStorage["Rams_usr_name"];

		var xhr = new XMLHttpRequest();
		var url = "http://localhost:3000/api/resources";
		var data = "username="+localStorage["Rams_usr_name"];
		xhr.open("GET", url);

		xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);

		xhr.onreadystatechange = function() 
		{
			if(xhr.readyState == 4) 
			{
				var rsrc_tbody = document.getElementById("rsrc_tbl");
				var json_data = JSON.parse(xhr.responseText);
				if(json_data["success"] == true)
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
						var link_txt = document.createTextNode(rsrc["link"]);
						rsrc_a.appendChild(link_txt);
						rsrc_a.href = rsrc["link"];

						var link_txt = document.createTextNode(rsrc["link"]);
						var name_txt = document.createTextNode(rsrc["name"]);
						var desc_txt = document.createTextNode("None");
						var tag_txt = document.createTextNode("None");

						link_td.appendChild(rsrc_a);
						name_td.appendChild(name_txt);
						desc_td.appendChild(desc_txt);
						tag_td.appendChild(tag_txt);

						rsrc_row.appendChild(name_td);
						rsrc_row.appendChild(link_td);
						rsrc_row.appendChild(desc_td);
						rsrc_row.appendChild(tag_td);

						rsrc_tbody.appendChild(rsrc_row);
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

	window.open("./home_rams.html", "_self");
}
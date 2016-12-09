document.getElementById("logout_button").addEventListener("click", logout_function);
document.getElementById("submit_button").addEventListener("click", search_function);
// document.getElementById("col_btn").addEventListener("click", create_col_function);

var list_resources;
var curr_page;
var pages;

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
					if(resources_usr.length <= 25)
					  pages = 1;
					else
					  pages = (resources_usr.length / 25) + 1;
					list_resources = resources_usr;
					for(i = 0; i < 25; i++)
					{
						var rsrc = resources_usr[i];
						var rsrc_row = document.createElement("tr");
						var link_td = document.createElement("td");
						var id_td = document.createElement("td");
						var name_td = document.createElement("td");
						var desc_td = document.createElement("td");
						var tag_td = document.createElement("td");

						var rsrc_a = document.createElement('a');
						var lnk_txt = document.createTextNode(rsrc["link"]);
						rsrc_a.appendChild(lnk_txt);
						rsrc_a.href = rsrc["link"];

						var link_txt = document.createTextNode(rsrc["link"]);
						var id_txt = document.createTextNode(rsrc["id"]);
						var name_txt = document.createTextNode(rsrc["name"]);
						var desc_txt = document.createTextNode("None");
						var tag_txt = document.createTextNode("None");
						
						var delete_button = document.createElement("button");
						var del_btn_txt = document.createTextNode("Delete");
						delete_button.appendChild(del_btn_txt);
						delete_button.id = "del_btn_" + i;
						delete_button.className = "btn btn-danger";
						
						var col_button = document.createElement("button");
						var col_btn_txt = document.createTextNode("Add to Collection");
						col_button.appendChild(col_btn_txt);
						col_button.id = "col_btn_" + i;
					  col_button.className = "btn btn-primary";
					  
					  var div_btn = document.createElement("div");
					  div_btn.appendChild(col_button);
					  div_btn.appendChild(delete_button);
					  div_btn.className = "btn-group pull-right";
					  div_btn.role = "group";

						link_td.appendChild(rsrc_a);
						link_td.appendChild(div_btn);
						link_td.id = "link_td_" + i;
						name_td.appendChild(name_txt);
						name_td.id = "name_td_" + i;
						desc_td.appendChild(desc_txt);
						desc_td.id = "desc_td_" + i;
						tag_td.appendChild(tag_txt);
						tag_td.id = "tag_td_" + i;
						id_td.appendChild(id_txt);
						id_td.id = "id_td_" + i;

						rsrc_row.appendChild(name_td);
						rsrc_row.appendChild(id_td);
						rsrc_row.appendChild(link_td);
						rsrc_row.appendChild(desc_td);
						rsrc_row.appendChild(tag_td);

            rsrc_row.id = "rsrc_" + i;
						rsrc_tbody.appendChild(rsrc_row);
						
						document.getElementById("del_btn_" + i).addEventListener("click", delete_function);
						document.getElementById("col_btn_" + i).addEventListener("click", add_to_collection_function);
					}
					var list_pages = create_pages(pages);
					var row_tbl = document.getElementById("row_tbl");
					row_tbl.appendChild(list_pages);
					curr_page = 1;
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

function add_to_collection_function()
{
  var r_id = Number(this.id.split('_')[2]);
  var xhr = new XMLHttpRequest();
	var url = localStorage["rams_server"] + "api/collections";
	// var data = "username="+localStorage["Rams_usr_name"];
	xhr.open("GET", url);

	xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
  
  xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
		  var list_html = "<div class=\"dropdown\">" +
        "<button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Dropdown Example" +
        "<span class=\"caret\"></span></button>" +
        "<ul class=\"dropdown-menu\">";
      
      var i = 0;
      var collections_list = JSON.parse(this.responseText).collections;
      for(i = 0; i < collections_list.length; i++)
      {
        var collection = collections_list[i];
        list_html += "<li><a href=\"#\" id=\"col_" + i + "\">" + collection["title"] + "</a></li>";
      }
      
      list_html += "</ul>";
      list_html += "</div>";
      
      document.getElementById("modal_p").innerHTML = list_html;
      
      for(i = 0; i < collections_list.length; i++)
        document.getElementById("col_" + i).addEventListener("click", function() {
          post_to_col_function(r_id, this.id);
        });
      
      $("#message_modal").modal();
		}
	}
  
  xhr.send();
}

function post_to_col_function(r_id, col)
{
  event.preventDefault();
  var rsrc_id = Number(document.getElementById("rsrc_tbl").rows[r_id].cells[1].textContent);
  var col_id = Number(col.split('_')[1]);
  
  console.log(col_id);
  
  var xhr = new XMLHttpRequest();
  var url = localStorage["rams_server"] + "api/collections/" + col_id + "/add";
	var params = JSON.stringify({resource_id:rsrc_id});
	xhr.open("POST", url, true);

  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4 && xhr.status == 200)
		{
		  var json_data = JSON.parse(xhr.responseText);
		  console.log(json_data);
		  if(json_data.success == true)
		  {
		    $("message_modal").modal('hide');
		    document.getElementById("modal_h").style.color = "green";
		    document.getElementById("modal_h").innerHTML = "Resource Added!";
		    document.getElementById("modal_p").innerHTML = "Resource Successlly added to Collection";
		    $("message_modal").modal();
		  }
		}
	}
	
	xhr.send(params);
}

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
  var rsrc_tbl = document.getElementById("rsrc_tbl");
  var rsrc_id = rsrc_tbl.rows[num_id].cells[1].textContent;
  
  var xhr = new XMLHttpRequest();
  var url = localStorage["rams_server"] + "api/resources/" + rsrc_id;
  var params = null;
  xhr.open("DELETE", url, true);
  
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("x-access-token", localStorage["Rams_usr_tok"]);
  
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == 4)
    {
      alert(xhr.responseText);
      var json_data = JSON.parse(xhr.responseText);
			if(json_data["success"] === true)
			{
			  rsrc_tbl.deleteRow(num_id);
        location.reload();
        var i = 0;
        /* for(i = num_id; i < rsrc_tbl.rows.length; i++)
        {
          var rsrc_row = rsrc_tbl.rows[i];
          rsrc_row.id = "rsrc_" + i;
          
          var delete_btn_rw = rsrc_row.cells[1].children[1];
          delete_btn_rw.id = "del_btn_" + i;
        } */
			}
			else
		  {
		    var error_msg = json_data["errors"]["message"];
		    document.getElementById("modal_p").innerHTML = error_msg;
				$("#message_modal").modal();
		  }
      // var rsrc_tbl = document.getElementById("rsrc_tbl");
    }
  }
  
  xhr.send(params);
}

function page_content()
{
  var page_id = this.id;
  curr_page = Number(page_id[page_id.length - 1]);
  var start = (Number(page_id[page_id.length - 1]) - 1) * 25;
  var end = 0;
  if(list_resources.length <= (start + 25))
    end = list_resources.length - (start);
  else
    end = 25;
  var rsrc_tbody = document.getElementById("rsrc_tbl");
  rsrc_tbl.innerHTML = "";
  for(i = 0; i < end; i++)
  {
    var rsrc = list_resources[start + i];
		var rsrc_row = document.createElement("tr");
		var link_td = document.createElement("td");
		var id_td = document.createElement("td");
		var name_td = document.createElement("td");
		var desc_td = document.createElement("td");
		var tag_td = document.createElement("td");

		var rsrc_a = document.createElement('a');
		var lnk_txt = document.createTextNode(rsrc["link"]);
		rsrc_a.appendChild(lnk_txt);
		rsrc_a.href = rsrc["link"];

		var link_txt = document.createTextNode(rsrc["link"]);
		var id_txt = document.createTextNode(rsrc["id"]);
		var name_txt = document.createTextNode(rsrc["name"]);
		var desc_txt = document.createTextNode("None");
		var tag_txt = document.createTextNode("None");
		
		var delete_button = document.createElement("button");
		var del_btn_txt = document.createTextNode("Delete");
		delete_button.appendChild(del_btn_txt);
		delete_button.id = "del_btn_" + i;
		delete_button.className = "btn btn-danger";
		
		var col_button = document.createElement("button");
		var col_btn_txt = document.createTextNode("Add to Collection");
		col_button.appendChild(col_btn_txt);
		col_button.id = "col_btn_" + i;
	  col_button.className = "btn btn-primary";
	  
	  var div_btn = document.createElement("div");
	  div_btn.appendChild(col_button);
	  div_btn.appendChild(delete_button);
	  div_btn.className = "btn-group pull-right";
	  div_btn.role = "group";

		link_td.appendChild(rsrc_a);
		link_td.appendChild(div_btn);
		link_td.id = "link_td_" + i;
		name_td.appendChild(name_txt);
		name_td.id = "name_td_" + i;
		desc_td.appendChild(desc_txt);
		desc_td.id = "desc_td_" + i;
		tag_td.appendChild(tag_txt);
		tag_td.id = "tag_td_" + i;
		id_td.appendChild(id_txt);
		id_td.id = "id_td_" + i;

		rsrc_row.appendChild(name_td);
		rsrc_row.appendChild(id_td);
		rsrc_row.appendChild(link_td);
		rsrc_row.appendChild(desc_td);
		rsrc_row.appendChild(tag_td);

    rsrc_row.id = "rsrc_" + i;
		rsrc_tbody.appendChild(rsrc_row);
		
		document.getElementById("del_btn_" + i).addEventListener("click", delete_function);
		document.getElementById("col_btn_" + i).addEventListener("click", add_to_collection_function);
  }
}

function page_prev()
{
  if(curr_page != 1)
    curr_page--;
  console.log(curr_page);
  var pg = document.getElementById("page_" + curr_page);
  pg.click();
}

function page_next()
{
  if(curr_page != pages)
    curr_page++;
  console.log(curr_page);
  var pg = document.getElementById("page_" + curr_page);
  pg.click();
}

function create_pages(pages)
{
  var center_div = document.createElement("center");
  var div_ul = document.createElement("div");
  div_ul.className = "container-fluid";
  div_ul.id = "ul_div";
  var ul_page = document.createElement("ul");
  ul_page.className = "pagination";
  var prev_arr = document.createElement("li");
  var arr = document.createElement("a");
  arr.href="#";
  arr.id = "page_prev";
  arr.innerHTML = "<";
  arr.addEventListener("click", page_prev);
  prev_arr.appendChild(arr);
  ul_page.appendChild(prev_arr);
  for(i = 1; i <= pages; i++)
  {
    var li_i = document.createElement("li");
    var a_href = document.createElement("a");
    a_href.href = "#";
    a_href.id = "page_" + i;
    a_href.innerHTML = i;
    a_href.addEventListener("click", page_content);
    li_i.appendChild(a_href);
    ul_page.appendChild(li_i);
  }
  var next_arr = document.createElement("li");
  var narr = document.createElement("a");
  narr.href="#";
  narr.id = "page_prev";
  narr.innerHTML = ">";
  narr.addEventListener("click", page_next);
  next_arr.appendChild(narr);
  ul_page.appendChild(next_arr);
  div_ul.appendChild(ul_page);
  center_div.appendChild(div_ul);
  return center_div;
}
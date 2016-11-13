$(document).ready(function() {
  
  var navbar_p = document.getElementById("signed_in");
	navbar_p.innerHTML = localStorage["Rams_usr_name"];
  
  document.getElementById("change_btn").addEventListener("click", change_function);
});

function change_function() {
  var edit_div = document.getElementById("edit_div");
  edit_div.innerHTML = "";
  var form_pwd = document.createElement("form");
  var form_div = document.createElement("div");
  form_div.class = "";
}
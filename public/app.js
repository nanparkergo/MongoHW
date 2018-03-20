$( "#getArticles" ).click(function() {
  // alert( "Handler for .click() called." );
  alert(data[1].link);	
});
console.log("inside app.js");

$.getJSON("/all", function(data) {

	// for each entry of that json
	console.log(data);
	// for (var i = 0; i < data.length; i++) {
	 alert(data[1].link);	
// 	}
});
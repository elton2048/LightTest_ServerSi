$(document).ready(function() {
  var stage = new createjs.Stage("testcanvas");
  var sc = new StoneCollection();
  var view = new CanvasView({stage: stage,collection: sc,no:"n"});
  view.render();
  
  $("#save").click( function(){
	var i =0 ;
	sc.fetch({
						success:	function(collection, response, options){
									sc.each(	function(){
										console.log(response[i]);
										view.renderStone(response[i]);
										i++;
										})
										$("#save").attr("disabled", true);
										
									},
						error:		function(collection, response, options){
										alert("failed, "+collection);
									}
						});
		});
});
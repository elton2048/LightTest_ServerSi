var Stone = Backbone.Model.extend({
							default: {	
									X:"",
									Y:"",
									stoneid:"",
									}
});
 
var StoneCollection = Backbone.Collection.extend({
  model: Stone,
	url:'/api/5_2'
});
var CanvasView = Backbone.View.extend({
    initialize: function(args) {
	this.stage = args.stage;
	this.stage.enableMouseOver(20);
	this.collection = args.collection;
	var stonesize =0;
	this.stonesize=0;
	this.currentstone=null;
	this.collection.fetch({
						success:	function(collection, response, options){
									collection.each(	function(){
										console.log(response[stonesize]);
										stonesize++;
										})										
									},
						error:		function(collection, response, options){
										alert("failed, "+collection);
									}
						});

	this.rakeOffsets = {
	    x: 10,
	    y: 400,
	    height: 150,
	    width: 300,
	    stoneWidth: 50,
	    stoneHeight: 50
	};
	
	this.listenTo(this.collection, "addstone", this.renderStone, this);
	this.listenTo(this.collection, "remove", this.renderRake, this);
	this.listenTo(this.collection, "reset", this.renderRake, this);
    },

    render: function() {
	this.renderRake();
	this.stage.update();
	createjs.Ticker.addEventListener("tick", this.stage);
	createjs.Ticker.setInterval(25);
	createjs.Ticker.setFPS(60);
    },


    renderRake: function() {
	var that = this;

	var rakeShape = new createjs.Shape();
	
	rakeShape.graphics.beginStroke("#000").beginFill("#daa").drawRect(this.rakeOffsets.x, this.rakeOffsets.y, this.rakeOffsets.width, this.rakeOffsets.height);
	
	rakeShape.on("click", function(evt) {
	    that.collection.add(new Stone());
		that.collection.trigger("addstone");
	});
	
	this.stage.addChild(rakeShape);

	this.stoneContainer = new createjs.Container();
	
	this.stage.addChild(this.stoneContainer);

	
	
    },

    renderStone: function(model) {
	var baseView = this;
	var xpos=0;
	var ypos=0;
	var	stoneid = baseView.stonesize;
	if(model!=null)
	{
		xpos = model.X;
		ypos = model.Y;	
		stoneid = model.stoneid;
		baseView.stonesize = stoneid;
	}
	var stoneShape = buildStoneShape(xpos,ypos,stoneid);
	baseView.currentstone=stoneShape;
	console.log(stoneShape.stoneid);
	buildDraggable(stoneShape, function(target, xpos, ypos) {
	rakeSnap(target, false);
	});
	
	this.stoneContainer.addChild(stoneShape);
	this.stage.update();

	function buildStoneShape(X,Y,SI) {
	     var shape = new createjs.Shape();
	    shape.graphics.beginStroke("#000").beginFill("#ddd").drawRect(0, 0, baseView.rakeOffsets.stoneWidth, baseView.rakeOffsets.stoneHeight);
		shape.x = X;
		shape.y = Y;
		shape.ax=X;
		shape.ay=Y;
		shape.stoneid=SI;
		baseView.stonesize++;
		return shape;
	};
	

	function buildDraggable(s, end) {
	    s.on("mouseover", function(evt) {
		evt.target.cursor = "pointer";
	    });
	    
	    s.on("mousedown" , function(evt) {
		baseView.stoneContainer.setChildIndex(evt.target, baseView.stoneContainer.getNumChildren() - 1);
		evt.target.ox = evt.target.x - evt.stageX;
		evt.target.oy = evt.target.y - evt.stageY;
		baseView.stage.update();
	    });

	    s.on("pressmove", function(evt) {
		evt.target.x = evt.target.ox + evt.stageX;
		evt.target.y = evt.target.oy + evt.stageY;
		baseView.stage.update();
	    });

	    s.on("pressup", function(evt) {
		if (end) {
		    end(evt.target, evt.stageX + evt.target.ox, evt.stageY + evt.target.oy);
		}

	    });
	};

	function dragStone(s, x, y, animate) {
	    if (animate) {
		createjs.Tween.get(s).to({x: x, y: y}, 100, createjs.Ease.linear);
	    } else {
		s.x = x;
		s.y = y;
	    }
		var newstone = new Stone();
		baseView.collection.push(newstone);
		newstone.save({X:s.x,Y:s.y,stoneid:s.stoneid});
	    baseView.stage.update();
	};
	
	
	function snapX(x) {
	    if (x < baseView.rakeOffsets.x) x = baseView.rakeOffsets.x;
	    else if (x > baseView.rakeOffsets.x + baseView.rakeOffsets.width - baseView.rakeOffsets.stoneWidth) 
		x = baseView.rakeOffsets.x + baseView.rakeOffsets.width - baseView.rakeOffsets.stoneWidth;
		return x;
	};

	function snapY(y) {
	    if (y < baseView.rakeOffsets.y) y = baseView.rakeOffsets.y;
	    else if (y > baseView.rakeOffsets.y + baseView.rakeOffsets.height - baseView.rakeOffsets.stoneHeight)
		y = baseView.rakeOffsets.y + baseView.rakeOffsets.height - baseView.rakeOffsets.stoneHeight;
	    return y;
	};
	
	function rakeSnap(s,animateDisabled) {
		console.log(s.x);
	    dragStone(s, snapX(s.x), snapY(s.y), !animateDisabled);
	};

    }
		   
});
	
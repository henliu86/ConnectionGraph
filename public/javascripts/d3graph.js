

var width = 550,
height = 600

var svg = d3.select("#myD3Div").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class","mySvgClass");

var force = d3.layout.force()
	.gravity(.15)
	.distance(150)
	.charge(-700)
	.friction(0.9)
	.size([width, height]);

//var myd3Object = {{d3object}}; //"/json/graphTest.json"
d3.json(myd3Object, function(error, json) { 
	force.nodes(json.nodes)
		.links(json.links)
		.start();

	var link = svg.selectAll(".link")
		.data(json.links)
		.enter().append("line")
		.attr("class", "link");

	var node = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.attr("class", "node")
		//.attr("linkStrength",function(d){ return d.linkStrength; })
		.call(force.drag);

	node.append("image")
		.attr("xlink:href", function(d){ return d.imgUrl })
		.attr("x", -20)
		.attr("y", -20)
		.attr("width", 56)
		.attr("height", 76);

	node.append("text")
		.attr("dx", 22)
		.attr("dy", ".35em")
		.text(function(d) { 
			return d.name;
		});

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
});

/*
selection.on("click", function(d) {
	if (d3.event.defaultPrevented) return; // ignore drag
	//otherwiseDoAwesomeThing();
	console.log('clicked!');
});
*/
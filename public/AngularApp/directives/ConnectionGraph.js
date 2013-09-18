angular.module("graphapp").directive("myjson",function(){
	return {
		restrict: "A",
		controller: "ConnectionGraphCtrl",
		link: function(scope,element){
			var d3func = function(scope)
			{
				//run d3
				var width = 450,
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
				/*
				var drag = force.drag()
    				.on("dragstart", dragstart);
				*/
				(function(json) { 
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
						.attr("xlink:href", function(d){ return d.ImgUrl })
						.attr("x", -20)
						.attr("y", -20)
						.attr("width", 36)
						.attr("height", 56)
						.attr("class","nodeImg");

					node.append("text")
						.attr("dx", 22)
						.attr("dy", ".35em")
						.attr("class","nodetext")
						.text(function(d) { 
							return d.Name;
						});

					node.on("click", function(d) {
						if (d3.event.defaultPrevented) return; // ignore drag
						//otherwiseDoAwesomeThing();
						console.log('clicked on ' + d.Id);

					});

					force.on("tick", function() {
						link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
					});

					/*
					selection.on("click", function(d) {
						if (d3.event.defaultPrevented) return; // ignore drag
						//otherwiseDoAwesomeThing();
						console.log('clicked!');
					});
					*/
				} (scope.d3object));
			}


			//call function to get salesforce data
			scope.getSalesforceJSON(d3func);
		}
	}
});

angular.module("graphapp").directive("connectionGraphic",function(){
	return {
		restrict: "A",
		controller: "ConnectionGraphCtrl",
		link: function(scope,element){
			
			
		}
	}
});
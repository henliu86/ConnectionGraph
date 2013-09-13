//My beautiful D3 code will go here!!!
var w = 500;
var h = 300;
var svg = d3.select("#myD3Div")
			.append("svg")
			.attr("id","mySVG")
			.attr("width",w)
			.attr("height",h);

var dataset = [25,60,75,80,95];


//for scaling
/*
var scaleMax = d3.max(dataset, function(data){
	return d;
});
var xScale = d3.scale.linear()
					.range([0,w]);
					.domain([0, scaleMax]);

var yScale = d3.scale.linear()
				.range([0,h]);
				.domain([0, scaleMax]);
*/

d3.select("#mySVG")
	.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx",function(data, index){
		return index * 50 + 25;
	})
	.attr("cy","26")
	.attr("r",function(d){
		return d;
	})
	.attr("class","pumpkin");


//bar chart
svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", function(data, index){
		return 21 * index;
	})
	.attr("y",function(data, index){
		return h - data; //flip the graph
	})
	.attr("width",20)
	.attr("height",function(data,index){
		return data;
	});

//add labels
svg.selectAll("text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(data){
		return data;
	})
	.attr("text-anchor","middle")
	.attr("x", function(d,i){
		return i * 21 + 10;
	})
	.attr("y", function(d){
		return h - (d-15);
	})
	.attr("fill","#fff");
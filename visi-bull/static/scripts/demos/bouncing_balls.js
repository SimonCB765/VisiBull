var ballRadius = 20;
var ballDiameter = 2 * ballRadius;
var numberOfBalls = 20;
var ballSpeed = 5;
var svgWidth = 960 - ballDiameter;
var svgHeight = 500 - ballDiameter;
var colors = ["rgb(102,194,165)", "rgb(252,141,98)", "rgb(141,160,203)", "rgb(231,138,195)", "rgb(166,216,84)", "rgb(255,217,47)", "rgb(229,196,148)", "rgb(179,179,179)"];
	// colors are 8 color set2 from color brewer http://colorbrewer2.org/#

var svg = create_SVG("div.content");
var balls = initiliase_balls(svg);
d3.timer(function()
{
	balls
		.attr("cx", function(d) {d.x += (d.speed * Math.cos(d.angle * Math.PI)); if (d.x <= 0) {d.x = 0;} else if (d.x >= svgWidth) {d.x = svgWidth} return d.x;})  // Calculated using cos(x) = adj / hyp.
		.attr("cy", function(d) {d.y += (d.speed * Math.sin(d.angle * Math.PI)); if (d.y <= 0) {d.y = 0;} else if (d.y >= svgHeight) {d.y = svgHeight} return d.y;})  // Calculated using sin(x) = opp / hyp.
		.each(function(d) {if (d.x == 0 || d.x == svgWidth) {d.angle = 2 + (1 - d.angle);}})
		.each(function(d) {if (d.y == 0 || d.y == svgHeight) {d.angle = 2 - d.angle}});
});

function create_SVG(selectionString)
{
	var containerDiv = d3.select(selectionString);
	var svg = containerDiv.append("svg")
		.attr("width", svgWidth + ballDiameter)
		.attr("height", svgHeight + ballDiameter)
		.append("g")
		.attr("transform", "translate(" + ballRadius + "," + ballRadius + ")");
	return svg;
}

function initiliase_balls(svg)
{
	var ballData = [];
	for (var i = 0; i < numberOfBalls; i++)
	{
		var invalidLoc = true;
		while (invalidLoc)
		{
			invalidLoc = false;
			
			var ballXLoc = Math.random() * svgWidth;
			var ballYLoc = Math.random() * svgHeight;
			for (var j = 0; j < ballData.length; j++)
			{
				var xDiff = ballXLoc - ballData[j].x;
				var yDiff = ballYLoc - ballData[j].y;
				if (Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) < (2.5 * ballRadius))
				{
					invalidLoc = true;
					break;
				}
			}
		}
		var ballColor = colors[Math.floor(Math.random() * colors.length)];
		var ballDirection = Math.random() * 2
		ballData.push({"x" : ballXLoc, "y" : ballYLoc, "color" : ballColor, "angle" : ballDirection, "speed" : ballSpeed});
	}

	var balls = svg.selectAll("circle")
		.data(ballData)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return d.x; })
		.attr("cy", function (d) { return d.y; })
		.attr("r", ballRadius)
		.style("fill", function(d) { return d.color; });
	return balls
}
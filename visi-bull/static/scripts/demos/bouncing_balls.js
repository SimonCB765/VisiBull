var ballRadius = 20;
var ballDiameter = 2 * ballRadius;
var numberOfBalls = 20;
var svgWidth = 960 - ballDiameter;
var svgHeight = 500 - ballDiameter;
var colors = ["rgb(102,194,165)", "rgb(252,141,98)", "rgb(141,160,203)", "rgb(231,138,195)", "rgb(166,216,84)", "rgb(255,217,47)", "rgb(229,196,148)", "rgb(179,179,179)"];
	// colors are 8 color set2 from color brewer http://colorbrewer2.org/#

function addBallInitialisation()
{
	var svg = createSVG("#ballInitialisation", true);
	var balls = initiliaseBalls(svg);
}

function createSVG(selectionString, shrunken)
{
	shrunken = (typeof shrunken === "undefined") ? false : true;
	var containerDiv = d3.select(selectionString);
	var svg = containerDiv.append("svg")
		.attr("width", svgWidth + ballDiameter)
		.attr("height", svgHeight + ballDiameter)
		.append("g")
		.attr("transform", "translate(" + ballRadius + "," + ballRadius + ")");
	return svg;
}

function initiliaseBalls(svg)
{

	var ballsPerRow = Math.floor(svgWidth / ballDiameter);
	var ballsPerCol = Math.floor(svgHeight / ballDiameter);
	var possibleCoords = [];
	for (var i = 0; i < ballsPerRow; i++)
	{
		for (var j = 0; j < ballsPerCol; j++)
		{
			possibleCoords.push([i * ballDiameter, j * ballDiameter]);
		}
	}

	var ballData = [];
	for (var i = 0; i < numberOfBalls; i++)
	{
		var randomIndex = Math.floor(Math.random() * possibleCoords.length);
		var ballCoords = possibleCoords.splice(randomIndex, 1)[0];
		var ballXLoc = ballCoords[0];
		var ballYLoc = ballCoords[1];
		var ballColor = colors[Math.floor(Math.random() * colors.length)];
		var ballDirection = Math.random() * 2
		ballData.push({"xLoc" : ballXLoc, "yLoc" : ballYLoc, "color" : ballColor, "direction" : ballDirection});
	}

	var balls = svg.selectAll("circle")
		.data(ballData)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return d.xLoc; })
		.attr("cy", function (d) { return d.yLoc; })
		.attr("r", ballRadius)
		.style("fill", function(d) { return d.color; });
	return balls
}
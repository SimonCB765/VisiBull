var svgWidth = 500;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var faceRadius = 10;  // The radius of each face.
var faceDiameter = faceRadius * 2;  // The diameter of each face.
var eyeMajorRadius = faceRadius / 4;  // The longer radius of the ellipses that make up the eyes.
var eyeMinorRadius = faceRadius / 8;  // The shorter radius of the ellipses that make up the eyes.

var pillHeight = 12;  // The width of the pill projectile.
var pillWidth = 5;  // The width of the pill projectile.

// Create the SVG g element.
var svg = d3.select(".content")
	.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("tabindex", 0);  // Set tab index to ensure that the element can get focus.
svg[0][0].focus();  // Set initial focus.

// Create the definitions tag.
var defs = svg.append("defs");

// Define the happy face.
var happyFaceContainer = defs.append("g")  // Container for the happy face.
	.attr("id", "happyFace")
	.classed("happyFace", true);
happyFaceContainer.append("circle")  // Circle for the face.
	.classed("face", true)
	.attr("cx", faceRadius)
	.attr("cy", faceRadius)
	.attr("r", faceRadius);
happyFaceContainer.append("ellipse")  // Left eye.
	.classed("eye", true)
	.attr("cx", faceDiameter / 3)
	.attr("cy", faceDiameter / 3)
	.attr("rx", eyeMinorRadius)
	.attr("ry", eyeMajorRadius);
happyFaceContainer.append("ellipse")  // Right eye.
	.classed("eye", true)
	.attr("cx", faceDiameter * 2 / 3)
	.attr("cy", faceDiameter / 3)
	.attr("rx", eyeMinorRadius)
	.attr("ry", eyeMajorRadius);
happyFaceContainer.append("path")  // Smile.
	.classed("mouth", true)
	.attr("d", "M" + (faceDiameter / 6) + "," + (faceDiameter * 5 / 8) + "A" + (faceRadius * 5 / 6) + "," + (faceRadius * 7 / 6) + ",0,0,0," + (faceDiameter * 5 / 6) + "," + (faceDiameter * 5 / 8));

// Define the pill.
var pillGradient = defs.append("linearGradient")
	.attr("id", "pillGradient")
	.attr("x1", "0%")
	.attr("y1", "0%")
	.attr("x2", "0%")
	.attr("y2", "100%");
pillGradient.append("stop")
	.attr("offset", "0%")
	.style("stop-color", "red")
	.style("stop-opacity", 1);
pillGradient.append("stop")
	.attr("offset", "50%")
	.style("stop-color", "red")
	.style("stop-opacity", 1);
pillGradient.append("stop")
	.attr("offset", "51%")
	.style("stop-color", "white")
	.style("stop-opacity", 1);
pillGradient.append("stop")
	.attr("offset", "100%")
	.style("stop-color", "white")
	.style("stop-opacity", 1);
var pillContainer = defs.append("g")  // The container for the pill.
	.attr("id", "pill");
var pill = pillContainer.append("rect")
	.classed("pill", true)
	.attr("height", pillHeight)
	.attr("width", pillWidth)
	.attr("rx", 3)
	.attr("ry", 3)
	.attr("fill", "url(#pillGradient)");

// Initialise the game.
initialise_game();

function initialise_game()
{
	// Remove all remaining faces and projectiles.
	d3.selectAll("face").remove();
	
	// Define needed values.
	var faceGap = pillWidth * 2;  // The gap between sad faces.
	var facesPerLine = 11;  // Number of sad faces on each line.
	var numberOfLines = 5;  // Number of lines of faces.
	var timeBetweenSteps = 750;  // Milliseconds between redraws.
	var movementSpeed = 10;  // Horizontal distance moved each time step.
	var stepsBeforeDrop = (svgWidth - (facesPerLine * faceDiameter) - ((facesPerLine - 1) * faceGap)) / movementSpeed;  // Number of sideways time steps before dropping down a level.
	var sidewaysStepsTaken = 0;  // The number of sideways steps taken since the last vertical drop.
	var lowestFace;  // The Y position of the lowest face (used to determine game over by reaching the bottom).
	
	// Add all the blue faces starting from the upper left.
	var facePositions = [];
	for (var i = 2; i < 2 + numberOfLines; i++)
	{
		var transY = (faceDiameter + faceGap) * i;
		lowestFace = transY;
		for (var j = 0; j < facesPerLine; j++)
		{
			var transX = (faceDiameter + faceGap) * j;
			facePositions.push({"transX" : transX, "transY" : transY});
		}
	}
	var faceContainer = svg.selectAll(".sadFace")  // g element that contains all the moving faces.
		.data(facePositions)
		.enter()
		.append("g")
		.classed("sadFace", true)
		.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
	faceContainer.append("circle")  // Circle for the face.
		.classed("face", true)
		.attr("cx", faceRadius)
		.attr("cy", faceRadius)
		.attr("r", faceRadius);
	faceContainer.append("ellipse")  // Left eye.
		.classed("eye", true)
		.attr("cx", faceDiameter / 3)
		.attr("cy", (faceDiameter / 3) + (faceRadius / 4))
		.attr("rx", eyeMinorRadius)
		.attr("ry", eyeMajorRadius);
	faceContainer.append("ellipse")  // Right eye.
		.classed("eye", true)
		.attr("cx", faceDiameter * 2 / 3)
		.attr("cy", (faceDiameter / 3) + (faceRadius / 4))
		.attr("rx", eyeMinorRadius)
		.attr("ry", eyeMajorRadius);
	faceContainer.append("path")  // Frown.
		.classed("mouth", true)
		.attr("d", "M" + (faceDiameter * 2 / 6) + "," + (faceDiameter * 6 / 8) + "A" + (faceRadius * 5 / 6) + "," + (faceRadius * 5 / 6) + ",0,0,1," + (faceDiameter * 4 / 6) + "," + (faceDiameter * 6 / 8));
	
	
    // Setup the timer for the face movement.
    var gameStep = setInterval(move_faces, timeBetweenSteps);
	
	function move_faces()
	{
		// Determine how to move the faces.
		var changeInX, changeInY;
		if (sidewaysStepsTaken === stepsBeforeDrop)
		{
			changeInX = 0;
			changeInY = faceDiameter + faceGap;
			movementSpeed *= -1;
			sidewaysStepsTaken = 0;
		}
		else
		{
			changeInX = movementSpeed;
			changeInY = 0;
			sidewaysStepsTaken++;
		}
		
		// Move the faces.
		svg.selectAll(".sadFace")
			.transition()
			.duration(timeBetweenSteps)
			.ease("linear")
			.attr("transform", function(d) { d.transX += changeInX; d.transY += changeInY; return "translate(" + d.transX + "," + d.transY + ")"; });
	}
}



svg.append("use")
	.datum({"transX" : 0, "transY" : 0})
	.attr("xlink:href", "#happyFace")
	.attr("x", 200)
	.attr("y", 400);
svg.append("use")
	.datum({"transX" : 0, "transY" : 0})
	.attr("xlink:href", "#pill")
	.attr("x", 300)
	.attr("y", 400);
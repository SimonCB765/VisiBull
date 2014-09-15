var ballRadius = 20;  // The radius of the balls.
var numberOfBalls = 25;  // The number of balls in the container.
var baseBallSpeed = 5;  // The starting speed of the balls.
var ballSpeedScaling = 1.0;  // The value by which to scale the balls speed (the user can alter this dynamically).
var svgWidth = 960;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.
var bucketGap = 100;  // The gap at the right of the SVG element for the ball bucket.
var sliderGap = 50;  // The gap at the bottom of the SVG element for the slider.
var containerWidth = svgWidth - bucketGap;  // The width of the container that will contain the balls.
var containerHeight = svgHeight - sliderGap;  // The height of the container that will contain the balls.
var colors = ["rgb(102,194,165)", "rgb(252,141,98)", "rgb(141,160,203)", "rgb(231,138,195)", "rgb(166,216,84)", "rgb(255,217,47)", "rgb(229,196,148)", "rgb(179,179,179)"];
    // colors are 8 color set2 from color brewer http://colorbrewer2.org/#

// Create the SVG element.
var svg = create_SVG("div.content");

// Create the container in which the balls will bounce around.
var ballBox = svg.append("rect")
    .classed("ballBox", true)
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("fill-opacity", 0)
    .style("stroke", "black");

// Create the balls.
var balls = initiliase_balls(svg);

// Create the speed slider.
var sliderOffset = 150;  // Offset of the slider's left end from the left of the SVG element.
var sliderMax = containerWidth - (2 * sliderOffset)  // Offset of the slider's right end from the left of the SVG element
var speedScale = d3.scale.linear()  // Scale used to map position on the slider to speed of ball movement.
    .domain([0, 3])
    .range([0, sliderMax])
    .clamp(true);
create_slider(svg, sliderOffset, sliderMax, speedScale)

// Setup the loop to animate the balls.
d3.timer(function()
{
    svg.selectAll(".ball.anim")  // Only select those balls that are to be animated (i.e. have class anim).
        .attr("cx", function(d) {d.x += (d.speed * ballSpeedScaling * Math.cos(d.angle * Math.PI)); if (d.x <= ballRadius) {d.x = ballRadius;} else if (d.x >= containerWidth - ballRadius) {d.x = containerWidth - ballRadius} return d.x;})  // Calculated using cos(x) = adj / hyp.
        .attr("cy", function(d) {d.y += (d.speed * ballSpeedScaling * Math.sin(d.angle * Math.PI)); if (d.y <= ballRadius) {d.y = ballRadius;} else if (d.y >= containerHeight - ballRadius) {d.y = containerHeight - ballRadius} return d.y;})  // Calculated using sin(x) = opp / hyp.
        .each(function(d) {if (d.x == ballRadius || d.x == containerWidth - ballRadius) {d.angle = 2 + (1 - d.angle);}})
        .each(function(d) {if (d.y == ballRadius || d.y == containerHeight - ballRadius) {d.angle = 2 - d.angle}});
});

// Define the drag behavious of the balls.
var ballDrag = d3.behavior.drag()
    .origin(function(d) {return d;})
    .on("dragstart", ball_drag_start)
    .on("drag", ball_drag_update)
    .on("dragend", ball_drag_end);
balls.call(ballDrag);

function ball_drag_end()
{
    d3.select(this).classed("anim", true);  // Turn on animation for the ball.
}

function ball_drag_start()
{
    d3.event.sourceEvent.stopPropagation(); // Silence any other listeners.
    d3.select(this).classed("anim", false);  // Turn off animation for the ball.
}

function ball_drag_update(d)
{
    // Current position of the ball relative to its container.
    var ballPosX = d3.event.x;
    var ballPosY = d3.event.y;

    // Update the ball's position.
    d3.select(this)
        .attr("cx", d.x = Math.max(ballRadius, Math.min(containerWidth - ballRadius, ballPosX)))
        .attr("cy", d.y = Math.max(ballRadius, Math.min(containerHeight - ballRadius, ballPosY)));
}

function create_slider(svg, sliderOffset, sliderMax, speedScale)
{
    // Create the g element for holding the speed slider.
    var speedSliderBox = svg.append("g")
        .classed("sliderBox", true)
        .attr("transform", "translate(0," + containerHeight + ")");

    // Define the drag behaviour.
    var drag = d3.behavior.drag()
        .origin(function(d) {return d;})
        .on("drag", slider_drag_update);

    // Create the axis for the speed slider.
    var speedScaleAxisFormat = d3.format("%");
    var speedScaleAxis = d3.svg.axis()
        .scale(speedScale)
        .orient("bottom")
        .tickFormat(speedScaleAxisFormat)
        .tickSize(0)
        .tickPadding(10);
    var speedScaleAxisContainer = speedSliderBox.append("g")
        .classed("xAxis", true)
        .attr("transform", "translate(" + sliderOffset + "," + sliderGap / 2 + ")")
        .call(speedScaleAxis)
    speedScaleAxisContainer.select(".domain")  // Select the path with the domain class that is created along with the axis.
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })  // Clone the domain class path...
        .attr("class", "halo");  // ...and set the class of the newly cloned path (enables the .domain to act as a little shadow around the .halo path).
    var speedSliderLabel = speedSliderBox.append("text")
        .text("Speed")
        .attr("x", sliderOffset / 2)
        .attr("y", sliderGap / 2)
        .style("font-weight", 700)
        .style("dominant-baseline", "middle");

    // Add the speed slider handle.
    var handleRadius = 8;  // The radius of the circle used as the speed slider handle.
    var handle = speedScaleAxisContainer.append("circle")
        .datum({"x" : 0, "y" : 0})
        .classed("handle", true)
        .attr("r", handleRadius)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .call(drag);
    handle.transition()  // Unnecessary intro transition.
        .duration(1000)
        .attr("cx", function(d) { d.x = speedScale(1); return d.x; });
}

function create_SVG(selectionString)
{
    var containerDiv = d3.select(selectionString);
    var svg = containerDiv.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
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

            var ballXLoc = Math.random() * containerWidth;
            var ballYLoc = Math.random() * containerHeight;
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
        ballData.push({"x" : ballXLoc, "y" : ballYLoc, "color" : ballColor, "angle" : ballDirection, "speed" : baseBallSpeed});
    }

    var balls = svg.selectAll("circle")
        .data(ballData)
        .enter()
        .append("circle")
        .classed({"ball" : true, "anim" : true})
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", ballRadius)
        .style("fill", function(d) { return d.color; });
    return balls
}

function slider_drag_update(d)
{
    var sliderPos = d3.event.x;  // Current position of the slider handle relative to its container.

    // Update the slider handle position.
    d3.select(this)
        .attr("cx", d.x = Math.max(0, Math.min(sliderMax, sliderPos)));

    // Update the value by which the speed is scaled.
    ballSpeedScaling = speedScale.invert(sliderPos);
}
var ballRadius = 20;  // The radius of the balls.
var numberOfBalls = 10;  // The number of balls in the container.
var baseBallSpeed = 4;  // The starting speed of the balls.
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
var ballBox = svg.append("g")
    .classed("ballContainer", true)
    .attr("transform", "translate(1, 1)")  // Shift of one down and right to enable the border of the ball container to show properly at the top and left.
    .on("click", fire_ball);  // Setup the clicking on the background.
ballBox.append("rect")
    .classed("ballBoundingSquare", true)
    .attr("width", containerWidth)
    .attr("height", containerHeight);

// Create the balls.
var balls = initiliase_balls(ballBox);

// Create the speed slider.
var sliderOffset = 150;  // Offset of the slider's left end from the left of the SVG element.
var sliderMax = containerWidth - (2 * sliderOffset)  // Offset of the slider's right end from the left of the SVG element
var speedScale = d3.scale.linear()  // Scale used to map position on the slider to speed of ball movement.
    .domain([0, 3])
    .range([0, sliderMax])
    .clamp(true);
create_slider(svg, sliderOffset, sliderMax, speedScale)

// Create the bucket to contain the balls that have been clicked on.
var bucketWidth = (2 * (ballRadius + 2));  // Width of the bucket.
var bucketOffsetX = containerWidth + ((bucketGap - bucketWidth) / 2);  // Offset of the bucket's top left corner from the left of the SVG element.
var bucketOffsetY = 50;  // Offset of the bucket's top left corner from the top of the SVG element.
var bucketHeight = containerHeight - (2 * bucketOffsetY);  // Height of the bucket.
var clickedBallBucket = create_bucket(svg, bucketWidth, bucketHeight, bucketOffsetX, bucketOffsetY, numberOfBalls, ballRadius);

// Setup the loop to animate the balls.
d3.timer(function()
{
    svg.selectAll(".ball.anim")  // Only select those balls that are to be animated (i.e. have class anim).
        .attr("cx", function(d) {d.x += (d.speed * ballSpeedScaling * Math.cos(d.angle * Math.PI)); if (d.x <= ballRadius) {d.x = ballRadius;} else if (d.x >= containerWidth - ballRadius) {d.x = containerWidth - ballRadius} return d.x;})  // Calculated using cos(x) = adj / hyp.
        .attr("cy", function(d) {d.y += (d.speed * ballSpeedScaling * Math.sin(d.angle * Math.PI)); if (d.y <= ballRadius) {d.y = ballRadius;} else if (d.y >= containerHeight - ballRadius) {d.y = containerHeight - ballRadius} return d.y;})  // Calculated using sin(x) = opp / hyp.
        .each(function(d) {if (d.x == ballRadius || d.x == containerWidth - ballRadius) {d.angle = 2 + (1 - d.angle);}})
        .each(function(d) {if (d.y == ballRadius || d.y == containerHeight - ballRadius) {d.angle = 2 - d.angle}});
});

// Define the drag behaviour of the balls.
var dragsStored = 5;
var dragBuffer = [];
var ballDrag = d3.behavior.drag()
    .origin(function(d) {return d;})
    .on("dragstart", ball_drag_start)
    .on("drag", ball_drag_update)
    .on("dragend", ball_drag_end);
var noBallDrag = d3.behavior.drag()  // Used to remove all drag listeners from the balls.
    .origin(function(d) {return d;})
    .on("dragstart", null)
    .on("drag", null)
    .on("dragend", null);
balls.call(ballDrag);

function ball_drag_end(d)
{
    d3.event.sourceEvent.stopPropagation(); // Silence any other listeners.

    var currentBall = d3.select(this);

    if (dragBuffer.length < 2)
    {
        // If only a click has been performed.
        currentBall.classed({"anim" : false, "inBucket" : true});  // Disable timer animation and record as in bucket.

        // Remove ball from bouncy container and add it to bucket.
        currentBall.remove();  // Selection.remove() removes the selected elements from the DOM.
        clickedBallBucket.bucket.append(function() { return currentBall[0][0]; });  // The removed elements can then be added back through the use of a function with append.
        currentBall
            .attr("cx", d.x = ballRadius + 2)
            .attr("cy", d.y = -ballRadius)
            .call(noBallDrag)  // Remove drag event listeners by calling the no drag behaviour.
            .transition()
            .duration(1000)
            .ease("bounce")
            .attr("cy", d.y = bucketHeight - ballRadius - (clickedBallBucket.inBucket.length * clickedBallBucket.ballCenterGap));

        clickedBallBucket.inBucket.push(currentBall);  // Add the ball to the record of balls in the bucket.
    }
    else
    {
        // Extract details about the drag.
        var firstPos = dragBuffer[0];
        var lastPos = dragBuffer.slice(-1)[0];
        var distanceTravelledX = lastPos.x - firstPos.x;
        var distanceTravelledY = lastPos.y - firstPos.y;
        var distanceTravelledTotal = Math.sqrt((distanceTravelledX * distanceTravelledX) + (distanceTravelledY * distanceTravelledY))
        var timeTaken = lastPos.time - firstPos.time;

        // Determine the new angle of movement.
        var angleTravelled = 0;
        if (distanceTravelledX == 0) angleTravelled = distanceTravelledY > 0 ? 0.5 : 1.5;  // 0.5 when both X and Y movement are positive as SVG coords are upside down.
        else if (distanceTravelledY == 0) angleTravelled = distanceTravelledX > 0 ? 0 : 1;
        else
        {
            angleTravelled = Math.atan(Math.abs(distanceTravelledY) / Math.abs(distanceTravelledX)) / Math.PI;
            // There are four possibilities for the movement of the ball:
            //     1) X +ve Y +ve (down and to the right) - arctan gives correct angle
            //     2) X -ve Y +ve (down and to the left) - arctan give 1 - the correct angle
            //     3) X -ve Y -ve (up and to the left) - 1 + arctan gives correct angle
            //     4) X +ve Y -ve (up and to the right) - arctan gives 2 - correct angle
            if (distanceTravelledX < 0) angleTravelled = distanceTravelledY > 0 ? (1 - angleTravelled) : (1 + angleTravelled);
            else if (distanceTravelledY < 0) angleTravelled = 2 - angleTravelled;
        }

        // Turn on animation for the ball, and give it a new angle and speed.
        var currentBallData = currentBall.datum();
        currentBallData.angle = angleTravelled;
        currentBallData.speed = (distanceTravelledTotal / timeTaken) * 7;
        currentBall
            .datum(currentBallData)
            .classed("anim", true);
    }
}

function ball_drag_start()
{
    d3.event.sourceEvent.stopPropagation(); // Silence any other listeners.
    d3.select(this).classed("anim", false);  // Turn off animation for the ball.
    dragBuffer = [];  // Initialise the drag buffer.
}

function ball_drag_update(d)
{
    d3.event.sourceEvent.stopPropagation(); // Silence any other listeners.

    // Current position of the ball relative to its container.
    var ballPosX = d3.event.x;
    var ballPosY = d3.event.y;

    // Add the new info to the drag buffer.
    dragBuffer.push({"x" : ballPosX, "y" : ballPosY, "time" : new Date()});
    dragBuffer = dragBuffer.slice(0, dragsStored);

    // Update the ball's position.
    d3.select(this)
        .attr("cx", d.x = Math.max(ballRadius, Math.min(containerWidth - ballRadius, ballPosX)))
        .attr("cy", d.y = Math.max(ballRadius, Math.min(containerHeight - ballRadius, ballPosY)));
}

function create_bucket(svg, bucketWidth, bucketHeight, bucketOffsetX, bucketOffsetY, numberOfBalls, ballRadius)
{
    // Determine the gap between ball centers when they're stacked in the bucket.
    var ballCenterGap = Math.min((bucketHeight / numberOfBalls), 2 * ballRadius);

    // Create the g element for holding the bucket.
    var bucketBox = svg.append("g")
        .attr("transform", "translate(" + bucketOffsetX + ", " + bucketOffsetY + ")");

    // Create the bucket. Could use a polyline or paths to form the open container instead.
    bucketHeight += 2;
    var bucket = bucketBox.append("rect")
        .classed("bucket", true)
        .attr("width", bucketWidth)
        .attr("height", bucketHeight)
        .style("stroke-dasharray", bucketHeight + bucketWidth + bucketHeight + ", " + bucketWidth)
        .style("stroke-dashoffset", bucketHeight + bucketWidth + bucketHeight);

    return {"inBucket" : [], "bucket" : bucketBox, "ballCenterGap" : ballCenterGap};
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
        .style("dominant-baseline", "middle")
        .style("stroke-width", 0);  // Stroke width to 0 in order to make the text crisper.

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

function fire_ball()
{
    //d3.event.sourceEvent.stopPropagation(); // Silence any other listeners.
    if (clickedBallBucket.inBucket.length > 0)
    {
        // If there is a ball in the bucket.
        var ballToFire = clickedBallBucket.inBucket.pop();
        ballToFire.transition();  // Empty transition to kill any that are currently active on the ball.

        console.log(d3.event.offsetX, d3.event.layerX, d3.event.offsetY, d3.event.layerY, d3.mouse(this));

        // Remove ball from the bucket and add it to the bouncy container.
        ballToFire.remove();  // Selection.remove() removes the selected elements from the DOM.
        d3.select(this).append(function() { return ballToFire[0][0]; });  // The removed elements can then be added back through the use of a function with append.
        ballData = ballToFire.datum();
        ballData.x = d3.mouse(this)[0];  // Could also use d3.event.offsetX if the browser supports it.
        ballData.y = d3.mouse(this)[1];  // Could also use d3.event.offsetY if the browser supports it.
        ballData.angle = 1.35;
        ballData.speed = baseBallSpeed;
        ballToFire
            .datum(ballData)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(ballDrag)  // Add drag event listeners.

        ballToFire.classed({"anim" : true, "inBucket" : false});  // Enable timer animation and record as not in bucket.
    }
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
    return balls;
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
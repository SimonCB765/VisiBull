var svgWidth = 175;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var ballVelocity = {"x" : 1, "y" : 1};
var ballRadius = 10;

var paddleWidth = 10;
var paddleHeight = 370;

// Create the SVG g element.
var svg = d3.select(".content")
	.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("tabindex", 0);  // Set tab index to ensure that the element can get focus.
svg[0][0].focus();  // Set initial focus.

// Add the line down the middle of the playing field.
svg.append("path")
	.classed("divider", true)
	.attr("d", "M" + (svgWidth / 2) + ",0L" + (svgWidth / 2) + "," + svgHeight);

// Add the ball.
var ball = svg.append("circle")
	.datum({"x" : svgWidth / 2, "y" : svgHeight / 2})
	.classed("ball", true)
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", ballRadius);

// Add the player's paddle.
var playerPaddle = svg.append("rect")
	.datum({"x" : 0, "y" : (svgHeight / 2) - (paddleHeight / 2)})
	.classed("paddle", true)
	.attr("width", paddleWidth)
	.attr("height", paddleHeight)
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; });

// Add the AI paddle.
var aiPaddle = svg.append("rect")
	.datum({"x" : svgWidth - paddleWidth, "y" : (svgHeight / 2) - (paddleHeight / 2)})
	.classed("paddle", true)
	.attr("width", paddleWidth)
	.attr("height", paddleHeight)
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; });

// Precalculate the angle between the center of a paddle and a corner.
var centerToCornerAngle = Math.atan((paddleHeight / 2) / (paddleWidth / 2))

// Start the ball moving.
d3.timer(move_ball);

function move_ball()
{
	
	// Determine the current position of the ball and the paddles.
	var ballPos = ball.datum();
	var playerPos = playerPaddle.datum();
	var aiPos = aiPaddle.datum();
	
	// Determine if the ball hit a paddle.
	var hitPaddle = false;
	if (ballPos.x <= (2 * ballRadius) && ballPos.y >= playerPos.y && ballPos.y <= playerPos.y + paddleHeight)
	{
		hitPaddle = true;
	}
	else if (ballPos.x >= (svgWidth - (2 * ballRadius)) && ballPos.y >= aiPos.y && ballPos.y <= aiPos.y + paddleHeight)
	{
		hitPaddle = true;
	}

	// Determine new x and y positions of the ball.
	if (hitPaddle || (ballPos.x === (svgWidth - ballRadius)) || (ballPos.x === ballRadius))
	{
		// Ball is touching the left wall, right wall or a paddle.
		ballVelocity.x *= -1;
	}
	else if ((ballPos.y === (svgHeight - ballRadius)) || (ballPos.y === ballRadius))
	{
		// Ball is touching the top or bottom wall.
		ballVelocity.y *= -1;
	}
	
	// Assign the new position of the ball.
	ball
		.attr("cx", function(d) { d.x += ballVelocity.x; d.x = Math.max(0 + ballRadius, Math.min(svgWidth - ballRadius, d.x)); return d.x; })
		.attr("cy", function(d) { d.y += ballVelocity.y; d.y = Math.max(0 + ballRadius, Math.min(svgHeight - ballRadius, d.y)); return d.y; });
}
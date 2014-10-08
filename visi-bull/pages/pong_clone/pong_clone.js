var svgWidth = 700;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var ballVelocity;  // Initialised in initialise_game().
var ballRadius = 10;

var paddleWidth = 10;
var paddleHeight = 70;
var aiSpeed = 0.5;

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
	.classed("ball", true)
	.attr("r", ballRadius);

// Add the player's paddle.
var playerPaddle = svg.append("rect")
	.datum({"x" : 0, "y" : (svgHeight / 2) - (paddleHeight / 2)})
	.classed("paddle", true)
	.attr("width", paddleWidth)
	.attr("height", paddleHeight);

// Add the AI paddle.
var aiPaddle = svg.append("rect")
	.datum({"x" : svgWidth - paddleWidth, "y" : (svgHeight / 2) - (paddleHeight / 2)})
	.classed("paddle", true)
	.attr("width", paddleWidth)
	.attr("height", paddleHeight);

// Add the ability to move the player paddle.
svg.on("mousemove", function()
	{
		playerPaddle.attr("y", function(d) { d.y = d3.mouse(this)[1]; d.y = Math.min(Math.max(0, d.y), svgHeight - paddleHeight); return d.y; });
	});

// Start the game.
d3.timer(move_ball);  // Start the ball moving.
initialise_game();

function initialise_game()
{
	// Reset ball velocity.
	ballVelocity = {"x" : 4, "y" : 4};

	// Put the ball in the center.
	ball
		.datum({"x" : svgWidth / 2, "y" : svgHeight / 2})
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });

	// Position paddles.
	playerPaddle
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; });
	aiPaddle
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; });
}

function move_ball()
{
	// Determine the current position of the ball and the paddles.
	var ballPos = ball.datum();
	var playerPos = playerPaddle.datum();
	var aiPos = aiPaddle.datum();

	// Determine coordinates of the corner of the two paddles that are not touching the walls.
	var playerPaddleCoordinates = {"top" : {"x" : playerPos.x + paddleWidth, "y" : playerPos.y}, "bottom" : {"x" : playerPos.x + paddleHeight + paddleWidth, "y" : playerPos.y + paddleHeight}};
	var aiPaddleCoordinates = {"top" : {"x" : aiPos.x + paddleWidth, "y" : aiPos.y}, "bottom" : {"x" : aiPos.x + paddleHeight + paddleWidth, "y" : aiPos.y + paddleHeight}};

	// Determine distances from the ball to the corners of the player's paddle.
	var distanceToPlayerTopX = playerPaddleCoordinates.top.x - ballPos.x;
	var distanceToPlayerTopY = playerPaddleCoordinates.top.y - ballPos.y;
	var distanceToPlayerTop = Math.sqrt((distanceToPlayerTopX * distanceToPlayerTopX) + (distanceToPlayerTopY * distanceToPlayerTopY));
	var distanceToPlayerBottomX = playerPaddleCoordinates.bottom.x - ballPos.x;
	var distanceToPlayerBottomY = playerPaddleCoordinates.bottom.y - ballPos.y;
	var distanceToPlayerBottom = Math.sqrt((distanceToPlayerBottomX * distanceToPlayerBottomX) + (distanceToPlayerBottomY * distanceToPlayerBottomY));
	
	// Determine distance to the corner of the AI's paddle that is closest to the ball.
	var distanceToAITopX = aiPaddleCoordinates.top.x - ballPos.x;
	var distanceToAITopY = aiPaddleCoordinates.top.y - ballPos.y;
	var distanceToAITop = Math.sqrt((distanceToAITopX * distanceToAITopX) + (distanceToAITopY * distanceToAITopY));
	var distanceToAIBottomX = aiPaddleCoordinates.bottom.x - ballPos.x;
	var distanceToAIBottomY = aiPaddleCoordinates.bottom.y - ballPos.y;
	var distanceToAIBottom = Math.sqrt((distanceToAIBottomX * distanceToAIBottomX) + (distanceToAIBottomY * distanceToAIBottomY));
	
	// Determine if the ball hit a paddle or a wall.
	if (ballPos.x <= (ballRadius + paddleWidth) && ballPos.y >= playerPos.y && ballPos.y <= playerPos.y + paddleHeight)
	{
		// Hit the player paddle head on if the center of the ball is between the top and bottom of the paddle, and is not farther away
		// from the left wall than the radius of the ball plus the width of the paddle.
		ballVelocity.x *= -1;
	}
	else if (distanceToPlayerTop <= ballRadius && ballVelocity.y > 0)
	{
		// The ball has hit the player's paddle on the top corner.
		if ((playerPaddleCoordinates.top.y - ballPos.y) <= (ballPos.x - playerPaddleCoordinates.top.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
		}
		else
		{
			// The ball has hit the corner from the top or bottom, so change y direction.
			ballVelocity.y *= -1;
		}
	}
	else if (distanceToPlayerBottom <= ballRadius && ballVelocity.y < 0)
	{
		// The ball has hit the player's paddle on the bottom corner.
		if ((ballPos.y - playerPaddleCoordinates.bottom.y) < (ballPos.x - playerPaddleCoordinates.bottom.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
		}
		else
		{
			// The ball has hit the corner from the top or bottom, so change y direction.
			ballVelocity.y *= -1;
		}
	}
	else if (ballPos.x >= (svgWidth - (ballRadius + paddleWidth)) && ballPos.y >= aiPos.y && ballPos.y <= aiPos.y + paddleHeight)
	{
		// Hit the AI paddle head on if the center of the ball is between the top and bottom of the paddle, and is not farther away
		// from the right wall than the radius of the ball plus the width of the paddle.
		ballVelocity.x *= -1;
	}
	else if (distanceToAITop <= ballRadius && ballVelocity.y > 0)
	{
		// The ball has hit the AI's paddle on the top corner.
		if ((aiPaddleCoordinates.top.y - ballPos.y) <= (aiPaddleCoordinates.top.x - ballPos.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
		}
		else
		{
			// The ball has hit the corner from the top or bottom, so change y direction.
			ballVelocity.y *= -1;
		}
	}
	else if (distanceToAIBottom <= ballRadius && ballVelocity.y < 0)
	{
		// The ball has hit the AI's paddle on the bottom corner.
		if ((ballPos.y - aiPaddleCoordinates.bottom.y) < (aiPaddleCoordinates.bottom.x - ballPos.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
		}
		else
		{
			// The ball has hit the corner from the top or bottom, so change y direction.
			ballVelocity.y *= -1;
		}
	}
	else if ((ballPos.y === (svgHeight - ballRadius)) || (ballPos.y === ballRadius))
	{
		// Ball is touching the top or bottom wall.
		ballVelocity.y *= -1;
	}
	else if (ballPos.x === ballRadius)
	{
		// Ball is touching the left wall, so a point is scored by the AI.
		console.log("AI SCOOOORES");
		initialise_game();
	}
	else if (ballPos.x === (svgWidth - ballRadius))
	{
		// Ball is touching the right wall, so a point is scored by the player.
		console.log("PLAYER SCOOOORES");
		initialise_game();
	}
	
	// Assign the new position of the ball.
	ball
		.attr("cx", function(d) { d.x += ballVelocity.x; d.x = Math.max(0 + ballRadius, Math.min(svgWidth - ballRadius, d.x)); return d.x; })
		.attr("cy", function(d) { d.y += ballVelocity.y; d.y = Math.max(0 + ballRadius, Math.min(svgHeight - ballRadius, d.y)); return d.y; });

	// Move the AI paddle.
	ballPos = ball.datum();
	aiPaddle
		.attr("y", function(d)
			{
				d.y += (ballVelocity.y * aiSpeed);
				if (ballVelocity.y < 0)
				{
					d.y = Math.min(Math.max(ballPos.y - (paddleHeight / 2), d.y, 0), svgHeight - paddleHeight);
				}
				else
				{
					d.y = Math.max(Math.min(ballPos.y - (paddleHeight / 2), d.y, svgHeight - paddleHeight), 0);
				}
				return d.y;
			});
	
	
	playerPaddle
		.attr("y", function(d)
			{
				d.y += (ballVelocity.y * aiSpeed);
				if (ballVelocity.y < 0)
				{
					//(d.y + (paddleHeight / 2)) < ballPos.y ? 
					d.y = Math.min(Math.max(ballPos.y - (paddleHeight / 2), d.y, 0), svgHeight - paddleHeight);
				}
				else
				{
					d.y = Math.max(Math.min(ballPos.y - (paddleHeight / 2), d.y, svgHeight - paddleHeight), 0);
				}
				return d.y;
			});
}
var svgWidth = 700;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var ballVelocity;  // Initialised in initialise_game().
var ballRadius = 10;

var paddleWidth = 10;
var paddleHeight = 70;
var collisionPos;  // The point on the right hand wall where the AI paddle needs to move to return the ball. Assigned when the ball hits the player's paddle.

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
initialise_game();
d3.timer(move_ball);  // Start the ball moving.

function calculate_right_wall_collision(ballPos)
{
	console.log("Calculating Wall Collisions");
	console.log(ballPos, ballVelocity)
	
	var currentX = ballPos.x;
	var currentY = ballPos.y;
	var currentVelocity = {"x" : ballVelocity.x, "y" : ballVelocity.y};
	var notCollided = true;  // Whether the ball has collided with a wall.
	var previousBallCollision = {"x" : ballPos.x, "y" : ballPos.y};  // The position of the previous collision.
	var collisionPositions = [];  // The coordinates of collisions between the ball and an object.
	while (currentX !== (svgWidth - ballRadius - paddleWidth))
	{
		// A collision with the top or bottom wall has occurred.
		if ((currentY === ballRadius) || (currentY === (svgHeight - ballRadius)))
		{
			// Update the collision record.
			collisionPositions.push([previousBallCollision, {"x" : currentX, "y" : currentY}]);
			previousBallCollision = {"x" : currentX, "y" : currentY};
			
			// Update the velocity of the ball to bounce off the wall.
			currentVelocity.y *= -1;
		}
		
		// Update the ball position.
		currentX += currentVelocity.x;
		currentX = Math.max(0 + ballRadius, Math.min(svgWidth - ballRadius, currentX));
		currentY += currentVelocity.y;
		currentY = Math.max(0 + ballRadius, Math.min(svgHeight - ballRadius, currentY));
	}
	collisionPositions.push([previousBallCollision, {"x" : currentX, "y" : currentY}]);
	
	console.log("Wall Collision Calculated");
	
	// Animate the line.
	var totalDelayNeeded = 0;
	var ballSpeed = Math.sqrt((ballVelocity.x * ballVelocity.x) + (ballVelocity.y * ballVelocity.y));
	var trajectory = svg.selectAll(".trajectory")
		.data(collisionPositions)
		.enter()
		.append("path")
		.classed("trajectory", true)
		.attr("d", function(d, i) { return "M" + d[0].x + "," + d[0].y + "L" + d[0].x + "," + d[0].y; });
	trajectory.each(function(d, i)
		{
			var trajectorySegment = d3.select(this);
			
			// Determine trajectory segment length.
			var xDist = d[0].x - d[1].x;
			var yDist = d[0].y - d[1].y;
			var trajectorySegmentLength = Math.sqrt((xDist * xDist) + (yDist * yDist));
			
			var animationSpeed = trajectorySegmentLength * 4 / ballSpeed;
			trajectorySegment
				.transition()
				.delay(totalDelayNeeded)
				.duration(animationSpeed)
				.ease("linear")
				.attr("d", function()
					{
						return "M" + d[0].x + "," + d[0].y + "L" + d[1].x + "," + d[1].y;
					});
			
			// Update the delay.
			totalDelayNeeded += (animationSpeed);
		});
	
	return currentY;
}

function initialise_game()
{
	// Reset ball velocity.
	ballVelocity = {"x" : -2, "y" : 4};

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
		.attr("y", function(d) { return d.y; })

	// Stop any transitions that are currently in progress for the AI paddle.
	aiPaddle
		.transition()
		.duration(0);
}

function move_ball()
{
	// Determine the current position of the ball and the paddles.
	var ballPos = ball.datum();
	var playerPos = playerPaddle.datum();
	var aiPos = aiPaddle.datum();

	// Determine coordinates of the corner of the two paddles that are not touching the walls.
	var playerPaddleCoordinates = {"top" : {"x" : playerPos.x + paddleWidth, "y" : playerPos.y}, "bottom" : {"x" : playerPos.x + paddleWidth, "y" : playerPos.y + paddleHeight}};
	var aiPaddleCoordinates = {"top" : {"x" : aiPos.x, "y" : aiPos.y}, "bottom" : {"x" : aiPos.x, "y" : aiPos.y + paddleHeight}};

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
	if (ballPos.x === ballRadius)
	{
		// Ball is touching the left wall, so a point is scored by the AI.
		console.log("AI SCOOOORES");
		initialise_game();
	}
	else if (ballPos.x === (svgWidth - ballRadius))
	{
		// Ball is touching the right wall, so a point is scored by the player.
		console.log("PLAYER SCOOOORES");
		console.log(ballPos);
		initialise_game();
	}
	else if (ballPos.x <= (ballRadius + paddleWidth) && ballPos.y >= playerPos.y && ballPos.y <= playerPos.y + paddleHeight)
	{
		// Hit the player paddle head on if the center of the ball is between the top and bottom of the paddle, and is not farther away
		// from the left wall than the radius of the ball plus the width of the paddle.
		ballVelocity.x *= -1;
		collisionPos = calculate_right_wall_collision(ballPos);
	}
	else if (distanceToPlayerTop <= ballRadius && ballVelocity.y > 0)
	{
		// The ball has hit the player's paddle on the top corner.
		if ((playerPaddleCoordinates.top.y - ballPos.y) < (ballPos.x - playerPaddleCoordinates.top.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
			collisionPos = calculate_right_wall_collision(ballPos);
		}
		else
		{
			// The ball has hit the corner from the top, so change y direction.
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
			collisionPos = calculate_right_wall_collision(ballPos);
		}
		else
		{
			// The ball has hit the corner from the bottom, so change y direction.
			ballVelocity.y *= -1;
		}
	}
	else if (ballPos.x >= (svgWidth - (ballRadius + paddleWidth)) && ballPos.y >= aiPos.y && ballPos.y <= aiPos.y + paddleHeight)
	{
		// Hit the AI paddle head on if the center of the ball is between the top and bottom of the paddle, and is not farther away
		// from the right wall than the radius of the ball plus the width of the paddle.
		ballVelocity.x *= -1;
		
		// Stop any movements that the AI paddle is currently undergoing.
		aiPaddle
			.transition()
			.duration(0);
		
		// Remove the trajectory.
		svg.selectAll(".trajectory").remove();
	}
	else if (distanceToAITop <= ballRadius && ballVelocity.y > 0)
	{
		// The ball has hit the AI's paddle on the top corner.
		if ((aiPaddleCoordinates.top.y - ballPos.y) < (aiPaddleCoordinates.top.x - ballPos.x))
		{
			// The ball has hit the corner from the front, so change the x direction.
			ballVelocity.x *= -1;
		}
		else
		{
			// The ball has hit the corner from the top, so change y direction.
			ballVelocity.y *= -1;
		}
		
		// Stop any movements that the AI paddle is currently undergoing.
		aiPaddle
			.transition()
			.duration(0);
		
		// Remove the trajectory.
		svg.selectAll(".trajectory").remove();
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
			// The ball has hit the corner from the bottom, so change y direction.
			ballVelocity.y *= -1;
		}
		
		// Stop any movements that the AI paddle is currently undergoing.
		aiPaddle
			.transition()
			.duration(0);
		
		// Remove the trajectory.
		svg.selectAll(".trajectory").remove();
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

	// Move the AI paddle.
	if (ballPos.x > (svgWidth / 2))
	{
		aiPaddle
			.transition()
			.duration(2000)
			.delay(500)
			.ease("cubic-out")
			.attr("y", function(d)
				{
					d.y = collisionPos - (paddleHeight / 2);
					d.y = Math.max(0, Math.min(svgHeight - paddleHeight, d.y));
					return d.y;
				});
	}
}
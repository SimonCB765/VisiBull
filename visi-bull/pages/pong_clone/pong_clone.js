var svgWidth = 700;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var ballVelocity;  // Object consisting of x and y components representing the speed in the x and y directions. Initialised in reset_game().
var ballRadius = 10;

var paddleWidth = 10;
var paddleHeight = 70;
var collisionPos = -1;  // The point on the right hand wall where the AI paddle needs to move to return the ball. Assigned when the ball hits the player's paddle.

// Define the components of the game.
var ball;  // The ball.
var aiPaddle;  // The paddle that the AI moves.
var aiScore;  // The AI opponent's score.
var playerPaddle;  // The paddle that the player moves.
var playerScore;  // The player's score.

// Create the SVG g element.
var svg = d3.select(".content")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("tabindex", 0);  // Set tab index to ensure that the element can get focus.
svg[0][0].focus();  // Set initial focus.

// Display the starting splash screen.
var startButtonHeight = 50;
var startButtonWidth = 100;
var instructionsTop = svg.append("text")
    .text("Control the paddle using your mouse.")
    .classed("splash", true)
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight / 4)
    .style("font-size", "0px");
var instructionsBottom = svg.append("text")
    .text("Press start to begin.")
    .classed("splash", true)
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight * 2 / 4)
    .style("font-size", "0px");
var startG = svg.append("g")
    .attr("transform", "translate(" + ((svgWidth / 2) - (startButtonWidth / 2)) + ", " + (svgHeight * 2 / 3) + ")");
var startButton = startG.append("rect")
    .classed("start", true)
    .attr("x", startButtonWidth / 2)
    .attr("y", startButtonHeight / 2)
    .attr("width", 0)
    .attr("height", 0);
var startText = startG.append("text")
    .text("Start")
    .classed("startText", true)
    .attr("x", startButtonWidth / 2)
    .attr("y", startButtonHeight / 2)
    .style("font-size", "0px");
instructionsTop
    .transition()
    .duration(1000)
    .style("font-size", "40px")
    .each(function()
        {
            instructionsBottom
                .transition()
                .style("font-size", "40px")
        })
    .each(function()
        {
            startButton
                .transition()
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", startButtonWidth)
                .attr("height", startButtonHeight);
        })
    .each(function()
        {
            startText
                .transition()
                .style("font-size", "30px");
        });
startButton
    .on("click", function() { instructionsTop.remove(); instructionsBottom.remove(); startG.remove(); initialise_game(); reset_game(); d3.timer(move_ball); })

function calculate_right_wall_collision(ballPos)
{
    // Determine the position on the right wall that the ball will collide with.
    // Done by simulating the path of the ball until it collides with the right wall.
    // ballPos is the current position of the ball as an object with x and y components.

    var currentX = ballPos.x;  // Current X coordinate of the ball.
    var currentY = ballPos.y;  // Current Y coordinate of the ball.
    var currentVelocity = {"x" : ballVelocity.x, "y" : ballVelocity.y};
    var notCollided = true;  // Whether the ball has collided with a wall.
    var previousBallCollision = {"x" : ballPos.x, "y" : ballPos.y};  // The position of the previous collision.
    var collisionPositions = [];  // The coordinates of where the ball collides with the top or bottom wall before reaching the right wall.
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

    // Create and animate the line that shows the trajectory of the ball from the player's paddle to the right wall.
    var totalDelayNeeded = 0;  // Delay needed in order to cause the later parts of the trajectory to animate after the earlier ones.
    var ballSpeed = Math.sqrt((ballVelocity.x * ballVelocity.x) + (ballVelocity.y * ballVelocity.y));
    var trajectory = svg.selectAll(".trajectory")
        .data(collisionPositions)
        .enter()
        .append("path")
        .classed("trajectory", true)
        .attr("d", function(d, i) { return "M" + d[0].x + "," + d[0].y + "L" + d[0].x + "," + d[0].y; });
    trajectory.each(function(d, i)
        {
            // Select the current segment of the trajectory.
            var trajectorySegment = d3.select(this);

            // Determine trajectory segment length.
            var xDist = d[0].x - d[1].x;
            var yDist = d[0].y - d[1].y;
            var trajectorySegmentLength = Math.sqrt((xDist * xDist) + (yDist * yDist));

            // DEtermine how fast to animate this trajectory segment, and then animate it.
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

            // Update the delay needed to get the next segment to start animating after this one is finished animating.
            totalDelayNeeded += (animationSpeed);
        });

    // Return the Y coordinate where the ball will collide with the right wall.
    return currentY;
}

function initialise_game()
{
    // Setup the components needed for the game.

    // Add the line down the middle of the playing field.
    svg.append("path")
        .classed("divider", true)
        .attr("d", "M" + (svgWidth / 2) + ",0L" + (svgWidth / 2) + "," + svgHeight);

    // Add the ball.
    ball = svg.append("circle")
        .classed("ball", true)
        .attr("r", ballRadius);

    // Add the player's paddle.
    playerPaddle = svg.append("rect")
        .datum({"x" : 0, "y" : (svgHeight / 2) - (paddleHeight / 2)})
        .classed("paddle", true)
        .attr("width", paddleWidth)
        .attr("height", paddleHeight);

    // Add the AI paddle.
    aiPaddle = svg.append("rect")
        .datum({"x" : svgWidth - paddleWidth, "y" : (svgHeight / 2) - (paddleHeight / 2)})
        .classed("paddle", true)
        .attr("width", paddleWidth)
        .attr("height", paddleHeight);

    // Add the ability to move the player paddle.
    svg.on("mousemove", function()
        {
            playerPaddle.attr("y", function(d)
                {
                    d.y = d3.mouse(this)[1] - (paddleHeight / 2);
                    d.y = Math.min(Math.max(0, d.y), svgHeight - paddleHeight);
                    return d.y;
                });
        });

    // Add the scores.
    playerScore = svg.append("text")
        .datum({"score": 0})
        .classed("score", true)
        .attr("x", (svgWidth / 2) - 30)
        .attr("y", 40)
        .attr("dy", ".35em")
        .style("text-anchor", "end")  // Score will grow to the left of the screen.
        .text(function(d) { return d.score; });
    aiScore = svg.append("text")
        .datum({"score": 0})
        .classed("score", true)
        .attr("x", (svgWidth / 2) + 30)
        .attr("y", 40)
        .attr("dy", ".35em")
        .style("text-anchor", "start")  // Score will grow to the right of the screen.
        .text(function(d) { return d.score; });
}

function reset_game()
{
    // Set up the initial state of the game.

    // Remove the trajectory of the ball if it's present.
    svg.selectAll(".trajectory").remove();

    // Reset the ball velocity.
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
        .attr("y", function(d) { return d.y; });

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

    // Determine the coordinates of the corners of the two paddles that are not touching the walls.
    var playerPaddleCoordinates = {"top" : {"x" : playerPos.x + paddleWidth, "y" : playerPos.y}, "bottom" : {"x" : playerPos.x + paddleWidth, "y" : playerPos.y + paddleHeight}};
    var aiPaddleCoordinates = {"top" : {"x" : aiPos.x, "y" : aiPos.y}, "bottom" : {"x" : aiPos.x, "y" : aiPos.y + paddleHeight}};

    // Determine distances from the ball to the corners of the player's paddle.
    var distanceToPlayerTopX = playerPaddleCoordinates.top.x - ballPos.x;
    var distanceToPlayerTopY = playerPaddleCoordinates.top.y - ballPos.y;
    var distanceToPlayerTop = Math.sqrt((distanceToPlayerTopX * distanceToPlayerTopX) + (distanceToPlayerTopY * distanceToPlayerTopY));
    var distanceToPlayerBottomX = playerPaddleCoordinates.bottom.x - ballPos.x;
    var distanceToPlayerBottomY = playerPaddleCoordinates.bottom.y - ballPos.y;
    var distanceToPlayerBottom = Math.sqrt((distanceToPlayerBottomX * distanceToPlayerBottomX) + (distanceToPlayerBottomY * distanceToPlayerBottomY));

    // Determine distances from the ball to the corners of the AI's paddle.
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
        aiScore.text(function(d) { d.score += 1; return d.score; });
        reset_game();
    }
    else if (ballPos.x === (svgWidth - ballRadius))
    {
        // Ball is touching the right wall, so a point is scored by the player.
        playerScore.text(function(d) { d.score += 1; return d.score; });
        reset_game();
    }
    else if (ballPos.x <= (ballRadius + paddleWidth) && ballPos.y >= playerPos.y && ballPos.y <= playerPos.y + paddleHeight && ballVelocity.x < 0)
    {
        // If the center of the ball is in between the top and bottom of the player's paddle, and the distance from the ball to the left wall
        // is no greater than the ball's radius plus the width of the paddle, then the ball has hit the player's paddle head on.
        ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.
        collisionPos = calculate_right_wall_collision(ballPos);  // Determine Y coordinate where ball will collide with the right wall.
    }
    else if (distanceToPlayerTop <= ballRadius && ballVelocity.y > 0 && ballVelocity.x < 0)
    {
        // The ball has hit the player's paddle on the top corner.
        if ((playerPaddleCoordinates.top.y - ballPos.y) < (ballPos.x - playerPaddleCoordinates.top.x))
        {
            // The ball has hit the corner from the front.
            ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.
            collisionPos = calculate_right_wall_collision(ballPos);  // Determine Y coordinate where ball will collide with the right wall.
        }
        else
        {
            // The ball has hit the corner from the top, so change y direction. The ball will then hit the left wall, so no need to determine
            // position on right wall that the ball will hit.
            ballVelocity.y *= -1;
        }
    }
    else if (distanceToPlayerBottom <= ballRadius && ballVelocity.y < 0 && ballVelocity.x < 0)
    {
        // The ball has hit the player's paddle on the bottom corner.
        if ((ballPos.y - playerPaddleCoordinates.bottom.y) < (ballPos.x - playerPaddleCoordinates.bottom.x))
        {
            // The ball has hit the corner from the front.
            ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.
            collisionPos = calculate_right_wall_collision(ballPos);  // Determine Y coordinate where ball will collide with the right wall.
        }
        else
        {
            // The ball has hit the corner from the bottom, so change y direction. The ball will then hit the left wall, so no need to determine
            // position on right wall that the ball will hit.
            ballVelocity.y *= -1;
        }
    }
    else if (ballPos.x >= (svgWidth - (ballRadius + paddleWidth)) && ballPos.y >= aiPos.y && ballPos.y <= aiPos.y + paddleHeight && ballVelocity.x > 0)
    {
        // If the center of the ball is in between the top and bottom of the AI's paddle, and the distance from the ball to the right wall
        // is no greater than the ball's radius plus the width of the paddle, then the ball has hit the AI's paddle head on.
        ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.

        // Stop any movements that the AI paddle is currently undergoing.
        aiPaddle
            .transition()
            .duration(0);

        // Remove the trajectory.
        svg.selectAll(".trajectory").remove();
    }
    else if (distanceToAITop <= ballRadius && ballVelocity.y > 0 && ballVelocity.x > 0)
    {
        // The ball has hit the AI's paddle on the top corner.
        if ((aiPaddleCoordinates.top.y - ballPos.y) < (aiPaddleCoordinates.top.x - ballPos.x))
        {
            // The ball has hit the corner from the front, so change the x direction.
            ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.
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
    else if (distanceToAIBottom <= ballRadius && ballVelocity.y < 0 && ballVelocity.x > 0)
    {
        // The ball has hit the AI's paddle on the bottom corner.
        if ((ballPos.y - aiPaddleCoordinates.bottom.y) < (aiPaddleCoordinates.bottom.x - ballPos.x))
        {
            // The ball has hit the corner from the front, so change the x direction.
            ballVelocity.x *= -1;  // Reverse x velocity to bounce off paddle.
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
        // Ball is touching the top or bottom wall, so change y velocity to bounce the ball off the wall.
        ballVelocity.y *= -1;
    }

    // Assign the new position of the ball.
    ball
        .attr("cx", function(d) { d.x += ballVelocity.x; d.x = Math.max(0 + ballRadius, Math.min(svgWidth - ballRadius, d.x)); return d.x; })
        .attr("cy", function(d) { d.y += ballVelocity.y; d.y = Math.max(0 + ballRadius, Math.min(svgHeight - ballRadius, d.y)); return d.y; });

    // Move the AI paddle the first time that the ball crosses the halfway line after touching the player's paddle.
    if (ballPos.x > (svgWidth / 2) && collisionPos != -1)
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
        collisionPos = -1;
    }
}
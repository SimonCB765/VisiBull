var svgWidth = 500;  // The width of the SVG element.
var svgHeight = 500;  // The height of the SVG element.

var faceRadius = 10;  // The radius of each face.
var faceDiameter = faceRadius * 2;  // The diameter of each face.
var eyeMajorRadius = faceRadius / 4;  // The longer radius of the ellipses that make up the eyes.
var eyeMinorRadius = faceRadius / 8;  // The shorter radius of the ellipses that make up the eyes.

var pillHeight = 12;  // The height of the pill projectile.
var pillWidth = 5;  // The width of the pill projectile.
var pillRoundedCorner = 3;  // The amount to round the corners of the pill by.

// Create the SVG element.
var svg = d3.select(".content")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("tabindex", 0);  // Set tab index to ensure that the element can get focus.
svg[0][0].focus();  // Set initial focus.

// Create the definitions tag.
var defs = svg.append("defs");

// Define the pill gradient.
var pillGradient = defs.append("linearGradient")
    .attr("id", "pillGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
pillGradient.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#F43E78")
    .style("stop-opacity", 1);
pillGradient.append("stop")
    .attr("offset", "50%")
    .style("stop-color", "#F43E78")
    .style("stop-opacity", 1);
pillGradient.append("stop")
    .attr("offset", "51%")
    .style("stop-color", "white")
    .style("stop-opacity", 1);
pillGradient.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "white")
    .style("stop-opacity", 1);

// Initialise the game.
initialise_game();

function initialise_game()
{
    // Initialise the game area.

    // Remove faces, projectiles and the player icon.
    svg.selectAll("face").remove();
    svg.select(".pillContainer").remove();
    svg.select(".playerContainer").remove();

    // Define needed values.
    var playerWidth = 30;  // The width of the player rectangle.
    var playerHeight = 10;  // The height of the player rectangle.
    var pillSpeed = 4;  // The speed at which the pills shot by the player travel.
    var enemyProjectileSpeed = 3;  // The speed at which the nemy projectiles fire.
    var faceGapHorizontal = pillWidth * 3.5;  // The horizontal gap between sad faces.
    var faceGapVertical = pillWidth * 1.5;  // The vertical gap between sad faces.
    var facesPerLine = 10;  // Number of sad faces on each line.
    var numberOfLines = 5;  // Number of lines of faces.
    var faceMovementSpeed = 0.35;  // Horizontal distance moved each time step.
    var currentDirection = 1;  // Horizontal direction being moved by the faces (1 for right and -1 for left).
    var alreadyDescending = false;  // Whether the faces are moving in the Y direction.
    var descendTo;  // The Y coordinate that indicates that the faces should start moving horizontally again.
    var bottomEdgeOfFaces;  // The Y position of the lowest face.
    var topEdgeOfFaces;  // The Y position of the highest face.
    var leftEdgeOfFaces;  // The X position of the leftmost face.
    var rightEdgeOfFaces;  // The X position of the rightmost face.
    var gameOverHeight = svgHeight - ((faceDiameter + faceGapVertical) * 3);  // The distance from the bottom of the play area at which game over occurs.

    // Create the data to record each face's position.
    var facePositions = [];
    for (var i = 2; i < 2 + numberOfLines; i++)
    {
        var transY = (faceDiameter + faceGapVertical) * i;
        bottomEdgeOfFaces = transY;
        for (var j = 1; j <= facesPerLine; j++)
        {
            var transX = (faceDiameter + faceGapHorizontal) * j;
            facePositions.push({"transX" : transX, "transY" : transY});
        }
    }
    bottomEdgeOfFaces = d3.max(facePositions, function(d) { return d.transY; });
    topEdgeOfFaces = d3.min(facePositions, function(d) { return d.transY; });
    leftEdgeOfFaces = d3.min(facePositions, function(d) { return d.transX; });
    rightEdgeOfFaces = d3.max(facePositions, function(d) { return d.transX + faceDiameter; });

    // Add all the blue faces starting from the upper left.
    var faceContainer = svg.selectAll(".sadFace")
        .data(facePositions)
        .enter()
        .append("g")
        .classed({"sadFace": true, "canBeShot": true})  // Sad faces that can be shot.
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    faceContainer.append("circle")  // Circle for the face.
        .classed("face", true)
        .attr("cx", faceRadius)
        .attr("cy", faceRadius)
        .attr("r", faceRadius);
    faceContainer.append("ellipse")  // Left eye.
        .classed({"eye" : true, "left" : true})
        .attr("cx", faceDiameter / 3)
        .attr("cy", (faceDiameter / 3) + (faceRadius / 4))
        .attr("rx", eyeMinorRadius)
        .attr("ry", eyeMajorRadius);
    faceContainer.append("ellipse")  // Right eye.
        .classed({"eye" : true, "right" : true})
        .attr("cx", faceDiameter * 2 / 3)
        .attr("cy", (faceDiameter / 3) + (faceRadius / 4))
        .attr("rx", eyeMinorRadius)
        .attr("ry", eyeMajorRadius);
    faceContainer.append("path")  // Frown.
        .classed("mouth", true)
        .attr("d", "M" + (faceDiameter * 2 / 6) + "," + (faceDiameter * 6 / 8) + "A" + (faceRadius * 5 / 6) + "," + (faceRadius * 5 / 6) + ",0,0,1," + (faceDiameter * 4 / 6) + "," + (faceDiameter * 6 / 8));

    // Add the player.
    var playerContainer = svg.append("g")
        .datum({"transX" : Math.floor((svgWidth / 2) - (playerWidth / 2)), "transY" : svgHeight - playerHeight})
        .classed("playerContainer", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    var player = playerContainer.append("rect")
        .classed("player", true)
        .attr("height", playerHeight)
        .attr("width", playerWidth)
    svg.on("keydown", function()
        {
            // Prevent any events that could shift the page.
            var keyCode = d3.event.keyCode;
            if ((keyCode >= 37 && keyCode <= 40) || keyCode === 32) d3.event.preventDefault();
        });
    svg.on("mousemove", function()
        {
            // Move the player.
            var mousePos = d3.mouse(this);
            playerContainer
                .attr("transform", function(d)
                    {
                        d.transX = mousePos[0];
                        d.transX = Math.min(svgWidth - playerWidth, Math.max(0, d.transX));
                        return "translate(" + d.transX + "," + d.transY + ")";
                    });
        });
    svg.on("mousedown", function()
        {
            if (d3.event.which === 1)
            {
                // Left mouse button pressed to shoot, so shoot if there is no shot already on the screen.
                var playerPosition = playerContainer.datum();
                if (svg.select(".pill").empty()) shoot(playerPosition.transX + (playerWidth / 2) - (pillWidth / 2), playerPosition.transY);
            }
        });

    // Setup the timer for the game loop.
    d3.timer(step_game);

    function check_face_collision(sadFaces, pill, pillHeight, pillWidth)
    {
        // Check whether the pill hit a face.

        // Determine the position of the pill.
        var pillPosition = pill.datum();
        var pillCenterX = pillPosition.transX + (pillWidth / 2);
        var pillCenterY = pillPosition.transY + (pillHeight / 2);

        // Check each face for a collision.
        sadFaces.each(function(d)
            {
                // The center of the face being checked.
                var faceCenterX = d.transX + faceRadius;
                var faceCenterY = d.transY + faceRadius;

                // The distances in the X and Y directions between the face and the pill.
                var distanceBetweenCentersX = faceCenterX - pillCenterX;
                var distanceBetweenCentersY = faceCenterY - pillCenterY;

                if (Math.sqrt((distanceBetweenCentersX * distanceBetweenCentersX) + (distanceBetweenCentersY * distanceBetweenCentersY)) < (faceRadius * 2))
                {
                    // Collision occurred, so transform the face into a happy one.
                    var currentFace = d3.select(this);
                    var leftEye = currentFace.select(".left");
                    var rightEye = currentFace.select(".right");
                    var mouth = currentFace.select(".mouth");
                    currentFace
                        .classed("canBeShot", false)
                        .transition()
                        .duration(100)
                        .style("fill", "yellow")
                        .each(function() { leftEye.transition().attr("cy", faceDiameter / 3); })
                        .each(function() { rightEye.transition().attr("cy", faceDiameter / 3); })
                        .each(function() { mouth.attr("d", "M" + (faceDiameter / 6) + "," + (faceDiameter * 5 / 8) + "A" + (faceRadius * 5 / 6) + "," + (faceRadius * 7 / 6) + ",0,0,0," + (faceDiameter * 5 / 6) + "," + (faceDiameter * 5 / 8)); });
                    currentFace
                        .transition()
                        .delay(400)
                        .duration(0)
                        .remove();
                    pill.remove();
                }
            });
    }

    function game_over()
    {
        // Display the game over screen.

        var retryButtonHeight = 50;
        var retryButtonWidth = 100;
        var gameOverTop = svg.append("text")
            .text("Game")
            .classed("gameOver", true)
            .attr("x", svgWidth / 2)
            .attr("y", svgHeight / 4)
            .style("font-size", "0px");
        var gameOverBottom = svg.append("text")
            .text("Over")
            .classed("gameOver", true)
            .attr("x", svgWidth / 2)
            .attr("y", svgHeight * 2 / 4)
            .style("font-size", "0px");
        var retryG = svg.append("g")
            .attr("transform", "translate(" + ((svgWidth / 2) - (retryButtonWidth / 2)) + ", " + (svgHeight * 2 / 3) + ")");
        var retryButton = retryG.append("rect")
            .classed("retry", true)
            .attr("x", retryButtonWidth / 2)
            .attr("y", retryButtonHeight / 2)
            .attr("width", 0)
            .attr("height", 0);
        var retryText = retryG.append("text")
            .text("Retry")
            .classed("retryText", true)
            .attr("x", retryButtonWidth / 2)
            .attr("y", retryButtonHeight / 2)
            .style("font-size", "0px");
        gameOverTop
            .transition()
            .duration(1000)
            .style("font-size", "150px")
            .each(function()
                {
                    gameOverBottom
                        .transition()
                        .style("font-size", "150px")
                })
            .each(function()
                {
                    retryButton
                        .transition()
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", retryButtonWidth)
                        .attr("height", retryButtonHeight);
                })
            .each(function()
                {
                    retryText
                        .transition()
                        .style("font-size", "30px");
                });
        retryButton
            .on("click", function() { gameOverTop.remove(); gameOverBottom.remove(); retryG.remove(); initialise_game(); })
    }

    function shoot(startX, startY)
    {
        // Create a pill.
        // startX is the X coordinate where the pill should be created.
        // startY is the Y coordinate of the bottom of the pill that should be created.

        var pillContainer = svg.append("g")
            .datum({"transX" : startX, "transY" : startY - pillHeight})
            .classed("pillContainer", true)
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
        var pill = pillContainer.append("rect")
            .classed("pill", true)
            .attr("height", pillHeight)
            .attr("width", pillWidth)
            .attr("rx", pillRoundedCorner)
            .attr("ry", pillRoundedCorner)
            .attr("fill", "url(#pillGradient)");
    }

    function step_game()
    {
        // Step the game forward once.

        // Determine how to move the faces.
        var changeInY = 0;

        if (alreadyDescending)
        {
            // Faces are already moving in the Y directions, so see if they should continue to do so.
            if (bottomEdgeOfFaces < descendTo)
            {
                // Not reached new row for faces so drop down Y.
                changeInY = faceMovementSpeed;
            }
            else
            {
                // Reached new resting Y value.
                alreadyDescending = false;
                currentDirection *= -1;  // Reverse direction.
            }
        }
        else if (leftEdgeOfFaces <= 0 || rightEdgeOfFaces >= svgWidth)
        {
            // Faces are not descending and have just reached the left or right edge of the screen.
            alreadyDescending = true;
            descendTo = bottomEdgeOfFaces + faceDiameter + faceGapVertical;
            changeInY = faceMovementSpeed;
        }
        var changeInX = changeInY ? 0 : currentDirection * faceMovementSpeed;

        // Update the extreme edges of the set of faces.
        bottomEdgeOfFaces += changeInY;
        topEdgeOfFaces += changeInY;
        leftEdgeOfFaces += changeInX;
        rightEdgeOfFaces += changeInX;

        // Move the faces.
        var sadFaces = svg.selectAll(".sadFace");
        sadFaces.attr("transform", function(d) { d.transX += changeInX; d.transY += changeInY; return "translate(" + d.transX + "," + d.transY + ")"; });

        // Update the pill if one has been shot.
        var shootableFaces = svg.selectAll(".canBeShot");
        var currentPill = svg.select(".pillContainer");
        if (!currentPill.empty())
        {
            // Move the pill.
            currentPill.attr("transform", function(d) { d.transY -= pillSpeed; return "translate(" + d.transX + "," + d.transY + ")"; });

            // Check if the pill has collided with a face.
            var pillPosition = currentPill.datum();
            if (pillPosition.transY <= bottomEdgeOfFaces && pillPosition.transY >= topEdgeOfFaces)
            {
                // Check whether pill has collided with a face.
                check_face_collision(shootableFaces, currentPill, pillHeight, pillWidth);
            }
            else if (pillPosition.transY <= 0)
            {
                // Pill has reached top of play area, so destroy it.
                currentPill.remove();
            }
        }

        // Check if game over has occurred from the faces reaching too low.
        if (bottomEdgeOfFaces >= gameOverHeight)
        {
            // Game over has occurred.
            // Display game over message.
            game_over();

            // Kill the timer.
            return true;
        }
    }
}
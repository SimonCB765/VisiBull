var tileSideLength = 30;  // The length of each side of the tiling squares. Must be a divisor of both the svg width and height.
var svgWidth = 900;  // The width of the SVG element.
var svgHeight = 450;  // The height of the SVG element.

// Create the SVG g element.
var svg = d3.select(".content")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("tabindex", 0);  // Set tab index to ensure that the element can get focus.

// Create the tile data. This will include an extra two rows (above and below the game grid) and an extra two columns (to the left
// and right of the game grid). These rows and columns will be used for determining when the snake has hit the wall (if the head goes into
// an off the grid square, then the snake has hit the wall).
tileData = [];
var tileIndex = 0;  // Tile indices increase down columns first, and then by rows going left to right.
var offEdge = false;  // Whether the tile is off the edge of the grid.
var numRows = (svgWidth / tileSideLength);  // The number of rows.
var numCols = (svgHeight / tileSideLength);  // The number of columns.
var validFoodIndices = [];  // The indices where food can be put down.
for (var i = -1; i <= numRows; i++)
{
    for (var j = -1; j <= numCols; j++)
    {
        offEdge = (i === -1 || i === numRows) || (j === -1 || j === numCols);
        tileData.push({"transX" : i * tileSideLength, "transY" : j * tileSideLength, "index" : tileIndex, "offEdge" : offEdge});
        if (!offEdge) { validFoodIndices.push(tileIndex); }
        tileIndex++;
    }
}

// Tile the SVG element to make the playing grid.
var tileContainers = svg.selectAll(".tile")
    .data(tileData)
    .enter()
    .append("g")
    .classed("OOB", function(d) { return d.offEdge; })
    .attr("transform", function(d) { return "translate(" + d.transX + ", " + d.transY + ")"; });
var tiles = tileContainers.append("rect")
    .classed("tile", true)
    .attr("data-index", function(d) { return d.index; })  // Attach the index of the tile as an HTML5 data attribute.
    .attr("height", tileSideLength)
    .attr("width", tileSideLength);

// Initialise the game.
initialise_game();


function initialise_game()
{
    // Initialise the game and start it running.

    // Clear the game grid.
    d3.selectAll(".tile")
        .classed({"snake" : false, "food" : false, "head" : false});

    // Initialise the snake.
    var snakeTileIndices = [];
    var snakeHead;  // The index of the head of the snake.
    var snakeTail;  // The index of the tail of the snake.
    var snakeDirection = "right";  // The initial snake direction.
    var snakeSpeed = 350;  // Number of milliseconds between snake movements.
    var speedIncrement = 10;  // The number of milliseconds by which the snake's movement delay should decrease after eating food.
    var maxSpeed = 100;  // The minimum number of milliseconds between snake movements.
    for (var i = 1; i <= 5; i++)
    {
        var indexToAdd = Math.floor((numCols + 2) / 2) + ((numCols + 2) * i);
        snakeTileIndices.push(indexToAdd);
        validFoodIndices.splice(validFoodIndices.indexOf(indexToAdd), 1);  // No longer a valid index for food.
    }
    snakeHead = snakeTileIndices.slice(-1)[0];
    snakeTail = snakeTileIndices[0];
    tiles.classed({"snake" : function(d) { return snakeTileIndices.indexOf(d.index) > -1; }, "head" : function(d) { return d.index === snakeHead; }});

    // Initialise some food.
    var foodEaten = 0;  // Number of food pieces eaten.
    for (var i = 0; i < 5; i++) { place_food(); }

    // Attach the handlers for the game area.
    var lastKeyPress = 39;  // Used to store the code of the last directional key pressed.
    svg
        .on("click", function() { this.focus();})  // Set focus on the game when clicking on it.
        .on("keydown", function() { var keyCode = d3.event.keyCode; if (keyCode >= 37 && keyCode <= 40) { lastKeyPress = keyCode; d3.event.preventDefault(); }});

    // Set initial focus.
    svg[0][0].focus();

    // Setup the timer for the snake movement.
    var gameStep = setInterval(move_snake, snakeSpeed);

    function snake_direction()
    {
        // Determine the direction of the snake.
        switch (lastKeyPress)
        {
            case 37:  // Left arrow key.
                snakeDirection = (snakeDirection === "right") ? "right" : "left";
                break;
            case 38:  // Up arrow key.
                snakeDirection = (snakeDirection === "down") ? "down" : "up";
                break;
            case 39:  // Right arrow key.
                snakeDirection = (snakeDirection === "left") ? "left" : "right";
                break;
            case 40:  // Down arrow key
                snakeDirection = (snakeDirection === "up") ? "up" : "down";
                break;
            default:
                null;
        }
    }

    function move_snake()
    {
        // Move the snake by a square.

        // Get the snake's direction.
        snake_direction();

        // Determine the new head position.
        var newSnakeHead = snakeHead;
        switch (snakeDirection)
        {
            case "up":
                newSnakeHead -= 1;
                break;
            case "right":
                newSnakeHead += (numCols + 2);
                break;
            case "down":
                newSnakeHead += 1;
                break;
            default:  // "left"
                newSnakeHead -= (numCols + 2);
        }
        var newHeadElement = d3.select(document.querySelector("[data-index='" + newSnakeHead + "']"));  // Select the new head.

        // Determine whether the new head is on a food item.
        if (newHeadElement.classed("food"))
        {
            // The new head element is over food, so grow the snake.
            newHeadElement.classed("food", false);  // Record the new location as no longer being food.
            foodEaten++;
            validFoodIndices.splice(validFoodIndices.indexOf(newSnakeHead), 1);  // The new head is no longer a valid index for food.

            // Record that the current head is no longer the head.
            var headElement = d3.select(document.querySelector("[data-index='" + snakeHead + "']"));
            headElement.classed("head", false);

            // Style the new head.
            snakeHead = newSnakeHead;
            newHeadElement.classed({"snake" : true, "head": true});
            snakeTileIndices.push(snakeHead);  // Add the new head to the list of the snake indices.

            // Add a new food item.
            place_food();

            // Speed the snake up if the max speed has not already been reached.
            snakeSpeed -= speedIncrement;
            snakeSpeed = Math.max(snakeSpeed, maxSpeed);
            clearInterval(gameStep);
            gameStep = setInterval(move_snake, snakeSpeed);
        }
        else
        {
            // The new head is not food.

            // Change the tail position.
            var tailElement = d3.select(document.querySelector("[data-index='" + snakeTail + "']"));
            tailElement.classed("snake", false);
            snakeTileIndices.shift();  // Knock off the tail element from the list of the snake indices.
            validFoodIndices.push(snakeTail);  // The tail is now a valid food location.
            snakeTail = snakeTileIndices[0];

            // Record that the current head is no longer the head.
            var headElement = d3.select(document.querySelector("[data-index='" + snakeHead + "']"));
            headElement.classed("head", false);

            // Game over if the new head element is off the edge of the screen or is already part of the snake.
            if (newHeadElement.datum().offEdge || newHeadElement.classed("snake"))
            {
                // Set up the game over text and retry button.
                var retryButtonHeight = 50;
                var retryButtonWidth = 100;
                clearInterval(gameStep);
                var gameOver = svg.append("text")
                    .text("Game Over")
                    .classed("gameOver", true)
                    .attr("x", svgWidth / 2)
                    .attr("y", svgHeight / 3)
                    .style("font-size", "0px");
                var eatenMessage = svg.append("text")
                    .text("You ate " + foodEaten + (foodEaten === 1 ? " piece" : " pieces") + " of food")
                    .classed("gameOver", true)
                    .attr("x", svgWidth / 2)
                    .attr("y", svgHeight * 2 / 3)
                    .style("font-size", "0px");
                var retryG = svg.append("g")
                    .attr("transform", "translate(" + ((svgWidth / 2) - (retryButtonWidth / 2)) + ", " + (svgHeight - retryButtonHeight - 25) + ")");
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
                gameOver
                    .transition()
                    .duration(1000)
                    .style("font-size", "175px")
                    .each(function()
                        {
                            eatenMessage
                                .transition()
                                .style("font-size", "75px");
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
                retryButton  // Add behaviour of retry button.
                    .on("click", function() { gameOver.remove(); eatenMessage.remove(); retryG.remove(); initialise_game(); })
            }

            // Style the new head.
            newHeadElement.classed({"snake" : true, "head": true});
            snakeTileIndices.push(newSnakeHead);  // Add the new head to the list of the snake indices.
            validFoodIndices.splice(validFoodIndices.indexOf(newSnakeHead), 1);  // The new head is no longer a valid index for food.
            snakeHead = newSnakeHead;
        }
    }
}

function place_food()
{
    // Place a piece of food in a random valid square. A valid square is one that does not contain the snake or a piece of food already,
    // and is not off the visible grid.
    var foodIndex = validFoodIndices[Math.floor(Math.random() * validFoodIndices.length)];  // The index where the food will be added.
    validFoodIndices.splice(validFoodIndices.indexOf(foodIndex), 1);  // No longer a valid index for food.
    var foodSquare = document.querySelector("[data-index='" + foodIndex + "']");  // Grab the element with the selected index.
    d3.select(foodSquare).classed("food", true);
}
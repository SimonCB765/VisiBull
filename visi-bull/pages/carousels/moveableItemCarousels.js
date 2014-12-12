function moveableItemCarousels(items)
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var width = 500,  // The width of the carousel.
        height = 500,  // The height of the carousel.
        xLoc = 0,  // The X coordinate within its container of the top right corner of the carousel.
        yLoc = 0,  // The Y coordinate within its container of the top right corner of the carousel.
        items = items,  // The items to put in the carousel.
        horizontalPadding = 10,  // The amount of padding to put on the left and right of the item. Half the padding goes on the left and half on the right.
        verticalPadding = 10,  // The amount of padding to put above and below the item. Half the padding goes above and half below.
                               // Shorter items may appear to have more space around them than the value of verticalPadding says they should. This is
                               // because shorter items will be centered in the carousel, and will therefore have extra space above and below them.
        isArrows = true,  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
        dotContainerHeight = 30,  // The height of the g element containing the navigation dots. Should be at least twice the dotRadius.
        navArrowWidth = null,  // The width of the navigation arrow.
        navArrowHeight = null,  // The height of the navigation arrow.
        scrollSpeed = 5;  // The time (in ms) taken for the carousel to scroll one unit. A lower number is faster.

    /*****************************
    * Carousel Creation Function *
    *****************************/
    function carousel(selection)
    {
        // The selection passed in must contain only one element.
        if (selection.size() !== 1) { console.log("Selection to create carousel in must contain only one element."); return; }

        // Setup the carousel container.
        var carousel = selection.append("g")
            .classed("carousel", true)
            .attr("transform", function(d) { return "translate(" + xLoc + "," + yLoc + ")"; });
        var itemContainer = carousel.append("g")
            .classed("itemContainer", true);

        // Determine the width of each item (taking into account its padding), and the maximum height of all items.
        var maxItemHeight = 0;  // The maximum height (including vertical padding) of all the items.
        var itemWidths = [];  // The width for all the items. The width of the item with index i is found at index i in this array.
        var itemData = items.data();
        var currentItemData;
        for (var i = 0; i < itemData.length; i++)
        {
            currentItemData = itemData[i];
            maxItemHeight = Math.max(maxItemHeight, currentItemData.height + verticalPadding);
            itemWidths.push(currentItemData.width);
        }

        // Create the backing rectangle to catch events. Create it before transferring the items in order to ensure it is below them.
        itemContainer.append("rect")
            .classed("backingRect", true)
            .attr("width", width)
            .attr("height", height);

        // Setup the scroll path.
        var scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size());  // The length of the path along which the scrolling will occur.
        var scrollPathStartX = (width + 10) - scrollPathLength;  // The X location of the start of the scroll path (want the path to end at width + 10).
        var scrollPathStartY = height / 2;  // The Y location of the start of the scroll path.
        var leftItemStartX = (width / 2) - (d3.select(items[0][0]).datum().width / 2);  // The X location of the leftmost item in the view.
        var leftItemStartDist = leftItemStartX - scrollPathStartX;  // The location of the leftmost item in the view in terms of its fractional distance along the path.
        var distOfCenter = (width / 2) - scrollPathStartX;  // The distance of the center of the carousel along the scroll path.

        // Create the path to scroll along.
        var pathToScrollAlong = itemContainer.append("path")
            .classed("scrollPath", true)
            .attr("d", "M" + scrollPathStartX + "," + scrollPathStartY + "h" + scrollPathLength);

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { itemContainer.node().appendChild(this); });

        // Put the items in the initial places.
        var sortedItems = items.data().map(function(d) { return d.key; });
        set_resting_positions(sortedItems);
        items.attr("transform", function(d)
            {
                // Get the coordinates of the position currentItemDist along the path.
                positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.resting);

                // Update item position.
                d.distAlongPath = d.resting;
                d.transX = positionAlongPath.x;
                d.transY = positionAlongPath.y - (d.height / 2);

                return "translate(" + d.transX + "," + d.transY + ")";
            });

        // Add drag behaviour.
        var dragBehaviour = d3.behavior.drag()
            .on("dragstart", drag_start)
            .on("drag", drag_update)
            .on("dragend", drag_end);
        items.call(dragBehaviour);

        // Create the navigation arrows.
        if (isArrows)
        {
            // Determine whether default values are needed for the navigation arrow width and height.
            if (navArrowHeight === null) navArrowHeight = (height - (isDots ? dotContainerHeight : 0)) / 2;
            if (navArrowWidth === null) navArrowWidth = navArrowHeight;

            var navArrowOffset = 10;  // The offset of each navigation arrow from its respective edge of the carousel.

            // Create the left navigation arrow.
            // The left arrow is inactive at the start if infinite scrolling is not used.
            var leftNavArrowContainer = carousel.append("g")
                .classed({"navArrow": true, "left": true})
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })
                .attr("transform", "translate(" + navArrowOffset + "," + ((height / 2) - (navArrowHeight / 2)) + ")");
            leftNavArrowContainer.append("rect")
                .attr("width", navArrowWidth)
                .attr("height", navArrowHeight);
            leftNavArrowContainer.append("path")
                .attr("d", "M" + (navArrowWidth * 3 / 5) + ",0" +
                           "L" + (navArrowWidth / 6) + "," + (navArrowHeight / 2) +
                           "L" + (navArrowWidth * 3 / 5) + "," + navArrowHeight +
                           "H" + (navArrowWidth * 4 / 5) +
                           "L" + (navArrowWidth * 3 / 7) + "," + (navArrowHeight / 2) +
                           "L" + (navArrowWidth * 4 / 5) + ",0" +
                           "Z"
                     );

            // Create the right navigation arrow.
            var rightNavArrowContainer = carousel.append("g")
                .classed({"navArrow": true, "right": true})
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })
                .attr("transform", "translate(" + (width - navArrowWidth - navArrowOffset) + "," + ((height / 2) - (navArrowHeight / 2)) + ")");
            rightNavArrowContainer.append("rect")
                .attr("width", navArrowWidth)
                .attr("height", navArrowHeight);
            rightNavArrowContainer.append("path")
                .attr("d", "M" + (navArrowWidth * 2 / 5) + ",0" +
                           "L" + (navArrowWidth * 5 / 6) + "," + (navArrowHeight / 2) +
                           "L" + (navArrowWidth * 2 / 5) + "," + navArrowHeight +
                           "H" + (navArrowWidth / 5) +
                           "L" + (navArrowWidth * 4 / 7) + "," + (navArrowHeight / 2) +
                           "L" + (navArrowWidth / 5) + ",0" +
                           "Z"
                     );
        }

        // Add the navigation arrow behaviour.
        var navigationArrows = carousel.selectAll(".navArrow")
            .on("mousedown", function() { var isLeft = d3.select(this).classed("left"); start_scrollng(isLeft); })
            .on("mouseup", stop_scrolling)
            .on("mouseleave", leave_stop_scrolling)
            .on("dblclick", function() { console.log("2X"); });

        // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
        carousel
            .on("mouseover", function() { leftNavArrowContainer.classed("visible", true); rightNavArrowContainer.classed("visible", true); })
            .on("mouseout", function() { leftNavArrowContainer.classed("visible", false); rightNavArrowContainer.classed("visible", false); });

        /*************************************
        * Individual Item Dragging Functions *
        *************************************/
        var itemDragStartX;  // The X coordinate of the point on the item where the drag started.
        var carouselDragStartX;  // The X coordinate of the point on the carousel where the drag started.
        var isItemFullyIn;  // Whether the item is fully inside the carousel or not.
        function drag_end(d)
        {
            // Scroll the carousel.
            /*
            Need to make sure that the resting position of the item being dragged is in view completely...
            */

            // Add back the highlighting for the navigation arrows.
            navigationArrows
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })
        }

        function drag_start(d)
        {
            d3.select(this)
                .interrupt() // Cancel any transitions running on this item.
                .transition(); // Pre-empt any scheduled transitions on this item.

            // Remove the highlighting of the navigation arrows.
            navigationArrows
                .on("mouseover", null)
                .on("mouseout", null)

            // Initialise the drag point.
            itemDragStartX = d3.mouse(this)[0];
            carouselDragStartX = d3.mouse(this.parentNode)[0];
            isItemFullyIn = (carouselDragStartX >= itemDragStartX) && (carouselDragStartX + (d.width - itemDragStartX) < width);
        }

        function drag_update(d)
        {
            var positionInCarousel = d3.mouse(this.parentNode)[0];  // The position of the mouse in the carousel.
            var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

            // Define the boundaries of the carousel in relation to their distance along the scroll path.
            var leftEdge = -scrollPathStartX;
            var rightEdge = leftEdge + width;

            // Determine whether to move the item being dragged. Items can normally only be dragged if the mouse is within a certain portion
            // of the middle of the carousel (in order to ensure that the item is dragged from the same point on it at all times). However, if
            // an item starts not completely inside the carousel (e.g. because the width of the carousel was specified manually or due to infinite
            // scrolling), then allowance need to be made for items that are only partially inside the carousel.
            var itemCanBeDragged = ((positionInCarousel > itemDragStartX) && (positionInCarousel < (width - (d.width - itemDragStartX))));
            console.log(itemCanBeDragged);
            if (!itemCanBeDragged)
            {
                if (!isItemFullyIn)
                {
                    // The item is not yet fully inside the carousel.
                    if ((carouselDragStartX + (d.width - itemDragStartX) > width) && (positionInCarousel > (width - d.width)))
                    {
                        // The item being dragged is still slightly sticking out the right of the carousel.
                        if ((changeInPosition < 0) && (positionInCarousel < carouselDragStartX))
                        {
                            // Trying to move the carousel to the left, and have reached the point on the item where the user started the
                            // drag, so move the item.
                            d.distAlongPath += changeInPosition;
                        }
                    }
                    else if ((carouselDragStartX < itemDragStartX) && (positionInCarousel < itemDragStartX))
                    {
                        // The item being dragged is still slightly sticking out the left of the carousel.
                        if ((changeInPosition > 0) && (positionInCarousel > itemDragStartX))
                        {
                            // Trying to move the carousel to the right, and have reached the point on the item where the user started the
                            // drag, so move the item.
                            d.distAlongPath += changeInPosition;
                        }
                    }
                }
                else
                {
                    // If the item shouldn't be moved, then clamp the item to the closest carousel edge.
                    var distanceToLeftEdge = d.distAlongPath - leftEdge;
                    var distanceToRightEdge = rightEdge - d.distAlongPath;
                    d.distAlongPath = distanceToLeftEdge < distanceToRightEdge ? leftEdge : rightEdge - d.width;
                }
            }
            else
            {
                // The item can be dragged, and is therefore fully inside the carousel.
                isItemFullyIn = true;
                d.distAlongPath += changeInPosition;
            }

            // Move the item.
            var positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
            d.transX = positionAlongPath.x;
            d3.select(this)
                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });

            // Get an ordered list of the item keys, with the key at index 0 being the leftmost item in the carousel.
            var itemPositions = [];
            var itemKeys = [];
            items.each(function(itemD) { itemPositions.push({"key": itemD.key, "resting": itemD.resting}); });
            itemPositions.sort(function (a, b)
                {
                    if (a.resting > b.resting) { return 1; }
                    else if (a.resting < b.resting) { return -1; }
                    else { return 0; }
                });
            for (var i = 0; i < itemPositions.length; i++)
            {
                itemKeys.push(itemPositions[i].key);
            }

            // Determine if the dragged item should swap resting places with a non-dragged one.
            var draggedItemIndex = itemKeys.indexOf(d.key);
            var leftNeighbourIndex = draggedItemIndex - 1;
            var rightNeighbourIndex = draggedItemIndex + 1;
            if (leftNeighbourIndex >= 0)
            {
                // If the item being dragged is not already the leftmost item.
                var leftNeighbour = items.filter(function(itemD) { return itemD.key === itemPositions[leftNeighbourIndex].key; })
                if ((d.distAlongPath - itemPositions[leftNeighbourIndex].resting) < (itemPositions[draggedItemIndex].resting - d.distAlongPath))
                {
                    // If the item is closer to its left neighbour's resting location than its own resting location, then swap the two items resting spots.
                    leftNeighbour.datum().resting += (d.width + horizontalPadding);
                    d.resting = itemPositions[leftNeighbourIndex].resting;
                    leftNeighbour
                        .transition()
                        .duration(itemSnapSpeed / 2)
                        .ease("cubic-out")
                        .tween("transform", function(transD)
                            {
                                var interpolator = d3.interpolate(transD.distAlongPath, transD.resting);
                                var currentPoint;
                                return function(t)
                                {
                                    transD.distAlongPath = interpolator(t);
                                    currentPoint = pathToScrollAlong.node().getPointAtLength(transD.distAlongPath);
                                    transD.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                    transD.transY = currentPoint.y - (transD.height / 2);  // Determine position of the item at this point in the transition.
                                    d3.select(this)
                                        .attr("transform", function() { return "translate(" + transD.transX + "," + transD.transY + ")"; });  // Update the item's position.
                                }
                            });
                }
            }
            if (rightNeighbourIndex <= itemKeys.length - 1)
            {
                // If the item being dragged is not already the rightmost item.
                var rightNeighbour = items.filter(function(itemD) { return itemD.key === itemPositions[rightNeighbourIndex].key; })
                if ((itemPositions[rightNeighbourIndex].resting - d.distAlongPath) < (d.distAlongPath - itemPositions[draggedItemIndex].resting))
                {
                    // If the item is closer to its right neighbour's resting location than its own resting location, then swap the two items resting spots.
                    var rightNeighbourData = rightNeighbour.datum();
                    rightNeighbourData.resting = d.resting;
                    d.resting += (rightNeighbourData.width + horizontalPadding);
                    rightNeighbour
                        .transition()
                        .duration(itemSnapSpeed / 2)
                        .ease("cubic-out")
                        .tween("transform", function(transD)
                            {
                                var interpolator = d3.interpolate(transD.distAlongPath, transD.resting);
                                var currentPoint;
                                return function(t)
                                {
                                    transD.distAlongPath = interpolator(t);
                                    currentPoint = pathToScrollAlong.node().getPointAtLength(transD.distAlongPath);
                                    transD.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                    transD.transY = currentPoint.y - (transD.height / 2);  // Determine position of the item at this point in the transition.
                                    d3.select(this)
                                        .attr("transform", function() { return "translate(" + transD.transX + "," + transD.transY + ")"; });  // Update the item's position.
                                }
                            });
                }
            }
/*
            // Determine whether you need to scroll the carousel.
            var scrollCarousel = null;
            if ((d.distAlongPath + d.width >= rightEdge) || (d.distAlongPath <= leftEdge))
            {
                // The item has been dragged to the right or left edge.
                if (indiviualDragTimerFlag)
                {
                    // The timer is already on, so do nothing.
                }
                else if ((leftNeighbourIndex >= 0) && (rightNeighbourIndex <= itemKeys.length - 1))
                {
                    // If the item being dragged is not the leftmost or rightmost item.
                    // Turn the timer on, and scroll the carousel in the opposite direction that the item has been dragged.
                    indiviualDragTimerFlag = true;
                    var transitionSpeed = (changeInPosition / -changeInPosition);
                    d3.timer(function()
                        {
                            items.filter(function(itemD) { return itemD.key !== d.key; })
                                .attr("transform", function(itemD)
                                    {
                                        itemD.distAlongPath += transitionSpeed;
                                        var positionAlongPath = pathToScrollAlong.node().getPointAtLength(Math.max(0, itemD.distAlongPath));
                                        itemD.transX = positionAlongPath.x;
                                        return "translate(" + itemD.transX + "," + itemD.transY + ")";
                                    });
                            return indiviualDragTimerFlag;
                        });
                }
            }
            else
            {
                console.log(d.distAlongPath + d.width, rightEdge, d.distAlongPath, leftEdge, indiviualDragTimerFlag);
                // The item is not at the edge.
                indiviualDragTimerFlag = false;
            }
*/
        }

        /***************************
        * Item Scrolling Functions *
        ***************************/
        var scrollIntervalTimer = null;  // The timer used to fire scroll events.
        var isShiftRight;  // Whether the items are being scrolled rightwards.
        function leave_stop_scrolling()
        {
            if (scrollIntervalTimer !== null) stop_scrolling();
        }

        function scroll_carousel(isLeft)
        {
            // Scroll the carousel.
            // isLeft is true when the carousel is to be scrolled leftwards (the items are to go rightwards).

            var currentPoint;
            items.each(function(d)
                {
                    d.distAlongPath += (isLeft ? 1 : -1);
                    d.distAlongPath = (scrollPathLength + d.distAlongPath) % scrollPathLength;
                    currentPoint = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                    d.transX = currentPoint.x;
                    d.transY = currentPoint.y - (d.height / 2);
                    d3.select(this)
                        .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; })  // Update the item's position.
                });
        }

        function start_scrollng(isLeft)
        {
            // Start the scrolling of the carousel.
            // isLeft is true when the carousel is to be scrolled leftwards (the items are to go rightwards).

            // Stop the items transitioning if they currently are.
            items
                .interrupt() // Cancel any transitions running on this item.
                .transition(); // Pre-empt any scheduled transitions on this item.

            // Record the direction that the items are moving.
            isShiftRight = isLeft;

            // Setup the timer to scroll the carousel.
            scrollIntervalTimer = setInterval(function() { scroll_carousel(isLeft); }, scrollSpeed);
        }

        function stop_scrolling()
        {
            // Stop the timer used to scroll the carousel.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;

            // Get the current positions of all items, and information about the item closest to the center of the carousel.
            var currentPositions = [];
            var shortestDistance = scrollPathLength;
            var startDistAlongPath;  // The distance along the scroll path of the item closest to the center of the carousel.
            var distanceToShift;  // The distance by which the items will be shifted.
            items.each(function(d)
                {
                    // Record the data of the item.
                    currentPositions.push({"key": d.key, "distAlongPath": d.distAlongPath});

                    // Determine whether the item is the closest to the center of all items seen so far, and is in the correct direction.
                    var itemCenterDist = d.distAlongPath + (d.width / 2);
                    var distToCenter = Math.abs(itemCenterDist - distOfCenter);
                    if (isShiftRight)
                    {
                        // The items are moving right, so the closest item to the center must be to the left of the center.
                        if ((distToCenter < shortestDistance) && (itemCenterDist < distOfCenter))
                        {
                            shortestDistance = distToCenter;
                            startDistAlongPath = d.distAlongPath;
                            distanceToShift = (distOfCenter - (d.width / 2)) - startDistAlongPath;
                        }
                    }
                    else
                    {
                        // The items are moving left, so the closest item to the center must be to the right of the center.
                        if ((distToCenter < shortestDistance) && (itemCenterDist > distOfCenter))
                        {
                            shortestDistance = distToCenter;
                            startDistAlongPath = d.distAlongPath;
                            distanceToShift = startDistAlongPath - (distOfCenter - (d.width / 2));
                        }
                    }
                });

            // Determine the order of item placements from the central item wrapping around the carousel rightwards.
            currentPositions.sort(function (a, b)
                {
                    if (a.distAlongPath < startDistAlongPath) a.distAlongPath += scrollPathLength;
                    if (b.distAlongPath < startDistAlongPath) b.distAlongPath += scrollPathLength;
                    if (a.distAlongPath > b.distAlongPath) { return 1; }
                    else if (a.distAlongPath < b.distAlongPath) { return -1; }
                    else { return 0; }
                });

            // Extract the newly ordered keys.
            var itemKeys = [];
            for (var i = 0; i < currentPositions.length; i++)
            {
                itemKeys.push(currentPositions[i].key);
            }

            // Update the resting positions of the items.
            set_resting_positions(itemKeys);

            // Move the items into position.
            transition_items(isShiftRight, distanceToShift);
        }

        /*******************
        * Helper Functions *
        *******************/
        function set_resting_positions(itemOrder)
        {
            // Set the resting positions of the items
            // itemOrder is an array of the keys of the items in the order that the items should be placed in the carousel.

            // Sort the items.
            var sortedItems = items.sort(function(a, b) { return (itemOrder.indexOf(a.key) < itemOrder.indexOf(b.key) ? -1 : 1); });

            // Determine the items' positions.
            var currentItemDist = (width / 2) - scrollPathStartX;  // Distance along the path of the current item.
            var positionAlongPath;  // The coordinates of the point on the path at a distance of currentItemDist along it.
            items.each(function(d, i)
                {
                    // Update the currentItemDist to position the current item.
                    if (i === 0)
                    {
                        currentItemDist -= (d.width / 2);
                    }
                    else
                    {
                        // If the item is not the first one.
                        currentItemDist += (horizontalPadding / 2);
                    }
                    currentItemDist = (scrollPathLength + currentItemDist) % scrollPathLength;  // Wrap the item's position around to the left of the items in view if necessary.
                    d.resting = currentItemDist;

                    // Set position for next item.
                    currentItemDist += (d.width + (horizontalPadding / 2));
                });
        }

        function transition_items(isShiftRight, distanceToShift)
        {
            // Transition the items from their current positions to their resting positions.
            // isShiftRight is true if the items are to be shifted to the right.
            // distanceToShift is the number of units to shift the items by.

            // Transition items back to their resting locations from wherever they are.
            items
                .transition()
                .duration(distanceToShift * scrollSpeed)
                .ease("linear")
                .tween("transform", function(d)
                    {
                        var interpolator;
                        if (isShiftRight)
                        {
                            // The items are to be shifted right.
                            if (d.distAlongPath <= d.resting)
                            {
                                // If the current position of the item is to the left of its resting place, then the item can simply be moved rightwards.
                                interpolator = d3.interpolate(d.distAlongPath, d.resting);
                            }
                            else
                            {
                                // If the current position of the item is to the right of its resting place, then the item has looped
                                // all the way around to the right side of the carousel, and you therefore want it to scroll back by:
                                // 1)   Scrolling right towards the end of the path.
                                // 2)   Upon reaching the end of the path, loop back to the beginning of the path.
                                // 3)   Scrolling right towards its resting place.
                                var distanceToTravel = (scrollPathLength - d.distAlongPath) + d.resting;
                                interpolator = d3.interpolate(d.distAlongPath, d.distAlongPath + distanceToTravel);
                            }

                        }
                        else
                        {
                            // The items are to be shifted left.
                            if (d.distAlongPath < d.resting)
                            {
                                // If the current position of the item is to the left of its resting place, then the item has looped
                                // all the way around to the left side of the carousel, and you therefore want it to scroll back by:
                                // 1)   Scrolling left towards the beginning of the path.
                                // 2)   Upon reaching the beginning of the path, loop back to the end of the path.
                                // 3)   Scrolling left towards its resting place.
                                var distanceToTravel = d.distAlongPath + (scrollPathLength - d.resting);
                                interpolator = d3.interpolate(d.distAlongPath, d.distAlongPath - distanceToTravel);
                            }
                            else
                            {
                                // If the current position of the item is to the right of its resting place, then the item can simply be moved leftwards.
                                interpolator = d3.interpolate(d.distAlongPath, d.resting);
                            }
                        }

                        var currentPoint;
                        return function(t)
                            {
                                d.distAlongPath = (scrollPathLength + interpolator(t)) % scrollPathLength;
                                currentPoint = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                                d.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                d.transY = currentPoint.y - (d.height / 2);  // Determine position of the item at this point in the transition.
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                            }
                    });
        }
    }

    /**********************
    * Getters and Setters *
    **********************/
    // Carousel width.
    carousel.width = function(_)
    {
        if (!arguments.length) return width;
        width = _;
        return carousel;
    }

    // Carousel height.
    carousel.height = function(_)
    {
        if (!arguments.length) return height;
        height = _;
        return carousel;
    }

    // Carousel X location.
    carousel.xLoc = function(_)
    {
        if (!arguments.length) return xLoc;
        xLoc = _;
        return carousel;
    }

    // Carousel Y location.
    carousel.yLoc = function(_)
    {
        if (!arguments.length) return yLoc;
        yLoc = _;
        return carousel;
    }

    // Horizontal padding.
    carousel.horizontalPadding = function(_)
    {
        if (!arguments.length) return horizontalPadding;
        horizontalPadding = _;
        return carousel;
    }

    // Vertical padding.
    carousel.verticalPadding = function(_)
    {
        if (!arguments.length) return verticalPadding;
        verticalPadding = _;
        return carousel;
    }

    // Navigation arrows.
    carousel.isArrows = function(_)
    {
        if (!arguments.length) return isArrows;
        isArrows = _;
        return carousel;
    }

    // Navigation dot container height.
    carousel.dotContainerHeight = function(_)
    {
        if (!arguments.length) return dotContainerHeight;
        dotContainerHeight = _;
        return carousel;
    }

    // Navigation arrow width.
    carousel.navArrowWidth = function(_)
    {
        if (!arguments.length) return navArrowWidth;
        navArrowWidth = _;
        return carousel;
    }

    // Navigation arrow height.
    carousel.navArrowHeight = function(_)
    {
        if (!arguments.length) return navArrowHeight;
        navArrowHeight = _;
        return carousel;
    }

    // Individually scrollable items.
    carousel.scrollSpeed = function(_)
    {
        if (!arguments.length) return scrollSpeed;
        scrollSpeed = _;
        return carousel;
    }

    return carousel;
}
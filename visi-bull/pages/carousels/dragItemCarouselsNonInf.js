function dragItemCarouselsNonInf(items)
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
        var scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size()) + d3.max(itemWidths);  // The length of the path along which the scrolling will occur.
        var scrollPathStartX = -d3.max(itemWidths);  // The X location of the start of the scroll path (want it to be able to contain the widest item off screen to the left).
        var scrollPathStartY = height / 2;  // The Y location of the start of the scroll path.

        // Determine the position where the leftmost item in the carousel will start.
        var leftItemStartX = horizontalPadding / 2;  // The X location of the leftmost item in the view.
        var leftItemStartDist = leftItemStartX - scrollPathStartX;  // The location of the leftmost item in the view in terms of its fractional distance along the path.

        // Determine the boundaries of the carousel in relation to their distance along the scroll path.
        var carouselLeftEdge = -scrollPathStartX;
        var carouselRightEdge = carouselLeftEdge + width;

        // Create the path to scroll along.
        var pathToScrollAlong = itemContainer.append("path")
            .classed("scrollPath", true)
            .attr("d", "M" + scrollPathStartX + "," + scrollPathStartY + "h" + scrollPathLength);

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { itemContainer.node().appendChild(this); });

        // Put the items in the initial places.
        var currentItemDist = leftItemStartDist;  // Distance along the path of the current item.
        var positionAlongPath;  // The coordinates of the point on the path at a distance of currentItemDist along it.
        items.attr("transform", function(d, i)
            {
                // Update the currentItemDist to position the current item.
                if (i !== 0)
                {
                    // If the item is not the first one.
                    currentItemDist += (horizontalPadding / 2);
                }
                d.resting = currentItemDist;
                d.distAlongPath = d.resting;

                // Update item position.
                positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.resting);
                d.transX = positionAlongPath.x;
                d.transY = positionAlongPath.y - (d.height / 2);

                // Set position for next item.
                currentItemDist += (d.width + (horizontalPadding / 2));

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
            .on("mousedown", function() { var isLeft = d3.select(this).classed("left"); start_scrollng(isLeft, []); })
            .on("mouseup", stop_scrolling)
            .on("mouseleave", leave_stop_scrolling)
            .on("dblclick", scroll_doubletap);

        // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
        carousel
            .on("mouseover", function() { leftNavArrowContainer.classed("visible", true); rightNavArrowContainer.classed("visible", true); })
            .on("mouseout", function() { leftNavArrowContainer.classed("visible", false); rightNavArrowContainer.classed("visible", false); });

        /*************************************
        * Individual Item Dragging Functions *
        *************************************/
        var itemDragStartX;  // The X coordinate of the point on the item where the drag started.
        var draggedItem = null;  // The item that is being dragged.
        var leftNeighbour = null;  // The item to the left of the one being dragged.
        var rightNeighbour = null;  // The item to the right of the one being dragged.
        function drag_end()
        {
            // Add back the highlighting for the navigation arrows.
            navigationArrows
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })

            // Transition items to their resting places.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;
            draggedItem
                .transition()
                .duration(200)
                .ease("linear")
                .tween("transform", function(d)
                    {
                        var interpolator = d3.interpolate(d.distAlongPath, d.resting);

                        return function(t)
                            {
                                d.distAlongPath = interpolator(t);
                                currentPoint = pathToScrollAlong.node().getPointAtLength(Math.max(0, Math.min(d.distAlongPath, scrollPathLength)));
                                d.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                d.transY = currentPoint.y - (d.height / 2);  // Determine position of the item at this point in the transition.
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                            }
                    });

            // Remove the record of the item neighbours.
            draggedItem = null;
            leftNeighbour = null;
            rightNeighbour = null;
        }

        function drag_start(d)
        {
            draggedItem = d3.select(this);

            // Kill any transitions that the dragged item is undergoing or is scheduled to undergo.
            draggedItem
                .interrupt() // Cancel any transitions running on this item.
                .transition(); // Pre-empt any scheduled transitions on this item.

            // Remove the highlighting of the navigation arrows.
            navigationArrows
                .on("mouseover", null)
                .on("mouseout", null)

            // Record information about the starting conditions of the drag.
            itemDragStartX = draggedItem[0];

            // Determine the left and right neighbours of the item being dragged.
            var neighbours = determine_neighbours(d.key);
            leftNeighbour = neighbours.left;
            rightNeighbour = neighbours.right;
        }

        function drag_update(d)
        {
            var positionInCarousel = d3.mouse(this.parentNode)[0];  // The position of the mouse in the carousel.
            var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

            // Move the item if the mouse is currently inside the carousel.
            if ((positionInCarousel > 0) && (positionInCarousel < width)) d.distAlongPath += changeInPosition;

            // Move the item.
            var positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
            d.transX = positionAlongPath.x;
            draggedItem
                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });

            // Determine whether to swap any of the items.
            check_item_swap();

            // Determine whether to scroll the carousel.
            if ((d.distAlongPath < carouselLeftEdge) && (changeInPosition <= 0))
            {
                // If the user is dragging the item to the left, and the item is at the left edge, then start scrolling the items to the right.
                start_scrollng(true, [d.key]);
            }
            else if ((d.distAlongPath + d.width > carouselRightEdge) && (changeInPosition >= 0))
            {
                // If the user is dragging the item to the right, and the item is at the right edge, then start scrolling the items to the left.
                start_scrollng(false, [d.key]);
            }
            else
            {
                // Stop the scrolling (if it is occurring).
                clearInterval(scrollIntervalTimer);
                scrollIntervalTimer = null;
            }
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

        function scroll_carousel(itemsToNotScroll)
        {
            // Scroll the carousel.
            // itemsToNotScroll is an array of the keys of the items that should not be moved.

            // Determine if scrolling should take place.
            var isScrollItems = check_scrolling();

            // Scroll the items if they should be scrolled.
            if (isScrollItems)
            {
                var currentPoint;
                items
                    .each(function(d)
                        {
                            if (itemsToNotScroll.indexOf(d.key) === -1) d.distAlongPath += (isShiftRight ? 1 : -1);
                            d.resting += (isShiftRight ? 1 : -1);
                            currentPoint = pathToScrollAlong.node().getPointAtLength(Math.max(0, Math.min(d.distAlongPath, scrollPathLength)));
                            d.transX = currentPoint.x;
                            d.transY = currentPoint.y - (d.height / 2);
                            d3.select(this)
                                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; })  // Update the item's position.
                        });

                // Determine whether to swap any of the items. Only bother checking if dragging is occurring.
                if (draggedItem !== null) check_item_swap();
            }
        }

        function scroll_doubletap()
        {
            // Scroll the items after a double tap.

            // Stop the timer used to scroll the carousel.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;

            // Determine the location along the scroll path of the new center.
            var newCenter = (distOfCenter + (isShiftRight ? -width : width));
            newCenter = (scrollPathLength + newCenter) % scrollPathLength;

            // Determine the new order of the items, and the distance to shift the items by.
            var shiftData = determine_item_order(newCenter, isShiftRight);

            // Update the resting positions of the items.
            set_resting_positions(shiftData.order);

            // Move the items into position.
            transition_items(isShiftRight, width + shiftData.distance);
        }

        function start_scrollng(isLeft, itemsToNotScroll)
        {
            // Start the scrolling of the carousel.
            // isLeft is true when the carousel is to be scrolled leftwards (the items are to go rightwards).
            // itemsToNotScroll is an array of the keys of the items that should not be moved.

            // Start scrolling if there is no scrolling already taking place.
            if (scrollIntervalTimer === null)
            {
                // Record the direction that the items are moving.
                isShiftRight = isLeft;

                // Setup the timer to scroll the carousel.
                scrollIntervalTimer = setInterval(function() { scroll_carousel(itemsToNotScroll); }, scrollSpeed);
            }
        }

        function stop_scrolling()
        {
            // Stop the timer used to scroll the carousel.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;

            // Move the items into their new resting positions.
            if (check_scrolling()) reposition_items(leftItemStartDist);
        }

        /*******************
        * Helper Functions *
        *******************/
        function check_item_swap()
        {
            // Determine whether to swap any of the items.

            // Determine the data of the items.
            var draggedData = draggedItem.datum();

            // Determine if the left neighbour should be swapped.
            if (leftNeighbour !== null)
            {
                // If there is a left neighbour.
                var leftNeighbourData = leftNeighbour.datum();
                if ((leftNeighbourData.resting + (leftNeighbourData.width / 2)) >= draggedData.distAlongPath)
                {
                    var distanceToMove = draggedData.resting - leftNeighbourData.resting;
                    leftNeighbourData.resting += distanceToMove;
                    draggedData.resting -= distanceToMove;
                    transition_items_swap(leftNeighbour);

                    // Determine the new left and right neighbours of the item being dragged.
                    var neighbours = determine_neighbours(draggedData.key);
                    leftNeighbour = neighbours.left;
                    rightNeighbour = neighbours.right;
                }
            }
            
            // Determine if the right neighbour should be swapped.
            if (rightNeighbour !== null)
            {
                // If there is a right neighbour.
                var rightNeighbourData = rightNeighbour.datum();
                if ((rightNeighbourData.resting + (rightNeighbourData.width / 2)) <= (draggedData.distAlongPath + draggedData.width))
                {
                    var distanceToMove = rightNeighbourData.resting - draggedData.resting;
                    rightNeighbourData.resting -= distanceToMove;
                    draggedData.resting += distanceToMove;
                    transition_items_swap(rightNeighbour);

                    // Determine the new left and right neighbours of the item being dragged.
                    var neighbours = determine_neighbours(draggedData.key);
                    leftNeighbour = neighbours.left;
                    rightNeighbour = neighbours.right;
                }
            }
        }

        function check_scrolling()
        {
            // Determine whether the items should be scrolled.

            // Determine number of items left of the carousel's left edge, and right of the carousel's right edge.
            var countTrue = function(a) { var counter = 0; for (var i = 0; i < a.length; i++) if (a[i]) counter++; return counter; }
            var leftOfLeft = items.data().map(function(d) { return d.resting < carouselLeftEdge + (horizontalPadding / 2); });
            var numLeftOfLeft = countTrue(leftOfLeft);
            var rightOfRight = items.data().map(function(d) { return d.resting > carouselRightEdge - d.width -  (horizontalPadding / 2); });
            var numRightOfRight = countTrue(rightOfRight);

            // Determine if scrolling should take place. Scrolling should only take place if there are still items to the left of the
            // carousel's left edge or the right of the carousel's right edge.
            var isScrollItems = (isShiftRight && (numLeftOfLeft > 0)) || (!isShiftRight && (numRightOfRight > 0));

            return isScrollItems;
        }

        function reposition_items(pointOfInterest)
        {
            // Given a distance along the scroll path, reposition the items so that
            // pointOfInterest is the distance along the scroll path

            // Get the distance of each item from the point of interest.
            var currentPositions = [];
            var shortestDistance = scrollPathLength;
            items.each(function(d)
                {
                    // Record the data of the item.
                    var distanceToPoint = d.distAlongPath - pointOfInterest;
                    currentPositions.push({"key": d.key, "distance": distanceToPoint});

                    // Determine if this is the item closest to the point of interest.
                    var effectiveDist = scrollPathLength;
                    if (isShiftRight)
                    {
                        // If the items were being shifted right.
                        effectiveDist = distanceToPoint > 0 ? scrollPathLength : Math.abs(distanceToPoint);
                    }
                    else
                    {
                        // If the items were being shifted left.
                        effectiveDist = distanceToPoint < 0 ? scrollPathLength : Math.abs(distanceToPoint);
                    }
                    if (effectiveDist < shortestDistance)
                    {
                        shortestDistance = effectiveDist;
                    }
                });

            // Move the items into position.
            transition_items(isShiftRight ? shortestDistance : -shortestDistance);
        }

        function determine_neighbours(currentItemKey)
        {
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

            // Determine the position in the item order of the current item and its neighbours.
            var draggedItemIndex = itemKeys.indexOf(currentItemKey);
            var leftNeighbourIndex = draggedItemIndex - 1;
            var rightNeighbourIndex = draggedItemIndex + 1;

            // Determine the neighbour items.
            var neighbours = {}
            if (leftNeighbourIndex >= 0)
            {
                // If the item being dragged is not already the leftmost item.
                neighbours["left"] = items.filter(function(itemD) { return itemD.key === itemPositions[leftNeighbourIndex].key; })
            }
            else neighbours["left"] = null;
            if (rightNeighbourIndex <= itemKeys.length - 1)
            {
                // If the item being dragged is not already the rightmost item.
                neighbours["right"] = items.filter(function(itemD) { return itemD.key === itemPositions[rightNeighbourIndex].key; })
            }
            else neighbours["right"] = null;

            return neighbours;
        }

        function transition_items(distanceToShift)
        {
            // Transition the items from their current positions to their resting positions.
            // distanceToShift is the number of units to shift the items by.

            // Transition items back to their resting locations from wherever they are.
            items
                .transition()
                .duration(Math.abs(distanceToShift) * scrollSpeed)
                .ease("linear")
                .tween("transform", function(d)
                    {
                        d.resting += distanceToShift;
                        var interpolator = d3.interpolate(d.distAlongPath, d.resting);

                        return function(t)
                            {
                                d.distAlongPath = interpolator(t);
                                currentPoint = pathToScrollAlong.node().getPointAtLength(Math.max(0, Math.min(d.distAlongPath, scrollPathLength)));
                                d.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                d.transY = currentPoint.y - (d.height / 2);  // Determine position of the item at this point in the transition.
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                            }
                    });
        }

        function transition_items_swap(itemToSwap)
        {
            // Setup the transition for an item being swapped with a currently dragged item.

            itemToSwap
                .transition()
                .duration(300)
                .ease("linear")
                .tween("transform", function(d)
                    {
                        var interpolator = d3.interpolate(0, d.resting - d.distAlongPath);
                        var lastInterpVal = 0;  // The last value that came out of the interpolater.
                        var currentInterpVal;  // The current value of the interpolater.

                        return function(t)
                            {
                                currentInterpVal = interpolator(t);
                                d.distAlongPath += (currentInterpVal - lastInterpVal);
                                lastInterpVal = currentInterpVal;
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

    // Speed of item scrolling.
    carousel.scrollSpeed = function(_)
    {
        if (!arguments.length) return scrollSpeed;
        scrollSpeed = _;
        return carousel;
    }

    return carousel;
}
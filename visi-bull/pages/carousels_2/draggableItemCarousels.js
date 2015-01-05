function draggableItemCarousel(items)
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
                               // because shorter items will be vertically centered in the carousel, and will therefore have extra space above and below them.
        isArrows = true,  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
        navArrowWidth = null,  // The width of the box around the navigation arrow that intercepts clicks on the navigation arrow.
        navArrowHeight = null,  // The height of the box around the navigation arrow that intercepts clicks on the navigation arrow.
        scrollSpeed = 5,  // The time (in ms) taken for the carousel to scroll one unit. A lower number is faster.
        isInfinite = false;  // Whether the carousel should be a centered and infinite looping one.

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

        // Setup the scroll path. The positioning and length of the path needs to take into account the width of the items.
        // Infinite scrolling carousels need a path with a length equal to the cumulative widths of the items, and is positioned such that the
        // middle of the path is in the middle of the carousel.
        // A non-infinite scrolling carousel needs a path with a length that can accommodate all items to the right of the left edge of the carousel,
        // and still has enough space to hide the widest item outside the carousel's left edge (for hiding items that have been scrolled off the left edge).
        var scrollPathLength;  // The length of the path along which the scrolling will occur.
        if (isInfinite) scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size());
        else scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size()) + d3.max(itemWidths);
        var scrollPathStartY = height / 2;  // The Y location of the start of the scroll path.
        var scrollPathStartX;  // The X location of the start of the scroll path.
        if (isInfinite) scrollPathStartX = (width / 2) - (scrollPathLength / 2);
        else scrollPathStartX = -d3.max(itemWidths);  // Want the path to be able to contain the widest item off screen to the left.

        // Determine the position where the leftmost item in the carousel will start in terms of its X coordinate within the carousel and its
        // fractional distance along the path.
        var leftItemStartX;  // The X location of the leftmost item.
        if (isInfinite) leftItemStartX = (width / 2) - (d3.select(items[0][0]).datum().width / 2);
        else leftItemStartX = horizontalPadding / 2;
        var leftItemStartDist = leftItemStartX - scrollPathStartX;  // The fractional distance along the path of the leftmost item.

        // Determine the center and left/right edges of the carousel in relation to their distance along the scroll path.
        var distOfCenter = (width / 2) - scrollPathStartX;  // The distance of the center of the carousel along the scroll path.
        var carouselLeftEdge = -scrollPathStartX;  // The distance of the left edge of the carousel along the scroll path.
        var carouselRightEdge = carouselLeftEdge + width;  // The distance of the right edge of the carousel along the scroll path.

        // Create the path to scroll along.
        var pathToScrollAlong = itemContainer.append("path")
            .classed("scrollPath", true)
            .attr("d", "M" + scrollPathStartX + "," + scrollPathStartY + "h" + scrollPathLength);

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { itemContainer.node().appendChild(this); });

        // Put the items in their initial places.
        var currentItemDist = leftItemStartDist;  // The distance along the path of the current item.
        var positionAlongPath;  // The coordinates of the point on the path at a distance of currentItemDist along it.
        items.attr("transform", function(d, i)
            {
                // Update the currentItemDist to position the current item.
                if (i !== 0)
                {
                    // If the item is not the first one.
                    currentItemDist += (horizontalPadding / 2);
                }
                currentItemDist = (scrollPathLength + currentItemDist) % scrollPathLength;  // Wrap the item around to the left of the first item if its starting point is off the right end of the path.

                // Get the coordinates of the position currentItemDist along the path.
                positionAlongPath = pathToScrollAlong.node().getPointAtLength(currentItemDist);

                // Update item position data.
                d.resting = currentItemDist;
                d.distAlongPath = d.resting;
                d.transX = positionAlongPath.x;
                d.transY = positionAlongPath.y - (d.height / 2);

                // Set the currentItemDist to the right edge of the current item.
                currentItemDist += (d.width + (horizontalPadding / 2));

                return "translate(" + d.transX + "," + d.transY + ")";
            });

        // Clip the items to the carousel.
        items.append("clipPath")
            .classed("carouselClip", true)
            .attr("id", function(d) { return d.rootID + "clip-" + d.key; })
            .append("path")
                .classed("carouselClipPath", true)
                .attr("clip-rule", "evenodd")
                .attr("d", "");
        generate_clip_paths();
        items.attr("clip-path", function(d) { return "url(#" + (d.rootID + "clip-" + d.key) + ")"; });

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
            if (navArrowHeight === null) navArrowHeight = height / 2;
            if (navArrowWidth === null) navArrowWidth = navArrowHeight;

            var navArrowOffset = 10;  // The offset of each navigation arrow from its respective edge of the carousel.

            // Create the left navigation arrow.
            // The left arrow is inactive at the start if infinite scrolling is not used.
            var leftNavArrowContainer = carousel.append("g")
                .classed({"navArrow": true, "left": true, "inactive": (isInfinite ? false : true)})
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

            // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
            carousel
                .on("mouseover", function() { leftNavArrowContainer.classed("visible", true); rightNavArrowContainer.classed("visible", true); })
                .on("mouseout", function() { leftNavArrowContainer.classed("visible", false); rightNavArrowContainer.classed("visible", false); });
        }

        // Add the navigation arrow behaviour.
        var navigationArrows = carousel.selectAll(".navArrow")
            .on("mousedown", function() { var isLeft = d3.select(this).classed("left"); start_scrollng(isLeft, []); })
            .on("mouseup", stop_scrolling)
            .on("mouseleave", leave_stop_scrolling)
            .on("dblclick", scroll_doubletap);

        /*************************************
        * Individual Item Dragging Functions *
        *************************************/
        var draggedItem = null;  // The item that is being dragged.
        var dragStartXPos;  // The X coordinate within the item that the user clicked in order to drag.
        var neighbours;  // The items to the left and right of the item being dragged.
        function drag_end()
        {
            // Handler for dragend events.

            // Determine whether either of the navigation arrows should have their inactivity changed.
            var itemPositions = items.data().map(function(d) { return {"pos": d.resting, "width": d.width}; });
            var maxRightEdge = d3.max(itemPositions.map(function(d) { return d.pos + d.width; }));
            var minLeftEdge = d3.min(itemPositions.map(function(d) { return d.pos; }));
            carousel.select(".navArrow.right").classed("inactive", maxRightEdge <= carouselRightEdge);
            carousel.select(".navArrow.left").classed("inactive", minLeftEdge >= carouselLeftEdge);

            // Add back the highlighting for the navigation arrows.
            navigationArrows
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })

            // Transition dragged item to its resting place. This is done by pushing the item in a certain direction on each tick of the
            // transition (rather than the usual method of transitioning from one absolute position to another). This way if the carousel
            // is shifted during the transition, the item will still transition properly, just to a slightly different location than
            // was expected when it was released.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;
            draggedItem
                .transition()
                .duration(200)
                .ease("cubic-out")
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
                                generate_clip_paths();
                            }
                    });

            // Add back the behaviour of the navigation arrows.
            navigationArrows = carousel.selectAll(".navArrow")
                .on("mouseup", stop_scrolling)
                .on("mouseleave", leave_stop_scrolling);

            // Remove the record of the item's neighbours.
            draggedItem = null;
            neighbours = null;
        }

        function drag_start(d)
        {
            // Handler for dragstart events.

            // Record information about the drag.
            draggedItem = d3.select(this);
            dragStartXPos = d3.mouse(this)[0];

            // Kill any transitions that the dragged item is undergoing or is scheduled to undergo.
            draggedItem
                .interrupt() // Cancel any transitions running on this item.
                .transition(); // Pre-empt any scheduled transitions on this item.

            // Remove and add the item back on top. This ensures that the dragged item will be on top of all others.
            draggedItem.remove();
            itemContainer.append(function() { return draggedItem.node(); });

            // Remove the highlighting of the navigation arrows.
            navigationArrows
                .on("mouseover", null)
                .on("mouseout", null);

            // Remove the behaviour of the navigation arrows that may be triggered at the end of a drag.
            navigationArrows = carousel.selectAll(".navArrow")
                .on("mouseup", null)
                .on("mouseleave", null);

            // Determine the left and right neighbours of the item being dragged.
            neighbours = determine_neighbours(d.key);
        }

        function drag_update(d)
        {
            // Handler for drag events.

            var positionInCarousel = d3.mouse(this.parentNode)[0];  // The position of the mouse in the carousel.

            // Move the item.
            d.distAlongPath = carouselLeftEdge + positionInCarousel - dragStartXPos;
            d.distAlongPath = Math.max(carouselLeftEdge - dragStartXPos, Math.min(carouselRightEdge - dragStartXPos, d.distAlongPath));
            var positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
            d.transX = positionAlongPath.x;
            draggedItem
                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });

            // Determine whether to swap any of the items.
            check_item_swap();

            // Update the clip paths.
            generate_clip_paths();

            // Determine whether to scroll the carousel.
            if (positionInCarousel < 0)
            {
                // If the user is dragging the item to the left, and the item is at the left edge, then start scrolling the items to the right.
                start_scrollng(true, [d.key]);
            }
            else if (positionInCarousel > width)
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
            // Handler for the mouseleave event on the navigation arrow.
            if (scrollIntervalTimer !== null) stop_scrolling();
        }

        function scroll_carousel(itemsToNotScroll)
        {
            // Scroll non-infinite carousels.
            // itemsToNotScroll is an array of the keys of the items that should not be moved.

            // Determine number of items left of the carousel's left edge, and right of the carousel's right edge.
            var countTrue = function(a) { var counter = 0; for (var i = 0; i < a.length; i++) if (a[i]) counter++; return counter; }
            var leftOfLeft = items.data().map(function(d) { return d.resting < carouselLeftEdge + (horizontalPadding / 2); });
            var numLeftOfLeft = countTrue(leftOfLeft);
            var rightOfRight = items.data().map(function(d) { return d.resting > carouselRightEdge - d.width - (horizontalPadding / 2); });
            var numRightOfRight = countTrue(rightOfRight);

            // Determine if scrolling should take place. Scrolling should only take place if there are still items to the left of the
            // carousel's left edge or the right of the carousel's right edge.
            var isScrollItems = (isShiftRight && (numLeftOfLeft > 0)) || (!isShiftRight && (numRightOfRight > 0));

            // Scroll the items if they should be scrolled.
            if (isScrollItems)
            {
                var currentPoint;
                items.each(function(d)
                    {
                        d.resting += (isShiftRight ? 1 : -1);
                        if (itemsToNotScroll.indexOf(d.key) === -1)
                        {
                            // If the item is to be scrolled.
                            d.distAlongPath += (isShiftRight ? 1 : -1);
                            currentPoint = pathToScrollAlong.node().getPointAtLength(Math.max(0, Math.min(d.distAlongPath, scrollPathLength)));
                            d.transX = currentPoint.x;
                            d3.select(this)
                                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                        }
                        generate_clip_paths();
                    });

                // Determine whether to swap any of the items. Only bother checking if dragging is occurring.
                if (draggedItem !== null) check_item_swap();
            }
        }

        function scroll_carousel_infinite(itemsToNotScroll)
        {
            // Scroll infinite carousels.
            // itemsToNotScroll is an array of the keys of the items that should not be moved.

            var currentPoint;
            items.each(function(d)
                {
                    d.resting += (isShiftRight ? 1 : -1);
                    d.resting = (scrollPathLength + d.resting) % scrollPathLength;
                    if (itemsToNotScroll.indexOf(d.key) === -1)
                    {
                        // If the item is one that should be be scrolled.
                        d.distAlongPath += (isShiftRight ? 1 : -1);
                        d.distAlongPath = (scrollPathLength + d.distAlongPath) % scrollPathLength;
                        currentPoint = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                        d.transX = currentPoint.x;
                        d3.select(this)
                            .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                    }
                    generate_clip_paths();
                });

            // Determine whether to swap any of the items. Only bother checking if dragging is occurring.
            if (draggedItem !== null) check_item_swap();
        }

        function scroll_doubletap()
        {
            // Scroll the items after a double tap.

            // Stop the timer used to scroll the carousel.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;

            // Move the items into their new resting positions.
            var offset = isShiftRight ? -width : width;
            reposition_items(offset, scrollSpeed / 3);
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

                if (isInfinite)
                {
                    // Move the items once.
                    scroll_carousel_infinite(itemsToNotScroll);

                    // Setup the timer to scroll the carousel.
                    scrollIntervalTimer = setInterval(function() { scroll_carousel_infinite(itemsToNotScroll); }, scrollSpeed);
                }
                else
                {
                    // Move the items once.
                    scroll_carousel(itemsToNotScroll);

                    // Setup the timer to scroll the carousel.
                    scrollIntervalTimer = setInterval(function() { scroll_carousel(itemsToNotScroll); }, scrollSpeed);
                }
            }
        }

        function stop_scrolling()
        {
            // Stop the scrolling.

            // Stop the timer used to scroll the carousel.
            clearInterval(scrollIntervalTimer);
            scrollIntervalTimer = null;

            // Move the items into their new resting positions.
            reposition_items(0, scrollSpeed);
        }

        /*******************
        * Helper Functions *
        *******************/
        function check_item_swap()
        {
            // Determine whether to swap any of the items.

            // Determine the data of the dragged item.
            var draggedData = draggedItem.datum();

            // Determine if the left neighbour should be swapped.
            if (neighbours.left !== null)
            {
                // If there is a left neighbour.
                var leftNeighbourData = neighbours.left.datum();
                if ((leftNeighbourData.resting + (leftNeighbourData.width / 2)) >= draggedData.distAlongPath)
                {
                    draggedData.resting = leftNeighbourData.resting;
                    leftNeighbourData.resting = draggedData.resting + draggedData.width + horizontalPadding;
                    transition_items_swap(neighbours.left);

                    // Determine the new neighbours of the item being dragged.
                    neighbours = determine_neighbours(draggedData.key);
                }
            }
            else if (isInfinite)
            {
                // If there is no left neighbour, but infinite scrolling is being used, then check if the left neighbour has wrapped around the carousel
                // and is now on the left hand side of the carousel.
                neighbours = determine_neighbours(draggedData.key);
            }

            // Determine if the right neighbour should be swapped.
            if (neighbours.right !== null)
            {
                // If there is a right neighbour.
                var rightNeighbourData = neighbours.right.datum();
                if ((rightNeighbourData.resting + (rightNeighbourData.width / 2)) <= (draggedData.distAlongPath + draggedData.width))
                {
                    rightNeighbourData.resting = draggedData.resting;
                    draggedData.resting = rightNeighbourData.resting + rightNeighbourData.width + horizontalPadding;
                    transition_items_swap(neighbours.right);

                    // Determine the new neighbours of the item being dragged.
                    neighbours = determine_neighbours(draggedData.key);
                }
            }
            else if (isInfinite)
            {
                // If there is no right neighbour, but infinite scrolling is being used, then check if the right neighbour has wrapped around the carousel
                // and is now on the right hand side of the carousel.
                neighbours = determine_neighbours(draggedData.key);
            }
        }

        function determine_neighbours(currentItemKey)
        {
            // Determine the items immediately to the left and right of the item being dragged.
            // currentItemKey is the key of the item being dragged.

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

            // Determine the position in the item order of the dragged item and its neighbours.
            var draggedItemIndex = itemKeys.indexOf(currentItemKey);
            var leftNeighbourIndex = draggedItemIndex - 1;
            var rightNeighbourIndex = draggedItemIndex + 1;

            // Determine the neighbour items.
            var neighbours = {};
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

        function generate_clip_paths()
        {
            // Generate the clip paths for all items to ensure that only the portion of the item inside the carousel is visible.

            var clippingPath;
            items.each(function(d)
                {
                    clippingPath =
                        "M" + -d.transX + "," + -d.transY +
                        "h" + width +
                        "v" + height +
                        "h" + -width +
                        "v" + -height;

                    d3.select(this).select(".carouselClipPath")
                        .attr("d", clippingPath);
                });
        }

        function reposition_items(offset, scrollSpeed)
        {
            // Update the positions of the items.
            // offset is the distance by which the items should be shifted.
            // scrollSpeed is the time (in ms) that it should take to move the items by one pixel.

            // Get the distance of each item from the point of interest. The point of interest is the point on the scroll path that the carousel
            // should be rotated to focus on. Conceptually, the items are held in place, and the carousel rotated to focus on a new set of items.
            // For an infinitely scrolled carousel, the point of interest is offset away from the center of the carousel.
            // For a non-infinitely scrolled carousel, the point of interest is offset away from (carouselLeftEdge + (horizontalPadding / 2)).
            var pointOfInterest;
            var currentPositions = [];  // A record of the distance from each item to the point of interest.
            var shortestDistance = scrollPathLength;  // The distance between the item closest to the point of interest and the point.
            var calcDistanceToPoint;  // The function used to calculate the distance that an item is from the point of interest.
            if (isInfinite)
            {
                pointOfInterest = distOfCenter + offset;
                pointOfInterest = (scrollPathLength + pointOfInterest) % scrollPathLength;
                calcDistanceToPoint = function(dist, width) { return dist + (width / 2) - pointOfInterest; }
            }
            else
            {
                pointOfInterest = leftItemStartDist + offset;
                calcDistanceToPoint = function(dist) { return dist - pointOfInterest; }
            }
            items.each(function(d)
                {
                    // Record the data of the item.
                    var distanceToPoint = calcDistanceToPoint(d.distAlongPath, d.width);
                    currentPositions.push({"key": d.key, "distance": distanceToPoint});

                    // Determine if this is the item closest to the point of interest.
                    var effectiveDist;
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

            // Determine the distance to be shifted, and set the new resting positions of the items.
            var distanceToShift = (isShiftRight ? shortestDistance : -shortestDistance) + -offset;
            if (isInfinite)
            {
                items.each(function(d)
                    {
                        d.resting = d.distAlongPath + distanceToShift;
                        d.resting = (scrollPathLength + d.resting) % scrollPathLength;
                    });
                distanceToShift = Math.abs(distanceToShift);
            }
            else
            {
                // Determine the max distance left and right that the items can be shifted.
                var distances = items.data().map(function(d) { return d.distAlongPath; });
                var maxDistLeft = d3.min(items.data().map(function(d) { return d.distAlongPath; })) - leftItemStartDist;
                var maxDistRight = d3.max(items.data().map(function(d) { return d.distAlongPath + d.width + (horizontalPadding / 2); })) - carouselRightEdge;
                distanceToShift = Math.max(-maxDistRight, Math.min(-maxDistLeft, distanceToShift));
                items.each(function(d)
                    {
                        d.resting = d.distAlongPath + distanceToShift;
                    });
            }

            // Move the items into position.
            if (isInfinite) transition_items_infinite(distanceToShift, scrollSpeed);
            else transition_items(distanceToShift, scrollSpeed);
        }

        function transition_items(distanceToShift, scrollSpeed)
        {
            // Transition the items in a non-infinite carousel from their current positions to their resting positions.
            // distanceToShift is the number of units to shift the items by.
            // scrollSpeed is the time (in ms) that it should take to move the items by one pixel.

            // Determine whether either of the navigation arrows should have their inactivity changed.
            var itemPositions = items.data().map(function(d) { return {"pos": d.resting, "width": d.width}; });
            var maxRightEdge = d3.max(itemPositions.map(function(d) { return d.pos + d.width; }));
            var minLeftEdge = d3.min(itemPositions.map(function(d) { return d.pos; }));
            carousel.select(".navArrow.right").classed("inactive", maxRightEdge <= carouselRightEdge);
            carousel.select(".navArrow.left").classed("inactive", minLeftEdge >= carouselLeftEdge);

            // Transition items back to their resting locations from wherever they are.
            items
                .transition()
                .duration(Math.abs(distanceToShift) * scrollSpeed)
                .ease("linear")
                .tween("transform", function(d)
                    {
                        var interpolator = d3.interpolate(d.distAlongPath, d.resting);

                        return function(t)
                            {
                                d.distAlongPath = interpolator(t);
                                currentPoint = pathToScrollAlong.node().getPointAtLength(Math.max(0, Math.min(d.distAlongPath, scrollPathLength)));
                                d.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                                generate_clip_paths();
                            }
                    });
        }

        function transition_items_infinite(distanceToShift, scrollSpeed)
        {
            // Transition the items in an infinite carousel from their current positions to their resting positions.
            // distanceToShift is the number of units to shift the items by.
            // scrollSpeed is the time (in ms) that it should take to move the items by one pixel.

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
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                                generate_clip_paths();
                            }
                    });
        }

        function transition_items_swap(itemToSwap)
        {
            // Setup the transition for an item being swapped with a currently dragged item.
            // itemToSwap is a D3 selection containing the item that is to be swapped with the dragged item.

            itemToSwap
                .transition()
                .duration(200)
                .ease("cubic-out")
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
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                                generate_clip_paths();
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

    // Infinite scrolling.
    carousel.isInfinite = function(_)
    {
        if (!arguments.length) return isInfinite;
        isInfinite = _;
        return carousel;
    }

    return carousel;
}
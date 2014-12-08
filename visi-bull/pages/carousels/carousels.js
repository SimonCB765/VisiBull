function carouselCreator(items)
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var width = null,  // The width of the carousel.
        height = null,  // The height of the carousel.
        xLoc = 0,  // The X coordinate within its container of the top right corner of the carousel.
        yLoc = 0,  // The Y coordinate within its container of the top right corner of the carousel.
        items = items,  // The items to put in the carousel.
        itemsToShow = 2,  // The number of items to show in the carousel. Can't be less than 1.
        itemsToScrollBy = 2,  // The number of items to scroll by in the carousel. Can't be less than 1.
        horizontalPadding = 10,  // The amount of padding to put on the left and right of the item. Half the padding goes on the left and half on the right.
        verticalPadding = 10,  // The amount of padding to put above and below the item. Half the padding goes above and half below.
                               // Shorter items may appear to have more space around them than the value of verticalPadding says they should. This is
                               // because shorter items will be centered in the carousel, and will therefore have extra space above and below them.
        isInfinite = false,  // Whether the scrolling should be an infinite loop.
        isCentered = false,  // Whether the displayed items should be centered.
        isDots = false,  // Whether to display dots below the items to indicate where you are in the carousel.
        isArrows = true,  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
        dotContainerHeight = 20,  // The height of the g element containing the navigation dots. Should be at least twice the dotRadius.
        itemSnapSpeed = 300,  // The duration that the items take when snapping back into place.
        scrollPath = "flat",  // The path along which the items will be scrolled. "flat" corresponds to the default straight line.
                              // Straight line paths can use infinite or non-infinite scrolling.
                              // Alternatively, a custom path can be provided.
        customScrollFraction = 0,  // The fractional [0,1] distance along the path at which to place the first item. Only works with custom paths.
        navArrowWidth = null,  // The width of the navigation arrow.
        navArrowHeight = null,  // The height of the navigation arrow.
        navDotRadius = 5  // The radius of the navigation dots.
        ;

    /*****************************
    * Carousel Creation Function *
    *****************************/
    function carousel(selection)
    {
        // The selection passed in must contain only one element.
        if (selection.size() !== 1) { console.log("Selection to create carousel in must contain only one element."); return; }

        // If a custom path has been provided, then the width and height must also be provided.
        if (((width === null) || (height === null)) && scrollPath !== "flat") { console.log("The width and height must be set manually with custom paths."); return; }

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

        // Determine the necessary height and width of the carousel. If they're not specified, then they are set dynamically to fit the
        // items in carousel. The height will be set to the value that accommodates the tallest item, while the width will be set in order to
        // accommodate the itemsToShow widest adjacent items (taking into account width and horizontal padding).
        if (width === null)
        {
            // The width was not pre-specified, so set it dynamically.
            var maxWidthWindow = 0;
            for (var i = 0; i < itemWidths.length - (itemsToShow - 1); i++)
            {
                maxWidthWindow = Math.max(maxWidthWindow, d3.sum(itemWidths.slice(i, i + itemsToShow)) + (itemsToShow * horizontalPadding));
            }
            width = maxWidthWindow;
        }
        if (height === null)
        {
            // The width was not pre-specified, so set it dynamically.
            height = maxItemHeight + (isDots ? dotContainerHeight : 0);
        }

        // Create the backing rectangle to catch events. Create it before transferring the items in order to ensure it is below them.
        itemContainer.append("rect")
            .classed("backingRect", true)
            .attr("width", width)
            .attr("height", height);

        // Determine the visible sets of items.
        var visibleItemSets = determine_visible_item_sets();
        var currentVisibleSetIndex = 0;  // The index of the visible set currently in view.

        // Determine starting location of the leftmost item.
        var leftViewItemStartX = 0;  // The X location of the leftmost item in the view.
        if (isCentered)
        {
            var numberOfItemsLeftOfCenter = itemsToShow / 2;  // Fraction of the items to the left of the mid point.
            leftViewItemStartX = width / 2;  // The offset for the current item.
            if (itemsToShow === 1)
            {
                // Only have one centered item.
                leftViewItemStartX -= (itemWidths[0] / 2);
            }
            else
            {
                // Multiple itemsToShow.
                leftViewItemStartX -= (itemWidths[0] + (horizontalPadding / 2));
                for (var i = 1; i < Math.floor(numberOfItemsLeftOfCenter); i++)
                {
                    leftViewItemStartX -= (itemWidths[i] + horizontalPadding);
                }
                if (parseInt(numberOfItemsLeftOfCenter) !== numberOfItemsLeftOfCenter)
                {
                    // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center).
                    var itemStraddlingMidPoint = Math.floor(numberOfItemsLeftOfCenter);
                    leftViewItemStartX -= ((itemWidths[itemStraddlingMidPoint] + horizontalPadding) / 2);
                }
            }
        }
        else
        {
            leftViewItemStartX = (horizontalPadding / 2);
        }

        // Setup the scroll path.
        var pathToScrollAlong = itemContainer.append("path").classed("scrollPath", true);
        var leftViewItemStartDist = 0;  // The location of the leftmost item in the view in terms of its fractional distance along the path.
        var scrollPathStartX;  // The X location of the start of the scroll path.
        var scrollPathStartY = (height - (isDots ? dotContainerHeight : 0)) / 2;  // The Y location of the start of the scroll path.
        var scrollPathLength;  // The length of the path along which the scrolling will occur.
        if (scrollPath === "flat")
        {
            if (isInfinite)
            {
                // Determine the length of the path to scroll along.
                scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size());

                // Determine the starting point of the path to scroll along.
                scrollPathStartX = (width + 10) - scrollPathLength;  // Want the path to end at width + 10.

                // Determine the starting point of the leftmost item in the view in terms of its distance along the path.
                leftViewItemStartDist = leftViewItemStartX - scrollPathStartX;
            }
            else
            {
                // Determine the length of the path to scroll along.
                scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size());
                scrollPathLength *= 2;

                // Determine the starting point of the path to scroll along.
                scrollPathStartX = leftViewItemStartX - (scrollPathLength / 2);

                // Determine the starting point of the leftmost item in the view in terms of its distance along the path.
                leftViewItemStartDist = (scrollPathLength / 2);
            }

            // Create the path to scroll along.
            pathToScrollAlong.attr("d", "M" + scrollPathStartX + "," + scrollPathStartY + "h" + scrollPathLength);
        }
        else
        {
            // Using a custom path. The leftmost item in the view starts at the origin of the path.
            pathToScrollAlong.attr("d", scrollPath);
            scrollPathLength = pathToScrollAlong.node().getTotalLength();
            leftViewItemStartDist = customScrollFraction * scrollPathLength;
        }

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { itemContainer.node().appendChild(this); });

        // Put the items in the initial places.
        var currentItemDist = leftViewItemStartDist;  // Distance along the path of the current item.
        var positionAlongPath;  // The position of the point on the path at a distance of currentItemDist along it.
        if (scrollPath === "flat")
        {
            // Place the items along a flat scrolling path.
            items.attr("transform", function(d, i)
                {
                    // Update the currentItemDist to position the current item.
                    if (i !== 0)
                    {
                        // If the item is not the first one.
                        currentItemDist += (horizontalPadding / 2);
                    }
                    currentItemDist = (scrollPathLength + currentItemDist) % scrollPathLength;  // Wrap the item's position around to the left of the items in view if necessary.

                    // Get the coordinates of the position currentItemDist along the path.
                    positionAlongPath = pathToScrollAlong.node().getPointAtLength(currentItemDist);

                    // Update item position.
                    d.distAlongPath = currentItemDist;  // Add an attribute to the item's data recording the distance along the path it currently is.
                    d.resting = currentItemDist;  // Add an attribute recording the distance along the path where the item should come to rest.
                    d.transX = positionAlongPath.x;
                    d.transY = positionAlongPath.y - (d.height / 2);

                    // Set position for next item.
                    currentItemDist += (d.width + (horizontalPadding / 2));

                    return "translate(" + d.transX + "," + d.transY + ")";
                });
        }
        else
        {
            // Place the items evenly along some path.
            var distanceBetweenItems = scrollPathLength / items.size();
            items.attr("transform", function(d, i)
                {
                    // Update the currentItemDist to position the current item.
                    if (i !== 0)
                    {
                        // If the item is not the first one.
                        currentItemDist += distanceBetweenItems;
                    }
                    else
                    {
                        // If the item is the first one.
                        currentItemDist -= (d.width / 2);
                    }
                    currentItemDist = (scrollPathLength + currentItemDist) % scrollPathLength;  // Wrap the item's position around to the left of the items in view if necessary.

                    // Get the coordinates of the position currentItemDist along the path.
                    positionAlongPath = pathToScrollAlong.node().getPointAtLength(currentItemDist);

                    // Update item position.
                    d.distAlongPath = currentItemDist;  // Add an attribute to the item's data recording the distance along the path it currently is.
                    d.resting = currentItemDist;  // Add an attribute recording the distance along the path where the item should come to rest.
                    d.transX = positionAlongPath.x;
                    d.transY = positionAlongPath.y - (d.height / 2);

                    return "translate(" + d.transX + "," + d.transY + ")";
                });
        }

/*
        // Clip the items to the carousel.
        items.append("clipPath")
            .classed("carouselClip", true)
            .attr("id", function(d) { return d.rootID + "clip-" + d.key; })
            .append("rect")
                .classed("carouselClipRect", true)
                .attr("x", function(d) { return -d.transX; })
                .attr("y", function(d) { return -d.transY; })
                .attr("width", width)
                .attr("height", height);
        items.attr("clip-path", function(d) { return "url(#" + (d.rootID + "clip-" + d.key) + ")"; });
*/

        // Add drag behaviour.
        var dragBehaviour = d3.behavior.drag()
            .origin(function(d) { return {"x": d3.event.x - xLoc, "y": d3.event.y - yLoc}; })  // Set the origin of the drag to be the top left of the carousel container.
            .on("dragstart", drag_start)
            .on("dragend", drag_end);
        if (isInfinite)
        {
            dragBehaviour.on("drag", drag_update_infinite);
        }
        else
        {
            dragBehaviour.on("drag", drag_update_standard);
        }
        itemContainer.call(dragBehaviour);

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
                .classed({"navArrow": true, "left": true, "inactive": (isInfinite ? false : true)})
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })
                .attr("transform", "translate(" + navArrowOffset + "," + (((height - (isDots ? dotContainerHeight : 0)) / 2) - (navArrowHeight / 2)) + ")");
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
                .attr("transform", "translate(" + (width - navArrowWidth - navArrowOffset) + "," + (((height - (isDots ? dotContainerHeight : 0)) / 2) - (navArrowHeight / 2)) + ")");
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
        var navigationArrows = carousel.selectAll(".navArrow").on("click", scroll_carousel_arrow);;

        // Create the navigation dots.
        if (isDots)
        {
            // Determine the positions of the dots.
            var numberOfDotsLeftOfCenter = visibleItemSets.length / 2;  // Fraction of the dots to the left of the carousel mid point.
            var leftDotLoc = width / 2;  // The X location for the leftmost dot.
            for (var i = 0; i < Math.floor(numberOfDotsLeftOfCenter); i++)
            {
                leftDotLoc -= (4 * navDotRadius);
            }
            if (parseInt(numberOfDotsLeftOfCenter) !== numberOfDotsLeftOfCenter)
            {
                // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center).
                leftDotLoc -= (2 * navDotRadius);
            }
            var dotPositions = [];
            var currentDotXLoc = leftDotLoc;
            for (var i = 0; i < visibleItemSets.length; i++)
            {
                currentDotXLoc += navDotRadius;
                dotPositions.push({"key": i, "transX": currentDotXLoc, "transY": (dotContainerHeight / 2) - navDotRadius});
                currentDotXLoc += (3 * navDotRadius);
            }

            // Add the dots.
            var dotContainer = carousel.append("g")
                .datum({"transX": 0, "transY": height - dotContainerHeight})
                .classed("navDotContainer", true)
                .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
            dotContainer.append("rect")
                    .attr("width", width)
                    .attr("height", dotContainerHeight);
            var navDots = dotContainer.selectAll(".navDot")
                .data(dotPositions)
                .enter()
                .append("g")
                    .attr("class", function(d, i) { return "navDot" + (i === 0 ? " selected" : ""); })  // The first navigation dot is selected.
                    .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
                    .on("click", scroll_carousel_dot);
            navDots.append("rect")
                .attr("x", -navDotRadius / 2)
                .attr("y", -navDotRadius / 2)
                .attr("width", (3 * navDotRadius))
                .attr("height", (3 * navDotRadius));
            navDots.append("circle")
                .attr("cx", navDotRadius)
                .attr("cy", navDotRadius)
                .attr("r", navDotRadius);
        }

        // Add the mouseover effects to the carousel.
        // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
        carousel
            .on("mouseover", function() { leftNavArrowContainer.classed("visible", true); rightNavArrowContainer.classed("visible", true); })
            .on("mouseout", function() { leftNavArrowContainer.classed("visible", false); rightNavArrowContainer.classed("visible", false); });

        /**************************
        * Item Dragging Functions *
        **************************/
        function drag_end(d)
        {
            // Search through all sets of items to find the one with the leftmost item that is closest to the starting item locaton.
            var currentShortestDistance = width;
            var closestSetIndex = 0;
            for (var i = 0; i < visibleItemSets.length; i++)
            {
                var leftmostItem = items.filter(function(d) { return d.key == visibleItemSets[i][0]; });
                var leftmostDist = Math.abs(leftViewItemStartDist - leftmostItem.datum().distAlongPath);
                if (leftmostDist < currentShortestDistance)
                {
                    currentShortestDistance = leftmostDist;
                    closestSetIndex = i;
                }
            }

            // Scroll the carousel.
            scroll_carousel(closestSetIndex);

            // Add back the highlighting for the navigation arrows.
            navigationArrows
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })
        }

        function drag_start()
        {
            items
                .interrupt() // Cancel any transitions running on the items.
                .transition(); // Pre-empt any scheduled transitions on the items.

            // Remove the highlighting of the navigation arrows.
            navigationArrows
                .on("mouseover", null)
                .on("mouseout", null)
        }

        function drag_update_infinite(d)
        {
            // Drag items that scroll infinitely.
            var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

            // Get the items in the carousel.
            var items = d3.select(this).selectAll(".item");

            // Update the position of the items.
            items
                .attr("transform", function(d)
                    {
                        // The items are able to rotate infinitely around a non-infinite path (made to look infinite by being a closed loop) by
                        // mapping any distance that goes beyond tge end of the path back to the start, and vice versa for an item that goes beyond
                        // the start of the path.

                        d.distAlongPath += changeInPosition;
                        d.distAlongPath = (scrollPathLength + d.distAlongPath) % scrollPathLength;
                        var positionAlongPath = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                        d.transX = positionAlongPath.x;
                        d.transY = positionAlongPath.y - (d.height / 2);
                        return "translate(" + d.transX + "," + d.transY + ")";
                    });
/*
            // Update the positions of the items clip paths.
            items.selectAll(".carouselClipRect")
                .attr("x", function(d) { return -d.transX; });
*/
        }

        function drag_update_standard(d)
        {
            // Drag items that do not scroll infinitely.
            var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

            // Get the items in the carousel.
            var items = d3.select(this).selectAll(".item");

            // Update the position of the items.
            items
                .attr("transform", function(d)
                    {
                        // The items need to be able to be dragged as far offscreen as is desired, but to be able to snap back into the correct
                        // positions once released. When the distance along the path is negative, the transformed location must be stuck at 0.
                        // This is because the getPointAtLength point of a position that is a -ve distance along a path, is treated as its absolute
                        // distance along the path (e.g. getPointAtLength(10) === getPointAtLength(-10)). As the user can scroll the items so far to
                        // the left that their distance along the path becomes negative (as there is no limit on how far left the items can be scrolled
                        // they will go off the path and get a -ve distance), the transformation is treated as 0 distance along the path whenever the
                        // distance is -ve. See the demos at http://visi-bull.appspot.com/carousels for pictographic demos.

                        d.distAlongPath += changeInPosition;
                        var positionAlongPath = pathToScrollAlong.node().getPointAtLength(Math.max(0, d.distAlongPath));
                        d.transX = positionAlongPath.x;
                        return "translate(" + d.transX + "," + d.transY + ")";
                    });
/*
            // Update the positions of the items clip paths.
            items.selectAll(".carouselClipRect")
                .attr("x", function(d) { return -d.transX; });
*/
        }

        /***************************
        * Item Scrolling Functions *
        ***************************/
        function scroll_carousel(newVisibleSetIndex)
        {
            // Scroll the carousel to display a new set of items.
            // newVisibleSetIndex is the index of the new set of visible items to display.

            // Inactivate and activate the navigation arrows as needed.
            if (!isInfinite)
            {
                carousel.select(".navArrow.right")
                    .classed("inactive", newVisibleSetIndex + 1 === visibleItemSets.length);
                carousel.select(".navArrow.left")
                    .classed("inactive", newVisibleSetIndex === 0);
            }

            // Highlight the clicked on dot.
            if (isDots)
            {
                // Must use selectAll here not select (even though there will only ever be one selected dot) as selection.select
                // is a non-grouping operator and so will cause the child to inherit the data of the parent. I don't want this as the child has its own
                // unrelated data.
                var navDots = dotContainer.selectAll(".navDot").classed("selected", false);
                navDots.each(function(d)
                    {
                        if (d.key === newVisibleSetIndex)
                        {
                            d3.select(this).classed("selected", true);
                        }
                    });
            }

            // Get the current resting positions of all items.
            var restingPositions = [];
            items.each(function(d) { restingPositions.push({"key": d.key, "resting": d.resting}); });

            // Sort the items by their position on the path.
            restingPositions.sort(function (a, b)
                {
                    if (a.resting > b.resting) { return 1; }
                    else if (a.resting < b.resting) { return -1; }
                    else { return 0; }
                });

            // Separate the keys and positions.
            var itemKeys = {};
            var itemPositions = [];
            for (var i = 0; i < restingPositions.length; i++)
            {
                itemKeys[restingPositions[i].key] = i;
                itemPositions.push(restingPositions[i].resting);
            }

            // Determine whether getting to the new visible set by going left or right covers a shorter distance.
            var isCurrentIndexGreater = currentVisibleSetIndex > newVisibleSetIndex;
            var distanceGoingLeft = (isCurrentIndexGreater) ? currentVisibleSetIndex - newVisibleSetIndex : currentVisibleSetIndex + (visibleItemSets.length - newVisibleSetIndex) ;
            var distanceGoingRight = (isCurrentIndexGreater) ? (visibleItemSets.length - currentVisibleSetIndex) + newVisibleSetIndex : newVisibleSetIndex - currentVisibleSetIndex;
            var isLeft;

            // Determine the new positions of the items.
            var numberItemsToScrollBy;
            if (currentVisibleSetIndex === newVisibleSetIndex)
            {
                // Catches events where a drag that didn't move the items far enough to switch to a new visible item set ends.
                // No change in resting positions is needed.
            }
            else if (isInfinite)
            {
                // Infinite scrolling is used.

                // Determine whether we are scrolling left.
                isLeft = distanceGoingLeft < distanceGoingRight ? true : false;

                // Determine the number of items to scroll by.
                numberItemsToScrollBy = itemsToScrollBy * Math.min(distanceGoingLeft, distanceGoingRight);

                // Determine the new positions for the items.
                if (isLeft)
                {
                    // The new index is to the left of the current index, so the carousel is being scrolled left, and the items
                    // should therefore move to the right. A positive value for rotate_array will move rotate the values in the array
                    // to the left, and will therefore rotate the array of resting positions in such a way that the items will
                    // scroll to the right.
                    itemPositions = rotate_array(itemPositions, numberItemsToScrollBy);
                }
                else
                {
                    // The new index is to the right of the current index, so the carousel is being scrolled right, and the items
                    // should therefore move to the left. A negative value for rotate_array will move rotate the values in the array
                    // to the right, and will therefore rotate the array of resting positions in such a way that the items will
                    // scroll to the left.
                    itemPositions = rotate_array(itemPositions, -numberItemsToScrollBy);
                }
            }
            else
            {
                // Non-infinite scrolling is used.

                // Determine the leftmost item in the current and new visible set of items.
                var currentLeftmost = visibleItemSets[currentVisibleSetIndex][0];
                var newLeftmost = visibleItemSets[newVisibleSetIndex][0];
                var currentLeftmostResting;  // The resting position for the item that currently is the leftmost item in view.
                var newLeftmostResting;  // The resting position for the item that will become the leftmost item in view.
                items.each(function(d)
                    {
                        if (d.key === newLeftmost)
                        {
                            newLeftmostResting = d.resting;
                        }
                        else if (d.key === currentLeftmost)
                        {
                            currentLeftmostResting = d.resting;
                        }
                    });

                // Determine the distance to scroll.
                var distanceToScroll = currentLeftmostResting - newLeftmostResting;

                // Determine the direction we are scrolling. Scrolling left if the current visible set index is greater than the new one.
                isLeft = distanceToScroll > 0;

                // Add the distance to scroll to all resting positions.
                for (var i = 0; i < itemPositions.length; i++)
                {
                    itemPositions[i] += distanceToScroll;
                }
            }

            // Update the positions of the items.
            items.each(function(d)
                {
                    var itemIndex = itemKeys[d.key];
                    d.resting = itemPositions[itemKeys[d.key]];
                });
            transition_items();

            // Update the current visible index.
            currentVisibleSetIndex = newVisibleSetIndex;
        }

        function scroll_carousel_arrow()
        {
            // Determine if the arrow clicked on is active.
            var arrow = d3.select(this);
            if (arrow.classed("inactive")) return;

            // Determine if the scrolling is to the left.
            var isLeft = arrow.classed("left");

            // Determine index of next visible set.
            newVisibleSetIndex = currentVisibleSetIndex + (isLeft ? -1 : 1);
            newVisibleSetIndex = (visibleItemSets.length + newVisibleSetIndex) % visibleItemSets.length;

            // Scroll the carousel.
            scroll_carousel(newVisibleSetIndex);
        }

        function scroll_carousel_dot(d)
        {
            // Scroll the carousel left or right following a click on one of the navigation dots.
            scroll_carousel(d.key);
        }

        /********************
        *  Helper Functions *
        ********************/
        function transition_items()
        {
            // Determine whether to scroll left or right.
            var leftItemData = items.data()[0];
            var isScrollRight;
            if (isInfinite)
            {
                // If infinite scrolling is used, then scroll in the shorter direction.
                var isNewRestingLeft = leftItemData.resting < leftItemData.distAlongPath;
                var distanceGoingLeft = (isNewRestingLeft) ? leftItemData.distAlongPath - leftItemData.resting : leftItemData.distAlongPath + (scrollPathLength - leftItemData.resting);
                var distanceGoingRight = (isNewRestingLeft) ? (scrollPathLength - leftItemData.distAlongPath) + leftItemData.resting : leftItemData.resting - leftItemData.distAlongPath;
                isScrollRight = distanceGoingRight < distanceGoingLeft;
            }
            else
            {
                // If scrolling is not infinite, then simply scroll right if the items are currently to the left of where they need to be, and
                // left otherwise.
                isScrollRight = leftItemData.distAlongPath < leftItemData.resting;
            }

            // Transition items back to their resting locations from wherever they are.
            items
                .transition()
                .duration(3000)
                .ease("cubic-out")
                .tween("transform", function(d)
                    {
                        var interpolator;
                        if (isScrollRight)
                        {
                            if (d.distAlongPath < d.resting)
                            {
                                // If the current position of the item is to the left of its resting place, then you want to
                                // snap the items back by scrolling right.
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
                                // If the current position of the item is to the right of its resting place, then you want to
                                // snap the items back by scrolling left.
                                interpolator = d3.interpolate(d.distAlongPath, d.resting);
                            }
                        }

                        // Determine how to update the item locations. Infinite transitioning can make use of wrapping around the path.
                        // Non-infinite updating must not wrap around. Instead it should stay clamped between 0 and scrollPathLength.
                        var updater;
                        if (isInfinite) { updater = function(t) { return (scrollPathLength + interpolator(t)) % scrollPathLength; }; }
                        else { updater = function(t) { return Math.min(scrollPathLength, Math.max(0, interpolator(t))); }; }

                        var currentPoint;
                        return function(t)
                            {
                                d.distAlongPath = updater(t);
                                currentPoint = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                                d.transX = currentPoint.x;  // Determine position of the item at this point in the transition.
                                d.transY = currentPoint.y - (d.height / 2);  // Determine position of the item at this point in the transition.
                                d3.select(this)
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; })  // Update the item's position.
                                    ;
//                                  .select(".carouselClipRect")
//                                      .attr("x", function(d) { return -d.transX; });  // Update the clip path.
                            }
                    });
        }

        function rotate_array(array, step)
        {
            // Rotate an array by step positions in a circular fashion. A positive step value will rotate all array values to the left.
            // A negative step value will rotate array values to the right.

            // Determine the offset to apply in order to bring the index within the permissible range.
            var offset = step < 0 ? Math.ceil(step / array.length) * array.length : Math.floor(step / array.length) * array.length;

            // Correct for -ve step values.
            if (step < 0)
            {
                // Negative steps can't be used directly as array[-ve] is an error. Therefore, when a negative
                // step is used, the step value must be corrected.
                // This is done by converting the -ve step to an equivalent +ve step. For example, with an array of [0,1,2,3,4]
                // a -ve step of -6 is equivalent to a +ve step of 4. Both give a rotated array of [4,0,1,2,3].
                step += (Math.ceil(Math.abs(step) / array.length) * array.length);
            }

            // Rotate the array.
            var returnArray = [];
            for (var i = 0; i < array.length; i++)
            {
                returnArray.push(array[(i + step) % (array.length)]);
            }

            return returnArray
        }

        function determine_visible_item_sets()
        {
            // Depending on the number of items and the values of itemsToShow and itemsToScrollBy, there will be a certain number of sets of items
            // that can be made visible when scrolling through the carousel. For example, with 8 items, 2 itemsToShow and 2 itemsToScrollBy, there are
            // 4 sets of items that can be visible at any one time (indices [0,1], [2,3], [4,5] and [6,7]).

            var itemsInCarousel = items[0].length;  // The number of items in the carousel.
            var keys = [];  // The keys of the items, ordered in the same order as the items were passed in.
            items.each(function(d) { keys.push(d.key); });
            var visibleSets = [];  // The visible sets of items that can appear in the carousel's view.
            if (isInfinite)
            {
                // If the scrolling is infinite, then the possible view sets can involve wrapping around the end of the array of items and starting
                // again from the beginning. Therefore, the view sets only stop when the first item in the next viewset is the same as the first
                // item in the first view set, as you've now reached the beginning of the cycle again.

                visibleSets = [keys.slice(0, itemsToShow)];
                var startKey = keys[0];  // The key of the leftmost item in the initial view.
                var currentIndex = itemsToScrollBy;  // The index of the current leftmost item in the view being determined.
                var currentKey = keys[currentIndex];  // The key of the current leftmost item in the view being determined.
                var currentViewSet;  // An array containing the items in the current view being determined.

                while (currentKey !== startKey)
                {
                    // Loop until the currentKey is the same as the starting one, and therefore until all possible views have been determined.
                    // This may require going past the end of the key array, and starting to gather keys from the beginning possibly multiple times
                    // if the itemsToScrollBy is really large).

                    currentViewSet = keys.slice(currentIndex, currentIndex + itemsToShow);  // The items at the end of the key array that are in the new view.

                    // Determine if more keys are needed than there are spots in the array to the right of the currentIndex. If more are needed, then loop back
                    // to the start of the key array to get them. Keep looping back until the required number of keys are acquired.
                    var keysNeeded = itemsToShow - currentViewSet.length;
                    while (keysNeeded > 0)
                    {
                        currentViewSet = currentViewSet.concat((keys.slice(0, keysNeeded)));  // Add the new items to the array containing the keys in this visible set.
                        keysNeeded = itemsToShow - currentViewSet.length;  // Update the number of keys that are still needed.
                    }
                    visibleSets.push(currentViewSet);  // Update the array of visible sets.

                    currentIndex = (currentIndex + itemsToScrollBy) % itemsInCarousel;  // Update the current index.
                    currentKey = keys[currentIndex];  // Update the current key.
                }
            }
            else
            {
                // If the scrolling is not infinite, then only need to get all sets up to the end of the item array. The problem comes when the number
                // of items and the number to scroll by don't match up nicely. For example, with 9 items, 2 itemsToShow and 3 itemsToScrollBy, you would
                // have view sets of indices [0,1], [3,4], [6,7], and then a left over index 8. In order to handle this, when there is a left over that is
                // smaller than a full view set, you just pad it with previous items. So, in the previous example, the final view set is not [8], but [7,8].

                var i;
                for (i = 0; i < itemsInCarousel - itemsToShow; i += itemsToScrollBy)
                {
                    visibleSets.push(keys.slice(i, i + itemsToShow));
                }
                if (i + itemsToShow - itemsToScrollBy !== itemsInCarousel)
                {
                    visibleSets.push(keys.slice(-itemsToShow));
                }
            }

            return visibleSets;
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

    // Items to show.
    carousel.itemsToShow = function(_)
    {
        if (!arguments.length) return itemsToShow;
        itemsToShow = _;
        return carousel;
    }

    // Items to scroll by.
    carousel.itemsToScrollBy = function(_)
    {
        if (!arguments.length) return itemsToScrollBy;
        itemsToScrollBy = _;
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

    // Infinite scrolling.
    carousel.isInfinite = function(_)
    {
        if (!arguments.length) return isInfinite;
        isInfinite = _;
        return carousel;
    }

    // Centered items.
    carousel.isCentered = function(_)
    {
        if (!arguments.length) return isCentered;
        isCentered = _;
        return carousel;
    }

    // Navigation dots.
    carousel.isDots = function(_)
    {
        if (!arguments.length) return isDots;
        isDots = _;
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

    // Item snap back transition duration.
    carousel.itemSnapSpeed = function(_)
    {
        if (!arguments.length) return itemSnapSpeed;
        itemSnapSpeed = _;
        return carousel;
    }

    // Scroll path.
    carousel.scrollPath = function(_)
    {
        if (!arguments.length) return scrollPath;
        scrollPath = _;
        return carousel;
    }

    // Custom scroll path fractional start distance.
    carousel.customScrollFraction = function(_)
    {
        if (!arguments.length) return customScrollFraction;
        customScrollFraction = _;
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

    // Navigation arrow height.
    carousel.navDotRadius = function(_)
    {
        if (!arguments.length) return navDotRadius;
        navDotRadius = _;
        return carousel;
    }

    return carousel;
}
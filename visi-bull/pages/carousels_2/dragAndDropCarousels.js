function dragAndDropCarousel(items)
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
        navArrowWidth = null,  // The width of the navigation arrow.
        navArrowHeight = null,  // The height of the navigation arrow.
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

        // Setup the scroll path.
        var scrollPathLength;  // The length of the path along which the scrolling will occur.
        if (isInfinite) scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size());
        else scrollPathLength = d3.sum(itemWidths) + (horizontalPadding * items.size()) + d3.max(itemWidths);
        var scrollPathStartY = height / 2;  // The Y location of the start of the scroll path.
        var scrollPathStartX;  // The X location of the start of the scroll path.
        if (isInfinite) scrollPathStartX = (width / 2) - (scrollPathLength / 2);
        else scrollPathStartX = -d3.max(itemWidths);  // Want the path to be able to contain the widest item off screen to the left.

        // Determine the position where the leftmost item in the carousel will start.
        var leftItemStartX;  // The X location of the leftmost item in the view.
        if (isInfinite) leftItemStartX = (width / 2) - (d3.select(items[0][0]).datum().width / 2);
        else leftItemStartX = horizontalPadding / 2;
        var leftItemStartDist = leftItemStartX - scrollPathStartX;  // The location of the leftmost item in the view in terms of its fractional distance along the path.

        // Determine the center and boundaries of the carousel in relation to their distance along the scroll path.
        var distOfCenter = (width / 2) - scrollPathStartX;  // The distance of the center of the carousel along the scroll path.
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
                // Update the currentItemDist to position the current item. Wrap the item's position around to the left of the items in view if necessary.
                if (i !== 0)
                {
                    // If the item is not the first one.
                    currentItemDist += (horizontalPadding / 2);
                }
                currentItemDist = (scrollPathLength + currentItemDist) % scrollPathLength;

                // Get the coordinates of the position currentItemDist along the path.
                positionAlongPath = pathToScrollAlong.node().getPointAtLength(currentItemDist);

                // Update item position.
                d.resting = currentItemDist;
                d.distAlongPath = d.resting;
                d.transX = positionAlongPath.x;
                d.transY = positionAlongPath.y - (d.height / 2);

                // Set position for next item.
                currentItemDist += (d.width + (horizontalPadding / 2));

                return "translate(" + d.transX + "," + d.transY + ")";
            });

        // Setup the definitions needed for dragging.
        var draggedItem = null;  // The item that is being dragged.
        var dragStartXPos;  // The X position within the item that the user clicked in order to drag.
        var dragStartYPos;  // The Y position within the item that the user clicked in order to drag.
        var leftNeighbour = null;  // The item to the left of the one being dragged.
        var rightNeighbour = null;  // The item to the right of the one being dragged.

        // Add drag behaviour.
        var dragBehaviour = d3.behavior.drag()
            .on("dragstart", drag_start)
            .on("drag", drag_update)
            .on("dragend", drag_end);
        items.call(dragBehaviour);

        // Clip the items to the carousel.
        var outOfCarousel = {};  // A record of items that have been dragged out of the carousel.
        items.each(function(d) { outOfCarousel[d.key] = false; });
        items.append("clipPath")
            .classed("carouselClip", true)
            .attr("id", function(d) { return d.rootID + "clip-" + d.key; })
            .append("path")
                .classed("carouselClipPath", true)
                .attr("clip-rule", "evenodd")
                .attr("d", "");
        generate_clip_paths();
        items.attr("clip-path", function(d) { return "url(#" + (d.rootID + "clip-" + d.key) + ")"; });

        // Add the navigation arrow behaviour.
        var navigationArrows = carousel.selectAll(".navArrow");

        /*************************************
        * Individual Item Dragging Functions *
        *************************************/
        function drag_end(d)
        {
            // Determine whether either of the navigation arrows should have their inactivity changed.
            var itemPositions = items.data().map(function(itemD) { return {"pos": itemD.resting, "width": itemD.width}; });
            var maxRightEdge = d3.max(itemPositions.map(function(itemD) { return itemD.pos + itemD.width; }));
            var minLeftEdge = d3.min(itemPositions.map(function(itemD) { return itemD.pos; }));
            carousel.select(".navArrow.right").classed("inactive", maxRightEdge <= carouselRightEdge);
            carousel.select(".navArrow.left").classed("inactive", minLeftEdge >= carouselLeftEdge);

            // Add back the highlighting for the navigation arrows.
            navigationArrows
                .on("mouseover", function() { d3.select(this).classed("highlight", true); })
                .on("mouseout", function() { d3.select(this).classed("highlight", false); })

            // Determine whether the item is inside the carousel.
            var positionInCarousel = d3.mouse(this.parentNode);  // The position of the mouse in the carousel.
            var isIsideCarousel = ((positionInCarousel[0] - dragStartXPos + d.width > 0) &&
                                   (positionInCarousel[0] - dragStartXPos < width) &&
                                   (positionInCarousel[1] - dragStartYPos + d.height > 0) &&
                                   (positionInCarousel[1] - dragStartYPos < height));

            if (isIsideCarousel)
            {
                // The item is inside the carousel.

                // Remove the item from the list of items outside the carousel.
                outOfCarousel[d.key] = false;

                // Transition dragged item to its resting place.
                draggedItem
                    .transition()
                    .duration(200)
                    .ease("cubic-out")
                    .tween("transform", function()
                        {
                            var interpolatorX = d3.interpolate(0, d.resting - d.distAlongPath);
                            var lastInterpValX = 0;  // The last value that came out of the X interpolater.
                            var currentInterpValX;  // The current value of the X interpolater.
                            var currentPoint = pathToScrollAlong.node().getPointAtLength(d.resting);
                            var interpolatorY = d3.interpolate(0, (currentPoint.y - (d.height / 2)) - d.transY);
                            var lastInterpValY = 0;  // The last value that came out of the Y interpolater.
                            var currentInterpValY;  // The current value of the Y interpolater.


                            return function(t)
                                {
                                    currentInterpValX = interpolatorX(t);
                                    d.distAlongPath += (currentInterpValX - lastInterpValX);
                                    lastInterpValX = currentInterpValX;
                                    currentInterpValY = interpolatorY(t);
                                    d.transY += (currentInterpValY - lastInterpValY);  // Determine Y position of the item at this point in the transition.
                                    lastInterpValY = currentInterpValY;
                                    currentPoint = pathToScrollAlong.node().getPointAtLength(d.distAlongPath);
                                    d.transX = currentPoint.x;  // Determine X position of the item at this point in the transition.
                                    d3.select(this)
                                        .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });  // Update the item's position.
                                    generate_clip_paths();
                                }
                        })
                    .each("end", function()
                        {
                            // Remove the record of the item neighbours.
                            draggedItem = null;
                            leftNeighbour = null;
                            rightNeighbour = null;

                            generate_clip_paths();
                        });
            }
            else
            {
                // The item is outside the carousel.

                // Add the item to the list of items outside the carousel.
                outOfCarousel[d.key] = true;

                // Remove the record of the item neighbours.
                draggedItem = null;
                leftNeighbour = null;
                rightNeighbour = null;

                generate_clip_paths();
            }
        }

        function drag_start(d)
        {
            draggedItem = d3.select(this);
            dragStartXPos = d3.mouse(this)[0];
            dragStartYPos = d3.mouse(this)[1];

            // Remove and add the item back on top. This enables you to reorder items on top of each other as you please.
            draggedItem.remove();
            itemContainer.append(function() { return draggedItem.node(); });
            generate_clip_paths();

            // Kill any transitions that the dragged item is undergoing or is scheduled to undergo.
            draggedItem
                .interrupt() // Cancel any transitions running on this item.
                .transition(); // Pre-empt any scheduled transitions on this item.

            // Remove the highlighting of the navigation arrows.
            navigationArrows
                .on("mouseover", null)
                .on("mouseout", null);

            // Remove the behaviour of the navigation arrows that may be triggered at the end of a drag.
            navigationArrows = carousel.selectAll(".navArrow")
                .on("mouseup", null)
                .on("mouseleave", null);
        }

        function drag_update(d)
        {
            var positionInCarousel = d3.mouse(this.parentNode);  // The position of the mouse in the carousel.

            var isIsideCarousel = ((positionInCarousel[0] - dragStartXPos + d.width > 0) &&
                                   (positionInCarousel[0] - dragStartXPos < width) &&
                                   (positionInCarousel[1] - dragStartYPos + d.height > 0) &&
                                   (positionInCarousel[1] - dragStartYPos < height));

            if (isIsideCarousel)
            {
                // The dragged item is still inside the carousel.

                // Remove the item from the list of items outside the carousel.
                outOfCarousel[d.key] = false;

                // Move the item.
                d.distAlongPath = carouselLeftEdge + positionInCarousel[0] - dragStartXPos;
                d.transX = pathToScrollAlong.node().getPointAtLength(d.distAlongPath).x;
                d.transY = positionInCarousel[1] - dragStartYPos;
                draggedItem
                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });
            }
            else
            {
                // The dragged item is no longer inside the carousel.

                // Add the item to the list of items outside the carousel.
                outOfCarousel[d.key] = true;

                // Move the item.
                d.transX = positionInCarousel[0] - dragStartXPos;
                d.transY = positionInCarousel[1] - dragStartYPos;
                draggedItem
                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });
            }

            // Update the clip paths.
            generate_clip_paths();
        }

        /*******************
        * Helper Functions *
        *******************/
        function generate_clip_paths()
        {
            // Generate the clip paths for all items.

            if (draggedItem)
            {
                // There is an item being dragged.
                var draggedData = draggedItem.datum();
                items.each(function(d)
                    {
                        if (outOfCarousel[d.key] || (draggedData.key === d.key))
                        {
                            // The item is outside the carousel or is the one being dragged, and therefore should be completely visible.
                            clippingPath = "M0,0" +
                                "h" + width +
                                "v" + height +
                                "h" + -width +
                                "v" + -height;
                        }
                        else
                        {
                            // The item is inside the carousel and not being dragged.
                            clippingPath = "M" + -d.transX + "," + -d.transY +
                                "h" + width +
                                "v" + height +
                                "h" + -width +
                                "v" + -height;
                        }
                        d3.select(this).select(".carouselClipPath")
                            .attr("d", clippingPath);
                });
            }
            else
            {
                // There is no item being dragged.
                items.each(function(d)
                    {
                        if (outOfCarousel[d.key])
                        {
                            // The item is outside the carousel, and therefore should be completely visible.
                            clippingPath = "M0,0" +
                                "h" + width +
                                "v" + height +
                                "h" + -width +
                                "v" + -height;
                        }
                        else
                        {
                            // The item is inside the carousel, and should therefore be clipped to the carousel.
                            clippingPath = "M" + -d.transX + "," + -d.transY +
                                "h" + width +
                                "v" + height +
                                "h" + -width +
                                "v" + -height;
                        }
                        d3.select(this).select(".carouselClipPath")
                            .attr("d", clippingPath);
                    });
            }
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
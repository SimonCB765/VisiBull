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
        isInfinite = false,  // Whether the scrolling should be an infinite loop.
        isCentered = false,  // Whether the displayed items should be centered.
        isDots = false,  // Whether to display dots below the items to indicate where you are in the carousel.
        isArrows = true,  // Whether to display arrows at the sides of the carousel that scroll the carousel when clicked.
        dotContainerHeight = 20,  // The height of the g element containing the navigation dots. Should be at least twice the dotRadius.
        itemSnapSpeed = 300,  // The duration that the items take when snapping back into place.
        scrollPath = "flat",  // The path along which the items will be scrolled. "flat" corresponds to a straight line, "loop" to an ellipse.
                              // Straight line paths can use infinite or non-infinite scrolling.
                              // Looped paths must use infinite scrolling.
                              // Alternatively, a custom paath can be provided.
        customScrollFraction = 0,  // The fractional [0,1] distance along the path at which to place the first item. Only works with custom paths.
        navArrowWidth = null,  // The width of the navigation arrow.
        navArrowHeight = null  // The height of the navigation arrow.
        ;

    /*****************************
    * Carousel Creation Function *
    *****************************/
    function carousel(selection)
    {
        // Create the carousel. The selection passed in must contain only one element.
        if (selection.size() !== 1) { console.log("Selection to create carousel in must contain only one element."); return; }

        // Setup the carousel container.
        var carousel = selection.append("g")
            .classed("carousel", true)
            .attr("transform", function(d) { return "translate(" + xLoc + "," + yLoc + ")"; });

        // Determine the width of each item (taking into account its padding), and the maximum height of all items.
        var maxItemHeight = 0;  // The maximum height (including vertical padding) of all the items.
        var itemWidths = [];  // The width for all the items. The width of the item with index i is found at index i in this array.
        var itemPaddings = [];  // The horizontal padding for all the items. The horizontal padding of the item with index i is found at index i in this array.
        var itemData = items.data();
        var currentItemData;
        for (var i = 0; i < itemData.length; i++)
        {
            currentItemData = itemData[i];
            maxItemHeight = Math.max(maxItemHeight, currentItemData.height + currentItemData.verticalPadding);
            itemWidths.push(currentItemData.width);
            itemPaddings.push(currentItemData.horizontalPadding);
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
                maxWidthWindow = Math.max(maxWidthWindow, d3.sum(itemWidths.slice(i, i + itemsToShow)) + d3.sum(itemPaddings.slice(i, i + itemsToShow)));
            }
            width = (scrollPath === "flat") ? maxWidthWindow : ((items.size() / 4) * maxWidthWindow);
        }
        if (height === null)
        {
            // The width was not pre-specified, so set it dynamically.
            height = ((scrollPath === "flat") ? maxItemHeight : ((items.size() / 4) * maxItemHeight)) + (isDots ? dotContainerHeight : 0);
        }

        // Create the backing rectangle to catch events. Create it before transferring the items in order to ensure it is below them.
        carousel.append("rect")
            .classed("backingRect", true)
            .attr("width", width)
            .attr("height", height);

        // Determine the visible sets of items.
        var visibleItemSets = determine_visible_item_sets();

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
                leftViewItemStartX -= (itemWidths[0] + (itemPaddings[0] / 2));
                for (var i = 1; i < Math.floor(numberOfItemsLeftOfCenter); i++)
                {
                    leftViewItemStartX -= (itemWidths[i] + itemPaddings[i]);
                }
                if (parseInt(numberOfItemsLeftOfCenter) !== numberOfItemsLeftOfCenter)
                {
                    // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center).
                    var itemStraddlingMidPoint = Math.floor(numberOfItemsLeftOfCenter);
                    leftViewItemStartX -= ((itemWidths[itemStraddlingMidPoint] + itemPaddings[itemStraddlingMidPoint]) / 2);
                }
            }
        }
        else
        {
            leftViewItemStartX = (itemPaddings[0] / 2);
        }

        // Setup the scroll path.
        var pathToScrollAlong = carousel.append("path").classed("scrollPath", true);
        var leftViewItemStartDist = 0;  // The location of the leftmost item in the view in terms of its fractional distance along the path.
        var scrollPathStartX;  // The X location of the start of the scroll path.
        var scrollPathStartY = (height - (isDots ? dotContainerHeight : 0)) / 2;  // The Y location of the start of the scroll path.
        var scrollPathLength;  // The length of the path along which the scrolling will occur.
        if (scrollPath === "flat")
        {
            if (isInfinite)
            {
                // Determine the length of the path to scroll along.
                scrollPathLength = d3.sum(itemWidths) + d3.sum(itemPaddings);

                // Determine the starting point of the path to scroll along.
                scrollPathStartX = (width + 10) - scrollPathLength;  // Want the path to end at width + 10.

                // Determine the starting point of the leftmost item in the view in terms of its distance along the path.
                leftViewItemStartDist = leftViewItemStartX - scrollPathStartX;
            }
            else
            {
                // Determine the length of the path to scroll along.
                scrollPathLength = d3.sum(itemWidths) + d3.sum(itemPaddings);
                scrollPathLength *= 2;

                // Determine the starting point of the path to scroll along.
                scrollPathStartX = leftViewItemStartX - (scrollPathLength / 2);

                // Determine the starting point of the leftmost item in the view in terms of its distance along the path.
                leftViewItemStartDist = (scrollPathLength / 2);
            }

            // Create the path to scroll along.
            pathToScrollAlong.attr("d", "M" + scrollPathStartX + "," + scrollPathStartY + "h" + scrollPathLength);
        }
        else if (scrollPath === "loop")
        {
            isInfinite = true;  // Looped paths must use infinite scrolling.

            // Determine the widest item and its padding.
            var widestItem = 0;
            var widestItemPadding = 0;
            items.each(function(d)
                {
                    if (d.width + d.horizontalPadding > widestItem + widestItemPadding)
                    {
                        widestItem = d.width;
                        widestItemPadding = d.horizontalPadding;
                    }
                });

            // Create the looping path.
            var cx = (width / 2) - (widestItem / 2);
            var cy = ((height - (isDots ? dotContainerHeight : 0)) / 2);
            var xRadius = (width / 2) - ((widestItem + widestItemPadding) / 2);
            var yRadius = ((height - (isDots ? dotContainerHeight : 0)) / 2) - (maxItemHeight / 2);
            pathToScrollAlong.attr("d",
                "M" + (cx - xRadius) + "," + cy +
                "a" + xRadius + "," + yRadius + ",0,1,0," + (xRadius * 2) + ",0" +
                "a" + xRadius + "," + yRadius + ",0,1,0," + (-xRadius * 2) + ",0"
                );
            scrollPathLength = pathToScrollAlong.node().getTotalLength();
            leftViewItemStartDist = scrollPathLength * 0.25;  // A quarter of the way around to get to the bottom in the middle.
        }
        else
        {
            // Using a custom path. The leftmost item in the view starts at the origin of the path.
            pathToScrollAlong.attr("d", scrollPath);
            scrollPathLength = pathToScrollAlong.node().getTotalLength();
            leftViewItemStartDist = customScrollFraction * scrollPathLength;
        }

        // Transfer the items into the carousel from wherever they currently are.
        items.each(function() { carousel.node().appendChild(this); });

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
                        currentItemDist += (d.horizontalPadding / 2);
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
                    currentItemDist += (d.width + (d.horizontalPadding / 2));

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
        carousel.call(dragBehaviour);

        // Create the navigation arrows.
        if (isArrows)
        {
            // Determine whether default values are needed for the navigation arrow width and height.
            if (navArrowWidth === null) navArrowWidth = Math.min(20, width / 4);
            if (navArrowHeight === null) navArrowHeight = Math.min(40, (height - (isDots ? dotContainerHeight : 0)) / 2);

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
                .attr("d", "M" + navArrowWidth + ",0" + "L0," + (navArrowHeight / 2) + "L" + navArrowWidth + "," + navArrowHeight);

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
                .attr("d", "M0,0" + "L" + navArrowWidth + "," + (navArrowHeight / 2) + "L0," + navArrowHeight);

            // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
            carousel
                .on("mouseover", function() { leftNavArrowContainer.classed("visible", true); rightNavArrowContainer.classed("visible", true); })
                .on("mouseout", function() { leftNavArrowContainer.classed("visible", false); rightNavArrowContainer.classed("visible", false); });
        }

        /*****************
        * Drag Functions *
        *****************/
        var totalDistanceDragged;  // The total distance that the user has dragged the carousel (used to determine which direction to snap the items back to resting).
        function drag_end(d)
        {
            // Transition the items, and clips paths, to their correct resting places.
            transition_items();
        }

        function drag_start()
        {
            totalDistanceDragged = 0;  // Initialise the distance the items have been dragged.
            items
                .interrupt() // Cancel any transitions running on the items.
                .transition(); // Pre-empt any scheduled transitions on the items.
        }

        function drag_update_infinite(d)
        {
            // Drag items that scroll infinitely.
            var changeInPosition = d3.event.dx;  // The movement caused by the dragging.
            totalDistanceDragged += changeInPosition;

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
            totalDistanceDragged += changeInPosition;

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

        /*******************
        * Transition Items *
        *******************/
        function transition_items()
        {
            // Transition items back to their resting locations from wherever they are.
            items
                .transition()
                .duration(3000)
                .ease("cubic-out")
                .tween("transform", function(d)
                    {
                        var interpolator;
                        if (totalDistanceDragged < 0)
                        {
                            // The dragging has been predominantly to the left.
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
                            // The dragging has been predominantly to the right.
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

                        var currentPoint;
                        return function(t)
                            {
                                d.distAlongPath = Math.min(scrollPathLength, Math.max(0, interpolator(t)));  // Clamp the perceived distance to be between [0,scrollPathLength].
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

        /*******************
        * Helper Functions *
        *******************/
        function determine_visible_item_sets()
        {
            // Depending on the number of items and the values of itemsToShow and itemsToScrollBy, there will be a certain number of sets of items
            // that can be made visible when scrolling through the carousel. For example, with 8 items, 2 itemsToShow and 2 itemsToScrollBy, there are
            // 4 sets of items that can be visible at any one time (indices [0,1], [2,3], [4,5] and [6,7]).

            var itemsInCarousel = items[0].length;  // The number of items in the carousel.
            var keys = [];  // The keys of the items, ordered in the same order as the items were passed in.
            items.each(function(d) { keys.push(d.key); });
            var visibleSets = [keys.slice(0, itemsToShow)];  // The visible sets of items that can appear in the carousel's view.
            var startKey = keys[0];  // The key of the leftmost item in the initial view.
            var currentIndex = itemsToScrollBy;  // The index of the current leftmost item in the view being determined.
            var currentKey = keys[currentIndex];  // The key of the current leftmost item in the view being determined.
            var currentViewSet;  // An array containing the items in the current view being determined.
            if (isInfinite)
            {
                // If the scrolling is infinite, then the possible view sets can involve wrapping around the end of the array of items and starting
                // again from the beginning. Therefore, the view sets only stop when the first item in the next viewset is the same as the first
                // item in the first view set, as you've now reached the beginning of the cycle again.

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

                var numberOfFullSets = Math.floor(itemsInCarousel / itemsToScrollBy);  // The number of full sets that can be made.
                var numberOfSets = Math.ceil(itemsInCarousel / itemsToScrollBy);  // The number of sets needed (max of 1 more than numberOfFullSets).

                for (var i = 0; i < numberOfFullSets; i++)
                {
                    visibleSets.push(keys.slice(i * itemsToScrollBy, (i * itemsToScrollBy) + itemsToShow));
                }
                if (numberOfFullSets !== numberOfSets)
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

    return carousel;
}
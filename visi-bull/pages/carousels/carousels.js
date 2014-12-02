/******************************
* Carousel Creation Functions *
******************************/
function create_carousel(items, carousel, params)
{
    // Create a carousel containing the input items.
    // items is a d3.selection of the items to put in the carousel.
    // carousel is the carousel element to be set up.
    // param is a configuration object with the following accepted values:
    //      carouselXLoc - The starting X coordinate for the carousel container.
    //      carouselYLoc - The starting X coordinate for the carousel container.
    //      itemsToScrollBy - The number of items to scroll by in the carousel. Can't be less than 1.
    //      itemsToShow - The number of items to show in the carousel. Can't be less than 1.
    //      carouselHeight - The height of the carousel.
    //      carouselWidth - The width of the carousel.
    //      isInfinite - Whether the scrolling should be an infinite loop.
    //      isCentered - Whether the displayed items should be centered.
    //      isDots - Whether to display dots below the items to indicate where you are in the carousel

    // Definitions needed.
    var carouselXLoc = 0;  // The starting X coordinate for the carousel container.
    var carouselYLoc = 0;  // The starting X coordinate for the carousel container.
    var itemsToScrollBy = 1;  // The number of items to scroll by in the carousel. Can't be less than 1.
    var itemsToShow = 1;  // The number of items to show in the carousel. Can't be less than 1.
    var carouselHeight;  // The height of the carousel.
    var carouselWidth;  // The width of the carousel.
    var isInfinite = false;  // Whether the scrolling should be an infinite loop.
    var isCentered = false;  // Whether the displayed items should be centered.
    var isDots = false;  // Whether to display dots below the items to indicate where you are in the carousel
    var dotContainerHeight = 20;  // The height of the g element containing the navigation dots.
    var dotRadius = 3;  // The radius of the navigation dots.
    var dotGap = 20;  // The distance between the navigation dots.

    /*****************************
    * Parse the Input Parameters *
    *****************************/
    if (typeof params.carouselXLoc !== "undefined") carouselXLoc = params.carouselXLoc;
    if (typeof params.carouselYLoc !== "undefined") carouselYLoc = params.carouselYLoc;
    if (typeof params.itemsToShow !== "undefined") itemsToShow = Math.max(params.itemsToShow, 1);
    if (typeof params.itemsToScrollBy !== "undefined") itemsToScrollBy = Math.max(params.itemsToScrollBy, 1);
    if (typeof params.isInfinite !== "undefined") isInfinite = params.isInfinite;
    if (typeof params.isCentered !== "undefined") isCentered = params.isCentered;
    if (typeof params.isDots !== "undefined") isDots = params.isDots;
    if (typeof params.dotContainerHeight !== "undefined") dotContainerHeight = params.dotContainerHeight;
    if (typeof params.dotRadius !== "undefined") dotRadius = params.dotRadius;
    if (typeof params.dotGap !== "undefined") dotGap = params.dotGap;

    // If the height and width are not specified, then they are set dynamically to fit the desired number of items in.
    // The height will be set to the value that accommodates the tallest item (its height plus its vertical padding).
    // The width will be set in order to accommodate the itemsToShow widest adjacent items (taking into account width and horizontal padding).
    var maxItemHeight = 0;  // The maximum height + vertical padding over all items.
    var itemWidths = [];  // The width + horizontal padding for all items.
    var itemData = items.data();
    for (var i = 0; i < itemData.length; i++)
    {
        var currentItemData = itemData[i];
        maxItemHeight = Math.max(maxItemHeight, currentItemData.height + currentItemData.verticalPadding);
        itemWidths.push(currentItemData.width + currentItemData.horizontalPadding);
    }
    if (typeof params.carouselHeight !== "undefined") { carouselHeight = params.carouselHeight }
    else { carouselHeight =  maxItemHeight; }
    if (typeof params.carouselWidth !== "undefined") { carouselWidth = params.carouselWidth }
    else
    {
        // Set the carousel width to the maximum of the widths of the items in a sliding window of itemsToShow items.
        var maxWidthWindow = 0;
        for (var i = 0; i < itemWidths.length - (itemsToShow - 1); i++)
        {
            maxWidthWindow = Math.max(maxWidthWindow, d3.sum(itemWidths.slice(i, i + itemsToShow)));
        }
        carouselWidth = maxWidthWindow;
    }

    /********************************************
    * Determine all Possible Views of the Items *
    ********************************************/
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

        currentIndex = (currentIndex + itemsToScrollBy) % keys.length;  // Update the current index.
        currentKey = keys[currentIndex];  // Update the current key.
    }
    console.log(visibleSets);

    /**********************
    * Create the Carousel *
    **********************/
    // Create the data object for the carousel.
    var carouselData = {
                        "height": carouselHeight,
                        "isCentered": isCentered,
                        "isInfinite": isInfinite,
                        "itemOrder": [],  // The keys of the item in the order (from left to right) that their corresponding items appear in the carousel.
                        "itemsInCarousel": itemsInCarousel,  // The number of items in the carousel.
                        "itemsInView": [],  // The itemsToShow items that are currently in view.
                        "itemsToScrollBy": itemsToScrollBy,
                        "itemsToShow": itemsToShow,
                        "leftmostItem": null,  // The current leftmost item in the carousel.
                        "rightmostItem": null,  // The current rightmost item in the carousel.
                        "transX": carouselXLoc,
                        "transY": carouselYLoc,
                        "visibleSets": visibleSets,  // Array of arrays of item keys. Each sub-array is one of the possible visible sets of items that can be shown.
                        "width": carouselWidth
                       }

    // Create the carousel container.
    carousel
        .datum(carouselData)
        .classed("carousel", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    carousel.insert("rect", ":first-child")
        .classed("carouselContainer", true)
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; });

    /**************************
    * Add the Navigation Dots *
    **************************/
    // Determine the positions of the dots.
    var numberOfDotsLeftOfCenter = visibleSets.length / 2;  // Fraction of the dots to the left of the carousel mid point.
    var leftDotLoc = carouselWidth / 2;  // The X location for the leftmost dot.
    for (var i = 0; i < Math.floor(numberOfDotsLeftOfCenter); i++)
    {
        leftDotLoc -= (dotRadius + dotGap);
    }
    if (parseInt(numberOfDotsLeftOfCenter) !== numberOfDotsLeftOfCenter)
    {
        // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center).
        leftDotLoc -= ((dotRadius + dotGap) / 2);
    }
    var dotPositions = []
    for (var i = 0; i < visibleSets.length; i++)
    {
        dotPositions.push({"x": leftDotLoc + (i * (dotRadius + dotRadius + dotGap)), "y": dotContainerHeight / 2});
    }

    // Add the dots.
    var dotContainer = carousel.append("g")
        .datum({"transX": 0, "transY": carouselHeight})
        .classed("dotContainer", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    dotContainer.append("rect")
            .attr("width", carouselWidth)
            .attr("height", dotContainerHeight);
    dotContainer.selectAll(".dots")
        .data(dotPositions)
        .enter()
        .append("circle")
            .attr("class", function(d, i) { return "navDot" + (i === 0 ? " selected" : ""); })  // The first navigation dot is selected.
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", dotRadius);

    /******************
    * Setup the Items *
    ******************/
    var thisOffset = 0;  // The offset for the current item.
    var cumulativeOffset = thisOffset;  // The cumulative offset from the leftmost item.
    var itemOrder = [];  // The keys of the items in the order (from right to left) that their corresponding items appear in the carousel.
    if (isCentered)
    {
        // Determine the start position of the leftmost item if the items are to be centered.
        var numberOfItemsLeftOfCenter = itemsToShow / 2;  // Fraction of the items to the left of the mid point.
        thisOffset = carouselWidth / 2;  // The offset for the current item.
        for (var i = 0; i < Math.floor(numberOfItemsLeftOfCenter); i++)
        {
            thisOffset -= itemWidths[i];
        }
        if (parseInt(numberOfItemsLeftOfCenter) !== numberOfItemsLeftOfCenter)
        {
            // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center).
            thisOffset -= itemWidths[Math.ceil(numberOfItemsLeftOfCenter) + 1] / 2;
        }
        cumulativeOffset = thisOffset;
    }

    // Put the items in their initial positions.
    if (isInfinite && isCentered)
    {
        // Position the items if the scrolling is infinite and the items are to be centered.
        // This is the only situation where there is a possibility of needing to show some of the final items to the left of the
        // first ones (and only then when the width of the carousel is too large to fit all the first itemsToShow items in with no space).
        var firstItemOffset = thisOffset;  // The offset of the first item in the carousel.
        var leftmostItemIndex = -1;  // The index of the leftmost item in the carousel.
        var leftItems = [];  // The items that are added to the left of the first item.
        var rightItems = [];  // The items, starting from the first item, that are added to the right of the first item.
        items.attr("transform", function(d, i)
            {
                if (cumulativeOffset > carouselWidth)
                {
                    // If the cumulativeOffset is greater than the carousel width, then the items that are still to be positioned will
                    // be off the right hand side of the carousel. Instead of sticking these out of view to the right, they can be positioned
                    // appropriately to the left of the first item. That way if there is space between the left edge of the carousel and the
                    // first item, it will be appropriately filled with items and give the appearance of an infinite loop.
                    // The items are positioned negatively from the first one, with the final item closest to the first.
                    var totalItemWidths = d3.sum(itemWidths.slice(i));
                    thisOffset = firstItemOffset - totalItemWidths + (d.horizontalPadding / 2);
                    leftmostItemIndex = (leftmostItemIndex === -1) ? i : leftmostItemIndex;
                    leftItems.push(d.key);
                }
                else
                {
                    // The cumulativeOffset of the items is still within the carousel, so keep adding items to the right.
                    thisOffset = cumulativeOffset + (d.horizontalPadding / 2);
                    cumulativeOffset += (d.horizontalPadding + d.width);
                    rightItems.push(d.key);
                }
                d.restingX = thisOffset;
                d.transX = thisOffset;
                d.transY = (carouselHeight / 2) - (d.height / 2);
                return "translate(" + d.transX + "," + d.transY + ")";
            });
            carousel.datum().leftmostItem = d3.select(items[0][leftmostItemIndex]);
            carousel.datum().rightmostItem = d3.select(items[0][leftmostItemIndex - 1]);
            itemOrder = leftItems.concat(rightItems);
    }
    else
    {
        // Position the items if the scrolling is not infinite.
        items.attr("transform", function(d)
            {
                thisOffset = cumulativeOffset + (d.horizontalPadding / 2);
                cumulativeOffset += (d.horizontalPadding + d.width);
                d.restingX = thisOffset;
                d.transX = thisOffset;
                d.transY = (carouselHeight / 2) - (d.height / 2);
                itemOrder.push(d.key);
                return "translate(" + d.transX + "," + d.transY + ")";
            });
            carousel.datum().leftmostItem = d3.select(items[0][0]);
            carousel.datum().rightmostItem = d3.select(items[0].slice(-1)[0]);
    }
    carousel.datum().itemOrder = itemOrder;
    carousel.datum().itemsInView = d3.selectAll(items[0].slice(0, itemsToShow));

    // Clip the items to the carousel.
    items.append("clipPath")
        .classed("carouselClip", true)
        .attr("id", function(d) { return d.rootID + "clip-" + d.key; })
        .append("rect")
            .classed("carouselClipRect", true)
            .attr("x", function(d) { return -d.transX; })
            .attr("y", function(d) { return -d.transY; })
            .attr("width", carouselWidth)
            .attr("height", carouselHeight);
    items.attr("clip-path", function(d) { return "url(#" + (d.rootID + "clip-" + d.key) + ")"; });

    /***************************
    * Add the Scrolling Arrows *
    ***************************/
    var navButtonRadius = 10;  // The radius of the navigation buttons.
    var arrowArmLength = Math.cos(Math.PI / 4) * (navButtonRadius * 0.8);  // The length of each arm of the navigation button arrow.

    // Create the left navigation button.
    var leftNavButton = carousel.append("g")
        .classed({"navButton": true, "left": true, "inactive": (isInfinite ? false : true)})  // The left button is inactive at the start if infinite scrolling is not used.
        .attr("transform", "translate(" + navButtonRadius + "," + ((carouselHeight / 2) - navButtonRadius) + ")");
    leftNavButton.append("circle")
        .attr("r", navButtonRadius)
        .attr("cx", navButtonRadius)
        .attr("cy", navButtonRadius);
    leftNavButton.append("path")
        .attr("d",
            "M" + (navButtonRadius + (arrowArmLength / 3)) + "," + (navButtonRadius - arrowArmLength) +
            "l" + -arrowArmLength + "," + arrowArmLength +
            "l" + arrowArmLength + "," + arrowArmLength);

    // Create the right navigation button.
    var rightNavButton = carousel.append("g")
        .classed({"navButton": true, "right": true})
        .attr("transform", "translate(" + (carouselWidth - (3 * navButtonRadius)) + "," + ((carouselHeight / 2) - navButtonRadius) + ")");
    rightNavButton.append("circle")
        .attr("r", navButtonRadius)
        .attr("cx", navButtonRadius)
        .attr("cy", navButtonRadius);
    rightNavButton.append("path")
        .attr("d",
            "M" + (navButtonRadius - (arrowArmLength / 3)) + "," + (navButtonRadius - arrowArmLength) +
            "l" + arrowArmLength + "," + arrowArmLength +
            "l" + -arrowArmLength + "," + arrowArmLength);
    var navigationButtons = carousel.selectAll(".navButton");

    // Setup the carousel to make the navigation buttons slightly visible when the mouse is over the carousel.
    carousel
        .on("mouseover", function() { navigationButtons.classed("visible", true); })
        .on("mouseout", function() { navigationButtons.classed("visible", false); });

    // Setup the navigation buttons to be fully visible when the mouse is over them.
    navigationButtons
        .on("mouseover", function() { d3.select(this).classed("highlight", true); })
        .on("mouseout", function() { d3.select(this).classed("highlight", false); });

    /*************************************
    * Add the Click/Drag/etc. Behaviours *
    *************************************/
    // Add the drag behaviour for items.
    if (isInfinite)
    {
        carousel.call(INFINITEDRAG);
    }
    else
    {
        carousel.call(STANDARDDRAG);
    }

    // Add the click behaviour.
    navigationButtons.on("click", scroll_carousel);

    return carousel;
}

/**************************
* Drag Carousel Functions *
**************************/
function drag_infinite_update(d)
{
    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Record the change in position.
    var changeInPosition = d3.event.dx;  // The movement caused by the dragging.
    items
        .attr("transform", function(itemD)
            {
                itemD.transX += changeInPosition;
                return "translate(" + itemD.transX + "," + itemD.transY + ")";
            });

    // Swap items to the other side of the carousel if needed.
    infinite_item_swap(items, d);

    // Update the positions of the items clip paths.
    items.selectAll(".carouselClipRect")
        .attr("x", function(itemD) { return -itemD.transX; });
}

function drag_standard_end(d)
{
    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Transition the items, and clips paths, to their correct resting places.
    transition_item_positions(items);
}

function drag_standard_update()
{
    var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Update the position of the items.
    items
        .attr("transform", function(d)
            {
                d.transX += changeInPosition;
                return "translate(" + d.transX + "," + d.transY + ")";
            });

    // Update the positions of the items clip paths.
    items.selectAll(".carouselClipRect")
        .attr("x", function(d) { return -d.transX; });
}

var STANDARDDRAG = d3.behavior.drag()
    .origin(function(d) { return {"x": d3.event.x - d.transX, "y": d3.event.y - d.transY}; })  // Set the origin of the drag to be the top left of the carousel container.
    .on("drag", drag_standard_update)
    .on("dragend", drag_standard_end);

var INFINITEDRAG = d3.behavior.drag()
    .origin(function(d) { return {"x": d3.event.x - d.transX, "y": d3.event.y - d.transY}; })  // Set the origin of the drag to be the top left of the carousel container.
    .on("drag", drag_infinite_update)
    .on("dragend", drag_standard_end);

/***********************************
* Item Position Updating Functions *
***********************************/
function transition_item_positions(items)
{
    // Transition the items in the carousel to their resting places.
    // items is a selection consisting of the carousel items to transition.

    items
        .transition()
        .duration(300)
        .ease("cubic-out")
        .tween("transform", function(d)
                {
                    var interpolator = d3.interpolate(d.transX, d.restingX);
                    return function(t)
                        {
                            d.transX = interpolator(t);  // Determine position of the item at this point in the transition.
                            d3.select(this)
                                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; })  // Update the item's position.
                                .select(".carouselClipRect")
                                    .attr("x", function(d) { return -d.transX; });  // Update the clip path.
                        }
                });
}

function transition_item_positions_infinite(items, amountToShift)
{
    // Transition the items in the carousel to their resting places.
    // items is a selection consisting of the carousel items to transition.
    // amountToShift is the distance by which the items should be shifted (negative for left shifting).

    items
        .transition()
        .duration(300)
        .ease("cubic-out")
        .tween("transform", function(d, i)
                {
                    // Initialise state for the tween.
                    var interpolator = d3.interpolate(0, amountToShift);
                    var currentInterpolatedValue;  // The interpolated value for the current time point.
                    var lastInterpolatedValue = 0;  // The interpolated value for the last time point.
                    var swapFunction = (amountToShift < 0) ? check_swap_right : check_swap_left;  // Only need to check swapping in one direction.
                                                                                                  // Left if shifting items to the right, and right otherwise.

                    return function(t)
                        {
                            // Determine position of the item at this point in the transition.
                            currentInterpolatedValue = interpolator(t);
                            d.restingX += (currentInterpolatedValue - lastInterpolatedValue);
                            d.transX += (currentInterpolatedValue - lastInterpolatedValue);
                            lastInterpolatedValue = currentInterpolatedValue;

                            // Move the items.
                            d3.select(this)
                                .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; })  // Update the item's position.
                                .select(".carouselClipRect")
                                    .attr("x", function(d) { return -d.transX; });  // Update the clip path.

                            // Swap items between right and left if needed.
                            swapFunction(items, d3.select(this.parentNode).datum());
                        }
                });
}

function update_resting_positions(items, amountToShift)
{
    // Update the resting positions of the items.
    // items is a selection consisting of the carousel items.
    // amountToShift is the distance by which the items should be shifted (negative for left shifting).

    items.each(function(d) { d.restingX += amountToShift; });
    transition_item_positions(items);
}

/****************************
* Scroll Carousel Functions *
****************************/
function scroll_carousel()
{
    // Scroll the carousel left or right following a click on one of the navigation buttons.

    var navButton = d3.select(this);  // The navigation button clicked on.

    // Determine whether the navigation button is active.
    if (navButton.classed("inactive"))
    {
        return;  // The navigation button is not active, so don't do any scrolling.
    }

    // Determine whether the carousel is being scrolled left or right.
    var isScrollLeft = navButton.classed("left");

    // Get the information about the carousel parent of the navigation button.
    var carousel = d3.select(this.parentNode);
    var carouselData = carousel.datum();

    // Get the items in the carousel.
    var items = carousel.selectAll(".item");
    var leftmostInView = d3.select(carouselData.itemsInView[0][0]);
    var rightmostInView = d3.select(carouselData.itemsInView[0].slice(-1)[0]);

    // Map the keys of the items to the actual DOM elements.
    var keyToNodeMap = {};
    items.each(function(d)
        {
            keyToNodeMap[d.key] = this;
        });

    // Get the items that will be scrolled into view.
    if (isScrollLeft)
    {
        // Get information about the leftmost item in view.
        var leftmostKey = leftmostInView.datum().key;
        var leftmostPosition = carouselData.itemOrder.indexOf(leftmostKey)

        // Get the items to the left of the current ones in view.
        var itemsToLeft = carouselData.itemOrder.slice(Math.max(0, leftmostPosition - carouselData.itemsToScrollBy), leftmostPosition);
        if (carouselData.isInfinite)
        {
            // If infinite scrolling is on, then you can bring items from the right to the left in order to fill out enough items to scroll by.
            var itemsFromRightNeeded = carouselData.itemsToScrollBy - itemsToLeft.length;
            var itemsFromRight;
            while (itemsFromRightNeeded > 0)
            {
                itemsFromRight = carouselData.itemOrder.slice(-itemsFromRightNeeded);
                itemsToLeft = itemsFromRight.concat(itemsToLeft);
                itemsFromRightNeeded = carouselData.itemsToScrollBy - itemsToLeft.length;
            }

            // Determine the width and horizontal padding of all items.
            var itemData = items.data();
            var keyToWidthMap = {};  // A mapping of the item keys to their widths and horixontal paddings.
            var thisItemData;
            for (var i = 0; i < itemData.length; i++)
            {
                thisItemData = itemData[i];
                keyToWidthMap[thisItemData.key] = {"width": thisItemData.width, "horizontalPadding": thisItemData.horizontalPadding};
            }

            /*******************************
            * Calculate Distance to Scroll *
            *******************************/
            // First determine total width of all items to scroll past.
            var scrollDistance = 0;
            for (var i = carouselData.itemsToShow - 1; i < itemsToLeft.length; i++)
            {
                var itemKey = itemsToLeft[i];
                scrollDistance += (keyToWidthMap[itemKey].width + keyToWidthMap[itemKey].horizontalPadding);
            }

            var newKeysInView = itemsToLeft.slice(0, carouselData.itemsToShow);  // The keys of the items to bring into view.
            var newItemsInView = d3.selectAll(newKeysInView.map(function(k) { return keyToNodeMap[k]; }));    // The new items in view.

            // Handle the widths of the current and new items in view.
            if (carouselData.isCentered)
            {
                // The carousel has infinite scrolling and the items are centered.

                // Calculate the portion of the items in view that are left of center.
                var currentLeftOfCenter = (carouselData.width / 2) - (leftmostInView.datum().restingX - (leftmostInView.datum().horizontalPadding / 2));
                scrollDistance += currentLeftOfCenter;

                // Calculate the portion of the new items that will be in the view that will be right of center.
                var numberOfItemsRightOfCenter = newKeysInView.length / 2;  // Fraction of the items to the right of the mid point.
                newItemsInView.each(function(d, i)
                    {
                        if (i > Math.ceil(numberOfItemsRightOfCenter))
                        {
                            scrollDistance += (d.width + d.horizontalPadding);
                        }
                        else if (i > numberOfItemsRightOfCenter)
                        {
                            // If the number of items to the right of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center),
                            // then one index will be less than the fraction of items left of center, but not less than the floor of the fraction
                            // (index 1 in the case of 3 items).
                            scrollDistance += ((d.width + d.horizontalPadding) / 2);
                        }
                    });
            }
            else
            {
                // The carousel has infinite scrolling, but the items are not centered.
                scrollDistance += leftmostInView.datum().horizontalPadding / 2;  // Add half the horizontal padding of the current leftmost item in view.
                scrollDistance += (keyToWidthMap[newKeysInView[0]].width + (keyToWidthMap[newKeysInView[0]].horizontalPadding / 2));  // Add the width and half the horizontal padding of the new leftmost item in view.
            }

            // Now scroll through the items.
            transition_item_positions_infinite(items, scrollDistance);

            // Update the record of the items that are in view.
            carouselData.itemsInView = newItemsInView;
        }
        else
        {
            if (itemsToLeft.length === 0)
            {
                // Do nothing as there are no items to bring into view.
            }
            else if (carouselData.isCentered)
            {
                // Carousel is centered and not infinite.
                var newKeysInView = itemsToLeft.slice(0, carouselData.itemsToShow);  // The keys of the items to bring into view.
                scroll_centered_noninfinite(carouselData, items, leftmostInView, newKeysInView);
            }
            else
            {
                // Carousel is neither centered nor infinite.
                var newKeysInView = itemsToLeft.slice(0, carouselData.itemsToShow);  // The keys of the items to bring into view.
                scroll_noncentered_noninfinite(carouselData, items, leftmostInView, newKeysInView);
            }

            // Update the scrollable status of the navigation buttons.
            scrollable_check(carousel);
        }
    }
    else
    {
        // Get information about the rightmost item in view.
        var rightmostKey = rightmostInView.datum().key;
        var rightmostPosition = carouselData.itemOrder.indexOf(rightmostKey)

        // Move the items to their new locations.
        var itemsToRight = carouselData.itemOrder.slice(rightmostPosition + 1, rightmostPosition + carouselData.itemsToScrollBy + 1);  // The items to the right of the ones currently in view.
        if (carouselData.isInfinite)
        {
            // If infinite scrolling is on, then you can bring items from the left to the right in order to fill out enough items to scroll by.
            var itemsFromLeftNeeded = carouselData.itemsToScrollBy - itemsToRight.length;
            var itemsFromLeft;
            while (itemsFromLeftNeeded > 0)
            {
                itemsFromLeft = carouselData.itemOrder.slice(0, itemsFromLeftNeeded);
                itemsToRight = itemsToRight.concat(itemsFromLeft);
                itemsFromLeftNeeded = carouselData.itemsToScrollBy - itemsToRight.length;
            }

            // Determine the width and horizontal padding of all items.
            var itemData = items.data();
            var keyToWidthMap = {};  // A mapping of the item keys to their widths and horixontal paddings.
            var thisItemData;
            for (var i = 0; i < itemData.length; i++)
            {
                thisItemData = itemData[i];
                keyToWidthMap[thisItemData.key] = {"width": thisItemData.width, "horizontalPadding": thisItemData.horizontalPadding};
            }

            /*******************************
            * Calculate Distance to Scroll *
            *******************************/
            // First determine total width of all items to scroll past.
            var scrollDistance = 0;
            for (var i = 0; i < itemsToRight.length - carouselData.itemsToShow; i++)
            {
                var itemKey = itemsToRight[i];
                scrollDistance += (keyToWidthMap[itemKey].width + keyToWidthMap[itemKey].horizontalPadding);
            }

            var newKeysInView = itemsToRight.slice(-carouselData.itemsToShow);  // The keys of the items to bring into view.
            var newItemsInView = d3.selectAll(newKeysInView.map(function(k) { return keyToNodeMap[k]; }));    // The new items in view.

            // Handle the widths of the current and new items in view.
            if (carouselData.isCentered)
            {
                // The carousel has infinite scrolling and the items are centered.

                // Calculate the portion of the items in view that are right of center.
                var currentRightOfCenter = (rightmostInView.datum().restingX + rightmostInView.datum().width + (rightmostInView.datum().horizontalPadding / 2)) - (carouselData.width / 2);
                scrollDistance += currentRightOfCenter;

                // Calculate the portion of the new items that will be in the view that will be left of center.
                var numberOfItemsLeftOfCenter = newKeysInView.length / 2;  // Fraction of the items to the left of the mid point.
                newItemsInView.each(function(d, i)
                    {
                        if (i < Math.floor(numberOfItemsLeftOfCenter))
                        {
                            scrollDistance += (d.width + d.horizontalPadding);
                        }
                        else if (i < numberOfItemsLeftOfCenter)
                        {
                            // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center),
                            // then one index will be less than the fraction of items left of center, but not less than the floor of the fraction
                            // (index 1 in the case of 3 items).
                            scrollDistance += ((d.width + d.horizontalPadding) / 2);
                        }
                    });
            }
            else
            {
                // The carousel has infinite scrolling, but the items are not centered.
                scrollDistance -= leftmostInView.datum().horizontalPadding / 2;  // Subtract half the horizontal padding of the current leftmost item in view.
                carouselData.itemsInView.each(function(d) { scrollDistance += (d.width + d.horizontalPadding); });  // Add the total width of all items in view.
                scrollDistance += (keyToWidthMap[newKeysInView[0]].horizontalPadding / 2);  // Add half the horizontal padding of the new leftmost item in view.
            }

            // Now scroll through the items.
            transition_item_positions_infinite(items, -scrollDistance);

            // Update the record of the items that are in view.
            carouselData.itemsInView = newItemsInView;
        }
        else
        {
            if (itemsToRight.length === 0)
            {
                // Do nothing as there are no items to bring into view.
            }
            else if (carouselData.isCentered)
            {
                // Carousel is centered and not infinite.
                var newKeysInView = itemsToRight.slice(-carouselData.itemsToShow);  // The keys of the items to bring into view.
                scroll_centered_noninfinite(carouselData, items, leftmostInView, newKeysInView);
            }
            else
            {
                // Carousel is neither centered nor infinite.
                var newKeysInView = itemsToRight.slice(-carouselData.itemsToShow);  // The keys of the items to bring into view.
                scroll_noncentered_noninfinite(carouselData, items, leftmostInView, newKeysInView);
            }

            // Update the scrollable status of the navigation buttons.
            scrollable_check(carousel);
        }
    }
}

function scroll_centered_noninfinite(carouselData, items, leftmostInView, newKeysInView)
{
    // Scroll a carousel that is centered but not infinite.
    // carouselData is the data object for the carousel.
    // items is a selection consisting of the carousel items.
    // leftmostInView is the current leftmost item in view.
    // newKeysInView is the keys of the items that are to be scrolled into view.

    var newItemsInView = items.filter(function(d) { return newKeysInView.indexOf(d.key) !== -1; });  // The new items in view.

    // Get the midpoint of the new items in view.
    var leftOfCenter = -leftmostInView.datum().horizontalPadding / 2;  // The total width of the items (and their padding) left of center.
    var numberOfItemsLeftOfCenter = newKeysInView.length / 2;  // Fraction of the items to the left of the mid point.

    newItemsInView.each(function(d, i)
        {
            if (i < Math.floor(numberOfItemsLeftOfCenter))
            {
                leftOfCenter += (d.width + d.horizontalPadding);
            }
            else if (i < numberOfItemsLeftOfCenter)
            {
                // If the number of items to the left of center is not an integer (e.g. displaying 3 items with 1.5 to the left of the center),
                // then one index will be less than the fraction of items left of center, but not less than the floor of the fraction
                // (index 1 in the case of 3 items).
                leftOfCenter += ((d.width + d.horizontalPadding) / 2);
            }
        });
    var currentCenterOfNewItems = (d3.select(newItemsInView[0][0]).datum().restingX + leftOfCenter);
    var distanceToScroll = (carouselData.width / 2) - currentCenterOfNewItems;

    // Update the positions of the items.
    update_resting_positions(items, distanceToScroll);

    // Update the record of the items that are in view.
    carouselData.itemsInView = newItemsInView;
}

function scroll_noncentered_noninfinite(carouselData, items, leftmostInView, newKeysInView)
{
    // Scroll a carousel that is neither infinite nor centered.
    // carouselData is the data object for the carousel.
    // items is a selection consisting of the carousel items.
    // leftmostInView is the current leftmost item in view.
    // newKeysInView is the keys of the items that are to be scrolled into view.

    var leftmostNewItem = newKeysInView[0];  // The leftmost item that will be scrolled into view.

    // Get the amount by which to shift all resting positions.
    var leftmostNewItem = items.filter(function(d) { return d.key === leftmostNewItem; });
    var distanceToScroll = leftmostInView.datum().restingX - leftmostNewItem.datum().restingX;

    // Update the positions of the items.
    update_resting_positions(items, distanceToScroll);

    // Update the record of the items that are in view.
    carouselData.itemsInView = items.filter(function(d) { return newKeysInView.indexOf(d.key) !== -1; });
}

function scrollable_check(carousel)
{
    // Determine what the active/inactive status of the navigation buttons should be.
    // carousel is a selection containing the carousel.

    var carouselData = carousel.datum();
    var elementsInView = carouselData.itemsInView[0].map(function(item) { return item; });

    // Active or inactivate the left navigation button.
    var leftmostElement = carouselData.leftmostItem.node();
    if (elementsInView.indexOf(leftmostElement) !== -1)
    {
        // The rightmost item is in view, therefore the carousel cannot be scrolled right.
        carousel.select(".navButton.left").classed("inactive", true);
    }
    else
    {
        // The rightmost item is not in view, therefore the carousel can be scrolled right.
        carousel.select(".navButton.left").classed("inactive", false);
    }

    // Active or inactivate the right navigation button.
    var rightmostElement = carouselData.rightmostItem.node();
    if (elementsInView.indexOf(rightmostElement) !== -1)
    {
        // The rightmost item is in view, therefore the carousel cannot be scrolled right.
        carousel.select(".navButton.right").classed("inactive", true);
    }
    else
    {
        // The rightmost item is not in view, therefore the carousel can be scrolled right.
        carousel.select(".navButton.right").classed("inactive", false);
    }
}

/***************************
* Items Swapping Functions *
***************************/
function check_swap_left(items, carouselData)
{
    // Checks whether an item needs to be swapped to the left side of the carousel.
    // items is a selection consisting of the carousel items.
    // carouselData is the data object for the carousel.

    // Get the data of the leftmost and rightmost items in the carousel.
    var leftmostItemData = carouselData.leftmostItem.datum();
    var rightmostItemData = carouselData.rightmostItem.datum();

    // Determine whether an item needs to switch to the left side of the carousel.
    var swapToLeft = leftmostItemData.transX >= -leftmostItemData.horizontalPadding;  // Whether the rightmost item needs to switch to out of view on the left side of the carousel.

    // Reposition and item to the left if needed.
    if (swapToLeft)
    {
        // If the rightmost item needs to be swapped to the left-hand side of the carousel, and this is the rightmost item.
        // The rightmost item becomes the leftmost, and the item second from right becomes the rightmost.

        // Determine the position for the new leftmost (old rightmost) item.
        rightmostItemData.restingX = leftmostItemData.restingX - (leftmostItemData.horizontalPadding / 2) - (rightmostItemData.horizontalPadding / 2) - rightmostItemData.width;
        rightmostItemData.transX = leftmostItemData.transX - ((leftmostItemData.horizontalPadding / 2) + (rightmostItemData.horizontalPadding / 2) + rightmostItemData.width);

        // Update the pointers and the item order.
        carouselData.leftmostItem = carouselData.rightmostItem;
        carouselData.rightmostItem = items.filter(function(itemD) { return itemD.key === carouselData.itemOrder[carouselData.itemsInCarousel - 2]; })
        carouselData.itemOrder = [rightmostItemData.key].concat(carouselData.itemOrder.slice(0, -1));

        // Swap the new leftmost item to the left.
        carouselData.leftmostItem.attr("transform", function(itemD) { return "translate(" + itemD.transX + "," + itemD.transY + ")"; });
    }
}

function check_swap_right(items, carouselData)
{
    // Checks whether an item needs to be swapped to the right side of the carousel.
    // items is a selection consisting of the carousel items.
    // carouselData is the data object for the carousel.

    // Get the data of the leftmost and rightmost items in the carousel.
    var leftmostItemData = carouselData.leftmostItem.datum();
    var rightmostItemData = carouselData.rightmostItem.datum();

    // Determine whether an item needs to switch to the right side of the carousel.
    var swapToRight = (rightmostItemData.transX + rightmostItemData.width) <= carouselData.width + rightmostItemData.horizontalPadding;  // Whether the leftmost item switch to swap to out of view on the right side of the carousel.

    // Reposition and item to the right if needed.
    if (swapToRight)
    {
        // If the leftmost item needs to be swapped to the right-hand side of the carousel, and this is the leftmost item.
        // The leftmost item becomes the rightmost, and the item second from left becomes the leftmost.

        // Determine the position for the new rightmost (old leftmost) item.
        leftmostItemData.restingX = rightmostItemData.restingX + rightmostItemData.width + (rightmostItemData.horizontalPadding / 2) + (leftmostItemData.horizontalPadding / 2);
        leftmostItemData.transX = rightmostItemData.transX + rightmostItemData.width + (rightmostItemData.horizontalPadding / 2) + (leftmostItemData.horizontalPadding / 2);

        // Update the pointers and the item order.
        carouselData.rightmostItem = carouselData.leftmostItem;
        carouselData.leftmostItem = items.filter(function(itemD) { return itemD.key === carouselData.itemOrder[1]; })
        carouselData.itemOrder = carouselData.itemOrder.slice(1).concat(leftmostItemData.key);

        // Swap the new rightmost item to the right.
        carouselData.rightmostItem.attr("transform", function(itemD) { return "translate(" + itemD.transX + "," + itemD.transY + ")"; });
    }
}

function infinite_item_swap(items, carouselData)
{
    // Swaps items from one side of the carousel (out of view) to the other (still out of view).
    // items is a selection consisting of the carousel items.
    // carouselData is the data object for the carousel.

    check_swap_left(items, carouselData);
    check_swap_right(items, carouselData);
}
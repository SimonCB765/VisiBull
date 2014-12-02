$(document).ready(function()
{
    create_pattern_demo("patternDemo");


    var svg = create_svg("demo2", 800, 300);
    svg.style("border", "thin solid black");
    var carousel = svg.append("g");
    var items = create_squares(carousel, "demo2Root-");
    var params = {"carouselXLoc": 30, "carouselYLoc": 30, "itemsToShow": 3
    , "itemsToScrollBy": 1
    , "carouselWidth": 600
    , "isCentered": true
    , "isInfinite": true
    };
    carousel = create_carousel(items, carousel, params);
});

// Define the colors used for the demos.
var COLORCODES = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

/*************************
* Demo Drawing Functions *
*************************/
function create_pattern_demo(svgID)
{
    // Creates just the items to how what they will look like.
    // svgID is the id of the SVG element that should contain the demo.

    // Definitions for both demos.
    var circleColors = [COLORCODES[2], COLORCODES[3], COLORCODES[4], COLORCODES[5], COLORCODES[6]];  // The colors to use to create patterns. One pattern per color.
    var containerWidth = 450;  // The width of the rectangle that will contain the
    var containerHeight = 100;  // The height of the rectangle that will contain the

    // Create the SVG element.
    var svgWidth = 500;  // The width of the SVG element.
    var svgHeight = 310;  // The height of the SVG element.
    var svg = create_svg(svgID, svgWidth, svgHeight);

    /*********************
    * Evenly Sized Items *
    *********************/
    // Definitions needed.
    var carouselXLoc = 30;  // The starting X coordinate for the carousel container.
    var carouselYLoc = 10;  // The starting X coordinate for the carousel container.
    var itemsToShow = 3;  // The number of items to show in the carousel.
    var itemsToScrollBy = 1;  // The number of items to scroll by in the carousel.
    var rootID = "equalDemoPattern-";  // The root of the IDs for the patterns created.
    var rectSize = 100;  // The size of the rect to be filled with the pattern.
    var horizontalPadding = 10;  // The total horizontal padding around each item. Half the padding is on the left and half on the right.
    var verticalPadding = 10;  // The total vertical padding between the items and the carousel. Half the padding is at the top and half at the bottom.
    var carouselHeight = 110;  // The height of the carousel.
    var carouselWidth = itemsToShow * (rectSize + horizontalPadding);  // The width of the carousel.

    // Create the carousel container.
    var carousel = svg.append("g")
        .datum({"itemsToScrollBy": 1, "transX": carouselXLoc, "transY": carouselYLoc})
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    carousel.append("rect")
        .classed("carouselContainer", true)
        .attr("width", carouselWidth)
        .attr("height", carouselHeight);
    carousel.call(STANDARDDRAG);

    // Create the items.
    var itemData = [];
    var thisOffset;  // The offset for the current item.
    var cumulativeOffset = 0;  // The cumulative offset from the leftmost item.
    for (var i = 0; i < circleColors.length; i++)
    {
        thisOffset = cumulativeOffset + (horizontalPadding / 2);
        cumulativeOffset += (horizontalPadding + rectSize);
        itemData.push(
            {
                "color": circleColors[i],
                "height": rectSize,  // Height of the item.
                "horizontalPadding": horizontalPadding,  // Horizontal padding of the item (half on the left and half on the right).
                "key": i,  // Unique identifier for the item.
                "restingX": thisOffset,  // X position where the item should come to rest after being moved around.
                "transX": thisOffset,  // Current X position of the item.
                "transY": ((carouselHeight - rectSize) / 2),  // Current Y position of the item.
                "width": rectSize  // Width of the item.
            });
    }
    var items = create_items(carousel, rootID, itemData);

    // Clip the items to the carousel.
    var clipID = "equalDemoClip-";
    items.append("clipPath")
        .attr("id", function(d) { return clipID + d.key; })
        .append("rect")
            .classed("carouselClipRect", true)
            .attr("x", function(d) { return -d.transX; })
            .attr("y", function(d) { return -d.transY; })
            .attr("width", carouselWidth)
            .attr("height", carouselHeight);
    items.attr("clip-path", function(d) { return "url(#" + (clipID + d.key) + ")"; });

    /**********************
    * Unequal Sized Items *
    **********************/
    // Definitions needed.
    var carouselHeight = 170;  // The height of the carousel.
    var carouselWidth = 400;  // The width of the carousel.
    var carouselXLoc = 50;  // The starting X coordinate for the carousel container.
    var carouselYLoc = 130;  // The starting X coordinate for the carousel container.
    var rootID = "unequalDemoPattern-";  // The root of the IDs for the patterns created.
    var verticalPadding = 10;  // The total vertical padding between the items and the carousel. Half the padding is at the top and half at the bottom.

    // Create the carousel container.
    var carousel = svg.append("g")
        .datum({"itemsToScrollBy": 2, "transX": carouselXLoc, "transY": carouselYLoc})
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    carousel.append("rect")
        .classed("carouselContainer", true)
        .attr("width", carouselWidth)
        .attr("height", carouselHeight);
    carousel.call(STANDARDDRAG);

    // Create the items.
    var itemData = [];
    var thisWidth;  // The width of the current item.
    var thisHeight;  // The height of the current item.
    var thisPadding;  // The horizontal padding of the current item.
    var thisOffset;  // The offset for the current item.
    var cumulativeOffset = 0;  // The cumulative offset from the leftmost item.
    for (var i = 0; i < circleColors.length; i++)
    {
        thisWidth = ((i + 1) * 20);
        thisHeight = ((i + 1) * 40);
        thisPadding = ((i + 1) * 20);
        thisOffset = cumulativeOffset + (thisPadding / 2);
        cumulativeOffset += (thisPadding + thisWidth);
        itemData.push(
            {
                "color": circleColors[i],
                "height": thisHeight,
                "horizontalPadding": thisPadding,
                "key": i,
                "restingX": thisOffset,
                "transX": thisOffset,
                "transY": ((carouselHeight - thisHeight) / 2),
                "width": thisWidth});
    }
    var items = create_items(carousel, rootID, itemData);

    // Clip the items to the carousel.
    var clipID = "unequalDemoClip-";
    items.append("clipPath")
        .attr("id", function(d) { return clipID + d.key; })
        .append("rect")
            .classed("carouselClipRect", true)
            .attr("x", function(d) { return -d.transX; })
            .attr("y", function(d) { return -d.transY; })
            .attr("width", carouselWidth)
            .attr("height", carouselHeight);
    items.attr("clip-path", function(d) { return "url(#" + (clipID + d.key) + ")"; });
}

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
    var dotContainerWidth;  // The width of the g element containing the dots.
    var dotContainerHeight = 20;  // The height of the g element containing the dots.
    var dotContainerPadding = 10;  // The vertical padding of the g element containing the dots (half above and half below).

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
        // This may require going past the end of the key array, and starting to gather keys from the beginning.

        currentViewSet = keys.slice(currentIndex, currentIndex + itemsToShow);
        console.log(currentIndex);

        // Determine if more keys are needed than there are spots in the array to the right of the currentIndex. If more are needed, then loop back
        // to the start of the key array to get them. Keep looping back until the required number of keys are acquired.
        var keysNeeded = itemsToShow - currentViewSet.length;
        while (keysNeeded > 0)
        {
            console.log(keysNeeded, currentKey, currentIndex, currentViewSet);
            currentViewSet = currentViewSet.concat((keys.slice(0, keysNeeded)));  // Add the new items to the array containing the keys in this visible set.
            keysNeeded = itemsToShow - currentViewSet.length;
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
                        "width": carouselWidth
                       }

    // Create the carousel container.
    carousel
        .datum(carouselData)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    carousel.insert("rect", ":first-child")
        .classed("carouselContainer", true)
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; });

    /**************************
    * Add the Navigation Dots *
    **************************/

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

/******************************
* Item Set Creation Functions *
******************************/
function create_squares(parent, rootID)
{
    // Create a set of square items.
    // parent is the parent element where the items should be created.
    // rootID is the root that should be used when creating the IDs of the patterns and clippaths.

    // Item sizing definitions.
    var itemSize = 100;  // The height and width of the items.
    var horizontalPadding = 10;  // The total horizontal padding around each item. Half the padding is on the left and half on the right.
    var verticalPadding = 10;  // The total vertical padding around each item. Half the padding is at the top and half at the bottom.

    // Setup data used to create the items.
    var itemData = [];
    for (var i = 0; i < COLORCODES.length; i++)
    {
        itemData.push(
            {
                "color": COLORCODES[i],
                "height": itemSize,  // Height of the item.
                "horizontalPadding": horizontalPadding,  // Horizontal padding of the item (half on the left and half on the right).
                "key": i,  // Unique identifier for the item.
                "restingX": 0,  // X position where the item should come to rest after being moved around.
                "rootID": rootID,  // The root of the ID used to refer to the item clip paths.
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
                "verticalPadding": verticalPadding,  // Vertical padding of the item (half on top and half on the bottom).
                "width": itemSize  // Width of the item.
            });
    }

    // Create the items.
    var items = create_items(parent, rootID + "pattern-", itemData);

    return items;
}

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

/*******************
* Helper Functions *
*******************/
function create_items(parent, rootID, itemData)
{
    // Create a set of pattern filled rectangles to serve as items in the carousels.
    // parent is the parent element where the items should be created.
    // rootID is the root that should be used when creating the IDs of the patterns.
    // itemData is an array of the data used in creating the items. Each entry in the array contains:
    //      "color": the hexadecimal color code for the pattern.
    //      "key": an integer key assigned to each item to ensure object constancy.

    // Create the containers for the items.
    var containers = parent.selectAll(".carouselItem")
        .data(itemData, function(d) { return d.key; })
        .enter()
        .append("g")
            .classed("item", true)
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });

    /********************
    * Generate Patterns *
    ********************/
    var outerCircleRadius = 10;  // Radius of the circle containing the rectangle.
    var rectangleSize = Math.sqrt(((2 * outerCircleRadius) * (2 * outerCircleRadius)) / 2);  // Side of a square with diagonal of (2 * outerCircleRadius).
    var innerCircleRadius = 5;  // Radius of the circle inside the rectangle.

    // Initialise the patterns.
    var patterns = containers.append("pattern")
        .attr("id", function(d) { return rootID + d.color.slice(1); })  // Use the hex color code without the initial #.
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 2 * outerCircleRadius)
        .attr("height", 2 * outerCircleRadius)
        .attr("patternUnits", "userSpaceOnUse");

    // Add the outer circle to the pattern.
    patterns.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", outerCircleRadius)
        .style("fill", function(d) { return d.color; });

    // Add the rectangle to the pattern.
    patterns.append("rect")
        .attr("x", outerCircleRadius)
        .attr("y", 0)
        .attr("width", rectangleSize)
        .attr("height", rectangleSize)
        .attr("transform", "rotate(45 " + outerCircleRadius + " 0)")
        .style("fill", "black");

    // Add the inner circle to the pattern.
    patterns.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", innerCircleRadius)
        .style("fill", function(d) { return d.color; });

    /***************************
    * Generate the Final Items *
    ***************************/
    // Add the rectangle border.
    containers.append("rect")
        .classed("borderRect", true)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", function(d) { return "url(#" + rootID + d.color.slice(1) + ")"; });

    // Add the text identifying the key of the item.
    containers.append("text")
        .classed("patternNumber", true)
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .text(function(d) { return d.key; });

    return containers;
}

function create_svg(id, width, height)
{
    // Creates the given SVG element with specified width and height.
    // id is the ID of the SVG element to create.
    // width is the width for the created SVG element.
    // height is the height for the created SVG element.

    return d3.select("#" + id)
        .attr("width", width)
        .attr("height", height);
}
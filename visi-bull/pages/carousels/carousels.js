$(document).ready(function()
{
    create_pattern_demo("patternDemo");


    var svg = create_svg("demo2", 800, 300);
    svg.style("border", "thin solid black");
    var carousel = svg.append("g");
    carousel.append("rect").classed("carouselContainer", true);
    var items = create_squares(carousel, "demo2Root-");
    var params = {"carouselXLoc": 30, "carouselYLoc": 30, "itemsToShow": 2
    ,"carouselWidth": 500
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
    //      itemsToScrollBy - The number of items to scroll by in the carousel.
    //      itemsToShow - The number of items to show in the carousel.
    //      carouselHeight - The height of the carousel.
    //      carouselWidth - The width of the carousel.
    //      isInfinite - Whether the scrolling should be an infinite loop.
    //      isCentered - Whether the displayed items should be centered.

    // Definitions needed.
    var carouselXLoc = 0;  // The starting X coordinate for the carousel container.
    var carouselYLoc = 0;  // The starting X coordinate for the carousel container.
    var itemsToScrollBy = 1;  // The number of items to scroll by in the carousel. Can't be less than itemsToShow.
    var itemsToShow = 1;  // The number of items to show in the carousel. Can't be less than 1.
    var carouselHeight;  // The height of the carousel.
    var carouselWidth;  // The width of the carousel.
    var isInfinite = false;  // Whether the scrolling should be an infinite loop.
    var isCentered = false;  // Whether the displayed items should be centered.

    /*****************************
    * Parse the Input Parameters *
    *****************************/
    if (typeof params.carouselXLoc !== "undefined") carouselXLoc = params.carouselXLoc;
    if (typeof params.carouselYLoc !== "undefined") carouselYLoc = params.carouselYLoc;
    if (typeof params.itemsToShow !== "undefined") itemsToShow = Math.max(params.itemsToShow, 1);
    if (typeof params.itemsToScrollBy !== "undefined") itemsToScrollBy = d3.max([params.itemsToScrollBy, itemsToShow, 1]);
    if (typeof params.isInfinite !== "undefined") isInfinite = params.isInfinite;
    if (typeof params.isCentered !== "undefined") isCentered = params.isCentered;

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

    /**********************
    * Create the Carousel *
    **********************/
    // Create the data object for the carousel.
    var carouselData = {
                        "height": carouselHeight,
                        "isCentered": isCentered,
                        "isInfinite": isInfinite,
                        "itemsToScrollBy": itemsToScrollBy,
                        "itemsToShow": itemsToShow,
                        "leftmostItem": 0,  // The left edge (including half the horizontal padding) of the leftmost item in the carousel.
                        "rightmostItem": 0,  // The right edge (including half the horizontal padding) of the rightmost item in the carousel.
                        "transX": carouselXLoc,
                        "transY": carouselYLoc,
                        "width": carouselWidth
                       }

    // Create the carousel container.
    carousel
        .datum(carouselData)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    carousel.select(".carouselContainer")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; });

    /******************
    * Setup the Items *
    ******************/
    var thisOffset = 0;  // The offset for the current item.
    var cumulativeOffset = thisOffset;  // The cumulative offset from the leftmost item.
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
            thisOffset -= itemWidths[numberOfItemsLeftOfCenter + 1] / 2;
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
        var leftmostEdge = carouselWidth;  // The leftmost edge of the left item in the carousel.
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
                    leftmostEdge = Math.min(leftmostEdge, firstItemOffset - totalItemWidths);
                }
                else
                {
                    // The cumulativeOffset of the items is still within the carousel, so keep adding items to the right.
                    thisOffset = cumulativeOffset + (d.horizontalPadding / 2);
                    cumulativeOffset += (d.horizontalPadding + d.width);
                }
                d.restingX = thisOffset;
                d.transX = thisOffset;
                d.transY = (carouselHeight / 2) - (d.height / 2);
                return "translate(" + d.transX + "," + d.transY + ")";
            });

            // Update the left and rightmost edges of the items in the carousel.
            carousel.datum().leftmostItem = leftmostEdge;  // The leftmost edge in the carousel is the left edge of the first item added to the right.
            carousel.datum().rightmostItem = cumulativeOffset;  // The rightmost edge in the carousel is the right edge of the last item added to the right.
    }
    else
    {
        // Position the items if the scrolling is not infinite.
        carousel.datum().leftmostItem = leftmostEdge;  // The leftmost edge in the carousel is the left edge of the first item added to the right.
        items.attr("transform", function(d)
            {
                thisOffset = cumulativeOffset + (d.horizontalPadding / 2);
                cumulativeOffset += (d.horizontalPadding + d.width);
                d.restingX = thisOffset;
                d.transX = thisOffset;
                d.transY = (carouselHeight / 2) - (d.height / 2);
                return "translate(" + d.transX + "," + d.transY + ")";
            });
        carousel.datum().rightmostItem = cumulativeOffset;  // The rightmost edge in the carousel is the right edge of the last item added to the right.
    }

    // Add the drag behaviour for items.
    if (isInfinite)
    {
        carousel.call(INFINITEDRAG);
    }
    else
    {
        carousel.call(STANDARDDRAG);
    }

    // Clip the items to the carousel.
    items.select(".carouselClip")
        .append("rect")
            .classed("carouselClipRect", true)
            .attr("x", function(d) { return -d.transX; })
            .attr("y", function(d) { return -d.transY; })
            .attr("width", carouselWidth)
            .attr("height", carouselHeight);

    return carousel;
}

/*****************
* Drag Functions *
*****************/
function drag_infinite_update(d)
{
    var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

    // Update the left and rightmost item positions in the carousel.
    d.leftmostItem += changeInPosition;
    d.rightmostItem += changeInPosition;

    // Determine whether any items need to switch to the opposite side of the carousel.
    var swapToLeft = d.leftmostItem >= -10;  // Whether the rightmost item needs to swap to out of view on the left side of the carousel.
    var swapToRight = d.rightmostItem <= d.width + 10;  // Whether the leftmost item needs to swap to out of view on the right side of the carousel.

    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Update the position of the items.
    items
        .attr("transform", function(itemD)
            {
                itemD.transX += changeInPosition;
                return "translate(" + itemD.transX + "," + itemD.transY + ")";
            });

    // Update the positions of the items clip paths.
    items.selectAll(".carouselClipRect")
        .attr("x", function(itemD) { return -itemD.transX; });
}

function drag_standard_end(d)
{
    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Transition the items, and clips paths, to their correct resting places.
    var edges = update_item_positions(items);

    // Update the left and rightmost item positions in the carousel.
    d.leftmostItem = edges.leftmostItem;
    d.rightmostItem = edges.rightmostItem;
}

function drag_standard_update(d)
{
    var changeInPosition = d3.event.dx;  // The movement caused by the dragging.

    // Update the left and rightmost item positions in the carousel.
    d.leftmostItem += changeInPosition;
    d.rightmostItem += changeInPosition;

    // Get the items in the carousel.
    var items = d3.select(this).selectAll(".item");

    // Update the position of the items.
    items
        .attr("transform", function(itemD)
            {
                itemD.transX += changeInPosition;
                return "translate(" + itemD.transX + "," + itemD.transY + ")";
            });

    // Update the positions of the items clip paths.
    items.selectAll(".carouselClipRect")
        .attr("x", function(itemD) { return -itemD.transX; });
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
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
                "verticalPadding": verticalPadding,  // Vertical padding of the item (half on top and half on the bottom).
                "width": itemSize  // Width of the item.
            });
    }

    // Create the items.
    var items = create_items(parent, rootID + "pattern-", itemData);

    // Initialise the items clippaths (these will then have the actual path added when the carousel is created).
    var clipID = rootID + "clip-";
    items.append("clipPath")
        .classed("carouselClip", true)
        .attr("id", function(d) { return clipID + d.key; });
    items.attr("clip-path", function(d) { return "url(#" + (clipID + d.key) + ")"; });

    return items;
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

function update_item_positions(items)
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

    // Record the left and rightmost edges of the items in the carousel.
    // The leftmost edge is not the leftmost edge of the visual portion of the leftmost item. Rather, it is this position minus half the
    // item's horizontal padding. Similar for the rightmost edge, but instead half the horizontal padding is added.
    var itemData = items.data();
    var leftmostItemEdge = d3.min(itemData.map(function(d) { return d.restingX - (d.horizontalPadding / 2); }));
    var rightmostItemEdge = d3.max(itemData.map(function(d) { return d.restingX + (d.horizontalPadding / 2) + d.width; }));

    return {"leftmostItem": leftmostItemEdge, "rightmostItem": rightmostItemEdge};
}
$(document).ready(function()
{
//    create_pattern_demo("patternDemo");


    var svg = create_svg("demo2", 800, 300);
    svg.style("border", "thin solid black");
    var items = create_squares(svg, "demo2Root-");
	var carousel = carouselCreator(items)
		//.width(600)
		//.height(200)
		.xLoc(370)
		.yLoc(50)
		//.isDots(true)
		.itemsToShow(3)
		.itemsToScrollBy(3)
		//.isInfinite(true)
		//.isCentered(true)
		//.scrollPath("loop")
		.navArrowWidth(25)
		.navArrowHeight(50)
		;
	svg.call(carousel);
	console.log(carousel.isInfinite(), carousel.isCentered());
	
	
	
	
    var params = {"carouselXLoc": 30, "carouselYLoc": 30, "itemsToShow": 3
    , "itemsToScrollBy": 1
    , "carouselWidth": 600
    , "isCentered": true
    , "isInfinite": true
    };
//    carousel = create_carousel(items, carousel, params);
});

// Define the colors used for the demos.
var COLORCODES = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B"];//, "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

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
* Item Set Creation Functions *
******************************/
function create_squares(parent, rootID)
{
    // Create a set of square items.
    // parent is the parent element where the items should be created.
    // rootID is the root that should be used when creating the IDs of the patterns and clippaths.

    // Item sizing definitions.
    var itemSize = 60;  // The height and width of the items.
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
//                "restingX": 0,  // X position where the item should come to rest after being moved around.
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
$(document).ready(function()
{
    create_pattern_demo("patternDemo");
});

// Define the colors used for the demos.
var COLORCODES = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

// Define an example carousel creation argument object.
/*
    {
        "itemsToShow" : 1,  // The number of items to show in the carousel's viewport. Defaults to 1.
        "itemsToScroll" : 1,  // The number of items to scroll by. Defaults to 1. Can not be larger than the number of items to show.
        "isInfinite" : false,  // Whether the scrolling should be an infinite loop. Defaults to not infinite.
        "isCentered" : false,  // Whether the displayed items should be centered. Defaults to not centered (left justified).
    }
*/

/*************************
* Demo Drawing Functions *
*************************/
function create_pattern_demo(svgID)
{
    // Creates just the items to how what they will look like.
    // svgID is the id of the SVG element that should contain the demo.

    // Definitions for both demos.
    var circleColors = [COLORCODES[2], COLORCODES[3], COLORCODES[4], COLORCODES[5]];  // The colors to use to create patterns. One pattern per color.
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
    var carouselHeight = 110;  // The height of the carousel.
    var carouselXLoc = 30;  // The starting X coordinate for the carousel container.
    var carouselYLoc = 10;  // The starting X coordinate for the carousel container.
    var itemsToShow = circleColors.length;  // The number of items to show in the carousel.
    var rootID = "equalDemoPattern-";  // The root of the IDs for the patterns created.
    var rectSize = 100;  // The size of the rect to be filled with the pattern.
    var hoizontalPadding = 10;  // The total horizontal padding around each item. Half the padding is on the left and half on the right.
    var verticalPadding = 10;  // The total vertical padding between the items and the carousel. Half the padding is at the top and half at the bottom.

    // Create the carousel container.
    var carousel = svg.append("g")
        .attr("transform", "translate(" + carouselXLoc + "," + carouselYLoc + ")");
    carousel.append("rect")
        .attr("width", itemsToShow * (rectSize + hoizontalPadding))
        .attr("height", carouselHeight)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 1);

    // Create the items.
    var itemData = [];
    for (var i = 0; i < circleColors.length; i++)
    {
        itemData.push({"color": circleColors[i], "height": rectSize, "hoizontalPadding": hoizontalPadding, "key": i, "width": rectSize});
    }
    var items = create_items(carousel, rootID, itemData);

    // Position the items.
    var thisOffset;  // The offset for the current item.
    var cumulativeOffset = 0;  // The cumulative offset from the leftmost item.
    items.attr("transform", function(d, i)
        {
            thisOffset = cumulativeOffset + (d.hoizontalPadding / 2);
            cumulativeOffset += (d.hoizontalPadding + d.width);
            return "translate(" + thisOffset + "," + ((carouselHeight - d.height) / 2) + ")";
        });

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
        .attr("transform", "translate(" + carouselXLoc + "," + carouselYLoc + ")");
    carousel.append("rect")
        .attr("width", carouselWidth)
        .attr("height", carouselHeight)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 1);

    // Create the items.
    var itemData = [];
    for (var i = 0; i < circleColors.length; i++)
    {
        itemData.push({"color": circleColors[i], "height": ((i + 1) * 40), "hoizontalPadding": ((i + 1) * 20), "key": i, "width": ((i + 1) * 20)});
    }
    var items = create_items(carousel, rootID, itemData);

    // Position the items.
    var thisOffset;  // The offset for the current item.
    var cumulativeOffset = 0;  // The cumulative offset from the leftmost item.
    items.attr("transform", function(d, i)
        {
            thisOffset = cumulativeOffset + (d.hoizontalPadding / 2);
            cumulativeOffset += (d.hoizontalPadding + d.width);
            return "translate(" + thisOffset + "," + ((carouselHeight - d.height) / 2) + ")";
        });
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
    var containers = parent.selectAll(".container")
        .data(itemData, function(d) { return d.key; })
        .enter()
        .append("g")
            .classed("item", true)
            .attr("transform", "translate(0,0)");

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
$(document).ready(function()
{
    // Create the single item non-infinite scrolling demo.
    single_non_infinite("Single-Non-Inf");

    // Create the single item infinite scrolling demo.
    single_infinite("Single-Inf");

/*
    var svg = create_svg("demo2", 800, 300);
    svg.style("border", "thin solid black");
    var items = create_squares(svg, "demo2Root-");
    var carousel = carouselCreator(items)
        //.width(600)
        //.height(200)
        .xLoc(370)
        .yLoc(50)
        //.isArrows(false)
        .isDots(true)
        .itemsToShow(2)
        .itemsToScrollBy(2)
        .isInfinite(true)
        .isCentered(true)
        //.scrollPath("loop")
        //.navArrowWidth(25)
        //.navArrowHeight(50)
        ;
    svg.call(carousel);
*/
});

// Define the colors used for the demos.
var COLORCODES = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

// Define the style for the items.
var fillColor = "black";
var strokeType = "none";
var numberFill = "white";
var numberFont = "70px";
var numberFontWeight = "bold";
var numberStroke = "none";

function single_infinite(svgID)
{

    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 400;
    var itemData = [];
    for (var i = 0; i < 6; i++)
    {
        itemData.push(
            {
                "height": 100,  // Height of the item.
                "horizontalPadding": 10,  // Horizontal padding of the item (half on the left and half on the right).
                "key": i,  // Unique identifier for the item.
                "rootID": svgID,  // The root of the ID used to refer to the item clip paths.
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
                "verticalPadding": 10,  // Vertical padding of the item (half on top and half on the bottom).
                "width": itemWidth  // Width of the item.
            });
    }

    // Create the items.
    var items = svg.selectAll(".item")
        .data(itemData)
        .enter()
        .append("g")
            .classed("item", true)
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    items.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", fillColor)
        .style("stroke", strokeType);
    items.append("text")
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", numberFill)
        .style("font-size", numberFont)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return d.key; });

    // Create the carousel.
    var carousel = carouselCreator(items)
        .xLoc(20)
        .yLoc(5)
        .isDots(true)
        .itemsToShow(1)
        .itemsToScrollBy(1)
        .dotContainerHeight(30)
        .isInfinite(true)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

function single_non_infinite(svgID)
{

    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 400;
    var itemData = [];
    for (var i = 0; i < 6; i++)
    {
        itemData.push(
            {
                "height": 100,  // Height of the item.
                "horizontalPadding": 10,  // Horizontal padding of the item (half on the left and half on the right).
                "key": i,  // Unique identifier for the item.
                "rootID": svgID,  // The root of the ID used to refer to the item clip paths.
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
                "verticalPadding": 10,  // Vertical padding of the item (half on top and half on the bottom).
                "width": itemWidth  // Width of the item.
            });
    }

    // Create the items.
    var items = svg.selectAll(".item")
        .data(itemData)
        .enter()
        .append("g")
            .classed("item", true)
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    items.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", fillColor)
        .style("stroke", strokeType);
    items.append("text")
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", numberFill)
        .style("font-size", numberFont)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return d.key; });

    // Create the carousel.
    var carousel = carouselCreator(items)
        .xLoc(20)
        .yLoc(5)
        .isDots(true)
        .itemsToShow(1)
        .itemsToScrollBy(1)
        .dotContainerHeight(30)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}
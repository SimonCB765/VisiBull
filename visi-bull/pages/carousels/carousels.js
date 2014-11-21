$(document).ready(function()
{
    // Define the colors used for the demos.
    var colorCodes = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

    create_pattern_demo("#patternDemo");

    function create_pattern_demo(svgID)
    {
        // Definitions needed.
        var svgWidth = 500;  // The width of the SVG element.
        var svgHeight = 120;  // The height of the SVG element.
        var rectSize = 100;  // The size of the rect to be filled with the pattern.
        var rootID = "demoPattern-";  // The root of the IDs for the patterns created.
        var circleColors = [colorCodes[2], colorCodes[3], colorCodes[4], colorCodes[5]];  // The colors to use to create patterns. One pattern per color.

        // Create the SVG element.
        var svg = d3.select(svgID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Create the patterns.
        var defs = svg.append("defs");
        create_patterns(rootID, defs, circleColors)

        // Create the pattern filled rectangle.
        svg.selectAll(".backingRect")
            .data(circleColors)
            .enter()
            .append("rect")
                .classed("backingRect", true)
                .attr("x", function(d, i) { return 10 + (i * (rectSize + 10)); })
                .attr("y", 10)
                .attr("width", rectSize)
                .attr("height", rectSize)
                .style("fill", function(d) { return "url(#" + rootID + d.slice(1) + ")"; });
    }
});

/*******************
* Helper Functions *
*******************/
function create_patterns(rootID, defs, circleColors)
{
    // Create a number of patterns equal to the number of circle colors supplied.
    // rootID is the root that should be used when creating the IDs of the patterns.
    // defs is the SVG element in which to create the patterns.
    // circleColors is an array of the colors for the circles. One pattern is created using each color.

    var outerCircleRadius = 10;  // Radius of the circle containing the rectangle.
    var rectangleSize = Math.sqrt(((2 * outerCircleRadius) * (2 * outerCircleRadius)) / 2);  // Side of a square with diagonal of (2 * outerCircleRadius).
    var innerCircleRadius = 5;  // Radius of the circle inside the rectangle.

    // Initialise the patterns.
    var patterns = defs.selectAll("pattern")
        .data(circleColors)
        .enter()
        .append("pattern")
            .attr("id", function(d) { return rootID + d.slice(1); })  // Use the hex color code without the initial #.
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 2 * outerCircleRadius)
            .attr("height", 2 * outerCircleRadius)
            .attr("patternUnits", "userSpaceOnUse");

    // Add the outer circles.
    patterns.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", outerCircleRadius)
        .style("fill", function(d) { return d; });

    // Add the rectangle.
    patterns.append("rect")
        .attr("x", outerCircleRadius)
        .attr("y", 0)
        .attr("width", rectangleSize)
        .attr("height", rectangleSize)
        .attr("transform", "rotate(45 " + outerCircleRadius + " 0)")
        .style("fill", "black");

    // Add the inner circle.
    patterns.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", innerCircleRadius)
        .style("fill", function(d) { return d; });
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
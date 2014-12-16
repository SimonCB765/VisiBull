$(document).ready(function()
{
    // Create the infinite draggable item demos.
    indiv_drag("Indiv-Non-Var", true);
    indiv_variable_item_drag("Indiv-Var", true);

    // Create the non-infinite draggable item demos.
    indiv_drag("Indiv-Non-Var-Non-Inf", false);
    indiv_variable_item_drag("Indiv-Var-Non-Inf", false);
});

// Define the style for the items.
var fillColor = "black";
var strokeType = "none";
var numberFill = "white";
var numberFont = "70px";
var numberFontWeight = "bold";
var numberStroke = "none";

function indiv_drag(svgID, isInf)
{

    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 80;
    var itemData = [];
    for (var i = 0; i < 8; i++)
    {
        itemData.push(
            {
                "height": 100,  // Height of the item.
                "key": i,  // Unique identifier for the item.
                "rootID": svgID,  // The root of the ID used to refer to the item clip paths.
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
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
    var carousel;
    if (isInf)
    {
        carousel = moveableItemCarousels(items)
            .width(420)
            .height(150)
            .xLoc(15)
            .yLoc(0)
            .horizontalPadding(20)
            .dotContainerHeight(30)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    else
    {
        carousel = dragItemCarouselsNonInf(items)
            .width(420)
            .height(150)
            .xLoc(15)
            .yLoc(0)
            .horizontalPadding(20)
            .dotContainerHeight(30)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    svg.call(carousel);
}

function indiv_variable_item_drag(svgID, isInf)
{

    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var item = svg.append("g")
        .datum({"height": 100, "key": 0, "rootID": svgID, "transX": 0, "transY": 0, "width": 100})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 1, "rootID": svgID, "transX": 0, "transY": 0, "width": 80})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("circle")
        .attr("r", 40)
        .attr("cx", 40)
        .attr("cy", 40)
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 90, "key": 2, "rootID": svgID, "transX": 0, "transY": 0, "width": 90})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("path")
        .attr("d", "M0,45L45,90L90,45L45,0Z")
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 40, "key": 3, "rootID": svgID, "transX": 0, "transY": 0, "width": 80})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("ellipse")
        .attr("rx", 40)
        .attr("ry", 20)
        .attr("cx", 40)
        .attr("cy", 20)
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 4, "rootID": svgID, "transX": 0, "transY": 0, "width": 40})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("ellipse")
        .attr("rx", 20)
        .attr("ry", 40)
        .attr("cx", 20)
        .attr("cy", 40)
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 50, "key": 5, "rootID": svgID, "transX": 0, "transY": 0, "width": 100})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", fillColor)
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 6, "rootID": svgID, "transX": 0, "transY": 0, "width": 80})
        .classed("item", true)
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    item.append("path")
        .attr("d", "M0,0L40,80L80,0Z")
        .style("fill", fillColor)
        .style("stroke", strokeType);

    // Create the carousel.
    var items = svg.selectAll(".item");
    var carousel;
    if (isInf)
    {
        carousel = moveableItemCarousels(items)
            .width(420)
            .height(150)
            .xLoc(20)
            .yLoc(0)
            .horizontalPadding(20)
            .dotContainerHeight(30)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    else
    {
        carousel = dragItemCarouselsNonInf(items)
            .width(420)
            .height(150)
            .xLoc(20)
            .yLoc(0)
            .horizontalPadding(20)
            .dotContainerHeight(30)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    svg.call(carousel);
}
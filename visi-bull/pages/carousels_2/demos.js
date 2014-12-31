$(document).ready(function()
{
    // Create the infinite draggable item demos.
    indiv_drag("Indiv-Non-Var", true);
    indiv_variable_item_drag("Indiv-Var", true);

    // Create the non-infinite draggable item demos.
    indiv_drag("Indiv-Non-Var-Non-Inf", false);
    indiv_variable_item_drag("Indiv-Var-Non-Inf", false);

    // Create the drag and drop demos.
    drag_drop("Drag-Drop-Var", true);
});

// Define the colors used for the demos.
var COLORCODES = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A"];

// Define the style for the items.
var strokeType = "none";
var numberFill = "black";
var numberFontWeight = "bold";
var numberStroke = "none";

function drag_drop(svgID, isInf)
{
    var svg = d3.select("#" + svgID)
        .attr("width", 800)
        .attr("height", 500)
        .style("outline", "thin black solid");

    // Setup data used to create the items.
    var item = svg.append("g")
        .datum({"height": 100, "key": 0, "rootID": svgID, "width": 100})
        .classed("item", true);
    item.append("path")
        .attr("d", function(d) { return "m0,0h" + d.width + "v" + d.height + "h" + -d.width + "v" + -d.height; })
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 1, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("path")
        .attr("d", "m0,40a40,40,0,1,0,80,0a40,40,0,1,0,-80,0")
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 90, "key": 2, "rootID": svgID, "width": 90})
        .classed("item", true);
    item.append("path")
        .attr("d", "m0,45l45,45l45,-45l-45,-45Z")
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 40, "key": 3, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("path")
        .attr("d", "m0,20a40,20,0,1,0,80,0a40,20,0,1,0,-80,0")
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 4, "rootID": svgID, "width": 40})
        .classed("item", true);
    item.append("path")
        .attr("d", "m0,40a20,40,0,1,0,40,0a20,40,0,1,0,-40,0")
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 50, "key": 5, "rootID": svgID, "width": 100})
        .classed("item", true);
    item.append("path")
        .attr("d", function(d) { return "m0,0h" + d.width + "v" + d.height + "h" + -d.width + "v" + -d.height; })
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 6, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("path")
        .attr("d", "m0,0l40,80l40,-80Z")
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);

    // Create the carousel.
    var items = svg.selectAll(".item");
    items.append("text")
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", numberFill)
        .style("font-size", 40)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return d.key; });
    var carousel;
    if (isInf)
    {
        carousel = dragAndDropCarousel(items)
            .width(400)
            .height(150)
            .xLoc(200)
            .yLoc(175)
            .isInfinite(true)
            .horizontalPadding(20)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    else
    {
        carousel = dragAndDropCarousel(items)
            .width(400)
            .height(150)
            .xLoc(200)
            .yLoc(175)
            .horizontalPadding(20)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    svg.call(carousel);
}

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
                "width": itemWidth  // Width of the item.
            });
    }

    // Create the items.
    var items = svg.selectAll(".item")
        .data(itemData)
        .enter()
        .append("g")
            .classed("item", true);
    items.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d, i) { return COLORCODES[i]; })
        .style("stroke", strokeType);
    items.append("text")
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", numberFill)
        .style("font-size", 70)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return d.key; });

    // Create the carousel.
    var carousel;
    if (isInf)
    {
        carousel = draggableItemCarousel(items)
            .width(420)
            .height(150)
            .xLoc(15)
            .yLoc(0)
            .isInfinite(true)
            .horizontalPadding(20)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    else
    {
        carousel = draggableItemCarousel(items)
            .width(420)
            .height(150)
            .xLoc(15)
            .yLoc(0)
            .horizontalPadding(20)
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
        .datum({"height": 100, "key": 0, "rootID": svgID, "width": 100})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 1, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 90, "key": 2, "rootID": svgID, "width": 90})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 40, "key": 3, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 4, "rootID": svgID, "width": 40})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 50, "key": 5, "rootID": svgID, "width": 100})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);
    item = svg.append("g")
        .datum({"height": 80, "key": 6, "rootID": svgID, "width": 80})
        .classed("item", true);
    item.append("rect")
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", function(d) { return COLORCODES[d.key]; })
        .style("stroke", strokeType);

    // Create the carousel.
    var items = svg.selectAll(".item");
    items.append("text")
        .attr("x", function(d) { return d.width / 2; })
        .attr("y", function(d) { return d.height / 2; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", numberFill)
        .style("font-size", 40)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return d.key; });
    var carousel;
    if (isInf)
    {
        carousel = draggableItemCarousel(items)
            .width(420)
            .height(150)
            .xLoc(20)
            .yLoc(0)
            .isInfinite(true)
            .horizontalPadding(20)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    else
    {
        carousel = draggableItemCarousel(items)
            .width(420)
            .height(150)
            .xLoc(20)
            .yLoc(0)
            .horizontalPadding(20)
            .navArrowWidth(40)
            .navArrowHeight(40);
    }
    svg.call(carousel);
}
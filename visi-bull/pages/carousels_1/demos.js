$(document).ready(function()
{
    // Create the single item non-infinite scrolling demo.
    single_non_infinite("Single-Non-Inf");

    // Create the single item infinite scrolling demo.
    single_infinite("Single-Inf");

    // Create the multi item non-infinite scrolling demo.
    multi_non_infinite("Multi-Non-Inf");

    // Create the multi item infinite scrolling demo.
    multi_infinite("Multi-Inf");

    // Create the centered non-infinite scrolling demo.
    center_non_infinite("Center-Non-Inf");

    // Create the centered infinite scrolling demo.
    center_infinite("Center-Inf");

    // Create the variable item width/height demos.
    var_size("Var-Size-Non-Inf", false, false);
    var_size("Var-Size-Inf", true, true);

    // Create the variable shaped item demos.
    var_shape("Var-Shape-Non-Inf", false, false);
    var_shape("Var-Shape-Inf", true, true);
});

// Define the style for the items.
var fillColor = "black";
var strokeType = "none";
var numberFill = "white";
var numberFont = "70px";
var numberFontWeight = "bold";
var numberStroke = "none";

function center_infinite(svgID)
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
    var carousel = standardCarousel(items)
        .width(420)
        .xLoc(15)
        .yLoc(5)
        .isCentered(true)
        .isDots(true)
        .itemsToShow(3)
        .itemsToScrollBy(2)
        .dotContainerHeight(30)
        .isInfinite(true)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

function center_non_infinite(svgID)
{
    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 130;
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
    var carousel = standardCarousel(items)
        .width(420)
        .xLoc(15)
        .yLoc(5)
        .isCentered(true)
        .isDots(true)
        .itemsToShow(2)
        .itemsToScrollBy(1)
        .dotContainerHeight(30)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

function multi_infinite(svgID)
{
    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 200;
    var itemData = [];
    for (var i = 0; i < 6; i++)
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
    var carousel = standardCarousel(items)
        .xLoc(15)
        .yLoc(5)
        .isDots(true)
        .itemsToShow(2)
        .itemsToScrollBy(2)
        .dotContainerHeight(30)
        .isInfinite(true)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

function multi_non_infinite(svgID)
{
    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 100;
    var itemData = [];
    for (var i = 0; i < 6; i++)
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
    var carousel = standardCarousel(items)
        .xLoc(5)
        .yLoc(5)
        .isDots(true)
        .itemsToShow(4)
        .itemsToScrollBy(4)
        .dotContainerHeight(30)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

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
    var carousel = standardCarousel(items)
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
    var carousel = standardCarousel(items)
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

function var_size(svgID, makeInf, centerIt)
{
    var svg = d3.select("#" + svgID)
        .attr("width", 450)
        .attr("height", 150);

    // Setup data used to create the items.
    var itemWidth = 0;
    var itemData = [];
    for (var i = 0; i < 6; i++)
    {
        itemData.push(
            {
                "height": 0,  // Height of the item.
                "key": i,  // Unique identifier for the item.
                "rootID": svgID,  // The root of the ID used to refer to the item clip paths.
                "transX": 0,  // Current X position of the item.
                "transY": 0,  // Current Y position of the item.
                "width": itemWidth  // Width of the item.
            });
    }
    itemData[0].width = 200
    itemData[0].height = 50
    itemData[1].width = 100
    itemData[1].height = 75
    itemData[2].width = 75
    itemData[2].height = 40
    itemData[3].width = 225
    itemData[3].height = 100
    itemData[4].width = 300
    itemData[4].height = 110
    itemData[5].width = 180
    itemData[5].height = 90

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
        .style("font-size", 15)
        .style("font-weight", numberFontWeight)
        .style("stroke", numberStroke)
        .text(function(d) { return "W" + d.width + ",H" + d.height; });

    // Create the carousel.
    var carousel = standardCarousel(items)
        .width(420)
        .xLoc(20)
        .yLoc(0)
        .isInfinite(makeInf)
        .isCentered(centerIt)
        .isDots(true)
        .itemsToShow(1)
        .itemsToScrollBy(1)
        .dotContainerHeight(30)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}

function var_shape(svgID, makeInf, centerIt)
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
    var carousel = standardCarousel(items)
        .width(420)
        .xLoc(20)
        .yLoc(0)
        .isInfinite(makeInf)
        .isCentered(centerIt)
        .isDots(true)
        .itemsToShow(1)
        .itemsToScrollBy(1)
        .dotContainerHeight(30)
        .navArrowWidth(40)
        .navArrowHeight(40);
    svg.call(carousel);
}
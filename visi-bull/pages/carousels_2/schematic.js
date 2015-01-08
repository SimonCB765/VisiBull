var schematicWidth = 850,  // The width of the entire svgSchema.
    schematicHeight = 250,  // The height of the entire svgSchema.
    carouselWidth = 600,
    carouselHeight = 150,
    carouselOffsetX = (schematicWidth - carouselWidth) / 2,  // The offset of the left edge of the carousel from the left edge of the svgSchema.
    carouselOffsetY = 25,  // The offset of the top edge of the carousel from the top edge of the svgSchema.
    middleOfCarouselX = carouselOffsetX + (carouselWidth / 2),  // The X coordinate of the center of the carousel.
    itemContainerWidth = carouselWidth - 10,
    itemContainerHeight = 140,
    middleOfItemContainerY = carouselOffsetY + 75,  // The Y coordinate of the center of the item container portion of the carousel.
    itemWidth = 80,
    itemHeight = 90,
    itemHorizontalPadding = 30;  // The horizontal spacing between items.
    navArrowWidth = 50,  // The width of the box containing the navigation arrow.
    navArrowHeight = 50,  // The height of the box containing the navigation arrow.
    defaultColor = "#F8F8F8";

// Setup the svgSchema.
var svgSchema = d3.select("#schematic")
    .attr("width", schematicWidth)
    .attr("height", schematicHeight);

// Add the carousel outline.
var carouselSchema = svgSchema.append("rect")
    .attr("x", carouselOffsetX)
    .attr("y", carouselOffsetY)
    .attr("width", carouselWidth)
    .attr("height", carouselHeight)
    .style("fill", defaultColor)
    .style("stroke", "black");

// Add the item container.
var itemContainerSchema = svgSchema.append("rect")
    .attr("x", carouselOffsetX + 5)
    .attr("y", carouselOffsetY + 5)
    .attr("width", itemContainerWidth)
    .attr("height", itemContainerHeight)
    .style("fill", defaultColor)
    .style("stroke", "black");

// Add the scroll path.
var scrollPathSchema = svgSchema.append("path")
    .attr("d", "M25," + middleOfItemContainerY + "h" + (schematicWidth - 50))
    .style("fill", "none")
    .style("stroke", "black");

// Add the items.
itemData = [{"x": middleOfCarouselX - (itemWidth / 2) - itemHorizontalPadding - itemWidth, "y": middleOfItemContainerY - (itemHeight / 2)},
            {"x": middleOfCarouselX - (itemWidth / 2), "y": middleOfItemContainerY - (itemHeight / 2)},
            {"x": middleOfCarouselX + (itemWidth / 2) + itemHorizontalPadding, "y": middleOfItemContainerY - (itemHeight / 2)}];
var itemSchema = svgSchema.selectAll(".schematicItem")
    .data(itemData)
    .enter()
    .append("rect")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", itemWidth)
        .attr("height", itemHeight)
        .style("fill", defaultColor)
        .style("stroke", "black");

// Add the navigation arrows.
arrowData = [{"x": carouselOffsetX + (navArrowWidth / 2), "y": middleOfItemContainerY - (navArrowHeight / 2)},
             {"x": carouselOffsetX + carouselWidth - (navArrowWidth * 3 / 2), "y": middleOfItemContainerY - (navArrowHeight / 2)}];
var navArrowLeftSchema = svgSchema.append("g")
    .datum(arrowData[0])
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
navArrowLeftSchema.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", navArrowWidth)
    .attr("height", navArrowHeight)
    .style("fill", defaultColor)
    .style("stroke", "black");
navArrowLeftSchema.append("path")
    .attr("d", "M" + (navArrowWidth * 3 / 5) + ",0" +
               "L" + (navArrowWidth / 6) + "," + (navArrowHeight / 2) +
               "L" + (navArrowWidth * 3 / 5) + "," + navArrowHeight +
               "H" + (navArrowWidth * 4 / 5) +
               "L" + (navArrowWidth * 3 / 7) + "," + (navArrowHeight / 2) +
               "L" + (navArrowWidth * 4 / 5) + ",0" +
               "Z"
         )
    .style("fill", "black")
    .style("stroke", "black");
var navArrowRightSchema = svgSchema.append("g")
    .datum(arrowData[1])
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
navArrowRightSchema.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", navArrowWidth)
    .attr("height", navArrowHeight)
    .style("fill", defaultColor)
    .style("stroke", "black");
navArrowRightSchema.append("path")
    .attr("d", "M" + (navArrowWidth * 2 / 5) + ",0" +
               "L" + (navArrowWidth * 5 / 6) + "," + (navArrowHeight / 2) +
               "L" + (navArrowWidth * 2 / 5) + "," + navArrowHeight +
               "H" + (navArrowWidth / 5) +
               "L" + (navArrowWidth * 4 / 7) + "," + (navArrowHeight / 2) +
               "L" + (navArrowWidth / 5) + ",0" +
               "Z"
         )
    .style("fill", "black")
    .style("stroke", "black");

// Add the labels.
var textStart = 178.5;
var label = svgSchema.append("text")
    .attr("x", textStart)
    .attr("y", schematicHeight - 25)
    .text("g.carousel")
    .style("fill", "black")
    .style("stroke", "none")
    .style("cursor", "default")
    .on("mouseenter", function() { carouselSchema.style("stroke", "#FF008C").style("stroke-width", 8); })
    .on("mouseleave", function() { carouselSchema.style("stroke", "black").style("stroke-width", 2); });
textStart += label.node().getComputedTextLength() + 20;
label = svgSchema.append("text")
    .attr("x", textStart)
    .attr("y", schematicHeight - 25)
    .text("g.itemContainer")
    .style("fill", "black")
    .style("stroke", "none")
    .style("cursor", "default")
    .on("mouseenter", function() { itemContainerSchema.style("stroke", "#FF008C").style("stroke-width", 8); })
    .on("mouseleave", function() { itemContainerSchema.style("stroke", "black").style("stroke-width", 2); });
textStart += label.node().getComputedTextLength() + 20;
label = svgSchema.append("text")
    .attr("x", textStart)
    .attr("y", schematicHeight - 25)
    .text("path.scrollPath")
    .style("fill", "black")
    .style("stroke", "none")
    .style("cursor", "default")
    .on("mouseenter", function() { scrollPathSchema.style("stroke", "#FF008C").style("stroke-width", 8); })
    .on("mouseleave", function() { scrollPathSchema.style("stroke", "black").style("stroke-width", 2); });
textStart += label.node().getComputedTextLength() + 20;
label = svgSchema.append("text")
    .attr("x", textStart)
    .attr("y", schematicHeight - 25)
    .text("g.item")
    .style("fill", "black")
    .style("stroke", "none")
    .style("cursor", "default")
    .on("mouseenter", function() { itemSchema.style("stroke", "#FF008C").style("stroke-width", 8); })
    .on("mouseleave", function() { itemSchema.style("stroke", "black").style("stroke-width", 2); });
textStart += label.node().getComputedTextLength() + 20;
label = svgSchema.append("text")
    .attr("x", textStart)
    .attr("y", schematicHeight - 25)
    .text("g.navArrow")
    .style("fill", "black")
    .style("stroke", "none")
    .style("cursor", "default")
    .on("mouseenter", function() { navArrowLeftSchema.select("rect").style("stroke", "#FF008C").style("stroke-width", 8); navArrowRightSchema.select("rect").style("stroke", "#FF008C").style("stroke-width", 8); })
    .on("mouseleave", function() { navArrowLeftSchema.select("rect").style("stroke", "black").style("stroke-width", 2); navArrowRightSchema.select("rect").style("stroke", "black").style("stroke-width", 2); });
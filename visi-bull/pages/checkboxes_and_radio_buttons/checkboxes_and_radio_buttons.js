$(document).ready(function()
{
    // Define the labels and their corresponding colors.
    var labels = ["Green", "Orange", "Pink", "Purple", "Seafoam Green", "Sky Blue", "Yellow", "Bright Red", "Light Salmon", "Orangey Red"];  // Labels for the checkboxes.
    var colorCodes = ["#00FF00", "#FFAF1A", "#FF008C", "#AE2DE3", "#00FF7B", "#00FFFF", "#FFFF00", "#FF0000", "#FFA07A", "#FF4500"];  // Color codes corresponding to the label names.

    // Create the checkboxes and radio buttons.
    create_tick_boxes("#tickbox");
    create_cross_boxes("#crossbox");
    create_scribble_boxes("#scribblebox");
    create_fancy_radio("#fancyradio");

    /*********************
    * Creation Functions *
    *********************/
    function create_cross_boxes(svgID)
    {
        // Definitions needed.
        var svgWidth = 600;  // The width of the SVG element.
        var svgHeight = 100;  // The height of the SVG element.

        // Create the SVG element.
        var svg = d3.select(svgID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    }

    function create_fancy_radio(svgID)
    {
        // Definitions needed.
        var svgWidth = 600;  // The width of the SVG element.
        var svgHeight = 100;  // The height of the SVG element.

        // Create the SVG element.
        var svg = d3.select(svgID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    }

    function create_scribble_boxes(svgID)
    {
        // Definitions needed.
        var svgWidth = 600;  // The width of the SVG element.
        var svgHeight = 100;  // The height of the SVG element.

        // Create the SVG element.
        var svg = d3.select(svgID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    }

    function create_tick_boxes(svgID)
    {
        // Definitions needed.
        var svgWidth = 600;  // The width of the SVG element.
        var svgHeight = 120;  // The height of the SVG element.
        var boxSize;  // The width and height of the checkbox.
        var boxStrokeWidth = 1;  // The stroke width for the checkbox.
        var boxLabelGap = 5;  // The gap between the box and the label.
        var choiceGap = 20;  // The gap between each checkbox/label combos.
        var startXPos = 20;  // The minimum position on the x axis at which the boxes can begin being placed.
        var widthToFill = 560;  // The width of the space that the checkboxes should fill up.
        var startYPos = 10;  // The Y position of the top of the first row of boxes.
        var heightToFill = 100;  // The height that the checkboxes should evenly fill up (i.e. one row would be right in the middle, 3 rows at the quartiles).
        var checkMark;  // The mark that indicates that a box has been checked.

        // Create the SVG element.
        var svg = d3.select(svgID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Determine the width of all the labels.
        var labelWidths = [];  // The width of each label, with index i in this array corresponding to the label with index i in the labels array.
        var tempText = svg.selectAll("text")
            .data(labels)
            .enter()
            .append("text")
                .text(function(d) { return d; });
        tempText.each(function() { labelWidths.push(d3.select(this).node().getBBox().width); });
        boxSize = tempText.node().getBBox().height - boxStrokeWidth;  // Set the box plus box border to be the same size as the label height.
        tempText.remove();  // Remove the text once the bboxs the labels take up have been computed.
        checkMark = "M" + (2 * boxStrokeWidth) + "," + (boxSize / 2) +
                    "L" + (boxSize / 2) + "," + (boxSize - boxStrokeWidth) +
                    "L" + (boxSize - boxStrokeWidth) + "," + (2 * boxStrokeWidth);

        // Compute the positions of the checkboxes.
        // Set the boxes on the half pixel to make them crisper with a 1px border.
        var choiceData = [];
        var choiceWidth;  // The width of the current box/label combo.
        var numberOfRows = 1;  // The number of rows of checkboxes to use.
        var cumulativeWidth = startXPos;
        for (var i = 0; i < labels.length; i++)
        {
            choiceWidth = boxSize + boxStrokeWidth + boxLabelGap + labelWidths[i] + choiceGap;
            if (cumulativeWidth + choiceWidth > widthToFill)
            {
                numberOfRows++;
                cumulativeWidth = startXPos;
            }
            choiceData.push({"color": colorCodes[i], "label": labels[i], "rowNumber": numberOfRows, "transX": cumulativeWidth});
            cumulativeWidth += choiceWidth;
        }
        var rowGap = heightToFill / (numberOfRows + 1);  // The gaps to leave between each row.
        for (var i = 0; i < choiceData.length; i++)
        {
            var currentChoice = choiceData[i];
            currentChoice.transY = startYPos + (rowGap * currentChoice.rowNumber) - ((boxSize + boxStrokeWidth) / 2);
        }

        // Add the lines showing the boundaries for the checkboxes.
        svg.append("rect")
            .classed("outline", true)
            .attr("x", startXPos)
            .attr("y", startYPos)
            .attr("width", widthToFill)
            .attr("height", heightToFill);

        // Add the checkboxes.
        var boxOffset = boxStrokeWidth / 2;  // Offset each checkbox by half the stroke width to keep everything within the desired bounds.
        var choiceContainers = svg.selectAll(".boxes")
            .data(choiceData)
            .enter()
            .append("g")
                .classed("checkboxContainer", true)
                .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
        choiceContainers.append("rect")  // The checkbox squares.
            .classed("checkbox", true)
            .attr("x", boxOffset)
            .attr("y", boxStrokeWidth / 2)
            .attr("width", boxSize)
            .attr("height", boxSize)
            .style("stroke-width", boxStrokeWidth);
        choiceContainers.append("text")  // The label text.
            .attr("x", boxSize + boxStrokeWidth + boxLabelGap)
            .attr("y", Math.ceil((boxSize + boxStrokeWidth) * 4 / 5))
            .text(function(d) { return d.label; });
        choiceContainers.append("rect")  // An invisible rectangle to help catch events.
            .classed("backing", true)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", function(d) { return d3.select(this).node().parentNode.getBBox().width + (boxOffset * 2); })  // The width of the backing rect is the combined width of all elements in its parent <g>.
            .attr("height", boxSize + boxStrokeWidth);
        choiceContainers.on("click", function(d)
            {
                // Select the elements needed.
                var container = d3.select(this);
                var containedBox = container.select(".checkbox");
                var containedLabel = container.select("text");

                // Change colors and add the mark to indicate selection.
                if (container.classed("selected"))
                {
                    // The checkbox was selected, so now deselct it.
                    container.classed("selected", false);
                    containedBox.style("stroke", "white");
                    containedLabel.style("fill", "white");
                    var checkmark = container.select(".checkmark");
                    var checkmarkLength = checkmark.node().getTotalLength();
                    checkmark
                        .style("stroke", "white")
                        .transition()
                        .duration(300)
                        .ease("linear")
                        .style("stroke-dashoffset", checkmarkLength)
                        .remove();
                }
                else
                {
                    // The checkbox was not selected, so now select it.
                    container.classed("selected", true);
                    containedBox.style("stroke", d.color);
                    containedLabel.style("fill", d.color);
                    var checkmark = container.append("path")
                        .classed("checkmark", true)
                        .attr("d", checkMark)
                        .style("stroke", d.color);

                    // Transition the checkmark so it doesn't appear all at once.
                    var checkmarkLength = checkmark.node().getTotalLength();
                    checkmark
                        .style("stroke-dasharray", checkmarkLength + " " + checkmarkLength)
                        .style("stroke-dashoffset", checkmarkLength);
                    checkmark.transition()
                        .duration(300)
                        .ease("linear")
                        .style("stroke-dashoffset", 0);
                }
            });
    }
});
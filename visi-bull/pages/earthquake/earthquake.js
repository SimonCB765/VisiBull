$(document).ready(function()
{
    // Define the page dimensions.
    var minWidth = 1024,  // Minimum width that the display can be.
        minHeight = 567,  // Minimum height that the display can be.
        currentWidth = Math.max(minWidth, window.innerWidth),  // Current width of the display.
        currentHeight = Math.max(minHeight, window.innerHeight);  // Current height of the display.

    // Fix the minimum size of the HTML body.
    d3.select("body")
        .style("min-width", minWidth + "px")
        .style("min-height", minHeight + "px");

    // Select the SVG element where the visualisation will be created, and define the dimensions of the SVG within which the visualisation can occur.
    var margin = 10;  // Margin around each outside edge of the SVG. Prevents the SVG being set to the exact size of the window and causing scrollbars to appear.
    var svgWidth = currentWidth - margin - margin,
        svgHeight = currentHeight - margin - margin;
    var svg = d3.select("#earthquake")
        .style("display", "block")
        .style("top", margin)
        .style("left", margin);

    // Determine the size and positioning of the histogram slider.
    var histoLeftPadding = 0.05,  // The histogram slider starts 5% of the width of the SVG element from the left edge of it.
        histoTopPadding = 0.025,  // The histogram slider starts 2.5% of the height of the SVG element from the top edge of it.
        histoWidthFrac = 0.8,  // The width of the histogram slider is 80% of the width of the SVG element.
        histoHeightFrac = 0.15;  // The height of the histogram slider is 15% of the height of the SVG element.
    var histoLeftEdge = histoLeftPadding * svgWidth,  // The X coordinate of the left edge of the histogram slider.
        histoTopEdge = histoTopPadding * svgHeight,  // The Y coordinate of the top edge of the histogram slider.
        histoWidth = histoWidthFrac * svgWidth,  // The width of the histogram slider.
        histoHeight = histoHeightFrac * svgHeight;  // The height of the histogram slider.
    var histogram = histogramSlider(histoWidth, histoHeight)  // Create the histogram slider.
        .leftEdge(histoLeftEdge)
        .topEdge(histoTopEdge);
    svg.call(histogram);  // Add the histogram slider to the SVG element.

    // Attach the listener for resize events, and fire it once to size the SVG.
    var windowSelection = $(window);
    windowSelection.resize(function()
        {
            // Determine the new width and height of the SVG element.
            currentWidth = Math.max(minWidth, windowSelection.width());
            currentHeight = Math.max(minHeight, windowSelection.height());
            svgWidth = currentWidth - margin - margin;
            svgHeight = currentHeight - margin - margin;
            svg
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            // Update the histogram slider.
            histoLeftEdge = histoLeftPadding * svgWidth;
            histoTopEdge = histoTopPadding * svgHeight;
            histoWidth = histoWidthFrac * svgWidth;
            histoHeight = histoHeightFrac * svgHeight;
        });
    $(window).trigger( "resize" );
});

function histogramSlider(width, height)
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var leftEdge = 0,  // The X coordinate of the left edge of the histogram slider.
        topEdge = 0,  // The Y coordinate of the top edge of the histogram slider.
        width = width,  // The width of the histogram slider.
        height = height;  // The height of the histogram slider.

    /*************************************
    * Histogram Slider Creation Function *
    *************************************/
    function histoSlider(selection)
    {
        // Setup the histogram slider container.
        var histoOuterContainer = selection.append("g")
            .attr("transform", function() { return "translate(" + leftEdge + "," + topEdge + ")"; });

        // Create the backing rectangle.
        var backingRect = histoOuterContainer.append("rect")
            .classed("histoBackingRect", true)
            .attr("width", width)
            .attr("height", height);
    }

    /**********************
    * Getters and Setters *
    **********************/
    // Get/Set the X coordinate of the left edge of the histogram slider.
    histoSlider.leftEdge = function(_)
    {
        if (!arguments.length) return leftEdge;
        leftEdge = _;
        return histoSlider;
    }

    // Get/Set the Y coordinate of the top edge of the histogram slider.
    histoSlider.topEdge = function(_)
    {
        if (!arguments.length) return topEdge;
        topEdge = _;
        return histoSlider;
    }

    // Get/Set the width of the histogram slider.
    histoSlider.width = function(_)
    {
        if (!arguments.length) return width;
        width = _;
        return histoSlider;
    }

    // Get/Set the height of the histogram slider.
    histoSlider.height = function(_)
    {
        if (!arguments.length) return height;
        height = _;
        return histoSlider;
    }

    return histoSlider;
}
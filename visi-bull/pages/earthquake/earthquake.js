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

    // Attach the listener for resize events, and fire it once to size the SVG.
    var windowSelection = $(window);
    windowSelection.resize(function()
        {
            currentWidth = Math.max(minWidth, windowSelection.width());
            currentHeight = Math.max(minHeight, windowSelection.height());
            svgWidth = currentWidth - margin - margin;
            svgHeight = currentHeight - margin - margin;
            svg
                .attr("width", svgWidth)
                .attr("height", svgHeight);
        });
    $(window).trigger( "resize" );
});
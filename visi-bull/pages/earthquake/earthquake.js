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
    var histoLeftPadding = 0.05,  // The fraction of the SVG element's width that should be to the left of the histogram slider's left edge.
        histoTopPadding = 0.025,  // The fraction of the SVG element's height that should be above the histogram slider's top edge.
        histoWidthFrac = 0.8,  // The fraction of the SVG element's width that the histogram slider takes up.
        histoHeightFrac = 0.15;  // The fraction of the SVG element's height that the histogram slider takes up.
    var histoLeftEdge = histoLeftPadding * svgWidth,  // The X coordinate of the left edge of the histogram slider.
        histoTopEdge = histoTopPadding * svgHeight,  // The Y coordinate of the top edge of the histogram slider.
        histoWidth = histoWidthFrac * svgWidth,  // The width of the histogram slider.
        histoHeight = histoHeightFrac * svgHeight;  // The height of the histogram slider.
    var histogram = histogramSliderCreator(histoWidth, histoHeight)  // Create the histogram slider.
        .leftEdge(histoLeftEdge)
        .topEdge(histoTopEdge);
    svg.call(histogram);  // Add the histogram slider to the SVG element.

    // Determine the size and positioning of the map.
    var mapLeftPadding = histoLeftPadding,  // The fraction of the SVG element's width that should be to the left of the map's left edge.
        mapTopPadding = histoTopPadding + histoHeightFrac + histoTopPadding + histoTopPadding,  // The fraction of the SVG element's height that should be above the map's top edge.
        mapWidthFrac = histoWidthFrac,  // The fraction of the SVG element's width that the map takes up.
        mapHeightFrac = 1 - mapTopPadding - histoTopPadding;  // The fraction of the SVG element's height that the map takes up.
    var mapLeftEdge = mapLeftPadding * svgWidth,  // The X coordinate of the left edge of the map.
        mapTopEdge = mapTopPadding * svgHeight,  // The Y coordinate of the top edge of the map.
        mapWidth = mapWidthFrac * svgWidth,  // The width of the map.
        mapHeight = mapHeightFrac * svgHeight;  // The height of the map.
    var map = mapCreator(mapWidth, mapHeight)  // Create the map.
        .leftEdge(mapLeftEdge)
        .topEdge(mapTopEdge);
    svg.call(map);  // Add the histogram slider to the SVG element.

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
            histogram
                .leftEdge(histoLeftEdge)
                .topEdge(histoTopEdge)
                .width(histoWidth)
                .height(histoHeight);
            histogram.update();
            
            // Update the map.
            mapLeftEdge = mapLeftPadding * svgWidth;
            mapTopEdge = mapTopPadding * svgHeight;
            mapWidth = mapWidthFrac * svgWidth;
            mapHeight = mapHeightFrac * svgHeight;
        });
    windowSelection.trigger( "resize" );
});

function histogramSliderCreator(width, height)
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var leftEdge = 0,  // The X coordinate of the left edge of the histogram slider.
        topEdge = 0,  // The Y coordinate of the top edge of the histogram slider.
        width = width,  // The width of the histogram slider.
        height = height;  // The height of the histogram slider.

    /********************************
    * Histogram Slider Manipulation *
    ********************************/
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

        // Define the procedure needed to updated the position and size of the histogram slider while it is in use.
        histoSlider.update = function()
        {
            // Update the postion of the slider.
            histoOuterContainer = selection.append("g")
                .attr("transform", function() { return "translate(" + leftEdge + "," + topEdge + ")"; });

            // Update the size of the backing rectangle.
            backingRect
                .attr("width", width)
                .attr("height", height);
        }
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

function mapCreator(width, height)
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var leftEdge = 0,  // The X coordinate of the left edge of the map.
        topEdge = 0,  // The Y coordinate of the top edge of the map.
        width = width,  // The width of the map.
        height = height;  // The height of the map.

    /************************
    * Map Creation Function *
    ************************/
    function map(selection)
    {
        // Setup the map container.
        var mapContainer = selection.append("g")
            .attr("transform", function() { return "translate(" + leftEdge + "," + topEdge + ")"; });

        // Create the backing rectangle.
        var backingRect = mapContainer.append("rect")
            .classed("mapBackingRect", true)
            .attr("width", width)
            .attr("height", height);
    }

    /**********************
    * Getters and Setters *
    **********************/
    // Get/Set the X coordinate of the left edge of the map.
    map.leftEdge = function(_)
    {
        if (!arguments.length) return leftEdge;
        leftEdge = _;
        return map;
    }

    // Get/Set the Y coordinate of the top edge of the map.
    map.topEdge = function(_)
    {
        if (!arguments.length) return topEdge;
        topEdge = _;
        return map;
    }

    // Get/Set the width of the map.
    map.width = function(_)
    {
        if (!arguments.length) return width;
        width = _;
        return map;
    }

    // Get/Set the height of the map.
    map.height = function(_)
    {
        if (!arguments.length) return height;
        height = _;
        return map;
    }

    return map;
}
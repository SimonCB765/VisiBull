$(document).ready(function()
{
    // Grab the data for the visualisation.
    var datasetLocation = DATADIR + "/ParsedData.tsv";
    d3.tsv(datasetLocation, function(error, data)
        {
            if (error)
            {
                // If error is not null, then something went wrong.
                console.log(error);  //Log the error.
                alert("There was an error loading the dataset.");
            }

            // Create the visualisation once the data is loaded.
            setupVisualisation(data)
        });
});

function setupVisualisation(data)
{
    // Define the page dimensions.
    var minWidth = 1024,  // Minimum width that the display can be.
        minHeight = 567,  // Minimum height that the display can be.
        currentWidth = Math.max(minWidth, window.innerWidth),  // Current width of the display.
        currentHeight = Math.max(minHeight, window.innerHeight);  // Current height of the display.

    // Fix the minimum size of the HTML body.
    var body = d3.select("body")
        .style("min-width", minWidth + "px")
        .style("min-height", minHeight + "px");

    // Select the SVG element where the visualisation will be created, and define the dimensions of the SVG within which the visualisation can occur.
    var margin = 10;  // Margin around each outside edge of the SVG. Prevents the SVG being set to the exact size of the window and causing scrollbars to appear.
    var svgWidth = currentWidth - margin - margin,
        svgHeight = currentHeight - margin - margin;
console.log(data);
    var svg = body.append("svg")
        .datum(data)
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

    // Determine the size and positioning of the map.
    var mapLeftPadding = histoLeftPadding,  // The fraction of the SVG element's width that should be to the left of the map's left edge.
        mapTopPadding = histoTopPadding + histoHeightFrac + histoTopPadding + histoTopPadding,  // The fraction of the SVG element's height that should be above the map's top edge.
        mapWidthFrac = histoWidthFrac,  // The fraction of the SVG element's width that the map takes up.
        mapHeightFrac = 1 - mapTopPadding - histoTopPadding;  // The fraction of the SVG element's height that the map takes up.
    var mapLeftEdge = mapLeftPadding * svgWidth,  // The X coordinate of the left edge of the map.
        mapTopEdge = mapTopPadding * svgHeight,  // The Y coordinate of the top edge of the map.
        mapWidth = mapWidthFrac * svgWidth,  // The width of the map.
        mapHeight = mapHeightFrac * svgHeight;  // The height of the map.

    // Create the histogram slider and map.
    var visualisation = visualisationCreator()
        .histoLeftEdge(histoLeftEdge)
        .histoTopEdge(histoTopEdge)
        .histoWidth(histoWidth)
        .histoHeight(histoHeight)
        .mapLeftEdge(mapLeftEdge)
        .mapTopEdge(mapTopEdge)
        .mapWidth(mapWidth)
        .mapHeight(mapHeight);
    svg.call(visualisation);

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

            // Update the histogram slider position and size information.
            histoLeftEdge = histoLeftPadding * svgWidth;
            histoTopEdge = histoTopPadding * svgHeight;
            histoWidth = histoWidthFrac * svgWidth;
            histoHeight = histoHeightFrac * svgHeight;

            // Update the map position and size information.
            mapLeftEdge = mapLeftPadding * svgWidth;
            mapTopEdge = mapTopPadding * svgHeight;
            mapWidth = mapWidthFrac * svgWidth;
            mapHeight = mapHeightFrac * svgHeight;

            // Update the visualisation.
            visualisation
                .histoLeftEdge(histoLeftEdge)
                .histoTopEdge(histoTopEdge)
                .histoWidth(histoWidth)
                .histoHeight(histoHeight)
                .mapLeftEdge(mapLeftEdge)
                .mapTopEdge(mapTopEdge)
                .mapWidth(mapWidth)
                .mapHeight(mapHeight);
            visualisation.update();
        });
    windowSelection.trigger( "resize" );
}

function visualisationCreator()
{
    /***************************
    * Default Parameter Values *
    ***************************/
    var histoLeftEdge = 0,  // The X coordinate of the left edge of the histogram slider.
        histoTopEdge = 0,  // The Y coordinate of the top edge of the histogram slider.
        histoWidth = 400,  // The width of the histogram slider.
        histoHeight = 100,  // The height of the histogram slider.
        mapLeftEdge = 0,  // The X coordinate of the left edge of the map.
        mapTopEdge = 0,  // The Y coordinate of the top edge of the map.
        mapWidth = 400,  // The width of the map.
        mapHeight = 100;  // The height of the map.

    /**************************************
    * Visualisation Creation and Updating *
    **************************************/
    function visual(selection)
    {
        // Setup the histogram slider container.
        var histoContainer = selection.append("g")
            .attr("transform", function() { return "translate(" + histoLeftEdge + "," + histoTopEdge + ")"; });

        // Create the histogram slider's backing rectangle.
        var histoBackingRect = histoContainer.append("rect")
            .classed("backingRect", true)
            .attr("width", histoWidth)
            .attr("height", histoHeight);

        // Setup the map container.
        var mapContainer = selection.append("g")
            .attr("transform", function() { return "translate(" + mapLeftEdge + "," + mapTopEdge + ")"; });

        // Create the map's backing rectangle.
        var mapBackingRect = mapContainer.append("rect")
            .classed("backingRect", true)
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        // Define the procedure needed to updated the position and size of the histogram slider and map while they are in use.
        visual.update = function()
        {
            // Update the position of the histogram slider.
            histoContainer
                .attr("transform", function() { return "translate(" + histoLeftEdge + "," + histoTopEdge + ")"; });

            // Update the size of the histogram slider's backing rectangle.
            histoBackingRect
                .attr("width", histoWidth)
                .attr("height", histoHeight);

            // Update the position of the map.
            mapContainer
                .attr("transform", function() { return "translate(" + mapLeftEdge + "," + mapTopEdge + ")"; });

            // Update the size of the map's backing rectangle.
            mapBackingRect
                .attr("width", mapWidth)
                .attr("height", mapHeight);
        }
    }

    /**********************
    * Getters and Setters *
    **********************/
    // Get/Set the X coordinate of the left edge of the histogram slider.
    visual.histoLeftEdge = function(_)
    {
        if (!arguments.length) return histoLeftEdge;
        histoLeftEdge = _;
        return visual;
    }

    // Get/Set the X coordinate of the left edge of the map.
    visual.mapLeftEdge = function(_)
    {
        if (!arguments.length) return mapLeftEdge;
        mapLeftEdge = _;
        return visual;
    }

    // Get/Set the Y coordinate of the top edge of the histogram slider.
    visual.histoTopEdge = function(_)
    {
        if (!arguments.length) return histoTopEdge;
        histoTopEdge = _;
        return visual;
    }

    // Get/Set the Y coordinate of the top edge of the map.
    visual.mapTopEdge = function(_)
    {
        if (!arguments.length) return mapTopEdge;
        mapTopEdge = _;
        return visual;
    }

    // Get/Set the width of the histogram slider.
    visual.histoWidth = function(_)
    {
        if (!arguments.length) return histoWidth;
        histoWidth = _;
        return visual;
    }

    // Get/Set the width of the map.
    visual.mapWidth = function(_)
    {
        if (!arguments.length) return mapWidth;
        mapWidth = _;
        return visual;
    }

    // Get/Set the height of the histogram slider.
    visual.histoHeight = function(_)
    {
        if (!arguments.length) return histoHeight;
        histoHeight = _;
        return visual;
    }

    // Get/Set the height of the map.
    visual.mapHeight = function(_)
    {
        if (!arguments.length) return mapHeight;
        mapHeight = _;
        return visual;
    }

    return visual;
}
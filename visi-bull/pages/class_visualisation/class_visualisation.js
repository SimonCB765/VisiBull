var margin = {top: 10, right: 10, bottom: 25, left: 10};  // The margins to leave on each side of the SVG element.
var chartDim;  // The width and height of the individual charts.
var maxFeaturesToDisplay = 4;  // The number of features to display charts for (maximum of 4).
var yAxisPadding = 40;  // The gap between the left of the SVG element and the leftmost charts (where the y axis labels will reside).
var chartOffsetY = 40;  // The gap between the top of the SVG element and the topmost charts (where the feature names of the columns will reside).
var chartGap = 10;  // The gap between charts in the X and Y directions.
var buttonPadding = 100;  // The gap between the right of the charts and the dataset buttons.
var scatterRadius = 4;  // The radius of the circles representing the datapoints.

// Calculate the width and height of the SVG element.
var svgWidth = 900 - margin.left - margin.right;//(chartDim * maxFeaturesToDisplay) + yAxisPadding + (chartGap * (maxFeaturesToDisplay - 1));
var svgHeight = 665 - margin.top - margin.bottom;//(chartDim * maxFeaturesToDisplay) + chartOffsetY + (chartGap * (maxFeaturesToDisplay - 1));

// Get the path to the current script, then the path to the directory containing it and then to the data directory.
// This could also be done by hardcoding the path to the data directory instead.
var scripts = document.getElementsByTagName("script"),
    scriptLocation = scripts[scripts.length - 1].src,
    pageDirectory = scriptLocation.split("/").slice(0, -1).join("/")
    dataDirectory = pageDirectory + "/Data/";

// Create the SVG element.
var svg = create_SVG("div.content");

// Create the g element that will contain the plots.
var plottingElement = svg.append("g").classed("chartArea", true);

// Setup the ordinal scale for the class colors.
var classColors = d3.scale.category10();

// Load up the first example dataset visualisation.
var loadedDatasets = {};  // The datasets that have been loaded into memory.
load_dataset(dataDirectory + "ExData2.tsv", "ExData1")

/*****************
Helper Functions.
******************/

function create_slider(container, xTransform, yTransform, sliderMax, features, verticalAxis)
{
    // Define the drag behaviour.
    var drag = d3.behavior.drag()
        .origin(function(d) {return d;})
        .on("drag", slider_drag_update)
		.on("dragend", slider_drag_end);

	// Create the scale for the slider.
	var sliderScale = d3.scale.linear()
		.domain([0, features.length])
		.range([0, sliderMax])
		.clamp(true);

    // Create the axis for the slider.
    var sliderScaleAxis = d3.svg.axis()
		.tickFormat(function (d) { return ''; })  // Hide the tick labels.
		.orient(verticalAxis ? "right" : "bottom")
        .scale(sliderScale);
	
    // Create the g element for holding the speed slider.
    var sliderAxisContainer = container.append("g")
        .classed("sliderAxis", true)
        .attr("transform", "translate(" + xTransform + "," + yTransform + ")")
        .call(sliderScaleAxis)
	
	// Create the data for the feature labels.
	var featureData = [];
	var validPositions = [];
	var labelPos = 0.5;
	for (var i = 0; i < features.length; i++)
	{
		featureData.push({"feature" : features[i], "position" : labelPos});
		validPositions.push(labelPos);
		labelPos += 1;
	}

	// Add the feature name labels.
    var featureLabels = sliderAxisContainer.selectAll(".handle")
		.data(featureData)
		.enter()
		.append("text")
        .classed({"horizontalHandle" : !verticalAxis, "verticalHandle" : verticalAxis})
        .attr("x", verticalAxis ? 0 : function(d) { return sliderScale(d.position); })
        .attr("y", verticalAxis ? function(d) { return sliderScale(d.position); } : 0)
		.attr("text-anchor", "middle")
		.text(function(d) { return d.feature; })
        .call(drag);

	function round_to_vector(value, vector)
	{
		var distances = vector.map(function(d) { return Math.abs(d - value); });
		return vector[distances.indexOf(d3.min(distances))];
	}
	
	function slider_drag_update(d)
	{
		var sliderPos = d3.mouse(this);  // Current position of the slider handle relative to its container.

		// Update the slider handle position.
		d3.select(this)
			.attr("x", verticalAxis ? 0 : d.position = Math.max(0, Math.min(sliderMax, sliderPos[0])))
			.attr("y", verticalAxis ? d.position = Math.max(0, Math.min(sliderMax, sliderPos[1])) : 0);
	}
	
	function slider_drag_end(d)
	{
		var sliderPos = d3.mouse(this);  // Current position of the slider handle relative to its container.

		// Update the slider handle position.
		d3.select(this)
			.transition()
			.duration(500)
			.attr("x", verticalAxis ? 0 : d.position = sliderScale(round_to_vector(sliderScale.invert(Math.max(0, Math.min(sliderMax, sliderPos[0]))), validPositions)))
			.attr("y", verticalAxis ? d.position = sliderScale(round_to_vector(sliderScale.invert(Math.max(0, Math.min(sliderMax, sliderPos[1]))), validPositions)) : 0);
	}
}

function create_SVG(selectionString)
{
    var containerDiv = d3.select(selectionString);
    var svg = containerDiv.append("svg")
        .attr("width", svgWidth + margin.left + margin.right)
        .attr("height", svgHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

function cross_product(array1, array2)
{
    var returnArray = []
    for (var i = 0; i < array1.length; i++)
    {
        var rowValue = array1[i];
        for (var j = 0; j < array2.length; j++)
        {
            returnArray.push({"row_feature" : rowValue, "row_index" : i, "col_feature" : array2[j], "col_index" : j});
        }
    }
    return returnArray;
}

var line_generator = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

function load_dataset(datasetLocation, datasetName)
{
    d3.tsv(datasetLocation, function(error, data)
        {
            if (error)
            {
                // If error is not null, something went wrong.
                console.log(error);  //Log the error.
                alert("There was an error loading the dataset.");
            }
            else
            {
                // If no error occurred, the file loaded correctly. Convert all non-class feature values to numbers.
                var features = d3.keys(data[0]).filter(function(d) {return d != "Class";});
                data.forEach(function(d) { features.forEach(function(feature) { d[feature] = +(d[feature]) }); });
                loadedDatasets[datasetName] = data;
            }

            // Create the visualisation.
            visualise_dataset(data);
        });
}

function plot_border(cell)
{
	var chartCell = d3.select(this);

	// Create the boundary around the chart.
	var boundaryVerts = [ {"x" : 0, "y" : 0},
						  {"x" : 0, "y" : chartDim},
						  {"x" : chartDim, "y" : chartDim},
						  {"x" : chartDim, "y" : 0},
						  {"x" : 0, "y" : 0}];
	chartCell.append("path")
		.datum(boundaryVerts)
		.attr("d", line_generator)
		.attr("d", function(d) { return line_generator(d) + "Z"; })  // Close the border.
		.classed("chartBorder", true);
}

function visualise_dataset(dataset)
{
    // Determine the number of features in the dataset and their domains.
    var domainByFeature = {};
    var features = d3.keys(dataset[0]).filter(function(d) {return d != "Class";});
	var featuresToDisplay = features.slice(0, Math.min(maxFeaturesToDisplay, features.length));
    features.forEach(function(feature) {domainByFeature[feature] = d3.extent(dataset, function(d) { return d[feature]; });});
	
	// Determine the dimensions for each of the plots.
	chartDim = (svgHeight - (chartGap * (featuresToDisplay.length - 1)) - chartOffsetY) / featuresToDisplay.length;

	// Define some variables needed for the brushing and class highlighting.
	var currentlyBrushedCell;  // The cell that is currently being brushed.
	var classSelection;  // Whether highlighting by class has been performed.
	var extentAtStart;  // The extent at the start of the brushing.

	// Setup the x and y scales.
	var xScale = d3.scale.linear()
		.range([0, chartDim]);
	var yScale = d3.scale.linear()
		.range([chartDim, 0]);

	// Setup the x and y axes.
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(5);
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);

	// Create the x and y axes for each feature that is to be displayed.
	svg.selectAll(".xAxis")
		.data(featuresToDisplay)
		.enter()
		.append("g")
		.classed("xAxis", true)
		.attr("transform", function(d, i) { return "translate(" + (yAxisPadding + (chartDim + chartGap) * i) + ", " + svgHeight + ")"; })
		.each(function(d) { xScale.domain(domainByFeature[d]); d3.select(this).call(xAxis); });
	svg.selectAll(".yAxis")
		.data(featuresToDisplay)
		.enter()
		.append("g")
		.classed("yAxis", true)
		.attr("transform", function(d, i) { return "translate(" + yAxisPadding + ", " + (chartOffsetY + (chartDim + chartGap) * i) + ")"; })
		.each(function(d) { yScale.domain(domainByFeature[d]); d3.select(this).call(yAxis); });

	// Setup the brush action. By changing the xScale and yScale for each chart cell, this setup can be used as a base definition for the brush
	// for each chart.
	var brush = d3.svg.brush()
	  .x(xScale)
	  .y(yScale)
	  .on("brushstart", brush_start)
	  .on("brush", brush_move)
	  .on("brushend", brush_end);

	// Add the guidelines before any important elements so that they hide behind them and don't interfere with any interactions.
	plottingElement.append("path")
		.classed("guideline", true);
	plottingElement
		.on("mousemove", function()
			{
				// Create the vertices for the lines.
				var mousePos = d3.mouse(this);
				var mousePosX = Math.max(yAxisPadding, mousePos[0]);
				var mousePosY = Math.max(chartOffsetY, Math.min(svgHeight, mousePos[1]));
				var verts = [ {"x" : yAxisPadding, "y" : mousePosY}, {"x" : yAxisPadding + 10, "y" : mousePosY},
							  {"x" : mousePosX, "y" : svgHeight - 10}, {"x" : mousePosX, "y" : svgHeight} ];

				// Draw the lines.
				d3.select(".guideline")
					.attr("d", "M" + verts[0].x + "," + verts[0].y + "L" + verts[1].x + "," + verts[1].y +
							   "M" + verts[2].x + "," + verts[2].y + "L" + verts[3].x + "," + verts[3].y);
			})
		.on("mouseenter", function() { d3.select(this).selectAll(".guideline").style("visibility", "visible"); })
		.on("mouseleave", function() { d3.select(this).selectAll(".guideline").style("visibility", "hidden"); });

	// Create the chart cells.
	var chartCells = plottingElement.selectAll(".chartCell")
		.data(cross_product(featuresToDisplay, featuresToDisplay))
		.enter()
		.append("g")
		.attr("class", function(d) { return "chartCell row" + d.row_index + " col" + d.col_index; })
		.attr("transform", function(d) { return "translate(" + (yAxisPadding + d.col_index * (chartDim + chartGap)) + "," + (chartOffsetY + d.row_index * (chartDim + chartGap)) + ")"; })
		.each(plot_border)  // Plot the border first in order to not interfere with the brushing (else the brush cross disappears and the brushing coords are messed up).
		.call(brush)  // Next add the brush behaviour.
		.each(plot);  // Finally add the data points last so that they're clickable.

	// Create the feature labels for the columns.
	var sliderLength = ((chartDim * featuresToDisplay.length) + (chartGap * (featuresToDisplay.length - 1)));
	create_slider(svg, yAxisPadding, chartOffsetY / 2, sliderLength, featuresToDisplay, false);
	create_slider(svg, yAxisPadding + sliderLength + (buttonPadding / 2), chartOffsetY, sliderLength, featuresToDisplay, true);

	function brush_end(cell)
	{
		// Enable pointer events on all datapoints. The points that need it disabled will be disabled later in the function.
		plottingElement.selectAll(".dataPoint").attr("pointer-events", "auto");

		// Determine whether the extent has changed or is empty.
		var extentUnchanged = (extentAtStart[0][0] === brush.extent()[0][0] && extentAtStart[0][1] === brush.extent()[0][1] &&
							   extentAtStart[1][0] === brush.extent()[1][0] && extentAtStart[1][1] === brush.extent()[1][1]);

		if (brush.empty())
		{
			// If the brush is empty, then either the deselection of non-brushed points needs to be cleared or a class highlighting is taking place.
			if (classSelection)
			{
				// The user has clicked on a datapoint circle and not dragged to create abrushed region. They have therefore chosen to highlight the
				// class of the clicked on datapoint.
				plottingElement.selectAll(".dataPoint")
					.classed("deselected", function(d) { return d["Class"] !== classSelection; });
			}
			else
			{
				// If the brush has been cleared and no class selection is going on, then you know the user has just tried to clear a brushed
				// region by clicking on the background outside the extent. Therefore, no datapoints should be deselected.
				plottingElement.selectAll(".dataPoint").classed("deselected", false);
			}
		}
		else
		{
			// The brush extent is not empty.
			// First determine which datapoints are within the extent in the cell in which the brushing occured.
			var datapointsWithinExtent = d3.select(this).selectAll(":not(.deselected).dataPoint");

			if (extentUnchanged)
			{
				// The extent is not empty and has not changed. The user therefore clicked somewhere in the extent without dragging.
				// The click either occurred on a datapoint circle or not. If it did, then the user is deemed to be trying to highlight
				// all datapoints with the same class as the clicked datapoint. As dragging the extent over a datapoint disables pointer events
				// (and therefore mousedown events) on the datapoint circle, whether the click was inside a datapoint circle is determined
				// here, rather than in the mousedown event handler.
				var mouseClickPos = d3.mouse(this);
				var datapointsWithinExtentData = datapointsWithinExtent.data();

				// Overlapping datapoint circles must be handled correctly, so that the datapoint the user sees on top is the one which is used
				// to determine the class highlighting. In order to achieve this, the datapointswithin the extent are traversed in the order
				// in which they appear in the selection. This order represents the order in which the elements appear in the DOM, and therefore
				// later elements in the selection appear on top of earlier ones. For example, if elements A and B are inside the extent, and B appears
				// on top of A in the browser, then the elements must have been inserted into the DOM in the order of A and then B.
				for (var i = 0; i < datapointsWithinExtentData.length; i++)
				{
					// Determine whether the mouse click occurred within the boundary of the current datapoint circle.
					if (Math.sqrt(Math.pow(xScale(datapointsWithinExtentData[i][cell.row_feature]) - mouseClickPos[0], 2), Math.pow(yScale(datapointsWithinExtentData[i][cell.col_feature]) - mouseClickPos[1], 2)) < scatterRadius)
					{
						// If the click was in the datapoint circle, then record the datapoint's class as the one to highlight.
						classSelection = datapointsWithinExtentData[i]['Class'];
					}
				}

				// At this point the class of the last datapoint in the selection (i.e. the one on top and visible to the user) will be selected
				// as the class to highlight, or the class to highlight will be undefined (if the user did not click on a datapoint).
				if (classSelection)
				{
					// If the mouse click was inside a datapoint circle.
					brush.clear();  // Clear the brush extent.
					brush(d3.select(this));  // Redraw the brush (this will clear it from view as the extent is empty).
					plottingElement.selectAll(".dataPoint")
						.classed("deselected", function(d) { return d["Class"] !== classSelection; });  // Deselect datapoints of the wrong class.
				}
			}
			else
			{
				// The extent is not empty and has changed during the current brushing. Any datapoints within the extent should have their
				// pointer events disabled in order to enable dragging of the extent when the mousedown event occurs on a datapoint circle.
				datapointsWithinExtent  // All points within the extent...
					.attr("pointer-events", "none");  // get their pointer events disabled.
			}
		}

		// Reset the record of there being a class selection.
		classSelection = undefined;

		// Reset the record of the starting extent as the brushing has finished.
		extentAtStart = undefined;

		// Bring back the guidelines.
		plottingElement.select(".guideline").style("visibility", "visible");
		plottingElement.on("mouseenter", function() { d3.select(this).selectAll(".guideline").style("visibility", "visible"); });
	}

	function brush_move(cell)
	{
		var brushExtent = brush.extent();
		plottingElement.selectAll(".dataPoint")
			.classed("deselected", function(d)
				{
					var rowFeatureVal = d[cell.row_feature];
					var colFeatureVal = d[cell.col_feature];
					return rowFeatureVal < brushExtent[0][0] || rowFeatureVal > brushExtent[1][0] || colFeatureVal < brushExtent[0][1] || colFeatureVal > brushExtent[1][1];
				});
	}

	function brush_start(cell)
	{
		// If the chart cell being brushed changes, then the extent needs to be cleared from the old cell. As a brush may be drawn into multiple
		// elements simultaneously (but will still share the same backing extent) if the brush extent is not cleared from the previous cell
		// before brushing the new cell, then the extent will appear in multiple elements. For example, if you brush a square in cell (1, 1)
		// and then brush a rectangle in cell (2, 2), both the rectangle (in cell (2, 2)) and the square (in cell (1, 1)) will be visible.
		// In order to prevent this, a change in the cell being brushed needs to be detected, and the extent cleared in the old cell. It's
		// also necessary to change the domain of the x and y scales to be appropriate for the new cell.
		if (currentlyBrushedCell !== this)
		{
			// If the cell being brushed has changed.
			d3.select(currentlyBrushedCell).call(brush.clear());  // Clear the brush from the previously brushed cell.
			currentlyBrushedCell = this;

			// The domains must also be set to those of the cell being brushed in order for the scale of the brush to be correct. If these are not
			// reset, then the brush extent will be within the range of the scale of the last cell created (e.g. the bottom right one).
			xScale.domain(domainByFeature[cell.row_feature]);
			yScale.domain(domainByFeature[cell.col_feature]);
		}

		// Record the extent of the brush at the beginning of the brushing.
		extentAtStart = brush.extent();

		// Hide the guidelines.
		plottingElement.select(".guideline").style("visibility", "hidden");
		plottingElement.on("mouseenter", null);
	}

	function class_select(d)
	{
		// Determine the chart cell that the datapoint is in.
		var chartCell = d3.select(this.parentNode);

		// Determine the class of the datapoint that the mousedown event occurred in.
		classSelection = d["Class"];

		// In order to enable brushing when you start the brushed region by clicking on a datapoint circle, it is first necessary to
		// clear the extent of the brush manually. If the extent is not cleared manually, then when the brushstart event triggers, the extent
		// of the brush is reset to originate in the top left corner of the element, rather than where the mouse is.
		var chartCellData = chartCell.datum();
		xScale.domain(domainByFeature[chartCellData.row_feature]);  // Give the correct domain for the x scale in this chart cell.
		yScale.domain(domainByFeature[chartCellData.col_feature]);  // Give the correct domain for the y scale in this chart cell.
		var startXVal = xScale.invert(d3.mouse(this)[0]);  // Convert x mouse coord into the coord system of the plot (needed by brush).
		var startYVal = yScale.invert(d3.mouse(this)[1]);  // Convert y mouse coord into the coord system of the plot (needed by brush).
		brush.extent([[startXVal, startYVal], [startXVal, startYVal]]);  // Reset brush extent to empty and at the mouse 'mousedown' location.
	}

	function plot(cell)
	{
		var chartCell = d3.select(this);

		// Setup the domain for the data in this cell.
		xScale.domain(domainByFeature[cell.row_feature]);
		yScale.domain(domainByFeature[cell.col_feature]);

		// Create the points.
		chartCell.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", function(d) { return xScale(d[cell.row_feature]); })
			.attr("cy", function(d) { return yScale(d[cell.col_feature]); })
			.attr("r", scatterRadius)
			.classed("dataPoint", true)
			.style("fill", function(d) { return classColors(d.Class) })
			.on("mousedown", class_select);
	}
}
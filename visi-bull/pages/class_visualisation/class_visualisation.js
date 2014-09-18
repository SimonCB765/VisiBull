var margin = {top: 10, right: 10, bottom: 25, left: 10};  // The margins to leave on each side of the SVG element.
var chartDim = 140;  // The width and height of the individual charts.
var displayedFeatures = 4;  // The number of features to display charts for.
var chartOffsetX = 100;  // The gap between the left of the SVG element and the leftmost charts.
var chartOffsetY = 40;  // The gap between the top of the SVG elements and the topmost charts.
var chartGap = 10;  // The gap between charts in the X and Y directions.
var plotType = "Scatter";  // The type of the plot that is to be created.

// Calculate the width and height of the SVG element.
var svgWidth = (chartDim * displayedFeatures) + chartOffsetX + (chartGap * (displayedFeatures - 1));
var svgHeight = (chartDim * displayedFeatures) + chartOffsetY + (chartGap * (displayedFeatures - 1));

// Get the path to the current script, then the path to the directory containing it and then to the data directory.
// This could also be done by hardcoding the path to the data directory instead.
var scripts = document.getElementsByTagName("script"),
    scriptLocation = scripts[scripts.length - 1].src,
    pageDirectory = scriptLocation.split("/").slice(0, -1).join("/")
    dataDirectory = pageDirectory + "/Data/";

// Create the SVG element.
var svg = create_SVG("div.content");

// Setup the ordinal scale for the class colors.
var classColors = d3.scale.category10();

// Load up the first example dataset visualisation.
var loadedDatasets = {};  // The datasets that have been loaded into memory.
load_dataset(dataDirectory + "ExData1.tsv", "ExData1")

/*****************
Helper Functions.
******************/

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

function visualise_dataset(dataset)
{
    // Determine the domains for each feature in the dataset.
    var domainByFeature = {};
    var features = d3.keys(dataset[0]).filter(function(d) {return d != "Class";}).slice(0, displayedFeatures);
    features.forEach(function(feature) {domainByFeature[feature] = d3.extent(dataset, function(d) { return d[feature]; });});

    // Create the appropriate visualisation.
    if (plotType === "Scatter")
    {
        plot_scatter();
    }

    function plot_scatter()
    {
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
            .data(features)
            .enter()
            .append("g")
            .classed("xAxis", true)
            .attr("transform", function(d, i) { return "translate(" + (chartOffsetX + (chartDim + chartGap) * i) + ", " + svgHeight + ")"; })
            .each(function(d) { xScale.domain(domainByFeature[d]); d3.select(this).call(xAxis); });
        svg.selectAll(".yAxis")
            .data(features)
            .enter()
            .append("g")
            .classed("yAxis", true)
            .attr("transform", function(d, i) { return "translate(" + chartOffsetX + ", " + (chartOffsetY + (chartDim + chartGap) * i) + ")"; })
            .each(function(d) { yScale.domain(domainByFeature[d]); d3.select(this).call(yAxis); });

        // Setup the brush action. By changing the xScale and yScale for each chart cell, this setup can be used as a base definition for the brush
        // for each chart.
        var brush = d3.svg.brush()
          .x(xScale)
          .y(yScale)
          .on("brushstart", brush_start)
          .on("brush", brush_move)
          .on("brushend", brush_end);

        // Create the chart cells.
        var chartCells = svg.selectAll(".chartCell")
            .data(cross_product(features, features))
            .enter()
            .append("g")
            .attr("class", function(d) { return "chartCell row" + d.row_index + " col" + d.col_index; })
            .attr("transform", function(d) { return "translate(" + (chartOffsetX + d.col_index * (chartDim + chartGap)) + "," + (chartOffsetY + d.row_index * (chartDim + chartGap)) + ")"; })
			.each(plot_border)  // Plot the border first in order to not interfere with the brushing (else the brush cross disappears and the brushing coords are messed up).
            .call(brush)  // Next add the brush behaviour.
            .each(plot);  // Finally add the data points so that they're clickable.

        var currentlyBrushedCell;  // The cell that is currently being brushed.
		var classSelection = false;  // Whether highlighting by class has been performed.

        function brush_end()
        {
			if (brush.empty())
			{
				// If the brush is empty, then either the brush needs to be cleared or a class highlighting is taking place.
				if (classSelection)
				{
					// Highlight all datapoints of the selected class.
					d3.selectAll(".dataPoint")
						.classed("deselected", function(d) { return d["Class"] !== classSelection; });
				}
				else
				{
					// If the brush has been cleared and no class selection is going on, then you know the user has just tried to clear a brushing.
					currentlyBrushedCell = undefined;
					svg.selectAll(".deselected")
						.classed("deselected", false);
				}
			}
			
			// Now record there being no class highlighting going on. This ensures that the next time the brush_end is fired, all the deselections
			// will be cleared, unless a class highlighting has been performed again.
			classSelection = false;
        }

        function brush_move(cell)
        {
            var brushExtent = brush.extent();
            svg.selectAll(".dataPoint")
                .classed("deselected", function(d)
                    {
                        var rowFeatureVal = d[cell.row_feature];
                        var colFeatureVal = d[cell.col_feature];
                        return rowFeatureVal < brushExtent[0][0] || rowFeatureVal > brushExtent[1][0] || colFeatureVal < brushExtent[0][1] || colFeatureVal > brushExtent[1][1];
                    });
        }

        function brush_start(cell)
        {
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
        }
		
		function class_select(d)
		{
			// Are you in the cell with the extent?
				// If Yes
					// Did you click within the extent?
						// If yes then don't do any highlighting (simply allow normal brush events to occur).
						// If no then ...
				// If No then...
		
			// Determine the class chosen for highlighting.
			classSelection = d3.select(this).datum()["Class"];
			
			// Handle non-zero brush extents. If the extent is not cleared here, and the datapoint click on is in a different chart cell from
			// the currently brushed area, then the brush extent will travel to the chart cell of the clicked datapoint. For example, if you brushed
			// a small square in cell (1, 1) and then clicked on a datapoint in cell (2, 2), then the brushed square would disappear from (1, 1) due
			// to the brush_start function, but would appear in (2, 2). Clearing the brush here, before any brushing events are triggered prevents this.
			// This problem occurs because the brush_start only clears the brush extent from the old chart cell (as it assumes that the
			// brush_move will handle any extents in the new chart cell).
			d3.select(currentlyBrushedCell).call(brush.clear());
			
			// Enable brushing when you start the brushing by clicking on a datapoint instead of the background.
			var chartCell = d3.select(this.parentNode);  // The chart cell that the datapoint is in.
			var chartCellData = chartCell.datum();  // The information about the features displayed in the cell.
			
			// Convert the absolute values of the mouse x and y coords within the chart cell into positions along the x and y axis.
			// This is necessary for providing values to properly set the brush extent, and requires setting the scale domains correctly.
			xScale.domain(domainByFeature[chartCellData.row_feature]);  // Give the correct domain for the x scale in this chart cell.
            yScale.domain(domainByFeature[chartCellData.col_feature]);  // Give the correct domain for the y scale in this chart cell.
			var startXVal = xScale.invert(d3.mouse(this)[0]);
			var startYVal = yScale.invert(d3.mouse(this)[1]);
			brush.extent([[startXVal, startYVal], [startXVal, startYVal]]);
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
			var line = d3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("linear");
            chartCell.append("path")
				.datum(boundaryVerts)
                .attr("d", line)
				.attr("d", function(d) { return line(d) + "Z"; })  // Close the border.
                .classed("chartBorder", true);
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
                .attr("r", 10)
                .classed("dataPoint", true)
                .style("fill", function(d) { return classColors(d.Class) })
				.on("mousedown", class_select)
				;
        }
    }
}
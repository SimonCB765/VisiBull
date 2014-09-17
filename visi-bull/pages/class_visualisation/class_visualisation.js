var margin = {top: 10, right: 10, bottom: 25, left: 10};  // The margins to leave on each side of the SVG element.
var chartDim = 140;  // The width and height of the individual charts.
var displayedFeatures = 4;  // The number of features to display charts for.
var chartOffsetX = 100;  // The gap between the left of the SVG element and the leftmost charts.
var chartOffsetY = 40;  // The gap between the top of the SVG elements and the topmost charts.
var chartGap = 10;  // The gap between charts in the X and Y directions.

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

// Setup the x and y scales.
var xScale = d3.scale.linear()
    .range([0, chartDim]);
var yScale = d3.scale.linear()
    .range([0, chartDim]);

// Setup the x and y axes.
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
	.ticks(5);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
	.ticks(5);

// Setup the brush action.
var brush = d3.svg.brush()
  .x(xScale)
  .y(yScale)
  .on("brushstart", brush_start)
  .on("brush", brush_move)
  .on("brushend", brush_end);

// Setup the ordinal scale for the class colors.
var classColors = d3.scale.category10();

// Load up the first example dataset visualisation.
var loadedDatasets = {};  // The datasets that have been loaded into memory.
load_dataset(dataDirectory + "ExData1.tsv", "ExData1")

/*****************
Helper Functions.
******************/

function brush_end()
{
}

function brush_move()
{
}

function brush_start()
{
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
			returnArray.push({"row_value" : rowValue, "row_index" : i, "col_value" : array2[j], "col_index" : j});
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

	// Create the chart cells.
	var chartCells = svg.selectAll(".chartCell")
		.data(cross_product(features, features))
		.enter()
		.append("g")
		.classed("chartCell", true)
		.attr("transform", function(d) { return "translate(" + (chartOffsetX + d.row_index * (chartDim + chartGap)) + ", " + (chartOffsetY + d.col_index * (chartDim + chartGap)) + ")"; })
		.each(plot_scatter)
		.call(brush);

	function plot_scatter(cell)
	{
		var chartCell = d3.select(this);
		
		// Create the boundary around the chart
		chartCell.append("rect")
			.attr("width", chartDim)
			.attr("height", chartDim)
			.classed("chartBorder", true);
		
		// Setup the domain for the data in this cell.
		xScale.domain(domainByFeature[cell.row_value]);
		yScale.domain(domainByFeature[cell.col_value]);

		// Create the points.
		chartCell.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", function(d) { return xScale(d[cell.row_value]); })
			.attr("cy", function(d) { return yScale(d[cell.col_value]); })
			.attr("r", 3)
			.classed("selected", true)
			.style("fill", function(d) { return classColors(d.Class) });
	}
}
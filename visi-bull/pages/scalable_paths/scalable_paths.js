$(document).ready(function()
{
    // SVG tag ids.
    var staticPathDemo = "#static-path-demo";
    var staticPathSliders = "#static-sliders";

    // Create the demos.
    create_static_path_demo();

    function create_static_path_demo()
    {
        // Definitions needed.
        var svgLineWidth = 600;  // The width of the SVG element containing the lines.
        var svgLineHeight = 450;  // The height of the SVG element containing the lines.
        var svgSliderWidth = 600;  // The width of the SVG element containing the sliders.
        var svgSliderHeight = 100;  // The height of the SVG element containing the sliders.
        var maxSVGWidth = 900;  // The maximum width for the SVG element containing the lines.
        var maxSVGHeight = 600;  // The maximum height for the SVG element containing the lines.

        /*******************
        * Create The Paths *
        *******************/
        // Create the SVG element for the lines.
        var svgLine = d3.select(staticPathDemo)
            .attr("width", svgLineWidth)
            .attr("height", svgLineHeight);

        // Create the data for the paths.
        var pathOneData = [{"x": 20, "y": 20}, {"x": 50, "y": 138}, {"x": 170, "y": 90}, {"x": 300, "y": 240}, {"x": 550, "y": 300}];
        var pathTwoData = [{"x": 50, "y": 400}, {"x": 125, "y": 375}, {"x": 450, "y": 225}, {"x": 550, "y": 100}, {"x": 350, "y": 50}, {"x": 375, "y": 175}];
        var pathThreeData = [{"x": 350, "y": 375}, {"x": 50, "y": 300}, {"x": 200, "y": 50}, {"x": 250, "y": 225}, {"x": 450, "y": 250}];

        // Create the line generator.
        var line = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("linear");

        // Draw the lines.
        svgLine.append("path")
            .attr("d", line(pathOneData))
            .style("stroke", "red");
        svgLine.append("path")
            .attr("d", line(pathTwoData))
            .style("stroke", "blue");
        svgLine.append("path")
            .attr("d", line(pathThreeData))
            .style("stroke", "green");

        /*********************
        * Create The Sliders *
        *********************/
        // Create the SVG element for the sliders.
        var svgSlider = d3.select(staticPathSliders)
            .attr("width", svgSliderWidth)
            .attr("height", svgSliderHeight)
            .style("outline", "none");

        // Create the slider for the SVG width.
        var widthScaleMaxVal = 450;
        var widthScale = d3.scale.linear()  // Scale used to map position on the slider to width of the SVG element.
            .domain([0, maxSVGWidth])
            .range([0, widthScaleMaxVal])
            .clamp(true);
        var widthDragBehaviour = d3.behavior.drag()
            .origin(function(d) {return d;})
            .on("drag", function(d)
                {
                    var sliderPos = d3.event.x;  // Current position of the slider handle relative to its container.

                    // Update the slider handle position.
                    d3.select(this)
                        .attr("cx", d.x = Math.max(0, Math.min(widthScaleMaxVal, sliderPos)));

                    // Update the width of the SVG element.
                    svgLine.attr("width", widthScale.invert(sliderPos));
                });
        create_slider(svgSlider, widthScale, 100, 0, 50, "Width", svgLineWidth, widthDragBehaviour);

        // Create the slider for the SVG height.
        var heightScaleMaxVal = 450;
        var heightScale = d3.scale.linear()  // Scale used to map position on the slider to height of the SVG element.
            .domain([0, maxSVGHeight])
            .range([0, heightScaleMaxVal])
            .clamp(true);
        var heightDragBehaviour = d3.behavior.drag()
            .origin(function(d) {return d;})
            .on("drag", function(d)
                {
                    var sliderPos = d3.event.x;  // Current position of the slider handle relative to its container.

                    // Update the slider handle position.
                    d3.select(this)
                        .attr("cx", d.x = Math.max(0, Math.min(heightScaleMaxVal, sliderPos)));

                    // Update the width of the SVG element.
                    svgLine.attr("height", heightScale.invert(sliderPos));
                });
        create_slider(svgSlider, heightScale, 100, svgSliderHeight / 2, 50, "Height", svgLineHeight, heightDragBehaviour);
    }

    /*******************
    * Helper Functions *
    *******************/
    function create_slider(svg, scale, sliderLeft, sliderTop, sliderHeight, sliderLabelText, startingValue, dragBehaviour)
    {
        // Create a slider.
        // svg is the SVG element in which the slider should be created.
        // scale is the scale that is going to be used to convert between slider positions and actual values.
        // sliderLeft is the offset from the left of the container containing the slider at which the axis representing the slider should be created.
        // sliderTop is the y coordinate of the top of the slider containing <g>.
        // sliderHeight is the height of the container containing the slider.
        // sliderLabelText is the text used to label what the slider allows you to alter.
        // startingValue is the scaled value at which the slider handle should start.
        // dragBehaviour is the behaviour that the slider handle should have.

        // Create the g element for holding the slider.
        var sliderBox = svg.append("g")
            .classed("sliderBox", true)
            .attr("transform", "translate(0," + sliderTop + ")");

        // Create the axis for the slider.
        var sliderAxis = d3.svg.axis()
            .scale(scale)
            .orient("bottom")
            .tickSize(0)
            .tickPadding(10);
        var axisContainer = sliderBox.append("g")
            .classed("axis", true)
            .attr("transform", "translate(" + sliderLeft + "," + sliderHeight / 2 + ")")
            .call(sliderAxis);

        // Create the halo around the slider axis.
        axisContainer.select(".domain")  // Select the path with the domain class that is created along with the axis.
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })  // Clone the domain class path...
            .classed("halo", true);  // ...and set the class of the newly cloned path (enables the .domain to act as a little shadow around the .halo path).
        var sliderLabel = sliderBox.append("text")
            .classed("slider-text", true)
            .text(sliderLabelText)
            .attr("x", sliderLeft / 3)
            .attr("y", sliderHeight / 2);

        // Add the slider handle.
        var handleRadius = 8;  // The radius of the circle used as the slider handle.
        var handle = axisContainer.append("circle")
            .datum({"x" : 0, "y" : 0})
            .classed("handle", true)
            .attr("r", handleRadius)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(dragBehaviour);
        handle.transition()  // Unnecessary intro transition to get the handle to the initial value.
            .duration(1000)
            .attr("cx", function(d) { d.x = scale(startingValue); return d.x; });
    }
});
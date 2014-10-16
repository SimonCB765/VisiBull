$(document).ready(function()
{
    // Create the tabs.
    var textForTabs = ["Iron Cook", "Zinc Saucier", "How come you always dress like you're doing your laundry?"];
    var newTabText = "New Tab";
    create_moveable_tabs("#tab-set-6");

    function create_moveable_tabs(tabSetID)
    {
        // Definitions needed.
        var svgWidth = 900;  // Width of the SVG element.
        var svgHeight = 50;  // Height of the SVG element.
        var tabWidth = 50;  // The width of each tab.
        var tabHeight = 25;  // The height of each tab.
        var backingBorderHeight = 2;  // The thickness of the border that the tabs rest on.
        var numberOfTabs = textForTabs.length;  // The number of tabs to create.
        var curveWidth = 30;  // The width of the curved region of the tabs.

        // Create the SVG element.
        var tabSet = d3.select(tabSetID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Create the <defs> to hold the masks and gradients.
        var defs = tabSet.append("defs");

        // Generate the data for the tabs.
        var tabInfo = []
        var pathsForTabs = create_tab_style_1({"tabWidth" : tabWidth, "tabHeight" : tabHeight, "curveWidth" : curveWidth});
        for (var i = 0; i < numberOfTabs; i++)
        {
            tabInfo.push({"position" : i, "transX" : i * (curveWidth + tabWidth), "transY" : svgHeight - tabHeight, "text" : textForTabs[i]});
        }

        // Create the tab containers.
        var tabContainer = tabSet.selectAll(".tab-container")
            .data(tabInfo)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
            .classed("tab-container", true);
        var tabs = tabContainer
            .append("path")
            .attr("d", function(d) { return (d.position === 0) ? pathsForTabs.selectedPath : pathsForTabs.deselectedPath; })
            .classed("tab", true);
		var tabBorderWidth = Math.ceil(parseInt(tabs.style("stroke-width"), 10));  // Get the width of the tab border.
		
		// Create the masks.
		var masks = tabContainer.append("mask")
			.attr("id", function(d) { return "mask-" + d.position; });
		masks.append("rect")
			.attr("x", function(d) { return -d.transX; })
			.attr("y", -1)
			.attr("width", svgWidth)
			.attr("height", tabHeight + tabBorderWidth)
			.classed("mask-rect", true);
		masks.append("g")
			.attr("transform", function() { return "translate(" + (-curveWidth - tabWidth + (tabBorderWidth / 2)) + ",0)"; })
			.append("path")
				.attr("d", pathsForTabs.deselectedPath)
				.attr("class", function(d) { return "left-mask clip-tab" + ((d.position === 0) ? "" : " on"); });
		masks.append("g")
			.attr("transform", function() { return "translate(" + (curveWidth + tabWidth - (tabBorderWidth / 2)) + ",0)"; })
			.append("path")
				.attr("d", pathsForTabs.deselectedPath)
				.classed({"clip-tab" : true, "on" : false, "right-mask" : true});
		tabContainer.style("mask", function(d) { return "url(#mask-" + d.position + ")"; });

        // Setup the behaviour of the tabs.
        tabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
        tabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
        var selectedTabContainer = tabSet.select(".tab-container");  // Select the first tab.
		var selectedTab = selectedTabContainer.select(".tab");
        selectedTab.classed("selected", true);
        tabContainer.on("mousedown", function(d)
            {
                if (d3.event.button == 0)
                {
                    // Left click.
                    // Clear old selected tab information.
                    selectedTab.classed("selected", false);

                    // Make the appearance of the tabs fit with the choice of tab that should be on top (i.e. the one clicked).
                    tabs
                        .attr("d", function(tabD)
                            {
                                var desiredTabPath = pathsForTabs.deselectedPath;  // Default to the deselected tab appearance.
                                if (tabD.position === d.position)
                                {
                                    desiredTabPath = pathsForTabs.selectedPath;  // Tab has been clicked on to select it.
                                }
                                return desiredTabPath;
                            });
					
					// Switch up the masks to reflect the new selected tab.
					var clickedContainer = d3.select(this);
					var previousClickedTabPos = selectedTabContainer.datum().position;
					console.log(selectedTabContainer.datum(), previousClickedTabPos);
					if (previousClickedTabPos !== 0)
					{
						// If the previously clicked on tab was not the leftmost tab, then mask out its left side as it is being deselected.
						selectedTabContainer.select(".left-mask").classed("on", true);
						d3.select("#mask-" + (previousClickedTabPos - 1) + " .right-mask").classed("on", false);
					}
					clickedContainer.select(".clip-tab").classed("on", false);  // No masking for the tab that was just clicked on.
					if (d.position !== 0)
					{
						// Mask out the right side of the tab to the left of the one click on, if the tab clicked on is not the leftmost tab.
						clickedContainer.select("#mask-" + (d.position - 1) + " .right-mask").classed("on", true);
					}
					/*
					masks.each(function(maskD)
						{
							if (maskD.position === d.position)
							{
								console.log(d3.select(this));
							}
							else if (maskD.position === 0)
							{
								// The 0th index tab is a bit special, as it can only be full or missing its right portion.
								// If this branch is reached, then it was not the 0th index tab that was clicked on.
								if (d.position === 1)
								{
									// The 1st index tab was clicked on.
								}
								else
								{
								}
							}
							else if (maskD.position === d.position - 1)
							{
							}
							else
							{
							}
						});
					*/

                    // Record new selected tab information.
					selectedTabContainer = clickedContainer;
                    selectedTab = selectedTabContainer.select(".tab");
                    selectedTab.classed("selected", true);
                }
            });

        // Add the baselines on which the tabs will sit.
        tabSet.append("rect")
            .attr("width", svgWidth)
            .attr("height", backingBorderHeight)
            .attr("x", 0)
            .attr("y", svgHeight - backingBorderHeight)
            .classed("backing", true);
    }


    /*************************
    * Tab Creation Functions *
    *************************/
    function create_tab_style_1(config)
    {
        /******************************
        * Parse Configuration Inputs. *
        ******************************/
        // Determine initial coordinates.
        var tabWidth = typeof config.tabWidth !== "undefined" ? config.tabWidth : 100;
        var tabHeight = typeof config.tabHeight !== "undefined" ? config.tabHeight : 25;
        var curveWidth = typeof config.curveWidth !== "undefined" ? config.curveWidth : 30;
        var deselectedTabWidth = typeof config.deselectedTabWidth !== "undefined" ? config.deselectedTabWidth : tabWidth;

        /************************
        * Create the tab paths. *
        ************************/
        var selectedTabPath =
            "M0," + tabHeight +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
            "t" + curveWidth / 2 + "," + -tabHeight / 2 +
            "l" + tabWidth + "," + 0 +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
            "t" + curveWidth / 2 + "," + tabHeight / 2;
        var deselectedTabPath =
            "M0," + tabHeight +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
            "t" + curveWidth / 2 + "," + -tabHeight / 2 +
            "l" + deselectedTabWidth + "," + 0 +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
            "t" + curveWidth / 2 + "," + tabHeight / 2;

        return {"selectedPath" : selectedTabPath, "deselectedPath" : deselectedTabPath};
    }
});
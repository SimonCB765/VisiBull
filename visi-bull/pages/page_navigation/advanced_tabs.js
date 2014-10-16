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
        var baselineY = svgHeight - backingBorderHeight;  // The Y coordinate of the horizontal baseline on which the tabs will rest.
        var numberOfTabs = textForTabs.length;  // The number of tabs to create.
        var curveWidth = 30;  // The width of the curved region of the tabs.

        // Create the SVG element.
        var tabSet = d3.select(tabSetID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Generate the data for the tabs.
        var tabInfo = []
        var pathsForTabs = create_tab_style_1({"tabWidth" : tabWidth, "tabHeight" : tabHeight, "curveWidth" : curveWidth});
        for (var i = 0; i < numberOfTabs; i++)
        {
            tabInfo.push({"key" : i, "transX" : i * (curveWidth + tabWidth), "transY" : baselineY - tabHeight, "text" : textForTabs[i]});
        }

        // Create the tabs.
        var tabContainer = tabSet.selectAll(".tab-container")
            .data(tabInfo)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
            .classed("tab-container", true);
        var tabs = tabContainer
            .append("path")
            .attr("d", function(d, i) { return (i === 0) ? pathsForTabs.selectedPath : pathsForTabs.deselectedPath; })
            .classed("tab", true);

        // Setup the behaviour of the tabs.
        tabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
        tabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
        var selectedTab = tabSet.select(".tab-container").select(".tab");
        selectedTab.classed("selected", true);
        tabContainer.on("mousedown", function(d, i)
            {
                if (d3.event.button == 0)
                {
                    // Left click.
                    // Clear old selected tab information.
                    selectedTab.classed("selected", false);

                    // Make the appearance of the tabs fit with the choice of tab that should be on top (i.e. the one clicked).
                    tabs
                        .attr("d", function(tabD, tabI)
                            {
                                var desiredTabPath = pathsForTabs.deselectedPath;  // Default to the deselected tab appearance.
                                if (tabI === i)
                                {
                                    desiredTabPath = pathsForTabs.selectedPath;
                                }
                                else if (tabI === 0)
                                {
                                    // The 0th index tab is a bit special, as it can only be full or missing its right portion.
                                    // If this branch is reached, then it was not the 0th index tab that was clicked on.
                                    if (i === 1)
                                    {
                                        // The 1st index tab was clicked on.
                                    }
                                    else
                                    {
                                    }
                                }
                                else if (tabI === i - 1)
                                {
                                }
                                else
                                {
                                }
                                return desiredTabPath;
                            });

                    // Record new selected tab information.
                    selectedTab = d3.select(this).select(".tab");
                    selectedTab.classed("selected", true);
                }
            });

        // Add the baselines on which the tabs will sit.
        tabSet.append("rect")
            .attr("width", svgWidth)
            .attr("height", backingBorderHeight)
            .attr("x", 0)
            .attr("y", baselineY)
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
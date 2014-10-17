$(document).ready(function()
{
    // Create the tabs.
    var textForTabs = ["Iron Cook", "Zinc Saucier", "How come you always dress like you're doing your laundry?", "I have to go and buy a single piece of fruit with a coupon and then return it."];
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
        var tabConfig = {"tabWidth" : tabWidth, "tabHeight" : tabHeight, "curveWidth" : curveWidth};
        var pathsForTabs = create_tab_style_1(tabConfig);
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
        var clips = tabContainer.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.position; });
        var clipPaths = clips.append("path")
            .classed("clip-tab", true)
            .attr("d", function(d)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2)};
                    if (d.position !== 0)
                    {
                        config.tabOnLeft = tabSet.select("#clip-" + (d.position - 1)).datum();
                    }
                    return create_clip_tab_style_1(config, d);
                });
        tabContainer.attr("clip-path", function(d) { return "url(#clip-" + d.position + ")"; });

        // Setup the behaviour of the tabs.
        tabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
        tabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
        var selectedTab = tabSet.select(".tab-container").select(".tab");  // Select the first tab.
        selectedTab.classed("selected", true);

        // Setup the drag behaviour of the tabs. Have to set the origin properly, so that the x and y positions of the drag event are placed correctly
        // within the whole svg element, rather than just in relation to the transformed coordinates of the <g> containing the tab.
        var tabDrag = d3.behavior.drag()
            .origin(function(d) { var mousePos = d3.mouse(this); return {"x" : d.transX + mousePos[0], "y" : d.transY + mousePos[1]}; })
            .on("dragstart", drag_start)
            .on("drag", drag_update)
            .on("dragend", drag_end);
        tabContainer.call(tabDrag);

        // Add the baselines on which the tabs will sit.
        tabSet.append("rect")
            .attr("width", svgWidth)
            .attr("height", backingBorderHeight)
            .attr("x", 0)
            .attr("y", svgHeight - backingBorderHeight)
            .classed("backing", true);

        /*********************
        * Tab Drag Functions *
        *********************/
        var startOfDragX;  // The x coordinate where the dragging started. Used to ensure that the mouse stays at the same point over the tab during the drag.
        function drag_end(d)
        {
        }

        function drag_start(d)
        {
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

            /*********************************************
            * Alter Clip Paths To Highlight Selected Tab *
            *********************************************/
            // Setup the clip paths for each tab.
            clipPaths.attr("d", function(clipD)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2)};
                    if (clipD.position === d.position)
                    {
                        // The selected tab should have no clipping.
                    }
                    else if (clipD.position === 0)
                    {
                        // The leftmost tab can only ever be full or have its right portion clipped.
                        if (d.position === 1)
                        {
                            // The tab second from left was clicked on, so clip the right portion of the leftmost tab.
                            config.tabOnRight = d;
                        }
                    }
                    else if (clipD.position === numberOfTabs - 1)
                    {
                        // The rightmost tab needs its own condition as it can only ever be full or have its left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + (clipD.position - 1)).datum();
                    }
                    else if (clipD.position === d.position - 1)
                    {
                        // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                        // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + (clipD.position - 1)).datum();
                        config.tabOnRight = d;
                    }
                    else
                    {
                        // All other tabs should just have their left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + (clipD.position - 1)).datum();
                    }
                    return create_clip_tab_style_1(config, clipD);
                });

            // Record new selected tab information.
            selectedTab = d3.select(this).select(".tab");
            selectedTab.classed("selected", true);

            // Record where the drag started.
            startOfDragX = d3.mouse(this)[0];
        }

        function drag_update(d)
        {
            d3.select(this)
                .attr("transform", function(d)
                    {
                        d.transX = Math.max(0, Math.min(svgWidth - (curveWidth * 2) - tabWidth, d3.event.x - startOfDragX));
                        return "translate(" + d.transX + "," + d.transY + ")";
                    });
        }
    }

    /*************************
    * Tab Creation Functions *
    *************************/
    function create_tab_style_1(config, startOffset)
    {
        /*****************************
        * Parse Configuration Inputs *
        *****************************/
        // Determine initial coordinates.
        var tabWidth = typeof config.tabWidth !== "undefined" ? config.tabWidth : 100;
        var tabHeight = typeof config.tabHeight !== "undefined" ? config.tabHeight : 25;
        var curveWidth = typeof config.curveWidth !== "undefined" ? config.curveWidth : 30;
        var deselectedTabWidth = typeof config.deselectedTabWidth !== "undefined" ? config.deselectedTabWidth : tabWidth;

        /***********************
        * Create the tab paths *
        ***********************/
        var selectedTabPath =
            "M0," + tabHeight +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
            "t" + curveWidth / 2 + "," + -tabHeight / 2 +
            "h" + tabWidth +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
            "t" + curveWidth / 2 + "," + tabHeight / 2;
        var deselectedTabPath =
            "M0," + tabHeight +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
            "t" + curveWidth / 2 + "," + -tabHeight / 2 +
            "h" + deselectedTabWidth +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
            "t" + curveWidth / 2 + "," + tabHeight / 2;

        return {"selectedPath" : selectedTabPath, "deselectedPath" : deselectedTabPath};
    }

    function create_clip_tab_style_1(config, currentTabData)
    {
        /*****************************
        * Parse Configuration Inputs *
        *****************************/
        // Determine initial coordinates.
        var tabWidth = typeof config.tabWidth !== "undefined" ? config.tabWidth : 100;
        var tabHeight = typeof config.tabHeight !== "undefined" ? config.tabHeight : 25;
        var curveWidth = typeof config.curveWidth !== "undefined" ? config.curveWidth : 30;
        var heightOffset = typeof config.heightOffset !== "undefined" ? config.heightOffset : 0;
        var leftStartOffset = typeof config.tabOnLeft !== "undefined" ? config.tabOnLeft.transX - currentTabData.transX : undefined;
        var rightStartOffset = typeof config.tabOnRight !== "undefined" ? config.tabOnRight.transX - currentTabData.transX : undefined;
        var heightExtension = typeof config.heightExtension !== "undefined" ? config.heightExtension : 0;

        /***********************
        * Create the tab paths *
        ***********************/
        var clipTabPath = "";
        var horizontalTravelled = 0;

        // Outline the left clipping tab (if needed).
        if (leftStartOffset !== undefined)
        {
            var leftTabClip =
                "M" + leftStartOffset + "," + tabHeight +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "h" + tabWidth +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2;
            clipTabPath += leftTabClip;
            horizontalTravelled += (curveWidth + tabWidth + curveWidth);
        }
        else
        {
            clipTabPath += ("M0," + tabHeight);
            clipTabPath += ("h" + curveWidth);
            horizontalTravelled += curveWidth;
        }

        // Outline the right clip tab if needed.
        if (rightStartOffset !== undefined)
        {
            var rightTabClip =
                "l" + (rightStartOffset - curveWidth) + ",0" +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "h" + tabWidth +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2;
            clipTabPath += rightTabClip;
            horizontalTravelled += ((rightStartOffset - curveWidth) + curveWidth + tabWidth + curveWidth);
        }
        else
        {
            clipTabPath += ("h" + (tabWidth + curveWidth));
            horizontalTravelled += (tabWidth + curveWidth);
        }

        // Close up the clip outline.
        clipTabPath += ("v" + -(tabHeight + heightExtension) + "h" + -horizontalTravelled + "z");

        return clipTabPath;
    }
});
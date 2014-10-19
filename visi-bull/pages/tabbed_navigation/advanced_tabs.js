$(document).ready(function()
{
    // Create the tabs.
    var textForTabs = ["Iron Cook", "Hey, what kinda party is this? There's no booze and only one hooker.", "I just want to talk. It has nothing to do with mating.", "Zinc Saucier", "How come you always dress like you're doing your laundry?", "I have to go and buy a single piece of fruit with a coupon and then return it."];
	var iconsForTabs = ["/static/tabbed_navigation/Icons/Bender.jpg", "", "/static/tabbed_navigation/Icons/Fry.jpg", "", "/static/tabbed_navigation/Icons/Leela.jpg", "/static/tabbed_navigation/Icons/Zoidberg.jpg"];
    var newTabText = "New Tab";
    create_moveable_tabs("#tab-set-6");

    function create_moveable_tabs(tabSetID)
    {
        // Definitions needed.
        var svgWidth = 900;  // Width of the SVG element.
        var svgHeight = 50;  // Height of the SVG element.
        var tabWidth = 100;  // The width of each tab.
        var tabHeight = 25;  // The height of each tab.
        var backingBorderHeight = 2;  // The thickness of the border that the tabs rest on.
        var numberOfTabs = textForTabs.length;  // The number of tabs to create.
        var curveWidth = 20;  // The width of the curved region of the tabs.
        var currentKey = 0;  // Counter to generate unique keys for identifying tabs.
        var keyToPosition = {};  // Mapping from tab keys to the position that the tab is in.
        var positionToKey = {};  // Mapping from positions to the key of the tab in that position.
		var closeButtonRadius = 6;  // The radius of the circle containing the close button.
		var closeButtonStartX = tabWidth - (2 * closeButtonRadius);  // The offset into the tab content where the close button starts.
		var tabIconSize = tabHeight - 10;  // The width and height of the square holding the icon on the left of the tab.

        // Create the SVG element.
        var tabSet = d3.select(tabSetID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Create the <defs> to hold the gradients for the text.
        var defs = tabSet.append("defs");

        // Generate the data for the tabs.
        var tabInfo = []
        var tabConfig = {"tabWidth" : tabWidth, "tabHeight" : tabHeight, "curveWidth" : curveWidth};
        var pathForTabs = create_tab_style_1(tabConfig);
        for (var i = 0; i < numberOfTabs; i++)
        {
            tabInfo.push({"key" : currentKey, "transX" : i * (curveWidth + tabWidth), "transY" : svgHeight - tabHeight, "text" : textForTabs[i], "image" : iconsForTabs[i]});
            keyToPosition[currentKey] = i
            positionToKey[i] = currentKey;
            currentKey++;
        }

        // Create the tab containers.
        var tabContainer = tabSet.selectAll(".tab-container")
            .data(tabInfo)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
            .attr("class", function(d) { return "tab-container " + ("tab-container-" + d.key); });
        var tabs = tabContainer
            .append("path")
            .attr("d", pathForTabs)
            .classed("tab", true);
        var tabBorderWidth = Math.ceil(parseInt(tabs.style("stroke-width"), 10));  // Get the width of the tab border.

        // Create the clip paths for the tabs.
        var clips = tabContainer.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.key; });
        clips.append("path")
            .classed("clip-tab", true)
            .attr("d", function(d)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2), "containerWidth" : svgWidth};
                    if (keyToPosition[d.key] !== 0)
                    {
                        config.tabOnLeft = tabSet.select("#clip-" + (keyToPosition[d.key] - 1)).datum();
                    }
                    return create_clip_tab_style_1(config, d);
                });
        tabContainer.attr("clip-path", function(d) { return "url(#clip-" + d.key + ")"; });

        // Setup the behaviour of the tabs.
        tabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
        tabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
        var selectedTab = tabSet.select(".tab-container");  // Select the first tab.
        selectedTab.classed("selected", true);

        // Setup the drag behaviour of the tabs. Have to set the origin properly, so that the x and y positions of the drag event are placed correctly
        // within the whole svg element, rather than just in relation to the transformed coordinates of the <g> containing the tab.
        var tabDrag = d3.behavior.drag()
            .origin(function(d) { var mousePos = d3.mouse(this); return {"x" : d.transX + mousePos[0], "y" : d.transY + mousePos[1]}; })
            .on("dragstart", drag_start)
            .on("drag", drag_update)
            .on("dragend", drag_end);
        tabContainer.call(tabDrag);
		
		// Add the containers for the tab content.
        var tabContentContainer = tabContainer
            .append("g")
            .classed("tab-content", true)
            .attr("transform", function(d) { return "translate(" + curveWidth + ",0)"; });
		
		// Add the close button to each tab. In order to prevent clicking and dragging on the close button moving the tab, a drag handler that
		// prevents event propagation is needed, in order to prevent the drag on the tab container being fired by a mousedown on the close button.
		var closeButtons = tabContentContainer.append("g")
			.attr("transform", function() { return "translate(" + closeButtonStartX + ",0)"; })
			.classed("close-button", true);
		var closeDrag = d3.behavior.drag()
            .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });
        closeButtons.call(closeDrag);
		closeButtons
			.on("click", function(d)
				{
					// Select the tab that is to be closed.
					var tabToClose = tabSet.select(".tab-container-" + d.key);
					var dataOfClickedTab = tabToClose.datum();
					
					// If the tab to be closed is the selected one, then make the tab to its left the selected one.
					if (dataOfClickedTab.key === selectedTab.datum().key)
					{
						// Get position of selected tab (the one being closed).
						var selectedPos = keyToPosition[selectedTab.datum().key];
						var newSelectedPos = (selectedPos === 0) ? 1 : selectedPos - 1;
						var keyOfNewSelected = positionToKey[newSelectedPos];
						selectedTab = tabSet.select(".tab-container-" + keyOfNewSelected);
						selectedTab.classed("selected", true);
					}
					
					// Update all mappings from position to key and from key to position.
					var posOfClickedTab = keyToPosition[dataOfClickedTab.key];
					for (var i = 0; i < numberOfTabs; i++)
					{
						if (posOfClickedTab < i)
						{
							// If the clicked tab is in a position to the left of the one currently being checked.
							var currentKey = positionToKey[i];
							positionToKey[i - 1] = positionToKey[i];
							keyToPosition[currentKey] = i - 1;
						}
					}
					delete positionToKey[numberOfTabs - 1];
					delete keyToPosition[dataOfClickedTab.key];
					
					// Remove the tab that had its close button clicked.
					tabToClose.node().remove();
					numberOfTabs--;
				});
		closeButtons.append("circle")
			.attr("cx", closeButtonRadius)
			.attr("cy", tabHeight / 2)
			.attr("r", closeButtonRadius);
		var crossStartCoordsXLength = 4 * Math.cos(0.25 * Math.PI);
		var crossStartCoordsYLength = 4 * Math.sin(0.25 * Math.PI);
		var posTopLeft = [closeButtonRadius - crossStartCoordsXLength, (tabHeight / 2) - crossStartCoordsYLength];
		var posTopRight = [closeButtonRadius + crossStartCoordsXLength, (tabHeight / 2) - crossStartCoordsYLength];
		var posBottomRight = [closeButtonRadius + crossStartCoordsXLength, (tabHeight / 2) + crossStartCoordsYLength];
		var posBottomLeft = [closeButtonRadius - crossStartCoordsXLength, (tabHeight / 2) + crossStartCoordsYLength];
		closeButtons.append("path")
			.attr("d", "M" + posTopLeft[0] + "," + posTopLeft[1] +
					   "L" + posBottomRight[0] + "," + posBottomRight[1] +
					   "M" + posTopRight[0] + "," + posTopRight[1] +
					   "L" + posBottomLeft[0] + "," + posBottomLeft[1]);
		
		// Add the favicon type icon to each tab that is meant to have one.
		var tabIcons = tabContentContainer.filter(function(d) { return d.image !== ""; }).append("g")  // Filter out tabs without an icon (where image is "").
			.attr("transform", function() { return "translate(0,0)"; })
			.classed("tab-icon", true);
		var patterns = tabIcons.append("pattern")
			.attr("id", function(d) { return "icon-image-" + d.key; })
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", tabIconSize)
			.attr("width", tabIconSize);
		patterns.append("image")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", tabIconSize)
			.attr("width", tabIconSize)
			.attr("xlink:href", function(d) { return d.image; });
		tabIcons.append("rect")
			.attr("x", 0)
			.attr("y", (tabHeight - tabIconSize) / 2)
			.attr("width", tabIconSize)
			.attr("height", tabIconSize)
			.style("fill", function(d) { return "url(#icon-image-" + d.key + ")"});

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
        var snapToLocation;  // The x coordinate where the dragged tap will snap to on release.
        function drag_end(d)
        {
            // Transition the dragged tab to its resting place.
            d3.select(this)
                .attr("transform", function(contD) { contD.transX = snapToLocation; return "translate(" + contD.transX + "," + contD.transY + ")"; });

            // Set the clip paths.
            var selectedTabPos = keyToPosition[d.key];
            tabSet.selectAll(".clip-tab").attr("d", function(clipD)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2), "containerWidth" : svgWidth};
                    var currentTabPos = keyToPosition[clipD.key];
                    if (clipD.key === d.key)
                    {
                        // The selected tab should have no clipping.
                    }
                    else if (currentTabPos === 0)
                    {
                        // The leftmost tab can only ever be full or have its right portion clipped.
                        if (selectedTabPos === 1)
                        {
                            // The tab second from left was clicked on, so clip the right portion of the leftmost tab.
                            config.tabOnRight = d;
                        }
                    }
                    else if (currentTabPos === numberOfTabs - 1)
                    {
                        // The rightmost tab needs its own condition as it can only ever be full or have its left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    else if (currentTabPos === selectedTabPos - 1)
                    {
                        // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                        // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                        config.tabOnRight = d;
                    }
                    else
                    {
                        // All other tabs should just have their left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    return create_clip_tab_style_1(config, clipD);
                });
        }

        function drag_start(d)
        {
            // Clear old selected tab information.
            selectedTab.classed("selected", false);

            /*********************************************
            * Alter Clip Paths To Highlight Selected Tab *
            *********************************************/
            // Setup the clip paths for each tab.
            var selectedTabPos = keyToPosition[d.key];
            tabSet.selectAll(".clip-tab").attr("d", function(clipD)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2), "containerWidth" : svgWidth};
                    var currentTabPos = keyToPosition[clipD.key];
                    if (clipD.key === d.key)
                    {
                        // The selected tab should have no clipping.
                    }
                    else if (currentTabPos === 0)
                    {
                        // The leftmost tab can only ever be full or have its right portion clipped.
                        if (selectedTabPos === 1)
                        {
                            // The tab second from left was clicked on, so clip the right portion of the leftmost tab.
                            config.tabOnRight = d;
                        }
                    }
                    else if (currentTabPos === numberOfTabs - 1)
                    {
                        // The rightmost tab needs its own condition as it can only ever be full or have its left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    else if (currentTabPos === selectedTabPos - 1)
                    {
                        // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                        // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                        config.tabOnRight = d;
                    }
                    else
                    {
                        // All other tabs should just have their left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    return create_clip_tab_style_1(config, clipD);
                });

            // Record new selected tab information.
            selectedTab = d3.select(this);
            selectedTab.classed("selected", true);

            // Record where the drag started and where the tab will snap to.
            startOfDragX = d3.mouse(this)[0];
            snapToLocation = d.transX;
        }

        function drag_update(d)
        {
            // Update tab location.
            d3.select(this)
                .attr("transform", function(d)
                    {
                        d.transX = Math.max(0, Math.min(svgWidth - (curveWidth * 2) - tabWidth, d3.event.x - startOfDragX));
                        return "translate(" + d.transX + "," + d.transY + ")";
                    });

            var selectedTabPos = keyToPosition[d.key];  // Position of selected tab in order.

            /**********************************
            * Reorder Tab Positions If Needed *
            **********************************/
            tabSet.selectAll(".clip-tab").each(function(clipD)
                {
                    var currentTabPos = keyToPosition[clipD.key];
                    if (d.key !== clipD.key)
                    {
                        if (currentTabPos < selectedTabPos)
                        {
                            // Current tab occurs to the left of the one being dragged.
                            // Swap positions of tabs if the left end of the one being dragged has passed the mid point of this tab.
                            if ((d.transX + curveWidth) <= (clipD.transX + curveWidth + (tabWidth / 2)))
                            {
                                keyToPosition[d.key] = currentTabPos;
                                keyToPosition[clipD.key] = selectedTabPos;
                                positionToKey[selectedTabPos] = clipD.key;
                                positionToKey[currentTabPos] = d.key;
                                tabSet.select(".tab-container-" + clipD.key)
                                    .attr("transform", function(contD) { snapToLocation = contD.transX; contD.transX += tabWidth + curveWidth; return "translate(" + contD.transX + "," + contD.transY + ")"; });
                            }
                        }
                        else if (currentTabPos > selectedTabPos)
                        {
                            // Current tab occurs to the right of the one being dragged.
                            // Swap positions of tabs if the right end of the one being dragged has passed the mid point of this tab.
                            if ((d.transX + curveWidth + tabWidth) >= (clipD.transX + curveWidth + (tabWidth / 2)))
                            {
                                keyToPosition[d.key] = currentTabPos;
                                keyToPosition[clipD.key] = selectedTabPos;
                                positionToKey[selectedTabPos] = clipD.key;
                                positionToKey[currentTabPos] = d.key;
                                tabSet.select(".tab-container-" + clipD.key)
                                    .attr("transform", function(contD) { snapToLocation = contD.transX; contD.transX -= (tabWidth + curveWidth); return "translate(" + contD.transX + "," + contD.transY + ")"; });
                            }
                        }
                    }
                })

            /*******************************************
            * Alter Clip Paths To Reflect Tab Movement *
            *******************************************/
            // Setup the clip paths for each tab.
            tabSet.selectAll(".clip-tab").attr("d", function(clipD)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2), "containerWidth" : svgWidth};
                    var currentTabPos = keyToPosition[clipD.key];
                    if (clipD.key === d.key)
                    {
                        // The selected tab should have no clipping.
                    }
                    else if (currentTabPos === 0)
                    {
                        // The leftmost tab can only ever be full or have its right portion clipped.
                        if (selectedTabPos === 1)
                        {
                            // The tab second from left was clicked on, so clip the right portion of the leftmost tab.
                            config.tabOnRight = d;
                        }
                    }
                    else if (currentTabPos === numberOfTabs - 1)
                    {
                        // The rightmost tab needs its own condition as it can only ever be full or have its left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    else if (currentTabPos === selectedTabPos - 1)
                    {
                        // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                        // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                        config.tabOnRight = d;
                    }
                    else
                    {
                        // All other tabs should just have their left portion clipped.
                        config.tabOnLeft = tabSet.select("#clip-" + positionToKey[currentTabPos - 1]).datum();
                    }
                    return create_clip_tab_style_1(config, clipD);
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

        return selectedTabPath;
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
        var containerWidth = typeof config.containerWidth !== "undefined" ? config.containerWidth : 900;

        /***********************
        * Create the tab paths *
        ***********************/
        var clipTabPath = "M" + (-currentTabData.transX) + "," + tabHeight;

        // Outline the left clipping tab (if needed).
        if (leftStartOffset !== undefined)
        {
            var leftTabClip =
                "H" + leftStartOffset +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "h" + tabWidth +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2;
            clipTabPath += leftTabClip;
        }
        else
        {
            clipTabPath += ("H" + (curveWidth));
        }

        // Outline the right clip tab if needed.
        if (rightStartOffset !== undefined)
        {
            var rightTabClip =
                "H" + rightStartOffset +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "h" + tabWidth +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2;
            clipTabPath += rightTabClip;
        }

        // Close up the clip outline.
        clipTabPath += ("H" + containerWidth + "v" + -(tabHeight + heightExtension) + "H" + (-currentTabData.transX) + "z");

        return clipTabPath;
    }
});
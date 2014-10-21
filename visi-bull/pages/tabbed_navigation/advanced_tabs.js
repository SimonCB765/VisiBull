$(document).ready(function()
{
    // Create the tabs.
    var textForTabs = ["Iron Cook", "Hey, what kinda party is this? There's no booze and only one hooker.", "I just want to talk. It has nothing to do with mating.", "Zinc Saucier", "How come you always dress like you're doing your laundry?", "I have to go and buy a single piece of fruit with a coupon and then return it."];
    var iconsForTabs = ["/static/tabbed_navigation/Icons/Bender.jpg", "", "/static/tabbed_navigation/Icons/Fry.jpg", "", "/static/tabbed_navigation/Icons/Leela.jpg", "/static/tabbed_navigation/Icons/Zoidberg.jpg"];
    create_moveable_tabs("#movable-tabs");

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
        var textStartWithIcon = tabIconSize + 2;  // The x position of the start of the text in a tab when there is a icon present.
        var transitionDuration = 200;  // The duration of all tab transitions.

        // Create the SVG element.
        var tabSet = d3.select(tabSetID)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Create the <defs> to hold the text clip paths and gradients.
        var defs = tabSet.append("defs");

        // Generate the data for the tabs.
        var tabInfo = []
        var tabConfig = {"tabWidth" : tabWidth, "tabHeight" : tabHeight, "curveWidth" : curveWidth};
        var pathForTabs = create_tab_style_1(tabConfig);
        for (var i = 0; i < numberOfTabs; i++)
        {
            tabInfo.push({"key" : currentKey, "restingX" : i * (curveWidth + tabWidth), "transX" : i * (curveWidth + tabWidth), "transY" : svgHeight - tabHeight, "text" : textForTabs[i], "image" : iconsForTabs[i]});
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
            .attr("id", function(d) { return "tab-container-" + d.key; })
            .attr("class", function(d) { return "tab-container"; });
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
                        config.leftTabXPos = tabSet.select("#clip-" + (keyToPosition[d.key] - 1)).datum().transX;
                    }
                    return create_clip_tab_style_1(config, d.transX);
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
                    var tabToClose = tabSet.select("#tab-container-" + d.key);
                    var dataOfClickedTab = tabToClose.datum();

                    // If the tab to be closed is the selected one, then make the tab to its left the selected one.
                    if (dataOfClickedTab.key === selectedTab.datum().key)
                    {
                        // Get position of selected tab (the one being closed).
                        var selectedPos = keyToPosition[selectedTab.datum().key];
                        var newSelectedPos = (selectedPos === 0) ? 1 : selectedPos - 1;
                        var keyOfNewSelected = positionToKey[newSelectedPos];
                        selectedTab = tabSet.select("#tab-container-" + keyOfNewSelected);
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

                            // Transition the current tab one position to the left.
                            var currentTab = tabSet.select("#tab-container-" + currentKey);
                            currentTab.datum().restingX -= (tabWidth + curveWidth);
                            transition_tab(currentTab);
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

        // Add the text to the tabs.
        defs.append("clipPath")
            .attr("id", "clip-advanced")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", closeButtonStartX)
                .attr("height", tabHeight + tabBorderWidth);
        var tabTextElements = tabContentContainer
            .append("text")
            .classed("tab-text", true)
            .attr("x", function(d) { return (d.image === "") ? 0 : textStartWithIcon; })
            .attr("y", (tabHeight + tabBorderWidth) / 2)
            .attr("clip-path", "url(#clip-advanced)")
            .text(function(d) { return d.text; });

        // Fade out text that is too long.
        tabTextElements.each(function(d, i)
            {
                var currentTextBBox = this.getBBox()
                var currentTextWidth = currentTextBBox.width;
                var maxTextWidth = (d.image === "") ? closeButtonStartX : closeButtonStartX - textStartWithIcon;

                if (currentTextWidth > maxTextWidth)
                {
                    // If the text is wider than the tab, then create the gradient for the fade.
                    var fadeStart = (maxTextWidth * 0.7) / currentTextWidth;
                    var fadeEnd = (maxTextWidth * 1.0) / currentTextWidth;
                    var gradient = defs.append("linearGradient")
                        .attr("id", "fadeGradient-advanced-" + i)
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "100%")
                        .attr("y2", "0%");
                    gradient.append("stop")
                        .classed("grad-start", true)
                        .attr("offset", fadeStart);
                    gradient.append("stop")
                        .classed("grad-end", true)
                        .attr("offset", fadeEnd);

                    // Set the fade.
                    d3.select(this)
                        .style("fill", "url(#fadeGradient-advanced-" + i + ")");
                }
            });

        // Add the baselines on which the tabs will sit.
        tabSet.append("rect")
            .attr("width", svgWidth)
            .attr("height", backingBorderHeight)
            .attr("x", 0)
            .attr("y", svgHeight - backingBorderHeight)
            .classed("backing", true);

        /******************
        * Tab Transitions *
        ******************/
        function transition_tab(currentTab)
        {
            currentTab
                .transition()
                .duration(transitionDuration)
                .ease("linear")
                .each("start", function(d) { currentlyTransitioning.push(d.key); })
                .tween("transform", function(d)
                    {
                        var interpolator = d3.interpolate(d.transX, d.restingX);
                        return function(t)
                            {
                                d.transX = interpolator(t);  // Determine position of released tab at this point in the transition.
                                d3.select(this)  // Update the released tab's position.
                                    .attr("transform", function() { return "translate(" + d.transX + "," + d.transY + ")"; });
                                update_tab_clipping(selectedTab.datum());  // Set the clip paths after this bit of the transition.
                            }
                    })
                .each("end", function(d) { currentlyTransitioning.splice(currentlyTransitioning.indexOf(d.key)); });
        }

        /***********************
        * Tab Clipping Updater *
        ***********************/
        function update_tab_clipping(selectedTabData)
        {
            // Setup the clip paths for each tab.
            var selectedTabPos = keyToPosition[selectedTabData.key];
            tabSet.selectAll(".clip-tab").attr("d", function(clipD)
                {
                    // Set the configuration information for creating the clip path. Extend the width and and height by (tabBorderWidth / 2) to
                    // account for half the stroke of the tabs being outside the tab (as with all SVG elements).
                    var config = {"tabWidth" : tabWidth + (tabBorderWidth / 2), "tabHeight" : tabHeight, "curveWidth" : curveWidth,
                                  "heightExtension" : (tabBorderWidth / 2), "containerWidth" : svgWidth};
                    var currentTabPos = keyToPosition[clipD.key];
                    if (clipD.key === selectedTabData.key)
                    {
                        // The selected tab should have no clipping.
                    }
                    else if (currentTabPos === 0)
                    {
                        // The leftmost tab can only ever be full or have its right portion clipped.
                        if (selectedTabPos === 1)
                        {
                            // The tab second from left was clicked on, so clip the right portion of the leftmost tab.
                            config.rightTabXPos = selectedTabData.transX;
                        }
                    }
                    else if (currentTabPos === numberOfTabs - 1)
                    {
                        // The rightmost tab needs its own condition as it can only ever be full or have its left portion clipped.
                        config.leftTabXPos = tabSet.select("#tab-container-" + positionToKey[currentTabPos - 1]).datum().transX;
                    }
                    else if (currentTabPos === selectedTabPos - 1)
                    {
                        // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                        // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                        config.leftTabXPos = tabSet.select("#tab-container-" + positionToKey[currentTabPos - 1]).datum().transX;
                        config.rightTabXPos = selectedTabData.transX;
                    }
                    else
                    {
                        // All other tabs should just have their left portion clipped.
                        config.leftTabXPos = tabSet.select("#tab-container-" + positionToKey[currentTabPos - 1]).datum().transX;
                    }
                    return create_clip_tab_style_1(config, clipD.transX);
                });
        }

        /*********************
        * Tab Drag Functions *
        *********************/
        var startOfDragX;  // The x coordinate where the dragging started. Used to ensure that the mouse stays at the same point over the tab during the drag.
        var snapToLocation;  // The x coordinate where the dragged tap will snap to on release.
        var currentlyTransitioning = [];  // A set of currently transitioning tabs. Used to prevent a transition being started on a tab while another is already going.
        function drag_end(d)
        {
            // Transition the dragged tab to its resting place.
            // If the transition is interrupted while it is going (e.g. by the user clicking on the transitioning tab), then the transition is
            // interrupted. This causes the tab's final resting "correct" position to not be in the desired location, rather it ends up being
            // wherever the tab got to in the transition. This can be prevented by disabling pointer events at the start of the transition,
            // and then enabling them at the end
            var releasedTab = d3.select(this);
            releasedTab.datum().restingX = snapToLocation;
            transition_tab(releasedTab)
        }

        function drag_start(d)
        {
            // Clear old selected tab information.
            selectedTab.classed("selected", false);

            // If the tab that is starting to be dragged is currently undergoing a transition, then stop the transition.
            selectedTab = d3.select(this);
            if (currentlyTransitioning.indexOf(d.key) !== -1)
            {
                selectedTab.transition();
                currentlyTransitioning.splice(currentlyTransitioning.indexOf(d.key));
            }

            // Alter tab clip paths to reflect the selection of on of the tabs.
            update_tab_clipping(d);

            // Record new selected tab information.
            selectedTab.classed("selected", true);

            // Record where the drag started and where the tab will snap to.
            startOfDragX = d3.mouse(this)[0];
            snapToLocation = d.restingX;
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

            // Select the tab to the right and the one to the left of the tab being dragged.
            var selectedTabPos = keyToPosition[d.key];  // Position of selected tab in order.
            var leftTabKey = positionToKey[selectedTabPos - 1];
            var leftTab = tabSet.select("#tab-container-" + leftTabKey);
            var rightTabKey = positionToKey[selectedTabPos + 1];
            var rightTab = tabSet.select("#tab-container-" + rightTabKey);

            // Shift the left tab to the right if the tab being dragged has moved to far to its left.
            if (!leftTab.empty())
            {
                // Only bother if there is actually a tab to the left of the one being dragged.
                var leftTabData = leftTab.datum();
                if ((d.transX + curveWidth) <= (leftTabData.restingX + curveWidth + (tabWidth / 2)))
                {
                    // The tab being dragged has moved far enough to the left to be swapped with the tab on its left.
                    // Update position and key mappings.
                    var leftTabPos = keyToPosition[leftTabKey];
                    keyToPosition[d.key] = leftTabPos;
                    keyToPosition[leftTabKey] = selectedTabPos;
                    positionToKey[selectedTabPos] = leftTabKey;
                    positionToKey[leftTabPos] = d.key;

                    // Update physical location of the left tab.
                    snapToLocation = leftTabData.restingX;
                    leftTabData.restingX += (curveWidth + tabWidth);
                    transition_tab(leftTab);
                }
            }

            // Shift the right tab to the left if the tab being dragged has moved to far to its right.
            if (!rightTab.empty())
            {
                // Only bother if there is actually a tab to the left of the one being dragged.
                var rightTabData = rightTab.datum();
                if ((d.transX + curveWidth + tabWidth) >= (rightTabData.restingX + curveWidth + (tabWidth / 2)))
                {
                    // The tab being dragged has moved far enough to the left to be swapped with the tab on its left.
                    // Update position and key mappings.
                    var rightTabPos = keyToPosition[rightTabKey];
                    keyToPosition[d.key] = rightTabPos;
                    keyToPosition[rightTabKey] = selectedTabPos;
                    positionToKey[selectedTabPos] = rightTabKey;
                    positionToKey[rightTabPos] = d.key;

                    // Update physical location of the left tab.
                    snapToLocation = rightTabData.restingX;
                    rightTabData.restingX -= (curveWidth + tabWidth);
                    transition_tab(rightTab);
                }
            }

            // Alter clip paths to reflect tab movement.
            update_tab_clipping(d);
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

    function create_clip_tab_style_1(config, currentTabXPos)
    {
        /*****************************
        * Parse Configuration Inputs *
        *****************************/
        // Determine initial coordinates.
        var tabWidth = typeof config.tabWidth !== "undefined" ? config.tabWidth : 100;
        var tabHeight = typeof config.tabHeight !== "undefined" ? config.tabHeight : 25;
        var curveWidth = typeof config.curveWidth !== "undefined" ? config.curveWidth : 30;
        var heightOffset = typeof config.heightOffset !== "undefined" ? config.heightOffset : 0;
        var leftTabXPos = typeof config.leftTabXPos !== "undefined" ? config.leftTabXPos - currentTabXPos : undefined;
        var rightTabXPos = typeof config.rightTabXPos !== "undefined" ? config.rightTabXPos - currentTabXPos : undefined;
        var heightExtension = typeof config.heightExtension !== "undefined" ? config.heightExtension : 0;
        var containerWidth = typeof config.containerWidth !== "undefined" ? config.containerWidth : 900;

        /***********************
        * Create the tab paths *
        ***********************/
        var clipTabPath = "M" + (-currentTabXPos) + "," + tabHeight;

        // Outline the left clipping tab (if needed).
        if (leftTabXPos !== undefined)
        {
            var leftTabClip =
                "H" + leftTabXPos +
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
        if (rightTabXPos !== undefined)
        {
            var rightTabClip =
                "H" + rightTabXPos +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + -(tabHeight + heightExtension) / 2 +
                "h" + tabWidth +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2 +
                "t" + curveWidth / 2 + "," + (tabHeight + heightExtension) / 2;
            clipTabPath += rightTabClip;
        }

        // Close up the clip outline.
        clipTabPath += ("H" + containerWidth + "v" + -(tabHeight + heightExtension) + "H" + (-currentTabXPos) + "z");

        return clipTabPath;
    }
});
$(document).ready(function()
{
    /******************************
    * Definitions Needed For Tabs *
    ******************************/
    // SVG declarations.
    var svgTagID = "#firefox-tabs";  // The ID of the SVG tag where the tabs will be constructed.
    var svgWidth = 900;  // Width of the SVG element.
    var svgHeight = 35;  // Height of the SVG element.

    // Initial tab information.
    var textForTabs = ["Iron Cook", "Hey, what kinda party is this? There's no booze and only one hooker.", "I just want to talk. It has nothing to do with mating.", "Zinc Saucier", "How come you always dress like you're doing your laundry?", "I have to go and buy a single piece of fruit with a coupon and then return it."];
    var iconsForTabs = ["/static/tabbed_navigation/Icons/Bender.jpg", "/static/tabbed_navigation/Icons/Fry.jpg", "", "/static/tabbed_navigation/Icons/Leela.jpg", "/static/tabbed_navigation/Icons/Zoidberg.jpg", ""];
    var textForNewTabs = "New Tab - ";
    var numberOfTabs = textForTabs.length;  // The number of tabs to create.

    // Tab dimensions.
    var maxTabWidth = 150;  // The maximum width that the tabs can take.
    var minTabWidth = 120;  // The minimum width that a tab can take.
    var tabWidth = maxTabWidth;  // The width of each tab.
    var tabHeight = 31;  // The height of each tab. An odd number helps to get lines to line up on the half pixel (making them more clean and crisp).
    var curveWidth = 20;  // The width of the curved region of the selected tab.
    var tabOverlap = curveWidth;  // The amount by which the tabs should overlap one another.
    var tabBorderWidth = 2;  // The width of the border around the tabs.

    // Tab navigator declarations.
    var tabNavigatorWidth = 30;  // The width of the menu for navigating between tabs.
    var tabNavigatorHeight = tabHeight;  // The height of the menu for navigating between tabs.
    var tabNavigatorLineLength = 15;  // The length of the lines on the menu.

    // Tab content declarations.
    var closeButtonRadius = 6;  // The radius of the circle containing the close button.
    var closeButtonStartX = tabWidth - (2 * tabOverlap) - (2 * closeButtonRadius);  // The offset into the tab content where the close button starts.
    var tabIconSize = 20;  // The width and height of the square holding the icon on the left of the tab.
    var textStartWithIcon = tabIconSize + 2;  // The x position of the start of the text in a tab when there is a icon present.
    var textHeight = 12;  // Pixels for the height of the text.

    // Mappings between tab order and tab unique keys.
    var currentKey = 0;  // Counter to generate unique keys for identifying tabs.
    var keyToPosition = {};  // Mapping from tab keys to the position that the tab is in.
    var positionToKey = {};  // Mapping from positions to the key of the tab in that position.

    // Misc declarations.
    var tabBaseThickness = svgHeight - tabHeight;  // The thickness of the border that the tabs rest on.
    var transitionDuration = 200;  // The duration of all tab transitions.


    /****************************
    * Create The SVG Components *
    ****************************/
    // Create the SVG element.
    var tabSet = d3.select(svgTagID)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Add the tab navigator.
    var tabNavigatorData = [{"x" : (tabNavigatorWidth - tabNavigatorLineLength) / 2, "y" : (tabNavigatorHeight / 2) - 5},
                            {"x" : (tabNavigatorWidth - tabNavigatorLineLength) / 2, "y" : tabNavigatorHeight / 2},
                            {"x" : (tabNavigatorWidth - tabNavigatorLineLength) / 2, "y" : (tabNavigatorHeight / 2) + 5}];
    var tabNavigator = tabSet.append("g")
        .classed("tab-navigator", true)
        .datum({"transX" : 0, "transY" : 0})
        .attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
    tabNavigator.append("rect")
        .attr("width", tabNavigatorWidth)
        .attr("height", tabNavigatorHeight)
    tabNavigator.selectAll("path")
        .data(tabNavigatorData)
        .enter()
        .append("path")
            .attr("d", function(d) { return "M" + d.x + "," + d.y + "h" + tabNavigatorLineLength; });

    // Add the baselines on which the tabs sit.
    tabSet.append("rect")
        .attr("width", svgWidth)
        .attr("height", tabBaseThickness)
        .attr("x", 0)
        .attr("y", svgHeight - tabBaseThickness)
        .classed("baseline", true);

    /**************************
    * Create The Initial Tabs *
    **************************/
    // Generate the data for the tabs.
    var tabData = [];
    var tabPaths = create_tab_paths();
    for (var i = 0; i < numberOfTabs; i++)
    {
        tabData.push(
            {
                // Unique identifier for the tab.
                "key" : currentKey,
                // Paths used to make the tabs.
                "deselected" : tabPaths.deselected, "selected" : tabPaths.selected,
                // Paths used to make the borders of the tabs.
                "deselectedBorder" : tabPaths.deselectedBorder, "selectedBorder" : tabPaths.selectedBorder,
                // The x coordinate where the tab should come to rest once it is released/done transitioning.
                "restingX" : tabNavigatorWidth + (i * tabWidth) - (i * tabOverlap),
                // The current x and y coordinates of the tab.
                "transX" : tabNavigatorWidth + (i * tabWidth) - (i * tabOverlap),
                "transY" : 0,
                // The text in the tab.
                "text" : textForTabs[i],
                // The favicon style image on the left of the tab.
                "image" : iconsForTabs[i]
            });
        keyToPosition[currentKey] = i;
        positionToKey[i] = currentKey;
        currentKey++;
    }

    // Create the tabs.
    var selectedTabKey = 0;
    var selectedTab;
    update_tabs();

    // Add the tab navigator behaviour.
    tabNavigator.on("click", function()
        {
            // Get the current data for the tabs.
            tabData = tabSet.selectAll(".tab-container").data();

            // Create the new tab data.
            tabData.push(
                {
                    // Unique identifier for the tab.
                    "key" : currentKey,
                    // Paths used to make the tabs.
                    "deselected" : tabPaths.deselected, "selected" : tabPaths.selected,
                    // Paths used to make the borders of the tabs.
                    "deselectedBorder" : tabPaths.deselectedBorder, "selectedBorder" : tabPaths.selectedBorder,
                    // The x coordinate where the tab should come to rest once it is released/done transitioning.
                    "restingX" : tabNavigatorWidth + (numberOfTabs * tabWidth) - (numberOfTabs * tabOverlap),
                    // The current x and y coordinates of the tab.
                    "transX" : tabNavigatorWidth + (numberOfTabs * tabWidth) - (numberOfTabs * tabOverlap),
                    "transY" : 0,
                    // The text in the tab.
                    "text" : textForNewTabs + currentKey,
                    // The favicon style image on the left of the tab.
                    "image" : ""
                });
            keyToPosition[currentKey] = numberOfTabs;
            positionToKey[numberOfTabs] = currentKey;
            currentKey++;

            // Update all the tab data and add the new tab.
            numberOfTabs++;
            update_tab_data();
            selectedTabKey = (numberOfTabs === 1) ? currentKey - 1 : selectedTab.datum().key;
            update_tabs();
        });

    /***************************************************
    * Create/Update The SVG Elements For A Set Of Tabs *
    ***************************************************/
    function update_tabs()
    {
        // Update and adds tabs. This is done in two steps. The first step is to append and size all elements needed to create a tab.
        // This first step will only affect the .enter() portion of the selection (i.e. newly added tabs).
        // The second step is to update the position and appearance (i.e. paths) of all tabs. This will be done on the .update() portion of
        // the selection following the appends to the .enter() portion. Doing operations in this order causes the .update() portion to contain
        // all elements that would be in the .enter() selection (i.e. the .update() portion becomes in effect the .enter() + .update()).

        // Select tab containers and bind data.
        var tabSelection = tabSet.selectAll(".tab-container")
            .data(tabData, function(d) { return d.key; });

        // Add the new tabs.
        create_tabs(tabSelection);

        /***********************************************
        * Update Positioning Of All Tabs (New And Old) *
        ***********************************************/
        // Update all tabs (new and old).
        // Update tab and tab paths and positions.
        tabSelection.attr("transform", function(d) { return "translate(" + d.restingX + "," + d.transY + ")"; });
        tabSelection.selectAll(".tab").attr("d", function(d) { return (d.key === selectedTabKey) ? d.selected : d.deselected; });
        // Update tab borders.
        tabSelection.selectAll(".tab-border")
            .attr("d", function(d) { return (d.key === selectedTabKey) ? d.selectedBorder : d.deselectedBorder; });
        tabSelection.selectAll(".clip-border").selectAll("path").attr("d", function(d) { return (d.key === selectedTabKey) ? d.selected : d.deselected; });
        // Update tab clipping.
        update_tab_clipping(selectedTab.datum());
        // Update tab content.
        var tabContentContainers = tabSelection.selectAll(".tab-content")
            .attr("transform", function(d) { return "translate(" + tabOverlap + ",0)"; })
        // Update text clipping and fading.
        tabContentContainers.selectAll(".text-clip-rect")
            .attr("width", closeButtonStartX);
        tabContentContainers.each(function(d)
            {
                var currentTabContentContainer = d3.select(this);
                var currentTabText = currentTabContentContainer.select(".tab-text");
                var currentTextBBox = currentTabText.node().getBBox()
                var currentTextWidth = currentTextBBox.width;
                var maxTextWidth = (d.image === "") ? closeButtonStartX : closeButtonStartX - textStartWithIcon;

                if (currentTextWidth > maxTextWidth)
                {
                    // If the text is wider than the tab, then create the gradient for the fade.
                    var fadeStart = (maxTextWidth * 0.7) / currentTextWidth;
                    var fadeEnd = (maxTextWidth * 1.0) / currentTextWidth;
                    currentTabContentContainer.select(".grad-start")
                        .attr("offset", fadeStart);
                    currentTabContentContainer.select(".grad-end")
                        .attr("offset", fadeEnd);
                }
                else
                {
                    // If the text is not wider than the tab, then "hide" the gradient.
                    var fadeStart = (maxTextWidth * 1.0) / currentTextWidth;
                    var fadeEnd = (maxTextWidth * 1.0) / currentTextWidth;
                    currentTabContentContainer.select(".grad-start")
                        .attr("offset", fadeStart);
                    currentTabContentContainer.select(".grad-end")
                        .attr("offset", fadeEnd);
                }
            });
        // Update close button position.
        tabContentContainers.selectAll(".close-button")
            .attr("transform", function() { return "translate(" + closeButtonStartX + ",0)"; });

        // Transition all tabs to their resting positions.
        tabSelection.each(function() { transition_tab(d3.select(this)); });
    }

    function create_tabs(tabSelection)
    {
        // Create the new tabs.
        var tabContainers = tabSelection
            .enter()
            .append("g")
            .attr("id", function(d) { return "tab-container-firefox-" + d.key; })
            .classed("tab-container", true);
        tabContainers  // Add the tab paths.
            .append("path")
            .classed("tab", true);
        var tabBorders = tabContainers  // Add the tab border paths.
            .append("path")
            .classed("tab-border", true)
            .style("stroke-width", tabBorderWidth);

        // Select the desired tab.
        selectedTab = tabSet.select("#tab-container-firefox-" + selectedTabKey);
        selectedTab.classed("selected", true);

        // Create the clip paths for the tab borders (to stop them going outside the tabs at all).
        var borderClipPaths = tabContainers.append("clipPath")
            .classed("clip-border", true)
            .attr("id", function(d) { return "clip-firefox-border-" + d.key; });
        borderClipPaths.append("path");
        tabBorders.attr("clip-path", function(d) { return "url(#clip-firefox-border-" + d.key + ")"; });

        // Create the clip paths for the new tabs.
        var clips = tabContainers.append("clipPath")
            .attr("id", function(d) { return "clip-firefox-" + d.key; });
        var clipTabs = clips.append("path")
            .classed("clip-tab", true)
            .attr("d", "");
        tabContainers.attr("clip-path", function(d) { return "url(#clip-firefox-" + d.key + ")"; });

        // Setup the drag behaviour of the tabs. Have to set the origin properly, so that the x and y positions of the drag event are placed correctly
        // within the whole SVG element, rather than just in relation to the transformed coordinates of the <g> containing the tab.
        var tabDrag = d3.behavior.drag()
            .origin(function(d) { var mousePos = d3.mouse(this); return {"x" : d.transX + mousePos[0], "y" : d.transY + mousePos[1]}; })
            .on("dragstart", drag_start)
            .on("drag", drag_update)
            .on("dragend", drag_end);
        tabContainers.call(tabDrag);

        // Add the containers for the tab content.
        var tabContentContainers = tabContainers
            .append("g")
            .classed("tab-content", true);

        // Add the favicon type icon to each tab that is meant to have one.
        var tabIcons = tabContentContainers.filter(function(d) { return d.image !== ""; }).append("g")  // Filter out tabs without an icon (where image is "").
            .attr("transform", function() { return "translate(0,0)"; })
            .classed("tab-icon", true);
        var patterns = tabIcons.append("pattern")
            .attr("id", function(d) { return "icon-image-firefox-" + d.key; })
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
            .attr("y", ((tabHeight - tabIconSize - (tabBorderWidth / 2)) / 2) + (tabBorderWidth / 2))
            .attr("width", tabIconSize)
            .attr("height", tabIconSize)
            .style("fill", function(d) { return "url(#icon-image-firefox-" + d.key + ")"});

        // Add the text to the tabs.
        tabContentContainers.append("clipPath")
            .attr("id", function(d) { return "clip-text-firefox-" + d.key; })
            .append("rect")
                .classed("text-clip-rect", true)
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", tabHeight);
        var tabTextElements = tabContentContainers
            .append("text")
            .classed("tab-text", true)
            .attr("x", function(d) { return (d.image === "") ? 0 : textStartWithIcon; })
            .attr("y", ((tabHeight - (tabBorderWidth / 2)) / 2) + (tabBorderWidth / 2))
            .attr("clip-path", function(d) { return "url(#clip-text-firefox-" + d.key + ")"; })
            .style("font-size", textHeight)
            .text(function(d) { return d.text; });

        // Fade out text that is too long.
        tabContentContainers.each(function(d)
            {
                var currentTabContentContainer = d3.select(this);
                var currentTabText = currentTabContentContainer.select(".tab-text");
                var currentTextBBox = currentTabText.node().getBBox()
                var currentTextWidth = currentTextBBox.width;
                var maxTextWidth = (d.image === "") ? closeButtonStartX : closeButtonStartX - textStartWithIcon;

                if (currentTextWidth > maxTextWidth)
                {
                    // If the text is wider than the tab, then create the gradient for the fade.
                    var fadeStart = (maxTextWidth * 0.7) / currentTextWidth;
                    var fadeEnd = (maxTextWidth * 1.0) / currentTextWidth;
                    var gradient = currentTabContentContainer.append("linearGradient")
                        .attr("id", "fadeGradient-firefox-" + d.key)
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
                    currentTabText.style("fill", "url(#fadeGradient-firefox-" + d.key + ")");
                }
            });

        // Add the close button to each tab. In order to prevent clicking and dragging on the close button moving the tab, a drag handler that
        // prevents event propagation is needed, in order to prevent the drag on the tab container being fired by a mousedown on the close button.
        var closeButtons = tabContentContainers.append("g")
            .classed("close-button", true);
        var closeDrag = d3.behavior.drag()
            .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });
        closeButtons.call(closeDrag);
        closeButtons.append("circle")
            .attr("cx", closeButtonRadius)
            .attr("cy", ((tabHeight - (tabBorderWidth / 2)) / 2) + (tabBorderWidth / 2))
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

    // Setup the behaviour of the close tab button.
    closeButtons
        .on("click", function(d)
            {
                // Select the tab that is to be closed.
                var tabToClose = tabSet.select("#tab-container-firefox-" + d.key);
                var dataOfClickedTab = tabToClose.datum();

                // Determine which tab's data to remove.
                var entryToRemove = 0;
                for (var j = 0; j < numberOfTabs; j++)
                {
                    entryToRemove = (tabData[j].key === dataOfClickedTab.key) ? j : entryToRemove;
                }

                // If the tab to be closed is the selected one, then make the tab to its left the selected one.
                if (dataOfClickedTab.key === selectedTab.datum().key && numberOfTabs > 1)
                {
                    // Get position of selected tab (the one being closed).
                    var selectedPos = keyToPosition[selectedTab.datum().key];
                    var newSelectedPos = (selectedPos === 0) ? 1 : selectedPos - 1;
                    var keyOfNewSelected = positionToKey[newSelectedPos];
                    selectedTab.classed("selected", false);
                    selectedTabKey = keyOfNewSelected;
                    selectedTab = tabSet.select("#tab-container-firefox-" + keyOfNewSelected);
                    update_tab_clipping(selectedTab.datum());
                    selectedTab.classed("selected", true);
                }

                // Update all mappings from position to key and from key to position.
                var posOfClickedTab = keyToPosition[dataOfClickedTab.key];
                for (var j = 0; j < numberOfTabs; j++)
                {
                    if (posOfClickedTab < j)
                    {
                        // If the clicked tab is in a position to the left of the one currently being checked.
                        var currentTabKey = positionToKey[j];
                        positionToKey[j - 1] = positionToKey[j];
                        keyToPosition[currentTabKey] = j - 1;
                    }
                }
                delete positionToKey[numberOfTabs - 1];
                delete keyToPosition[dataOfClickedTab.key];

                // Remove the tab that had its close button clicked.
                tabToClose.node().remove();
                numberOfTabs--;

                // Update the locations of the tabs and their dimensions.
                tabData.splice(entryToRemove, 1);
                update_tab_data();
                if (numberOfTabs > 0) update_tabs();
            });
    }

    /************************************************
    * Update Data Used To Position And Display Tabs *
    ************************************************/
    function update_tab_data()
    {
        // Determine desired size of tabs.
        var idealTabWidth = (svgWidth - tabNavigatorWidth + ((numberOfTabs - 1) * tabOverlap)) / numberOfTabs;
        if (idealTabWidth < minTabWidth)
        {
            console.log("Need scroll bar for tabs.");
            tabWidth = Math.max(minTabWidth, Math.min(maxTabWidth, idealTabWidth));
        }
        else
        {
            tabWidth = Math.max(minTabWidth, Math.min(maxTabWidth, idealTabWidth));
        }

        // Update the position where the close tab button goes.
        closeButtonStartX = tabWidth - (2 * tabOverlap) - (2 * closeButtonRadius);

        // Create new paths.
        tabPaths = create_tab_paths();

        // Update data with new tab paths and resting position.
        for (var i = 0; i < numberOfTabs; i++)
        {
            var tabIPosition = keyToPosition[tabData[i].key]
            tabData[i].deselected = tabPaths.deselected;
            tabData[i].selected = tabPaths.selected;
            tabData[i].deselectedBorder = tabPaths.deselectedBorder;
            tabData[i].selectedBorder = tabPaths.selectedBorder;
            tabData[i].restingX = tabNavigatorWidth + (tabIPosition * tabWidth) - (tabIPosition * tabOverlap);
            //tabData[i].transX = tabNavigatorWidth + (tabIPosition * tabWidth) - (tabIPosition * tabOverlap);
        }
    }

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
                var config = {};
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
                    config.leftTabXPos = tabSet.select("#tab-container-firefox-" + positionToKey[currentTabPos - 1]).datum().transX;
                }
                else if (currentTabPos === selectedTabPos - 1)
                {
                    // The tab currently being looked at is not the leftmost, rightmost or clicked on tab and is one position to the left of the
                    // tab clicked on. In this case the current tab should have both its left and right portions clipped.
                    config.leftTabXPos = tabSet.select("#tab-container-firefox-" + positionToKey[currentTabPos - 1]).datum().transX;
                    config.rightTabXPos = selectedTabData.transX;
                }
                else if (numberOfTabs > 1)
                {
                    // All other tabs should just have their left portion clipped, unless there is only one tab. If there is a single tab, then
                    // it needs no clipping.
                    config.leftTabXPos = tabSet.select("#tab-container-firefox-" + positionToKey[currentTabPos - 1]).datum().transX;
                }
                return create_clip_tab_path(clipD.transX, config);
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
        selectedTabKey = d.key;
        if (currentlyTransitioning.indexOf(d.key) !== -1)
        {
            selectedTab.transition();
            currentlyTransitioning.splice(currentlyTransitioning.indexOf(d.key));
        }

        // Alter tab clip paths to reflect the selection of one of the tabs.
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
                    d.transX = Math.max(tabNavigatorWidth, Math.min(svgWidth - (curveWidth * 2) - tabWidth, d3.event.x - startOfDragX));
                    return "translate(" + d.transX + "," + d.transY + ")";
                });

        // Select the tab to the right and the one to the left of the tab being dragged.
        var selectedTabPos = keyToPosition[d.key];  // Position of selected tab in order.
        var leftTabKey = positionToKey[selectedTabPos - 1];
        var leftTab = tabSet.select("#tab-container-firefox-" + leftTabKey);
        var rightTabKey = positionToKey[selectedTabPos + 1];
        var rightTab = tabSet.select("#tab-container-firefox-" + rightTabKey);

        // Shift the left tab to the right if the tab being dragged has moved to far to its left.
        if (!leftTab.empty())
        {
            // Only bother if there is actually a tab to the left of the one being dragged.
            var leftTabData = leftTab.datum();
            if ((d.transX) <= (leftTabData.restingX + (tabWidth / 4)))
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
                leftTabData.restingX += (tabWidth - tabOverlap);
                transition_tab(leftTab);
            }
        }

        // Shift the right tab to the left if the tab being dragged has moved to far to its right.
        if (!rightTab.empty())
        {
            // Only bother if there is actually a tab to the left of the one being dragged.
            var rightTabData = rightTab.datum();
            if ((d.transX + tabWidth) >= (rightTabData.restingX + (tabWidth * 3 / 4)))
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
                rightTabData.restingX -= (tabWidth - tabOverlap);
                transition_tab(rightTab);
            }
        }

        // Alter clip paths to reflect tab movement.
        update_tab_clipping(d);
    }

    /*************************
    * Tab Creation Functions *
    *************************/
    function create_tab_paths()
    {
        // Create the paths for selected and deselected tabs.
        var borderHeight = tabHeight - (tabBorderWidth / 2);  // Only subtract half as there is only a border on the top.
        var borderWidth = tabWidth - tabBorderWidth;

        var tabPath =
            "M0," + tabHeight +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
            "t" + curveWidth / 2 + "," + -tabHeight / 2 +
            "h" + (tabWidth - curveWidth - curveWidth) +
            "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
            "t" + curveWidth / 2 + "," + tabHeight / 2;

        return {"deselected" : tabPath, "deselectedBorder" : tabPath, "selected" : tabPath, "selectedBorder" : tabPath};
    }

    function create_clip_tab_path(currentTabXPos, config)
    {
        // Create the clips path for a given tab.

        // Determine where the left and right neighbour tabs are in relation to the entire SVG element.
        var leftTabXPos = typeof config.leftTabXPos !== "undefined" ? config.leftTabXPos - currentTabXPos : undefined;
        var rightTabXPos = typeof config.rightTabXPos !== "undefined" ? config.rightTabXPos - currentTabXPos : undefined;

        var clipTabPath = "M" + (-currentTabXPos) + "," + tabHeight;

        // Outline the left clipping tab (if needed).
        if (leftTabXPos !== undefined)
        {
            var leftTabClip =
                "H" + leftTabXPos +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
                "t" + curveWidth / 2 + "," + -tabHeight / 2 +
                "h" + (tabWidth - curveWidth - curveWidth) +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
                "t" + curveWidth / 2 + "," + tabHeight / 2;
            clipTabPath += leftTabClip;
        }
        else
        {
            clipTabPath += ("H" + curveWidth);
        }

        // Outline the right clip tab if needed.
        if (rightTabXPos !== undefined)
        {
            var rightTabClip =
                "H" + rightTabXPos +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + -tabHeight / 2 +
                "t" + curveWidth / 2 + "," + -tabHeight / 2 +
                "h" + (tabWidth - curveWidth - curveWidth) +
                "q" + curveWidth / 4 + "," + 0 + "," + curveWidth / 2 + "," + tabHeight / 2 +
                "t" + curveWidth / 2 + "," + tabHeight / 2;
            clipTabPath += rightTabClip;
        }

        // Close up the clip outline.
        clipTabPath += ("H" + svgWidth + "v" + -tabHeight + "H" + (-currentTabXPos) + "z");

        return clipTabPath;
    }
});
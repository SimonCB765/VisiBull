$(document).ready(function()
{
	// Create the tabs.
	var tabText = ["A", "AB", "ABC", "ABCD", "ABCDE", "ABCDEF", "ABCDEFG", "ABCDEFGH", "ABCDEFGHI", "ABCDEFGHIJ", "ABCDEFGHIJK"]
	create_empty_tabs("#tab-set-1")
	create_twirling_tabs("#tab-set-2");
	
	create_growing_tabs("#tab-set-3");
	
	function create_empty_tabs(tabSetID)
	{
		// Definitions needed.
		var svgWidth = 900;  // Width of the SVG element.
		var svgHeight = 150;  // Height of the SVG element.
		var tabWidth = 50;  // The width of each tab.
		var tabHeight = 25;  // The height of each tab.
		var backingBorderHeight = 2;  // The thickness of the border that the tabs rest on.
		var numberOfTabs = 5;  // The number of tabs to create.
		var curveWidth = 30;  // The width of the curved region of the tabs.
		var rotation = 0;  // The rotation of the sets of tabs.
		
		// Create the SVG element.
		var tabSet = d3.select(tabSetID)
			.attr("width", svgWidth)
			.attr("height", svgHeight);
		
		/******************
		* Top Row Of Tabs *
		******************/
		{
			// Create the tabs.
			var topTabBaselineY = 50 - backingBorderHeight;  // The Y coordinate of the horizontal baseline.
			var topTabStartX = 0;  // The X coordinate where the tabs start.
			var topTabConfig = {"x" : topTabStartX, "y" : topTabBaselineY, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
								"rotation" : rotation, "alignment" : "left"};
			var topTabInfo = create_tabs_style_1(numberOfTabs, topTabConfig);
			var topTabContainer = tabSet.selectAll(".new-tabs")
				.data(topTabInfo.data)
				.enter()
				.append("g")
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			var topTabs = topTabContainer
				.append("path")
				.attr("d", function(d, i) { return (i === 0) ? topTabInfo.path : topTabInfo.pathMissingLeft; })
				.classed("tab", true);
		
			// Setup the behaviour of the tabs.
			topTabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
			topTabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
			var selectedTopTab = tabSet.select(".tab-container").select(".tab");
			selectedTopTab.classed("selected", true);
			topTabContainer.on("mousedown", function(d, i)
				{
					if (d3.event.button == 0)
					{
						// Left click.
						// Clear old selected tab information.
						selectedTopTab.classed("selected", false);
						
						// Make the appearance of the tabs fit with the choice of tab that should be on top (i.e. the one clicked).
						topTabs
							.attr("d", function(tabD, tabI)
								{
									var desiredTabPath;
									if (tabI === i)
									{
										desiredTabPath = topTabInfo.path;
									}
									else if (tabI === 0)
									{
										// The 0th index tab is a bit special, as it can only be full or missing its right portion.
										// If this branch is reached, then it was not the 0th index tab that was clicked on.
										if (i === 1)
										{
											// The 1st index tab was clicked on.
											desiredTabPath = topTabInfo.pathMissingRight;
										}
										else
										{
											desiredTabPath = topTabInfo.path;
										}
									}
									else if (tabI === i - 1)
									{
										desiredTabPath = topTabInfo.pathMissingBoth;
									}
									else
									{
										desiredTabPath = topTabInfo.pathMissingLeft;
									}
									return desiredTabPath;
								});
						
						// Record new selected tab information.
						selectedTopTab = d3.select(this).select(".tab");
						selectedTopTab.classed("selected", true);
					}
				});
		}
		
		/*********************
		* Middle Row Of Tabs *
		*********************/
		{
			// Create the tabs.
			var middleTabBaselineY = 100 - backingBorderHeight;  // The Y coordinate of the horizontal baseline.
			var middleTabStartX = svgWidth / 2;  // The X coordinate where the tabs start.
			var middleTabConfig = {"x" : middleTabStartX, "y" : middleTabBaselineY, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
								   "rotation" : rotation, "alignment" : "center"};
			var middleTabInfo = create_tabs_style_1(numberOfTabs, middleTabConfig);
			var middleTabContainer = tabSet.selectAll(".new-tabs")
				.data(middleTabInfo.data)
				.enter()
				.append("g")
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			var middleTabs = middleTabContainer
				.append("path")
				.attr("d", function(d, i) { return (i === 0) ? middleTabInfo.path : middleTabInfo.pathMissingLeft; })
				.classed("tab", true);
		
			// Setup the behaviour of the tabs.
			middleTabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
			middleTabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
			var selectedMiddleTab = d3.select(middleTabContainer[0][0]).select(".tab");
			selectedMiddleTab.classed("selected", true);
			middleTabContainer.on("mousedown", function(d, i)
				{
					if (d3.event.button == 0)
					{
						// Left click.
						// Clear old selected tab information.
						selectedMiddleTab.classed("selected", false);
						
						// Make the appearance of the tabs fit with the choice of tab that should be on top (i.e. the one clicked).
						middleTabs
							.attr("d", function(tabD, tabI)
								{
									var desiredTabPath;
									if (tabI === i)
									{
										desiredTabPath = middleTabInfo.path;
									}
									else if (tabI === 0)
									{
										// The 0th index tab is a bit special, as it can only be full or missing its right portion.
										// If this branch is reached, then it was not the 0th index tab that was clicked on.
										if (i === 1)
										{
											// The 1st index tab was clicked on.
											desiredTabPath = middleTabInfo.pathMissingRight;
										}
										else
										{
											desiredTabPath = middleTabInfo.path;
										}
									}
									else if (tabI === i - 1)
									{
										desiredTabPath = middleTabInfo.pathMissingBoth;
									}
									else
									{
										desiredTabPath = middleTabInfo.pathMissingLeft;
									}
									return desiredTabPath;
								});
						
						// Record new selected tab information.
						selectedMiddleTab = d3.select(this).select(".tab");
						selectedMiddleTab.classed("selected", true);
					}
				});
		}
		
		/*********************
		* Bottom Row Of Tabs *
		*********************/
		{
			// Create the tabs.
			var bottomTabBaselineY = 150 - backingBorderHeight;  // The Y coordinate of the horizontal baseline.
			var bottomTabStartX = svgWidth;  // The X coordinate where the tabs start.
			var bottomTabConfig = {"x" : bottomTabStartX, "y" : bottomTabBaselineY, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
								   "rotation" : rotation, "alignment" : "right"};
			var bottomTabInfo = create_tabs_style_1(numberOfTabs, bottomTabConfig);
			var bottomTabContainer = tabSet.selectAll(".new-tabs")
				.data(bottomTabInfo.data)
				.enter()
				.append("g")
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			var bottomTabs = bottomTabContainer
				.append("path")
				.attr("d", function(d, i) { return (i === numberOfTabs - 1) ? bottomTabInfo.path : bottomTabInfo.pathMissingRight; })
				.classed("tab", true);
		
			// Setup the behaviour of the tabs.
			bottomTabContainer.on("mouseover", function() { d3.select(this).classed("hover", true); });
			bottomTabContainer.on("mouseout", function() { d3.select(this).classed("hover", false); });
			var selectedbottomTab = d3.select(bottomTabContainer[0][numberOfTabs - 1]).select(".tab");
			selectedbottomTab.classed("selected", true);
			bottomTabContainer.on("mousedown", function(d, i)
				{
					if (d3.event.button == 0)
					{
						// Left click.
						// Clear old selected tab information.
						selectedbottomTab.classed("selected", false);
						
						// Make the appearance of the tabs fit with the choice of tab that should be on top (i.e. the one clicked).
						bottomTabs
							.attr("d", function(tabD, tabI)
								{
									var desiredTabPath;
									if (tabI === i)
									{
										desiredTabPath = bottomTabInfo.path;
									}
									else if (tabI === numberOfTabs - 1)
									{
										// The rightmost tab is a bit special, as it can only be full or missing its left portion.
										// If this branch is reached, then it was not the rightmost tab that was clicked on.
										if (i === numberOfTabs - 2)
										{
											// The tab second from right was clicked on.
											desiredTabPath = bottomTabInfo.pathMissingLeft;
										}
										else
										{
											desiredTabPath = bottomTabInfo.path;
										}
									}
									else if (tabI === i + 1)
									{
										desiredTabPath = bottomTabInfo.pathMissingBoth;
									}
									else
									{
										desiredTabPath = bottomTabInfo.pathMissingRight;
									}
									return desiredTabPath;
								});
						
						// Record new selected tab information.
						selectedbottomTab = d3.select(this).select(".tab");
						selectedbottomTab.classed("selected", true);
					}
				});
		}
		
		// Add the baselines on which the tabs will sit.
		for (var i = 1; i < 4; i++)
		{
			var baselineYCoord = (50 * i) - backingBorderHeight;
			tabSet.append("rect")
				.attr("width", svgWidth)
				.attr("height", backingBorderHeight)
				.attr("x", 0)
				.attr("y", baselineYCoord)
				.classed("backing", true);
		}
	}
	
	function create_twirling_tabs(tabSetID)
	{
		// Definitions needed.
		var svgWidth = 900;  // Width of the SVG element.
		var svgHeight = 300;  // Height of the SVG element.
		var tabWidth = 40;  // The width of each tab.
		var tabHeight = 25;  // The height of each tab.
		var backingBorderHeight = 2;  // The thickness of the border that the tabs rest on.
		var numberOfTabs = 2;  // The number of tabs to create.
		var curveWidth = 20;  // The width of the curved region of the tabs.
		var currentRotation = 0;  // The current rotation of the sets of tabs.

		// Create the SVG element.
		var tabSet = d3.select(tabSetID)  // The SVG element.
			.attr("width", svgWidth)
			.attr("height", svgHeight);
		
		// Add the baselines on which the tabs will sit.
		var baselineYCoord = 150;
		tabSet.append("rect")
			.attr("width", svgWidth - 400)
			.attr("height", backingBorderHeight)
			.attr("x", 200)
			.attr("y", baselineYCoord)
			.classed("backing", true);
		
		// Create the left aligned tabs.
		var leftTabStartX = 200;  // The X coordinate where the tabs start.
		var leftTabConfig = {"x" : leftTabStartX, "y" : baselineYCoord, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
							"tabMargin" : tabMargin, "rotation" : currentRotation, "alignment" : "left"};
		var leftTabInfo = create_tabs_style_1(numberOfTabs, leftTabConfig);
		var leftTabContainer = tabSet.selectAll(".new-tabs")
			.data(leftTabInfo.data)
			.enter()
			.append("g")
			.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
			.classed("tab-container", true);
		var leftTabs = leftTabContainer
			.append("path")
			.attr("d", function(d, i) { return (i === 0) ? leftTabInfo.path : leftTabInfo.pathMissingLeft; })
			.classed("tab", true);

		// Create the center aligned tabs.
		var centerTabStartX = 450;  // The X coordinate where the tabs start.
		var centerTabConfig = {"x" : centerTabStartX, "y" : baselineYCoord, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
							   "tabMargin" : tabMargin, "rotation" : currentRotation, "alignment" : "center"};
		var centerTabInfo = create_tabs_style_1(numberOfTabs, centerTabConfig);
		var centerTabContainer = tabSet.selectAll(".new-tabs")
			.data(centerTabInfo.data)
			.enter()
			.append("g")
			.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
			.classed("tab-container", true);
		var centerTabs = centerTabContainer
			.append("path")
			.attr("d", function(d, i) { return (i === 0) ? centerTabInfo.path : centerTabInfo.pathMissingLeft; })
			.classed("tab", true);

		// Create the right aligned tabs.
		var rightTabStartX = 700;  // The X coordinate where the tabs start.
		var rightTabConfig = {"x" : rightTabStartX, "y" : baselineYCoord, "width" : tabWidth, "height" : tabHeight, "curveWidth" : curveWidth,
							   "tabMargin" : tabMargin, "rotation" : currentRotation, "alignment" : "right"};
		var rightTabInfo = create_tabs_style_1(numberOfTabs, rightTabConfig);
		var rightTabContainer = tabSet.selectAll(".new-tabs")
			.data(rightTabInfo.data)
			.enter()
			.append("g")
			.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
			.classed("tab-container", true);
		var rightTabs = rightTabContainer
			.append("path")
			.attr("d", function(d, i) { return (i === numberOfTabs - 1) ? rightTabInfo.path : rightTabInfo.pathMissingRight; })
			.classed("tab", true);
		
		// Add the rotating animation.
		d3.timer(rotate_tabs);
		function rotate_tabs()
		{
			// Update rotation.
			currentRotation += 0.0025;
			if (currentRotation === 1) { currentRotation *= -1; }
			else if (currentRotation > 1) { currentRotation = -1; }
			leftTabConfig.rotation = currentRotation;
			centerTabConfig.rotation = currentRotation;
			rightTabConfig.rotation = currentRotation;
			
			// Rotate top tabs.
			leftTabInfo = create_tabs_style_1(numberOfTabs, leftTabConfig);
			leftTabContainer
				.data(leftTabInfo.data)
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
			leftTabs
				.attr("d", function(d, i) { return (i === 0) ? leftTabInfo.path : leftTabInfo.pathMissingLeft; });
			
			// Rotate middle tabs.
			centerTabInfo = create_tabs_style_1(numberOfTabs, centerTabConfig);
			centerTabContainer
				.data(centerTabInfo.data)
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
			centerTabs
				.attr("d", function(d, i) { return (i === 0) ? centerTabInfo.path : centerTabInfo.pathMissingLeft; });
			
			// Rotate bottom tabs.
			rightTabInfo = create_tabs_style_1(numberOfTabs, rightTabConfig);
			rightTabContainer
				.data(rightTabInfo.data)
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; });
			rightTabs
				.attr("d", function(d, i) { return (i === numberOfTabs - 1) ? rightTabInfo.path : rightTabInfo.pathMissingRight; });
		}
	}
	
	function create_growing_tabs(tabSetID)
	{
		// Definitions.
		var svgWidth = 900;  // Width of the SVG element containing the tabs.
		var svgHeight = 50;  // Height of the SVG element containing the tabs.
		var numberOfTabs = 3;  // The number of tabs to have in each set of tabs.
		var minTabWidth = 40;  // The minimum width of each tab.
		var tabHeight = 35;  // The height of each tab.
		var tabPadding = 2;  // Padding around the tab text content.
		var tabMargin = 5;  // The margin between adjacent tabs.
		var backingBorderHeight = 2;  // The thickness of the border that the tabs rest on.
		var backingBorderOffset = 5;  // Pixels by which the backing border is raise from the bottom of the SVG element.
		var tabData = [];  // The data for creating the tabs
		
		// Select the SVG element.
		var tabSet = d3.select(tabSetID)
			.attr("width", svgWidth)
			.attr("height", svgHeight);
	
		// Create the tabs.
		var currentTabX = 0;  // X coordinate of the tab currently being created.
		var tabTop = svgHeight - backingBorderHeight - tabHeight - backingBorderOffset;  // The Y coordinate of the top of the tabs.
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];

			// Create the container for the current tab.
			var tabContainer = tabSet.append("g")
				.datum({"transX" : currentTabX + tabMargin, "transY" : tabTop, "x" : 0, "y" : tabHeight, "width" : minTabWidth, "height" : tabHeight, "direction" : "up"})
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			
			// Create the current tab.
			var currentTabPath;
			var currentTab = tabContainer.append("path")
				.attr("d", function(d) { currentTabPath = top_rounded_rect_tab(d); return currentTabPath;})
				.classed("tab", true);
			
			// Create the text containing g element.
			var tabContentContainer = tabContainer.append("g")
				.classed("tab-content", true)
				.attr("transform", function(d) { return "translate(0," + (d.height / 4) + ")"; });

			// Create the text for the current tab.
			var currentTabTextEle = tabContentContainer.append("text")
				.attr("x", 0)
				.attr("y", function(d) { return (d.height - (d.height / 4)) / 2; })  // d.height / 4 is the default value for the y radius used to round the tab borders, and is therefore added to the tab height in order to get the middle of the straight edge of the tab.
				.text(currentTabText);

			// Resize the tabs as needed.
			var currentTabBBox = currentTabTextEle.node().getBBox()
			var currentTabWidth = currentTabBBox.width;
			if (minTabWidth >= currentTabWidth + tabPadding)
			{
				// Minimum width is greater than or equal to the padded text size, so use the minimum tab size.
				currentTabWidth = minTabWidth;
			}
			else
			{
				// Tab width is not greater than max.
				currentTabWidth += (2 * tabPadding);
			}
			currentTab.attr("d", function(d) { d.width = currentTabWidth; currentTabPath = top_rounded_rect_tab(d); return currentTabPath; });
			currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });

			// Update the end position of the last tab.
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		
		// Add a border that the tabs will rest on.
		tabSet.append("rect")
			.attr("width", svgWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", svgHeight - backingBorderHeight - backingBorderOffset)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var tabs = tabSet.selectAll(".tab-container");
		tabs.on("mouseover", function() { d3.select(this).classed("hover", true); });
		tabs.on("mouseout", function() { d3.select(this).classed("hover", false); });
		var selectedTabSet = tabSet.select(".tab-container").select(".tab");
		selectedTabSet
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					
					// Clear old selected tab information.
					selectedTabSet
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d); });
					
					// Record new selected tab information.
					selectedTabSet = d3.select(this).select(".tab");
					selectedTabSet
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
				}
			});
	}
	
	
	/*******************
	* Create Tab Set 4 *
	*******************/
	{
		// Definitions.
		var svgWidth = 900;
		var svgHeight = 50;
		var minTabWidth = 40;
		var maxTabWidth = 90;
		var tabHeight = 35;
		var tabPadding = 2;  // Padding around the tab text content.
		var tabMargin = 5;
		var backingBorderHeight = 2;
		var backingBorderOffset = 5;  // Pixels by which the backing border is raise from the bottom of the SVG element.
		
		var tabSet6 = d3.select("#tab-set-4")  // The SVG element.
			.attr("width", svgWidth)
			.attr("height", svgHeight);
		
		// Create the <defs> to hold the clip paths.
		var defs = tabSet6.append("defs");
		
		// Create the tabs.
		var currentTabX = 0;
		var tabY = svgHeight - backingBorderHeight - tabHeight - backingBorderOffset;
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];

			// Create the container for the current tab.
			var tabContainer = tabSet6.append("g")
				.datum({"transX" : currentTabX + tabMargin, "transY" : tabY, "x" : 0, "y" : tabHeight, "width" : minTabWidth, "height" : tabHeight, "direction" : "up"})
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			
			// Create the current tab.
			var currentTabPath;
			var currentTab = tabContainer.append("path")
				.attr("d", function(d) { currentTabPath = top_rounded_rect_tab(d); return currentTabPath;})
				.classed("tab", true);
			
			// Create the text containing g element.
			var tabContentContainer = tabContainer.append("g")
				.classed("tab-content", true)
				.attr("transform", function(d) { return "translate(0," + (d.height / 4) + ")"; });

			// Create the text for the current tab.
			var currentTabTextEle = tabContentContainer.append("text")
				.attr("x", 0)
				.attr("y", function(d) { return (d.height - (d.height / 4)) / 2; })  // d.height / 4 is the default value for the y radius used to round the tab borders, and is therefore added to the tab height in order to get the middle of the straight edge of the tab.
				.text(currentTabText);

			// Setup the clip path.
			var currentClipPath = defs.append("clipPath")
				.attr("id", "clip" + i)
				.append("rect")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", maxTabWidth)
					.attr("height", tabHeight - (tabHeight / 4));
			tabContentContainer
				.attr("clip-path", "url(#clip" + i + ")");

			// Resize the tabs as needed.
			var currentTabBBox = currentTabTextEle.node().getBBox()
			var currentTabWidth = currentTabBBox.width;
			var currentTabHeight = currentTabBBox.height;
			if (minTabWidth >= currentTabWidth + tabPadding)
			{
				// Minimum width is greater than or equal to the padded text size, so use the minimum tab size.
				currentTabWidth = minTabWidth;
				currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });
			}
			else if ((currentTabWidth + (2* tabPadding)) <= maxTabWidth)
			{
				// Tab width is not greater than max.
				currentTabWidth += (2 * tabPadding);
				currentTab.attr("d", function(d) { d.width = currentTabWidth; currentTabPath = top_rounded_rect_tab(d); return currentTabPath; });
				currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });
			}
			else
			{
				// Tab width is greater than max.
				currentTabWidth = maxTabWidth;
				currentTab.attr("d", function(d) { d.width = currentTabWidth; currentTabPath = top_rounded_rect_tab(d); return currentTabPath; });
				currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });
			}

			// Update the end position of the last tab.
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		
		// Add a border that the tabs will rest on.
		tabSet6.append("rect")
			.attr("width", svgWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", svgHeight - backingBorderHeight - backingBorderOffset)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var tabs = tabSet6.selectAll(".tab-container");
		tabs.on("mouseover", function() { d3.select(this).classed("hover", true); });
		tabs.on("mouseout", function() { d3.select(this).classed("hover", false); });
		var selectedTabSet6 = tabSet6.select(".tab-container").select(".tab");
		selectedTabSet6
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					
					// Clear old selected tab information.
					selectedTabSet6
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d); });
					
					// Record new selected tab information.
					selectedTabSet6 = d3.select(this).select(".tab");
					selectedTabSet6
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
				}
			});
	}
	
	
	/*******************
	* Create Tab Set 5 *
	*******************/
	{
		// Definitions.
		var svgWidth = 900;
		var svgHeight = 50;
		var minTabWidth = 40;
		var maxTabWidth = 90;
		var tabHeight = 35;
		var tabPadding = 2;  // Padding around the tab text content.
		var tabMargin = 5;
		var backingBorderHeight = 2;
		var backingBorderOffset = 5;  // Pixels by which the backing border is raise from the bottom of the SVG element.
		
		var tabSet7 = d3.select("#tab-set-5")  // The SVG element.
			.attr("width", svgWidth)
			.attr("height", svgHeight);
		
		// Create the <defs> to hold the clip paths and gradients.
		var defs = tabSet7.append("defs");
		
		// Setup the clip path.defs.append("clipPath")
		defs.append("clipPath")
			.attr("id", "clip")
			.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", maxTabWidth - tabPadding)
				.attr("height", tabHeight - (tabHeight / 4));
		
		// Create the tabs.
		var currentTabX = 0;
		var tabY = svgHeight - backingBorderHeight - tabHeight - backingBorderOffset;
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];

			// Create the container for the current tab.
			var tabContainer = tabSet7.append("g")
				.datum({"transX" : currentTabX + tabMargin, "transY" : tabY, "x" : 0, "y" : tabHeight, "width" : minTabWidth, "height" : tabHeight, "direction" : "up"})
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			
			// Create the current tab.
			var currentTabPath;
			var currentTab = tabContainer.append("path")
				.attr("d", function(d) { currentTabPath = top_rounded_rect_tab(d); return currentTabPath;})
				.classed("tab", true);
			
			// Create the text containing g element.
			var tabContentContainer = tabContainer.append("g")
				.classed("tab-content", true)
				.attr("transform", function(d) { return "translate(0," + (d.height / 4) + ")"; });

			// Create the text for the current tab.
			var currentTabTextEle = tabContentContainer.append("text")
				.attr("x", 0)
				.attr("y", function(d) { return (d.height - (d.height / 4)) / 2; })  // d.height / 4 is the default value for the y radius used to round the tab borders, and is therefore added to the tab height in order to get the middle of the straight edge of the tab.
				.text(currentTabText);

			// Setup the clip path.
			tabContentContainer.attr("clip-path", "url(#clip)");

			// Resize the tabs as needed.
			var currentTabBBox = currentTabTextEle.node().getBBox()
			var currentTabWidth = currentTabBBox.width;
			var currentTabHeight = currentTabBBox.height;
			if (minTabWidth >= currentTabWidth + tabPadding)
			{
				// Minimum width is greater than or equal to the padded text size, so use the minimum tab size.
				currentTabWidth = minTabWidth;
				currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });
			}
			else if ((currentTabWidth + (2 * tabPadding)) <= (maxTabWidth))
			{
				// Tab width is not large enough to need to start fading.
				currentTabWidth += (2 * tabPadding);
				currentTab.attr("d", function(d) { d.width = currentTabWidth; currentTabPath = top_rounded_rect_tab(d); return currentTabPath; });
				currentTabTextEle.attr("x", function(d) { return d.x + tabPadding; });
			}
			else
			{
				// Tab width is greater than max.

				// Create the gradient for this tab. Only want to fade out the last 30%-ish of the text that is visible on the tab (if you just made
				// the gradient start fading at 70% then it would be fading at 70% of the unclipped text, and the fade would therefore be
				// invisible for most long text tabs).
				var fadeStart = (maxTabWidth * 0.7) / currentTabWidth;
				var fadeEnd = (maxTabWidth * 1.2) / currentTabWidth;
				var finalOpacity = 0 + (((maxTabWidth * 1.2) - currentTabWidth) / currentTabWidth);  // The less text that overflows the end of the tab the more gradual the fade out. This helps to normalise all fadeouts so that they look similar irrespective of text amount in the tab.
				var gradient = defs.append("linearGradient")
					.attr("id", "fadeGradient" + i)
					.attr("x1", "0%")
					.attr("y1", "0%")
					.attr("x2", "100%")
					.attr("y2", "0%");
				gradient.append("stop")
					.attr("offset", fadeStart)
					.style("stop-color", "rgba(255,255,255,1)");
				gradient.append("stop")
					.attr("offset", fadeEnd)
					.style("stop-color", "rgba(255,255,255," + finalOpacity + ")");
				currentTabTextEle
					.style("fill", "url(#fadeGradient" + i + ")")
					.attr("x", function(d) { return d.x + tabPadding; });
				
				// Create the new smaller tab.
				currentTabWidth = maxTabWidth;
				currentTab.attr("d", function(d) { d.width = currentTabWidth; currentTabPath = top_rounded_rect_tab(d); return currentTabPath; });
			}

			// Update the end position of the last tab.
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		
		// Add a border that the tabs will rest on.
		tabSet7.append("rect")
			.attr("width", svgWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", svgHeight - backingBorderHeight - backingBorderOffset)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var tabs = tabSet7.selectAll(".tab-container");
		tabs.on("mouseover", function() { d3.select(this).classed("hover", true); });
		tabs.on("mouseout", function() { d3.select(this).classed("hover", false); });
		var selectedTabSet7 = tabSet7.select(".tab-container").select(".tab");
		selectedTabSet7
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					
					// Clear old selected tab information.
					selectedTabSet7
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d); });
					
					// Record new selected tab information.
					selectedTabSet7 = d3.select(this).select(".tab");
					selectedTabSet7
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("d", function(d) { return top_rounded_rect_tab(d, {"height" : 3}); });
				}
			});
	}
	
	
	/*************************
	* Tab Creation Functions *
	*************************/
	function top_rounded_rect_tab(config, extend)
	{
		// For left and right tabs, the width is the vertical sides
		// initialPoint - initialPoint.x x coord of initial coord initialPoint.y is y coord of it
		//		bottom left for up tabs, top left for right tabs, top right for down tabs and bottom right for left tabs
		// width - width of the tab, height - height of the tab
		// radiusX - x direction radius for corner arcs (always refers to the radius along the width side , so vertical in left and right tabs)
		// radiusY - y direction radius for corner arcs (always refers to the radius along the height side , so horizontal in left and right tabs)
		// direction - direction tabs should point
		
		// Tabs are designed to sit directly on a border.
		
		// extend takes width and height and allows you to add a little bit to the path
		
		// Determine initial coordinates.
		var initialX = typeof config.x !== undefined ? config.x : 0;
		var initialY = typeof config.y !== undefined ? config.y : 0;

		// Determine the width and height of the tab to be created.
		var width = typeof config.width !== 'undefined' ? config.width : 160;
		var height = typeof config.height !== 'undefined' ? config.height : (width / 4);
		
		// Determine whether to extend the width or height
		if (typeof extend !== 'undefined')
		{
			width = typeof extend.width !== 'undefined' ? width + extend.width : width;
			height = typeof extend.height !== 'undefined' ? height + extend.height : height;
		}

		// Determine the width and height of the tab to be created.
		var radiusX = typeof config.radiusX !== 'undefined' ? config.radiusX : (width / 2);
		var radiusY = typeof config.radiusY !== 'undefined' ? config.radiusY : (height / 4);
		
		// Determine the direction that the tab should go.
		var direction = typeof config.direction !== 'undefined' ? config.direction : "up";
		direction = (direction === "up") || (direction === "right") || (direction === "down") || (direction === "left") ? direction : "up";

		// Create path.
		var path = "M" + initialX + "," + initialY;
		switch(direction)
		{
			case "up":
				// Up is the same as a messed up direction.
			default:
				path += "v" + (radiusY - height) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + radiusX + "," + -radiusY +
						"h" + (width - (2 * radiusX)) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + radiusX + "," + radiusY +
						"v" + (height - radiusY);
				break;
			case "right":
				path += "h" + (height - radiusY) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + radiusY + "," + radiusX +
						"v" + (width - (2 * radiusX)) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + -radiusY + "," + radiusX +
						"h" + (radiusY - height);
				break;
			case "down":
				path += "v" + (height - radiusY) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + -radiusX + "," + radiusY +
						"h" + ((2 * radiusX) - width) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + -radiusX + "," + -radiusY +
						"v" + (radiusY - height);
				break;
			case "left":
				path += "h" + (radiusY - height) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + -radiusY + "," + -radiusX +
						"v" + ((2 * radiusX) - width) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + radiusY + "," + -radiusX +
						"h" + (height - radiusY);
				break;
		}
		return path;
	}

	function create_tabs_style_1(numberOfTabs, config)
	{
		// numberOfTabs - the number of tabs to create
		// Config contains
		//		x (and y) - the x (y) position of the start of the set of tabs
		//			for left aligned - this is the bottom left corner for up tabs, top left for right tabs, top right for down tabs and bottom right for left tabs
		//			for center aligned - this is the mid point of the tabs
		//			for right aligned - this is the bottom right corner for up tabs, bottom left for right tabs, top left for down tabs and top right for left tabs
		//		width - the width of the tabs (excluding the curved ends)
		//			for "left" and "right" tabs width is the length of the vertical sides of the tabs
		//		height - the height of the tabs
		//		curveWidth - the width of the curved portion on each end (each end has width curveWidth so total width is width + (2 * curveWidth))
		//		tabMargin - the margin between adjacent tabs
		//		rotation - angle in radians that the tabs should be rotated through. This can be used to get tabs pointing down, left and right.
		//			must be between -1 and 1
		//			the rotation is counter-clockwise with a value of 0 being taken to be the non-rotated upwards facing tabs position
		//				therefore if a rotation of 0.5 is supplied, left aligned tabs will go down and point right, while right aligned will point left and go up
		//		alignment - whether the tabs should be "left", "center" or "right" aigned
		
		// For left and center align, the leftmost tab is created first. The leftmost tab will therefore always appear to be 'stacked' on the bottom of the tabs if they overlap. Adding them
		// to the DOM in reverse order will therefore make them appear to be 'stacked' with the leftmost tab on top.
		// For right aligned tabs the rightmost tab is created fist, so the default stacking order is reversed.
		
		/***************************
		* Define Helper Functions. *
		***************************/
		function create_tab(rotation)
		{
			// Create the rotated path with no missing portions.
			var path = "M0," + height +
					   "q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
					   "t" + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
					   "l" + rotate_point(width, 0, rotation).join(",") +
					   "q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, height / 2, rotation).join(",") + 
					   "t" + rotate_point(curveWidth / 2, height / 2, rotation).join(",");

			// Create the rotated path with a missing right portion.
			var pathRight = "M0," + height +
							"q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
							"t" + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
							"l" + rotate_point(width, 0, rotation).join(",") +
							"q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, height / 2, rotation).join(",") + 
							"q" + rotate_point(-curveWidth / 4, height / 2, rotation).join(",") + "," + rotate_point(-curveWidth / 2, height / 2, rotation).join(",");

			// Create the rotated path with a missing left portion.
			var pathLeft = "M0," + height +
						   "m" + rotate_point(curveWidth, 0, rotation).join(",") +
						   "q" + rotate_point(-curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(-curveWidth / 2, -height / 2, rotation).join(",") +
						   "q" + rotate_point(curveWidth / 4, -height / 2, rotation).join(",") + "," + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
						   "l" + rotate_point(width, 0, rotation).join(",") +
						   "q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, height / 2, rotation).join(",") + 
						   "t" + rotate_point(curveWidth / 2, height / 2, rotation).join(",");

			// Create the rotated path with both left and right missing portions.
			var pathBoth = "M0," + height +
						   "m" + rotate_point(curveWidth, 0, rotation).join(",") +
						   "q" + rotate_point(-curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(-curveWidth / 2, -height / 2, rotation).join(",") +
						   "q" + rotate_point(curveWidth / 4, -height / 2, rotation).join(",") + "," + rotate_point(curveWidth / 2, -height / 2, rotation).join(",") +
						   "l" + rotate_point(width, 0, rotation).join(",") +
						   "q" + rotate_point(curveWidth / 4, 0, rotation).join(",") + "," + rotate_point(curveWidth / 2, height / 2, rotation).join(",") + 
						   "q" + rotate_point(-curveWidth / 4, height / 2, rotation).join(",") + "," + rotate_point(-curveWidth / 2, height / 2, rotation).join(",");

			return [path, pathRight, pathLeft, pathBoth];
		}
		
		function rotate_point(x, y, rotation)
		{
			var result = [0, 0];
			result[0] = x * Math.cos(Math.PI * rotation) - y * Math.sin(Math.PI * rotation);
			result[1] = x * Math.sin(Math.PI * rotation) + y * Math.cos(Math.PI * rotation);
			return result;
		}
		
		/******************************
		* Parse Configuration Inputs. *
		******************************/
		// Determine initial coordinates.
		var initialX = typeof config.x !== undefined ? config.x : 0;
		var initialY = typeof config.y !== undefined ? config.y : 0;

		// Determine the width and height of the tab to be created.
		var width = typeof config.width !== 'undefined' ? config.width : 160;
		var curveWidth = typeof config.curveWidth !== 'undefined' ? config.curveWidth : 20;
		var height = typeof config.height !== 'undefined' ? config.height : (width / 4);
		
		// Determine the angle that the tabs are to be rotated through.
		var rotation = typeof config.rotation !== 'undefined' ? config.rotation : 0;
		rotation = (rotation > 1) || (rotation < -1)? 0 : rotation;
		
		// Determine the tab alignment.
		var alignment = typeof config.alignment !== 'undefined' ? config.alignment : "left";
		alignment = (alignment === "left") || (alignment === "center") || (alignment === "right") ? alignment : "left";

		// Determine the information needed to create the tabs.
		var tabData = [];  // The data array that can be used to position each tab.
		var tabPath;  // The path for each tab.
		
		// Determine the starting coordinates for the first tab.
		var startX;  // The initial X coordinate.
		var startY;  // The initial Y coordinate.
		switch (alignment)
		{
			case "left":
				startX = initialX;
				startY = initialY - height;
				break;
			case "center":
				var numberOfTabsLeftOfCenter = numberOfTabs / 2;  // Fraction of the tabs (doesn't have to be an integer) that are left of the mid point.
				startX = initialX - (numberOfTabsLeftOfCenter * width) - ((numberOfTabsLeftOfCenter - 0.5) * curveWidth) - curveWidth;  // Bottom left corner of the left most tab.
					// -0.5 as for example with 3 tabs you have an entire margin to the left of center, with 2 tabs you have half a margin, with 4 you have 1.5 margins, 5 you have 2
					// # of margins is always 0.5 less than numer of tabs to the left
				var rotatedStart = rotate_point(initialX - startX, 0, rotation);
				startX = initialX - rotatedStart[0];
				startY = initialY - rotatedStart[1] - height;
				break;
			case "right":
				startX = initialX - (numberOfTabs * width) - ((numberOfTabs - 1) * curveWidth) - (2 * curveWidth);  // Bottom left corner of the left most tab.
				var rotatedStart = rotate_point(initialX - startX, 0, rotation);
				startX = initialX - rotatedStart[0];
				startY = initialY - rotatedStart[1] - height;
				break;
		}
		
		// Determine the locations for each tab.
		var currentTabY = startY;  // Y coordinate of the tab currently being created.
		var currentTabX = startX;  // X coordinate of the tab currently being created.
		var nonRotatedCoordX = 0;  // The X coordinate of the current tab if it had not been rotated.
		for (var i = 0; i < numberOfTabs; i++)
		{
			var currentTabOffset = rotate_point(nonRotatedCoordX, 0, rotation);  // Amount to offset the current tab from the previous tab in both the X and Y directions.
			nonRotatedCoordX += (width + curveWidth);
			currentTabX = startX + currentTabOffset[0];
			currentTabY = startY + currentTabOffset[1];
			
			// Generate the data for the current tab.
			tabData.push({"key" : i, "transX" : currentTabX, "transY" : currentTabY});
		}
		
		// Create the path for the tab.
		tabPaths = create_tab(rotation);

		// Create the config object that was used.
		var tabConfig = {"x" : initialX, "y" : initialY, "width" : width, "height" : height, "curveWidth" : curveWidth,
						 "rotation" : rotation, "alignment" : alignment};
		
		return {"config" : tabConfig, "data" : tabData, "path" : tabPaths[0], "pathMissingRight" : tabPaths[1], "pathMissingLeft" : tabPaths[2],
				"pathMissingBoth" : tabPaths[3]};
	}
});
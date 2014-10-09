$(document).ready(function()
{
	// Setup behaviour for tab set 1.
	var selectedTabSet1 = $("#tab-set-1 .tab:eq(0)");
	selectedTabSet1.addClass("selected");
	$("#tab-set-1 .tab").click(function()
		{
			// Clear old selected tab information.
			selectedTabSet1.removeClass("selected");
			
			// Record new selected tab information.
			selectedTabSet1 = $(this);
			selectedTabSet1.addClass("selected");
		});



	/*******************
	* Create Tab Set 2 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 105;
		var numberOfTabs = 3;
		var tabWidth = 50;
		var tabHeightSet2 = 25;
		var tabMargin = 5;
		var backingBorderStart = 50;
		var backingBorderHeight = 5;
		
		var tabSet2 = d3.select("#tab-set-2")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		var currentTabX = 0;
		var tabYTop = backingBorderStart - tabHeightSet2;
		var tabYBottom = backingBorderStart + backingBorderHeight;
		var tabLocations = [];
		// Left aligned tabs going upwards.
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYTop});
			currentTabX += (tabMargin + tabWidth + tabMargin);
		}
		// Right aligned tabs going upwards.
		var currentTabX = tabContainerWidth;
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX - tabMargin - tabWidth, "y" : tabYTop});
			currentTabX -= (tabMargin + tabWidth + tabMargin);
		}
		// Center aligned tabs going down.
		var numberOfTabsLeftOfCenter = numberOfTabs / 2;
		var currentTabX = (tabContainerWidth / 2) - (numberOfTabsLeftOfCenter * tabWidth) - (Math.floor(numberOfTabsLeftOfCenter) * tabMargin);
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYBottom});
			currentTabX += (tabMargin + tabWidth + tabMargin);
		}
		var tabs = tabSet2.selectAll(".tab")
			.data(tabLocations)
			.enter()
			.append("rect")
			.attr("width", tabWidth)
			.attr("height", tabHeightSet2)
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.classed("tab", true);
		
		// Add a border that the tabs will rest on.
		tabSet2.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", backingBorderStart)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var selectedTabSet2 = tabSet2.select(".tab");
		selectedTabSet2
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("height", tabHeightSet2 + 2)
			.attr("y", function(d) { return d.y - 2; });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					// Clear old selected tab information.
					selectedTabSet2
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeightSet2)
						.attr("y", function(d) { return d.y; });
					
					// Record new selected tab information.
					selectedTabSet2 = d3.select(this);
					selectedTabSet2
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeightSet2 + 2)
						.attr("y", function(d) { if (d.y < backingBorderStart) { return d.y - 2; } else { return d.y; }});
				}
			});
	}
	
	
	/*******************
	* Create Tab Set 3 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var tabText = ["T1", "T 2", "Tab Three", "Big Long Fourth Tab"]
		var minTabWidth = 40;
		var tabHeight = 35;
		var tabPadding = 2;  // Padding around the tab text content.
		var backingBorderHeight = 5;
		
		var tabSet3 = d3.select("#tab-set-3")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		var currentTabX = 0;
		var tabY = backingBorderStart - tabHeight;
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];

			// Create the container for the current tab.
			var tabContainer = tabSet3.append("g")
				.datum({"transX" : currentTabX + tabMargin, "transY" : tabY, "tabX" : 0, "tabY" : 0})
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			
			// Create the current tab.
			var currentTab = tabContainer.append("rect")
				.attr("width", minTabWidth)
				.attr("height", tabHeight)
				.attr("x", function(d) { return d.tabX; })
				.attr("y", function(d) { return d.tabY; })
				.classed("tab", true);
			
			// Create the text for the current tab.
			var foreignObject = tabContainer.append("foreignObject")
				.attr("width", tabContainerWidth)
				.attr("height", tabHeight - tabPadding)
				.attr("x", 0)
				.attr("y", 0)
			var tabContent = foreignObject.append("xhtml:div")
				.classed("tab-content", true)
				.html("<span>" + currentTabText + "</span>");
			
			// Resize the tabs as needed.
			var currentTabContent = $(tabContent.node());
			var currentTabWidth = currentTabContent.width();  // Would need to increment the width by something like 1 in order to prevent wrapping, unless nowrap is specified in CSS.
			var currentTabHeight = currentTabContent.height();
			foreignObject
				.attr("x", tabPadding)
				.attr("y", tabPadding)
				.attr("width", currentTabWidth);
			if (minTabWidth >= currentTabWidth + (2 * tabPadding))
			{
				// Minimum width is greater than or equal to the padded text size, so use the minimum tab size.
				currentTabWidth = minTabWidth;
			}
			else
			{
				currentTabWidth += (2 * tabPadding);
			}
			currentTab.attr("width", currentTabWidth);

			// Update the end position of the last tab.
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		
		// Add a border that the tabs will rest on.
		tabSet3.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var tabs = tabSet3.selectAll(".tab-container");
		tabs.on("mouseover", function() { d3.select(this).classed("hover", true); });
		tabs.on("mouseout", function() { d3.select(this).classed("hover", false); });
		var selectedTabSet3 = tabSet3.select(".tab-container").select(".tab");
		selectedTabSet3
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("height", tabHeight + 2)
			.attr("y", function(d) { return d.tabY - 2; });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					
					// Clear old selected tab information.
					selectedTabSet3
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeight)
						.attr("y", function(d) { return d.tabY; });
					
					// Record new selected tab information.
					selectedTabSet3 = d3.select(this).select(".tab");
					selectedTabSet3
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeight + 2)
						.attr("y", function(d) { return d.tabY - 2; });
				}
			});
	}
	
	
	/*******************
	* Create Tab Set 4 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var tabText = ["T1", "T 2", "Tab Three", "Big Long Fourth Tab"]
		var minTabWidth = 40;
		var maxTabWidth = 100;
		var tabHeight = 35;
		var tabPadding = 2;  // Padding around the tab text content.
		var backingBorderHeight = 5;
		
		var tabSet4 = d3.select("#tab-set-4")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		var currentTabX = 0;
		var tabY = backingBorderStart - tabHeight;
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];

			// Create the container for the current tab.
			var tabContainer = tabSet4.append("g")
				.datum({"transX" : currentTabX + tabMargin, "transY" : tabY, "tabX" : 0, "tabY" : 0})
				.attr("transform", function(d) { return "translate(" + d.transX + "," + d.transY + ")"; })
				.classed("tab-container", true);
			
			// Create the current tab.
			var currentTab = tabContainer.append("rect")
				.attr("width", maxTabWidth)
				.attr("height", tabHeight)
				.attr("x", function(d) { return d.tabX; })
				.attr("y", function(d) { return d.tabY; })
				.classed("tab", true);
			
			// Create the text for the current tab.
			var foreignObject = tabContainer.append("foreignObject")
				.attr("width", maxTabWidth - (2 * tabPadding))
				.attr("height", tabHeight - tabPadding)
				.attr("x", 0)
				.attr("y", 0)
			var tabContent = foreignObject.append("xhtml:div")
				.classed("tab-content", true)
				.html("<span>" + currentTabText + "</span>");
			
			// Resize the tabs as needed.
			var currentTabContent = $(tabContent.node());
			var currentTabWidth = currentTabContent.width();
			var currentTabHeight = currentTabContent.height();
			if (minTabWidth >= currentTabWidth + (2 * tabPadding))
			{
				// Minimum width is greater than or equal to the padded text size, so use the minimum tab size.
				currentTabWidth = minTabWidth;
				currentTab.attr("width", minTabWidth);
			}
			else if (currentTabWidth + (2 * tabPadding) <= maxTabWidth - (2 * tabPadding))
			{
				currentTabWidth += (2 * tabPadding);
				currentTab.attr("width", currentTabWidth);
			}
			else
			{
				currentTabWidth = maxTabWidth - (2 * tabPadding);
				currentTab.attr("width", maxTabWidth);
			}
			foreignObject
				.attr("x", tabPadding)
				.attr("y", tabPadding)
				.attr("width", currentTabWidth);

			// Update the end position of the last tab.
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		
		// Add a border that the tabs will rest on.
		tabSet4.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var tabs = tabSet4.selectAll(".tab-container");
		tabs.on("mouseover", function() { d3.select(this).classed("hover", true); });
		tabs.on("mouseout", function() { d3.select(this).classed("hover", false); });
		var selectedTabSet4 = tabSet4.select(".tab-container").select(".tab");
		selectedTabSet4
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("height", tabHeight + 2)
			.attr("y", function(d) { return d.tabY - 2; });
		tabs.on("mousedown", function()
			{
				if (d3.event.button == 0)
				{
					// Left click.
					
					// Clear old selected tab information.
					selectedTabSet4
						.classed("selected", false)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeight)
						.attr("y", function(d) { return d.tabY; });
					
					// Record new selected tab information.
					selectedTabSet4 = d3.select(this).select(".tab");
					selectedTabSet4
						.classed("selected", true)
						.transition()
						.duration(100)
						.ease("linear")
						.attr("height", tabHeight + 2)
						.attr("y", function(d) { return d.tabY - 2; });
				}
			});
	}
	
	
	/*******************
	* Create Tab Set 5 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 500;
		var backingBorderHeight = 5;
		
		var tabSet5 = d3.select("#tab-set-5")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		tabSet5.append("path")
			.attr("d", top_rounded_rect({"x" : 100, "y" : 80}, 160, 40, 80, 12.5, "up"))
			.style("fill", "none")
			.style("stroke", "white")
			.style("stroke-width", 2);
		tabSet5.append("path")
			.attr("d", top_rounded_rect({"x" : 260, "y" : 80}, 160, 40, 80, 12.5, "right"))
			.style("fill", "none")
			.style("stroke", "white")
			.style("stroke-width", 2);
		tabSet5.append("path")
			.attr("d", top_rounded_rect({"x" : 260, "y" : 240}, 160, 40, 80, 12.5, "down"))
			.style("fill", "none")
			.style("stroke", "white")
			.style("stroke-width", 2);
		tabSet5.append("path")
			.attr("d", top_rounded_rect({"x" : 100, "y" : 240}, 160, 40, 80, 12.5, "left"))
			.style("fill", "none")
			.style("stroke", "white")
			.style("stroke-width", 2);
		
		// Add a border that the tabs will rest on.
		tabSet5.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
	}
	
	
	/*******************
	* Create Tab Set 6 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var backingBorderHeight = 5;
		
		var tabSet6 = d3.select("#tab-set-6")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Add a border that the tabs will rest on.
		tabSet6.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
	}
	
	
	/*******************
	* Create Tab Set 7 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var backingBorderHeight = 5;
		
		var tabSet7 = d3.select("#tab-set-7")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Add a border that the tabs will rest on.
		tabSet7.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
	}


	/*******************
	* Helper Functions *
	*******************/
	function top_rounded_rect(initialPoint, width, height, radiusX, radiusY, direction)
	{
		// initialPoint - initialPoint.x x coord of initial coord initialPoint.y is y coord of it
		// width - width of the tab, height - height of the tab
		// radiusX - x direction radius for corner arcs
		// radiusY - y direction radius for corner arcs
		
		// Determine initial coordinates.
		var initialX = typeof initialPoint.x !== undefined ? initialPoint.x : 0;
		var initialY = typeof initialPoint.y !== undefined ? initialPoint.y : 0;

		// Determine the width and height of the tab to be created.
		width = typeof width !== 'undefined' ? width : 160;
		height = typeof height !== 'undefined' ? height : (width / 4);

		// Determine the width and height of the tab to be created.
		radiusX = typeof radiusX !== 'undefined' ? radiusX : (width / 2);
		radiusY = typeof radiusY !== 'undefined' ? radiusY : (height / 4);
		
		// Determine the direction that the tab should go.
		direction = typeof direction !== 'undefined' ? direction : "up";
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
						"v" + (height - radiusY) +
						"z";
				break;
			case "right":
				path += "h" + (height - radiusY) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + radiusY + "," + radiusX +
						"v" + (width - (2 * radiusX)) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + -radiusY + "," + radiusX +
						"h" + (radiusY - height) +
						"z";
				break;
			case "down":
				path += "v" + (height - radiusY) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + -radiusX + "," + radiusY +
						"h" + ((2 * radiusX) - width) +
						"a" + radiusX + "," + radiusY + " 0 0 1 " + -radiusX + "," + -radiusY +
						"v" + (radiusY - height) +
						"z";
				break;
			case "left":
				path += "h" + (radiusY - height) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + -radiusY + "," + -radiusX +
						"v" + ((2 * radiusX) - width) +
						"a" + radiusY + "," + radiusX + " 0 0 1 " + radiusY + "," + -radiusX +
						"h" + (height - radiusY) +
						"z";
				break;
		}
		return path;
	  return 
	}

});
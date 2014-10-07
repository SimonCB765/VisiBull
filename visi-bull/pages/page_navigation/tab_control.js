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
		var topHalfEnds = 50;
		var bottomHalfStarts = 55;
		var numberOfTabs = 3;
		var tabWidth = 50;
		var tabHeight = 25;
		var tabMargin = 5;
		var backingBorderHeight = 5;
		
		var tabSet2 = d3.select("#tab-set-2")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		var currentTabX = 0;
		var tabYTop = topHalfEnds - backingBorderHeight - tabHeight;
		var tabYBottom = bottomHalfStarts + backingBorderHeight;
		var tabLocations = [];
		// Left aligned tabs.
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYTop});
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYBottom});
			currentTabX += (tabMargin + tabWidth + tabMargin);
		}
		// Right aligned tabs.
		var currentTabX = tabContainerWidth;
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX - tabMargin - tabWidth, "y" : tabYTop});
			tabLocations.push({"x" : currentTabX - tabMargin - tabWidth, "y" : tabYBottom});
			currentTabX -= (tabMargin + tabWidth + tabMargin);
		}
		// Center aligned tabs.
		var numberOfTabsLeftOfCenter = numberOfTabs / 2;
		var currentTabX = (tabContainerWidth / 2) - (numberOfTabsLeftOfCenter * tabWidth) - (Math.floor(numberOfTabsLeftOfCenter) * tabMargin);
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYTop});
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYBottom});
			currentTabX += (tabMargin + tabWidth + tabMargin);
		}
		var tabs = tabSet2.selectAll(".tab")
			.data(tabLocations)
			.enter()
			.append("rect")
			.attr("width", tabWidth)
			.attr("height", tabHeight)
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.classed("tab", true);
		
		// Add a bottom and top border that the tabs will rest on.
		tabSet2.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", topHalfEnds - backingBorderHeight)
			.classed("backing", true);
		tabSet2.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", bottomHalfStarts)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var selectedTabSet2 = tabSet2.select(".tab");
		selectedTabSet2
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("height", tabHeight + 2)
			.attr("y", function(d) { return d.y - 2; });
		tabs.on("mousedown", function()
			{
				// Clear old selected tab information.
				selectedTabSet2
					.classed("selected", false)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("height", tabHeight)
					.attr("y", function(d) { return d.y; });
				
				// Record new selected tab information.
				selectedTabSet2 = d3.select(this);
				selectedTabSet2
					.classed("selected", true)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("height", tabHeight + 2)
					.attr("y", function(d) { if (d.y < topHalfEnds) { return d.y - 2; } else { return d.y; }});
			});
	}
	
	
	/*******************
	* Create Tab Set 3 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		
		var tabSet3 = d3.select("#tab-set-3")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
	}
});
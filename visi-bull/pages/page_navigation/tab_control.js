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
		var tabHeight = 25;
		var tabMargin = 5;
		var backingBorderStart = 50;
		var backingBorderHeight = 5;
		
		var tabSet2 = d3.select("#tab-set-2")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		var currentTabX = 0;
		var tabYTop = backingBorderStart - tabHeight;
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
			.attr("height", tabHeight)
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
					.attr("y", function(d) { if (d.y < backingBorderStart) { return d.y - 2; } else { return d.y; }});
			});
	}
	
	
	/*******************
	* Create Tab Set 3 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var tabText = ["T1", "Tab 2", "Tab Three", "Big Long Fourth Tab"]
		var minTabWidth = 20;
		var tabPadding = 2;  // Padding around the tab text content.
		var backingBorderHeight = 5;
		
		var tabSet3 = d3.select("#tab-set-3")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Create the tabs.
		

		// Create the text elements for the tabs.
		var tabTextElements = [];
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabText = tabText[i];
		}
		var foreignObject = tabSet3.append("foreignObject")
			.attr("width", 300)
			.attr("height", 50)
			.attr("x", 0)
			.attr("y", 0)
		var tabContent = foreignObject.append("xhtml:div")
			.classed("tab-content", true)
			.html("<span>OMG OMG OMG OMG................ pasdpapsd apsf paf pa sfpa pf apsf apsf paiwpfjapwfjp afj</span>");
		foreignObject
			.attr("width", $(tabContent.node()).width())
			.attr("height", $(tabContent.node()).height())
		console.log($(tabContent.node()).width(), $(tabContent.node()).height());
		
		// Create the tabs.
		var currentTabX = 0;
		var tabYTop = backingBorderStart - tabHeight;
		var tabYBottom = backingBorderStart + backingBorderHeight;
		var tabLocations = [];
		for (var i = 0; i < tabText.length; i++)
		{
			var currentTabTextEle = tabTextElements[i];
			var currentTabWidth = currentTabTextEle.getBBox().width;
			console.log(currentTabWidth, currentTabTextEle.getComputedTextLength());
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabYTop, "width" : currentTabWidth});
			currentTabX += (tabMargin + currentTabWidth + tabMargin);
		}
		var tabs = tabSet3.selectAll(".tab")
			.data(tabLocations)
			.enter()
			.append("rect")
			.attr("width", tabWidth)
			.attr("height", tabHeight)
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.classed("tab", true);
		
		// Add a border that the tabs will rest on.
		tabSet3.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
		
		// Setup the behaviour of the tabs.
		var selectedTabSet3 = tabSet3.select(".tab");
		selectedTabSet3
			.classed("selected", true)
			.transition()
			.duration(100)
			.ease("linear")
			.attr("height", tabHeight + 2)
			.attr("y", function(d) { return d.y - 2; });
		tabs.on("mousedown", function()
			{
				// Clear old selected tab information.
				selectedTabSet3
					.classed("selected", false)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("height", tabHeight)
					.attr("y", function(d) { return d.y; });
				
				// Record new selected tab information.
				selectedTabSet3 = d3.select(this);
				selectedTabSet3
					.classed("selected", true)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("height", tabHeight + 2)
					.attr("y", function(d) { if (d.y < backingBorderStart) { return d.y - 2; } else { return d.y; }});
			});
	}
	
	
	/*******************
	* Create Tab Set 4 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var backingBorderHeight = 5;
		
		var tabSet4 = d3.select("#tab-set-4")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
		// Add a border that the tabs will rest on.
		tabSet4.append("rect")
			.attr("width", tabContainerWidth)
			.attr("height", backingBorderHeight)
			.attr("x", 0)
			.attr("y", tabContainerHeight - backingBorderHeight)
			.classed("backing", true);
	}
	
	
	/*******************
	* Create Tab Set 5 *
	*******************/
	{
		// Definitions.
		var tabContainerWidth = 800;
		var tabContainerHeight = 50;
		var backingBorderHeight = 5;
		
		var tabSet5 = d3.select("#tab-set-5")  // The SVG element.
			.attr("width", tabContainerWidth)
			.attr("height", tabContainerHeight);
		
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


	/******************
	* Useful Snippets *
	******************/
	
	// Adding a foreign element with a max width, and then wrapping its bounding foreign element to the width of the text.
	/*
		var foreignObject = tabSet3.append("foreignObject")
			.attr("width", 300)
			.attr("height", 50)
			.attr("x", 0)
			.attr("y", 0)
		var tabContent = foreignObject.append("xhtml:div")
			.classed("tab-content", true)
			.html("<span>OMG OMG OMG OMG................ pasdpapsd apsf paf pa sfpa pf apsf apsf paiwpfjapwfjp afj</span>");
		foreignObject
			.attr("width", $(tabContent.node()).width())
			.attr("height", $(tabContent.node()).height())
		console.log($(tabContent.node()).width(), $(tabContent.node()).height());
	*/

});
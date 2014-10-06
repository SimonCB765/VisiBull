$(document).ready(function()
{
    // Hide all but the desired initial tab of content.
	var startingTabIndex = 1;
	var selectedNavTab = $("#navigation-buttons .button:eq(" + startingTabIndex + ")");
	selectedNavTab.toggleClass("selected");
    var selectedNavTabID = selectedNavTab.attr("data-navLink");
    $(".navigation-panel").hide();
	$(".navigation-panel#" + selectedNavTabID).show();

    // Setup navigation tab behaviour.
    $("#navigation-buttons .button").click(function()
        {
			// Clear old selected navigation tab information.
            $(".navigation-panel#" + selectedNavTabID).hide();
			selectedNavTab.toggleClass("selected");
			
			// Record new selected navigation tab information.
			selectedNavTab = $(this);
			selectedNavTab.toggleClass("selected");
            selectedNavTabID = selectedNavTab.attr("data-navLink");
            $(".navigation-panel#" + selectedNavTabID).show();
        });
	
	/***********
	* Tab Sets *
	***********/
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
		// Definitions.
		var numberOfTabs = 4;
		var tabWidth = 100;
		var tabHeight = 35;
		var tabMargin = 5;
		var backingBorderHeight = 5;
		
		var tabSet2 = d3.select("#tab-set-2");  // The SVG element.
		
		// Create the tabs.
		var currentTabX = 0;
		var tabY = parseInt(tabSet2.attr("height"), 10) - backingBorderHeight - tabHeight;
		var tabLocations = [];
		for (var i = 0; i < numberOfTabs; i++)
		{
			tabLocations.push({"x" : currentTabX + tabMargin, "y" : tabY});
			currentTabX += tabMargin + tabWidth + tabMargin;
		}
		tabSet2.selectAll(".tabs")
			.data(tabLocations)
			.enter()
			.append("rect")
			.attr("width", tabWidth)
			.attr("height", tabHeight)
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; })
			.classed("tab", true);
		
		// Add a bottom border that the tabs will rest on.
		tabSet2.append("rect")
			.attr("width", tabSet2.attr("width"))
			.attr("height", backingBorderHeight + "px")
			.attr("x", 0)
			.attr("y", parseInt(tabSet2.attr("height"), 10) - backingBorderHeight)
			.classed("backing", true);
		
		console.log(tabLocations);
		
		
		var selectedTabSet2 = $("#tab-set-12 .tab:eq(0)");
	}

	/**************
	* Button Sets *
	**************/
	{
		// Setup behaviour for button set 1.
		var selectedButtonSet1 = $("#button-set-1 .button:eq(0)");
		$("#button-set-1 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet1.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet1 = $(this);
				selectedButtonSet1.addClass("selected");
			});

		// Setup behaviour for button set 2.
		var selectedButtonSet2 = $("#button-set-2 .button:eq(0)");
		$("#button-set-2 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet2.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet2 = $(this);
				selectedButtonSet2.addClass("selected");
			});

		// Setup behaviour for button set 3.
		var selectedButtonSet3 = $("#button-set-3 .button:eq(0)");
		$("#button-set-3 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet3.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet3 = $(this);
				selectedButtonSet3.addClass("selected");
			});

		// Setup behaviour for button set 4.
		var selectedButtonSet4 = $("#button-set-4 .button:eq(0)");
		$("#button-set-4 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet4.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet4 = $(this);
				selectedButtonSet4.addClass("selected");
			});
		
		// Setup behaviour for button set 5.
		var selectedButtonSet5 = $("#button-set-5 .button:eq(0)");
		$("#button-set-5 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet5.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet5 = $(this);
				selectedButtonSet5.addClass("selected");
			});
		
		// Setup behaviour for button set 6.
		var selectedButtonSet6 = $("#button-set-6 .button:eq(0)");
		$("#button-set-6 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet6.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet6 = $(this);
				selectedButtonSet6.addClass("selected");
			});
		
		// Setup behaviour for button set 7.
		var selectedButtonSet7 = $("#button-set-7 .button:eq(0)");
		$("#button-set-7 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet7.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet7 = $(this);
				selectedButtonSet7.addClass("selected");
			});
		
		// Setup behaviour for button set 8.
		var selectedButtonSet8 = $("#button-set-8 .button:eq(0)");
		$("#button-set-8 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet8.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet8 = $(this);
				selectedButtonSet8.addClass("selected");
			});
		
		// Setup behaviour for button set 9.
		var selectedButtonSet9 = $("#button-set-9 .button:eq(0)");
		$("#button-set-9 .button").click(function()
			{
				// Clear old selected button information.
				selectedButtonSet9.removeClass("selected");
				
				// Record new selected button information.
				selectedButtonSet9 = $(this);
				selectedButtonSet9.addClass("selected");
			});
	}
});
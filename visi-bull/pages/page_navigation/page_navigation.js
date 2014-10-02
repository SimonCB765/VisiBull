$(document).ready(function()
{
    // Hide all but the desired initial tab of content.
	var startingTabIndex = 1;
	var selectedNavTab = $(".navigation .button:eq(" + startingTabIndex + ")");
	selectedNavTab.toggleClass("selected");
    var selectedNavTabID = selectedNavTab.attr("data-navLink");
    $(".navigation-panel:not(:eq(" + startingTabIndex + "))").hide();

    // Setup navigation tab behaviour.
    $(".navigation .button").click(function()
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
});
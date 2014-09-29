$(document).ready(function()
{
    // Hide all but the desired initial tab of content.
	var startingTabIndex = 1;
	var selectedNavTab = $(".navigation li:eq(" + startingTabIndex + ")");
	selectedNavTab.toggleClass("selected");
    var selectedNavTabID = selectedNavTab.attr("data-navLink");
    $(".navigation-panel:not(:eq(" + startingTabIndex + "))").hide();

    // Setup navigation tab behaviour.
    $(".navigation li").click(function()
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

	// Setup the behaviour for the first set of buttons.
    $("#button-set-1 li")
		.on( "mousedown", function()
			{
				// Change button text color.
				var selectedButton = $(this);
				$("#button-set-1 li").css("color", selectedButton.attr("data-color"));
			});

	// Setup the behaviour for the second set of buttons.
    $("#button-set-2 li").on("mousedown", function() { $(this).toggleClass("selected"); });

	// Setup the behaviour for the third set of buttons.
    $("#button-set-3 li").on("mousedown", function() { $(this).toggleClass("selected"); });
	
	// Setup the behaviour for the fourth set of buttons.
    $("#button-set-4 li").on("mousedown", function() { $(this).toggleClass("selected"); });
});
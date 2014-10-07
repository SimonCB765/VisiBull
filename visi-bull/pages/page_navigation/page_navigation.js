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
});
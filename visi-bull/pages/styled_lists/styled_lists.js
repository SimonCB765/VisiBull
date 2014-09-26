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
	var selectedButton = $("#button-set-1 li:first");
	selectedButton.toggleClass("selected")
    $("#button-set-1 li").click(function()
        {
			// Undepress button.
			selectedButton.toggleClass("selected");
			
			// Depress clicked button.
			selectedButton = $(this);
			selectedButton.toggleClass("selected");
			
			// change description color.
			$("#button-description-1").css("color", selectedButton.attr("data-color"));
        });
});
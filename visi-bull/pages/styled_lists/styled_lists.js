$(document).ready(function()
{
    // Hide all but the first tab of content.
    var currentlyVisibile = $(".navigation li:first").attr("data-navLink");
    console.log(currentlyVisibile);
    $(".navigation-panel:not(:first)").hide();

    // Setup navigation tab behaviour.
    $(".navigation li").click(function()
        {
            $(".navigation-panel#" + currentlyVisibile).hide();
            currentlyVisibile = $(this).attr("data-navLink");
            $(".navigation-panel#" + currentlyVisibile).show();
        });
});
$(document).ready(function()
{
    setup_banners();  // Setup the links to the other pages.
})

function setup_banners()
{
    var bannerWidth = 900;  // The width of the SVG banner.
    var bannerHeight = 100;  // The height of the SVG banner.

    var backgrounds = d3.selectAll(".bannerContainer")
        .each(function()
        {
            // Select the needed info to setup the banner for this container.
            var container = d3.select(this);
            var backgroundImage = container.attr("data-background");  // The URL for the background image of the banner.
            var bannerText = container.attr("data-name");  // The text to overlay on the banner.
            var textColor = container.attr("data-textColor"); // the color for the overlayed text.
            var banner = container.select(".banner");

            // Size the banner.
            banner
                .attr("width", bannerWidth)
                .attr("height", bannerHeight);

            // Setup the background of the banner.
            banner.style("background-image", "url(" + backgroundImage + ")");

            // Add the text to the banner.
            banner.append("text")
                .classed("bannerText", true)
                .attr("x", 0)
                .attr("y", bannerHeight / 2)
                .attr("dy", ".35em")
                .style("fill", textColor)
                .text(bannerText);
        });
}
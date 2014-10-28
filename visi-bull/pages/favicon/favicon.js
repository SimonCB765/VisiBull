$(document).ready(function()
{
    // Select the divs that will contain the icons.
    var noLinks = d3.select("#no-links");
    var withLinks = d3.select("#with-links");

    // Define the size of each SVG element.
    var svgWidth = 220;  // The width of the SVG element.
    var svgHeight = 160;  // The height of the SVG element.

    // Create the black on white outline without links.
    var svg = noLinks.append("svg")
        .classed("blackOnWhite", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    create_outline(svg);

    // Create the white on black outline without links.
    var svg = noLinks.append("svg")
        .classed("whiteOnBlack", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    create_outline(svg);

    // Create the black on white outline with links.
    var svg = withLinks.append("svg")
        .classed("blackOnWhite", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    create_outline(svg);
    // Add the links.
    var homeLink = svg.append("a")
        .attr("xlink:href", HOMEPAGE);
    homeLink.append("text")
        .classed("home", true)
        .text("Home")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight / 2);
    var githubLink = svg.append("a")
        .attr("xlink:href", GITHUBREPO);
    githubLink.append("text")
        .classed("github", true)
        .text("GitHub")
        .attr("x", svgWidth)
        .attr("y", svgHeight);

    // Create the white on black outline with links.
    var svg = withLinks.append("svg")
        .classed("whiteOnBlack", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    create_outline(svg);
    // Add the links.
    var homeLink = svg.append("a")
        .attr("xlink:href", HOMEPAGE);
    homeLink.append("text")
        .classed("home", true)
        .text("Home")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight / 2);
    var githubLink = svg.append("a")
        .attr("xlink:href", GITHUBREPO);
    githubLink.append("text")
        .classed("github", true)
        .text("GitHub")
        .attr("x", svgWidth)
        .attr("y", svgHeight);

    function create_outline(svg)
    {
        var path =
            "M0,49" +
            "C20,45,17,10,114,29" +
            "C112,14" + ",163,32" + ",164,0" +
            "C174,20" + ",145,31" + ",138,31" +
            "Q163,35" + ",164,47" +
            "C194,53" + ",208,51" + ",215,27" +
            "C215,57" + ",190,65" + ",167,57" +
            "Q177,62" + ",173,72" +
            "C179,80" + ",175,90" + ",191,98" +
            "C195,104" + ",177,122" + ",164,116" +
            "C133,98" + ",156,120" + ",121,109" +
            "Q116,116" + ",107,113" +
            "C99,133" + ",107,145" + ",99,160"
            //+ "L0,160" + "Z"  // Used to close off the bull outline if you want a filled in one.
            ;
        svg.append("path")
            .classed("bull", true)
            .attr("d", path);
    }
});
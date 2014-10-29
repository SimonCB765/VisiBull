$(document).ready(function()
{
    var underground = d3.select("#underground");

    // Draw the zones.
    underground.append("path")
        .classed("zone", true)
        .attr("d", create_zone_8)
        ;



    underground
        .on("click", function() { console.log(d3.mouse(d3.select("body").node())); });



    function create_zone_8()
    {
        var zone9 =
            "M2,113" +
            "L85,36" +
            "Q88,34" + ",88,30" +
            "L88,7" +
            "L214,7" +
            "L240,31" +
            "Q243,33" + ",246,33" +
            "L308,33" +
            "Q311,33" + ",314,31" +
            "L339,7" +
            "L370,7" +
            "L321,52" +
            "Q317,55" + ",313,55" +
            "L257,55" +
            "Q251,55" + ",249,52" +
            "L211,17" +
            "Q207,15" + ",204,15" +
            "L179,15" +
            "Q172,15" + ",170,17" +
            "L139,45" +
            "Q133,49" + ",129,49" +
            "L88,49" +
            "Q83,49" + ",80,52" +
            "L2,123" +
            "L2,113"
            ;
        return zone9;
    }
});
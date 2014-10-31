$(document).ready(function()
{
    var underground = d3.select("#underground");

    // Draw the zones.
    underground.append("path")
        .classed("zone", true)
        .attr("d", create_zone_2());
    underground.append("path")
        .classed("zone", true)
        .attr("d", create_zone_4());
    underground.append("path")
        .classed("zone", true)
        .attr("d", create_zone_6());
    underground.append("path")
        .classed("zone", true)
        .attr("d", create_zone_8());



    underground
        .on("click", function() { console.log(d3.mouse(d3.select("body").node())); });


    function create_zone_2()
    {
        var zone2Outer =
            "M490,130" +  // Just above Hampstead Heath.
            "L668,130" +
            "Q672,130" + ",676,132" +  // Bend by Seven Sisters.
            "L787,233" +
            "Q795,239" + ",795,244" +  // Bend by Pudding Mill Lane.
            "L795,363" +
            "Q795,366" + ",791,366" +  // First bend near North Greenwich.
            "Q788,366" + ",788,371" +  // Second bend near North Greenwich.
            "L788,425" +
            "Q788,429" + ",785,431" +  // Bend just below the 2.
            "L761,452" +
            "Q757,455" + ",757,459" +  // Bend by Greenwich.
            "L757,486" +
            "Q756,494" + ",745,498" +  // Bend by Lewisham.
            "L720,498" +
            "Q715,497" + ",711,494" +  // Bend right of Forest Hill.
            "L695,480" +
            "Q692,478" + ",688,478" +  // Bend right of Brockley.
            "L634,478" +
            "Q630,479" + ",627,482" +  // Bend left of Brockley.
            "L595,512" +
            "Q592,515" + ",586,515" +  // Bend below and to the right of Denmark Hill.
            "L417,515" +
            "Q412,515" + ",410,513" +  // Bend left of Clapham South.
            "L337,446" +
            "Q334,443" + ",327,443" +  // Bend at East Putney.
            "L304,443" +
            "Q300,442" + ",298,440" +  // Bend left of East Putney.
            "L225,373" +
            "Q223,370" + ",223,365" +  // Bend at Turnham Green.
            "L223,360" +
            "Q223,356" + ",226,353" +  // Bend just above Turnham Green.
            "L242,339" +
            "Q245,336" + ",245,330" +  // Bend right of South Action.
            "L245,221" +
            "Q245,215" + ",248,213" +  // Bend left of Kilburn Park.
            "L275,188" +
            "Q277,186" + ",280,186" +  // Bend left of Willesden Junction.
            "L289,186" +
            "Q294,186" + ",296,183" +  // Bend right of Willesden Junction.
            "L312,169" +
            "Q315,166" + ",320,166" +  // Bend above Kensal Rise.
            "L400,166" +
            "Q405,166" + ",408,163" +  // Bend right of Willesden Green.
            "L425,147" +
            "Q428,145" + ",432,145" +  // Bend left of Hampstead.
            "L465,145" +
            "Q469,145" + ",473,141" +  // Bend at Hampstead.
            "L483,132" +
            "Q486,130" + ",490,130";  // Bend above Hampstead Heath.
        var zone2Inner =
            "M333,245" +  // Below Paddington.
            "C316,245" + ",316,219" + ",336,218" +  // Bend around the left of Paddington.
            "L517,218" +
            "Q520,218" + ",523,216" +  // Bend below Morning Crescent.
            "L535,205" +
            "Q537,203" + ",541,203" +  // Bend above King's Cross.
            "L583,203" +
            "Q588,203" + ",590,205" +  // Bend below and left of Caledonian Road.
            "L627,239" +
            "Q629,241" + ",635,242" +  // Bend above and right of Old Street.
            "L694,242" +
            "Q703,244" + ",705,251" +  // Bend at Hoxton.
            "L705,275" +
            "Q705,278" + ",702,281" +  // Bend above and left of Stepney Green.
            "L696,287" +
            "Q693,289" + ",693,293" +  // Bend above and left of Whitechapel.
            "L693,341" +
            "Q693,349" + ",683,349" +  // Bend left of Wapping.
            "Q676,350" + ",676,352" +
            "Q676,355" + ",669,355" +
            "L656,355" +
            "Q653,355" + ",649,359" +  // Bend above Bermondsey.
            "L555,444" +
            "Q552,446" + ",546,446" +  // Bend right of Elephant and Castle.
            "L437,446" +
            "Q431,446" + ",427,442" +  // Bend left of Vauxhall.
            "L344,367" +
            "Q342,364" + ",342,360" +  // Bend at Earl's Court.
            "L342,315" +
            "Q342,311" + ",345,309" +  // Bend left of High Street Kensington.
            "L349,306" +
            "Q351,304" + ",351,299" +  // Bend below Notting Hill Gate.
            "L351,286" +
            "Q351,281" + ",346,279" +  // Bend above Notting Hill Gate.
            "Q342,276" + ",342,270" +  // Bend left of Bayswater.
            "L342,271" +
            "L342,257" +
            "Q342,246" + ",333,245";  // Bend below Paddington.
        return zone2Outer + zone2Inner;
    }

    function create_zone_4()
    {
        var zone4Outer =
            "M302,588" +  // Bottom left corner of outside ring.
            "L175,475" +
            "L82,390" +
            "Q78,387" + ",78,382" +  // Bend left of Osterley.
            "L78,224" +
            "Q78,220" + ",81,217" +  // Bend left of Greenford.
            "L147,157" +
            "Q151,154" + ",155,154" +  // Bend left of Sudbury Hill.
            "L215,154" +
            "Q219,154" + ",223,151" +  // Bend below West Harrow.
            "L270,108" +
            "Q273,106" + ",276,106" +  // Bend above Northwick Park.
            "L367,106" +
            "Q371,106" + ",375,102" +  // Bend below and left of Edgware.
            "L431,51" +
            "Q435,47" + ",440,47" +  // Bend below and left of the top 5.
            "L638,47" +
            "Q642,47" + ",645,49" +  // Bend left of Oakwood.
            "L662,64" +
            "Q665,67" + ",669,67" +  // Bend right of Southgate.
            "L863,67" +
            "Q869,67" + ",871,69" +  // Bend above Grange Hill.
            "L881,78" +
            "Q884,81" + ",884,85" +  // Bend right of Hainault.
            "L884,203" +
            "Q884,206" + ",887,209" + // Bend above Upney.
            "L995,307" +
            "L995,416" +
            "L902,501" +
            "Q899,504" + ",894,504" +  // Bend below bottom right 4.
            "L843,504" +
            "Q839,504" + ",836,506" +
            "L798,541" +
            "Q794,544" + ",789,544" +
            "L649,544" +
            "Q645,544" + ",641,548" +  // Bend left of West Croydon.
            "L600,585" +
            "Q597,588" + ",592,588" +  // Bend left of bottom 5.
            "L302,588";
        var zone4Inner =
            "M480,564" +
            "L360,564" +
            "L265,481" +
            "Q262,478" + ",262,475" +  // Bend to right of bottom left 4.
            "L262,445" +
            "Q262,441" + ",258,438" +  // Bend below bottom left 3.
            "L235,417" +
            "Q232,414" + ",229,414" +  // Bend to left of bottom left 3.
            "L213,414" +
            "Q210,414" + ",205,409" +  // Bend at Kew Gardens.
            "L168,375" +
            "Q165,373" + ",162,373" +  // Bend below and right of Northfields.
            "L134,373" +
            "Q130,373" + ",126,370" +  // Bend below and left of Northfields.
            "L108,354" +
            "Q106,351" + ",106,348" +  // Bend below and right of leftmost 4.
            "L106,275" +
            "Q106,272" + ",109,269" +  // Bend above and right of leftmost 4.
            "L227,162" +
            "Q229,160" + ",233,160" +  // Bend left of Stonebridge Park.
            "L316,160" +
            "Q320,160" + ",323,157" +  // Bend right of Stonebridge Park.
            "L370,115" +
            "Q373,112" + ",376,112" +  // Bend left of Hendon Central.
            "L497,112" +
            "Q501,112" + ",505,109" +  // Bend below and right of the top 4.
            "L514,101" +
            "Q516,99" + ",520,99" +  // Bend left of East Finchley.
            "L590,99" +
            "Q594,99" + ",597,96" +  // Bend right of East Finchley.
            "L605,89" +
            "Q608,87" + ",612,87" +  // Bend left of Bounds Green.
            "L726,87" +
            "Q730,87" + ",734,89" +  // Bend above South Tottenham.
            "L802,151" +
            "Q805,154" + ",809,154" +  // Bend at Leytonstone.
            "L843,154" +
            "Q846,154" + ",849,155" +  // Bend above Leytonstone High Road.
            "L868,172" +
            "Q870,174" + ",870,177" +  // Bend right of Leytonstone High Road.
            "L870,214" +
            "Q870,216" + ",868,218" +  // Bend at Woodgrange Park.
            "L862,223" +
            "Q854,231" + ",862,241" +  // Bend left of Barking.
            "L959,329" +
            "Q962,331" + ",962,335" +  // Bend below rightmost 4.
            "L962,388" +
            "Q962,391" + ",959,395" +  // Bend right of Beckton.
            "L879,468" +
            "Q875,471" + ",870,471" +  // Bend above and left of bottom right 4.
            "L827,471" +
            "Q823,471" + ",819,474" +  // Bend right of Deptford Bridge.
            "L781,509" +
            "Q778,512" + ",774,512" +  // Bend below and left of Lewisham.
            "L660,512" +
            "Q656,512" + ",653,514" +  // Bend above Penge West.
            "L601,561" +
            "Q597,564" + ",592,564" +  // Bend below and left of Crystal Palace.
            "L480,564";
        return zone4Outer + zone4Inner;
    }

    function create_zone_6()
    {
        var zone6Right =
            "M702,7" +  // Top left corner of the right portion of zone 6.
            "L995,7" +
            "L995,255" +
            "L902,171" +
            "Q899,168" + ",899,163" +  // Bend left of Hornchurch.
            "L899,70" +
            "Q899,66" + ",895,63" +  // Bend right of the 5.
            "L889,58" +
            "Q886,56" + ",882,56" +  // Bend above the 5.
            "L761,56" +
            "Q755,56" + ",752,53" +  // Bend left of Loughton.
            "L702,7";
        var zone6Left =
            "M399,7" +  // Corner above the top left 6.
            "L436,7" +
            "L363,74" +
            "Q359,77" + ",355,77" +  // Bend left of Edgware.
            "L225,77" +
            "Q221,77" + ",219,79" +  // Bend right of Northwood.
            "L193,102" +
            "Q190,105" + ",185,105" +  // Bend right of Pinner.
            "L121,105" +
            "Q117,105" + ",114,108" +  // Bend above Ruislip Gardens.
            "L45,171" +
            "Q42,173" + ",42,178" +  // Bend left of Northolt.
            "L42,376" +
            "Q42,379" + ",45,383" +  // Bend below the left 6.
            "L135,465" +
            "L274,588" +
            "L1,588" +
            "L1,133" +
            "L69,71" +
            "Q72,68" + ",77,68" +  // Bend above Hillingdon.
            "L328,68" +
            "Q333,68" + ",337,64" +  // Bend above Stanmore.
            "L399,7";
        return zone6Right + zone6Left;
    }

    function create_zone_8()
    {
        var zone8 =
            "M2,113" +
            "L85,36" +
            "Q88,34" + ",88,30" +  // Bend just below the 9.
            "L88,7" +
            "L214,7" +
            "L240,31" +
            "Q243,33" + ",246,33" +  // Bend to the left of Watford Junction.
            "L308,33" +
            "Q311,33" + ",314,31" +  // Bend to the right of Watford Junction.
            "L339,7" +
            "L370,7" +
            "L321,52" +
            "Q317,55" + ",313,55" +  // Bend to the right of Bushey.
            "L257,55" +
            "Q251,55" + ",249,52" +  // Bend to the left of Bushey.
            "L211,17" +
            "Q207,15" + ",204,15" +  // Bend to the right of the 7.
            "L179,15" +
            "Q172,15" + ",170,17" +  // Bend to the left of the 7.
            "L139,45" +
            "Q133,49" + ",129,49" +  // Bend at Chorleywood.
            "L88,49" +
            "Q83,49" + ",80,52" +  // Bend a little farther below the 9 than the first one.
            "L2,123" +
            "L2,113"
            ;
        return zone8;
    }
});
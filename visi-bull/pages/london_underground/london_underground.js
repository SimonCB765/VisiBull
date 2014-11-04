$(document).ready(function()
{
    // Setup the SVG element.
    var svgWidth = 1000;
    var svgHeight = 640;
    var underground = d3.select("#underground")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    /******************
    * Draw the zones. *
    ******************/
    /*
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
    */

    /*************************
    * Draw the zone numbers. *
    *************************/
    /*
    // Draw the special fare.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "specialFare": true})
        .attr("x", "278")
        .attr("y", "19")
        .text("Special fares apply")
    // Draw the 9.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "79.5")
        .attr("y", "34")
        .text("9")
    // Draw the 8s.
    underground.append("text")
        .classed({"evenZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "135,332.5")
        .attr("y", "34,34")
        .text("88")
    // Draw the 7s.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "191,365")
        .attr("y", "34,34")
        .text("77")
    // Draw the 6s.
    underground.append("text")
        .classed({"evenZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "29,396.5,902")
        .attr("y", "321,34,53")
        .text("666")
    // Draw the 5s.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "59,150,471,655,881")
        .attr("y", "321,473,34,584,73")
        .text("55555")
    // Draw the 4s.
    underground.append("text")
        .classed({"evenZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "92,211,471,475,834,898,954")
        .attr("y", "321,447,86,584,112.5,483.5,313")
        .text("4444444")
    // Draw the 3s.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "136,255,471,475,750,843,875")
        .attr("y", "321,429,131,543,188.5,449,313")
        .text("3333333")
    // Draw the 2s.
    underground.append("text")
        .classed({"evenZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "301,308.5,471,475,713.5,740,779")
        .attr("y", "321,404.5,199.5,465,234.5,313,408.5")
        .text("2222222")
    // Draw the 1s.
    underground.append("text")
        .classed({"oddZone": true, "sign": true, "zoneNumber": true})
        .attr("x", "394.5,475,631")
        .attr("y", "321,424,313")
        .text("111")
    */

    /*******************
    * Draw the Thames. *
    *******************/
    /*
    underground.append("path")
        .classed("thames", true)
        .attr("d", create_thames());
    */

    /******************
    * Draw the lines. *
    ******************/
    /*
    underground.append("path")
        .classed({"bakerloo": true, "line": true})
        .attr("d", create_line_bakerloo());
    underground.append("path")
        .classed({"central": true, "line": true})
        .attr("d", create_line_central());
    underground.append("path")
        .classed({"circle": true, "line": true})
        .attr("d", create_line_circle());
    underground.append("path")
        .classed({"district": true, "line": true})
        .attr("d", create_line_district());
    underground.append("path")
        .classed({"northern": true, "line": true})
        .attr("d", create_line_northern());
    underground.append("path")
        .classed({"victoria": true, "line": true})
        .attr("d", create_line_victoria());
    */



    underground
        .on("click", function() { console.log(d3.mouse(d3.select("body").node())); });
});

/*********************
* Create the Thames. *
*********************/
function create_thames()
{
    var thamesUpper =
        "M39,477" +  // Left side, top edge.
        "L187,477" +
        "Q192,477" + ",192,471" +  // Bend right of bottom left 5.
        "L192,412" +
        "Q192,402" + ",202,401" +  // Bend left of Gunnersbury.
        "L253,401" +
        "Q256,401" + ",259,403" +  // Bend right of Gunnersbury.
        "L288,430" +
        "Q291,433" + ",293,433" +  // Bend left of Putney Bridge.
        "L438,433" +
        "Q442,433" + ",442,428" +  // Bend below Pimlico.
        "L442,384" +
        "Q442,376" + ",452,375" +  // Bend below Westminster.
        "L552,375" +
        "Q556,375" + ",559,372" +  // Bend below Embankment.
        "L583,351" +
        "Q586,349" + ",591,349" +  // Bend right of Blackfriars.
        "L701,349" +
        "Q712,349" + ",713,360" +  // Bend below Wapping.
        "L713,424" +
        "Q713,427.5" + ",716,427.5" +  // Bend left of Island Gardens.
        "L759,427.5" +
        "Q762,427.5" + ",762,424" +  // Bend right of Island Gardens.
        "L762,361" +
        "Q763,352" + ",774,351" +  // Bend below ad left of West India Quay.
        "L832,351" +
        "C838,351" + ",843,356" + ",843,362" +  // Bend left of West Silvertown.
        "L843,404" +
        "Q843,407.5" + ",846,407.5" + // Bend left of King George V.
        "L959,407.5";
    var thamesLower =
        "L959,416" +
        "L846,416" +
        "C839,416" + ",834,409" + ",834,404" +  // Bend above bottom right 3.
        "L834,362" +
        "Q834,358.5" + ",830,358.5" +  // Bend right of Emirates Greenwich Peninsula.
        "L774,358.5" +
        "Q770.5,358.5" + ",770.5,361" +  // Bend left of North Greenwich.
        "L770.5,424" +
        "C770.5,429" + ",765,435" + ",760,435" +  // Bend right of Cutty Sark for Maritime Greenwich.
        "L715,435" +
        "C710,435" + ",704.5,430" + ",704.5,425" +  // Bend above and right of New Cross.
        "L704.5,358" +
        "Q704.5,355" + ",700,355" +  // Bend right of Rotherhithe.
        "L590,355" +
        "Q588,355" + ",587,356" +  // Bend above and left of London Bridge.
        "L561,379" +
        "Q558,381" + ",554,381" +  // Bend above and right of Southwark.
        "L453,381" +
        "Q449,381" + ",449,385" +  // Bend left of Waterloo.
        "L449,428" +
        "C449,433" + ",444,437.5" + ",438,437.5" +  // Bend above Vauxhall.
        "L292,437.5" +
        "Q288,437.5" + ",285,434" +  // Bend left of East Putney.
        "L256,408" +
        "Q254,406.5" + ",252,406.5" +  // Bend above bottom left 3.
        "L203,406.5" +
        "Q197.5,406.5" + ",197.5,413" +  // Bend above and left of Kew Gardens.
        "L197.5,473" +
        "C197.5,478" + ",192,482" + ",187,482" +  // Bend below and left of bottom left 4.
        "L39,482" +
        "L39,477";
    return thamesUpper + thamesLower;
}

/***************************
* Line creation functions. *
***************************/
function create_line_bakerloo()
{
    var line =
        "M288,97" +
        "L288,211" +
        "Q288,213.9" + ",290,216" +  // Bend at Kilburn Park.
        "L309,233.3" +
        "Q311,235.5" + ",316,235.8" +  // Bend at Warwick Avenue.
        "L405,235.8" +
        "Q408.1,235.8" + ",411,238" +  // Bend right of Marylebone.
        "L453.9,277.2" +
        "Q457,280" + ",457,283" +  // Bend above Oxford Circus.
        "L457,299" +
        "Q457,302.5" + ",459,305" +  // Bend below Oxford Circus.
        "L505.8,347.3" +
        "Q509.2,350" + ",509.1,354" +  // Bend below an right of Charing Cross.
        "L509.1,430" +
        "Q509.1,434" + ",511,436" +  // Bend below Lambeth North.
        "L522.2,446.2";
    return line;
}

function create_line_central()
{
    var topLeft =  // Line portion starting in the top left of the image.
        "M122.8,80" +
        "L122.8,198" +
        "Q123,201" + ",125.5,203" +  // Bend by Greenford.
        "L222,291" +
        "Q225,294" + ",232,294";  // Bend between West and North Acton.
    var left =  // Line portion starting at the left of the image.
        "M160,294" +
        "L556,294" +
        "Q559,294" + ",561.7,296" +  // Bend by Chancery Lane.
        "L573.3,306.7" +
        "Q576,309.5" + ",580,309.8" +  // Bend left of Bank.
        "L610,309.8" +
        "Q614,309.7" + ",616.5,307.2" +  // Bend right of Bank.
        "L664,263.9" +
        "Q666.9,260.7" + ",672.5,260.8" +  // Bend left of Shoreditch High Street.
        "L745,260.8" +
        "Q749.3,261" + ",752.4,258" +  // Bend at Mile End.
        "L817.4,199.5" +
        "Q819.4,197" + ",819.4,194" +  // Bend below Leyton.
        "L819.4,23.5";
    var loop =  // The loop in the top right of the image.
        "M819.4,145" +
        "Q821,140.5" + ",825,140.7" +  // Bend left of Wanstead.
        "L873,140.7" +
        "Q878.2,140.5" + ",878.2,135" +  // Bend right of Gants Hill.
        "L878.2,85" +
        "Q877.6,80.8" + ",873.4,80.5" +  // Bend above Hainault.
        "L825,80.5" +
        "Q819.5,81" + ",819.4,85";  // Bend left of Roding Valley.
    return topLeft + left + loop;
}

function create_line_circle()
{
    var line =
        "M290,351" +
        "L290,277" +
        "Q289.8,274" + ",293,271.4" +  // Bend at Latimer Road.
        "L320.4,246.4" +
        "Q323,244.3" + ",327,244.4" +  // Bend above and left of Royal Oak.
        "H557" +
        "Q560.1,244.2" + ",562.9,246.1" +  // Bend above and left of Farringdon.
        "L593.1,273.7" +
        "Q596,276" + ",600,275.9" +  // Bend at Moorgate.
        "H657" +
        "C660.5,276.4" + ",663.4,278.5" + ",664.1,282.9" +  // Bend right of Liverpool Street.
        "V319" +
        "Q663.9,325.9" + ",654.5,326.2" +  // Bend right of Tower Hill.
        "H597" +
        "Q593,326.2" + ",591.2,328.1" +  // Bend left of Monument.
        "L556.9,359.3" +
        "Q554.5,361.9" + ",551,361.6" +  // Bend at Temple.
        "H360" +
        "Q352.6,361" + ",352.3,353.6" +  // Bend left of South Kensington.
        "V257" +
        "Q353.4,250.6" + ",360,250.4" +  // Bend at Paddington.
        "H382";
    return line;
}

function create_line_district()
{
    var topPath =  // Part of line starting at Ealing Broadway.
        "M160,296.2" +
        "H167" +
        "Q174,296.8" + ",174.8,303" +  // Bend to the right of Ealing Broadway.
        "V348" +
        "Q174.7,351.2" + ",176.9,354.1" +  // Bend above and left of Acton Town.
        "L186,362.1" +
        "Q188,364" + ",192,364" +  // Bend left of Chiswick Park.
        "H343" +
        "C346,364" + ",349.9,360.2" + ",349.8,356" +  // Bend right of Earl's Court.
        "V257.5" +
        "C350.1,252.5" + ",354,248.3" + ",359.5,248.2" +  // Bend at Paddington.
        "H382.2";
    var topSpur =  // Part of the line starting at Kensington (Olympia).
        "M333.1,333" +
        "V356" +
        "Q333.2,363.9" + ",343,364";  // Bend left of Earl's Court.
    var bottomPath =  // Part of line starting at Richmond.
        "M209.3,427" +
        "V371" +
        "Q209.6,364.1" + ",219,364" +  // Bend left of Turnham Green.
        "H552" +
        "Q555.5,364" + ",558.4,361.1" +  // Bend right of Embankment.
        "L592.6,330" +
        "Q595,328.2" + ",597,328.4" +  // Bend left of Monument.
        "H659" +
        "Q663.7,328.7" + ",667.6,325" +  // Bend right of Tower Hill.
        "L725.8,272" +
        "Q728.2,270" + ",733,270" +  // Bend left of Bow Street.
        "H825" +
        "Q829.1,270.3" + ",832.2,267.2" +  // Bend below and left of Plaistow.
        "L956.2,154.3";
    var bottomSpur =  // Part of Line starting at Wimbledon.
        "M333.1,476.2" +
        "V371" +
        "Q333.5,364.2" + ",343,364";  // Bend left of Earl's Court.
    return topPath + topSpur + bottomPath + bottomSpur;
}

function create_line_northern()
{
    var leftPath =
        "M396,74.9" +
        "L516,184.2" +
        "Q519.2,187.1" + ",519.2,189.8" +  // Bend above Camden Town.
        "V197" +
        "Q519.2,199" + ",516.8,201.7" +  // Bend below Camden Town.
        "Q513.9,204.1" + ",514.2,209" +
        "V230" +
        "Q514.4,233.5" + ",511.5,236.2" +  // Bend at Euston.
        "L504,243" +
        "Q501.5,245" + ",501.6,249" +  // Bend above Warren Street.
        "V460" +
        "Q501.7,464.6" + ",498.2,467.7";  // Bend at Kennington.
    var rightPath =
        "M552.6,40" +
        "V153" +
        "Q552.7,156.2" + ",550.1,158.9" +  // Bend at Kentish Town.
        "L522.2,184.3" +
        "Q519.3,187.1" + ",519.2,189.5" +  // Bend above Camden Town.
        "V197" +
        "Q519.2,199" + ",521.6,201.7" +  // Bend below Camden Town.
        "Q524.3,204.1" + ",524.3,209" +
        "V230" +
        "Q524.6,236.7" + ",532.1,237.4" +  // Bend at Euston.
        "H594.5" +
        "Q601,238.3" + ",601.9,244" +  // Bend above Old Street
        "V369" +
        "Q602.1,373.2" + ",599,376" +  // Bend at London Bridge.
        "L384.6,571.1";
    var topRightSpur =
        "M534.8,69.3" +
        "L549.2,82.4" +
        "Q552.6,85" + ",552.6,89.1";  // Bend onto the right path.
    return leftPath + rightPath + topRightSpur;
}

function create_line_victoria()
{
    var line =
        "M507.5,504.5" +
        "L437.5,441" +
        "Q435.5,438.9" + ",435.5,436" +  // Bend above Vauxhall.
        "L435.5,317" +
        "Q435.5,313.5" + ",438.5,310.7" +  // Bend at Green Park.
        "L527,230" +
        "Q529,228" + ",534,227.9" +  // Bend left of King's Cross.
        "L612,227.9" +
        "Q615,227.9" + ",618.1,225.1" +  // Bend right of King,s Cross.
        "L630.3,214" +
        "Q633.1,211.1" + ",632.9,208" +  // Bend below Caledonian Road & Barnsbury.
        "L632.9,173" +
        "Q632.9,170.2" + ",635.4,167.4" +  // Bend above Highbury % Islington.
        "L666.3,139.3" +
        "Q669,137.4" + ",672,137.4" +  // Bend left of Seven Sisters.
        "L766,137.4";
    return line;
}

/***************************
* Zone creation functions. *
***************************/
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
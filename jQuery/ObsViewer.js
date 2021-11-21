/* Code written by Bryan Guarente for possible inclusion on MetEd */
{
    var state = "CO";
    var radius = 5;
    
    var width = 996,
        height = 596;

    var dateSelect;

    // grabbed dictionary from MetPy for these METAR codes and the numeric present weather values.
    // WMO offers an SVG library of the present weather symbols here: https://github.com/OGCMetOceanDWG/WorldWeatherSymbols
    const wx_code_map = {'': 0, 'M': 0, 'TSNO': 0, 'VA': 4, 'FU': 4,
    'HZ': 5, 'DU': 6, 'BLDU': 1007, 'SA': 1007,
    'BLSA': 1007, 'VCBLSA': 1007, 'VCBLDU': 1007, 'BLPY': 1007,
    'PO': 8, 'VCPO': 8, 'VCDS': 9, 'VCSS': 9,
    'BR': 10, 'BCBR': 10, 'BC': 11, 'MIFG': 12,
    'VCTS': 13, 'VIRGA': 14, 'VCSH': 16, 'TS': 17,
    'THDR': 17, 'VCTSHZ': 17, 'TSFZFG': 17, 'TSBR': 17,
    'TSDZ': 17, 'VCTSUP': 17, '-TSUP': 17, 'TSUP': 17, '+TSUP': 17,
    'SQ': 18, 'FC': 19, '+FC': 19,
    'DS': 31, 'SS': 31, 'DRSA': 31, 'DRDU': 31,
    '+DS': 34, '+SS': 34, 'DRSN': 36, '+DRSN': 37,
    '-BLSN': 38, 'BLSN': 38, '+BLSN': 39, 'VCBLSN': 38,
    'VCFG': 40, 'BCFG': 41, 'PRFG': 44,
    'FG': 45, 'FZFG': 49, '-VCTSDZ': 51, '-DZ': 51,
    '-DZBR': 51, 'VCTSDZ': 53, 'DZ': 53, '+VCTSDZ': 55,
    '+DZ': 55, '-FZDZ': 56, '-FZDZSN': 56, 'FZDZ': 57,
    '+FZDZ': 57, 'FZDZSN': 57, '-DZRA': 58, 'DZRA': 59,
    '+DZRA': 59, '-RA': 61, '-RABR': 61, 'RA': 63, 'RABR': 63, 'RAFG': 63,
    'VCRA': 63, '+RA': 65, '-FZRA': 66, '-FZRASN': 66,
    '-FZRABR': 66, '-FZRAPL': 66, '-FZRASNPL': 66, 'TSFZRAPL': 67,
    '-TSFZRA': 67, 'FZRA': 67, '+FZRA': 67, 'FZRASN': 67,
    'TSFZRA': 67, '-DZSN': 68, '-RASN': 68, '-SNRA': 68,
    '-SNDZ': 68, 'RASN': 69, '+RASN': 69, 'SNRA': 69,
    'DZSN': 69, 'SNDZ': 69, '+DZSN': 69, '+SNDZ': 69,
    '-SN': 71, '-SNBR': 71, 'SN': 73, '+SN': 75,
    '-SNSG': 77, 'SG': 77, '-SG': 77, 'IC': 78,
    '-FZDZPL': 79, '-FZDZPLSN': 79, 'FZDZPL': 79, '-FZRAPLSN': 79,
    'FZRAPL': 79, '+FZRAPL': 79, '-RAPL': 79, '-RASNPL': 79,
    '-RAPLSN': 79, '+RAPL': 79, 'RAPL': 79, '-SNPL': 79,
    'SNPL': 79, '-PL': 79, 'PL': 79, '-PLSN': 79,
    '-PLRA': 79, 'PLRA': 79, '-PLDZ': 79, '+PL': 79,
    'PLSN': 79, 'PLUP': 79, '+PLSN': 79, '-SH': 80,
    '-SHRA': 80, 'SH': 81, 'SHRA': 81, '+SH': 81,
    '+SHRA': 81, '-SHRASN': 83, '-SHSNRA': 83, '+SHRABR': 84,
    'SHRASN': 84, '+SHRASN': 84, 'SHSNRA': 84, '+SHSNRA': 84,
    '-SHSN': 85, 'SHSN': 86, '+SHSN': 86, '-GS': 87,
    '-SHGS': 87, 'FZRAPLGS': 88, '-SNGS': 88, 'GSPLSN': 88,
    'GSPL': 88, 'PLGSSN': 88, 'GS': 88, 'SHGS': 88,
    '+GS': 88, '+SHGS': 88, '-GR': 89, '-SHGR': 89,
    '-SNGR': 90, 'GR': 90, 'SHGR': 90, '+GR': 90, '+SHGR': 90,
    '-TSRASN': 95, 'TSRASN': 95, '-TSSNRA': 95, 'TSSNRA': 95, '-VCTSRA': 1095,
    '-TSRA': 1095, 'TSRA': 1095, '-TSDZ': 1095, 'VCTSRA': 1095,
    'TSPL': 2095, '-TSSN': 2095, '-TSPL': 2095, 'TSSN': 2095, '-VCTSSN': 2095,
    'VCTSSN': 2095, 'TSPLSN': 2095, 'TSSNPL': 2095, '-TSSNPL': 2095,
    '-TSRAGR': 96, 'TSRAGS': 96, 'TSRAGR': 96, 'TSGS': 96, 'TSGR': 96,
    '+TSFZRAPL': 97, '+VCTSRA': 1097, '+TSRA': 1097, '+TSFZRA': 1097,
    '+TSSN': 2097, '+TSPL': 2097, '+TSPLSN': 2097, '+VCTSSN': 2097,
    'TSSA': 98, 'TSDS': 98, 'TSDU': 98,
    '+TSGS': 99, '+TSGR': 99, '+TSRAGS': 99, '+TSRAGR': 99,
    'IN': 141, '-UP': 141, 'UP': 141, '+UP': 142,
    '-FZUP': 147, 'FZUP': 147, '+FZUP': 148
    }
    
    $("#myDate").on("change", function () { // currently does nothing.
        dateSelect = $("#myDate").val();
        dateSelect = new Date(dateSelect);
//        getObs(state);
    });

    $("#tempUnits").on("change", function () {
        tUnits = $("#tempUnits").val();
        $(".t, .td").each(function (){
            var curUnits = $(this).attr("data-tUnits");
            if (tUnits != curUnits) {
                $(this).attr("data-tUnits", tUnits);
                var unitLtr = tUnits[0].toUpperCase();
                var newValue = function () {
                    if ($(this).attr("data-t" + unitLtr) == null || $(this).attr("data-t" + unitLtr) == "M" ) {
                        return "M"
                    } else {
                        return Math.round($(this).attr("data-t" + unitLtr))
                    }
                };
                $(this).text(newValue);
            }
        })
    });

    $("#windUnits").on("change", function () {
        wUnits = $("#windUnits").val();
        $(".windbarb").each(function (){
            var curUnits = $(this).attr("data-wUnits");
            if (wUnits != curUnits) {
                $(this).attr("data-wUnits", wUnits);
                var newValue = setWindBarbVal($(this),wUnits);
                $(this).attr("href", "#barb" + newValue);
            }
        })
    });

    function setWindBarbVal(obj,wUnits) {
        if (obj.attr("data-w" + wUnits) == null || obj.attr("data-w" + wUnits) == "M" ) {
            return 0
        } else {
            return round5(obj.attr("data-w" + wUnits))
        }
    }
    
    // set projection
//    var projection = d3.geo.equirectangular() // For D3 v3
    var projection = d3.geoEquirectangular()
        .scale(8000)
        .center([-105.55, 39.0])
        .translate([width / 2, height / 2]);
    
//    var zoom = d3.behavior.zoom() // For D3 v3
    var zoom = d3.zoom()
//        .translate([0, 0]) // For d3v3
//        .scale(1) // For d3v3
//        .scaleExtent([1, 15]) // For d3v3
        .scaleExtent([1, 15])
        .on("zoom", zoomed);
    
    // create path variable
//    var path = d3.geo.path() // For d3v3
    var path = d3.geoPath()
        .projection(projection);
    
    // create svg variable
    var svg = d3.select(".flex-container").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill","white");

    var mapdata = svg.append("g").attr("id","mapdata");
    
    svg
        .call(zoom); // delete this line to disable free zooming

    $("#Reset").on("click", resetView);

    function resetView() {
        svg.transition().call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
      }

    const barbsize = 20;
    makeBarbTemplates();
    
    var updategroup = mapdata.append("g").attr("id","updates");
    var bordersgroup = mapdata.append("g").attr("id","bordersgroup");
    var urbangroup = bordersgroup.append("g").attr("id","urban");
    var countiesgroup = bordersgroup.append("g").attr("id","counties");
    var riversgroup = bordersgroup.append("g").attr("id","rivers");
    var lakesgroup = bordersgroup.append("g").attr("id","lakes");
    var roadsgroup = bordersgroup.append("g").attr("id","roads");
    var obsgroup = mapdata.append("g").attr("id","obsgroup");

    d3.json("d3/counties.json")
    .then((data) => {
        counties = topojson.feature(data, data.objects.counties).features;
        countiesgroup.selectAll("path")
            .data(counties).enter()
            .append("path")
            .attr("class", function (d,i) {return "county " + d.properties.NAME;})
            .attr("d", path);
    })
    .catch((error) => {
        console.error("Error loading the data");
    });

    d3.json("d3/roads.json")
    .then((data) => {
        roads = topojson.feature(data, data.objects.roads).features;
        roadsgroup.selectAll("path")
            .data(roads).enter()
            .append("path")
            .attr("d", path)
            .style("fill","none")
            .style("stroke","#AAAAAA")
            .style("stroke-width",1);
    })
    .catch((error) => {
        console.error("Error loading the data");
    });

    d3.json("d3/urban.json")
    .then((data) => {
        urban = topojson.feature(data, data.objects.urban).features;
        urbangroup.selectAll("path")
            .data(urban).enter()
            .append("path")
            .attr("d", path)
            .style("fill","#eeeeee")
            .style("stroke","#aaaaaa")
            .style("stroke-width",.5)
            .attr("class","urban");
    })
    .catch((error) => {
        console.error("Error loading the data");
    });
    
    d3.json("d3/rivers.json")
    .then((data) => {
        rivers = topojson.feature(data, data.objects.rivers).features;
        riversgroup.selectAll("path")
            .data(rivers).enter()
            .append("path")
            .attr("d", path)
            .style("fill","none")
            .style("stroke","#a1a1da")
            .style("stroke-width",1.5)
            .attr("class","river");
    })
    .catch((error) => {
        console.error("Error loading the data");
    });

    d3.json("d3/lakes.json")
    .then((data) => {
        lakes = topojson.feature(data, data.objects.lakes).features;
        lakesgroup.selectAll("path")
            .data(lakes).enter()
            .append("path")
            .attr("d", path)
            .style("fill","#a1a1da")
            .style("stroke","#a1a1da")
            .style("stroke-width",1.5)
            .attr("class","lakes");
    })
    .catch((error) => {
        console.error("Error loading the data");
    });

    var points = [];
    var circles;
    var data = {};

    /* Code written by Bryan Guarente for possible inclusion on MetEd */

    function getObs_fromFile(stnList) {
        var promises = [];
        
        stnList.forEach(function(station) {
            promises.push(d3.json("./data/" + station).catch(function () {return "error reading file"}));
        });
        
        Promise.all(promises).then(function(response) {
//            console.log(response)
            var obs = response;
            plotObs(obs);
        });
    }

    function plotObs(obs) {
        for (const o in obs) {
            if (obs[o] == "error reading file") {
                console.log("error reading obs file... skipping.");
                continue;
            }
            var id = obs[o].properties.station;
            var lstSlash = id.lastIndexOf("/");
            id = id.slice(lstSlash+1)
//            console.log(id);
            $("#" + id).show();
            var groupID = "g" + id;
            var metar = obs[o].properties.rawMessage;
            var xLoc = projection(obs[o].geometry.coordinates)[0];
            var yLoc = projection(obs[o].geometry.coordinates)[1];

            obsgroup
            .append("g")
            .attr("id", groupID)
            .attr("data-stid",id)
            .on("mouseover",handleMouseOver)
            .on("mouseout",handleMouseOut)
            .data([obs[o]])
            .enter();

            obsgroup.selectAll("#"+groupID)
            .append("circle")
            .attr("cx", xLoc)
            .attr("cy", yLoc)
            .attr("r", radius)
            .attr("stroke","black")
            .attr("stroke-width","1")
            .attr("fill","black")
            .attr("class", function (d) {
                if (id.indexOf('COOP') > -1) {
                    return "obs COOP " + id
                } else if (id.search(/^A[0-9]/) > -1) {
                    return "obs A " + id
                } else if (id.search(/^B[0-9]/) > -1) {
                    return "obs B " + id
                } else if (id.search(/^C[0-9]/) > -1) {
                    return "obs C " + id
                } else if (id.search(/^D[0-9]/) > -1) {
                    return "obs D " + id
                } else if (id.search(/^E[0-9]/) > -1) {
                    return "obs E " + id
                } else if (id.search(/^F[0-9]/) > -1) {
                    return "obs F " + id
                } else {
                    return "obs " + id
                }
            });

// Add Temperature and Dewpoint Temperature
            d3.select("#" + groupID)
                .append("text")
                .attr("x", xLoc - 4*radius)
                .attr("y", yLoc - 2*radius)
                .attr("fill","red")
                .attr("font","bold")
                .attr("font-family","Arial")
                .attr("font-weight","bold")
                .attr("class","t")
                .attr("data-tUnits", "celsius")
                .attr("data-tC", function (d) {
                    var t = d.properties.temperature.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        return t
                    }
                })
                .attr("data-tK", function (d) {
                    var t = d.properties.temperature.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        return t+273.15
                    }
                })
                .attr("data-tF",function (d) {
                    var t = d.properties.temperature.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        t = 9/5*t+32;
                        return t
                    }
                })
                .text(function(d) { 
                    var t = d.properties.temperature.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        t = 9/5*t+32;
                        return Math.round(t)
                    }
                });

            d3.select("#" + groupID)
                .append("text")
                .attr("x", xLoc - 4*radius)
                .attr("y", yLoc + 3.5*radius)
                .attr("fill","green")
                .attr("font","bold")
                .attr("font-family","Arial")
                .attr("font-weight","bold")
                .attr("class","td")
                .attr("data-tUnits", "celsius")
                .attr("data-tC", function (d) {
                    var t = d.properties.dewpoint.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        return t;
                    }
                })
                .attr("data-tK", function (d) {
                    var t = d.properties.dewpoint.value;
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        return t+273.15;
                    }
                })
                .attr("data-tF",function (d) {
                    var t = d.properties.dewpoint.value;
                    if (t == null || t == "M") {
                        return "M";
                    } else {
                        t = 9/5*t+32;
                        return t
                    }
                })
                .text(function(d) { 
                    var t = d.properties.dewpoint.value; 
                    if (t == null || t == "M") {
                        return "M"
                    } else {
                        t = 9/5*t+32;
                        return Math.round(t)
                    }
                });

//Add rawMessage
            d3.select("#" + groupID)
                .append("text")
                .attr("x",xLoc+2*radius)
                .attr("y",yLoc-2*radius)
                .attr("class","metar")
                .text(metar);

            $(".metar").hide();
            

//Add present weather
            d3.select("#" + groupID)
                .append("use")
                .attr("class","preswx")
                .attr("href", function (d) {var code = getWxCode(d.properties.presentWeather); return "#preswx" + code})
                .attr("transform", function (d) {
                    var x = projection(d.geometry.coordinates)[0] - 6*radius;
                    var y = projection(d.geometry.coordinates)[1] - 2*radius;
                    return "translate(" + x + " " + y + ")"; 
                });

// Add Wind Barb            
            d3.select("#" + groupID)
                .append("use")
                .attr("class","windbarb inactivebarb")
                .attr("href", function (d) { var windSpd = round5(d.properties.windSpeed.value*0.539957); return "#barb" + windSpd; })
                .attr("transform", function (d) { 
                    var rot = d.properties.windDirection.value;
                    var rotInRads = Math.PI/180*rot;
                    var sine = radius * Math.sin(rotInRads);
                    var cosine = radius * Math.cos(rotInRads);
                    var xLoc = projection(d.geometry.coordinates)[0]; 
                    var yLoc = projection(d.geometry.coordinates)[1];

                    if (rot == null) {
                        xLoc = xLoc;
                        yLoc = yLoc;
                        rot = 0;
                    } else if (rot == 0) {
                        yLoc = yLoc + cosine;
                    } else if (rot > 0 && rot < 90) {
                        xLoc = xLoc - sine;
                        yLoc = yLoc + cosine;
                    } else if (rot == 90) {
                        xLoc = xLoc - sine;
                    } else if (rot > 90 == rot < 180) {
                        xLoc = xLoc - sine;
                        yLoc = yLoc + cosine;
                    } else if (rot == 180) {
                        yLoc = yLoc + cosine;
                    } else if (rot > 180 == rot < 270) {
                        xLoc = xLoc - sine;
                        yLoc = yLoc + cosine;
                    } else if (rot == 270) {
                        xLoc = xLoc - sine;
                    } else if (rot > 270 == rot < 360) {
                        xLoc = xLoc - sine;
                        yLoc = yLoc + cosine;
                    } else if (rot == 360) {
                        yLoc = yLoc + cosine;
                    } else { // greater than 360
                        xLoc = xLoc - sine;
                        yLoc = yLoc + cosine;
                    }
                    return "translate(" + xLoc + " " + yLoc + ") rotate(" + rot + ")"; 
                })
                .attr("stroke", "black")
                .attr("stoke-width", "1px")
                .attr("fill", "black")
                .attr("data-wUnits", function (d) {
                    var wUnits = d.properties.windSpeed.unitCode;
                    wUnits = wUnits.split(":");
                    wUnits = wUnits[1];
                    if (wUnits == "km_h-1") {
                        wUnits = "kph";
                    } else if (wUnits == "m_s-1") {
                        wUnits = "ms";
                    } else if (wUnits == "kts") {
                        wUnits = "kts";
                    } else if (wUnits == "m_h-1") {
                        wUnits = "mph";
                    } else {

                    }
                    return "kts" // Forced kts initially.
                })
                .attr("data-wkph", function (d) {
                    var windSpd = d.properties.windSpeed.value;
                    return windSpd
                })
                .attr("data-wmph", function (d) {
                    var windSpd = d.properties.windSpeed.value*0.621371;
                    return windSpd
                })
                .attr("data-wkts", function (d) {
                    var windSpd = d.properties.windSpeed.value*0.539957;
                    return windSpd
                })
                .attr("data-wms", function (d) {
                    var windSpd = d.properties.windSpeed.value*0.277778;
                    return windSpd
                });

// Add Okta
            d3.select("#" + groupID)
                .append("use")
                .attr("class","okta")
                .attr("href", function (d) { 
                    var oktaArr = d.properties.cloudLayers;
                    for (const c in oktaArr) {
                        var amt = oktaArr[c].amount;
//                        console.log(amt);
                    }
                    if (amt == "SKC" || amt == "NSC" || amt == "CLR" || amt == "NCD") {
                        okta = 0;
                    } else if (amt == "FEW") {
                        okta = 2;
                    } else if (amt == "SCT") {
                        okta = 4;
                    } else if (amt == "BKN") {
                        okta = 6;
                    } else if (amt == "OVC") {
                        okta = 8;
                    } else if (amt == "VV") {
                        okta = 9;
                    } else {
                        okta = 10;
                    }

                    return "#okta" + okta; })
                .attr("transform", function (d) { 
                    var xLoc = projection(d.geometry.coordinates)[0]-radius; 
                    var yLoc = projection(d.geometry.coordinates)[1]-radius;
                    return "translate(" + xLoc + " " + yLoc + ")"; 
                });

//add Station ID
            d3.select("#g" + id)
                .append("text")
                .attr("x", xLoc + 3*radius)
                .attr("y", yLoc + 3*radius)
                .attr("font-family","Arial")
                .attr("fill","gray")
                .attr("font-size","10px")
                .attr("font-weight","bold")
                .attr("class","stationID")
                .text(id);
        }
    }

    function getWxCode(wxObj) {
//        console.log(wxObj);
        var str = "";
        for (const pw in wxObj) {
            str = str+wxObj[pw].rawString;
        }
//        console.log(str);
        var code = wx_code_map[str];
        return code;
    }

    function getObs(stid) {
        var settings = {
        "url": "https://api.weather.gov/stations/KDEN/observations/latest",
        "method": "GET",
        "timeout": 0,
        "accept": "application/geo+json",
        "User-Agent": "(meted.ucar.edu, guarente@ucar.edu)"
        };
        
        $.ajax(settings)
            .done(function (response) {
/*                $(".updateText").remove();
                $(".lastUpdate").text("Last Update: " + new Date().toLocaleString());*/
                obs = response;
//                console.log(obs);
                
                obsgroup.selectAll("circle")
                    .data([obs]).enter()
                    .append("g")
                    .append("circle")
                    .attr("cx", function (d) { 
//                        console.log(d.geometry.coordinates[0]);
                        xloc = projection(d.geometry.coordinates)[0];
                        return xloc;
                    })
                    .attr("cy", function (d) { 
//                        console.log(d.geometry.coordinates[1]);
                        yloc = projection(d.geometry.coordinates)[1];
                        return yloc; 
                    })
                    .attr("r", radius)
                    .attr("class", "obs");
    
                obsgroup.selectAll("g")
                    .data([obs])
                    .append("use")
                    .attr("class","okta")
                    .attr("href", function (d) { var rando = Math.floor(Math.random() * 10) + 1; return "#okta" + rando; })
                    .attr("transform", function (d) { 
                        var xLoc = projection(d.geometry.coordinates)[0] - radius; 
                        var yLoc = projection(d.geometry.coordinates)[1] - radius; 
                        return "translate(" + xLoc + " " + yLoc + ")"; 
                    });
        
                obsgroup.selectAll("g")
                    .data([obs]).enter()
                    .append("use")
                    .attr("class","windbarb inactivebarb")
                    .attr("href", function (d) { var windSpd = round5(d.properties.windSpeed.value); console.log(windSpd); return "#barb" + windSpd; })
                    .attr("transform", function (d) { 
//                        console.log(d.properties.windDirection.value);
//                        console.log(d.properties.windSpeed.value);

                        var rot = d.properties.windDirection.value;
                        var rotInRads = Math.PI/180*rot;
                        var sine = radius * Math.sin(rotInRads);
                        var cosine = radius * Math.cos(rotInRads);
                        var xLoc = projection(d.geometry.coordinates)[0] - radius; 
                        var yLoc = projection(d.geometry.coordinates)[1] - radius;
        
                        if (rot == 0) {
                            yLoc = yLoc + cosine;
                        } else if (rot > 0 && rot < 90) {
                            xLoc = xLoc - sine;
                            yLoc = yLoc + cosine;
                        } else if (rot == 90) {
                            xLoc = xLoc - sine;
                        } else if (rot > 90 == rot < 180) {
                            xLoc = xLoc - sine;
                            yLoc = yLoc + cosine;
                        } else if (rot == 180) {
                            yLoc = yLoc + cosine;
                        } else if (rot > 180 == rot < 270) {
                            xLoc = xLoc - sine;
                            yLoc = yLoc + cosine;
                        } else if (rot == 270) {
                            xLoc = xLoc - sine;
                        } else if (rot > 270 == rot < 360) {
                            xLoc = xLoc - sine;
                            yLoc = yLoc + cosine;
                        } else if (rot == 360) {
                            yLoc = yLoc + cosine;
                        } else { // greater than 360
                            xLoc = xLoc - sine;
                            yLoc = yLoc + cosine;
                        }
                        return "translate(" + xLoc + " " + yLoc + ") rotate(" + rot + ")"; 
                    });
            });
    }

    function zoomed(event) {
        const {transform} = event;
        mapdata.attr("transform", transform);
        mapdata.attr("stroke-width", 1 / transform.k);
      }
    
    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

    function showMETAR(message) {
        var metar = message;
//        console.log(metar);
        return metar
    }

    var origBarbLoc, origOktaLoc, origWxLoc, origTX, origTY, origTdX, origTdY, origFontSize;

    function handleMouseOver(d) {
        var locName = $(this).data("stid");
        d3.select("#g"+locName + " circle").attr("r", 2*radius);
        $(this).find(".metar").show();

        origOktaLoc = d3.select("#g"+locName + " .okta").attr("transform");
        origBarbLoc = d3.select("#g"+locName + " .windbarb").attr("transform");
        origWxLoc = d3.select("#g"+locName + " .preswx").attr("transform");
        origTX = d3.select("#g"+locName + " .t").attr("x");
        origTY = d3.select("#g"+locName + " .t").attr("y");
        origTdX = d3.select("#g"+locName + " .td").attr("x");
        origTdY = d3.select("#g"+locName + " .td").attr("y");
        origFontSize = d3.select("#g" + locName + " .stationID").attr("font-size");
        var transX = parseFloat(d3.select("#g"+locName + " circle").attr("cx"));
        var transY = parseFloat(d3.select("#g"+locName + " circle").attr("cy"));
        var tX = parseFloat(d3.select("#g"+locName + " .t").attr("x"));
        var tY = parseFloat(d3.select("#g"+locName + " .t").attr("y"));
        var tdX = parseFloat(d3.select("#g"+locName + " .td").attr("x"));
        var tdY = parseFloat(d3.select("#g"+locName + " .td").attr("y"));
        transX = transX-2*radius;
        transY = transY-2*radius;
        tX = tX-Math.sin(Math.PI/4)*radius;
        tY = tY-Math.sin(Math.PI/4)*radius;
        tdX = tdX-Math.sin(Math.PI/4)*radius;
        tdY = tdY+Math.sin(Math.PI/4)*radius;
        wxTransX = transX - 5*radius;
        wxTransY = transY;
        oktaTrans = "translate(" + transX + " " + transY + ") scale(2 2)";
        wxTrans = "translate(" + wxTransX + " " + wxTransY + ")";

        var barbTransform = origBarbLoc.split(" ");
        var barbRot = parseFloat(barbTransform[2].replace("rotate(","").replace(")",""));
        var barbTranslateX = parseFloat(barbTransform[0].replace("translate(",""));
        var barbTranslateY = parseFloat(barbTransform[1].replace(")",""));
        var windTrans = "translate(" + barbTranslateX + " " + barbTranslateY + ") rotate(" + barbRot + ") scale(2 2)";

        d3.select("#g"+locName + " .okta").attr("transform", oktaTrans);
        d3.select("#g"+locName + " .windbarb").attr("transform", windTrans);
        d3.select("#g"+locName + " .preswx").attr("transform", wxTrans);
        d3.select("#g"+locName + " .t").attr("x", tX).attr("y", tY);
        d3.select("#g"+locName + " .td").attr("x", tdX).attr("y", tdY);
        d3.select("#g"+locName + " .stationID").attr("font-size","16px");

    }
    
    function handleMouseOut(d) {
//        obsgroup.selectAll(".stationID").remove();
        $(this).find(".metar").hide();
        var locName = $(this).data("stid");
        d3.select("#g"+locName + " circle")
            .attr("r", radius);
        var transX = d3.select("#g"+locName + " circle").attr("cx");
        var transY = d3.select("#g"+locName + " circle").attr("cy");
        transX = transX-radius;
        transY = transY-radius;
        transform = "translate(" + transX + " " + transY + ")";

        d3.select("#g"+locName + " .okta").attr("transform", origOktaLoc);
        d3.select("#g"+locName + " .windbarb").attr("transform", origBarbLoc);
        d3.select("#g"+locName + " .preswx").attr("transform", origWxLoc);
        d3.select("#g"+locName + " .t").attr("x", origTX).attr("y", origTY);
        d3.select("#g"+locName + " .td").attr("x", origTdX).attr("y", origTdY);
        d3.select("#g"+locName + " .stationID").attr("font-size",origFontSize);
    }

    function makeBarbTemplates() {
        var speeds = d3.range(0,205,5);
        defs = svg.append('defs')
    
        defs.append("g")
            .attr("id","speedRect")
        d3.select("#speedRect")
            .append("rect").attr("width", "35").attr("height", "15").attr("transform","translate(0,-2)");
        d3.select("#speedRect")
            .append("line").attr("x1", "0").attr("x2", "30").attr("y1", "7.5").attr("y2","7.5").attr("transform","translate(35,-2)");
        d3.select("#speedRect")
            .append("circle").attr("r","4").attr("transform","translate(65,5.5)");
    
        speeds.forEach(function(d) {
            var thisbarb = defs.append('g').attr('id', 'barb'+d);
            
            var flags = Math.floor(d/50);
            var pennants = Math.floor((d - flags*10)/10);
            var halfpennants = Math.floor((d - flags*10 - pennants*10)/5);
            var px = barbsize;
                    
            // Draw wind barb stems
            if (d == 0) {
                thisbarb.append("circle").attr("r", 2).attr("stroke","none").attr("fill","none");
            } else {
                thisbarb.append("line").attr("class", "stem").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", barbsize);
            }
         
            // Draw wind barb flags and pennants for each stem
            for (i=0; i<flags; i++) {
                 thisbarb.append("polyline")
                    .attr("points", "0,"+px+" -10,"+(px)+" 0,"+(px-4))
                     .attr("class", "flag");
                  px -= 7;
             }
            // Draw pennants on each barb
            for (i=0; i<pennants; i++) {
                thisbarb.append("line")
                     .attr("x1", 0)
                     .attr("x2", -10)
                     .attr("y1", px)
                     .attr("y2", px+4)
                  px -= 3;
             }
             // Draw half-pennants on each barb
            for (i=0; i<halfpennants; i++) {
                thisbarb.append("line")
                     .attr("x1", 0)
                     .attr("x2", -5)
                     .attr("y1", px)
                     .attr("y2", px+2)
                 px -= 3;
             }
        });
        
        var arrows = defs.append("marker")
            .attr("id","arrowhead")
            .attr("markerWidth","5")
            .attr("markerHeight","5")
            .attr("refX","5")
            .attr("refY","2.5")
            .attr("orient","auto")
            .append("polygon")
            .attr("points","0 0, 5 2.5, 0 5")
            .attr("fill","#777");

        defs.append("g")
            .attr("id","okta10")
            .attr("class","clouddef")
            .append("image")
            .attr("xlink:href","d3/WorldWeatherSymbols/symbols/N_TotalCloudCover/WeatherSymbol_WMO_TotalCloudCover_N_Slash.svg")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        for (i=0; i < 10; i++) {
            defs.append("g")
            .attr("id","okta" + i)
            .attr("class","clouddef")
            .append("image")
            .attr("xlink:href","d3/WorldWeatherSymbols/symbols/N_TotalCloudCover/WeatherSymbol_WMO_TotalCloudCover_N_" + i + ".svg")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");
        }

        for (i=0; i < 100; i++) {
            if (i < 10) {
                num = "0" + i;
            } else {
                num = i;
            }
            defs.append("g")
            .attr("id","preswx" + num)
            .attr("class","preswx")
            .append("image")
            .attr("xlink:href","d3/WorldWeatherSymbols/symbols/ww_PresentWeather/WeatherSymbol_WMO_PresentWeather_ww_" + num + ".svg")
            .attr("width", 20)
            .attr("height", 20);
        }
    }

/*
    if (lat < 0) {
		barbdata = barbgroup.selectAll("barbs")
		.data(barbstest[0][0]).enter().append("g").attr("class","inactiveBarb")
		.attr("transform", function(d,i) { return "translate("+width+","+y(d.press)+") rotate("+(d.wdir-90)+") scale(1,-1)" });
	} else {
		barbdata = barbgroup.selectAll("barbs")
		.data(barbstest[0][0]).enter().append("g").attr("class","inactiveBarb")
		.attr("transform", function(d,i) { return "translate("+width+","+y(d.press)+") rotate("+(d.wdir-90)+")"; });
	}

    allbarbs = barbdata.append("use")
    	.attr("href", function (d) { return "#barb"+d.wspdround; })
		.attr("transform", function(d,i) { return "rotate(270)"; });
*/

    function round5(x) {
        return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
    }

    /* Code written by Bryan Guarente for possible inclusion on MetEd */
    var sfcArr = [];
    for (const i in COStnArr) {
        var stnURL = COStnArr[i].split('/');
        var stn = stnURL[4];
        if (stn[0] == "K") {
            if (stn == "KLNC2" || stn == "KTEX" || stn == "K4BM" || stn == "K0CO" || stn == "KPSO" || stn == "KSCOX" || stn == "KRGC2" || stn == "KRBC2" || stn == "K4V1" || stn == "KERC2" || stn == "KC07" || stn == "K2V6" || stn == "KELC2" || stn == "KIPC2") {
                continue;
            } else {
                stn = stn+"_latest.json";
                sfcArr.push(stn);
            }
        }
    }
    var obsArr = getObs_fromFile(sfcArr);
}
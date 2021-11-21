{
    var state = "CO";
    var radius = 5;
    
    var width = 996,
        height = 596;
    
    var teamNameSelect = $("#team").val();

    $("#team").on("change", function () {
        $('#type').prop('selectedIndex',6);
        teamNameSelect = $("#team").val();
        teamNameSelect = teamNameSelect
            .replace("  ", " ").replace(".","")
            .replace("(","").replace(")","")
            .replace(/\s/g,'.');
        if (teamNameSelect == "none") {
            $(".obs").show();
        } else {
            $(".obs").hide();
            $(".obs." + teamNameSelect).show();
        }
    });
    
    $("#type").on("change", function () {
        $('#team').prop('selectedIndex',0);
        teamType = $("#type").val();
        if (teamType == "none") {
            $(".obs").show();
        } else if (teamType == "COBC") {
            $(".obs").hide();
            $(".obs").not(".none").show();
        } else {
            $(".obs").hide();
            $(".obs." + teamType).show();
        }

    });
    
    var dateSelect;
    
    $("#myDate").on("change", function () {
        dateSelect = $("#myDate").val();
        dateSelect = new Date(dateSelect);
//        getObs(state);
    });
    
    // set projection
    var projection = d3.geo.equirectangular()
        .scale(8000)
        .center([-105.55, 39.0])
        .translate([width / 2, height / 2]);
    
    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 15])
        .on("zoom", zoomed);
    
    // create path variable
    var path = d3.geo.path()
        .projection(projection);
    
    // create svg variable
    var svg = d3.select(".flex-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);
    
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill","white");
    //    .on("click", reset);

    var g = svg.append("g").attr("id","mapdata");
    
    svg
        .call(zoom) // delete this line to disable free zooming
        .call(zoom.event)
        .on("dblclick.zoom", null);

    $("#Reset").on("click", reset);

    function reset() {
        scale = 1.0;
        g.attr("transform", "translate(0,0)scale(1,1)");
        zoom.scale(scale)
            .translate([0,0]);
    }
    
    var updategroup = g.append("g").attr("id","updates");
    var obsgroup = g.append("g").attr("id","obsgroup");
    var bordersgroup = g.append("g").attr("id","bordersgroup");
    var urbangroup = bordersgroup.append("g").attr("id","urban");
    var countiesgroup = bordersgroup.append("g").attr("id","counties");
    var riversgroup = bordersgroup.append("g").attr("id","rivers");
    var lakesgroup = bordersgroup.append("g").attr("id","lakes");
    var roadsgroup = bordersgroup.append("g").attr("id","roads");

    const barbsize = 20;
    makeBarbTemplates();
    
    d3.json("d3/counties.json", function(error, county) {
        counties = topojson.feature(county, county.objects.counties).features
    
        // add counties from topojson
        countiesgroup.selectAll("path")
        .data(counties).enter()
        .append("path")
        .attr("class", function (d,i) {return "county " + d.properties.NAME;})
        .attr("d", path);
    
        // put border around counties 
        countiesgroup.append("path")
        .datum(topojson.mesh(county, county, function(a, b) { return a !== b; }))
        .attr("class", "county")
        .attr("d", path);
    });
    
    d3.json("d3/roads.json", function(error, usroads) {
      if (error) throw error;
      roadsgroup.selectAll("path")
        .data(topojson.feature(usroads, usroads.objects.roads).features)
        .enter().append("path")
          .attr("d", path)
          .style("fill","none")
          .style("stroke","#AAAAAA")
          .style("stroke-width",1);
    
      roadsgroup.selectAll("path")
          .data(topojson.feature(usroads, usroads.objects.roads).features)
        .enter().append("path")
          .attr("d", path)
          .attr("class",function(d) { return "roads " + d.properties.type.toLowerCase().split(' ').join('-'); });
    
    });

    d3.json("d3/urban.json", function(error, urbans) {
        if (error) throw error;
        urbangroup.selectAll("path")
            .data(topojson.feature(urbans, urbans.objects.urban).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill","#eeeeee")
            .style("stroke","#aaaaaa")
            .style("stroke-width",.5);
      
        urbangroup.selectAll("path")
            .data(topojson.feature(urbans, urbans.objects.urban).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class","urban");
    });
    
    d3.json("d3/rivers.json", function(error, rivers) {
      if (error) throw error;
      riversgroup.selectAll("path")
          .data(topojson.feature(rivers, rivers.objects.rivers).features)
          .enter().append("path")
          .attr("d", path)
          .style("fill","none")
          .style("stroke","#a1a1da")
          .style("stroke-width",1.5);
    
      riversgroup.selectAll("path")
          .data(topojson.feature(rivers, rivers.objects.rivers).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class","river");
    
    });

    d3.json("d3/lakes.json", function(error, lakes) {
        if (error) throw error;
        lakesgroup.selectAll("path")
            .data(topojson.feature(lakes, lakes.objects.lakes).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill","#a1a1da")
            .style("stroke","#a1a1da")
            .style("stroke-width",1.5);
      
        lakesgroup.selectAll("path")
            .data(topojson.feature(lakes, lakes.objects.lakes).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class","obs");
      
    });
    
    var points = [];
    var circles;
    var data = {};

    getStations("CO");

    function getStations(state) {
        var settings = {
        "url": "https://api.weather.gov/stations?state=" + state,
        "method": "GET",
        "timeout": 0,
        "accept": "application/geo+json",
        "User-Agent": "(meted.ucar.edu, guarente@ucar.edu)"
        };

        data = {};
        $.ajax(settings)
            .done(function (response) {
                data = response;
                var len = data.features.length;
                for (d=1; d < 2; d++) {
                    console.log(data.features[d-1].properties.stationIdentifier);
                    getObs(data.features[d-1].properties.stationIdentifier,data.features[d].properties.stationIdentifier);
                }
            });
    }

/*    d3.json("d3/CO_Sfc_Obs_Locations_topojson.json", function(error, locs) {
        if (error) throw error;

        obsStationList = topojson.feature(locs, locs.objects.CO_Sfc_Obs_Locations).features;
        console.log(obsStationList);
//        for (ob in obsStationList) {
            var stid = obsStationList[0].properties.stationIdentifier;
            getObs("KDEN");
//            break;
//        }

        obsgroup.selectAll("circle")
            .data(topojson.feature(locs, locs.objects.CO_Sfc_Obs_Locations).features)
            .enter()
            .append("g")
            .append("circle")
            .attr("cx", function (d) { 
                var loc = projection(d.geometry.coordinates)[0];
                return loc; 
            })
            .attr("cy", function (d) { 
                var loc = projection(d.geometry.coordinates)[1];
                return loc; 
            })
            .attr("r", 6)
            .attr("class", "obs");

        obsgroup.selectAll("g")
            .data(topojson.feature(locs, locs.objects.CO_Sfc_Obs_Locations).features)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .append("use")
            .attr("class","okta")
            .attr("href", function (d) { var rando = Math.floor(Math.random() * 10) + 1; return "#okta" + rando; })
            .attr("transform", function (d) { 
                var xLoc = projection(d.geometry.coordinates)[0] - radius; 
                var yLoc = projection(d.geometry.coordinates)[1] - radius; 
                return "translate(" + xLoc + " " + yLoc + ")"; 
            });

        obsgroup.selectAll("g")
            .data(topojson.feature(locs, locs.objects.CO_Sfc_Obs_Locations).features)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .append("use")
            .attr("class","windbarb inactivebarb")
            .attr("href", function (d) { var rando = round5(Math.floor(Math.random() * 10)+5); return "#barb" + rando; })
            .attr("transform", function (d) { 
                var rot = Math.floor(Math.random()*360);
                var rotInRads = Math.PI/180*rot;
                var sine = radius * Math.sin(rotInRads);
                var cosine = radius * Math.cos(rotInRads);
                var xLoc = projection(d.geometry.coordinates)[0]; 
                var yLoc = projection(d.geometry.coordinates)[1];

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
            })
            .attr("class","windbarb inactiveBarb");
    }); */

    var refreshSec = 60;
    var obs = {};
    var yesterday;
    
    const datesAreOnSameDay = (first, second) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
    
    /* Code written by Bryan Guarente for the first annual CO Birding Challenge (May 2021) */
    
    function getObs(stid,nextStid) {
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
                console.log(obs);
                
                obsgroup.selectAll("circle")
                    .data([obs]).enter()
                    .append("g")
                    .append("circle")
                    .attr("cx", function (d) { 
                        console.log(d.geometry.coordinates[1]);
                        xloc = projection(d.geometry.coordinates)[1];
                        return xloc;
                    })
                    .attr("cy", function (d) { 
                        console.log(d.geometry.coordinates[0]);
                        yloc = projection(d.geometry.coordinates)[0];
                        return yloc; 
                    })
                    .attr("r", radius)
                    .attr("class", "obs");
    
/*                obsgroup.selectAll("g")
                    .data(obs)
                    .on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut)
                    .append("use")
                    .attr("class","okta")
                    .attr("href", function (d) { var rando = Math.floor(Math.random() * 10) + 1; return "#okta" + rando; })
                    .attr("transform", function (d) { 
                        var xLoc = projection(d.geometry.coordinates)[0] - radius; 
                        var yLoc = projection(d.geometry.coordinates)[1] - radius; 
                        return "translate(" + xLoc + " " + yLoc + ")"; 
                    }); */
        
/*                obsgroup.selectAll("g")
                    .on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut)
                    .data([obs]).enter()
                    .append("use")
                    .attr("class","windbarb inactivebarb")
                    .attr("href", function (d) { var windSpd = round5(d.properties.windSpeed.value); return "#barb" + windSpd; })
                    .attr("transform", function (d) { 
                        console.log(d.properties.windDirection.value);
                        console.log(d.properties.windSpeed.value);

                        var rot = d.properties.windDirection.value;
                        var rotInRads = Math.PI/180*rot;
                        var sine = radius * Math.sin(rotInRads);
                        var cosine = radius * Math.cos(rotInRads);
                        var xLoc = projection(d.geometry.coordinates)[0]; 
                        var yLoc = projection(d.geometry.coordinates)[1];
        
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
                    }); */
    
/*                $(".obs").remove(); */
    
/*                circles = obsgroup.selectAll("circle")
                    .data(points).enter()
                    .append("circle")
                    .attr("cx", function (d) { return projection(d)[0]; })
                    .attr("cy", function (d) { return projection(d)[1]; })
                    .attr("r", function (d) { if (d[2] <= 2.5) { return "2.5px"; } else { return d[2]  + "px"; } })
                    .attr("fill", "red")
                    .attr("stroke", "black")
                    .attr("strokeWidth", "1px")
                    .attr("class", function (d) { 
                        for (var prop in teamObj) {
                            if (`${teamObj[prop].TeamInfo.Members}`.includes(d[6])) {
                                var teamType = `${teamObj[prop].TeamInfo.Type}`;
                                var teamName = `${prop}`;
                                checkIds = Object.keys(observerObj[d[6]]);
                                for (c in checkIds) {
                                    if (checklistCounties[checkIds[c]] == teamObj[prop].TeamInfo.County) {
                                        teamObj[prop].TeamChecklists[checkIds[c]] = { "County": checklistCounties[checkIds[c]] };
                                    }
                                }
                                teamName = teamName.replace(/[&\/\\#,+()$~%'":*?<>{}]/g,'')
                                break;
                            }
                            var teamType = "none";
                        }
                        return "obs " + teamName + " " + d[6] + " " + teamType; })
                    .on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut)
                    .on("dblclick", function (d) { return goToUrl(d[4])});
    
                $(".obs").remove().appendTo("#obsgroup");
                if (teamNameSelect == "none") {
                } else {
                    $(".obs").hide();
                    $(".obs." + teamNameSelect).show();
                }
                if (teamType == "none") {
                } else {
                    if (teamType == "COBC") {
                        $(".obs").hide();
                        $(".obs").not(".none").show();
                    } else {
                        $(".obs").hide();
                        $(".obs." + teamType).show();
                    }

                }
                if (teamType == "none" && teamNameSelect == "none") {
                    $(".obs").show();
                }

                setTimeout( function() {  
                    getObs(locale);
                }, refreshSec*1000);*/
            });
/*            })
            .fail(function (jqXHR, textStatus, errorThrown ) {
                setTimeout( function() {
                    updategroup.append("rect")
                        .attr("class","updateText")
                        .attr("x",4)
                        .attr("y",2)
                        .attr("width",80)
                        .attr("height",20)
                        .attr("fill","lightred");
                    updategroup.append("text")
                        .attr("class","updateText")
                        .text("Error...")
                        .attr("x",8)
                        .attr("y",16);
                    console.log(jqXHR.status, textStatus, errorThrown);
//                    getObs(stid);
                }, refreshSec*1000);
            })
            .always(function () {
//                yesterday = date;
            })*/
    }
    
    /* Code written by Bryan Guarente for the first annual CO Birding Challenge (May 2021) */
    
//    getObs(state);

    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.scale + "px");
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
    
    var origBarbLoc, origOktaLoc;

    function handleMouseOver(d) {
//        var mouse = d3.mouse(svg.node());
        var locName = d.properties.stationIdentifier;

        origOktaLoc = d3.select(this).select(".okta").attr("transform");
        origBarbLoc = d3.select(this).select(".windbarb").attr("transform");

        d3.select(this).select("circle")
            .attr("r", 2*radius);
        var transX = parseFloat(d3.select(this).select("circle").attr("cx"));
        var transY = parseFloat(d3.select(this).select("circle").attr("cy"));
        transX = transX-2*radius;
        transY = transY-2*radius;
        oktaTrans = "translate(" + transX + " " + transY + ") scale(2 2)";

        var barbTransform = origBarbLoc.split(" ");

        var barbTranslateX = parseFloat(barbTransform[0].replace("translate(",""));
        var barbTranslateY = parseFloat(barbTransform[1].replace(")",""));
        var barbRot = parseFloat(barbTransform[2].replace("rotate(","").replace(")",""));

        var windTrans = "translate(" + barbTranslateX + " " + barbTranslateY + ") rotate(" + barbRot + ") scale(2 2)";

        d3.select(this).select(".okta")
            .attr("transform", oktaTrans);

        d3.select(this).select(".windbarb")
            .attr("transform", windTrans);

    }
    
    function handleMouseOut(d) {
        obsgroup.selectAll("text").remove();
        d3.select(this).select("circle")
            .attr({
                r: radius
            });
        var transX = d3.select(this).select("circle").attr("cx");
        var transY = d3.select(this).select("circle").attr("cy");
        transX = transX-radius;
        transY = transY-radius;
        transform = "translate(" + transX + " " + transY + ")";

        d3.select(this).select(".okta").attr("transform", origOktaLoc);
        d3.select(this).select(".windbarb").attr("transform", origBarbLoc);
    }

    function makeBarbTemplates() {
        var speeds = d3.range(0,205,5);
        barbCloudDef = svg.append('defs')
    
        barbCloudDef.append("g")
            .attr("id","speedRect")
        d3.select("#speedRect")
            .append("rect").attr("width", "35").attr("height", "15").attr("transform","translate(0,-2)");
        d3.select("#speedRect")
            .append("line").attr("x1", "0").attr("x2", "30").attr("y1", "7.5").attr("y2","7.5").attr("transform","translate(35,-2)");
        d3.select("#speedRect")
            .append("circle").attr("r","4").attr("transform","translate(65,5.5)");
    
        speeds.forEach(function(d) {
            var thisbarb = barbCloudDef.append('g').attr('id', 'barb'+d);
            
            var flags = Math.floor(d/10);
            var pennants = Math.floor((d - flags*10)/10);
            var halfpennants = Math.floor((d - flags*10 - pennants*10)/5);
            var px = barbsize;
                    
            // Draw wind barb stems
            if (d == 0) {
                thisbarb.append("circle").attr("r", 2);
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
        
        var arrows = barbCloudDef.append("marker")
            .attr("id","arrowhead")
            .attr("markerWidth","5")
            .attr("markerHeight","5")
            .attr("refX","5")
            .attr("refY","2.5")
            .attr("orient","auto")
            .append("polygon")
            .attr("points","0 0, 5 2.5, 0 5")
            .attr("fill","#777");

        barbCloudDef.append("g")
            .attr("id","okta10")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M1.465 8.535 L 1.465 1.465 L 5 8.535 L 8.535 1.465 L 8.535 8.535")
            .attr("fill", "none")
            .attr("stroke","black")
            .attr("stroke-width","2");

        barbCloudDef.append("g")
            .attr("id","okta9")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M1.465 1.465 L 8.535 8.535 M1.465 8.535 L 8.535 1.465")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta8")
            .attr("class","clouddef")
            .append("circle")
            .attr("cx",5)
            .attr("cy",5)
            .attr("r",5)
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta7")
            .attr("class","clouddef")
            .append("circle")
            .attr("cx",5)
            .attr("cy",5)
            .attr("r",5)
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");
        d3.select("#okta7")
            .append("path")
            .attr("d","M5 0 L 5 11")
            .attr("fill","white")
            .attr("stroke","white")
            .attr("stroke-width",2);

        barbCloudDef.append("g")
            .attr("id","okta6")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M 0 5 A 5 5 0 1 0 5 0 L 5 5 L 0 5")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta5")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M5,10 a5,5 0 0,0 0,-10 M5, 5 L 0 5")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta4")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M5,10 a5,5 0 0,0 0,-10 z")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta3")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M 10 5 A 5 5 0 0 0 5 0 L 5 5 M 5 5 L 5 10")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta2")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M 10 5 A 5 5 0 0 0 5 0 L 5 5")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");

        barbCloudDef.append("g")
            .attr("id","okta1")
            .attr("class","clouddef")
            .append("path")
            .attr("d","M5,0 L 5, 10")
            .attr("fill", "black")
            .attr("stroke","black")
            .attr("stroke-width","1");
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

    /* Code written by Bryan Guarente for the first annual CO Birding Challenge (May 2021) */
}
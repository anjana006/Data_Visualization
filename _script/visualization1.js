
function createVisitMap(divId, worldmap, data) {

var width = 1000,
    height = 500;

var tempcolor;
    var tooltip = d3.select('body').append('div')
    .attr("class","tooltip")
        .style({
            background: '#FFF176',
            color: 'black',
            position: 'absolute',
            opacity: 0,
            fontWeight: 'bolder',
            padding: '10px'
        })

var svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height);

var projection = d3.geo.mercator()
        .translate([width / 2, height / 1.5])
        .scale(width/2/Math.PI)
        .scale(height*0.72/Math.PI)
        // .scale(110)

var path = d3.geo.path()
        .projection(projection);

var fpopdata = d3.map();

    pdata.forEach(function (d) {
        var x = d.Population;
        var y = Number(x.replace(/[^0-9\.-]+/g, ""));
        if (d.Year == "2016") {
            fpopdata.set(d.Country, y);
        }
    })

    var colExtent = [];
        colExtent[0] = d3.min(fpopdata.values());
        colExtent[1] = d3.max(fpopdata.values());
    var color;
    var x = worldmap.features;
        color = d3.scale.linear()
            .domain(colExtent)
            .range(["#99b3ff", "#002080"])
            .interpolate(d3.interpolateHcl);

    var states = svg.selectAll(".country")
            .data(worldmap.features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "country")
            .on("mouseover", function (d) {
                tooltip.transition().style('opacity', 0.9)
                tooltip.html(d.properties.name)
                       .style({left: (d3.event.pageX) + 'px',
                            top: (d3.event.pageY) + 'px'})
                tempcolor = this.style.fill
                d3.select(this).style({opacity: 0.8,fill: '#aaa'})
            })
            .on("mouseout", function (d) {
                tooltip.style('opacity', 0)
                d3.select(this).style({fill: tempcolor,opacity: 1})})
            .on("mousemove", function (d, i) { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })

      var sam=[];
      pdata.forEach(function(d){

          if(d.Year== "2016")
          {
              sam.push({
                  Density: d.Density,
                  Country: d.Country
              })
          }
      })

      states.attr("class", "country")
          .style("fill", function (d) {
              return color(fpopdata.get(d.properties.name));
          })

    var legendSize = 150;
    var numLevels = 150;
    var legend = svg.append("g").attr("class", "YlGn");
    var levels = legend.selectAll("levels")
        .data(d3.range(numLevels))
        .enter().append("rect")
        .attr("x", function (d) {
            return width - legendSize - 20 +
                d * legendSize / numLevels;
        })
        .attr("y", height - 20)
        .attr("width", legendSize / numLevels)
        .attr("height", 16)
        .style("stroke", "none");

        levels.style("fill", function (d) {
            return color(colExtent[0] * (legendSize - d) / legendSize +
                colExtent[1] * d / legendSize);
        })

    legend.append("text")
        .attr("x", width - legendSize - 20)
        .attr("y", height - 24)
        .attr("text-anchor", "middle")
        .text(colExtent[0])

    legend.append("text")
        .attr("x", width - 20)
        .attr("y", height - 24)
        .attr("text-anchor", "middle")
        .text(colExtent[1])

    legend.append("text")
        .attr("x", width - legendSize / 2 - 20)
        .attr("y", height - 40)
        .attr("text-anchor", "middle")
        .text("#Population Count")

    d3.selectAll('.country')
    .on("click", function (d, i) {
      // d3.selectAll(".state-boundary").classed("highlight",false)
var ele = d3.select(this)
        ele.classed("highlight", true);
var elecounty = ele.datum().properties.name;

thecountry=elecounty;

if (elecounty) {
            linechart(elecounty);
            yearlychange(elecounty)
            bar(elecounty)
        }
    })
}

function processData(errors, worldmap) {
    createVisitMap("#map", worldmap, pdata);
}
queue()
  .defer(d3.json, "https://api.myjson.com/bins/5bi34")
  .await(processData);

function linechart(country)
{
    var abc = d3.select("#line")
    abc.selectAll('svg').remove();

    var margin = { top: 30, right: 70, bottom: 50, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var ppopdata = [];
    var name;

    pdata.forEach(function (d)
    {
        var h = d.Population;
        var l = d.UrbanPop;

        if(typeof(l)== "string")
        {
            var a = Number(h.replace(/[^0-9\.-]+/g,""));
            var b = Number(l.replace(/[^0-9\.-]+/g,""));
        }
        else
        {
            var a = Number(h.replace(/[^0-9\.-]+/g,""));
            var b= l;
        }
        if (d.Country == country)
        {
            name = d.Country;
            ppopdata.push({
                year: (d.Year),
                population: a,
                UrbanPop: b,
                CountryShare: Number(d.CountryShare.replace(/[^0-9\.-]+/g,"")),
                WorldPop: Number(d.WorldPop.replace(/[^0-9\.-]+/g,""))
            });
        }
    })

    var y0 = Math.min(Math.abs(d3.min(ppopdata, function (d) { return d.population; })), //3
                      Math.abs(d3.min(ppopdata, function (d) { return d.UrbanPop; }))
                      );

    var y1= Math.max(Math.abs(d3.max(ppopdata, function (d) { return d.population; })), //3
                     Math.abs(d3.max(ppopdata, function (d) { return d.UrbanPop; }))//7
                    );

    var y, flag = 0;
    if (flag == 1) {
        yScale = d3.scale.linear()
                    .domain([-y1,y1])
                    .range([height, 0])
                    .nice();
    }
    else
    {
        yScale = d3.scale.linear()
           .domain([y0,y1])
           .range([height, 0])
           .nice();
    }

    // Set the ranges
    var xScale = d3.scale.linear().range([0, width]);
    var format = d3.format("d");
    xScale.domain(d3.extent(ppopdata, function (d) { return (d.year); }));

    var xAxis = d3.svg.axis().scale(xScale)
    .orient("bottom").ticks(21).tickFormat(format);

    var yAxis = d3.svg.axis().scale(yScale)
    .orient("left")

    var valueline1 = d3.svg.line()
    .x(function (d) { return Number(xScale(d.year)); })
    .y(function (d) { return yScale(d.population); });

    var valueline3 = d3.svg.line()
    .x(function (d) { return Number(xScale(d.year)); })
    .y(function (d) { return yScale(d.UrbanPop); });

    // Adds the svg canvas
    var svg1 = d3.select("#line")
    .append("svg")
    .attr("class",'line')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path 1.
    svg1.append("path")
    .attr("class", "line")
    .style("stroke", "steelblue")
    .style("stroke-width", "2px")
    .attr("d", valueline1(ppopdata));

    // Add the valueline path 3.
    svg1.append("path")
    .attr("class", "line")
    .style("stroke", "orange")
    .style("stroke-width", "2px")
    .attr("d", valueline3(ppopdata));

      var tooltip1 = d3.select('body').append('div')
                      .attr("class","tooltip1")
                      .style({
                      background: '#FFF176',
                      color: 'black',
                      position: 'absolute',
                      opacity: 0,
                      fontWeight: 'bolder',
                      padding: '10px'
                      })

      var tooltip2 = d3.select('body').append('div')
                      .attr("class","tooltip2")
                      .style({
                      background: '#FFF176',
                      color: 'black',
                      position: 'absolute',
                      opacity: 0,
                      fontWeight: 'bolder',
                      padding: '10px'
                      })


      var points1 = svg1.append('g')
              .selectAll('.data-point')
              .data(ppopdata)
              .enter()
              .append('circle')
              .classed('data-point', true)
              .style('opacity', 1e-6)
              .style('fill', "#ffffff")
              .style('stroke', '#ff7f0e')
              .attr('cx', function(d) { return parseInt(xScale(d.year)); })
              .attr('cy', function(d) { return yScale(d.population); })
              .attr('r', function() { return 3; })
              .on('mouseover', function(d) {
              d3.select(this)
              .transition().duration(500)
              .ease("elastic")
              .attr('r', 6.5);
              tooltip1.transition().style('opacity', 0.9)
              tooltip1.html("<strong>Population:</strong>   "+d.population+"<br> <strong>Country's Share:</strong>   "+d.CountryShare+"%")
                 .style({left: (d3.event.pageX) + 'px',
                         top: (d3.event.pageY) + 'px'})
               })
              .on('mouseout', function() {
              d3.select(this).transition()
              .duration(500)
              .ease("in-out")
              .attr('r', 3);
               tooltip1.style('opacity', 0)
              })
              .transition().delay(250).duration(500).ease("in-out")
              .style('opacity', 1).attr('stroke-width', 2);


      var points2 = svg1.append('g')
            .selectAll('.data-point')
            .data(ppopdata)
            .enter()
            .append('circle')
            .classed('data-point', true)
            .style('opacity', 1e-6)
            .style('fill', "#ffffff")
            .style('stroke', '#ff7f0e')
            .attr('cx', function(d) { return parseInt(xScale(d.year)); })
            .attr('cy', function(d) { return yScale(d.UrbanPop); })
            .attr('r', function() { return 3; })
            .on('mouseover', function(d) {
            d3.select(this)
            .transition().duration(500)
            .ease("elastic")
            .attr('r', 6.5);
            tooltip2.transition().style('opacity', 0.9)
            tooltip2.html("<strong>Urban Population:</strong>"+d.UrbanPop)
                .style({left: (d3.event.pageX) + 'px',
                       top: (d3.event.pageY) + 'px'})
             })
            .on('mouseout', function() {
            d3.select(this).transition()
            .duration(500)
            .ease("in-out")
            .attr('r', 3)
             tooltip2.style('opacity', 0)
            })
            .transition().delay(250).duration(500).ease("in-out")
            .style('opacity', 1).attr('stroke-width', 2);

    // Add the X Axis
   if (flag == 1) {
        svg1.append("g")
    .attr("class", "x axis")
   .attr("transform", "translate(0," + height / 2 + ")")
    .call(xAxis);
    }
    else {
        svg1.append("g")
    .attr("class", "x axis")
     .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);
    }

    // Add the Y Axis
    svg1.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg1.append("text")
    .attr("transform", "translate( -80 ,"+ (height/2) + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size","12px")
    .text(" Population");

    svg1.append("text")
    .attr("transform", "translate( "+width/2+" ,"+ (height+30) + ")")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size","12px")
    .text(" Years");


    var size= Object.keys(ppopdata).length;

    svg1.append("text")
    .attr("transform", "translate(" + (width+3) + "," + yScale(ppopdata[size-1].UrbanPop) + ")")
    .attr("dy", "1.5em")
    .attr("dx","1.5em")
    .attr("text-anchor", "middle")
    .style("fill", "orange")
    .text(" Urban Population");

    svg1.append("text")
    .attr("transform", "translate(" + (width+3) + "," + yScale(ppopdata[size-1].population) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "blue")
    .text("  Population");

    svg1.append("text")
    .attr("class", "countryname")
   .attr("x", (width / 2))
    .attr("y", (0 - (margin.top / 2)))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(name);

}
function yearlychange(country)
{
    var abc = d3.select("#change")
    abc.selectAll('svg').remove();

    var ppopdata = [];
    var name;

    pdata.forEach(function (d) {
        var x = d.YearlyPerChange;

        var y = Number(x.replace(/[^0-9\.-]+/g,""));

        if (d.Country== country)
        {
            name = d.Country;
            ppopdata.push({
                year: parseInt(d.Year),
                growth: y,
                FertilityRate: d.FertilityRate
            });
        }
    })

    var temp = ppopdata.map(function (d) {
        return d.growth
    })

    var margin = { top: 30, right: 70, bottom: 50, left: 80 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var yn = Math.abs(d3.min(ppopdata, function (d) { return d.growth; }));

    var yp = Math.max(Math.abs(d3.max(ppopdata, function (d) { return d.FertilityRate; })), //3
                      Math.abs(d3.max(ppopdata, function (d) { return d.growth; })) //7
                      );
    var yy= Math.max(yn,yp);

    var y0= Math.min(Math.abs(d3.min(ppopdata, function (d) { return d.FertilityRate; })), //3
                      Math.abs(d3.min(ppopdata, function (d) { return d.growth; })) //7
                      );

    var y1= Math.max(Math.abs(d3.max(ppopdata, function (d) { return d.FertilityRate; })), //3
                      Math.abs(d3.max(ppopdata, function (d) { return d.growth; })) //7
                      );

    var y, flag = 0;

    for (i = 0; i < ppopdata.length; i++) {
        if (ppopdata[i].growth < 0) {
            flag = 1;
            break;
        }
    }

    if (flag == 1) {
        y = d3.scale.linear()
                    .domain([-yy, yy])
                    .range([height, 0])
                    .nice();
    }
    else {
        y = d3.scale.linear()
           .domain([y0,y1])
           .range([height, 0])
           .nice();
    }

   var x = d3.scale.linear().range([0, width]);

   var format = d3.format("d");
    x.domain(d3.extent(ppopdata, function (d) { return (d.year); }));

    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(21).tickFormat(format);

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

    var valueline = d3.svg.line()
    .x(function (d, i) { return x(d.year); })
    .y(function (d) { return y(d.growth); })//Math.max(0, d.growth)); })


     var valueline2 = d3.svg.line()
    .x(function (d, i) { return x(d.year); })
    .y(function (d) { return y(d.FertilityRate); })

    var svg = d3.select("#change").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".change")

    svg.append("path")
  .attr("class", "line")
  .style("stroke", "orange")
  .style("stroke-width", "2px")
  .attr("d", valueline(ppopdata));

   svg.append("path")
  .attr("class", "line")
  .style("stroke", "green")
  .style("stroke-width", "2px")
  .attr("d", valueline2(ppopdata));

    svg.append("g")
    .attr("class", "x axis")
    .call(yAxis);


        var tooltip1 = d3.select('body').append('div')
        .attr("class","tooltip1")
            .style({
                background: '#FFF176',
                color: 'black',
                position: 'absolute',
                opacity: 0,
                fontWeight: 'bolder',
                padding: '10px'
            })

        var tooltip2 = d3.select('body').append('div')
        .attr("class","tooltip2")
            .style({
                background: '#FFF176',
                color: 'black',
                position: 'absolute',
                opacity: 0,
                fontWeight: 'bolder',
                padding: '10px'
            })


    var points1 = svg.append('g')
           .selectAll('.data-point')
           .data(ppopdata)
           .enter()
           .append('circle')
           .classed('data-point', true)
           .style('opacity', 1e-6)
           .style('fill', "#ffffff")
           .style('stroke', '#ff7f0e')
           .attr('cx', function(d) { return parseInt(x(d.year)); })
           .attr('cy', function(d) { return y(d.FertilityRate); })
           .attr('r', function() { return 3; })
           .on('mouseover', function(d) {
                   d3.select(this)
                   .transition().duration(500)
                   .ease("elastic")
                   .attr('r', 6.5)
                   tooltip1.transition().style('opacity', 0.9)
                   tooltip1.html(d.FertilityRate+ "%")
                       .style({left: (d3.event.pageX) + 'px',
                           top: (d3.event.pageY) + 'px'})
            })
           .on('mouseout', function() {
                   d3.select(this).transition()
                   .duration(500)
                   .ease("in-out")
                   .attr('r', 3)
                   tooltip1.style('opacity', 0)
            })
           .transition().delay(250).duration(500).ease("in-out")
           .style('opacity', 1).attr('stroke-width', 2);


      var points2 = svg.append('g')
           .selectAll('.data-point')
           .data(ppopdata)
           .enter()
           .append('circle')
           .classed('data-point', true)
           .style('opacity', 1e-6)
           .style('fill', "#ffffff")
           .style('stroke', '#ff7f0e')
           .attr('cx', function(d) { return parseInt(x(d.year)); })
           .attr('cy', function(d) { return y(d.growth); })
           .attr('r', function() { return 3; })
           .on('mouseover', function(d) {
                 d3.select(this)
                 .transition().duration(500)
                 .ease("elastic")
                 .attr('r', 6.5)
                 tooltip2.transition().style('opacity', 0.9);
                 tooltip2.html(d.growth+"%")
                     .style({left: (d3.event.pageX) + 'px',
                             top: (d3.event.pageY) + 'px'})
            })
           .on('mouseout', function() {
                 d3.select(this).transition()
                 .duration(500)
                 .ease("in-out")
                 .attr('r', 3)
                 tooltip2.style('opacity', 0)
           })
           .transition().delay(250).duration(500).ease("in-out")
           .style('opacity', 1).attr('stroke-width', 2);

    if (flag == 1) {
        svg.append("g")
    .attr("class", "x axis")
   .attr("transform", "translate(0," + height / 2 + ")")
    .call(xAxis);
    }
    else {
        svg.append("g")
    .attr("class", "x axis")
   .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);
    }

    var size= Object.keys(ppopdata).length;


    svg.append("text")
    .attr("transform", "translate( -50 ,"+ (height/2) + ")rotate(-90)")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size","12px")
    .text(" Percentage(%)");

    svg.append("text")
    .attr("transform", "translate( "+width/2+" ,"+ (height+30) + ")")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size","12px")
    .text(" Years");


    svg.append("text")
    .attr("transform", "translate(" + (width+3) + "," + y(ppopdata[size-1].growth) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "orange")
    .text("Yearly Growth");

    svg.append("text")
    .attr("transform", "translate(" + (width+3) + "," + y(ppopdata[size-1].FertilityRate) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("Fertility Rate");

    svg.append("path")
      .data(temp)
      .attr("class", "line")

    svg.append("text")
    .attr("class", "countryname")
    .attr("x", (width / 2))
    .attr("y", (0 - (margin.top / 2)))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(name + " (Yearly Growth Rate & Fertility Rate) ");

    d3.select('#change')
}
function bar(country)
{
var abc = d3.select("#bar")
    abc.selectAll('svg').remove();

    var ppopdata = [];
    var name;

    pdata.forEach(function (d)
    {
        var h = d.Migrants;

        if(typeof(h)== "string")
        {
            var a = Number(h.replace(/[^0-9\.-]+/g,""));
        }
        else
        {
            var a= h;
        }

        if (d.Country == country)
        {
            name = d.Country;
            ppopdata.push({
                name:String(d.Year),
                value: a
            });
        }
    })

var margin = {top: 20, right: 20, bottom: 40, left: 50},
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var tempcolor;
var tooltip = d3.select('body').append('div')
.attr("class","tooltip")
    .style({
        background: '#FFF176',
        color: 'black',
        position: 'absolute',
        opacity: 0,
        fontWeight: 'bolder',
        padding: '10px'
    })

var x = d3.scale.linear()
.range([0, width]);

var y = d3.scale.ordinal()
.rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickSize(0)
.tickPadding(6);

var svg = d3.select("#bar").append("svg")
.attr("class", 'bar')
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(ppopdata, function(d) { return d.value; })).nice();
y.domain(ppopdata.map(function(d) { return d.name; }));

svg.selectAll("bar")
  .data(ppopdata)
.enter().append("rect")
  .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
  .attr("x", function(d) { return x(Math.min(0, d.value)); })
  .attr("y", function(d) { return y(d.name); })
  .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
  .attr("height", y.rangeBand())
  .on("mouseover", function (d) {
      tooltip.transition().style('opacity', 0.9)
      tooltip.html(d.value)
             .style({left: (d3.event.pageX) + 'px',
                  top: (d3.event.pageY) + 'px'})
      tempcolor = this.style.fill
      d3.select(this).style({opacity: 0.8,fill: '#aaa'})
  })
  .on("mouseout", function (d) {
      tooltip.style('opacity', 0)
      d3.select(this).style({fill: tempcolor,opacity: 1})})
  .on("mousemove", function (d, i) { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })


  svg.append("text")
  .attr("class", "countryname")
  .attr("x", (width / 2))
  .attr("y", (10 - (margin.top / 2)))
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .style("text-decoration", "underline")
  .text(name + " (Migrants) ");

  svg.append("text")
  .attr("transform", "translate( "+width/2+" ,"+ (height+30) + ")")
  .attr("text-anchor", "middle")
  .style("fill", "black")
  .style("font-size","12px")
  .text(" Migrants");

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + x(0) + ",0)")
  .call(yAxis);

function type(d) {
  d.value = +d.value;
  return d;
}
}

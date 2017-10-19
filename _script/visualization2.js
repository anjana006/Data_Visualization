var temp=[], flag=0;


window.onload= function()
{

    var initial= [];
    for(var i=0; i<pdata.length; i++)
    {
        if(pdata[i].Country=="Afghanistan" )
        initial.push({
                Country: pdata[i].Country,
                Year: pdata[i].Year,
                Population: pdata[i].Population,
                YearlyPerChange: pdata[i].YearlyPerChange,
                YearlyChange: pdata[i].YearlyChange,
                Migrants: pdata[i].Migrants,
                MedianAge: pdata[i].MedianAge,
                FertilityRate: pdata[i].FertilityRate,
                Density: pdata[i].Density,
                UrbanPerPop: pdata[i].UrbanPerPop,
                UrbanPop: pdata[i].UrbanPop,
                CountryShare: pdata[i].CountryShare,
                WorldPop: pdata[i].WorldPop
                })
    }

temp=initial;

stacked(temp)
}
function Get(x)
{
    var i=0;
    if(temp!= null)
    {
        for(i=0;i<temp.length;i++)
        {
            if (temp[i].Country==x)
            {
                flag=1;
                break;
            }
            else
                flag=0; //"Country already selected"
        }
    }

        if(!flag)
        {
            pdata.forEach(function(d){
            if(d.Country==x)
            {

                temp.push({
                Country: x,
                Year: d.Year,
                Population: String(d.Population),
                YearlyPerChange: d.YearlyPerChange,
                YearlyChange: d.YearlyChange,
                Migrants: d.Migrants,
                MedianAge: d.MedianAge,
                FertilityRate: d.FertilityRate,
                Density: d.Density,
                UrbanPerPop: d.UrbanPerPop,
                UrbanPop: d.UrbanPop,
                CountryShare: d.CountryShare,
                WorldPop: d.WorldPop
                })
        }
        })
    stacked(temp);
    }
    i=0;
}
function reset()
{
    var temp2= new Array();

     for(i=0;i<(temp.length-21);i++)
     {

        temp2.push({
                Country: temp[i].Country,
                Year: temp[i].Year,
                Population: temp[i].Population,
                YearlyPerChange: temp[i].YearlyPerChange,
                YearlyChange: temp[i].YearlyChange,
                Migrants: temp[i].Migrants,
                MedianAge: temp[i].MedianAge,
                FertilityRate: temp[i].FertilityRate,
                Density: temp[i].Density,
                UrbanPerPop: temp[i].UrbanPerPop,
                UrbanPop: temp[i].UrbanPop,
                CountryShare: temp[i].CountryShare,
                WorldPop: temp[i].WorldPop
                })
    }

    //console.log(temp2)
    temp=temp2;
    stacked(temp);

}

function stacked(tempp) {

console.log("stacked is called")

var abc = d3.select("#stack")
abc.selectAll('svg').remove();


        var margin = { top: 10, right: 20, bottom: 20, left: 60 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2);

        var y1 = d3.scale.linear();

        var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, 1);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        //.tickFormat(formatDate);

        var nest = d3.nest()
        .key(function (d) { return d.Country; });

        var stack = d3.layout.stack()
        .values(function (d) { return d.values; })
        .x(function (d) { return d.Year; })
        .y(function (d) { return parseInt(d.Population); })
        .out(function (d, y0) { d.valueOffset = y0; });

        var color = d3.scale.category10();

        var svg = d3.select("#stack").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // d3.tsv("data.tsv", function(error, data) {

        // temp=pdata.filter(function(d){
        //     return (d.Country== "Afghanistan" && d.Country=="Albania");
        // })

        console.log(tempp);

        var r = 0, k = 0;

        tempp.forEach(function (d) {

            k = d.Population
            if(typeof(k)== "string")
            {
                k = Number((d.Population).replace(/[^0-9\.-]+/g, ""));
            }
            r = +k;
            d.Year= parseInt(d.Year);
            d.Population = r;
        });

        var dataByGroup = nest.entries(tempp);

        stack(dataByGroup);

        x.domain(dataByGroup[0].values.map(function (d) { return d.Year; }));
        y0.domain(dataByGroup.map(function (d) { return d.key; }));
        y1.domain([0, d3.max(tempp, function (d) { return d.Population; })]).range([y0.rangeBand(), 0]);

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

        var group = svg.selectAll(".group")
            .data(dataByGroup)
            .enter().append("g")
            .attr("class", "group")
            .attr("transform", function (d) { return "translate(0," + y0(d.key) + ")"; });

        // group.append("text")
        //     .attr("class", "group-label")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return y1( (d.values[0].Population) / 2); })
        //     .attr("dy", ".35em")
        //     .text(function(d) { return "Group " + d.key; });

        group.selectAll("rect")
            .data(function (d) { return d.values; })
            .enter().append("rect")
            .style("fill", function (d) { return color(d.Country); })
            .attr("x", function (d) { return x(d.Year); })
            .attr("y", function (d) { return y1(d.Population); })
            .attr("width", x.rangeBand())
            .attr("height", function (d) { return y0.rangeBand() - y1(d.Population); })
            .on("mouseover", function(d){

                tooltip.transition().style('opacity', 0.9)
                console.log(d)
                //tooltip.html(worldmap.features[i].properties.name)
                tooltip.html("Population:"+d.Population)
                    .style({
                        left: (d3.event.pageX) + 'px',
                        top: (d3.event.pageY) + 'px'
                    })

                tempcolor = this.style.fill

                d3.select(this)
                    .style({
                        opacity: 0.8,
                        fill: '#aaa'
                    })
            })
            .on("mouseout", function (d) {
                tooltip.style('opacity', 0)

                d3.select(this)
                    .style({
                        fill: tempcolor,
                        opacity: 1
                    })
            })

            .on("mousemove", function (d, i) { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })

            svg.append("text")
            .attr("transform", "translate( "+width/2+" ,"+ (height-50) + ")")
            .attr("text-anchor", "middle")
            .style("fill", "black")
            .style("font-size","12px")
            .text("Year");

        group.append("text")
          .attr("class", "group-label")
          .attr("x", -6)
          .attr("y", function (d) { return y1((d.values[0].Population) / 2); })
          .attr("dy", ".35em")
          .text(function (d) { return d.key; });

        group.filter(function (d, i) { return !i; }).append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y0.rangeBand() + ")")
            .call(xAxis);


        d3.selectAll("input").on("change", change);

        // var timeout = setTimeout(function () {
        //     d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
        // }, 2000);

        function change() {
            clearTimeout(timeout);
            if (this.value === "multiples") transitionMultiples();
            else transitionStacked();
        }

        function transitionMultiples() {
            var t = svg.transition().duration(750),
                g = t.selectAll(".group").attr("transform", function (d) { return "translate(0," + y0(d.key) + ")"; });
            g.selectAll("rect").attr("y", function (d) { return y1(d.Population); });
            g.select(".group-label").attr("y", function (d) { return y1(d.values[0].Population / 2); })
        }

        function transitionStacked() {
            var t = svg.transition().duration(750),
                g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
            g.selectAll("rect").attr("y", function (d) { return y1(d.Population + d.valueOffset); });
            g.select(".group-label").attr("y", function (d) { return y1((d.values[0].Population / 2) + d.values[0].valueOffset); })
        }

    }

function bubbleMap(){

  function createVisitMap(divId, worldmap, data) {

  var width = 1200,
      height = 800;

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
          .attr("height", height)
            .attr("class", "bcountry");

  var projection = d3.geo.mercator()
          .translate([width / 2, height / 1.5])
          .scale(width/2/Math.PI)
          .scale(height*0.72/Math.PI)
          // .scale(115)

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

      var states = svg.selectAll(".bcountry")
              .data(worldmap.features)
              .enter().append("path")
              .attr("d", path)
              .attr("class", "bcountry")
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

        mapfeatures=mapdata.features;

        mapfeatures.forEach(function(d,i){
            for(l=0;l<sam.length;l++)
                if(d.properties.name==sam[l].Country)
                {
                    mapfeatures[i].Density=sam[l].Density
                }
        })

        var radius= d3.scale.sqrt().domain([0, 25411]).range([0,300])

        var bubble = svg.selectAll("circle")
                .data(mapfeatures)
                .attr("class", "dcircle")
                .enter()
                .append("circle")
                .attr("transform", function(d){return "translate(" + path.centroid(d)+")";})
                .attr("r", function(d){ return radius(d.Density)})
                .style("opacity", 0.4)
                .attr("fill", "#AC4040")
                .attr("stroke", "white")
                .attr("stroke-width", "1px")


        // states.attr("class", "country")
        //     .style("fill", function (d) {
        //         return color(fpopdata.get(d.properties.name));
        //     })
          states.attr("class", "country")
              .style("fill", "#aaa")

      var legendSize = 150;
      var numLevels = 150;
          d3.selectAll('.country')
      .on("click", function (d, i) {
        // d3.selectAll(".country").classed("highlight",false)
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
      createVisitMap("#bubble", worldmap, pdata);
  }
  queue()
    .defer(d3.json, "https://api.myjson.com/bins/5bi34")
    .await(processData);

};
bubbleMap();

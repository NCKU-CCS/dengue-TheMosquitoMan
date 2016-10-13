var data_url2 ='tmpdata-master/breeding_source_20160912.json';
var data_url ='https://s3-ap-northeast-1.amazonaws.com/dengue-test/breeding-sources/heatmap_blurred.json';

var dataThree=[],dataFive=[],dataSeven=[],dataAll=[];

var datas = getdata(data_url);
var data2=[{"value":20},{"value":30}];  // indoor outdoor
var svg=null;

/*
$.fn.scrollView = function () {
    console.log("ScollFn");
    return this.each(function () {
        $('html,body').animate({
            scrollTop: $(this).offset().top-screen.height*0.025
        }, "fast");
    });
}
*/

var mon={"Jan":"1", "Feb":"2", "Mar":"3", "Apr":"4", "May":"5", "Jun":"6",
  "Jul":"7", "Aug":"8", "Sep":"9", "Oct":"10", "Nov":"11", "Dec":"12"};


        //var month=datas.generated_time.substr(datas.generated_time.indexOf(" "),datas.generated_time.indexOf(" ")+2);
        var day=datas.generated_time.split(" ");
        var index=day.indexOf("");
        if(index != -1)
        {
            day.splice(index,1);
        }
        var date=[day[2],day[4],mon[day[1]]];



        datas.data.forEach(function(d){
            //var date=d.update_time.substr(0,10).split("-");
            if(judgeDate(date,"all")==="1")
            {
                var tmp=[d.lat,d.lng,1];
                dataAll.push(tmp);

                if(judgeDate(date,"7")==="1")
                {
                    var tmp=[d.lat,d.lng,1];
                    dataSeven.push(tmp);

                    if(judgeDate(date,"5")==="1")
                    {
                        var tmp=[d.lat,d.lng,1];
                        dataFive.push(tmp);

                        if(judgeDate(date,"3")==="1")
                        {
                            var tmp=[d.lat,d.lng,1];
                            dataThree.push(tmp);
                        }
                    }
                }
            }
        })



var v=0;
var nowValue="all";
var trans={"3":"最近三天間","5":"最近五天間","7":"最近七天間","all":"至今所有"}

$('.ui.dropdown').dropdown();



            $('.dropdown').dropdown({
                onChange: function(value,text) {
                  console.log(text);
                  if(value===""){

                  }
                  else{
                    v=v+1;
                    nowValue=value;
                    heatMap(value);
                    document.getElementById("header").innerHTML = trans[nowValue]+"環境回報分布圖";
                  }
                }
              });



            var heats = new L.LayerGroup(),mymap;

            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (mymap) {

                var div = L.DomUtil.create('div', 'info legend');
                div.innerHTML+='<span class = "legend-header">區域內舉報數（個）</span><HR>'

                // loop through our density intervals and generate a label with a colored square for each interval

                div.innerHTML += '<i style="background:linear-gradient(to bottom, rgba(106,90,205,0.7) 0%,rgba(255,215,0,0.4) 50%,rgba(255,0,0,1) 100%);"></i>';

                div.innerHTML += '0<br>&#8768;<br>30 +'

                return div;
            };

            var btn = L.control({position: 'bottomright'});
            btn.onAdd = function (mymap){
                var div = L.DomUtil.create('div', 'ui button quit');
                div.innerHTML+='<span class = "title">改變調查區間</span>'
                return div;
            }
            $(document).on("click", ".ui.button.quit", function () {
                $('.ui.dropdown')
                    .dropdown('restore defaults');
                removeMap();
            });

            heatMap("all");



function getdata(data_url){
    var tmp  = null;
    $.ajax({
        'async': false,
        url: data_url,
        type: 'GET',
        success: function(data) {
            tmp = data;
        }
    });
    return tmp;
}



function heatMap(value){

        switch(value)
        {
            case "3":
                var breedPoints=dataThree;
                break;
            case "5":
                var breedPoints=dataFive;
                break;
            case "7":
                 var breedPoints=dataSeven;
                break;
            case "all":
                 var breedPoints=dataAll.slice();
                break;
        }
        var center=[0,0],max=30;

        if(breedPoints.length > 0){ //none empty
            if(mymap == null){
                //$('.description').remove();
                $('.no_content').remove();
                $('.mapM').append('<div id="mapid"></div>');
                //$('.mainT').prepend('<div id="mapid"></div>');

                mymap = L.map('mapid').setView([22.9971,120.2126], 15);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
                }).addTo(mymap);

                btn.addTo(mymap);
                legend.addTo(mymap);

            //locate
                var lc = L.control.locate({
                    strings: {
                        title: "Show me where I am, yo!"
                    }
                }).addTo(mymap);
                $('.description').prepend('<h2 class="DayTitle" id="header"></h2>');
                document.getElementById("header").innerHTML = trans[nowValue]+"環境回報分布圖";
                $('.compare').append('<p id="first"></p>\
                                      <p id="second"></p>');

            }

            mymap.removeLayer(heats);
            heats = new L.LayerGroup();

            // heat map
            breedPoints = arrayUnique(breedPoints);

            var xArr=[],yArr=[];

            breedPoints.forEach(function(d){
                d[2] = d[2]/max;

                xArr.push(d[0]);
                yArr.push(d[1]);
            })

            if(filterOutliers(xArr).length!=0)
            {
                xArr=filterOutliers(xArr);
                yArr=filterOutliers(yArr);
            }

            center=[sum(xArr)/xArr.length,sum(yArr)/yArr.length];
            mymap.setView(center,16);

            var heat = L.heatLayer(breedPoints,{
                radius: 25,
                blur: 17,
                minOpacity:0.4,
                gradient: {
                    0.4: 'SlateBlue',
                    0.6: 'Gold',
                    1: 'red',
                }
            }).addTo(heats);

            mymap.addLayer(heats);
            //$('#mapid').scrollView();

            if(svg===null)
            {
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                    width = 350 - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

                 svg = d3.select(".svgPlot").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var z = d3.scale.category20b()
                      .range(["#74c476","#c6dbef"]);

                var radius = 240 / 2;
                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);
                var arc2 = d3.svg.arc() //the bigger one when click the pie chart
                    .outerRadius(132)
                    .innerRadius(0);
                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.value; });


                var path = svg.datum(data2).selectAll(".pie")
                      .data(pie)
                      .enter().append("path")
                      .attr("class", "pie")
                      .attr("transform",  "translate(120,120)" )
                      .style("opacity",0.95)
                      .attr("fill", function(d, i) { return z(i); })
                      .attr("d", arc)
                      .each(function(d) { this._current = d; })


                var legendClassArray = [];
                var legend2 = svg.selectAll(".leg")
                      .data(z.domain().slice().reverse())
                      .enter().append("g")
                      .attr("class", function (d) {
                        legendClassArray.push(d);
                        return "leg";
                      })
                      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
                  //reverse order to match order in which bars are stacked
                  legendClassArray = legendClassArray.reverse();

                  legend2.append("rect")
                      .attr("x",270)
                      .attr("y",2)
                      .attr("width", 18)
                      .attr("height", 18)
                      .style("fill", z);

                  legend2.append("text")
                      .attr("x", 290)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .style("font-size","14px")
                      .style("font-weight","normal")
                      .text(function(d) {
                        switch(d)
                        {
                          case 0:
                            return "室外"
                          case 1:
                            return "室內"
                          default:
                        }
                      });

            }else{  //update pie plot
                //if(v!=0){piePlot(inOut)};
            }


            if(data2[0].value<data2[1].value){
                document.getElementById("first").innerHTML = "目前室內回報數 > 室外回報數";
                document.getElementById("second").innerHTML = "請多注意室內周遭積水髒亂處";
            }else{
                document.getElementById("first").innerHTML = "目前室外回報數 > 室內回報數";
                document.getElementById("second").innerHTML = "請多注意室外周遭積水髒亂處";
            }

        }else{
            console.log("none of any event");
            removeMap();
            //$('.description').remove();
            $('.title').append('<div class="no_content">\
                                    <img src="image/no_content.png"> \
                                    <h4>此區間暫無調查資料</h4>\
                                </div>');
        }
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i][0] === a[j][0] && a[i][1] === a[j][1])
            {
                a[i][2]++;
                a.splice(j--, 1);
            }
        }
    }

    return a;
}

function filterOutliers(someArray) {

    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort( function(a, b) {
            return a - b;
         });

    /* Then find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    var q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3.
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    var filteredValues = values.filter(function(x) {
        return (x < maxValue) && (x > minValue);
    });

    // Then return
    return filteredValues;
}

function sum(array) {
    var s = array.reduce(function(pv, cv) { return pv + cv; }, 0);
    return s;
}

function removeMap(){
    $('.no_content').remove();
    $('#mapid').remove();
    if(mymap != null){
        mymap.remove();
        mymap=null;
        console.log("move");
    }
    $('#first').remove();
    $('#second').remove();
    $('svg').remove();
    svg=null;
    $('.DayTitle').remove();
}


function judgeDate(date,slice){
    var d = new Date();
    var dd = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
    var dTime=new Date(dd); //today's AM 12:00

    if(date[1].substr(0,1)==="0"){
        date[1]=date[1].substr(1,2);
    }
    if(date[2].substr(0,1)==="0"){
        date[2]=date[2].substr(1,2);
    }

    var d2 = new Date(date[1]+"/"+date[2]+"/"+date[0]);
    if(slice==="all"){
        return "1";
    }

    //console.log(dTime);
    //console.log(d2);

    if(dTime.getTime() - d2.getTime()>((parseInt(slice)-1)*24*60*60*1000)){ //out of range
        return "0";
    }
    else{
        return "1";
    }
}



function piePlot(data)
{
    console.log("update");
  var path = svg.datum(data).selectAll(".pie");

  pie.value(function(d) { return d.value; }); // change the value function
  path = path.data(pie); // compute the new angles
  path.transition().duration(300).attrTween("d", arcTween); // redraw the arcs
}

function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
}
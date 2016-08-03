function createCORSRequest(method,url){

    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}



var memoryData = [];
var cpuData = [];
var dataset;
var updateInterval = 1000;
var now = new Date().getTime();

function FetchStatusData(callback){
  var xhr;
  console.log('trying to fetch data');
  xhr = createCORSRequest('GET','http://localhost:10011/v1/status/frontend-fib');
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  xhr.onload = function() {
    var responseText = xhr.responseText;
    var responseObj = JSON.parse(responseText)
    console.log("Response object"+responseObj.toString());
    console.log("Response object : => "+ responseObj);
    //if(responseObj && responseObj.lastMetrics){
    $('#serviceName').html(responseObj.serviceName)
    $('#instanceCount').html(responseObj.instanceCount)
    $('#evaluationState').html(responseObj.evaluationState)
    $('#latency').html(responseObj.lastMetrics.latency + " ms")

    gaugeOpts.series[0].data[0].value = responseObj.lastMetrics.cpu.toFixed(2);
    gaugeOpts.series[0].axisLine.lineStyle.color[0][0] = (responseObj.desiredState.cpu_min / 100).toFixed(2);
    gaugeOpts.series[0].axisLine.lineStyle.color[1][0] = (responseObj.desiredState.cpu_max / 100).toFixed(2);
    cpuGauge.setOption(gaugeOpts);

    gaugeOpts.series[0].data[0].value = responseObj.lastMetrics.memory.toFixed(2);
    gaugeOpts.series[0].axisLine.lineStyle.color[0][0] = (responseObj.desiredState.mem_min / 100).toFixed(2);
    gaugeOpts.series[0].axisLine.lineStyle.color[1][0] = (responseObj.desiredState.mem_max / 100).toFixed(2);
    memGauge.setOption(gaugeOpts);

    callback({"memory":[responseObj.timestamp,responseObj.lastMetrics.memory],"cpu":[responseObj.timestamp,responseObj.lastMetrics.cpu]})
    //}
  };

  xhr.onerror = function() {
    console.log('There was an error!');
  };
  xhr.send();
}


function GetData() {
  if(memoryData.length > 10){
    memoryData.shift();
  }
  if(cpuData.length >10){
    cpuData.shift();
  }

    FetchStatusData(function(sampleData){
      console.log("adding data");
      memoryData.push(sampleData.memory);
      cpuData.push(sampleData.cpu);
    })
}

var options = {
  series: {
    lines: {
      show: true,
      lineWidth: 3,
      fill: false
    },
    /*splines: {
      show: true,
      tension: 0.4,
      lineWidth: 5,
      fill: false
    },
    points: {
      radius: 0,
      show: true
    },*/
    shadowSize: 2
  },
  xaxis: {
    axisLabel: "Time",
    axisLabelUseCanvas: true,
    tickFormatter: function (v, axis) {
      var date = new Date(0);
      date.setUTCSeconds(v);

      var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      //alert('returning'+hours + ":" + minutes + ":" + seconds)
      return hours + ":" + minutes + ":" + seconds;

    },
    axisLabelFontSizePixels: 12,
    axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
    axisLabelPadding: 5
  },
  yaxis: {
    min: 0,
    max: 100,
    tickSize: 5,
    tickFormatter: function (v, axis) {
      if (v % 10 == 0) {
        return v + "%";
      } else {
        return "";
      }
    },
    axisLabel: "Utilization",
    axisLabelUseCanvas: true,
    tickColor: "rgba(51, 51, 51, 0.06)",
    axisLabelFontSizePixels: 12,
    axisLabelFontFamily: 'Verdana, Arial',
    axisLabelPadding: 6
  }
};

$(document).ready(function () {
  GetData();

  dataset = [{
    label: "CPU",
    color:"#3498DB",
    data: cpuData
  },{
    label: "Memory",
    color:"#26B99A",
    data: memoryData
  }];

  $("#canvas_dahs").length && $.plot($("#canvas_dahs"), dataset, options);

  function update() {
    GetData();

    $("#canvas_dahs").length && $.plot($("#canvas_dahs"), dataset, options)
    setTimeout(update, updateInterval);
  }

 setInterval(update(),2000);
});

$(document).ready(function() {
  var icons = new Skycons({
            "color": "#73879C"
          }),
          list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
          ],
          i;

  for (i = list.length; i--;)
    icons.set(list[i], list[i]);

  icons.play();
});

$(document).ready(function(){
  var options = {
    legend: false,
    responsive: false
  };

  new Chart(document.getElementById("canvas1"), {
    type: 'doughnut',
    tooltipFillColor: "rgba(51, 51, 51, 0.55)",
    data: {
      labels: [
        "Symbian",
        "Blackberry",
        "Other",
        "Android",
        "IOS"
      ],
      datasets: [{
        data: [15, 20, 30, 10, 30],
        backgroundColor: [
          "#BDC3C7",
          "#9B59B6",
          "#E74C3C",
          "#26B99A",
          "#3498DB"
        ],
        hoverBackgroundColor: [
          "#CFD4D8",
          "#B370CF",
          "#E95E4F",
          "#36CAAB",
          "#49A9EA"
        ]
      }]
    },
    options: options
  });
});

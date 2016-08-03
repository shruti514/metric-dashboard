
var testing = "testing";


var cpuGauge = echarts.init(document.getElementById('cpu_gauge'), theme);
var memGauge = echarts.init(document.getElementById('mem_gauge'), theme);
cpuGauge.setOption(gaugeOpts, true);
memGauge.setOption(gaugeOpts, true);

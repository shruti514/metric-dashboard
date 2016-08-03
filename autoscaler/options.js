

var gaugeOpts = {
  tooltip: {
    formatter: "{a} <br/>{b} : {c}%"
  },
  toolbox: {
    show: true,
    feature: {
      restore: {
        show: true,
        title: "Restore"
      },
      saveAsImage: {
        show: true,
        title: "Save Image"
      }
    }
  },
  series: [{
    name: 'Performance',
    type: 'gauge',
    center: ['50%', '50%'],
    startAngle: 140,
    endAngle: -140,
    min: 0,
    max: 100,
    precision: 0,
    splitNumber: 10,
    axisLine: {
      show: true,
      lineStyle: {
        color: [
          [0.00, 'skyblue' ],
          [0.0, 'lightgreen' ],
          [1, '#ff4500']
        ],
        width: 30
      }
    },
    axisTick: {
      show: true,
      splitNumber: 5,
      length: 8,
      lineStyle: {
        color: '#eee',
        width: 1,
        type: 'solid'
      }
    },
    axisLabel: {
      show: true,
      formatter: function(v) {
        switch (v + '') {
          case '10':
            return 'Min';
          case '90':
            return 'Max';
          default:
            return '';
        }
      },
      textStyle: {
        color: '#333'
      }
    },
    splitLine: {
      show: true,
      length: 30,
      lineStyle: {
        color: '#eee',
        width: 2,
        type: 'solid'
      }
    },
    pointer: {
      length: '80%',
      width: 8,
      color: 'auto'
    },
    title: {
      show: true,
      offsetCenter: ['-65%', -10],
      textStyle: {
        color: '#333',
        fontSize: 15
      }
    },
    detail: {
      show: true,
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      borderColor: '#ccc',
      width: 100,
      height: 40,
      offsetCenter: ['-60%', 10],
      formatter: '{value}%',
      textStyle: {
        color: 'auto',
        fontSize: 30
      }
    },
    data: [{
      value: 50,
      name: 'Performance'
    }]
  }]
};

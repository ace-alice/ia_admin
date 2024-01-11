export function getOptions(
  data: Array<any> = [],
  chartAxis: Array<any> = [],
) {
  return {
    // xAxis: {
    //   type: 'category',
    //   boundaryGap: false,
    //   data: chartAxis,
    // },
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'cross',
    //     label: {
    //       backgroundColor: '#6a7985',
    //     },
    //   },
    // },
    // yAxis: {
    //   type: 'value',
    //   minInterval: 1,
    // },
    // series: [
    //   {
    //     data,
    //     type: 'line',
    //     smooth: true,
    //     lineStyle: {
    //       color: 'rgb(73, 169, 238)',
    //     },
    //     label: {
    //       show: true,
    //     },
    //     itemStyle: {
    //       color: 'rgb(73, 169, 238)',
    //     },
    //   },
    // ],
    xAxis: {
      type: 'category',
      data: chartAxis,
    },
    tooltip: {
      trigger: 'axis',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data,
        type: 'line',
        smooth: true,
      },
    ],
  }
}


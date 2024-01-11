<template>
    <div class="chart-container">
      <h6 class="title">{{ chartTitle }}</h6>
      <div class="chart" v-show="chartData.length > 0" :id="chartId"></div>
      <div class="chart nodata" v-show="chartData.length === 0" :id="chartId">暂无数据</div>
    </div>
  </template>
  
  <script lang="ts">
  import {
    defineComponent,
    onMounted,
    onUnmounted,
    watch
  } from 'vue';
  import * as echarts from 'echarts';
  import { getOptions } from './options';
  
  export default defineComponent({
    props: {
      chartTitle: {
        type: String,
        default: ''
      },
      chartData: {
        type: Array,
        default: () => []
      },
      chartAxis: {
        type: Array,
        default: () => []
      },
      chartId: {
        type: String,
        required: true,
        default: ''
      }
    },
    setup(props) {
      const { chartId } = props;
  
      let myChart: any = null;
      const initChart = async () => {
        if (myChart != null) {
          myChart.dispose();
          myChart = null;
        }
        myChart = await echarts.init(
          <HTMLElement>document.getElementById(chartId)
        );
        const option = getOptions(props.chartData, props.chartAxis);
        console.log("option",option)
        myChart.setOption(option);
        myChart.resize();
      }
  
      watch(
        () => props.chartData,
        (newVal) => {
          initChart();
        },
        {
          deep: true
        }
      );
  
      onMounted(() => {
        initChart();
        window.addEventListener('resize', () => {
          if (myChart) {
            myChart.resize();
          }
        });
      });
  
      onUnmounted(() => {
        if (myChart) {
          myChart.dispose();
          myChart = null;
        }
        window.removeEventListener('resize', () => {
          if (myChart) {
            myChart.dispose();
            myChart = null;
          }
        });
      });
  
      return {
        initChart
      };
    }
  });
  </script>
  
  
  <style lang="scss" scoped>
  .chart-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    .title {
      font-size: 16px;
      line-height: 34px;
      border-bottom: 1px solid #eee;
      margin: 0;
    }
    .chart {
      flex: 1;
      width: 100%;
    }
    .nodata {
      font-size: 20px;
      text-align: center;
      line-height: 100px;
      color: #aaa;
    }
  }
  </style>
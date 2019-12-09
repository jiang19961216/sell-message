<template>
  <div class="home">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据统计</span>
      </div>
      <div>
        <!-- 数据统计组件 -->
        <!-- 1. 准备一个盒子（有宽和高） -->
        <div id="box" style="height: 460px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getIndexData } from "@/api/order";

export default {
  methods: {
    // 绘制报表的函数
    drawCharts(xArr, orderData, amountData) {
      // a. 初始化dom容器
      let myCharts = this.echarts.init(document.getElementById("box"));
      // b. 准备配置数据
      let option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["订单统计", "金额统计"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xArr // 动态数据
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        // 核心配置
        series: [
          {
            name: "订单统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: orderData // 动态数据
          },
          {
            name: "金额统计",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: amountData // 动态数据
          }
        ]
      };
      // c. 使用配置生成报表
      myCharts.setOption(option);
    }
  },
  // echarts是需要使用选择器选中dom的， mounted里面才可以操作dom
  async mounted() {
    // 获取后端数据
    let { xData, orderData, amountData } = await getIndexData();
    // 调用函数 创建报表
    this.drawCharts(xData, orderData, amountData);
  }
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="order-detail">
    <h1 style="font-weight: 700; margin-bottom: 30px;">订单详情</h1>
    <p>
      订单号:
      <span v-show="visible">{{ orderDetail.orderNo }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.orderNo" />
    </p>
    <p>
      下单时间:
      <span v-show="visible">{{ orderDetail.orderTime }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.orderTime" />
    </p>
    <p>
      手机号:
      <span v-show="visible">{{ orderDetail.phone }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.phone" />
    </p>
    <p>
      收货人:
      <span v-show="visible">{{ orderDetail.consignee }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.consignee" />
    </p>
    <p>
      配送地址:
      <span v-show="visible">{{ orderDetail.deliverAddress }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.deliverAddress" />
    </p>
    <p>
      送达时间:
      <span v-show="visible">{{ orderDetail.deliveryTime }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.deliveryTime" />
    </p>
    <p>
      备注:
      <span v-show="visible">{{ orderDetail.remarks }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.remarks" />
    </p>
    <p>
      订单金额:
      <span v-show="visible">{{ orderDetail.orderAmount }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.orderAmount" />
    </p>
    <p>
      订单状态:
      <span v-show="visible">{{ orderDetail.orderState }}</span>
      <input v-show="!visible" type="text" v-model="orderDetail.orderState" />
    </p>

    <el-button type="primary" @click="handleClick">{{ visible ? '编辑' : '保存' }}</el-button>
  </div>
</template>

<script>
import { editOrder } from "@/api/order";

export default {
  data() {
    return {
      orderDetail: {},
      visible: true
    };
  },
  methods: {
    async handleClick() {
      if (!this.visible) {
        //  发送修改订单的请求
        await editOrder(this.orderDetail);
      }
      this.visible = !this.visible;
    }
  },
  created() {
    // 获取数据
    // console.log(
    //   "获取数据方式1:",
    //   JSON.parse(window.sessionStorage.getItem("row"))
    // );

    this.orderDetail = JSON.parse(window.sessionStorage.getItem("row"));

    // console.log("获取params传递过来的参数:", this.$route.params.row);
    // console.log("获取query传递过来的参数:", this.$route.query.id);
  }
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class="order">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;">订单管理</span>
      </div>
      <div>
        <!-- 订单管理查询表单 -->
        <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
          <!-- 订单号 -->
          <el-form-item label="订单号">
            <el-input v-model="searchForm.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
          <!-- 收货人 -->
          <el-form-item label="收货人">
            <el-input v-model="searchForm.consignee" placeholder="收货人"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <!-- 订单状态 -->
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderState" placeholder="订单状态">
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </el-form-item>

          <!-- 下单时间 -->
          <el-form-item label="下单时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
        <!-- 订单管理表格 -->
        <el-table height="400px" :data="tableData" border>
          <!-- 订单号 -->
          <el-table-column fixed prop="orderNo" label="订单号" width="100"></el-table-column>
          <!-- 下单时间 -->
          <el-table-column prop="orderTime" label="下单时间" width="160"></el-table-column>
          <!-- 手机号 -->
          <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
          <!-- 收货人 -->
          <el-table-column prop="consignee" label="收货人" width="100"></el-table-column>
          <!-- 配送地址 -->
          <el-table-column prop="deliverAddress" label="配送地址" width="150"></el-table-column>
          <!-- 送达时间 -->
          <el-table-column prop="deliveryTime" label="送达时间" width="160"></el-table-column>
          <!-- 备注 -->
          <el-table-column prop="remarks" label="备注" width="150"></el-table-column>
          <!-- 订单金额 -->
          <el-table-column prop="orderAmount" label="订单金额" width="150"></el-table-column>
          <!-- 订单状态 -->
          <el-table-column prop="orderState" label="订单状态" width="150"></el-table-column>
          <!-- 操作 -->
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row)" type="text" size="small">查询详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 30px;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import { getOrderList } from "@/api/order";
import moment from "moment";

export default {
  data() {
    return {
      // 搜索表单
      searchForm: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      },
      // 订单表格
      tableData: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  methods: {
    // 获取订单数据
    async getOrders() {
      // 获取搜索表单数据
      let { orderNo, consignee, phone, orderState, date } = this.searchForm;

      // 获取订单参数（结合了查询工具）
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo,
        consignee,
        phone,
        orderState,
        date: date == null ? JSON.stringify([]) : JSON.stringify(date)
      };

      // 发送请求 获取数据
      let { data, total } = await getOrderList(params);

      // 时间格式处理
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss");
      });

      this.tableData = data;
      this.total = total;
    },
    // 查询
    search() {
      this.getOrders(); // 调用请求函数
    },
    // 清空
    clear() {
      // 清空表单
      this.searchForm = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      };
      // 再次调用
      this.getOrders();
    },
    // 显示详情
    showDetail(row) {
      // console.log(row);
      // 页面传递数方式1
      window.sessionStorage.setItem("row", JSON.stringify(row));
      // 路由传参 方式1 params （页面不能刷新 刷新就没有了）
      // this.$router.push({ name: "orderdetail", params: { row } });

      // 路由传参 方式2
      // this.$router.push({
      //   path: "/index/orderdetail",
      //   query: { row: JSON.stringify(row) }
      // });
      // this.$router.push({
      //   path: "/index/orderdetail",
      //   query: { id: row.id }
      // });
      // 跳转到订单详情页面
      this.$router.push("/index/orderdetail");
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrders();
    }
  },
  created() {
    this.getOrders(); // 调用获取订单数据函数
  }
};
</script>

<style lang="less">
.order {
  height: 100%;
  .el-card {
    .el-card__body {
      width: 1300px;
    }
  }
}
</style>
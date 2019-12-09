<template>
  <div class="goods-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;">商品列表</span>
      </div>
      <div>
        <!-- 商品表格 -->
        <el-table :data="tableData" style="width: 100%">
          <!-- 这一列就是隐藏的那一列 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <!-- 表格 -->
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                  <span>{{ props.row.goodsname }}</span>
                </el-form-item>
                <el-form-item label="商品分类">
                  <span>{{ props.row.goodscategory }}</span>
                </el-form-item>
                <el-form-item label="商品特色">
                  <span>{{ props.row.goodsfeature | filterFeature }}</span>
                </el-form-item>
                <el-form-item label="商品图片">
                  <span>
                    <img width="100" height="100" :src="baseApi + props.row.imgUrl" alt />
                  </span>
                </el-form-item>
                <el-form-item label="是否促销">
                  <span>{{ props.row.isPromotion }}</span>
                </el-form-item>
                <el-form-item label="商品规格">
                  <span>{{ props.row.standard | filterStandard }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsdesc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="商品 ID" prop="id"></el-table-column>
          <el-table-column label="商品名称" prop="goodsname"></el-table-column>
          <el-table-column label="描述" prop="goodsdesc"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
// 引入请求商品列表的函数
import { getGoodsList, delGoods } from "@/api/goods";

export default {
  data() {
    return {
      baseApi: "http://127.0.0.1:5000/upload/imgs/",
      // 列表数据
      tableData: [],
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 5 // 每页条数
    };
  },
  methods: {
    // 获取商品列表
    async getGoods() {
      let { total, data } = await getGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoods();
    },
    // 编辑
    handleEdit(row) {
      // 把这一行的数据存入本地
      window.sessionStorage.setItem("row", JSON.stringify(row));

      // 跳转到编辑页面
      this.$router.push("/index/goodsedit");
    },
    // 删除
    handleDelete({ id }) {
      // 批量删除确认
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await delGoods({ id });
          if (code === 0) {
            this.getGoods();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    // 调用获取商品列表函数 获取数据
    this.getGoods();
  },
  filters: {
    // 过滤特色
    filterFeature(feature) {
      return JSON.parse(feature).join(" | ");
    },
    // 过滤规格
    filterStandard(standard) {
      let s = JSON.parse(standard);
      let arr = s.map(v => {
        return `规格:${v.goodsstandard} 包装费:${v.packingexpense} 价格:${v.goodsprice}`;
      });
      return arr.join(" | ");
    }
  }
};
</script>

<style lang="less">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
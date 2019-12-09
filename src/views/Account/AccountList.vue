<template>
  <div class="account-list">
    <!-- 面板 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span class="title">账号列表</span>
      </div>

      <!-- 内容 -->
      <div>
        <!-- 账号表格 -->
        <el-table
          ref="accountTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChnage"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 账号 -->
          <el-table-column prop="account" label="账号" width="180"></el-table-column>

          <!-- 用户组 -->
          <el-table-column prop="userGroup" label="用户组" width="180"></el-table-column>

          <!-- 创建时间 -->
          <el-table-column prop="ctime" label="创建时间" width="180"></el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>

        <!-- 批量删除&取消选择 -->
        <div class="batch-del-btn">
          <el-button size="small" @click="batchDel" type="danger">批量删除</el-button>
          <el-button @click="calcelSelect" size="small" type="primary">取消选择</el-button>
        </div>

        <!-- 编辑模态框 -->
        <el-dialog width="420px" title="编辑账号" :visible.sync="dialogFormVisible">
          <el-form style="width: 317px;" :model="editForm">
            <el-form-item label="账号" :label-width="formLabelWidth">
              <el-input v-model="editForm.account" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户组" :label-width="formLabelWidth">
              <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通管理员" value="普通管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求函数
import {
  getAccountList,
  delAccount,
  batchDelAccount,
  editAccount
} from "@/api/account";
import moment from "moment";

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 3, // 每页条数
      total: 0, // 数据总条数
      dialogFormVisible: false, // 模态框是否显示
      // 编辑表单
      editForm: {
        account: "",
        userGroup: ""
      },
      formLabelWidth: "100px", // 标签宽度
      ids: [] // 批量删除数据的id们
    };
  },
  methods: {
    // 请求所有账号数据
    async getAccounts() {
      let { data, total } = await getAccountList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      data.forEach(
        v => (v.ctime = moment(v.time).format("YYYY-MM-DD hh:mm:ss"))
      );

      // 如果当前页码没有数据 页码减去1 重新请求数据 (排除第一页 第一页不能减去1哦)
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1;
        this.getAccounts();
      }

      this.tableData = data;
      this.total = total;
    },
    // 编辑
    handleEdit(row) {
      this.dialogFormVisible = true; // 显示模态框
      // this.editForm = row; // 把当前选中的行的数据 赋值给表单
      // this.editForm = Object.assign({}, row); // 浅拷贝
      this.editForm = { ...row }; // 赋值一份这个对象
    },
    // 删除
    handleDelete({ id }) {
      // 删除确认框
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 确定
          let { code } = await delAccount({ id });
          // 判断
          if (code === 0) {
            // this.$message({ type: "success", message: msg });
            this.getAccounts(); // 重新请求账号列表 刷新页面
          }
        })
        // 取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 当选中状态发生改变
    handleSelectionChnage(rows) {
      this.ids = rows.map(row => row.id);
    },
    // 批量删除
    batchDel() {
      // 如果用户没有选中
      if (!this.ids.length) {
        this.$message.error("请选择以后再操作，你是不是有问题啊?");
        return;
      }

      // 批量删除确认
      this.$confirm("你确定要批量删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送批量删除请求 把所有选中数据的id数组发送给后端
          let { code } = await batchDelAccount({
            ids: JSON.stringify(this.ids)
          });
          // 判断
          if (code === 0) {
            // this.$message({ type: "success", message: msg });
            this.getAccounts(); // 刷新列表
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccounts();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccounts();
    },
    // 取消选择
    calcelSelect() {
      this.$refs.accountTable.clearSelection();
    },
    // 保存修改
    async saveEdit() {
      this.dialogFormVisible = false; // 关闭模态框
      let { id, account, userGroup } = this.editForm;
      let { code } = await editAccount({ id, account, userGroup });
      if (code === 0) {
        // this.$message({ type: "success", message: msg });
        this.getAccounts(); // 刷新列表
      }
    }
  },
  created() {
    this.getAccounts(); // 调用函数 请求所有数据
  }
};
</script>

<style lang="less" scoped>
.account-list {
  .el-card {
    .el-card__header {
      .title {
        font-weight: 700;
      }
    }
    .el-card__body {
      .pagination {
        margin-top: 30px;
      }
      .batch-del-btn {
        margin-top: 30px;
      }
    }
  }
}
</style>
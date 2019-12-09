<template>
  <div class="account-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">账号添加</span>
      </div>
      <div>
        <!-- 账号添加表单 -->
        <el-form
          size="medium"
          :model="accountAddForm"
          status-icon
          :rules="rules"
          ref="accountAddForm"
          label-width="100px"
        >
          <!-- 账号 -->
          <el-form-item label="账号" prop="account">
            <el-input type="text" v-model="accountAddForm.account" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="accountAddForm.password" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 用户组 -->
          <el-form-item label="用户组" prop="userGroup">
            <el-select v-model="accountAddForm.userGroup" placeholder="请选择用户组">
              <el-option label="普通管理员" value="普通管理员"></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
            </el-select>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入工具函数正则
import { passwordReg } from "@/utils/reg";

// 引入接口函数
import { addAccount } from "@/api/account";
import { async } from "q";

export default {
  data() {
    // 自定义验证密码
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg));
      } else {
        callback();
      }
    };

    return {
      // 账号添加表单
      accountAddForm: {
        account: "",
        password: "",
        userGroup: ""
      },
      // 验证规则
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 ~ 8 位之间", trigger: "blur" }
        ],
        password: {
          required: true,
          validator: validatePassword,
          trigger: "blur",
          msg: "必须包含数字和英文，长度4 ~ 12",
          reg: passwordReg
        },
        userGroup: {
          required: true,
          message: "请选择用户组",
          trigger: "change"
        }
      }
    };
  },
  methods: {
    // 添加
    submitForm() {
      // 触发所有验证
      this.$refs.accountAddForm.validate(async valid => {
        if (valid) {
          // 发送添加账号请求
          let { code } = await addAccount(this.accountAddForm);

          // 判断
          if (code === 0) {
            // this.$message({ type: "success", message: msg }); // 弹
            this.$router.push("/index/accountlist"); // 跳
          }
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.accountAddForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.account-add {
  .el-card {
    .el-card__header {
      .title {
        font-weight: 700;
      }
    }
    .el-card__body {
      .el-form {
        width: 317px;
      }
    }
  }
}
</style>
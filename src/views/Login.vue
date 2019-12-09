<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="login-form"
    >
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          prefix-icon="iconfont icon-icon_account"
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          @click.native="changeVisible"
          prefix-icon="iconfont icon-mima"
          :suffix-icon="visible ? 'iconfont icon-yanjing_kai' : 'iconfont icon-yanjing_bi'"
          @keydown.native.enter="submitForm"
          :type="visible ? 'text' : 'password'"
          v-model="loginForm.password"
          auto-complete="off"
        ></el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入密码正则
import { passwordReg } from "@/utils/reg";
// 引入接口请求函数
import { checkLogin } from "@/api/account";
// 引入本地存储工具函数
import local from "@/utils/local";

export default {
  data() {
    // 自定义验证密码
    const validatePassword = (rule, value, callback) => {
      // rule: 验证规则对象  value: 用户输入的值  callback 回调函数
      if (value == "") {
        callback(new Error("请输入密码")); // 错误提示
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg)); // 错误提示
      } else {
        callback(); // 成功的回调
      }
    };

    return {
      // 登录表单
      loginForm: {
        account: "",
        password: ""
      },
      // 验证规则
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }, // 内置非空
          { min: 3, max: 8, message: "长度在 3 ~ 8 位之间", trigger: "blur" } // 内置长度
        ],
        password: {
          // 自定义验证
          required: true,
          validator: validatePassword,
          trigger: "blur",
          reg: passwordReg,
          msg: "必须包含数字和英文，长度4 ~ 12"
        }
      },
      // 密码是否可见
      visible: false
    };
  },
  methods: {
    // 切换密码可见
    changeVisible(e) {
      // 精确判断 如果点击的是眼睛图标
      if (e.target.className.includes("icon-yanjin")) {
        this.visible = !this.visible;
      }
    },
    // 登录
    submitForm() {
      // 选中整个form表单，触发"所有"验证
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 如果valid是true 证明所有前端验证已经通过 可以发送给后端
          let { code, token, role } = await checkLogin(this.loginForm);
          if (code === 0) {
            // 把token存入本地
            local.set("tk", token);
            local.set("u_r", role);
            this.$router.push("/index");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
  height: 100%;
  background-color: #304156;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 420px;
    .el-form-item {
      .el-form-item__label {
        color: #fff;
      }
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
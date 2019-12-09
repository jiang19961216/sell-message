<template>
  <div class="password-modify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">修改密码</span>
      </div>

      <div>
        <!-- 修改密码表单 -->
        <el-form
          size="medium"
          :model="passwordModifyForm"
          status-icon
          :rules="rules"
          ref="passwordModifyForm"
          label-width="100px"
        >
          <!-- 原密码 -->
          <el-form-item label="原密码" prop="oldPwd">
            <el-input type="password" v-model="passwordModifyForm.oldPwd" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="passwordModifyForm.newPwd" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 确认新密码 -->
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="passwordModifyForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 确定 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入密码验证工具函数
import { passwordReg } from "@/utils/reg";
import { checkOldPassword, editPassword } from "@/api/account";
import local from "@/utils/local";

export default {
  data() {
    // 自定义验证旧密码
    const checkOldPwd = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入旧密码"));
      }

      // 发送ajax请求 把旧密码发送给后端 验证是否正确
      let { code, msg } = await checkOldPassword({ oldPwd: value });
      if (code === "11") {
        callback(new Error(msg)); // 失败提示
      } else {
        callback(); // 成功提示
      }
    };

    // 自定义验证新密码
    const validateNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error(rule.msg));
      } else {
        // 反向验证一致性
        if (this.passwordModifyForm.checkPass !== "") {
          // 手动再次出发一致性校验
          this.$refs.passwordModifyForm.validateField("checkPass");
        }

        callback();
      }
    };

    // 自定义验证确认新密码
    const validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordModifyForm.newPwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    return {
      // 密码修改表单
      passwordModifyForm: {
        oldPwd: "",
        newPwd: "",
        checkPass: ""
      },
      // 验证规则
      rules: {
        oldPwd: { required: true, validator: checkOldPwd, trigger: "blur" },
        newPwd: {
          required: true,
          validator: validateNewPwd,
          trigger: "blur",
          msg: "必须包含数字和英文，长度4 ~ 12",
          reg: passwordReg
        },
        checkPass: {
          required: true,
          validator: validateCheckPass,
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    // 确定
    submitForm() {
      // 触发整个表单所有验证
      this.$refs.passwordModifyForm.validate(async valid => {
        if (valid) {
          // 发送修改密码请求
          let { code } = await editPassword({
            newPwd: this.passwordModifyForm.newPwd
          });

          if (code === 0) {
            // 清除本地token
            local.remove("tk");

            // 跳转到登录页
            this.$router.push("/login");
          }
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm() {
      this.$refs.passwordModifyForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.password-modify {
  .el-card {
    .el-card__header {
      .title {
        font-weight: 700;
      }
    }
    .el-card__body {
      .el-form {
        width: 320px;
      }
    }
  }
}
</style>
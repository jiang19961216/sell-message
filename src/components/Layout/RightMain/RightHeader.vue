<template>
  <div class="right-header">
    <!-- 左侧面包屑 -->
    <div class="left-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="bread in breadArr"
          :key="bread.title"
          :to="{ path: bread.path }"
        >{{ bread.title }}</el-breadcrumb-item>

        <!-- 
          我们要什么结构的数据呢:
            [
              { path: '/index', title: '首页' },
              { path: '/index/accountlist', title: '账号管理' },
              { path: '/index/accountadd', title: '账号添加' },
            ]

        -->
      </el-breadcrumb>
    </div>
    <!-- 右侧 -->
    <div class="right-box">
      <div class="welcome">欢迎你，{{ accountInfo.account }}</div>
      <div class="img-wrap">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img
              v-if="accountInfo.imgUrl"
              width="50"
              height="50"
              :src="baseApi + accountInfo.imgUrl"
              alt
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
// 引入本地存储工具函数
import local from "@/utils/local";
import { getAccountInfo } from "@/api/account";

export default {
  data() {
    return {
      baseApi: "http://127.0.0.1:5000/upload/account/",
      accountInfo: {}, // 账号数据对象
      breadArr: [] // 面包屑数组
    };
  },
  methods: {
    // 点击下拉菜单项触发
    handleCommand(command) {
      if (command === "personal") {
        // 那么点击的是个人中心 之后我们跳转到个人中心页面即可
        this.$router.push("/index/personal");
      } else if (command === "logout") {
        // 清除本地token
        local.remove("tk");
        // 弹出友好的提示
        this.$message({
          type: "success",
          message: "退出成功，欢迎回来！哥哥"
        });
        // 退出系统
        this.$router.push("/login");
      }
    },
    // 获取账号数据
    async getInfo() {
      // 获取账号数据
      let { accountInfo } = await getAccountInfo();
      this.accountInfo = accountInfo;
    }
  },
  created() {
    this.breadArr = this.$route.meta.breadArr;
    this.getInfo();

    // 监听个人中心发给我的数据
    this.$bus.$on("updataAvatar", () => {
      this.getInfo(); // 重新请求数据
    });
  },
  // 观察路由变化
  watch: {
    "$route.path"() {
      // console.log("路由地址变化了!");
      this.breadArr = this.$route.meta.breadArr;
    }
  }
};
</script>

<style lang="less" scoped>
.right-header {
  flex: 0 0 60px;
  line-height: 60px;
  background-color: #fff;
  padding: 0 50px 0 20px;
  box-sizing: border-box;
  display: flex;
  .left-box {
    flex: 1;
    line-height: 60px;
    .el-breadcrumb {
      height: 60px;
      line-height: 60px;
    }
  }
  .right-box {
    flex: 0 0 200px;
    display: flex;
    .welcome {
      flex: 1;
    }
    .img-wrap {
      flex: 0 0 50px;
      height: 50px;
      margin-top: 5px;
      .el-dropdown {
        width: 100%;
        height: 100%;
        .el-dropdown-link {
          width: 100%;
          height: 100%;
          display: inline-block;
          border-radius: 50%;
          text-align: center;
          img {
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
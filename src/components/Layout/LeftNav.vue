<template>
  <div class="left-nav">
    <div class="title">
      <img width="50" height="50" src="../../assets/imgs/logo.svg" alt />
      <h1>外卖商家中心</h1>
    </div>
    <!-- 左侧导航 -->
    <el-menu
      background-color="#304156"
      text-color="#fff"
      unique-opened
      :default-active="activePath"
      router
    >
      <template v-for="item in accessMenu">
        <!-- 没有儿子的 -->
        <el-menu-item v-if="!item.children" :index="item.path" :key="item.title">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>

        <!-- 有儿子的 -->
        <el-submenu v-else :index="item.index" :key="item.title">
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.title"
            :index="child.path"
          >{{ child.title }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import local from "@/utils/local";

export default {
  data() {
    return {
      // 菜单数据
      menus: [
        // 1后台首页
        {
          path: "/index",
          icon: "icon-liuliangyunpingtaitubiao02",
          title: "后台首页",
          meta: ["super", "normal"]
        },
        // 2订单管理
        {
          path: "/index/order",
          icon: "icon-6",
          title: "订单管理",
          meta: ["super", "normal"]
        },
        // 3商品管理
        {
          index: "goodsmanage",
          icon: "icon-shangpin",
          title: "商品管理",
          meta: ["super", "normal"],
          children: [
            { path: "/index/goodslist", title: "商品列表" },
            { path: "/index/goodsadd", title: "商品添加" }
          ]
        },
        // 4店铺管理
        {
          path: "/index/shop",
          icon: "icon-dianpu",
          title: "店铺管理",
          meta: ["super", "normal"]
        },
        // 5账号管理
        {
          index: "accountmanage",
          icon: "icon-tubiao_zhanghao",
          title: "账号管理",
          meta: ["super"],
          children: [
            { path: "/index/accountlist", title: "账号列表" },
            { path: "/index/accountadd", title: "账号添加" },
            { path: "/index/passwordmodify", title: "密码修改" }
          ]
        },
        // 6销售统计
        {
          index: "totalmanage",
          icon: "icon-tongji",
          title: "销售统计",
          meta: ["super"],
          children: [
            { path: "/index/goodstotal", title: "商品统计" },
            { path: "/index/ordertotal", title: "订单统计" }
          ]
        }
      ],
      // 权限菜单
      accessMenu: []
    };
  },
  created() {
    // 从本地取出role
    let role = local.get("u_r");
    // 计算出权限菜单（可以访问的菜单）
    this.accessMenu = this.menus.filter(menu => menu.meta.includes(role));
  },
  computed: {
    // 计算高亮效果
    activePath() {
      // 如果跳转到了商品的编辑页面 这个高亮的地址 还是返回 goodslist 也就是让商品列表保持激活
      if (this.$route.path === "/index/goodsedit") {
        return "/index/goodslist";
      }

      if (this.$route.path === "/index/orderdetail") {
        return "/index/order";
      }

      return this.$route.path;
    }
  }
};
</script>

<style lang="less" scoped>
.left-nav {
  flex: 0 0 200px;
  background-color: #304156;
  .title {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-weight: 700;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-menu {
    border-right: none;
    .el-menu-item {
      i {
        margin-right: 10px;
      }
    }

    .el-submenu {
      .el-submenu__title {
        i {
          margin-right: 10px;
        }
      }
      .el-menu {
        .el-menu-item {
          background-color: #202f3f !important;
        }
      }
    }
  }
}
</style>
<template>
  <div class="index">
    <!-- 左侧 -->
    <LeftNav />

    <!-- 右侧 -->
    <div class="right-main">
      <!-- 头部 -->
      <RightHeader />

      <!-- 内容 -->
      <RightContent />
    </div>
  </div>
</template>

<script>
// 引入组件
import LeftNav from "@/components/Layout/LeftNav.vue";
import RightHeader from "@/components/Layout/RightMain/RightHeader.vue";
import RightContent from "@/components/Layout/RightMain/RightContent.vue";

export default {
  // 注册
  components: {
    LeftNav,
    RightHeader,
    RightContent
  }
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  display: flex;
  .right-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
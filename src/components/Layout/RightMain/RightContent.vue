<template>
  <div class="right-content">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.right-content {
  flex: 1;
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
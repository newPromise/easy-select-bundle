<template>
  <div class="toolbar">
    <div class="tools">
      <div class="delete">
        <i class="el-icon-delete"></i>
      </div>
      <div class="add-tag"></div>
      <div class="content-list">
          <i class="el-icon-tickets" @click="$emit('to-list')"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "toolbar",
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.toolbar {
  padding: 10px;
  background: whitesmoke;
  .tools {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
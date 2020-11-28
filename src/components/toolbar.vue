<template>
  <div class="toolbar">
    <div class="tools">
      <div class="delete">
        <i class="el-icon-delete" @click="$emit('delete-items')"></i>
      </div>
      <div class="add-tag"></div>
      <div class="content-list">
        <span v-if="isListPage">
          <i class="el-icon-edit-outline" @click="$emit('to-edit')"></i>
        </span>
        <span v-else>
          <i
            v-if="hasCollected"
            @click="$emit('to-collect', true)"
            class="iconfont icon-shouchang1"
            >&#xe629;</i
          >
          <i
            v-else
            @click="$emit('to-collect', true)"
            class="iconfont icon-shouchang"
            >&#xe639;</i
          >
          <i class="el-icon-tickets" @click="$emit('to-list')"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "toolbar",
  props: {
    isListPage: {
      type: Boolean,
    },
    isCollected: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isCollected: function (v) {
      console.log("vvvv", v);
      this.hasCollected = v;
    },
  },
  data() {
    return {
      hasCollected: this.isCollected,
    };
  },
  methods: {
    removeCollect() {
      this.hasCollected = false;
    },
    collect() {
      this.hasCollected = true;
    },
  },
};
</script>
<style lang="less" scoped>
.toolbar {
  padding: 10px;
  background: whitesmoke;
  .icon-shouchang {
    cursor: pointer;
    &:hover {
      color: #ea9518;
    }
  }
  .icon-shouchang,
  .icon-shouchang1 {
    padding-right: 15px;
  }
  .icon-shouchang1 {
    cursor: pointer;
    color: #ea9518;
  }
  .el-icon-delete,
  .el-icon-edit-outline,
  .el-icon-tickets {
    font-size: 17px;
  }
  .tools {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
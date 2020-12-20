<template>
  <div class="tag" @mouseenter="whenTagFocus" @mouseleave="whenTagBlur">
    {{ tagText }}
    <div class="tag-mask" v-show="isShowCloseIcon">
      <i @click="removeTag" class="iconfont remove-tag-btn">&#xe610;</i>
    </div>
  </div>
</template>
<script>
export default {
  name: "tag",
  props: {
    tagData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      tagText: this.tagData.text,
      isShowCloseIcon: false,
    };
  },
  methods: {
    whenTagFocus() {
      this.isShowCloseIcon = true;
    },
    whenTagBlur() {
      this.isShowCloseIcon = false;
    },
    removeTag() {
      this.$emit("remove-tag", this.tagData);
    },
  },
};
</script>
<style lang="less" scoped>
.tag {
  display: inline-block;
  position: relative;
  padding: 2px 7px;
  background-color: rgb(171, 184, 237, 0.8);
  line-height: 14px;
  height: 14px;
  font-size: 12px;
  border-radius: 9px;
  margin: 0 5px;
}
.tag-mask {
  position: absolute;
  right: -7px;
  top: -10px;
}
.remove-tag-btn {
  cursor: pointer;
}
</style>
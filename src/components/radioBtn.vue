<template>
  <div
    class="radio-btn"
    :style="{
      width: size,
      height: size,
      'border-radius': borderRadius,
      'background-color': value ? '#409eff' : '',
      borderColor: value ? '#409eff' : '',
    }"
  >
    <i v-if="value" class="iconfont is-selected">&#xe61e;</i>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: "12px",
    },
    value: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    borderRadius: function () {
      return `${(Number.parseInt(this.size) + 2) / 2}px`;
    },
  },
  mounted() {
    console.log("this.r", this.borderRadius);
  },
};
</script>
<style lang="less" scoped>
.radio-btn {
  border: 1px solid gray;
  display: flex;
  align-items: center;
  justify-content: center;
  .is-selected {
    font-size: 12px;
    color: white;
  }
}
</style>
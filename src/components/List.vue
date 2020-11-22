<template>
  <div class="list-container">
    <div class="list">
      <div class="item" v-for="(item, key) of list" :key="key">
        <div class="click-mask" @click="showDetail(item)"></div>
        <div class="item-card">
          <el-checkbox @change="whenCheckChange"></el-checkbox>
          <div class="item-title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Store from "../storage";
export default {
  name: "list",
  data() {
    return {
      list: new Array(18).fill({
        title: "http://localhost:8080/",
        value: "2222",
      }),
    };
  },
  methods: {
    showDetail(item) {
      this.$emit("edit-info", item);
    },
    whenCheckChange() {
      console.log("select");
    },
    async getList() {
      const storage = new Store();
      const allData = await storage.getList();
      this.list = Object.entries(allData).reduce((res, cur) => {
        const [k, v] = cur;
        res.push({
          title: k,
          value: v,
        });
        return res;
      }, []);
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="less" scoped>
.list-container {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
  .list {
    width: 100%;
    .item {
      position: relative;
    }
    .click-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
      &:hover {
        & + .item-card {
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
    .item-card {
      padding: 10px;
      margin: 10px 0;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.12);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
      cursor: pointer;
      border-radius: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      transition-property: border-color, box-shadow, background-color;
      transition-duration: 0.3s;
    }
    .item-title {
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
<template>
  <div class="list-container">
    <div class="list" v-if="list.length">
      <div class="item" v-for="(item, key) of list" :key="key">
        <div class="click-mask" @click="showDetail(item)"></div>
        <div class="item-card">
          <el-checkbox
            v-model="item.isChecked"
            @change="whenCheckChange(item)"
          ></el-checkbox>
          <div class="item-title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data"></div>
  </div>
</template>
<script>
import Store from "../storage";
export default {
  name: "list",
  data() {
    return {
      list: [],
      deleteItems: [],
    };
  },
  methods: {
    showDetail(item) {
      this.$emit("edit-info", item);
    },
    whenCheckChange(item) {
      const itemIndex = this.deleteItems.indexOf(item);
      if (itemIndex < 0) {
        this.deleteItems.push(item);
        item.isChecked = true;
      } else {
        this.deleteItems.splice(itemIndex, 1);
        item.isChecked = false;
      }
      this.$emit("select-item", this.deleteItems);
    },
    async getList() {
      this.deleteItems = [];
      const storage = new Store();
      const allData = await storage.getList();
      this.list = Object.entries(allData).reduce((res, cur) => {
        const [k, v] = cur;
        res.push({
          title: k,
          value: v.value,
          favorites: v.favorites,
          isChecked: false,
        });
        return res;
      }, []);
      console.log("this.listthis.list", this.list);
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
  min-height: 250px;
  max-height: 500px;
  box-sizing: border-box;
  overflow-y: scroll;
  .no-data {
    width: 100%;
    height: 100%;
    background: url("../assets/noData.png") no-repeat 100% 100%;
    background-position: center;
  }
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
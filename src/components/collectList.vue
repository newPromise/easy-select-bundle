<template>
  <div class="collectStore-list">
    <div class="collectStore-header">
      <span>已选中 {{ collectCount }} 个收藏夹</span>
    </div>
    <div class="collectStore-action">
      <el-button @click="showCollectNameInput" type="text"
        >+ 新建收藏夹</el-button
      >
      <el-button @click="deleteCollect" v-show="!nonCollected" type="text"
        ><i class="el-icon-delete"></i
      ></el-button>
    </div>
    <div :class="{ list: true, emptyList: noCollect && !isCreateNewCollect }">
      <input
        v-show="isCreateNewCollect"
        ref="newCollectInput"
        class="input-new-collector"
        @blur="createNewCollecter"
        v-model="newCollecterName"
        placeholder="请输入新建收藏夹名称"
      />
      <div
        class="item"
        v-for="(item, key) of allCollectList"
        :key="key"
        @click="selectItem(item)"
      >
        <span class="collectStore-name">{{ item.name }}</span>
        <RadioBtn :value="item.isChecked"></RadioBtn>
      </div>
    </div>
    <div v-if="!noCollect" class="ensure-collectStore">
      <el-button
        :disabled="nonCollected"
        @click="ensureSelectCollector"
        type="primary"
        >确认</el-button
      >
    </div>
  </div>
</template>
<script>
import RadioBtn from "./radioBtn";
import Store from "../storage";
const collectStore = new Store("facorites");
export default {
  props: {
    selectedCollectorList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      allCollectList: [],
      newCollecterName: "",
      isCreateNewCollect: false,
    };
  },
  components: {
    RadioBtn,
  },
  watch: {
    selectedCollectorList: {
      handler(v) {
        this.resetCheckList(v);
      },
      deep: true,
    },
  },
  computed: {
    collectedList: function () {
      return this.allCollectList.filter(({ isChecked }) => isChecked);
    },
    collectCount: function () {
      return this.collectedList.length;
    },
    nonCollected: function () {
      return !this.collectCount;
    },
    noCollect: function () {
      return !this.allCollectList.length;
    },
  },
  methods: {
    showCollectNameInput() {
      this.isCreateNewCollect = true;
      this.$nextTick(() => {
        document.querySelector(".input-new-collector").focus();
      });
    },
    async deleteCollect() {
      for (let collector of this.collectedList) {
        await collectStore.removeFavor(collector.name);
      }
      await this.getData();
    },
    async createNewCollecter() {
      this.isCreateNewCollect = false;
      if (this.newCollecterName.trim().length) {
        const isExistCollector = this.allCollectList.find(
          (collect) => this.newCollecterName === collect.name
        );
        if (!isExistCollector) {
          const addCollecter = {
            name: this.newCollecterName,
            isChecked: false,
          };
          await collectStore.addFavor(addCollecter);
          this.allCollectList.unshift(addCollecter);
        }
      }
      this.newCollecterName = "";
    },
    selectItem(item) {
      item.isChecked = !item.isChecked;
    },
    resetCheckList(list) {
      this.allCollectList = this.allCollectList.map((collect) => {
        return Object.assign({}, collect, {
          isChecked: list.includes(collect.name),
        });
      });
    },
    async getData() {
      this.allCollectList = await collectStore.get();
      this.resetCheckList(this.selectedCollectorList);
    },
    ensureSelectCollector() {
      this.$emit("select-collector", this.collectedList);
    },
  },
  async mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.collectStore-list {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .collectStore-header {
    position: relative;
    text-align: center;
    font-size: 16px;
  }
  .collectStore-action {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
  }
  .emptyList {
    background: url("../assets/noData.png") no-repeat 100% 100%;
    background-position: center;
    background-size: 20%;
  }
  .list {
    min-height: 100px;
    max-height: 150px;
    overflow: scroll;
    .input-new-collector {
      width: 100%;
      box-sizing: border-box;
      padding: 5px;
      border: none;
      outline: none;
      border-bottom: 1px solid #409eff;
    }
    &::-webkit-scrollbar {
      width: 0;
    }
    .item {
      padding: 10px 5px;
      border-bottom: 1px solid whitesmoke;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      .collectStore-name {
        flex: 1;
      }
    }
  }
  .ensure-collectStore {
    text-align: center;
    .el-button {
      width: 80%;
      text-align: center;
    }
  }
}
</style>
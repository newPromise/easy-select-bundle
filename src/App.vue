<template>
  <div class="container-wrapper">
    <div class="container">
      <Content
        v-if="!isListPage"
        :editInfo="editItemInfo"
        ref="editContent"
        @get-favorites="getFavorites"
        :favorites="favorites"
      ></Content>
      <List
        ref="list"
        @select-item="whenItemSelected"
        @edit-info="showItemDetail"
        v-else
      ></List>
    </div>
    <div class="tool-bar-wrapper">
      <ToolBar
        @delete-items="deleteItems"
        :isListPage="isListPage"
        :isCollected="isCollected"
        @to-list="showAllNoteList"
        @to-edit="showEditBox"
        @to-collect="switchCollectVisible"
      ></ToolBar>
    </div>
    <div v-show="isShowCollectBox" class="collector">
      <CollectList
        @select-collector="whenCollect"
        :selectedCollectorList="selectedCollectorList"
      ></CollectList>
    </div>
  </div>
</template>

<script>
import Content from "./components/content";
import ToolBar from "./components/toolbar";
import List from "./components/List";
import CollectList from "./components/collectList";
import Store from "./storage";

const contentStore = new Store();
export default {
  name: "App",
  components: {
    Content,
    ToolBar,
    List,
    CollectList,
  },
  data() {
    return {
      name: "",
      isListPage: false,
      editItemInfo: null,
      isShowCollectBox: false,
      isCollected: false,
      selectItems: [],
      favorites: [],
      selectedCollectorList: [],
    };
  },
  methods: {
    getFavorites(favorites) {
      this.selectedCollectorList = favorites;
      this.isCollected = !!this.selectedCollectorList.length;
    },
    showItemDetail(detail) {
      console.log("yes", detail);
      this.isListPage = false;
      this.editItemInfo = detail;
      this.$nextTick(async () => {
        this.selectedCollectorList = await this.$refs.editContent.getFavorites();
        this.isCollected = !!this.selectedCollectorList.length;
      });
    },
    async whenItemSelected(selItems) {
      this.selectItems = selItems;
    },
    async deleteItems() {
      await contentStore.remove(this.selectItems.map(({ title }) => title));
      this.$refs.list.getList();
    },
    showEditBox() {
      this.isListPage = false;
    },
    showAllNoteList() {
      this.isListPage = true;
      this.isShowCollectBox = false;
    },
    switchCollectVisible() {
      this.isShowCollectBox = !this.isShowCollectBox;
    },
    whenCollect(selectedCollectList) {
      this.isCollected = true;
      this.favorites = selectedCollectList.map(({ name }) => name);
      this.switchCollectVisible(false);
    },
  },
};
</script>
<style>
@import url("../src/assets/style/iconfont.css");
body {
  width: 500px;
  box-sizing: border-box;
}
</style>
<style scoped>
.container-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.container {
  flex: 1;
  display: flex;
  height: 100%;
}
.tool-bar-wrapper {
  flex: none;
}
/* .tool-bar-wapper {
  position: absolute;
  bottom: 0;
  width: 100%;
} */
</style>
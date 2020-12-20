<template>
  <div class="container-wrapper">
    <div class="container">
      <Content
        v-if="!isListPage"
        :editInfo="editItemInfo"
        ref="editContent"
        @get-favorites="getFavorites"
        @get-tags="getTags"
        :favorites="favorites"
      ></Content>
      <List
        ref="list"
        @select-item="whenItemSelected"
        @edit-info="showItemDetail"
        v-else
      ></List>
    </div>
    <!-- 当文章列表页的时候隐藏 tag 选项 -->
    <div class="tags" v-if="!isListPage">
      <TagList
        :tags="contentTags"
        @select-tag="whenSelectTag"
        @remove-tag="whenRemoveTag"
      ></TagList>
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
import TagList from "./components/tagList";
import Store from "./storage";

const contentStore = new Store();
export default {
  name: "App",
  components: {
    Content,
    ToolBar,
    List,
    CollectList,
    TagList,
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
      // 当前便捷内容的所有标签
      contentTags: [],
    };
  },
  methods: {
    getFavorites(favorites) {
      this.selectedCollectorList = favorites;
      this.isCollected = !!this.selectedCollectorList.length;
    },
    // 当选中 tag 时
    async whenSelectTag(tag) {
      console.log("tag", tag);
      await this.$refs.editContent.addTag({ text: tag.text });
      const allTags = await this.$refs.editContent.getTags();
      this.getTags(allTags);
    },
    // 当移除 tag 的时候
    async whenRemoveTag(removedTag) {
      await this.$refs.editContent.removeTag(removedTag);
      const allTags = await this.$refs.editContent.getTags();
      this.getTags(allTags);
    },
    getTags(tags) {
      this.contentTags = tags;
    },
    showItemDetail(detail) {
      this.isListPage = false;
      this.editItemInfo = detail;
      this.$nextTick(async () => {
        this.selectedCollectorList = await this.$refs.editContent.getFavorites();
        this.contentTags = await this.$refs.editContent.getTags();
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
.tags {
  padding-left: 10px;
  margin: 5px 0;
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
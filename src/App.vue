<template>
  <div class="container-wrapper">
    <div class="container">
      <Content v-if="!isListPage" :editInfo="editItemInfo"></Content>
      <List @edit-info="showItemDetail" v-else></List>
    </div>
    <div class="tool-bar-wrapper">
      <ToolBar @to-list="showAllNoteList"></ToolBar>
    </div>
  </div>
</template>

<script>
import Content from "./components/content";
import ToolBar from "./components/toobar";
import List from "./components/List";
export default {
  name: "App",
  components: {
    Content,
    ToolBar,
    List,
  },
  data() {
    return {
      name: "",
      isListPage: false,
      editItemInfo: null,
    };
  },
  methods: {
    showItemDetail(detail) {
      console.log("yes", detail);
      this.isListPage = false;
      this.editItemInfo = detail;
    },
    showAllNoteList() {
      this.isListPage = true;
    },
  },
};
</script>
<style>
body {
  width: 500px;
  box-sizing: border-box;
}
</style>
<style scoped>
.container-wrapper {
  width: 100%;
  height: 300px;
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
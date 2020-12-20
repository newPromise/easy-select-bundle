<template>
  <div class="tag-list">
    <tag
      @remove-tag="whenRemoveTag"
      v-for="(tagData, key) of tags"
      :key="key"
      :tagData="tagData"
    ></tag>
    <div class="tag-selector" v-if="isAddTag">
      <el-autocomplete
        ref="autocomplete"
        :auto-focus="true"
        :fetch-suggestions="queryTags"
        @select="handleSelect"
        placeholder="输入标签，点击选择创建新标签"
        v-model="addTagValue"
      ></el-autocomplete>
    </div>
    <div class="tag-add" v-else @click="showAddTagInput">
      <i class="el-icon-plus"></i>
    </div>
  </div>
</template>
<script>
import tag from "./tag";
import Store from "../storage";
const tagStore = new Store("tags");
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      addTagValue: "",
      isAddTag: false,
      allTagList: [],
    };
  },
  methods: {
    formatTagList(allTags) {
      return allTags.map((tag) =>
        Object.assign(
          {},
          {
            value: tag.text,
          },
          tag
        )
      );
    },
    hideAddTagInput() {
      this.isAddTag = false;
    },
    showAddTagInput() {
      this.isAddTag = true;
      this.addTagValue = "";
      this.$nextTick(() => {
        document.querySelector(".tag-selector .el-autocomplete input").focus();
      });
    },
    async whenRemoveTag(removedTag) {
      // await tagStore.removeTag(removedTag.text);
      // this.getTagList();
      this.$emit("remove-tag", removedTag);
      console.log("removedTag", removedTag);
    },
    async handleSelect(selectTag) {
      console.log("selectTag", selectTag);
      const isNewTag = selectTag.isNewTag;
      // 当创建一个新 tag 的时候
      if (isNewTag) {
        await tagStore.addTag(selectTag.tagName);
        await this.getTagList();
      }
      this.$emit("select-tag", selectTag);
      this.hideAddTagInput();
    },
    queryTags(queryString, cb) {
      const queryResult = this.allTagList.filter((tag) =>
        tag.text.includes(queryString)
      );
      if (queryResult.length) {
        cb(queryResult);
      } else {
        cb([
          {
            value: queryString,
            isNewTag: true,
            tagName: queryString,
            text: queryString,
          },
        ]);
      }
    },
    // 获取所有的标签列表
    async getTagList() {
      // this.$nextTick(async () => {
      const tags = await tagStore.getList();
      this.allTagList = this.formatTagList(tags);
      this.$forceUpdate();
      // });
    },
    init() {
      this.getTagList();
    },
  },
  components: {
    tag,
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less">
.tag-list {
  .tag-add {
    display: inline-block;
    font-size: 12px;
    padding: 2px 7px;
    line-height: 14px;
    height: 14;
    background-color: rgb(171, 184, 237, 0.8);
    border-radius: 9px;
  }
  .tag-selector {
    display: inline-block;
    .el-input__inner {
      height: 20px;
      font-size: 12px;
      padding: 0 5px;
      border: none;
      border-radius: 10px;
      background-color: rgb(171, 184, 237, 0.8);
      width: 100px;
      &::placeholder {
        color: black;
        font-size: 12px;
      }
    }
  }
}
</style>
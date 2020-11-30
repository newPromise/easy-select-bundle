<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="comment">
      <div
        ref="content"
        class="edit-textarea"
        @keyup="debounceWatchChange"
        @mouseup="debounceWatchChange"
        v-html="commentValue"
        contenteditable="true"
      ></div>
    </div>
  </div>
</template>
<script>
import { getSelectText, getPageSite } from "../executeScripts/index";
import { debounce } from "../util.js";
import Storage from "../storage.js";
const store = new Storage();
export default {
  name: "content",
  props: {
    editInfo: {
      type: Object,
    },
    favorites: {
      type: Array,
    },
  },
  data() {
    return {
      title: "",
      commentValue: "",
      oldCommentValue: "",
    };
  },
  computed: {
    debounceWatchChange: function () {
      return debounce(this.addCommentValueWatch, 500);
    },
  },
  watch: {
    favorites: {
      handler(v) {
        this.setFavorites(v);
      },
      deep: true,
    },
  },
  methods: {
    addComment(val) {
      console.log("valval", val);
    },
    async commentChange(changedValue) {
      console.log("changedValue", changedValue);
      await store.setContentValue(this.title, { value: changedValue });
    },
    async setFavorites(val) {
      await store.setContentValue(this.title, { favorites: val });
    },
    async getFavorites() {
      const storeValues = await store.get([this.title]);
      return storeValues[this.title].favorites || [];
    },
    addCommentValueWatch() {
      const htmlContent = this.$refs.content.innerHTML;
      if (htmlContent !== this.oldCommentValue) {
        this.commentChange(htmlContent);
        this.oldCommentValue = htmlContent;
      }
    },
    async initData() {
      if (this.editInfo) {
        this.title = this.editInfo.title;
        this.commentValue = this.editInfo.value;
      } else {
        const selectText = await getSelectText();
        if (selectText) {
          this.title = selectText;
        } else {
          this.title = await getPageSite();
        }
        const storeValues = await store.get([this.title]);
        this.commentValue = storeValues[this.title].value || "";
        const favorites = await this.getFavorites();
        this.$emit("get-favorites", favorites);
      }
      this.oldCommentValue = this.commentValue;
      this.$nextTick(() => {
        this.$refs.content.focus();
        this.addCommentValueWatch();
      });
    },
  },
  async mounted() {
    this.initData();
  },
};
</script>
<style lang="less" scoped>
.content {
  margin: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  .title {
    flex: none;
    border-bottom: 1px solid lightgray;
    font-size: 16px;
    padding-bottom: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .comment {
    flex: 1;
    .edit-textarea {
      box-sizing: border-box;
      padding: 10px;
      font-size: 14px;
      width: 100%;
      height: 200px;
      overflow: hidden;
      overflow-y: scroll;
      outline: none;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>
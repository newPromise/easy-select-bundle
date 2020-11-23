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
  methods: {
    addComment(val) {
      console.log("valval", val);
    },
    async commentChange(changedValue) {
      let setItem = {};
      setItem[this.title] = changedValue;
      store.set(setItem);
      console.log("val", await store.get([this.title]));
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
        this.commentValue = storeValues[this.title] || "";
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
      //   &:empty:before {
      //     content: "";
      //     color: gray;
      //   }
      //   &:focus::before {
      //     content: none;
      //   }
    }
  }
}
</style>
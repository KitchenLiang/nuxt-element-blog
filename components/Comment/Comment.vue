<template>
  <div class="halo-comment p-3 mt-3">
    <section
      class="header"
      @click="handleCommentHeaderClick"
    >
      <comment-author
        :comment="editingComment"
        :options="options"
      />

    </section>
    <section class="
        comment-alert">
      <!-- Info -->
      <div
        class="alert info"
        v-for="(info, index) in infoes"
        :key="index"
      >
        <span
          class="closebtn"
          @click="clearAlertClose"
        >&times;</span>
        <strong>{{ info }}</strong>
      </div>

      <!-- Success -->
      <div
        class="alert success"
        v-for="(success, index) in successes"
        :key="index"
      >
        <span
          class="closebtn"
          @click="clearAlertClose"
        >&times;</span>
        <strong>{{ success }}</strong>
      </div>

      <!-- Warning -->
      <div
        class="alert warning"
        v-for="(warning, index) in warnings"
        :key="index"
      >
        <span
          class="closebtn"
          @click="clearAlertClose"
        >&times;</span>
        <strong>{{ warning }}</strong>
      </div>

    </section>

    <section class="loading">
      <comment-loading v-show="commentLoading" />
    </section>

    <section class="body">
      <comment-body
        v-show="!commentLoading"
        :comments="comments"
        :targetId="id"
        :target="target"
        :options="options"
        @reply="handleReply"
      />
    </section>

    <section class="pagination">
      <pagination
        :page="pagination.page"
        :size="pagination.size"
        :total="pagination.total"
        @change="handlePaginationChange"
      />
    </section>

    <section class="footer-editor">
      <comment-editor
        v-show="editorVisiable"
        :targetId="id"
        :target="target"
        :replyingComment="replyingComment"
        :options="options"
        @close="handleEditorClose"
        @exit="handleEditorExit"
        @input="handleEditorInput"
        @created="handleCommentCreated"
        @failed="handleFailedToCreateComment"
      />
    </section>

  </div>
</template>

<script>
  import CommentAuthor from './CommentAuthor'
  import CommentBody from './CommentBody'
  import CommentNode from './CommentNode'
  import CommentEditor from './CommentEditor'
  import CommentLoading from './CommentLoading'
  import Pagination from './Pagination'
import commentApi from './apis/comment'
import optionApi from './apis/option'
import { isObject } from './utils/util'

export default {
  name: 'Comment',
  components: {
    CommentAuthor,
    CommentBody,
    CommentNode,
    CommentEditor,
    CommentLoading,
    Pagination
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    type: {
      type: String,
      required: false,
      default: 'post',
      validator: function(value) {
        // The value must match one of these strings
        return ['post', 'sheet', 'journal'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      comments: [],
      pagination: {
        page: 0,
        sort: '',
        size: 5,
        total: 0
      },
      commentLoading: false,
      editorVisiable: false,
      alertVisiable: false,
      editingComment: {},
      infoes: [],
      warnings: [],
      successes: [],
      repliedSuccess: null,
      replyingComment: null,
      options: []
    }
  },
  computed: {
    target() {
      // pluralize it
      return `${this.type}s`
    },
    infoAlertVisiable() {
      return this.infoes !== null && this.infoes.length > 0
    },
    warningAlertVisiable() {
      return this.warnings !== null && this.warnings.length > 0
    },
    successAlertVisiable() {
      return this.successes !== null && this.successes.length > 0
    }
  },
  created() {
    this.loadComments()
    this.loadOptions()
  },
  methods: {
    loadComments() {
      this.comments = []
      this.commentLoading = true
      commentApi
        .listComments(this.target, this.id, 'top_view', this.pagination)
        .then(response => {
          this.comments = response.data.data.content
          this.pagination.size = response.data.data.rpp
          this.pagination.total = response.data.data.total

        })
        .finally(() => {
          this.commentLoading = false
        })
    },
    loadOptions() {
      optionApi.list().then(response => {
        this.options = response.data.data
      })
    },
    handleCommentHeaderClick() {
      this.editorVisiable = true
      this.replyingComment = null
      this.repliedSuccess = null
    },
    handlePaginationChange(page) {
      this.pagination.page = page
      this.loadComments()
    },
    handleEditorClose() {
      this.editorVisiable = false
    },
    handleEditorExit() {
      this.handleEditorClose()
      this.editingComment.content = null
    },
    handleEditorInput(comment) {
      this.editingComment = comment
    },
    handleCommentCreated(createdComment) {
      this.clearAlertClose()

      if (createdComment.status === 'PUBLISHED') {
        this.loadComments()
        if (this.repliedSuccess) {
          this.repliedSuccess()
        }
        this.successes.push('评论成功')
      } else {
        // Show tips
        this.infoes.push('您的评论已经投递至博主，等待博主审核！')
      }

      this.repliedSuccess = null
    },
    handleFailedToCreateComment(response) {
      this.clearAlertClose()
      this.repliedSuccess = null

      if (response.status === 400) {
        this.warnings.push(response.data.message)
        if (response.data) {
          const errorDetail = response.data.data
          if (isObject(errorDetail)) {
            Object.keys(errorDetail).forEach(key => {
              this.warnings.push(errorDetail[key])
            })
          }
        }
      }
    },
    handleReply(comment, repliedSuccess) {
      this.replyingComment = comment
      this.repliedSuccess = repliedSuccess
      this.editorVisiable = true
    },
    clearAlertClose() {
      this.infoes = []
      this.warnings = []
      this.successes = []
    }
  }
}
</script>

<style>
  .halo-comment{
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(26, 26, 26, 0.3);
  }
  .halo-comment * {
    font-family: -apple-system, BlinkMacSystemFont, "System Latin", "System Emoji", "System SC", sans-serif;
    outline: none;
    font-size: 13px;
    line-height: 1.5;
    padding: 0;
    margin: 0;
  }
  .halo-comment *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #eee;
  }
  .halo-comment *::-webkit-scrollbar-thumb {
    background-color: #1890ff;
  }
  .halo-comment *::-webkit-scrollbar-track {
    background-color: #eee;
  }
  .halo-comment *::before {
    box-sizing: border-box;
  }
  .halo-comment *:after {
    box-sizing: border-box;
  }
  .halo-comment .alert {
    border-radius: 4px;
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    opacity: 1;
    transition: opacity 0.6s;
    margin-bottom: 15px;
  }
  .halo-comment .alert.success {
    background-color: #4caf50;
  }
  .halo-comment .alert.info {
    background-color: #2196f3;
  }
  .halo-comment .alert.warning {
    background-color: #ff9800;
  }
  .halo-comment .alert .closebtn {
    margin-left: 15px;
    color: #fff;
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 16px;
    cursor: pointer;
    transition: 0.3s;
  }
  .halo-comment .alert .closebtn:hover {
    color: black;
  }
  .halo-comment .comment-item-author-avatar {
    float: left;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    line-height: 56px;
    display: block;
    box-sizing: content-box;
    text-align: center;
    margin-right: 12px;
    border: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.8s;
  }
  .halo-comment .comment-item-author-avatar:hover {
    transform: rotate(360deg);
  }
  .halo-comment .comment-placeholder {
    cursor: text;
    margin-bottom: 10px;
    border: 2px dashed #ededed;
    border-radius: 8px;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .halo-comment .comment-placeholder:hover {
    border: 2px dashed #3b83ee;
  }
  .halo-comment .comment-placeholder .comment-item {
    padding-top: 15px;
    position: relative;
    display: block;
    box-sizing: border-box;
    line-height: 2;
    color: #555;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-author-avatar {
    margin-left: 12px;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-main {
    overflow: hidden;
    padding-bottom: 0.5rem;
    color: #555;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-main .comment-item-header .header-author {
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    color: #2c2e31;
    text-decoration: none;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-main .comment-item-content {
    word-wrap: break-word;
    word-break: break-all;
    text-align: justify;
    position: relative;
    margin-bottom: 6px;
    padding-top: 6px;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-main .comment-item-content p {
    line-height: 2;
    font-size: 16px;
    color: #667c99;
  }
  .halo-comment .comment-placeholder .comment-item .comment-item-main .comment-item-content p img {
    width: 100%;
  }
  .halo-comment .comment-items {
    padding: 0 12px;
  }
  .halo-comment .comment-items .comment-item {
    padding-top: 15px;
    position: relative;
    display: block;
    box-sizing: border-box;
    line-height: 2;
    color: #555;
    border-bottom: 1px solid #e8ecf3;
  }
  .halo-comment .comment-items .comment-item .comment-item-main {
    overflow: hidden;
    padding-bottom: 0.5rem;
    color: #555;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-author {
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    display: inline-block;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-author a {
    font-size: 15px;
    font-weight: bold;
    color: #111;
    text-decoration: none;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-author::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #565656;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-author:hover::before {
    transform-origin: bottom left;
    transform: scaleX(1);
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-admin {
    padding: 0 2px;
    margin-right: 5px;
    border: 1px solid #cedced;
    border-radius: 2px;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-time {
    position: relative;
    font-size: 13px;
    color: #667c99;
    display: inline-block;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-header .header-id {
    float: right;
    font-size: 13px;
    color: #667c99;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-content {
    word-wrap: break-word;
    word-break: break-all;
    text-align: justify;
    position: relative;
    margin-bottom: 6px;
    padding-top: 6px;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-content a {
    text-decoration: none;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-content .content-at-id {
    font-size: 13px;
    color: #1890ff;
    font-weight: 500;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-content p {
    overflow: auto;
    line-height: 2;
    font-size: 14px;
    color: #111;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols {
    float: right;
    position: relative;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul li {
    margin-right: 0;
    margin-left: -5px;
    display: inline-block;
    vertical-align: top;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul li .item-control-more,
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul li .item-control-reply {
    display: inline-block;
    margin-bottom: 0;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 12px;
    color: #667c99;
    border: none;
    background: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul li .item-control-more:hover,
  .halo-comment .comment-items .comment-item .comment-item-main .comment-item-contols ul li .item-control-reply:hover {
    color: #0084fe;
  }
  .halo-comment .comment-items .comment-item .comment-item-children {
    margin-left: 4rem;
    padding-left: 1rem;
    border-left: 0.1rem solid #cccccc;
    padding-left: 0;
    padding-right: 0;
  }
  .halo-comment .comment-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    justify-items: flex-end;
    align-items: flex-end;
  }
  .halo-comment .comment-modal .comment-modal-container {
    width: 768px;
    position: relative;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-editor-emoji {
    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    position: absolute;
    bottom: 58px;
    left: 19%;
    z-index: 1;
    width: 248px;
  }
  .halo-comment .comment-modal .comment-modal-container #EmojiPicker {
    width: 100%;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container {
    border-radius: 4px 4px 0 0;
    background: rgba(255, 255, 255, 0.95);
    transform: translateZ(0);
    position: relative;
    pointer-events: auto;
    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    height: 248px;
    bottom: -248px;
    display: none;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container.active {
    height: 265px;
    bottom: 0;
    display: block;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-controls {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-controls li {
    display: inline-block;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-controls .editor-btn-close {
    margin-left: 15px;
    color: #c39b9b;
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 16px;
    cursor: pointer;
    transition: 0.3s;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-controls .editor-btn-close:hover {
    color: #000;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main {
    padding: 20px 20px 0;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-avatar {
    float: left;
    width: 64px;
    height: 64px;
    border-radius: 64px;
    line-height: 64px;
    display: block;
    box-sizing: content-box;
    text-align: center;
    border: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.8s;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-avatar:hover {
    transform: rotate(360deg);
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content {
    margin-left: 85px;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header {
    list-style: none;
    padding: 1px 0;
    margin: 0 0 10px;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header li {
    position: relative;
    display: inline-block;
    margin-right: -4px;
    width: 33.3%;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header li input {
    width: 100%;
    color: #667c99;
    font-size: 14px;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid transparent;
    border-bottom-color: rgba(61, 239, 255, 0.2);
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header li input::placeholder {
    color: #667c99;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header li input:focus ~ span {
    transform-origin: bottom left;
    transform: scaleX(1);
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-header li span {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #555;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-reply {
    max-height: 18px;
    border-left: 2px solid #667c99;
    padding: 0 5px;
    color: #667c99;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-reply small {
    color: #0084fe;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor {
    position: relative;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-wrapper {
    position: relative;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-wrapper textarea {
    display: block;
    width: 100%;
    background: none;
    border: 0;
    border-radius: 0;
    padding: 0 0 10px;
    border: 0;
    resize: none;
    color: #111;
    font-size: 14px;
    line-height: 1.7;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls {
    margin: 0 -20px 0 -105px;
    padding: 10px 20px;
    border-top: 1px solid #e8ecf3;
    list-style-type: none;
    overflow-x: auto;
    white-space: nowrap;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls li {
    display: inline-block;
    margin-right: 10px;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-reply .editor-btn-reply {
    font-size: inherit;
    font-family: inherit;
    color: #fff;
    padding: 0.5em 1em;
    outline: none;
    border: none;
    background-color: #1890ff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-reply .editor-btn-reply:hover {
    background-color: #0084fe;
    transition: all 0.4s ease-in-out;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-reply .editor-btn-reply:disabled {
    background-color: #d8d8d8;
    color: #fff;
    cursor: not-allowed;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-preview .editor-btn-preview,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-preview .editor-btn-emoji,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-emoji .editor-btn-preview,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-emoji .editor-btn-emoji {
    font-size: inherit;
    font-family: inherit;
    color: #667c99;
    padding: 0.5em 1em;
    outline: none;
    border: none;
    background-color: #e8ecf3;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
  }
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-preview .editor-btn-preview:hover,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-preview .editor-btn-emoji:hover,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-emoji .editor-btn-preview:hover,
  .halo-comment .comment-modal .comment-modal-container .comment-poster-container .comment-poster-main .comment-poster-main-body .comment-poster-body-content .comment-poster-body-editor .comment-poster-editor-controls .editor-item-emoji .editor-btn-emoji:hover {
    background-color: #d7dfea;
    transition: all 0.4s ease-in-out;
  }
  @media screen and (max-width: 768px) {
    .halo-comment .comment-modal .comment-modal-container {
      width: 100%;
    }
  }
  .halo-comment .comment-loader-container {
    text-align: center;
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  .halo-comment .comment-loader-container .comment-loader {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    width: 2em;
  }
  .halo-comment .comment-loader-container .comment-loader span {
    width: 0.3em;
    height: 1em;
    background-color: #3b83ee;
  }
  .halo-comment .comment-loader-container .comment-loader span:nth-of-type(1) {
    animation: grow 1s -0.45s ease-in-out infinite;
  }
  .halo-comment .comment-loader-container .comment-loader span:nth-of-type(2) {
    animation: grow 1s -0.3s ease-in-out infinite;
  }
  .halo-comment .comment-loader-container .comment-loader span:nth-of-type(3) {
    animation: grow 1s -0.15s ease-in-out infinite;
  }
  .halo-comment .comment-loader-container .comment-loader span:nth-of-type(4) {
    animation: grow 1s ease-in-out infinite;
  }
  @keyframes grow {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(2);
    }
  }
  .halo-comment .loading-fade-enter-active,
  .halo-comment .loading-fade-leave-active {
    transition: all 0.1s ease-in-out;
  }
  .halo-comment .loading-fade-enter,
  .halo-comment .loading-fade-leave-to {
    opacity: 0;
  }
  .halo-comment .comment-pagination {
    margin-top: 20px;
    text-align: center;
  }
  .halo-comment .comment-pagination .pagination {
    display: inline-block;
    padding: 0;
    margin: 0;
  }
  .halo-comment .comment-pagination .pagination li {
    display: inline;
    margin-right: 8px;
  }
  .halo-comment .comment-pagination .pagination button {
    z-index: 1;
    position: relative;
    font-size: inherit;
    font-family: inherit;
    padding: 0.5em 1em;
    outline: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.8s;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
  }
  .halo-comment .comment-pagination .pagination button:hover {
    color: #1890ff;
    border-color: #1890ff;
  }
  .halo-comment .comment-pagination .pagination .active {
    color: #1890ff;
    border-color: #1890ff;
  }
  .halo-comment #EmojiPicker {
    font-family: Noto, Twemoji, NotomojiColor, Notomoji, Symbola, sans-serif;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: #f0f0f0;
    border-radius: 4px;
    border: 1px solid #e4e4e4;
    overflow: hidden;
    width: 325px;
    user-select: none;
  }
  .halo-comment #EmojiPicker #Categories {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #e4e4e4;
    background: #f0f0f0;
    color: white;
  }
  .halo-comment #EmojiPicker .category {
    flex: 1;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    cursor: pointer;
  }
  .halo-comment #EmojiPicker .category.active {
    border-bottom: 3px solid #009688;
    filter: saturate(3);
    padding-bottom: 2px;
  }
  .halo-comment #EmojiPicker .category > img {
    width: 22px;
    height: 22px;
  }
  .halo-comment #EmojiPicker .category:hover {
    filter: saturate(3);
  }
  .halo-comment #EmojiPicker #InputSearch {
    display: block;
    width: 100%;
    max-width: 100%;
  }
  .halo-comment #EmojiPicker .container-search {
    display: block;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    margin: 5px 0;
    padding: 0 5%;
  }
  .halo-comment #EmojiPicker .container-search input {
    width: 100%;
    font-size: 14px;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #f6f6f6;
    color: #4a4a4a;
    border: 1px solid #e2e2e2;
  }
  .halo-comment #EmojiPicker #Emojis {
    display: block;
    width: 100%;
    max-width: 100%;
  }
  .halo-comment #EmojiPicker #Emojis ::-webkit-scrollbar {
    border-radius: 4px;
    width: 4px;
    background: #7c7c7c5b;
  }
  .halo-comment #EmojiPicker #Emojis ::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  .halo-comment #EmojiPicker #Emojis ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #00000038;
  }
  .halo-comment #EmojiPicker #Emojis ::-webkit-scrollbar-thumb:hover {
    background: #00000062;
  }
  .halo-comment #EmojiPicker .container-emoji {
    overflow-x: hidden;
    overflow-y: scroll;
    height: 350px;
  }
  .halo-comment #EmojiPicker .category-title {
    text-transform: uppercase;
    font-size: 0.8em;
    padding: 5px 0 0 16px;
    color: #848484;
  }
  .halo-comment #EmojiPicker .category-title:not(:first-of-type) {
    padding: 10px 0 0 16px;
  }
  .halo-comment #EmojiPicker .grid-emojis {
    display: grid;
    margin: 5px 0;
    align-items: start;
  }
  .halo-comment #EmojiPicker .emoji {
    display: inline-block;
    text-align: center;
    font-size: 25px;
    padding: 5px;
    max-height: 30px;
    cursor: pointer;
  }
  .halo-comment #EmojiPicker #VSvg {
    display: inline-block;
    vertical-align: middle;
  }

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>

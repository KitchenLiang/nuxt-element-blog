<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <section class="container">
        <!-- 文章内容开始 -->
        <article class="section article js-toc-content">
          <div class="AuthorInfo">
            <el-avatar :src="profile.avatar"></el-avatar>
            <div class="AuthorInfo-content">
              <div class="AuthorInfo-head">{{profile.nickname}}</div>
              <div class="AuthorInfo-detail">{{ $moment(detail.createTime).format("YYYY年MM月DD日") }} 阅读{{detail.visits}}</div>
            </div>
          </div>
          <el-image :src="detail.thumbnail">
          </el-image>
          <h1 class="title">{{detail.title}}</h1>
          <div class="content-details" ref="articleContent" v-html="detail.formatContent"></div>
          <div class="tag-list-box">
            <div class="tag-list-title">点击下面的标签，发现更多相似文章</div>
            <ul class="tag-list">
              <li v-for="item in detail.tags" :key="item.key" class="list" :class="`color-${Math.floor(Math.random() * 8) + 1}`">
                <nuxt-link :to="{ name: 'tags-id', params: { id: 1 }, query: { type: item.term_id, title: item.name } }">{{
                item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>

        </article>

        <!-- 文章内容结束 -->

        <halo-comment :id="+this.$route.params.id.replace('.html','')" type="post"></halo-comment>

        <!--分享-->
        <Share></Share>

      </section>

    </div>
    <app-sidebar class="sidebar-wrap" pagetype='article'/>
  </div>

</template>
<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  import AppSidebar from '@/components/AppSidebar'
  import haloComment from '@/components/Comment/Comment.vue'
  import Share from '@/components/Share/index.vue'
  export default {
    name: 'Details',
    fetch({
      params,
      error,
      store
    }) {
      store.dispatch('article/getProfile')
      return store.dispatch('article/getArticleDetail', params.id)
    },
    components: {
      haloComment,
      Share,
      AppSidebar
    },
    data() {
      return {
        isShowReward: false,
        isShowPoster: false,
        fullPath: '',
        rewardContent: {},
        posterContent: {},
        authorOtherInfo: {
          github: {
            icon: 'github-fill'
          },
          qq: {
            icon: 'QQ-circle-fill'
          },
          wechatNum: {
            icon: 'wechat-fill'
          },
          sina: {
            icon: 'weibo-circle-fill'
          },
          email: {
            icon: 'mail-fill'
          }
        },
        drawer: false,
        srcList: [],
        showViewer: false,
      }
    },
    computed: {
      ...mapState(['info']),
      ...mapState('article', ['detail', 'viewCount', 'opinion', 'profile'])
    },
    head() {
      let keywords = []
      this.detail.tags && this.detail.tags.forEach(item => keywords.push(item.name))
      return {
        title: `${this.detail.title} - ${this.info.blog_title}`,
        meta: [{
            hid: 'keywords',
            name: 'keywords',
            content: keywords.join(',')
          },
          {
            hid: 'description',
            name: 'description',
            content: this.detail.summary
          }
        ],
      }
    },
    created() {

    },
    mounted() {

      tocbot.init({
        // Where to render the table of contents.
        tocSelector: '.js-toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: '.js-toc-content',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h2, h3,h4',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
      });
      $('#qrcode').qrcode({
        width: 200,
        height: 200,
        text: window.location.href
      });

    },
    beforeDestroy() {


    },
    methods: {
      ...mapActions('article', ['updateOpinion']),


      // 显示微信号码
      _showWechatNum(num) {
        this.$message({
          message: `微信号：${num}`,
          showClose: true,
          showImg: true,
          center: true,
          wrapCenter: true,
          width: 280,
          imgUrl: this.detail.articleInfor.other.wechatPic,
          duration: 0
        })
      },



    }
  }
</script>
<style lang="scss" scoped>
  .section {
    margin-top: $container-margin;
    padding: $container-padding;
    background: $color-white;
    border-radius: $border-radius;
  }

  .article {
    margin-top: 0;
    -webkit-box-shadow: 0 1px 3px rgba(26, 26, 26, .3);
    box-shadow: 0 1px 3px rgba(26, 26, 26, .3);

    .title {
      padding: 10px 0;
      font-size: 20px;
      text-align: center;
      font-weight: 600;
    }

    .other-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid $color-border;
      text-align: center;
      color: $color-sub-text;

      .iconfont {
        vertical-align: baseline;
      }
    }

    // 正文
    .content-details {
      line-height: 2;
      word-break: break-all;

      /deep/ a {
        color: $color-theme;
      }

      /deep/ h2 {
        margin-top: 10px;

        .iconfont {
          vertical-align: bottom;
        }
      }

      /deep/ h1,
      /deep/ h2 {
        font-size: $font-size-large;
      }

      /deep/ h4,
      /deep/ h5,
      /deep/ h6 {
        font-size: $font-size-small;
      }

      /deep/ img {
        height: auto !important;
        cursor: zoom-in;
        margin: 0 auto;
        display: block;
        max-width: 100%;
      }
    }
  }





  // 文章标签
  .tag-wrap {
    margin-bottom: $container-margin;

    .iconfont {
      margin-right: 3px;
      font-size: 20px;
    }
  }

  // 上一篇、下一篇
  .relative-link-wrap {
    .next {
      margin-top: 10px;
    }
  }

  // 作者信息
  .author-introduct {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .right {
      flex: 1;
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid $color-border;
    }

    .reward {
      margin-left: 10px;
      cursor: pointer;

      .iconfont-colour {
        vertical-align: bottom;
      }
    }

    .name {
      font-size: $font-size-large;
    }

    img {
      margin-right: 10px;
      border-radius: $border-radius;
    }
  }

  .author-link {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .list {
      box-sizing: border-box;
      margin-right: 10px;
      margin-bottom: 5px;
      padding: 5px;
      border-radius: $border-radius;
      font-size: $font-size-small;

      svg {
        width: 2em;
        height: 2em;
      }
    }

    .iconfont-colour {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }

  .comment-title {
    margin-bottom: 10px;
    padding: 10px 0;
    border-radius: $border-radius;
    background: $color-sub-background;
    font-size: $font-size-large;
    text-align: center;
  }



  .AuthorInfo {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 0 0 1rem 0;
  }

  .AuthorInfo-content {
    -webkit-box-flex: 1;
    -ms-flex: 1 1;
    flex: 1 1;
    margin-left: 14px;
    overflow: hidden;
  }

  .AuthorInfo-head {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 1rem;
    line-height: 1.1;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }


  // 代码高亮
  /deep/ div.code-toolbar {
    overflow: hidden;
    width: 100%;
    margin: 20px 0;
    padding-top: 30px;
    border-radius: $border-radius;

    pre {
      margin: 0;

      border: {
        width: 0 1px 1px;
        style: solid;
        color: $color-main-background;
      }
    }

    code {
      border: 0;
      box-shadow: none;
      background-size: 4em 4em;
      line-height: 2;
    }

    .line-numbers .line-numbers-rows {
      border-color: $color-main-background;
    }

    .toolbar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background: #358ccb;
      opacity: 1;

      span {
        background: none;
        box-shadow: none;
        border-radius: 0;
        color: #fff;
      }
    }

    .toolbar-item {
      padding-left: 20px;

      span:hover {
        color: $color-white;
      }

      &:before {
        content: "\e7ae";
        font-family: "iconfont";
        color: $color-white;
      }
    }
  }

  @media screen and (max-width:767px) {
    .opinion {
      justify-content: space-between;

      .list {
        margin: 0;
      }
    }

    .create-poster-btn {
      display: none;
    }
  }
</style>

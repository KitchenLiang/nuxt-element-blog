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
          <img style="width: 100%" :src="detail.thumbnail" v-if="detail.thumbnail">
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

        <halo-comment class="cardshadow" :id="+this.$route.params.id.replace('.html','')" type="post"></halo-comment>

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
    async fetch({params,error,store}){
      await store.dispatch('article/getProfile');
      await store.dispatch('article/getArticleDetail',params.id);
    },
    components: {
      haloComment,
      Share,
      AppSidebar
    },
    data() {
      return {
        viewer:{}
      }
    },
    computed: {
      ...mapState(['info']),
      ...mapState('article', ['detail', 'viewCount', 'opinion', 'profile'])
    },
    head() {
      return {
        title: `${this.detail.title} - ${this.info.blog_title}`,
        link: [
          {  rel:"stylesheet",href:'https://cdn.bootcss.com/highlight.js/9.15.10/styles/monokai.min.css' },

        ],
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.detail.summary
          }, {
            hid: 'author',
            name: 'author',
            content: this.profile.nickname
          }, {
            hid: 'applemobileweapptitle',
            name: 'apple-mobile-web-app-title',
            content: this.info.blog_title
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

      $(function(){
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block);
        });
        if(this.viewer){
          this.viewer.destroy();//Destroy the viewer and remove the instance.
        }
        this.viewer= new Viewer(document.querySelector('.content-details'))
        })

    },
    beforeDestroy() {

    },
    methods: {
      ...mapActions('article', ['updateOpinion']),
    }
  }
</script>
<style lang="scss">
  .section {
    margin-top: $container-margin;
    padding: $container-padding;
    background: $color-white;
    border-radius: $border-radius;
  }

  .article {
    font-size: 1rem;
    margin-top: 0;
    box-shadow: $box-shadow;

    .title {
      padding: 10px 0;
      text-align: center;
      font-weight: 600;
      font-size: 2rem;
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
        font-size: 1.4rem;
      }

      /deep/ h4,
      /deep/ h5,
      /deep/ h6 {
        font-size: 1.2rem;
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

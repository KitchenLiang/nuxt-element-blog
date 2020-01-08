<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <div class="container">
        <!-- banner start -->
        <!-- banner end -->
        <!-- article list start -->
        <div class="article-list-wrap">
          <ul class="header p-3">
            <li class="list">最新文章</li>
          </ul>
          <article-list :articleList="articleList" :noMore="noMore" :loading="loading" @fatherMethod="_changePagination"></article-list>
        </div>
        <!-- article list end -->
      </div>

    </div>
    <app-sidebar class="sidebar-wrap" />
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import AppSidebar from '@/components/AppSidebar'
  import ArticleList from '~/components/ArticleList'
  export default {
    name: 'Index',
    fetch({
      store
    }) {
      store.commit('article/CLEAR_ARTICLE_LIST');
      return store.dispatch('article/getArticleList', {
        page: 0,
      })
    },
    components: {
      AppSidebar,
      ArticleList,
    },
    computed: {
      ...mapState(['info']),
      ...mapState('article', ['articleList', 'totalPage', 'currentPage', 'postsrpp'])
      //跟state做关联 articleList: state => state.articleList,
    },
    head() {
      return {
        title: `${this.info.blog_title}`,
        meta: [{
            hid: 'keywords',
            name: 'keywords',
            content: this.info.seo_keywords
          },
          {
            hid: 'description',
            name: 'description',
            content: this.info.seo_description
          }
        ]
      }
    },
    data() {
      return {
        bannerHeight: '405px',
        noMore: false,
        loading: false
      }
    },
    mounted() {
      // this._bannerClacHeight()
      // window.addEventListener('resize', this._bannerClacHeight)
    },
    beforeDestroy() {
      // window.removeEventListener('resize', this._bannerClacHeight)
    },
    methods: {
      _bannerClacHeight() {
        this.bannerHeight = `${this.$refs.bannerWrapper.offsetWidth / (900 / 405)}px`
      },
      _changePagination() {
        this.loading = true;
        if (this.totalPage > this.currentPage + 1) {
          this.$store.commit('article/SET_CURRENT_PAGE', this.currentPage + 1)
          setTimeout(() => {
            this.$store.dispatch('article/getArticleList', {
              page: this.currentPage,
              per_page: this.postsrpp,
            }).then(res => {
              this.loading = false
            }).catch(err => {
              console.log(err);
            })
          }, 1000);

        } else {
          this.noMore = true;
          this.loading = false
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  // banner
  .banner-wrap {
    position: relative;

    &.style-1 {
      display: flex;
      justify-content: space-between;
      height: 320px;
    }

    &.style-2 {
      overflow: hidden;
      background-color: #fff;
      border-radius: $border-radius;

      .banner-title {
        position: absolute;
        bottom: 0;
        left: 0;
        min-width: 200px;
        max-width: 100%;
        padding: 5px 15px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, .3);
        opacity: .9;
        @extend %ellipsis;
        color: #fff;
      }

      /deep/ .el-carousel__arrow {
        background-color: transparent;
        font-size: 30px;
      }

      /deep/ .el-carousel__indicators--horizontal {
        bottom: 20px;
      }
    }

    .title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      padding: 0 10px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, .3);
      line-height: 30px;
      color: $color-white;
      @extend %ellipsis;
    }

    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }

    .list {
      overflow: hidden;
      position: relative;
      border-radius: $border-radius;
    }

    .big-banner {
      width: 710px;

      img {
        height: 320px;
      }
    }

    .small-banner {
      width: 180px;

      .list {
        height: 100px;
        margin-bottom: 10px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .banner-wrap {
      &.style-1 {
        flex-wrap: wrap;
        height: auto;

        .big-banner {
          width: 100%;

          img {
            height: auto;
          }
        }

        .small-banner {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: $container-margin;

          .list {
            width: 32%;
            height: auto;
            margin-bottom: 0;
          }

          img {
            height: auto;
          }
        }
      }

      &.style-2 {
        /deep/ .el-carousel__arrow {
          display: block !important;
        }
      }
    }
  }

  @media screen and (max-width:767px) {
    .banner-wrap .list .title {
      height: 20px;
      font-size: 10px;
      line-height: 20px;
      text-indent: 8px;
    }

    // 文章列表
    .article-list-wrap {
      .article-list {
        flex-wrap: wrap;
        height: auto;

        .title {
          margin-top: 15px;
          font-size: $font-size-large;
        }

        .summary {
          height: auto;
        }

        .list-content {
          height: auto;
        }

        .opeartion {
          position: static;
          display: block;
          margin-top: 10px;
        }

        .details-btn {
          display: block;
          margin-top: 10px;
          padding: 10px 0;
          text-align: center;
        }
      }

      .thumbnail-wrap {
        width: 100%;
        margin-right: 0;
        text-align: center;

        .thumbnail {
          width: auto;
          height: auto;
          max-height: 150px;
        }
      }
    }

    // 翻页
    /deep/ .el-pagination {
      .el-pagination__jump {
        display: none;
      }
    }
  }
</style>

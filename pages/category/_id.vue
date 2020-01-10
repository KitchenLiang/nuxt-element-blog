<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <div class="container">
        <ul class="header">
          <li class="list">当前分类：{{ $route.query.name }}</li>
        </ul>
        <div v-if="articleList.length === 0" class="not">暂无数据！</div>
        <article-list :articleList="articleList" :noMore="noMore" @fatherMethod="_changePagination"></article-list>

      </div>
    </div>
    <app-sidebar class="sidebar-wrap" />
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import ArticleList from '~/components/ArticleList'
  import AppSidebar from '@/components/AppSidebar'
  export default {
    name: 'Search',
    components: {
      ArticleList,
      AppSidebar,
    },
    watchQuery: ['page'],
    fetch({
      params,
      query,
      store
    }) {
      store.commit('article/CLEAR_ARTICLE_LIST');
      store.commit('article/SET_CURRENT_PAGE', 0)
      return store.dispatch('article/categoryArticleList', {
        slugname: params.id,
        page: 0,
      })
    },
    computed: {
      ...mapState(['info']),
      ...mapState('article', ['articleList', 'totalPage', 'currentPage'])
    },
    head() {
      return {
        title: `${this.$route.query.name}的文章 - ${this.info.blog_title}`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.info.seo_description
          }, {
            hid: 'author',
            name: 'author',
            content: this.info.blog_title
          }, {
            hid: 'applemobileweapptitle',
            name: 'apple-mobile-web-app-title',
            content: this.info.blog_title
          }
        ]
      }
    },
    data() {
      return {
        noMore: false,
      }
    },
    methods: {
      _changePagination(id) {
        if (this.totalPage > this.currentPage + 1) {
          this.$store.commit('article/SET_CURRENT_PAGE', this.currentPage + 1)
          this.$store.dispatch('article/categoryArticleList', {
            slugname: params.id,
            page: this.currentPage,
          })
        } else {
          this.noMore = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 文章列表
  .container {
    padding: $container-padding;
    background: $color-white;
    border-radius: $border-radius;

    .header {
      padding-bottom: $container-padding;
      border-bottom: 1px solid $color-main-background;
      font-size: $font-size-large;
    }

    // 暂无数据
    .not {
      margin: 15px 0;
      text-align: center;
      color: $color-theme;
    }
  }

  @media screen and (max-width:767px) {

    // 文章列表
    .container {
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

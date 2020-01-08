<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <div class="article-list-wrap">
        <ul class="header p-3">
          <li class="list">当前标签：{{ $route.query.name }}</li>
        </ul>
        <article-list :articleList="articleList" :noMore="noMore" @fatherMethod="_changePagination"></article-list>
        <!-- more btn start -->
        <!-- more btn end -->
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
    name: 'Tags',
    components: {
      ArticleList,
      AppSidebar,
    },
    watchQuery: ['type'],
    fetch({
      params,
      query,
      store
    }) {
      store.commit('article/CLEAR_ARTICLE_LIST')
      store.commit('article/SET_CURRENT_PAGE', 0)
      return store.dispatch('article/tagsArticleList', {
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
        title: this.$route.query.title
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
          this.$store.dispatch('article/tagsArticleList', {
            tags: this.$route.query.type,
            page: this.currentPage,
            per_page: 8,
            _embed: true
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

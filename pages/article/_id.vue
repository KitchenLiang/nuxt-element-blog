<template>
  <div class="article-list-wrap">
    <ul class="header">
      <li class="list">所有文章</li>
    </ul>
    <article-list :articleList="articleList"></article-list>
    <!-- more btn start -->
    <el-pagination
      small
      :page-size="8"
      layout="prev, pager, next"
      :current-page="currentPage"
      @current-change="_changePagination"
      :total="totalPage">
    </el-pagination>
    <!-- more btn end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleList from '~/components/ArticleList'
export default {
  name: 'Article',
  components: {
    ArticleList,
  },
  fetch ({ params, store }) {
    store.commit('article/SET_CURRENT_PAGE', +params.id)
    return store.dispatch('article/getArticleList', {
      page: params.id,
      per_page: 8,
      _embed: true
    })
  },
  computed: {
    ...mapState(['info']),
    ...mapState('article', ['articleList', 'totalPage', 'currentPage'])
  },
  methods: {
    _changePagination (id) {
      this.$store.commit('article/SET_CURRENT_PAGE', id)
      this.$router.push({
        name: 'article-id-title',
        params: { id }
      })
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

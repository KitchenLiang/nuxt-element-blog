<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <div class="container">
        <div class="links-box p-3" >
          <div class="links-card" v-for="(links, index) in friendlinks" :key="links.key">
            <a :href="links.url" target="_blank" class="thumbnail-wrap">
              <img :src="links.logo" class="thumbnail" alt="">
            </a>
            <div class="links-title">{{links.name}}</div>
          </div>
        </div>
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
      return store.dispatch('getlinks')
    },
    components: {
      AppSidebar,
      ArticleList,
    },
    computed: {
      ...mapState(['info','friendlinks']),
      //跟state做关联 articleList: state => state.articleList,
    },
    head() {
      return {
        title: `${this.info.blog_title}`,
        meta: [{
            name: 'keywords',
            content: this.info.seo_keywords
          },
          {
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

    }
  }
</script>

<style lang="scss" scoped>
  .links-box{
    color: #999;
    background: #fff;
    display: flex;
    flex-wrap:wrap;
    min-height: 80vh;
    align-content: flex-start;
    .links-card{
      width: 30%;
      margin: 1.5%;
      border: 1px solid $color-main-background;
      border-radius: $border-radius;
      height: 150px;
    }
    .links-title{
      text-align: center;
      @include ellipsisMultiline(1, 2);
    }
  }

  .thumbnail-wrap{
    display: block;
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;
    border-radius: 4px;
     .thumbnail{
       position: absolute;
       top: 50%;
       left: 50%;
       width: 100%;
       -webkit-transform: translate3d(-50%, -50%, 0);
       transform: translate3d(-50%, -50%, 0);
     }
  }
</style>

<template>
  <div class="wrap mt-3">
    <div class="main-content">

  <section class="container">
    <!-- 文章内容开始 -->
    <el-timeline>
      <el-timeline-item v-for="(a, index) in archives" :key="index" :timestamp="a.year+''" type="primary" placement="top">
        <div class="mt-2 arc-card" v-for="p in a.posts" :key="p.key">
          <nuxt-link :to="{ name: 'archives-id', params: { id: p.id+'.html'} }"><p>{{p.title}} <span class="arc-card-time">{{ $moment(p.createTime).format("YYYY年MM月DD日") }}</span></p></nuxt-link>
        </div>
      </el-timeline-item>
    </el-timeline>
  </section>
    </div>
    <app-sidebar class="sidebar-wrap" />
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import AppSidebar from '@/components/AppSidebar'
  export default {
    name: 'Details',
    fetch ({ params, error, store }) {
      return store.dispatch('article/getArchives')
    },
    components: {
      AppSidebar
    },
    data () {
      return {

      }
    },
    computed: {
      ...mapState(['info']),
      ...mapState('article', ['archives'])
    },
    head () {
      return {
        title: `归档 - ${this.info.blog_title}`,
        meta: [
          { hid: 'keywords', name: 'keywords', content: this.info.seo_keywords },
          { hid: 'description', name: 'description', content: this.info.seo_description }
        ],
        style: [

        ]
      }
    },
    created () {


    },
    mounted () {



    },
    beforeDestroy () {


    },
    methods: {




    }
  }
</script>
<style lang="scss" scoped>
.arc-card{
  background: #ffffff;
  padding: 0.6rem 1rem 1rem 1rem;
  position: relative;
  -webkit-box-shadow: 0 1px 3px rgba(26,26,26,.1);
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
}
  .arc-card-time{
    position: absolute;
    bottom: 0.1rem;
    right: 1rem;
  }
</style>

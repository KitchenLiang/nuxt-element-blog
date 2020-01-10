<template>
  <div class="single-pagecon">
    <h2 class="single-page-title">
      <span>全部分类</span>
    </h2>
    <ul class="list-wrap">
      <li v-for="item in $store.state.categories.data" :key="item.key" class="list">
        <nuxt-link :to="{ name: 'category-id', params: { id:  item.slugName }, query: { name: item.name} }">{{ item.name }}
          <span class="single-page-badge">{{$changenum(item.postCount)}}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'Page',
    layout: 'page',
    computed: {
      ...mapState(['info']),
    },
    head () {
      return {
        title: `全部分类-${this.info.blog_title}`,
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
    }
  }
</script>

<style lang="scss">

</style>

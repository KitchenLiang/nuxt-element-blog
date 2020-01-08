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
  export default {
    name: 'Page',
    layout: 'page',
    head () {
      return {
        title: `全部分类-${this.$store.state.info.blogName}`
      }
    }
  }
</script>

<style lang="scss">

</style>

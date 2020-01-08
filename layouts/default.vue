<template>
  <div id="app">
    <div :class="['menu-mask', menuStatus && 'is-show-menu']" @click="_closeMenu"></div>
    <app-header/>
    <div :class="['main', menuStatus && 'is-show-menu']">


        <nuxt/>
        <!-- sidebar start -->
        <!-- <app-sidebar class="sidebar-wrap"/> -->
        <!-- sidebar end -->

    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import AppSidebar from '~/components/AppSidebar'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppSidebar
  },
  computed: {
    ...mapState(['menuStatus'])
  },
  methods: {
    _closeMenu () {
      this.$store.commit('UPDATE_MENU_STATUS', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <header :class="['header-container', menuStatus && 'is-show-menu']">
    <div class="hide-header"></div>
    <div class="header-content" ref="header">
      <div class="wrap h-f-100">
        <!-- logo 开始 -->
        <div class="logo">
          <h1>{{ info.blogName }}</h1>
          <nuxt-link :to="{ name: 'index' }" class="block">
            <img :src="info.blog_logo" class="vertical-middle headerlogo" width="130" height="32">
          </nuxt-link>
        </div>
        <!-- logo结束 -->
        <!-- 导航开始 -->

        <el-menu :class="['nav-wrapper', 'h-f-100', menuStatus && 'is-show']" :default-active="$nuxt.$route.fullPath" router class="el-menu-demo" mode="horizontal">
          <el-menu-item v-for="item in menu" :key="item.id" :index="item.url">
             {{ item.name }}
          </el-menu-item>
        </el-menu>

        <!-- 导航结束 -->
        <!-- 右侧搜索开始 -->
        <div class="search-content">
          <el-input
            v-model="searchText"
            type="text"
            size="small"
            placeholder="请输入关键字"
            @keyup.native.enter="_search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="_search" style="cursor: pointer"></i>
          </el-input>
        </div>
        <svg class="search-svg phone-show" @click="_showNavWrap" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="43657"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zM904 784H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zM904 472H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" p-id="43658"></path></svg>
        <!-- 右侧搜索结束 -->
      </div>
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex'
import $ from '@/utils/operationDOM'
export default {
  watchQuery: ['type'],
  name: 'AppHeader',
  data () {
    return {
      searchText: '',
      isShowSearch: false,
      mark: true
    }
  },
  head () {
    return {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: this.info.favicon }
      ],
      style: [
        { cssText: this.info.globalCss, type: 'text/css' }
      ]
    }
  },
  computed: {
    ...mapState(['info', 'menu', 'menuStatus']),
    height () {
      return this.menuStatus ? `${window.innerHeight}px` : '100%'
    }
  },
  watch: {
    menuStatus (v) {
      this.mark = !v
      $('body').css('height', this.height)
      v ? $('body').addClass('h-f-100') : $('body').removeClass('h-f-100')
    }
  },
  methods: {
    // 搜索
    _search () {
      this.$router.push({
        name: 'search',
        query: {
          page: 0,
          keyword: this.searchText
        }
      })
      this.searchText = ''
      this.isShowSearch = false
    },

    // 显示菜单
    _showNavWrap () {
      this.$store.commit('UPDATE_MENU_STATUS', this.mark)
      this.mark = !this.mark
    },

    _closeMenu () {
      this.$store.commit('UPDATE_MENU_STATUS', false)
    }
  }
}
</script>
<style lang="scss" scoped>
$headerHeight: 60px;
.header-container {
  position: relative;
  width: 100%;
  height: $headerHeight;
  background: #fff;

  .hide-header {
    height: $headerHeight;
  }

  .header-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-index + 999;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: $box-shadow;
  }

  .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    h1 {
      position: fixed;
      top: -500%;
      left: 0;
    }
    .headerlogo{
      width: 130px;
      height: 32px;
    }
  }

  // 导航
  .nav-wrapper {
    margin: 0 20px;
    flex:1;
    .nav-view {
      display: flex;
    }

    .nav-item {
      position: relative;
      .first-link {
        display: block;
        padding: 0 10px;
        line-height: $headerHeight;
      }

      &:hover {
        .sub-nav-wrapper {
          display: block;
        }
      }
    }
    .el-menu-item.is-active {
      color: $color-theme;
    }
  }

  // 搜索框
  .search-wrapper {
    width: 200px;



    input[type="text"] {
      -webkit-appearance: none;
      width: 160px;
      height: 30px;
      padding: 0 5px;
    }

    .iconfont {
      width: 30px;
      height: 30px;
      background: $color-main-background;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
  .search-svg{
    width: 2em;
    height: 2em;
  }
}

@media screen and (min-width:1024px) {
  .header-container {
    .sub-nav-wrapper {
      display: none;
      position: absolute;
      top: 100%;
      left: 50%;
      z-index: $z-index;
      width: 180px;
      transform: translateX(-50%);
    }

    .sub-nav-view {
      position: relative;
      top: 10px;
      background: #fff;
      border-radius: $border-radius;
      box-shadow: $box-shadow;

      &:before {
        content: "";
        position: absolute;
        top: -10px;
        left: 50%;
        width: 0;
        height: 0;
        border: {
          width: 5px;
          style: solid;
          color: transparent transparent #fff transparent;
        }
      }
    }

    .sub-item {
      a {
        display: block;
        padding: 10px 15px;

        &:hover {
          background-color: $color-theme;
          color: #fff;
          transform: scaleX(1.05);
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {

  .header-container {
    .search-wrapper {
      display: none;

      &.is-show {
        position: fixed;
        top: 0;
        left: 0;
        z-index: $z-index + 999;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #fff;



        input[type="text"] {
          width: 100%;
          height: 100%;
          font-size: 14px;
        }

        .icon-search {
          width: 50px;
          height: 50px;
          font-size: 24px;
          line-height: 50px;
        }

        .icon-close {
          position: absolute;
          top: -60px;
          right: 0;
          display: block;
          background: none;
          font-size: 24px;
        }
      }
    }
  }
}
@media screen and (max-width:1023px) {
  .search-content{
    margin: 0 10px;
  }
  .header-container {
    .nav-wrapper {
      position: fixed;
      top: 60px;
      right: 0;
      z-index: $z-index + 200;
      width: 200px;
      height: calc(100% - 60px);
      margin: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      transition: .5s;
      transform: translateX(200px);

      &.is-show {
        transform: translateX(0);
      }

      a {
      }

      .nav-view {
        flex-direction: column;
        justify-content: flex-start;
      }

      .nav-item {
        height: auto;

        .first-link {
          padding: 0;
          line-height: 40px;
        }
      }

      .sub-item {
        a {
          display: block;
          padding: 10px 10px 10px 25px;
        }
      }
      .el-menu-item{
        float: none;
      }
      .el-menu-item.is-active {
        color: $color-theme;
        border-bottom: 0;
        border-right: 2px solid $color-theme;
      }
      .sub-item {
        a {
          display: block;
          padding: 10px 10px 10px 25px;
        }
      }
    }

    .controller {
      display: flex;

      .icon-search,
      .icon-menu {
        font-size: 20px;
      }

      .icon-menu {
        margin-left: 10px;
      }
    }

    .logo {
      .headerlogo{
        width: 91px;
        height: 22px;
      }
    }
  }
}
</style>

<template>
  <footer :class="['footer', errorInformation.code && 'is-error', menuStatus && 'is-show-menu']">
    <div class="copyright">
        <div class="left">
          <ul class="footer-menu">
            <li class="list" v-for="item in subMenu" :key="item.key">
              <nuxt-link
                v-if="item.object === 'category'"
                :to="{
                  name: 'category-id',
                  params: { id: 1 },
                  query: { type: item.object_id, title: item.title }
                }"
              >
                {{ item.title }}
              </nuxt-link>
              <nuxt-link
                v-else-if="item.object === 'page'"
                :to="{ name: 'page-id', params: { id: item.object_id } }"
              >
                {{ item.title }}
              </nuxt-link>
              <a v-else-if="item.object === 'custom'" :href="item.url">{{ item.title }}</a>
            </li>
          </ul>
          <!-- 版权文字 -->


        </div>
        <div class="copyright-text">Copyright © 2020 {{info.blog_title}} All Rights Reserved</div>
        <div class="copyright-text" v-html="info.blog_footer_info"></div>
      </div>

    <el-backtop></el-backtop>

  </footer>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AppFooter',
  data () {
    return {
      isShowBackTop: false
    }
  },
  computed: {
    ...mapState(['menuStatus', 'links', 'subMenu', 'errorInformation']),
/*    ...mapState({
      copyright: state => state.info.blog_footer_info
    }) */
    ...mapState(['info'])
  },
  mounted () {
    let self = this
    window.addEventListener('scroll', function () {
      self.isShowBackTop = this.scrollY > 300
    })
  },
  methods: {

  }
}
</script>
<style lang="scss">
.footer {
  padding: 1rem 0;
  transition: .5s;
  color: #999;

  &.is-show-menu {
    transform: translateX(-240px);
  }

  &.is-error {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}

.link-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3b424a;
  line-height: 2;

  &:after {
    content: "";
    flex: auto;
  }


}

.copyright {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: $font-size-small;
    flex-direction: column;
  .footer-menu {
    display: flex;
    flex-wrap: wrap;

    .list {
      margin-right: 15px;
      line-height: 1.8;

      a {
        padding-right: 15px;
        border-right: 1px solid #666;
        font-size: $font-size-base;
      }

      &:last-child {
        a {
          border: 0;
        }
      }
    }
  }

  img {
    vertical-align: baseline;
  }

  .right {
    align-self: flex-end;
  }
}
.copyright-text{
  text-align: center;
  a{
    color: #999;
    &:hover {
      color: $color-theme;
    }
  }
}


@media screen and (max-width:1024px) {
  .copyright {
    flex-wrap: wrap;
  }

  .left {
    width: 100%;
  }

  .right {
    width: 100%;
    margin-top: $container-margin;
    text-align: right;
  }
}
</style>

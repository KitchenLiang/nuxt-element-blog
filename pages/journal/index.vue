<template>
  <div class="wrap mt-3">
    <div class="main-content">
      <section class="container">
        <div class="pin-list-view">
          <ul class="pin-list">
            <li class="item" v-for="(item, index) in journal_list" :key="item.key">
              <div class="pin">
                <div class="pin-header-row">
                  <div class="account-group">
                    <div class="user-popover-box"><!---->
                      <el-avatar :src="profile.avatar"></el-avatar>
                    </div>
                    <div class="pin-header-content">
                      <div class="user-popover-box">
                        {{profile.nickname}}
                      </div>
                      <div class="meta-box">
                        <div class="position ellipsis">{{profile.description}}</div>
                        <div class="dot">·</div>
                        <time>{{$moment(item.createTime).fromNow()}}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pin-content-row">
                  <div class="content-box" v-html="item.content"></div>
                </div>
                <div class="pin-action-row">
                  <div class="action">
                    <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4537">
                      <path
                        d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                        p-id="4538"></path>
                    </svg>
                    <span class="action-title">{{$changenum(item.likes)}}</span>
                  </div>
                  <div class="action" @click="showPinComment(item.id)">
                    <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3457" >
                      <path
                        d="M157.568 751.296c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288z m65.301333 3.786667l-17.258666 63.306666 63.306666-17.258666a32 32 0 0 1 24.522667 3.210666 4515.84 4515.84 0 0 1 32.352 18.944A360.789333 360.789333 0 0 0 512 874.666667c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512c0 60.586667 14.848 118.954667 42.826667 171.136 3.712 6.912 12.928 22.826667 27.370667 47.232a32 32 0 0 1 3.338666 24.714667z m145.994667-70.773334a32 32 0 1 1 40.917333-49.205333A159.189333 159.189333 0 0 0 512 672c37.888 0 73.674667-13.173333 102.186667-36.885333a32 32 0 0 1 40.917333 49.216A223.178667 223.178667 0 0 1 512 736a223.178667 223.178667 0 0 1-143.136-51.690667z"
                        p-id="3458"></path>
                    </svg>
                    <span class="action-title">{{$changenum(item.commentCount)}}</span>
                  </div>
                </div>
                <div class="pin-comment-row" v-if="commentstate[item.id]">
                  <halo-comment :id="item.id" type="journal"></halo-comment>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <div v-if="loading" v-loading="loading" style="height: 100px;">
      </div>
      <div v-if="noMore" class="text-center loadmore">没有更多了</div>
      <div class="text-center loadmore" v-if="!loading">
        <el-button style="width: 60%" type="primary" round @click.native="_changePagination()" v-if="!noMore">加载更多</el-button>
      </div>
    </div>
    <app-sidebar class="sidebar-wrap" />
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import AppSidebar from '@/components/AppSidebar'
  import haloComment from '@/components/Comment/Comment.vue'
  export default {
    name: 'Details',
    async fetch ({ params, error, store }) {
      store.commit('clear_journal_list');
      await store.dispatch('article/getProfile');
      return store.dispatch('getjournal')
    },
    components: {
      AppSidebar,
      haloComment
    },
    data () {
      return {
        commentstate:{},
        noMore: false,
        loading: false
      }
    },
    computed: {
      ...mapState(['journals','journal_list']),
      ...mapState(['info']),
      ...mapState('article', ['profile'])
    },
    head () {
      return {
        title: `日志 - ${this.info.blog_title}`,
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
      showPinComment:function(id){
        this.$set(this.commentstate,id,!this.commentstate[id])
      },
      _changePagination() {
        this.loading = true;
        if (this.journals.pages > this.journals.page + 1) {
          setTimeout(() => {
            this.$store.dispatch('getjournal', {
              page: this.journals.page + 1,
            }).then(res => {
              this.loading = false
            }).catch(err => {
              console.log(err);
            })
          }, 1000);

        } else {
          this.noMore = true;
          this.loading = false
        }

      }


    }
  }
</script>
<style lang="scss" scoped>
  .shadow {
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);

  }
  .pin-list{
    background: #f4f5f5;
    .item{
      margin-bottom: 8px;
      box-shadow: $box-shadow;
    }
  }
  .pin{
    background-color: #fff;
    border-radius: .2rem;
  }
  .user-popover-box{
    display: inline;
  }
  .pin-header-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 2rem 0 1rem;
    .account-group{
      align-items: center;
      display: flex;

    }
    .pin-header-content{
      margin-left: 1rem;
    }
    .meta-box{
      display: flex;
      align-items: center;
      margin: .3rem 0 0;
      font-size: 13px;
      color: #8a9aa9;
      cursor: default;
      .position{
        max-width: 24rem;
      }
      .dot{
        margin: 0 .5em;
      }
    }

  }
  .ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pin-content-row{
    position: relative;
    margin: 1rem 4rem 0 1rem;
  }
  .content-box{
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    color: #17181a;
    overflow: hidden;
    /deep/ img{
      width: 100%;
    }
  }
  .pin-action-row{
    display: flex;
    position: relative;
    margin-top: 1.333rem;
    height: 34px;
    border-top: 1px solid #ebebeb;
  }
  .action{
    flex: 1 1 49.9%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    cursor: pointer;
    user-select: none;
    font-size: 18px;
    color: #8a93a0;
    .action-title{
      margin-left: .3em;
      font-size: 13px;
      font-weight: 500;
    }
  }
  .action:hover {
    color: #666;
  }

  .action:not(:last-child):after{
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -1rem;
    width: 1px;
    height: 2rem;
    background-color: #ebebeb;
  }
</style>

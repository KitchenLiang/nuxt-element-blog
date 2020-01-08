import {
  CLEAR_ARTICLE_LIST,
  UPDATE_ARTICLE_LIST,
  SET_ARTICLE_DETAIL,
  SET_TOTAL_PAGE,
  SET_CURRENT_PAGE,
  SET_POSTSRPP,
  set_Archives,
  set_profile,
  update_Likes,
  UPDATE_OPINION,
  UPDATE_OPINION_LOADING
} from './mutations-types'

export const state = () => ({
  articleList: [],
  detail: {},
  totalPage: 0,
  currentPage: 0,
  viewCount: 0,
})

export const mutations = {
  [CLEAR_ARTICLE_LIST] (state, data) {
    state.articleList = [];
  },

  [UPDATE_ARTICLE_LIST] (state, data) {
    state.articleList = state.articleList.concat(data)
  },

  [SET_ARTICLE_DETAIL] (state, data) {
    state.detail = data
  },

  [SET_TOTAL_PAGE] (state, n) {
    state.totalPage = n
  },

  [SET_CURRENT_PAGE] (state, n) {
    state.currentPage = n
  },
  [SET_POSTSRPP] (state, n) {
    state.postsrpp = n
  },
  [set_Archives] (state, n) {
    state.archives = n
  },
  [set_profile] (state, n) {
    state.profile = n
  },

  [UPDATE_OPINION] (state, data) {
    Object.keys(state.opinion).map(key => {
      state.opinion[key].data = data[key]
    })
  },

  [UPDATE_OPINION_LOADING] (state, { key, flag }) {
    state.opinion[key].isShowLaoding = flag
  },
  [update_Likes] (state, data) {
    state.detail.likes = data
  },


}

export const actions = {
  // 获取文章列表
  async getArticleList ({ rootState, commit }, requestData) {
    try {
      let { data, headers } = await this.$axios.$get(`${process.env.baseUrl}/api/content/posts`, {
        params: requestData,
        data: { progress: false },
        headers:process.env.Authorization,
      })
      commit(UPDATE_ARTICLE_LIST, data.data.content)
      commit(SET_TOTAL_PAGE, data.data.pages)
      commit(SET_CURRENT_PAGE, data.data.page)
      commit(SET_POSTSRPP, data.data.rpp)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 获取文章详情
  async getArticleDetail ({ commit, rootState }, id) {
    try {
      const domainRegexp = /(https?:\/\/([a-z\d-]\.?)+(:\d+)?)?(\/.*)/gi
      let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/posts/${id.replace(".html","")}?formatDisabled=false`,{
        headers:process.env.Authorization
      })

      commit(SET_ARTICLE_DETAIL, data.data)
      commit(update_Likes, data.data.likes)
      this.$axios.$get(`${process.env.baseUrl}/archives/${data.data.url}`);//增加浏览量
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 归档
  async getArchives ({ commit }) {
    try {
      let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/archives/months`,  {
        headers:process.env.Authorization
      })
      commit(set_Archives, data.data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 归档
  async getProfile ({ commit }) {
    try {
      let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/users/profile`,  {
        headers:process.env.Authorization
      })
      commit(set_profile, data.data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 点赞
  async updateLikes ({ commit }, Parameters) {
    console.log(Parameters)
    try {
      let { data } = await this.$axios.$post(`${process.env.baseUrl}/api/content/posts/${Parameters.id}/likes`, [], {
        headers:process.env.Authorization
      })
      commit(update_Likes, Parameters.num+1)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
 // 查询文章
  async searchArticleList ({ commit }, Parameters) {
    try {
      let { data } = await this.$axios.$post(`${process.env.baseUrl}/api/content/posts/search?keyword=${Parameters.keyword}&page=${Parameters.page}`, [], {
        headers:process.env.Authorization
      })
      commit(UPDATE_ARTICLE_LIST, data.data.content)
      commit(SET_TOTAL_PAGE, data.data.pages)
      commit(SET_CURRENT_PAGE, data.data.page)
      commit(SET_POSTSRPP, data.data.rpp)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 查询分类category-controller
   async categoryArticleList ({ commit }, Parameters) {
     try {
       let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/categories/${encodeURI(Parameters.slugname)}/posts?page=${Parameters.page}`, {
         headers:process.env.Authorization
       })
       commit(UPDATE_ARTICLE_LIST, data.data.content)
       commit(SET_TOTAL_PAGE, data.data.pages)
       commit(SET_CURRENT_PAGE, data.data.page)
       commit(SET_POSTSRPP, data.data.rpp)
       return Promise.resolve(data)
     } catch (error) {
       return Promise.reject(error)
     }
   },
   // 查询标tags-controller
    async tagsArticleList ({ commit }, Parameters) {
      try {
        let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/tags/${encodeURI(Parameters.slugname)}/posts?page=${Parameters.page}`, {
          headers:process.env.Authorization
        })
        commit(UPDATE_ARTICLE_LIST, data.data.content)
        commit(SET_TOTAL_PAGE, data.data.pages)
        commit(SET_CURRENT_PAGE, data.data.page)
        commit(SET_POSTSRPP, data.data.rpp)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
}

import {UPDATE_GLOBAL_INFO, UPDATE_ERROR_MESSAGE, UPDATE_MENU_STATUS, set_links,set_journal,set_journal_list,clear_journal_list} from './mutations-types'

export const state = () => ({
  info: {},
  menu: {},
  viewergallery: {},
  friendlinks:[],
  journals:{},
  journal_list:[],
  subMenu: {},
  errorInformation: {
    code: '',
    message: ''
  },
  menuStatus: false
})

export const mutations = {
  [UPDATE_GLOBAL_INFO] (state, { info, menu, tags,categories }) {
    state.info = info
    state.menu = menu
    state.tags = tags
    state.categories = categories
  },

  [UPDATE_ERROR_MESSAGE] (state, data) {
    state.errorInformation = data
  },

  [UPDATE_MENU_STATUS] (state, flag) {
    state.menuStatus = flag
    state.viewergallery = {}
  },
  [set_links] (state, data) {
    state.friendlinks = data
  },
  [set_journal] (state, data) {
    state.journals = data
  },
  [set_journal_list] (state, data) {
    state.journal_list =  state.journal_list.concat(data.content)
  },
  [clear_journal_list] (state, data) {
    state.journal_list =  []
  },
}

export const actions = {
  // 获取公用信息
  async nuxtServerInit ({ commit }) {
    try {
      let { data: info } = await this.$axios.$get(`${process.env.baseUrl}/api/content/options/map_view`,{
        headers:process.env.Authorization
      })
      let { data: menu } = await this.$axios.$get(`${process.env.baseUrl}/api/content/menus?sort=desc`,{
        headers:process.env.Authorization
      })
      let { data: tags } = await this.$axios.$get(`${process.env.baseUrl}/api/content/tags?more=true`,{
        headers:process.env.Authorization
      })
      let { data: categories } = await this.$axios.$get(`${process.env.baseUrl}/api/content/categories?more=true`,{
        headers:process.env.Authorization
      })
      // 判断banner类型
      let result = {
        info: info.data,
        menu: menu.data,
        tags:tags,
        categories:categories,
      }
      // console.log(tags)
      commit(UPDATE_GLOBAL_INFO, result)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  },


  async getlinks ({ commit }) {
    try {
      let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/links`, {
        headers:process.env.Authorization
      })
      commit(set_links, data.data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getjournal ({ commit }, requestData) {
    try {
      let { data } = await this.$axios.$get(`${process.env.baseUrl}/api/content/journals`, {
        params: requestData,
        headers:process.env.Authorization
      })
      commit(set_journal, data.data);
      commit(set_journal_list, data.data);
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
import * as actions from './actions'
// import * as getters from './getters'
// import actions from './actions'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  // getters,
  plugins: [createPersistedState({ storage: {
    getItem: key => wx.getStorageSync(key),
    setItem: (key, value) => wx.setStorageSync(key, value),
    removeItem: key => {}
  } })]
})

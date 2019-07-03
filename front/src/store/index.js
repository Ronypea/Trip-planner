import Vuex from 'vuex'
import Vue from 'vue'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  mutations,
  getters,
  state
})

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import map from './modules/map'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    map,
    app
  },
  getters
})

export default store
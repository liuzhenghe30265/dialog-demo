const state = {
  mapMarkerClickData: {}, // 点击自定义标注数据
  mapClickEventData: {}
}

const mutations = {
  GET_MAP_MARKER_CLICK_DATA: (state, data) => {
    state.mapMarkerClickData = data
  },
  GET_MAP_CLICK_DATA: (state, data) => {
    state.mapClickEventData = data
  }
}

const actions = {
  getMapMarkerClickData ({ commit }, data) {
    commit('GET_MAP_MARKER_CLICK_DATA', data)
  },
  getMapClickData ({ commit }, data) {
    commit('GET_MAP_CLICK_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

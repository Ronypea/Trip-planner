import api from '../services/API'
import store from '../store'

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${store.state.token}`
  }
})

export default {
  fetchRoute () {
    return api().get('index', authHeaders())
  },
  fetchPoint () {
    return api().get('pointinfo', authHeaders())
  },
  addNewRoute (params) {
    return api().post('/addroute', params, authHeaders())
  },
  getRoute ({ id }) {
    return api().get(`route/${id}`, authHeaders())
  },
  setLike (params) {
    return api().post('addlike', params, authHeaders())
  },
  deleteLike (params) {
    return api().post('removeLike', params, authHeaders())
  },
  ProfileInfo () {
    return api().get('profile', authHeaders())
  },
  EditProfile (params) {
    return api().post('/editprofile', params, authHeaders())
  },
  addNewPoint (params) {
    return api().post('addpoint', params, authHeaders())
  },
  getPoint (params) {
    return api().get(`posts/${params.id}`)
  },
  updatePoint (params) {
    return api().put(`posts/${params.id}`, params)
  },
  deletePoint (id) {
    return api().delete(`deletepoint/${id}`)
  },
  // eslint-disable-next-line
  register ({username, password, password_repeated}) {
    return api().post(`register`, { username, password, password_repeated })
  },
  login ({username, password}) {
    return api().post(`login`, { username, password })
  },
  logout () {
    return api().post(`logout`)
  },
  whoAmI () {
    return api().get(`me`, authHeaders())
  }
}

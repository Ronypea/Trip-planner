export default {
  setAuthorized (state, payload) {
    state.isAuthorized = payload
  },
  updateSnackbar (state, payload) {
    state.snackbar = payload
  },
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token) // Если токен пришел, то сохраняем
    } else {
      localStorage.removeItem('token') // Если пришел null, то удаляем токен
    }
  },
  getCoord (state, payload) {
    state.pointCoords = payload
  }
}

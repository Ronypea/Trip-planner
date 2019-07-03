import Service from '@/services/Service'
import router from '@/router'
export default {
  showSnackbar ({commit}, {text = '', timeout = 3000, color = 'success'}) {
    commit('updateSnackbar', {
      text,
      timeout,
      color,
      visible: true
    })
  },
  async register ({dispatch, commit}, user) {
    try {
      const { data } = await Service.register(user)
      dispatch('showSnackbar', {
        text: 'Удачная регистрация'
      })
      commit('setToken', data.token)
      await dispatch('login', user)
    } catch (e) {
      dispatch('showSnackbar', {
        text: 'Ошибка регистрации',
        color: 'error'
      })
      commit('setToken', null)
    }
  },
  async login ({dispatch, commit}, user) {
    try {
      const { data } = await Service.login(user)
      dispatch('showSnackbar', {
        text: 'Удачный вход'
      })
      commit('setToken', data.token)
      dispatch('whoAmI')
    } catch (e) {
      dispatch('showSnackbar', {
        text: 'Ошибка входа',
        color: 'error'
      })
      commit('setToken', null)
    }
  },
  async logout ({commit, dispatch}, { withSnackbar = true }) {
    try {
      await Service.logout()
      if (withSnackbar) {
        dispatch('showSnackbar', {
          text: 'Удачный выход'
        })
      }
      commit('setToken', null)
      commit('setUser', null)
      router.push({name: 'MainPage'})
    } catch (e) {
      if (withSnackbar) {
        dispatch('showSnackbar', {
          text: 'Ошибка при выходе',
          color: 'error'
        })
      }
    }
  },
  async whoAmI ({commit, dispatch}) {
    try {
      const { data } = await Service.whoAmI()
      commit('setUser', data)
    } catch (e) {
      dispatch('showSnackbar', {
        text: 'Ошибка при получении данных с сервера',
        color: 'error'
      })
      dispatch('logout', { withSnackbar: false })
    }
  }
}

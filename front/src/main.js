import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import YmapPlugin from 'vue-yandex-maps'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles/main.scss'
import ru from 'vuetify/es5/locale/ru'
import VuePageTransition from 'vue-page-transition'
import store from './store'

Vue.use(VuePageTransition)
Vue.use(YmapPlugin)
Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    locales: { ru },
    current: 'ru'
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

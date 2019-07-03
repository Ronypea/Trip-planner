import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/pages/MainPage'
import RoutesInfo from '../components/pages/RoutesInfo'
import Profile from '../components/pages/Profile'
import CreateRoute from '../components/pages/CreateRoute'
import EditRoute from '../components/pages/EditRoute'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/route/:id',
      name: 'RoutesInfo',
      component: RoutesInfo
    },
    {
      path: '/editRoute/:id',
      name: 'EditRoute',
      component: EditRoute
    },
    {
      path: '/user',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/newRoute',
      name: 'CreateRoute',
      component: CreateRoute
    }

  ]
})

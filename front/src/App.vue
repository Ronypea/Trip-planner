<template>
  <div id="app">
    <v-app>
      <vue-page-transition name="fade-in-up">
        <router-view/>
      </vue-page-transition>
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout" top>
        {{ snackbar.text }}
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      drawer: false,
      links: [
        {title: 'Главная', icon: '', url: '/'},
        {title: 'Профиль', url: '/user'}
      ]
    }
  },
  computed: {
    ...mapState(['snackbar'])
  },
  created () {
    let savedToken = localStorage.getItem('token')
    console.log('savedTOKEN')
    console.log(savedToken)
    if (savedToken) {
      this.setToken(savedToken)
      this.whoAmI()
    }
  },
  methods: {
    ...mapActions(['whoAmI']),
    ...mapMutations(['setToken'])
  }
}
</script>

<style>
  #app {
    background: #fafafa;
  }
</style>

<template>
  <div id="NavBarUs">
    <v-toolbar>
      <v-toolbar-title>
        <router-link
          to="/"
          tag="span"
          class="pointer"
        >
          <a href="/"> <img class="logo" src="@/components/pictures/logo+name.png"> </a>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-for="link of links"
          :key="link.title"
          :to="link.url"
          flat
        >
          <v-icon>{{link.icon}}</v-icon>
          {{link.title}}
        </v-btn>

        <v-menu offset-y>
          <v-btn flat slot="activator" color="grey">
            <v-icon left>expand_more</v-icon>
            <span>{{ user?user.Login:'' }}</span>
          </v-btn>
          <v-list>
            <v-list-tile>
              <modal-edit-profile></modal-edit-profile>
            </v-list-tile>
            <v-list-tile>
              <v-btn outline @click="logout" block>Выйти</v-btn>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  import ModalEditProfile from '@/components/components/modals/ModalEditProfile'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'NavBarUs',
  components: {
    ModalEditProfile: ModalEditProfile,
  },
  data () {
    return {
      links: [
        {title: 'Главная', icon: '', url: '/'},
        {title: 'Профиль', icon: '', url: '/user'},
        {title: 'Создать маршрут', icon: '', url: '/newRoute'}
      ],
      username: 'Поташов Артём'
    }
  },
  methods: {
    ...mapActions(['logout'])
  },
  computed: {
    ...mapState(['user'])
  },
  props: ['drawer']
}
</script>

<style scoped>
  .pointer {
    cursor: pointer
  }
  .logo {
    width: 270px;
    height: 50px;
  }
  .button {
    margin: 5px;
  }

  .username {
    padding-top: 20px;
    padding-left: 4px;
  }
</style>

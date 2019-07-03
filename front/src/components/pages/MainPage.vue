<template>
  <component :is="isAuthorized?'LayoutAuthUs':'MainLayout'">
    <v-content id="page">
      <v-flex d-flex xs12 sm12 md12>
        <v-card id="info" style="margin: 1rem">
            <v-container fill-height fluid>
              <v-layout align-center justify-centert>
                <v-flex xs12 align-center flexbox>
                  <div style=" border: 3px solid #f1f1f1;">
                  <div id="header"> Route in - это удобный сервис для построения маршрутов!</div>
                  <div id="header2">Находите интересные места, объединяйте их в маршруты и делитесь ими с другими или
                    исследуйте город по самым интересным маршрутам, созданными другими пользователями!
                  </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
        </v-card>
      </v-flex>
      <br/>
      <TripList :items="Route"></TripList>
    </v-content>
  </component>
</template>

<script>
  import Service from '../../services/Service'
  import MainLayout from '@/components/layouts/MainLayout'
  import LayoutAuthUs from '@/components/layouts/LayoutAuthUs'
  import TripList from '@/components/components/TripList'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      MainLayout,
      TripList,
      LayoutAuthUs
    },
    data() {
      return {
        message1: ' Route in - это удобный сервис для построения маршрутов. ',
        message2: 'Находите интересные места, объединяйте их в маршруты и делитесь ' +
          'ими с другими или исследуйте город по самым интересным маршрутам, созданными другими пользователями!',
        Route: [],
        selectedType: ''
      }
    },
    computed: {
      ...mapGetters(['isAuthorized'])
    },
    methods: {
      async getRoute() {
        const response = await Service.fetchRoute()
        this.Route = response.data.routes
        console.log(this.Route)
      }
    },
    mounted() {
      this.getRoute()
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Indie+Flower&display=swap');

  #header {
    text-align: center;
    font-family: 'Indie Flower', cursive;
    font-weight: bold;
    background: rgba(205, 214, 219, 0.3);
    font-size: xx-large;
  }

  #header2 {
    text-align: center;
    font-family: 'Indie Flower', cursive;
    font-weight: bold;
    font-size: large;
    background: rgba(205, 214, 219, 0.3);
  }

  #info {
    height: 400px;
    background-image: url(../../components/pictures/Main_page_2.jpg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #map {
    margin: 15px;
    top: 50%;
  }

  #search {
    width: 50%;
    border: 1px solid;
    margin: 15px;
    background: white;
  }

  h3 {
    font-family: 'Indie Flower', cursive;
  }

</style>

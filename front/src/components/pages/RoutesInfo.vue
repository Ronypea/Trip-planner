<template>
  <component :is="isAuthorized?'LayoutAuthUs':'MainLayout'">
    <v-form style="margin: 2rem">
      <v-content fluid>
        <v-layout row wrap>
          <v-flex d-flex xs8 sm8 md8>
            <v-card flat style="background: #ffffff">
              <div ref="map" style="width:100%; min-height: 100%;"></div>
            </v-card>
          </v-flex>
          <v-flex d-flex xs4 sm4 md4>
            <v-layout row wrap>
              <v-flex d-flex>
                <v-card style="background: #ffffff; margin: 2rem">
                  <v-card-text>
                    <v-layout row>
                      <v-card-title class="headline">{{ Route.Name }}</v-card-title>
                      <v-layout justify-end row>
                        <v-list-tile
                          :key="Route._id"
                          v-on:click="addLike()"
                          v-if="isAuthorized">
                          <v-icon
                            v-if="Like == 0"
                            color="darkgrey"
                          >
                            favorite_border
                          </v-icon>
                          <v-icon
                            v-else
                            color="red darken-2"
                          >
                            favorite
                          </v-icon>
                          {{ Route.Likes }}
                        </v-list-tile>
                        <v-list-tile
                          v-else>
                          <v-icon
                            color="red darken-2"
                          >
                            favorite
                          </v-icon>
                          {{ Route.Likes }}
                        </v-list-tile>
                      </v-layout>
                    </v-layout>
                    <v-list-tile-content>
                      <v-list-tile-title><b>Город: </b>{{ Route.City }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content>
                      <v-list-tile-title><b>Тип: </b>{{ Route.Type }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content>
                      <v-list-tile-title><b>Дата: </b>{{ formatDate(Route.CreateDate) }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-card-actions>
                      <v-list-tile class="grow">
                        <v-list-tile-avatar color="grey darken-3">
                          <v-img
                            class="elevation-2"
                            :src="`https://ui-avatars.com/api/?name=${Route.Author}`"
                          ></v-img>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ Route.Author }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-card-actions>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex d-flex>
                <v-layout row wrap>
                  <v-flex d-flex>
                    <PointList :points="RoutePoints">
                    </PointList>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex d-flex xs8 sm8 md8>
            <v-card style="margin-top: 1rem">
              <v-card-text style="text-align: center">{{ Route.Disc }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-content>
    </v-form>
  </component>
</template>

<script>import Service from '../../services/Service'
import MainLayout from '../layouts/MainLayout'
import LayoutAuthUs from '../layouts/LayoutAuthUs'
import MapService from '../../services/MapService'
import PointList from '../../components/components/PointList'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {MainLayout, PointList, LayoutAuthUs},
  data () {
    return {
      Route: {},
      Coords: [],
      RoutePoints: [],
      Like: '',
      selectedType: ''
    }
  },
  methods: {
    async getRoute () {
      const response = await Service.getRoute({id: this.$route.params.id})
      this.Route = response.data.route
      let formattedPoints = []
      for (let i = 0; i< response.data.routepoints.length; i++) {
        formattedPoints.push({
          id: response.data.routepoints[i]._id,
          name: response.data.routepoints[i].Name,
          type: response.data.routepoints[i].Type,
          author: response.data.routepoints[i].Author,
          disc: response.data.routepoints[i].Disc,
          city: response.data.routepoints[i].City,
          coordinateX: response.data.routepoints[i].CoordX,
          coordinateY: response.data.routepoints[i].CoordY
        })
      }
      this.RoutePoints = formattedPoints
      this.Like = response.data.likecount
      console.log(this.Like)
      this.getCoords(this.RoutePoints)
    },
    getCoords (Points) {
      var index, len
      for (index = 0, len = Points.length; index < len; ++index) {
        var coords = []
        coords.push(Points[index].coordinateX)
        coords.push(Points[index].coordinateY)
        this.Coords.push(coords)
      }
    },
    setupRoute () {
      MapService.renderRoute(this.$refs.map, this.Coords)
    },
    async addLike () {
      if (this.Like == 0){
        await Service.setLike({
          route: this.Route._id
        })
        this.Like += 1
        this.Route.Likes += 1
      }
    },
    formatDate (dateString, formatString = 'MMM Do YY') {
      console.log(new Date(dateString))
      return moment(new Date(dateString)).lang('ru').format('Do MMMM  YYYY')
    }
  },
  mounted () {
    this.getRoute()
  },
  watch: {
    Route (newVal, oldVal) {
      this.setupRoute()
    }
  },
  computed: {
    ...mapGetters(['isAuthorized'])

  }
}

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Indie+Flower&display=swap');

  #name {
    text-align: left;
    font-family: 'Indie Flower', cursive;
    font-weight: bold;
    background: #ffffff;
    font-size: 22px;
    margin-top: 20px;
  }

  .name2 {
    text-align: left;
    font-family: 'Indie Flower', cursive;
    font-weight: bold;
    background: #ffffff;
    font-size: 14px;
    padding-left: 10px;
  }

  #RoutePreview {
    padding: 15px;
    margin: 15px;
    border: 1px solid;
  }

  #search {
    width: 50%;
    border: 1px solid;
    margin: 15px;
    background: white;
  }

  #map {
    margin-top: 30px;
  }

  h1 {
    text-align: center;
    font-family: 'Indie Flower', cursive;
  }

  h3 {
    font-family: 'Indie Flower', cursive;
  }

  .routename {
    padding-left: 20px;
    color: orange;
    position: relative;
    top: 35px;
  }

  .routeinfo {
    position: relative;
    top: 45px;
    left: 20px;
  }

  .like {
    position: relative;
    top: 50px;
  }

</style>

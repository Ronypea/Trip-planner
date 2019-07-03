<template>
  <LayoutAuthUs>
    <v-content id="page">
    <v-flex d-flex xs12 sm12 md12>
        <yandex-map id="map"
                    :coords="[59.939095, 30.315868]"
                    zoom="13"
                    style="width: 300px; height: 400px;"
                    :cluster-options="{
                    1: {clusterDisableClickZoom: true}
                  }"
                    :behaviors="['default']"
                    :controls="['geolocationControl', 'routeEditor', 'searchControl', 'zoomControl', 'typeSelector']"
        >
          <ymap-marker v-for="point in FilteredPoints"
                       v-bind:key="point.id"
                       v-if="CreatedRoute.points.findIndex(function (element, index, obj) {
        if (element.id === point.id) {
          return true
        } else {
          return false
        }
      })===-1"
            marker-id="1"
            marker-type="placemark"
            :coords="[point.coordinateX, point.coordinateY]"
            :hint-content=point.name
            :balloon="{header: point.name, body: point.disc, footer: point.type}"
            :icon="{color: 'red'}"
            cluster-name="1"
          ></ymap-marker>
          <ymap-marker v-for="point in CreatedRoute.points"
                       v-bind:key="point.id"
                       marker-id="2"
                       marker-type="placemark"
                       :coords="[point.coordinateX, point.coordinateY]"
                       :hint-content=point.name
                       :balloon="{header: point.name, body: point.disc, footer: point.type}"
                       :icon="{color: 'blue'}"
                       cluster-name="1"
          ></ymap-marker>

        </yandex-map>
      </v-flex>
     <br/>
      <v-layout row>
      <v-flex xs9 sm9 md9>
        <PointSearchList v-bind:items="Points"
                         v-bind:is-changed="isChanged"
                         v-on:filtered-items-change="FilteredPoints = $event"
                         v-on:new-point-added="addPoint($event)"
       ></PointSearchList>
       <v-layout justify-center>
        <modal-point class="button" v-on:point-added="getPoints"></modal-point>
       </v-layout>
      </v-flex>
      <v-flex xs3 sm3 md3 id="created-route">
        <v-container fluid>
          <h1>Новый маршрут</h1>
          <v-text-field label="Название нового маршрута" v-model="CreatedRoute.name" solo>
          </v-text-field>
        <v-flex md12>
          <v-select :items="uniqueCities" label="Выберите город"  v-model="CreatedRoute.city" solo>
          </v-select>
        </v-flex>
          <v-select :items="uniqueTypes" label="Выберите тип маршрута" single-line v-model="CreatedRoute.type" solo>
          </v-select>
          <v-text-field label="Описание маршрута" outlined v-model="CreatedRoute.disc" solo>
          </v-text-field>
          <point-list-edit v-bind:points="CreatedRoute.points"
                         v-on:point-removed="removePoint($event)"
                           v-on:change="changePoints($event)"
          ></point-list-edit>
        <v-layout justify-center>
        <v-btn v-if="CreatedRoute.points.length > 0" color="green" v-on:click="saveRoute()">Сохранить</v-btn>
        </v-layout>
        </v-container>
      </v-flex>
      </v-layout>
    </v-content>
  </LayoutAuthUs>
</template>

<script>
import LayoutAuthUs from '../../components/layouts/LayoutAuthUs'
import Service from '../../services/Service'
import PointSearchList from '../components/PointSearchList'
import PointListEdit from '../components/PointListEdit'
import ModalPoint from '../../components/components/modals/ModalPoint'
/* eslint-disable */
export default {
  components: {
    PointListEdit,
    PointSearchList,
    LayoutAuthUs,
    ModalPoint
  },
  name: 'CreateRoute',
  data () {
    return {
      Routes: [],
      Points: [],
      isChanged: true,
      map: {},
      FilteredPoints: [],
      CreatedRoute: {
        name: '',
        disc: '',
        author: '',
        city: '',
        type: '',
        points: []},
      uniqueCities: [],
      uniqueTypes: []
    }
  },
  methods: {
    async getPoints () {
      const response = await Service.fetchPoint()
      // this.Points = response.data.points
      let formattedRoutes = []
      for (let i = 0; i< response.data.points.length; i++) {
        formattedRoutes.push({
          id: response.data.points[i]._id,
          name: response.data.points[i].Name,
          type: response.data.points[i].Type,
          author: response.data.points[i].Author,
          disc: response.data.points[i].Disc,
          city: response.data.points[i].City,
          coordinateX: response.data.points[i].CoordX,
          coordinateY: response.data.points[i].CoordY

        })
      }
      this.Points = formattedRoutes
      this.FilteredPoints = formattedRoutes
      console.log(this.Points)
    },
    async getRoutes () {
      const response = await Service.fetchRoute()
      this.Routes = response.data.routes
    },
    changePoints(eventData){
      let old_index = eventData.moved.oldIndex
      let new_index = eventData.moved.newIndex
      this.CreatedRoute.points.splice(new_index, 0, this.CreatedRoute.points.splice(old_index, 1)[0])
      this.isChanged = !this.isChanged
      console.log(this.CreatedRoute.points)
    },
    addPoint (point) {
      this.CreatedRoute.points.push(point)
      let index = this.Points.findIndex(function (element, index, obj) {
        if (element.id === point.id) {
          return true
        } else {
          return false
        }
      })
      let newPoint = this.Points[index]
      newPoint.added = true
      this.Points[index] = newPoint
      this.isChanged = !this.isChanged
      console.log(this.Points)
    },
    removePoint (point) {
      for (let i = 0; i < this.CreatedRoute.points.length; i++) {
        if (this.CreatedRoute.points[i].id === point.id) {
          this.CreatedRoute.points.splice(i, 1)
          i--
        }
      }
      let index = this.Points.findIndex(function (element, index, obj) {
        if (element.id === point.id) {
          return true
        } else {
          return false
        }
      })
      this.Points[index].added = false
      this.isChanged = !this.isChanged
    },
    saveRoute () {
      console.log(JSON.stringify(this.CreatedRoute))
      Service.addNewRoute(this.CreatedRoute)
      this.$router.push({ name: 'MainPage' })
    },
    async RouteTypes () {
      let Types = []
      let index, len
      const response = await Service.fetchRoute()
      Types = response.data.routetypes
      for (index = 0, len = Types.length; index < len; ++index) {
        this.uniqueTypes.push(Types[index].Type)
      }
    },
    async RouteCity () {
      let Cities = []
      let index, len
      const response = await Service.fetchRoute()
      Cities = response.data.city
      for (index = 0, len = Cities.length; index < len; ++index) {
        this.uniqueCities.push(Cities[index].City)
      }
    }
  },
  mounted () {
    this.getPoints()
    this.getRoutes()
    this.RouteTypes()
    this.RouteCity()
  }
}
</script>

<style scoped>
  #created-route{
    background-color: #e2e2e2;
  }
</style>

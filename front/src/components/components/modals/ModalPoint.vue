<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn outline large v-on="on" @click="dialog = true">Добавить точку</v-btn>
    </template>
    <v-card ref="form">
      <v-card-title>
        <span class="headline">Создание новой точки</span>
      </v-card-title>
      <v-flex d-flex xs11 sm11>
        <v-card>
          <div ref="map" style="width: 590px; min-height: 300px;"></div>
        </v-card>
      </v-flex>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-select
                :items="City"
                label="Город*"
                required
                v-model="Point.City"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                :items="Type"
                label="Тип точки*"
                required
                v-model="Point.Type"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Название точки*" required v-model="Point.Name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Описание точки"
                            hint="Историческая справка или почему стоит её посетить"
                            v-model="Point.Disc"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*Обязательное поле ввода</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click="close()">Закрыть</v-btn>
        <v-btn color="green darken-1" flat @click="addPoint()">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>import Service from '../../../services/Service'
import MapService from '../../../services/MapService'
import store from '../../../store';

export default {
  name: 'ModalPoint',
  data () {
    return {
      dialog: false,
      Type: [],
      City: [],
      Point: {
        Name: '',
        Type: '',
        City: '',
        Disc: '',
        CoordX: '',
        CoordY: ''
      }
    }
  },
  methods: {
    async PointTypes () {
      var Types = []
      var index, len
      const response = await Service.fetchPoint()
      Types = response.data.pointtypes
      for (index = 0, len = Types.length; index < len; ++index) {
        this.Type.push(Types[index].Type)
      }
    },
    async PointCity () {
      var Cities = []
      var index, len
      const response = await Service.fetchPoint()
      Cities = response.data.cities
      for (index = 0, len = Cities.length; index < len; ++index) {
        this.City.push(Cities[index].City)
      }
    },
    close () {
      this.dialog = false
      this.$emit('close')
    },
    async setupRoute () {
      await MapService.getCoord(this.$refs.map)
    },
    async addPoint () {
      const PointCoords = store.getters.PointCoords
      this.Point.CoordX = PointCoords[0].toString()
      this.Point.CoordY = PointCoords[1].toString()
      if (this.Point.Name !== '' && this.Point.Type !== '' && this.Point.City !== '') {
        await Service.addNewPoint({
          Name: this.Point.Name,
          City: this.Point.City,
          Type: this.Point.Type,
          Disc: this.Point.Disc,
          CoordX: this.Point.CoordX,
          CoordY: this.Point.CoordY
        })
        this.$emit('point-added')
        store.commit('getCoord', [])
        this.dialog = false
        this.$emit('close')
      } else {
        alert('Empty fields!')
      }
    }
  },
  mounted () {
    this.PointTypes()
    this.PointCity()
    this.setupRoute()
  },
  watch: {
    Route (newVal, oldVal) {
      this.setupRoute()
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div id="point-list">
    <draggable v-model="points" @start="drag=true" @end="drag=false" @change="change($event)">
    <div v-for="point of points"
         v-bind:key="point._id"
         v-bind:class="['point', { active: currentPointId === point.id}]"
         v-on:click="currentPointId=point.id">
      <v-card hover>
        <v-card-title>
          <v-icon
            large
            left
            color="blue"
          >
            place
          </v-icon>
          <span class="title font-weight-normal">
                {{ point.name }}
              </span>
        </v-card-title>
        <v-card-text v-show="currentPointId === point.id">
          <b>Описание: </b>{{ point.disc }}
        </v-card-text>
        <v-card-actions v-show="currentPointId === point.id">
          <v-layout column>
            <v-flex md10>
          <v-list-tile class="grow">
            <v-list-tile-content>
              <v-list-tile-title><b>Тип: </b>{{ point.type }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar color="grey darken-3">
              <v-img
                class="elevation-2"
                :src="`https://ui-avatars.com/api/?name=${point.author}`"
              ></v-img>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ point.author }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
            </v-flex>
          <v-flex md2>
            <v-layout justify-center>
              <v-btn color="info" v-on:click="removeFromRoute(point)">Убрать</v-btn>
            </v-layout>
          </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  name: 'PointListEdit',
  props: {points: Array},
  /*
    point array example(currentPoint is calculated based on id):
    const points = [
  {id: 0, name: 'ma place', type: 'hotel', author: 'me', disc: 'very nice spot'},
  {id: 1, name: 'cool spot', type: 'food', author: 'kanye', disc: 'thank you very cool'},
  {id: 2, name: 'old mansion', type: 'mansion', author: 'admin', disc: 'spooky'},
  {id: 3, name: 'old church', type: 'church', author: 'admin', disc: 'also spooky'},
  {id: 4, name: "Luigi's mansion", type: 'mansion', author: 'admin', disc: 'scary'}
  ]
  */
  data: function () {
    return {
      currentPointId: undefined
    }
  },
  methods: {
    removeFromRoute (point) {
      setTimeout(() => { this.currentPointId = undefined }, 0) // doubtful fix
      this.$emit('point-removed', point)
    },
    change (event) {
      this.$emit('change', event)
    }
  }
}

</script>

<style scoped>
  #point-list {
    margin: 0 15px;
  }
  #point-list .container.fluid {
    padding:0;
  }

</style>

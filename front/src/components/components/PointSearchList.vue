<template>
  <div id="trip-list">
    <h1>Места интереса</h1>
    <v-form style="margin-top: 2rem">
      <v-container fluid>
        <v-layout>
          <v-flex xs12 md3>
            <v-select :items="uniqueCities" label="Выберите город" multiple v-model="filters.cities" solo>
            </v-select>
          </v-flex>
          <v-flex xs12 md3>
            <v-select :items="uniqueTypes" label="Выберите тип" multiple v-model="filters.types" solo>
            </v-select>
          </v-flex>
          <v-flex xs12 md3 offset-md3>
            <v-text-field label="Поиск" v-model="filters.query" solo>

            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <div v-for="point of filteredItems"
         v-bind:key="point.id"
         class="route-item"
         v-on:change="$emit ('filter-change', filteredItems)"
    >
      <v-card hover>
        <v-card-title>
          <v-icon
            v-if="point.added!==true"
            large
            left
            color="red"
          >
            place
          </v-icon>
          <v-icon
            v-else
            large
            left
            color="blue"
          >
            place
          </v-icon>
          <span class="title font-weight-normal">
                {{ point.name }},
                <span class="font-weight-light">{{ point.city }}</span>
              </span>
        </v-card-title>
        <v-card-text>
          {{ point.disc }}
        </v-card-text>
        <v-card-actions>
          <v-layout row>
            <v-flex md9>
              <v-list-tile class="grow">
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
            <v-flex md1 offset-md1>
              <v-btn v-if="point.added!==true" color="info" v-on:click="addToRoute(point)">Добавить</v-btn>
              <v-btn v-else color="correct">Добавлено</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PointSearchList',
  props: ['items', 'isChanged'],
  data () {
    return {
      filters: {
        cities: null,
        types: null,
        query: null
      },
      filteredItemsEmit: []
    }
  },
  methods: {
    addToRoute (point) {
      this.$emit('new-point-added', point)
    }
  },
  computed: {
    uniqueCities () {
      return [...new Set(this.items.map(_ => _.city))]
    },
    uniqueTypes () {
      return [...new Set(this.items.map(_ => _.type))]
    },
    filteredItems () {
      if (!Object.values(this.filters).reduce((acc, item) => acc || item, false)) { // Проверка, что хоть один фильтр задан
        return this.items
      }
      let tmpList = [...this.items]

      if (Array.isArray(this.filters.cities) && this.filters.cities.length > 0) {
        tmpList = tmpList.filter(({ city }) => this.filters.cities.includes(city))
      }

      if (Array.isArray(this.filters.types) && this.filters.types.length > 0) {
        tmpList = tmpList.filter(({ type }) => this.filters.types.includes(type))
      }

      if (this.filters.query && typeof this.filters.query === 'string' && this.filters.query.length >= 3) {
        tmpList = tmpList.filter(({ city, name, disc, author }) => {
          let searchObject = {
            city: city.toLowerCase(),
            name: name.toLowerCase(),
            disc: disc.toLowerCase(),
            author: author.toLowerCase()
          }
          let lowerQuery = this.filters.query.toLowerCase()
          return Object.values(searchObject).reduce((acc, item) => acc || item.includes(lowerQuery), false)
        })
      }

      return tmpList
    }
  },
  watch: {
    filteredItems () {
      console.log(this.filteredItems)
      this.$emit('filtered-items-change', this.filteredItems)
    },
    isChanged: function (newVal, oldVal) { // watch it
      console.log('changed')
      this.$forceUpdate()
    }

  }
}
</script>

<style scoped>
  #trip-list {
    margin: 0 15px;
  }
  .route-item:not(:last-child) {
    margin-bottom: 1rem;
  }
  /*#RoutePreview {*/
  /*  padding: 15px;*/
  /*  border: 1px solid;*/
  /*}*/
  h1 {
    text-align: center;
    font-family: 'Indie Flower', cursive;
  }
  #trip-list .container.fluid {
    padding:0;
  }
</style>

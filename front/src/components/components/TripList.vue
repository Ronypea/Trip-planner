<template>
  <div id="trip-list">
    <h1>Найди свой лучший маршрут</h1>
    <v-form style="margin-top: 2rem">
      <v-container fluid>
        <v-layout>
          <v-flex xs12 md3>
            <v-select :items="uniqueCities" label="Выберите город" multiple v-model="filters.cities" solo>
            </v-select>
          </v-flex>
          <v-flex xs12 md3>
            <v-select :items="uniqueTypes" label="Выберите тип маршрута" multiple v-model="filters.types" solo>
            </v-select>
          </v-flex>
          <v-flex xs12 md3 offset-md3>
            <v-text-field label="Поиск" v-model="filters.query" solo>

            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <div v-for="route of filteredItems"
         v-bind:key="route._id"
         class="route-item">
        <v-card hover
                :to="{path:`/route/${route._id}`}">
          <v-card-title>
              <v-icon
                large
                left
              >
                place
              </v-icon>
              <span class="title font-weight-normal">
                {{ route.Name }},
                <span class="font-weight-light">{{ route.City }}</span>
              </span>
          </v-card-title>
          <v-card-text>
            {{ route.Disc }}
          </v-card-text>
          <v-card-actions>
            <v-list-tile class="grow">
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  class="elevation-2"
                  :src="`https://ui-avatars.com/api/?name=${route.Author}`"
                ></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ route.Author }}</v-list-tile-title>
              </v-list-tile-content>

              <v-layout
                align-center
                justify-end
              >
                <v-icon class="mr-1">date_range</v-icon>
                <span class="subheading">{{ formatDate(route.CreateDate) }}</span>
              </v-layout>
            </v-list-tile>
          </v-card-actions>
        </v-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'list',
  props: ['items'],
  data () {
    return {
      filters: {
        cities: null,
        types: null,
        query: null
      }
    }
  },
  computed: {
    uniqueCities () {
      return [...new Set(this.items.map(_ => _.City))]
    },
    uniqueTypes () {
      return [...new Set(this.items.map(_ => _.Type))]
    },
    filteredItems () {
      if (!Object.values(this.filters).reduce((acc, item) => acc || item, false)) { // Проверка, что хоть один фильтр задан
        return this.items
      }
      let tmpList = [...this.items]

      if (Array.isArray(this.filters.cities) && this.filters.cities.length > 0) {
        tmpList = tmpList.filter(({ City }) => this.filters.cities.includes(City))
      }

      if (Array.isArray(this.filters.types) && this.filters.types.length > 0) {
        tmpList = tmpList.filter(({ Type }) => this.filters.types.includes(Type))
      }

      if (this.filters.query && typeof this.filters.query === 'string' && this.filters.query.length >= 3) {
        tmpList = tmpList.filter(({ City, Name, Disc, Author }) => {
          let searchObject = {
            city: City.toLowerCase(),
            name: Name.toLowerCase(),
            disc: Disc.toLowerCase(),
            author: Author.toLowerCase()
          }
          let lowerQuery = this.filters.query.toLowerCase()
          return Object.values(searchObject).reduce((acc, item) => acc || item.includes(lowerQuery), false)
        })
      }

      return tmpList
    }
  },
  methods: {
    formatDate (dateString, formatString = 'MMM Do YY') {
      console.log(new Date(dateString))
      return moment(new Date(dateString)).lang('ru').format('Do MMMM  YYYY')
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

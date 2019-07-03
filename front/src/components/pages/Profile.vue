<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <LayoutAuthUs>
    <v-content id="page">
      <v-container fluid>
        <v-layout>
          <v-flex xs12 md12>
            <v-card width="400px" class="usinfo">
              <v-card-title>
                <div>
                  <span>ФИО: {{ User.Info.Fio }}</span><br>
                  <span>Описание: {{ User.Info.Info }}</span>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12 md6 pa-3>
            <h2 class="my-3">Созданные маршруты</h2>
            <v-data-iterator
              :items="User.Routes"
              content-tag="v-layout"
              wrap
            >
              <template v-slot:item="props">
                <v-expansion-panel focusable>
                  <v-expansion-panel-content>
                    <template v-slot:header>
                      <div>{{ props.item.Route.Name }}</div>
                    </template>
                    <div class="mx-4 font-weight-bold">
                      {{ props.item.Route.Disc }}
                        <v-btn outline small left v-on:click="RoutePage(props.item.Route._id)">
                          <v-icon>edit</v-icon>
                        </v-btn>
                    </div>
                    <v-timeline class="mx-4">
                      <v-timeline-item
                        v-for="point in props.item.Points"
                        :key="id"
                        color="red lighten-2"
                        large
                      >
                        <template v-slot:opposite>
                          <span>{{ point.Name }}</span>
                        </template>
                        <v-card class="elevation-2">
                          <v-card-text>
                            {{ point.Disc }}
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
            </v-data-iterator>

          </v-flex>
          <v-flex xs12 md6 pa-3>
            <h2 class="my-3">Сохраненные маршруты</h2>
            <v-data-iterator
              :items="Saved.Routes"
              content-tag="v-layout"
              wrap
            >
              <template v-slot:item="props">
                <v-expansion-panel focusable>
                  <v-expansion-panel-content>
                    <template v-slot:header>
                      <div>{{ props.item.Route.Name }}</div>
                    </template>
                    <div class="mx-4 font-weight-bold">
                      {{ props.item.Route.Disc }}
                    </div>
                    <v-timeline class="mx-4">
                      <v-timeline-item
                        v-for="point in props.item.Points"
                        :key="id"
                        color="red lighten-2"
                        large
                      >
                        <template v-slot:opposite>
                          <span>{{ point.Name }}</span>
                        </template>
                        <v-card class="elevation-2">
                          <v-card-text>
                            {{ point.Disc}}
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
            </v-data-iterator>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </LayoutAuthUs>
</template>

<script>
import LayoutAuthUs from '@/components/layouts/LayoutAuthUs'
import Service from '../../services/Service'
export default {
  components: {
    LayoutAuthUs
  },
  data () {
    return {
      Saved: {
        Routes: []
      },
      User: {
        Routes: [],
        Info: {}
      }
    }
  },
  methods: {
    async insertData () {
      const response = await Service.ProfileInfo()
      this.User.Routes = response.data.author
      this.User.Info = response.data.profile
      this.Saved.Routes = response.data.likes
    },
    RoutePage (id){
      this.$router.push({ name: 'EditRoute', params: {id} })
    }
  },
  mounted () {
    this.insertData()
  }
}

</script>

<style scoped>
</style>

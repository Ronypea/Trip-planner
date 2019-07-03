<template>
  <div class="LayoutDefault">
    <NavBar :drawer="drawer"></NavBar>
    <main class="LayoutDefault__main pb-5">
      <slot/>
    </main>
    <v-footer
      dark
      height="auto"
      absolute
    >
      <v-card
        absolute="true"
        class="flex"
        flat
        tile
      >
        <v-card-actions class="grey darken-3 justify-center">
          &copy;2019 — <strong>Ronypea's team</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import NavBar from '@/components/components/navbars/NavBar'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      drawer: false
    }
  },
  name: 'MainLayout'
}
</script>

<style scoped>

</style>

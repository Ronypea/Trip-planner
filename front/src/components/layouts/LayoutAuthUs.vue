<template>
  <div class="LayoutDefault">
    <NavBarUs :drawer="drawer"></NavBarUs>
    <main class="LayoutDefault__main pb-5">
      <slot/>
    </main>
    <v-footer
      dark
      height="auto"
    >
      <v-card
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
import NavBarUs from '@/components/components/navbars/NavBarUs'
export default {
  components: {
    NavBarUs
  },
  data () {
    return {
      drawer: false
    }
  },
  name: 'LayoutAuthUs'
}
</script>

<style scoped>

</style>

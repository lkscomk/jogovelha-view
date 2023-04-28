<template>
  <v-app>
    <notificacao />
    <router-view/>
  </v-app>
</template>

<script>
import notificacao from './components/notificacao.vue'

export default {
  name: 'App',

  components: { notificacao },

  data: () => ({
    //
  }),

  created () {
    this.$vuetify.theme.dark = Boolean(window.atob(localStorage.getItem('portifolio/tema')))
  }
}
</script>

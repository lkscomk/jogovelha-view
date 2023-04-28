<template>
  <v-container
    fluid
    fill-height
  >
    <v-row
      no-gutters
      class="d-flex flex-column justify-center align-center text-center"
    >
      <p class="text-h1 font-weight-black my-6 text-center">
        404
      </p>
      <p class="text-h2 font-weight-bold  text-center">
        Página não encontrada!
      </p>
      <p class="text-h4 font-weight-bold my-6 text-center">
        Voltando para página anterior em: {{ tempo }}...
      </p>
      <v-btn
        color="primary"
        class="rounded-lg"
        x-large
        @click="$router.go(-1)"
      >
        Retornar
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Erro404',
  data: () => ({
    tempo: 10
  }),
  computed: {

  },
  created () {
    this.retornarHome()
  },
  methods: {
    retornarHome () {
      const intervalo = setInterval(() => {
        this.tempo -= 1
        if (this.tempo === 0) {
          clearInterval(intervalo)
          this.$router.go(-1)
        }
      }, 1000)
    }
  }
}
</script>

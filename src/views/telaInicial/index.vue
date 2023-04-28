<template>
  <v-container class="d-flex align-center justify-center color background pa-0 ma-0" fluid fill-height >
    <v-row class="text-center">
      <v-col class="d-flex justify-center" cols="6">
        <v-card
          class="d-flex flex-column"
          width="70%"
          color="primary"
          @click="playAlone()"
        >
          <v-icon
            color="white"
            size="150"
          >
            mdi-account
          </v-icon>
          <div class="mb-5 white--text font-weight-bold">
            JOGAR SOZINHO
          </div>
        </v-card>
        </v-col>
        <v-col cols="6">
        <v-card
          class="d-flex flex-column"
          width="70%"
          color="primary"
          @click="openUrl('/arena')"
        >
          <v-icon
            color="white"
            size="150"
          >
            mdi-account-group
          </v-icon>
          <div class="mb-5 white--text font-weight-bold">
            JOGAR COM OUTRO JOGADOR
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    playAlone () {
      this.$notificacao('Essa etapa ainda está em fase de desenvolvimento!', 'atencao')
    },
    playWithAnotherPlayer () {
      // Adicione aqui a lógica para jogar com outro jogador
    },
    openUrl (url) {
      this.$router.replace({ path: url })
    }
  }
}
</script>

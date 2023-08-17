<template>
  <v-main
    :style="['Workplace', 'Detalhamento do projeto'].indexOf($router.currentRoute.name) > -1
      ? 'padding-left: 0px!important;'
      : 'padding-top: 64px!important;'"
  >
    <!-- TODO: Toolbar do sistema -->
    <v-app-bar
      app
      class="elevation-0"
      color="primary"
    >
      <div class="d-flex align-center">
        <v-toolbar-title
          :class="$vuetify.theme.dark
            ? 'white--text'
            : 'white--text'"
          class="ml-0 mt-1"
          style="cursor: pointer"
          @click="irParaHome()"
        >
          <span
            :class="!$vuetify.breakpoint.mobile
              ? 'headline font-weight-bold'
              : 'title font-weight-bold'"
          >
            Jogo da Velha
          </span>
        </v-toolbar-title>
      </div>

     <v-spacer />

     <!-- <v-btn
        v-if="$vuetify.breakpoint.name === 'xl' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'md'"
        class="mr-2"
        color="white"
        text
        @click="openUrl('/sobre')"
      >
        SOBRE
      </v-btn>
      <div
        v-if="$vuetify.breakpoint.name === 'xl' || $vuetify.breakpoint.name === 'lg' || $vuetify.breakpoint.name === 'md'"
        style="color: white"
      >
        |
      </div> -->
      <v-btn
        text
        dark
        @click="sairPartida()"
      >
        sair do jogo
      </v-btn>
      <v-btn
        text
        @click="alterarTema()"
      >
        <v-icon
          color="white"
        >
          {{
            $vuetify.theme.dark
              ? 'mdi-white-balance-sunny'
              : 'mdi-weather-night'
          }}
        </v-icon>
      </v-btn>
      <!-- <v-menu
        v-if="$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs'"
        offset-y
        left
      >
        <template v-slot:activator="{ on }">
          <v-tooltip
            activator="#mo-modal-tooltip"
            bottom
          >
            <span>Mais Opções</span>
          </v-tooltip>
          <v-btn
            class="mx-0"
            small
            icon
            v-on="on"
            >
            <v-icon
              color="white"
            >
                mdi-menu
              </v-icon>
            </v-btn>
          </template>
          <v-list
          class="pa-0"
          dense
        >
          <v-list-item @click="openUrl('/sobre')">
            <v-list-item-content>
              <v-list-item-title> SOBRE </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        </v-menu> -->
    </v-app-bar>

    <!-- TODO: Transição do router -->
    <v-container
      class="pa-0"
      fluid
    >
      <router-view />
    </v-container>

    <!-- TODO: Footer -->
    <v-footer
      app
      class="pa-0 color primary"
      dark
      height="20"
    >
      <v-col
        class="text-center ma-0 pa-0 caption"
        cols="12"
      >
        <strong>
          Todos os direitos reservados @LUKAS
        </strong>
      </v-col>
    </v-footer>
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LayoutSistema',

  data: () => ({
    loading: false,
    versao: '1.0.0'
  }),

  methods: {
    ...mapActions('app', [
      'avisarSair'
    ]),
    alterarTema () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem(
        'portifolio/tema',
        this.$vuetify.theme.dark
      )
    },
    async deslogar () {
      this.loading = true

      const res = await this.logout()
      if (!res.erro) this.$router.push('/login')

      this.loading = false
    },
    openUrl (url) {
      const route = this.$router.resolve({ path: url })

      if (url) {
        this.$router.push(route.href)
      }
    },
    async sairPartida () {
      await this.avisarSair()
      window.localStorage.removeItem('id')
      window.localStorage.removeItem('jogadorId')
      window.localStorage.removeItem('idAdversario')
      window.localStorage.removeItem('portifolio/tema')
      window.localStorage.removeItem('nome')
      window.localStorage.removeItem('nomeAdversario')
      window.localStorage.removeItem('atualVez')
      window.localStorage.removeItem('simbolo')
      this.$notificacao('Desconectado da sala com sucesso', 'atencao')
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }
}
</script>

<style lang="scss">
.favoritos {
  .le {
    visibility: hidden !important;
  }
}
.favoritos:hover {
  .le {
    visibility: visible !important;
  }
}
.menu {
  .v-treeview-node__level {
    width: 10px !important;
  }
  .v-treeview-node__children > .v-treeview-node__root {
    margin-left: 10px !important;
  }
  .v-treview-node--leaf > .v-treeview-node__root,
  .v-treeview-node--click > .v-treeview-node__root {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .v-treeview-node__root {
    padding-left: 10px !important;
    height: 35px !important;
    transition: border-left 0.2s ease-in-out;
  }

  .v-treeview-node__toggle {
    width: 25px !important;
  }
  .desativa-duplo-click {
    pointer-events: none !important;
  }
}
</style>

<template>
  <v-container>
    <loading :value="loading" />

    <v-dialog
      v-model="modal"
      persistent
      max-width="450"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ salaExistente ? 'ENTRAR EM UM JOGO' : 'INICIAR UM JOGO'}}
        </v-card-title>
        <v-card-text>
          <validation-observer
            v-if="!salaExistente"
            ref="criarObserve"
          >
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
              <validation-provider
                v-slot="{ errors }"
                name="Nome"
                rules="required"
                vid="nome"
              >
                <v-text-field
                  v-model="formulario.nome"
                  :hide-details="!errors"
                  :error-messages="errors"
                  label="Nome"
                ></v-text-field>
              </validation-provider>
              </v-col>
              <v-col
                cols="12"
              >
              <validation-provider
                v-slot="{ errors }"
                name="Simbolo"
                rules="required"
                vid="simbolo"
              >
              <v-autocomplete
                v-model="formulario.simbolo"
                :items="itemsSimbolos"
                :hide-details="!errors"
                :error-messages="errors"
                dense
                filled
                label="Simbolo"
              ></v-autocomplete>
            </validation-provider>
              </v-col>
              <v-col>
                <v-btn
                  v-if="!salaExistente"
                  color="red darken-1"
                  small
                  text
                  @click="salaExistente = true, $refs.criarObserve ? $refs.criarObserve.reset() : null"
                >
                  Entrar em sala existente
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          </validation-observer>
          <validation-observer
            v-else
            ref="entrarObserve"
          >
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >

                <validation-provider
                  v-slot="{ errors }"
                  name="Nome"
                  rules="required"
                  vid="nome"
                >
                <v-text-field
                  v-model="formulario.nome"
                  :hide-details="!errors"
                  :error-messages="errors"
                  label="Nome"
                ></v-text-field>
              </validation-provider>
              </v-col>
              <v-col
                cols="12"
              >
              <validation-provider
                v-slot="{ errors }"
                name="Id da sala"
                rules="required"
                vid="id"
              >
                <v-text-field
                  v-model="formulario.id"
                  :hide-details="!errors"
                  :error-messages="errors"
                  label="Id da sala"
                ></v-text-field>
              </validation-provider>
              </v-col>
              <v-col>
                <v-btn
                  v-if="salaExistente"
                  color="red darken-1"
                  small
                  text
                  @click="salaExistente = false, $refs.criarObserve ? $refs.criarObserve.reset() : null"
                >
                  Criar sala
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          </validation-observer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="salaExistente ? entrarSalaRegistro() : criarSalaRegistro()"
          >
          {{ salaExistente ? 'Entrar na sala' : 'Criar sala' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="formularioFim.modalFim"
      persistent
      max-width="450"
    >
      <v-card>
        <v-toolbar
          :color="formularioFim.corFim"
          dark
        >{{ formularioFim.tituloFim }}</v-toolbar>
        <v-card-text>
          <div class="text-h6 pa-12">{{ formularioFim.mensagemFim }}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="formularioFim.modalFim = false, zerarJogoRegistro()"
          >Jogar novamente</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="formularioNovamente.modal"
      persistent
      max-width="450"
    >
      <v-card>
        <v-toolbar
          :color="formularioNovamente.cor"
          dark
        >{{ formularioNovamente.titulo }}</v-toolbar>
        <v-card-text>
          <div class="text-h6 pa-12">{{ formularioNovamente.mensagem }}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="formularioNovamente.modal = false"
          >Jogar novamente</v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="formularioNovamente.modal = false, modal = true, resetFormulario(), socket.disconnect(), limparMatriz()"
          >
            Não, sair da sala
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert
      v-if="notificacao.modal"
      border="top"
      :color="notificacao.cor"
      dark
    >
      {{ notificacao.msg }}
    </v-alert>

    <v-row dense class="d-flex justify-center">
      <v-col
        cols="12"
        xl="4"
        lg="6"
        md="8"
        sm="10"
      >
        <v-card
          v-if="formulario.jogadorId"
          class="mb-5"
        >
          <v-card-text>
            <v-row
              dense
              :class="`d-flex ${ $vuetify.breakpoint.width > 400 ? 'text-h6' : ''} text-center`"
            >
              <v-col cols="12">
                {{ formulario.jogadorId }} - {{ formulario.nome }}
                <v-btn
                class="ma-2"
                color="purple"
                dark
                small
                fab
              >
                <v-icon dark x-large>
                  {{ formulario.simbolo === 'x' ? 'mdi-alpha-x' : formulario.simbolo === 'o' ?  'mdi-alpha-o' : null }}
                </v-icon>
              </v-btn>
              {{ formulario.idAdversario ? 'X' : null}}
              <v-btn
                v-if="formulario.idAdversario"
                class="ma-2"
                color="green"
                dark
                small
                fab
              >
                <v-icon dark x-large>
                  {{ formulario.simbolo === 'o' ? 'mdi-alpha-x' : formulario.simbolo === 'x' ?  'mdi-alpha-o' : null }}
                </v-icon>
              </v-btn>
              {{ formulario.idAdversario ? `${formulario.idAdversario} - ${formulario.nomeAdversario}` : null }}
              </v-col>
              <v-col v-if="$vuetify.breakpoint.width < 500" cols="12" class="text-caption">
                Clique para copiar o código abaixo e envie para o outro jogador!
              </v-col>
              <v-col cols="12">
                <v-tooltip class="pa-0 ma-0" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      block
                      text
                      :small="$vuetify.breakpoint.width < 400"
                      v-bind="attrs"
                      v-on="on"
                      @click="copiarTexto(formulario.id)"
                    >
                      {{ formulario.id }}
                    </v-btn>
                    <!-- <span
                      class="primary--text text-h6"
                      v-bind="attrs"
                      v-on="on"
                    >{{ formulario.id }}</span> -->
                  </template>
                  <span>Copie esse código e envio para o outro jogador!</span>
                </v-tooltip>
                <v-divider></v-divider>
              </v-col>
              <v-col
                v-if="!formulario.idAdversario"
                cols="12"
                class="text-center mt-4"
              >
                <p>Aguardando o outro jogador!</p>
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-col>
              <v-col
                v-if="formulario.idAdversario && formulario.atualVez === formulario.jogadorId"
                cols="12"
              >
                é a sua vez
              </v-col>
              <v-col
                v-if="formulario.idAdversario && formulario.atualVez === formulario.idAdversario"
                cols="12"
              >
                aguarde, é a vez do {{ formulario.nomeAdversario }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider />
        <v-row
          v-for="(linhas, i) in matriz"
          :key="i"
          dense
        >
          <v-col
            v-for="(colunas, e) in linhas"
            :key="e"
            cols="4"
          >
            <v-card outlined class="d-flex justify-center aling-center" height="200" width="100%" @click="formulario.idAdversario && formulario.jogadorId && formulario.atualVez === formulario.jogadorId ? jogarPartidaRegistro(colunas.id) : null">
              <v-icon
                size="150"
                :color="colunas.simbolo === formulario.simbolo ? 'purple' : 'green'"
              >
                {{ colunas.simbolo === 'x' ? 'mdi-alpha-x' : colunas.simbolo === 'o' ?  'mdi-alpha-o' : null }}
              </v-icon>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import io from 'socket.io-client'

export default {
  name: 'ComponenteDisplayChars',
  data: () => ({
    matriz: [
      [{ id: 1, simbolo: '' }, { id: 2, simbolo: '' }, { id: 3, simbolo: '' }],
      [{ id: 4, simbolo: '' }, { id: 5, simbolo: '' }, { id: 6, simbolo: '' }],
      [{ id: 7, simbolo: '' }, { id: 8, simbolo: '' }, { id: 9, simbolo: '' }]
    ],
    itemsSimbolos: [
      'x',
      'o'
    ],
    rules: [v => v >= 25 || 'Mínimo de 25 caracteres.'],
    modal: false,
    formularioNovamente: {
      modalNovamente: false,
      corNovamente: 'primary',
      tituloNovamente: null,
      mensagemNovamente: null
    },
    formularioSaiu: {
      modalFim: false,
      corFim: 'primary',
      tituloFim: null,
      mensagemFim: null
    },
    formularioFim: {
      modalFim: false,
      corFim: 'primary',
      tituloFim: null,
      mensagemFim: null
    },
    loading: false,
    notificacao: {
      modal: false,
      cor: 'red',
      msg: 'dftgdnd'
    },
    formulario: {
      id: null,
      jogadorId: null,
      nomeAdversario: null,
      idAdversario: null,
      nome: null,
      simbolo: null,
      atualVez: null
    },
    mgsErro: null,
    salaExistente: false
  }),
  computed: {
    ...mapState('app', [
      'registros'
    ])
  },
  created () {
    if (this.$route.query.sala) {
      this.salaExistente = true
      this.formulario.id = this.$route.query.sala
      this.$router.replace({ path: this.$route.path })
    }
    if (window.localStorage.getItem('id')) this.reconectar()
    else this.modal = true
  },
  methods: {
    ...mapActions('app', [
      'criarSala',
      'criarJogador',
      'entrarSala',
      'removerJogador',
      'atualSituacao'
    ]),
    conectar () {
      this.socket = io('wss://websocket-jogovelha.lukasrocha.repl.co')

      this.socket.on('jogadorEntrou', (msg) => {
        if (!this.formulario.nomeAdversario) {
          this.formulario.nomeAdversario = msg.nome
          this.formulario.idAdversario = msg.jogadorId
        }
      })

      this.socket.on('connect', (msg) => {
        window.console.log('connect')
      })

      this.socket.on('jogadorSaiu', (msg) => {
        this.removerJogadorRegistro()
      })

      this.socket.on('zerarJogo', (msg) => {
        if (msg.atualVez !== this.formulario.jogadorId) {
          this.formularioFim.modalFim = false
          this.formularioNovamente = {
            modal: true,
            cor: 'primary',
            titulo: 'Jogar novamente',
            mensagem: `O jogador ${this.formulario.nomeAdversario} chamou você para jogar novamente, você deseja continuar?`
          }
        }
        this.formulario.atualVez = msg.atualVez
        this.matriz = [
          [{ id: 1, simbolo: msg.jogo[0] }, { id: 2, simbolo: msg.jogo[1] }, { id: 3, simbolo: msg.jogo[2] }],
          [{ id: 4, simbolo: msg.jogo[3] }, { id: 5, simbolo: msg.jogo[4] }, { id: 6, simbolo: msg.jogo[5] }],
          [{ id: 7, simbolo: msg.jogo[6] }, { id: 8, simbolo: msg.jogo[7] }, { id: 9, simbolo: msg.jogo[8] }]
        ]
      })

      this.socket.on('jogarPartida', (msg) => {
        this.formulario.atualVez = msg.atualVez
        this.matriz = [
          [{ id: 1, simbolo: msg.jogo[0] }, { id: 2, simbolo: msg.jogo[1] }, { id: 3, simbolo: msg.jogo[2] }],
          [{ id: 4, simbolo: msg.jogo[3] }, { id: 5, simbolo: msg.jogo[4] }, { id: 6, simbolo: msg.jogo[5] }],
          [{ id: 7, simbolo: msg.jogo[6] }, { id: 8, simbolo: msg.jogo[7] }, { id: 9, simbolo: msg.jogo[8] }]
        ]
        if (msg && msg.vencedor) {
          if (msg.vencedor !== 'empate') {
            this.formularioFim = {
              modalFim: true,
              corFim: msg.vencedor === this.formulario.jogadorId ? 'green' : 'red',
              tituloFim: msg.vencedor === this.formulario.jogadorId ? 'Campeão!' : 'Não foi dessa vez',
              mensagemFim: msg.vencedor === this.formulario.jogadorId ? 'Parabéns você venceu!' : 'Ah, infelizmente você perdeu, mas não fique triste, você pode jogar novamente'
            }
          } else if (msg.vencedor === 'empate') {
            this.formularioFim = {
              modalFim: true,
              corFim: 'orange',
              tituloFim: 'Empate!',
              mensagemFim: 'Ah, infelizmente você empatou, mas não fique triste, você pode jogar novamente'
            }
          }
        }
      })
    },
    async verificarSituacao (id) {
      this.atualSituacao({ partidaId: id })
    },
    async jogarPartidaRegistro (jogo) {
      this.socket.emit('jogarPartida', { ...this.formulario, jogo })
    },
    async zerarJogoRegistro () {
      this.socket.emit('zerarJogo', { partidaId: this.formulario.id, atualVez: this.formulario.jogadorId })
    },
    async criarSalaRegistro () {
      if (await this.$refs.criarObserve.validate()) {
        this.loading = true
        this.modal = false
        const res = await this.criarSala()
        if (res) {
          this.formulario.id = res.id
          const resDois = await this.criarJogador({
            partidaId: res.id,
            nome: this.formulario.nome,
            simbolo: this.formulario.simbolo
          })
          if (resDois) {
            this.formulario.atualVez = resDois.jogadorId
            this.formulario.jogadorId = resDois.jogadorId
            this.modal = false
            this.conectar()
          }
        }
        this.loading = false
      }
    },
    async removerJogadorRegistro () {
      await this.removerJogador({ partidaId: this.formulario.id, jogadorId: this.formulario.idAdversario })
      this.$notificacao('O outro jogar saiu do jogo.', 'atencao')
      this.formulario.idAdversario = null
      this.formulario.nomeAdversario = null
      this.limparMatriz()
    },
    async entrarSalaRegistro () {
      if (await this.$refs.entrarObserve.validate()) {
        this.loading = true
        const res = await this.entrarSala({
          partidaId: this.formulario.id,
          nome: this.formulario.nome
        })
        if (res && !res.erro) {
          this.formulario = {
            id: res.id,
            jogadorId: res.jogadorId,
            simbolo: res.simbolo,
            nome: res.nome,
            nomeAdversario: res.nomeAdversario,
            idAdversario: res.idAdversario,
            atualVez: res.atualVez
          }
          this.modal = false
          await this.conectar()
          this.socket.emit('entradaSala', { jogadorId: res.jogadorId, nome: res.nome })
        }
        this.loading = false
      }
    },
    async reconectar () {
      const res = await this.atualSituacao({
        partidaId: window.localStorage.getItem('id'),
        jogadorId: window.localStorage.getItem('jogadorId')
      })

      if (res && !res.erro) {
        this.formulario = {
          id: res.id,
          jogadorId: res.jogadorId,
          simbolo: res.simbolo,
          nome: res.nome,
          nomeAdversario: res.nomeAdversario,
          idAdversario: res.idAdversario,
          atualVez: res.atualVez
        }
        this.matriz = [
          [{ id: 1, simbolo: res.jogos[0] }, { id: 2, simbolo: res.jogos[1] }, { id: 3, simbolo: res.jogos[2] }],
          [{ id: 4, simbolo: res.jogos[3] }, { id: 5, simbolo: res.jogos[4] }, { id: 6, simbolo: res.jogos[5] }],
          [{ id: 7, simbolo: res.jogos[6] }, { id: 8, simbolo: res.jogos[7] }, { id: 9, simbolo: res.jogos[8] }]
        ]
        this.conectar()
      }
      this.modal = false
    },
    copiarTexto (item) {
      this.$copyText('https://jogovelha.lukasrocha.repl.co' + '?sala=' + item)
      this.$notificacao('Código copiado com sucesso.')
    },
    limparMatriz () {
      this.matriz = [
        [{ id: 1, simbolo: '' }, { id: 2, simbolo: '' }, { id: 3, simbolo: '' }],
        [{ id: 4, simbolo: '' }, { id: 5, simbolo: '' }, { id: 6, simbolo: '' }],
        [{ id: 7, simbolo: '' }, { id: 8, simbolo: '' }, { id: 9, simbolo: '' }]
      ]
    },
    resetFormulario () {
      this.formulario = {
        id: null,
        jogadorId: null,
        nomeAdversario: null,
        idAdversario: null,
        nome: null,
        simbolo: null,
        atualVez: null
      }
    }
  }
}
</script>

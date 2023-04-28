export default {
  registros (state, params) {
    state.registros = params
  },
  setNotificacao (state, { ativo, cor, icone, mensagem, tempo }) {
    state.notificacao = {
      ativo,
      cor,
      icone,
      mensagem,
      tempo
    }
  },
  reset: () => {}
}

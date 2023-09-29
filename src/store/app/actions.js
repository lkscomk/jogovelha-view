import axios from '@/plugins/axios'

export const avisarSair = async ({ commit }, id) => {
  try {
    const res = await axios.get('/avisar-sair')

    return res.data
  } catch (error) {
    return null
  }
}
export const atualSituacao = async ({ commit }, id) => {
  try {
    const res = await axios.post('/atual-situacao', id)

    return res.data
  } catch (error) {
    return null
  }
}
export const jogarContraComputador = async ({ commit }, dados) => {
  try {
    const res = await axios.post('/jogar-computador', dados)

    return res.data
  } catch (error) {
    return null
  }
}

export const removerJogador = async ({ commit }, dados) => {
  try {
    const res = await axios.post('/remover-jogador', dados)

    return res.data
  } catch (error) {
    return null
  }
}

export const criarSala = async ({ commit }, id) => {
  try {
    const res = await axios.post('/criar-sala')

    localStorage.setItem('id', res.data.id)

    return res.data
  } catch (error) {
    return null
  }
}
export const criarJogador = async ({ commit }, dados) => {
  try {
    const res = await axios.post('/criar-jogador', dados)

    localStorage.setItem('jogadorId', res.data.jogadorId)

    return res.data
  } catch (error) {
    return null
  }
}
export const entrarSala = async ({ commit }, dados) => {
  try {
    const res = await axios.post('/entrar-sala', dados)

    localStorage.setItem('id', res.data.id)
    localStorage.setItem('jogadorId', res.data.jogadorId)
    localStorage.setItem('nome', res.data.nome)
    localStorage.setItem('atualVez', res.data.atualVez)
    localStorage.setItem('idAdversario', res.data.idAdversario)
    localStorage.setItem('nomeAdversario', res.data.nomeAdversario)
    localStorage.setItem('simbolo', res.data.simbolo)

    return res.data
  } catch (error) {
    return null
  }
}

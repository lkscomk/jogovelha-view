import axios from '@/plugins/axios'

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

    return res.data
  } catch (error) {
    return null
  }
}

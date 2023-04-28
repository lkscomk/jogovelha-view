import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

const Axios = axios.create({
  baseURL: 'https://websocket-jogovelha.lukasrocha.repl.co'
})

Axios.interceptors.response.use((response) => {
  if (typeof response.data.mensagem === 'string') Vue.prototype.$notificacao(response.data.mensagem)
  else if (typeof response.data.erro === 'string') {
    if (response.data.erro) Vue.prototype.$notificacao(response.data.erro, 'erro')
    if (response.data.tipo === 'Error') Vue.prototype.$notificacao(response.data.erro, 'erro')
    else Vue.prototype.$notificacao(response.data.erro, 'erro', true)
  } else if (typeof response.data.atencao === 'string') Vue.prototype.$notificacao(response.data.atencao, 'atencao')
  else if (typeof response.data.informacao === 'string') Vue.prototype.$notificacao(response.data.informacao, 'informacao')

  return response
}, (error) => {
  if (axios.isCancel(error)) {
    return Promise.resolve(error.response)
  } else if (!error.response) {
    Vue.prototype.$notificacao('Erro ao processar requisição. Tente novamente!', 'erro')
    // localStorage.removeItem('igprojetos:token')
    // localStorage.removeItem('igprojetos:nome')
  } else if (error.response.status === 401) {
    localStorage.removeItem('igprojetos:token')

    router.push('/login')
    Vue.prototype.$notificacao('Por Favor faça login novamente', 'atencao')
  } else if (error.response.status === 403) {
    Vue.prototype.$notificacao('Usuário sem permissão', 'atencao')
  } else if (error.response.status === 404) {
    Vue.prototype.$notificacao('Requisição não encontrada!', 'erro')
  } else if (error.response.status === 500) {
    if (error.response.data && typeof error.response.data.erro === 'string') {
      Vue.prototype.$notificacao(error.response.data.erro, 'erro', true)
    } else if (error.response.data && typeof error.response.data.erro === 'object') {
      return Promise.resolve(error.response)
    }
  } else {
    Vue.prototype.$notificacao('Erro ao processar requisição. Tente novamente!', 'erro')
  }

  return Promise.reject(error)
})

Vue.prototype.$axiosLocal = Axios

export default Axios

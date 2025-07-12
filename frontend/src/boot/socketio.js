import { io } from 'socket.io-client'
import { Loading } from '@/lib/utils'
import { $t } from '@/boot/i18n'

const socket = io(`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`)

export default ({ app }) => {
  socket.on('disconnect', () => {
    Loading.show({
      message: `<i class='material-icons'>wifi_off</i><br /><p>${$t('msg.wrongContactingBackend')}</p>`,
      html: true,
      backgroundColor: 'rgba(220, 38, 38, 0.9)', // red-600 equivalent
      delay: 5000
    })
  })

  socket.on('connect', () => {
    Loading.hide()
  })

  // Ajoute $socket globalement dans l'app Vue 3
  app.config.globalProperties.$socket = socket
}

// Si tu veux l'importer ailleurs dans ton code sans `this.$socket`
export { socket }

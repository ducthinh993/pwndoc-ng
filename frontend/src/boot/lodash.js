import Lodash from 'lodash'

export default ({ app }) => {
  app.config.globalProperties.$_ = Lodash
}

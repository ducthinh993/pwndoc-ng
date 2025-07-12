import { api } from '@/boot/axios'

export default {
  getCollabs() {
    return  api.get('users')
  },

  createCollab(collab) {
    return  api.post('users', collab)
  },

  updateCollab(collabId, collab) {
    return  api.put(`users/${collabId}`, collab)
  },

  deleteCollab(collabId) {
    return  api.delete(`users/${collabId}`)
  },

  deleteAllCollab() {
    return  api.delete('users')
  },
}

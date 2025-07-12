import { api } from '@/boot/axios'

export default {
  getClients() {
    return  api.get('clients')
  },

  exportClients() {
    return  api.get('clients/export')
  },

  createClients(client) {
    return  api.post('clients', client)
  },

  updateClient(clientId, client) {
    return  api.put(`clients/${clientId}`, client)
  },

  deleteClient(clientId) {
    return  api.delete(`clients/${clientId}`)
  },

  deleteAllClients() {
    return  api.delete('clients')
  },
}

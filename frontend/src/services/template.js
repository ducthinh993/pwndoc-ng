import { api } from '@/boot/axios'

export default {
  getTemplates() {
    return  api.get('templates')
  },

  createTemplate(template) {
    return  api.post('templates', template)
  },

  updateTemplate(templateId, template) {
    return  api.put(`templates/${templateId}`, template)
  },

  deleteTemplate(templateId) {
    return  api.delete(`templates/${templateId}`)
  },

  downloadTemplate(templateId) {
    return  api.get(`templates/download/${templateId}`, { responseType: 'blob' })
  },
}

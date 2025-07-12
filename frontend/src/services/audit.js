import { api } from '@/boot/axios'

export default {
  getAudits(filters) {
    let queryParams = '?'
    if (filters)
      if (filters.findingTitle)
        queryParams += `findingTitle=${filters.findingTitle}`
    return  api.get(`audits${queryParams}`)
  },

  getAudit(auditId) {
    return  api.get(`audits/${auditId}`)
  },

  createAudit(audit) {
    return  api.post('audits', audit)
  },

  deleteAudit(auditId) {
    return  api.delete(`audits/${auditId}`)
  },

  getAuditGeneral(auditId) {
    return  api.get(`audits/${auditId}/general`)
  },

  updateAuditGeneral(auditId, audit) {
    return  api.put(`audits/${auditId}/general`, audit)
  },

  getAuditNetwork(auditId) {
    return  api.get(`audits/${auditId}/network`)
  },

  updateAuditNetwork(auditId, audit) {
    return  api.put(`audits/${auditId}/network`, audit)
  },

  createFinding(auditId, finding) {
    return  api.post(`audits/${auditId}/findings`, finding)
  },

  getFinding(auditId, findingId) {
    return  api.get(`audits/${auditId}/findings/${findingId}`)
  },

  updateFinding(auditId, findingId, finding) {
    return  api.put(`audits/${auditId}/findings/${findingId}`, finding)
  },

  deleteFinding(auditId, findingId) {
    return  api.delete(`audits/${auditId}/findings/${findingId}`)
  },

  getSection(auditId, sectionId) {
    return  api.get(`audits/${auditId}/sections/${sectionId}`)
  },

  updateSection(auditId, sectionId, section) {
    return  api.put(`audits/${auditId}/sections/${sectionId}`, section)
  },

  getAuditTypes() {
    return  api.get('audits/types')
  },

  generateAuditReport(auditId) {
    return  api.get(`audits/${auditId}/generate`, { responseType: 'blob' })
  },

  updateAuditSortFindings(auditId, audit) {
    return  api.put(`audits/${auditId}/sortfindings`, audit)
  },

  updateAuditFindingPosition(auditId, audit) {
    return  api.put(`audits/${auditId}/movefinding`, audit)
  },

  toggleApproval(auditId) {
    return  api.put(`audits/${auditId}/toggleApproval`)
  },

  updateReadyForReview(auditId, data) {
    return  api.put(`audits/${auditId}/updateReadyForReview`, data)
  },
}

import { api } from '@/boot/axios'
export default {
  getRoles() {
    return  api.get('data/roles')
  },

  getLanguages() {
    return  api.get('data/languages')
  },

  createLanguage(language) {
    return  api.post('data/languages', language)
  },

  deleteLanguage(locale) {
    return  api.delete(`data/languages/${locale}`)
  },

  updateLanguages(languages) {
    return  api.put('data/languages', languages)
  },

  getAuditTypes() {
    return  api.get('data/audit-types')
  },

  createAuditType(auditType) {
    return  api.post('data/audit-types', auditType)
  },

  deleteAuditType(name) {
    return  api.delete(`data/audit-types/${name}`)
  },

  updateAuditTypes(auditTypes) {
    return  api.put('data/audit-types', auditTypes)
  },

  getVulnerabilityTypes() {
    return  api.get('data/vulnerability-types')
  },

  createVulnerabilityType(vulnerabilityType) {
    return  api.post('data/vulnerability-types', vulnerabilityType)
  },

  deleteVulnerabilityType(name) {
    return  api.delete(`data/vulnerability-types/${name}`)
  },

  updateVulnTypes(vulnTypes) {
    return  api.put('data/vulnerability-types', vulnTypes)
  },

  getVulnerabilityCategories() {
    return  api.get('data/vulnerability-categories')
  },

  createVulnerabilityCategory(vulnerabilityCategory) {
    return  api.post('data/vulnerability-categories', vulnerabilityCategory)
  },

  updateVulnerabilityCategories(vulnCategories) {
    return  api.put('data/vulnerability-categories/', vulnCategories)
  },

  deleteVulnerabilityCategory(name) {
    return  api.delete(`data/vulnerability-categories/${name}`)
  },

  getCustomFields() {
    return  api.get('data/custom-fields')
  },

  createCustomField(customField) {
    return  api.post('data/custom-fields', customField)
  },

  updateCustomFields(customFields) {
    return  api.put('data/custom-fields/', customFields)
  },

  deleteCustomField(customFieldId) {
    return  api.delete(`data/custom-fields/${customFieldId}`)
  },

  getSections() {
    return  api.get('data/sections')
  },

  getSectionsByLanguage(locale) {
    return  api.get(`data/sections/${locale}`)
  },

  createSection(section) {
    return  api.post('data/sections', section)
  },

  deleteSection(field, locale) {
    return  api.delete(`data/sections/${field}/${locale}`)
  },

  updateSections(sections) {
    return  api.put('data/sections', sections)
  },
}

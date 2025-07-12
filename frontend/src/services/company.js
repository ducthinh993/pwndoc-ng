import { api } from '@/boot/axios'

export default {
  getCompanies() {
    return  api.get('companies')
  },

  exportCompanies() {
    return  api.get('companies/export')
  },

  createCompanies(company) {
    return  api.post('companies', company)
  },

  updateCompany(companyId, company) {
    return  api.put(`companies/${companyId}`, company)
  },

  deleteCompany(companyId) {
    return  api.delete(`companies/${companyId}`)
  },

  deleteAllCompanies() {
    return  api.delete('companies')
  },
}

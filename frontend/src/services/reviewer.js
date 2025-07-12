import { api } from '@/boot/axios'
export default {
  getReviewers() {
    return  api.get('users/reviewers')
  },
}

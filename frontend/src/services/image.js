import { api } from '@/boot/axios'
export default {
  getImage(imageId) {
    return  api.get(`images/${imageId}`)
  },

  createImage(image) {
    return  api.post('images', image)
  },

  deleteImage(imageId) {
    return  api.delete(`images/${imageId}`)
  },
}

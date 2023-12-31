import Api from '@/services/Api'
import dApi from '@/services/dApi'

export default {
  getAll(data, params) {
    return dApi().get(`videos/${data}`, {
      params
    })
  },
  getById(id) {
    return dApi().get(`videos/${id}`)
  },
  uploadVideo(data, optional) {
    console.log(data,optional)
    return dApi().post('videos', data, optional)   
  },
  updateVideo(id, data) {
    return dApi().put(`videos/${id}`, data)
  },
  updateViews(id) {
    return Api().put(`videos/${id}/views`)
  },
  uploadThumbnail(id, data) {
    return Api().put(`videos/${id}/thumbnails`, data)
  },
  deleteById(id) {
    return Api().delete(`videos/${id}`)
  }
}

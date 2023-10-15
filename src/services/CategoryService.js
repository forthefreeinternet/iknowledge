// import Api from '@/services/Api'
import dApi from '@/services/dApi'

export default {
  getAll() {
    return dApi().get(`categories`)
  }
}

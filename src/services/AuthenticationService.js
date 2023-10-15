import Api from '@/services/Api'
import dApi from '@/services/dApi'

export default {
  signIn(credentials) {
    return dApi().post('auth/login', credentials)
  },
  signUp(data) {
    return dApi().post('auth/register', data)
  },
  updateUserDetails(data) {
    return Api().put('auth/updatedetails', data)
  },
  uploadUserAvatar(data) {
    return Api().put('auth/avatar', data)
  },
  updatePassword(data) {
    return Api().put('auth/updatepassword', data)
  },
  me(token) {
    return dApi().post('auth/me', {
      headers: { authorization: `Bearer ${token}` }
    })
  }
}

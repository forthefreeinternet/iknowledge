const dexpress = require('../dexpress/index.js')
const router = dexpress.Router()

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  uploadChannelAvatar,
  updatePassword
} = require('../controllers/authController')

const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/avatar', protect, uploadChannelAvatar)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router

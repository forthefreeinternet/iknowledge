const dexpress = require('../dexpress/index.js')

const {
  getVideos,
  getVideo,
  videoUpload,
  updateVideo,
  updateViews,
  uploadVideoThumbnail,
  deleteVideo
} = require('../controllers/videoController.js')

const Video = require('../models/videoModel.js')

const router = dexpress.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect } = require('../middleware/auth')

router.post('/', protect, videoUpload)

router.route('/private').get(
  protect,
  advancedResults(
    Video,
    [
      { path: 'userId' },
      { path: 'categoryId' },
      { path: 'likes' },
      { path: 'dislikes' },
      { path: 'comments' }
    ],
    {
      status: 'private'
    }
  ),
  getVideos
)

router
  .route('/public')
  .get(
    advancedResults(
      Video,
      [
        { path: 'userId' },
        { path: 'categoryId' },
        { path: 'likes' },
        { path: 'dislikes' }
      ],
      { status: 'public' }
    ),
    getVideos
  )

router
  .route('/:id')
  .get(getVideo)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo)

router.route('/:id/thumbnails').put(protect, uploadVideoThumbnail)
router.route('/:id/views').put(protect, updateViews)

module.exports = router

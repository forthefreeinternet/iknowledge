const dexpress = require('../dexpress/index.js')
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')

// modification
// const Category = require('../models/categoryModel')
const Category = require('../services/categoryService.js')

const router = dexpress.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(authorize('admin'), createCategory)

router
  .route('/:id')
  .get(authorize('admin'), getCategory)
  .put(authorize('admin'), updateCategory)
  .delete(authorize('admin'), deleteCategory)

module.exports = router

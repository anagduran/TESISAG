import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()

router.get('/', categoryController.getCategories)
router.post('/',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
router.delete('/:categoryID', categoryController.deleteCategoryByID)
router.patch('/:categoryID', categoryController.updateCategoryByID)

module.exports = router;
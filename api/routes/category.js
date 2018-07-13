import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()

router.get('/', categoryController.getCategories)
router.post('/',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
router.delete('/:categoryID', categoryController.deleteCategoryByID)
router.post('/edit/:categoryID', categoryController.editCategory)
router.post('/update', categoryController.updateCategoryByID)

module.exports = router;
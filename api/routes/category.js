import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()

router.get('/', categoryController.getCategories)
router.post('/',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
router.get('/edit/:categoryID', categoryController.editCategory)
router.put('/update/:categoryID', categoryController.updateCategoryByID)
router.delete('/:categoryID', categoryController.deleteCategoryByID)


module.exports = router;
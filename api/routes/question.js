import express from "express"
import questionController from "../controllers/question"

const router = express.Router()

//router.get('/', categoryController.getCategories)
//router.get('/create', categoryController.createCategory)
router.post('/new', questionController.newQuestion)
//router.get('/:categoryID', categoryController.getCategoryID)
//router.get('/edit/:categoryID', categoryController.editCategory)
//router.put('/update/:categoryID', categoryController.updateCategoryByID)
//router.delete('/delete/:categoryID', categoryController.deleteCategoryByID)


module.exports = router;
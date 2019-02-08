import express from "express"
import executeController from "../controllers/executeGame"

const router = express.Router()

router.get('/', executeController.getExecuteGame)
/* router.get('/create', categoryController.createCategory)
router.post('/new',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
router.get('/edit/:categoryID', categoryController.editCategory)
router.put('/update/:categoryID', categoryController.updateCategoryByID)
router.delete('/delete/:categoryID', categoryController.deleteCategoryByID)*/


module.exports = router;
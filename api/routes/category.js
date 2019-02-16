import express from "express"
import categoryController from "../controllers/category"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn



router.get('/', loggin , categoryController.getCategories)
router.get('/create', loggin , categoryController.createCategory)
router.post('/new',loggin  ,categoryController.newCategory)
router.get('/:categoryID',loggin  , categoryController.getCategoryID)
router.get('/edit/:categoryID',loggin  , categoryController.editCategory)
router.put('/update/:categoryID',loggin  , categoryController.updateCategoryByID)
router.delete('/delete/:categoryID', loggin  ,categoryController.deleteCategoryByID)


module.exports = router;
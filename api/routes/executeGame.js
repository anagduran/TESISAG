import express from "express"
import executeController from "../controllers/executeGame"
import log from "../middlewares/session"

const router = express.Router();
const loggin = log.isLoggedIn;
router.get('/', loggin, executeController.getExecuteGame)
router.get('/:gameID', executeController.getQuestionsGame)
router.get('/start',executeController.startGame)
/* router.get('/create', categoryController.createCategory)
router.post('/new',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
router.get('/edit/:categoryID', categoryController.editCategory)
router.put('/update/:categoryID', categoryController.updateCategoryByID)
router.delete('/delete/:categoryID', categoryController.deleteCategoryByID)*/


module.exports = router;
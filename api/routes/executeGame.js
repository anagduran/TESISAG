import express from "express"
import executeController from "../controllers/executeGame"
import log from "../middlewares/session"

const router = express.Router();
const loggin = log.isLoggedIn;
router.get('/', loggin, executeController.getExecuteGame)
router.get('/:gameID',  loggin, executeController.getQuestionsGame)
router.get('/connection/:gameID', loggin, executeController.connectionGame)
/* router.get('/create', categoryController.createCategory)
router.post('/new',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
*/

module.exports = router;
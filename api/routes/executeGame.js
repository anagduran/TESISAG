import express from "express"
import executeController from "../controllers/executeGame"
import log from "../middlewares/session"

const router = express.Router();
const loggin = log.isLoggedIn;
router.get('/', loggin, executeController.getExecuteGame)
router.get('/:gameID', executeController.getQuestionsGame)
router.post('/start',executeController.startGame)
/* router.get('/create', categoryController.createCategory)
router.post('/new',categoryController.newCategory)
router.get('/:categoryID', categoryController.getCategoryID)
*/

module.exports = router;
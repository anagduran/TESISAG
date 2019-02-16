import express from "express"
import questionController from "../controllers/question"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn

router.get('/', loggin, questionController.getQuestions)
router.get('/create', loggin, questionController.createQuestion)
router.post('/new', loggin, questionController.newQuestion)
router.get('/:questionID', loggin, questionController.getQuestionID)
router.get('/edit/:questionID',loggin, questionController.editQuestion)
router.put('/update/:questionID', loggin, questionController.updateQuestionByID)
router.delete('/delete/:questionID',loggin,  questionController.deleteQuestionByID)


module.exports = router;
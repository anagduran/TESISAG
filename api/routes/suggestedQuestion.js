import express from "express"
import suggestesdQuestionController from "../controllers/suggestedQuestion"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn

router.get('/', loggin, suggestesdQuestionController.getSuggestedQuestion)
router.get('/create/:questionID', loggin, suggestesdQuestionController.createQuestion)
router.post('/new', loggin, suggestesdQuestionController.newQuestion)
router.get('/:questionID', loggin, suggestesdQuestionController.getQuestionID)
router.delete('/delete/:questionID',loggin,  suggestesdQuestionController.deleteQuestionByID)


module.exports = router;
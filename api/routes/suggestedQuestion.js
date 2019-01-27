import express from "express"
import suggestesdQuestionController from "../controllers/suggestedQuestion"

const router = express.Router()

router.get('/', suggestesdQuestionController.getSuggestedQuestion)
router.get('/create/:questionID', suggestesdQuestionController.createQuestion)
router.post('/new', suggestesdQuestionController.newQuestion)
router.get('/:questionID', suggestesdQuestionController.getQuestionID)
//router.delete('/delete/:questionID', questionController.deleteQuestionByID)


module.exports = router;
import express from "express"
import suggestesdQuestionController from "../controllers/suggestedQuestion"

const router = express.Router()

router.get('/', suggestesdQuestionController.getSuggestedQuestion)
//router.get('/create', questionController.createQuestion)
//router.post('/new', questionController.newQuestion)
//router.get('/:questionID', questionController.getQuestionID)
//router.delete('/delete/:questionID', questionController.deleteQuestionByID)


module.exports = router;
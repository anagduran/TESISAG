import express from "express"
import questionController from "../controllers/question"

const router = express.Router()

router.get('/', questionController.getQuestions)
router.get('/create', questionController.createQuestion)
router.post('/new', questionController.newQuestion)
router.get('/:questionID', questionController.getQuestionID)
//router.get('/edit/:categoryID', categoryController.editCategory)
router.put('/update/:questionID', questionController.updateQuestionByID)
router.delete('/delete/:questionID', questionController.deleteQuestionByID)


module.exports = router;
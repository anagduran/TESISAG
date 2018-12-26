import express from "express"
import userController from "../controllers/user"

const router = express.Router()

router.get('/', userController.getUsers)
//router.get('/create', questionController.createQuestion)
router.post('/new', userController.newUser)
router.get('/:userID', userController.getUserID)
//router.get('/edit/:questionID', questionController.editQuestion)
router.put('/update/:userID', userController.updateUserByID)
router.delete('/delete/:userID', userController.deleteUserByID)


module.exports = router;
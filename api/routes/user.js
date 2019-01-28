import express from "express"
import userController from "../controllers/user"

const router = express.Router()

router.get('/', userController.getUsers)
router.get('/create', userController.createUser)
router.post('/new', userController.newUser)
router.get('/:userID', userController.getUserID)
router.get('/edit/:userID', userController.editUser)
router.put('/update/:userID', userController.updateUserByID)
router.delete('/delete/:userID', userController.deleteUserByID)


module.exports = router;
import express from "express"
import userController from "../controllers/user"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn

router.get('/', loggin, userController.getUsers)
router.get('/create', loggin, userController.createUser)
router.post('/new',loggin,  userController.newUser)
router.get('/:userID',loggin,  userController.getUserID)
router.get('/edit/:userID', loggin, userController.editUser)
router.put('/update/:userID',loggin,  userController.updateUserByID)
router.delete('/delete/:userID',loggin,  userController.deleteUserByID)


module.exports = router;
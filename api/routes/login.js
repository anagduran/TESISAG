import express from "express"
import loginController from "../controllers/login"


const router = express.Router()

router.get('/', loginController.getLogin)
router.post('/home', loginController.doingLogin)
router.get('/logout', loginController.logOut)
router.get('/forgot', loginController.forgotPW)

module.exports = router;
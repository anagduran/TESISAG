import express from "express"
import loginController from "../controllers/login"


const router = express.Router()

router.get('/', loginController.getLogin)
router.post('/home', loginController.doingLogin)
router.get('/logout', loginController.logOut)
router.get('/forgot', loginController.forgotPW)
router.post('/forgot', loginController.doingResetPW)
router.post('/reset', loginController.ResetPW)
router.get('/reset', loginController.getResetPW)



module.exports = router;
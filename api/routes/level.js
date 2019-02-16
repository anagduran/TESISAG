import express from "express"
import levelController from "../controllers/level"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn

router.get('/', loggin, levelController.getLevel)

module.exports = router;
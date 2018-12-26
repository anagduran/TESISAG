import express from "express"
import notificationController from "../controllers/notification"

const router = express.Router()

router.get('/', notificationController.getNotifications)
//router.get('/create', notificationController.createGame)
router.post('/new',notificationController.newNotification)



module.exports = router;
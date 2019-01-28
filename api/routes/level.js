import express from "express"
import levelController from "../controllers/level"

const router = express.Router()

router.get('/', levelController.getLevel)

module.exports = router;
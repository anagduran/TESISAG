import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()

router.get('/', categoryController.getCategories)

export default router

//module.exports = router;
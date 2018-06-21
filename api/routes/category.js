import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()

router.get('/category', (req,res,next)=>{
    res.status(200)
})

export default router

//module.exports = router;
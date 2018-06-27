import express from "express"
import categoryController from "../controllers/category"

const router = express.Router()


/*router 
      .get('/',(req,res,next)=>{
       res
          .status(200)
    console.log("perfect")
    //categoryController.getCategories
})*/
router.get('/', categoryController.getCategories)

//export default router

module.exports = router;
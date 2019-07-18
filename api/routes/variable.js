import express from "express"
import variableController from "../controllers/variable"
import log from "../middlewares/session"


const router = express.Router()
const loggin = log.isLoggedIn


router.get('/', loggin, variableController.getVariables)
router.get('/create', loggin, variableController.createVariable)
router.post('/new', loggin, variableController.newVariable)
router.get('/:variableID',loggin, variableController.getVariableID)
router.get('/edit/:variableID',loggin,  variableController.editVariable)
router.put('/update/:variableID',loggin,  variableController.updateVariableByID)
router.delete('/delete/:variableID', loggin, variableController.deleteVariableByID)


module.exports = router;
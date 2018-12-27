import express from "express"
import variableController from "../controllers/variable"

const router = express.Router()

router.get('/', variableController.getVariables)
router.get('/create', variableController.createVariable)
router.post('/new', variableController.newVariable)
router.get('/:variableID',variableController.getVariableID)
router.get('/edit/:variableID', variableController.editVariable)
router.put('/update/:variableID', variableController.updateVariableByID)
router.delete('/delete/:variableID', variableController.deleteVariableByID)


module.exports = router;
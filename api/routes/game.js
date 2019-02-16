import express from "express"
import gameController from "../controllers/game"
import log from "../middlewares/session"

const router = express.Router()
const loggin = log.isLoggedIn

router.get('/',loggin , gameController.getGames)
router.get('/create', loggin ,gameController.createGame)
router.post('/new',loggin , gameController.newGame)
router.get('/:gameID',loggin ,  gameController.getGameID)
router.get('/edit/:gameID',loggin , gameController.editGame)
router.put('/update/:gameID',loggin ,  gameController.updateGameByID)
router.delete('/delete/:gameID', loggin ,gameController.deleteGameByID)


module.exports = router;
import express from "express"
import gameController from "../controllers/game"

const router = express.Router()

router.get('/', gameController.getGames)
router.get('/create', gameController.createGame)
router.post('/new',gameController.newGame)
router.get('/:gameID', gameController.getGameID)
router.get('/edit/:gameID', gameController.editGame)
router.put('/update/:gameID', gameController.updateGameByID)
router.delete('/delete/:gameID', gameController.deleteGameByID)


module.exports = router;
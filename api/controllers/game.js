import mongoose from "mongoose"
import game from "../models/game"




function newGame(req,res,next) {
    var estadoDefault = "sin inicio"
    const partida = new game({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        date: req.body.date,
        questions: req.body.questions,
        prize: req.body.prize,
        status: estadoDefault
        });
       
        try{ 
            partida.save()
                    .then(nuevapartida => {
                        res.status(200).json({partida: nuevapartida})
                     })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    }); 
        }  
        catch(error){
           console.log(error) 
        }
}

function getGames(req,res,next){
    try{
        game.find()
                .exec()
                .then(games => { 
                   
                        if(games) {                        
                            res.status(200).render( 'game/gameAll', { partidas: games})
                        }else{
                            res.status(404).json({message: 'no hay preguntas'})
                        }   
            
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err})
                })
        }catch(error){
            console.log(error)
        }
    

}

function getGameID(req,res,next){
    const id = req.params.gameID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        game.findById(id)
                .exec()
                .then(gameByID =>{                
                    if(gameByID){ 
                        res.status(200).render( 'game/gameDetail',{ partida: gameByID})
                        
                    }
                    else { 
                        res.status(404).json({message: 'no encontrado, ID incorrecto'})
                    }                
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({error: err})
                })
    }
    else{
        res.status(404).json({message: "no valid entry for provided ID"})
    }
}

function updateGameByID(req, res, next){

    //const id = mongoose.Types.ObjectId(req.body._id)
    const id = req.params.gameID;

    if (mongoose.Types.ObjectId.isValid(id)) {
        game.where({'_id': id})
                .update( {$set: {title: req.body.title, date: req.body.date, questions: req.body.questions, prize: req.body.prize, status: req.body.status}})
                .exec()
                .then(result =>{                    
                    if(result.nModified===1){
                    res.status(200).json( { partida: req.body})                      
                    }
                    else {                        
                        res.status(404).json({message: 'no encontrado'})
                    }
                })
                .catch(err =>{
                    res.status(500).json({error: err})
                })
    }
    else{
        res.status(404).json({message: 'error de id, incorrecto'})
    }
}

function deleteGameByID(req, res, next){
    
    const id = req.params.gameID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        game.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200).json({message: "eliminado con exito"})      
            }
            else {
                res.status(404).json({message: "ERROR ID"})
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err})
        })
    }
    else{
        res.status(404).json({message: "error ID incorrecto"}) 
    }
}


function createGame(req,res, next){
    res.render('game/newGame')
}
module.exports ={newGame, getGames, getGameID, updateGameByID, deleteGameByID, createGame};
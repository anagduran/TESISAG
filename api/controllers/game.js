import mongoose from "mongoose"
import game from "../models/game"
import question from "../models/question"
import diff from 'simple-array-diff'



function newGame(req,res,next) {
    
    req.check("title").notEmpty().withMessage("El campo de titulo no puede estar vacio");
    req.check("date").exists().withMessage("El campo de fecha no puede estar vacio");
    req.check("time").exists().withMessage("El campo de hora no puede estar vacio");
    req.check("prize").notEmpty().withMessage("El campo de premio no puede estar vacio");
    req.check("preguntasCombo").exists().withMessage("Debe escoger 12 preguntas, 4 de cada nivel");
    req.check('prize').matches('[0-9]').withMessage('Solo numeros');
    req.check('title').isLength({min: 4}).withMessage('titulo muy corto');

    var errors = req.validationErrors();
    if (errors){
        question.find({level:"bajo" , status:"available"},{"question":1}).exec().then( result1 =>{
            question.find({level:"medio", status:"available"},{"question":1}).exec().then(result2 =>{
                question.find({level:"alto", status:"available"},{"question":1}).exec().then(result3 => {
                    res.render('game/newGame',{bajos: result1,  medios: result2, altos: result3, error: errors})
                    return;
                })
            })
        })

    } else {  
    
            var estadoDefault = "sin inicio"
            var ver = req.body.date;    
            var tiempo = req.body.time;
            var cambioArr = [];
            cambioArr = req.body.preguntasCombo;
            var concatFecha = ver + 'T' + tiempo;
            
            const partida = new game({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                date: concatFecha,
                questions: req.body.preguntasCombo,
                prize: req.body.prize,
                status: estadoDefault
                });
                
            
            for (let i=0; i < cambioArr.length; i++ )
            {         
                question.where({'_id': cambioArr[i]})
                            .update( {status: 'not available'})
                            .exec()
            }
            
                try{ 
                    partida.save()
                            .then(nuevapartida => {
                                res.status(200).render('game/gameDetail',{partida: nuevapartida})
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
            .populate('questions', ['question'])
            .exec()
            .then(gameByID =>{                
                if(gameByID){ 
                    res.status(200).render('game/gameDetail',{ partida: gameByID})
                        
                }
                else { 
                    res.status(404).json({message: 'no encontrado, ID incorrecto'})
                }                
            })
            .catch(err=>{                
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

    req.check("title").notEmpty().withMessage("El campo de titulo no puede estar vacio");
    req.check("date").exists().withMessage("El campo de fecha no puede estar vacio");
  //   req.check("time").exists().withMessage("El campo de hora no puede estar vacio");
    req.check("prize").notEmpty().withMessage("El campo de premio no puede estar vacio");
    req.check("preguntasCombo").exists().withMessage("Debe escoger 12 preguntas, 4 de cada nivel");
    req.check('prize').matches('[0-9]').withMessage('Solo numeros');
    req.check('title').isLength({min: 4}).withMessage('titulo muy corto');

    var errors = req.validationErrors();
    if (errors){

        question.find({level:"bajo" , status:"available"},{"question":1}).exec().then(result1 =>{
            question.find({level:"medio", status:"available"},{"question":1}).exec().then(result2 =>{
                question.find({level:"alto", status:"available"},{"question":1}).exec().then(result3 =>{
                    if(mongoose.Types.ObjectId.isValid(id)){
                    
                        game.findById(id)
                            .populate('questions', ['question'])
                            .exec()
                            .then(gameByID =>{  
                                                                                              
                                var resultado = [];  
                                var resultado2= [];
                                var resultado3 = [];                                             
                                resultado.push(gameByID.questions[0] , gameByID.questions[1], gameByID.questions[2], gameByID.questions[3]);
                                resultado2.push(gameByID.questions[4] , gameByID.questions[5], gameByID.questions[6], gameByID.questions[7]);
                                resultado3.push(gameByID.questions[8] , gameByID.questions[9], gameByID.questions[10], gameByID.questions[11]);
                                  
                                res.render('game/updateGame', { error: errors, partida: gameByID, partidaBaja: resultado, partidaMedio: resultado2, partidaAlta: resultado3, bajo: result1, medio: result2, alto: result3});
                                return;
                            })
                    } else {
                            res.status(404).json({message: 'no encontrado'});
                        }
                    
                })
            })
        }); 
    } else {

            if (mongoose.Types.ObjectId.isValid(id)) {
                game.where({'_id': id})
                        .update( {$set: {title: req.body.title, date: req.body.date, questions: req.body.preguntasCombo, prize: req.body.prize, status: req.body.status}})
                        .exec()
                        .then(result =>{                    
                            if(result.nModified===1){
                            res.status(200).render( 'game/gameDetail' , { partida: req.body})                      
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
}

function deleteGameByID(req, res){
    
    const id = req.params.gameID;    
    game.findById(id).exec().then( resultado => {
        var cambio= [];
        var cambio = resultado.questions;
        
        for (let i=0; i < cambio.length; i++ ){   
            question.where({'_id': cambio[i]})
                    .update( {status: 'available'})
                    .exec()
        }
    
    
            if(mongoose.Types.ObjectId.isValid(id)){
                game.findByIdAndRemove(id).exec().then(result=>{
                    if(result){
                        res.status(200).json({message: "eliminado con exito"})      
                    }
                    else {
                        res.status(404).json({message: "ERROR"})
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
        })
}


function createGame(req,res, next){
    question.find({level:"bajo" , status:"available"},{"question":1}).exec().then( result1 =>{
        question.find({level:"medio", status:"available"},{"question":1}).exec().then(result2 =>{
            question.find({level:"alto", status:"available"},{"question":1}).exec().then(result3 => {
                res.render('game/newGame',{bajos: result1,  medios: result2, altos: result3})
            })
        })
    })

}

function editGame(req,res){

    
    const id= req.params.gameID;
    

    question.find({level:"bajo" , status:"available"},{"question":1}).exec().then(result1 =>{
        question.find({level:"medio", status:"available"},{"question":1}).exec().then(result2 =>{
            question.find({level:"alto", status:"available"},{"question":1}).exec().then(result3 =>{
                if(mongoose.Types.ObjectId.isValid(id)){
                
                    game.findById(id)
                        .populate('questions', ['question'])
                        .exec()
                        .then(gameByID =>{  
                                var resultado = [];  
                                var resultado2= [];
                                var resultado3 = [];                                             
                                resultado.push(gameByID.questions[0] , gameByID.questions[1], gameByID.questions[2], gameByID.questions[3]);
                                resultado2.push(gameByID.questions[4] , gameByID.questions[5], gameByID.questions[6], gameByID.questions[7]);
                                resultado3.push(gameByID.questions[8] , gameByID.questions[9], gameByID.questions[10], gameByID.questions[11]);
                                res.render('game/updateGame', {partida: gameByID, partidaBaja: resultado, partidaMedio: resultado2, partidaAlta: resultado3, bajo: result1, medio: result2, alto: result3})
                                             
                        }).catch(err=> {
                            res.status(500).json({message: "Error en el servidor"})
                        })
                }
                else {
                    res.status(404).json({message: "no valid entry for provided ID"})
                }
            })
        })
    })
}

module.exports ={editGame, newGame, getGames, getGameID, updateGameByID, deleteGameByID, createGame};
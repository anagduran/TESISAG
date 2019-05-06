import mongoose from "mongoose"
import game from "../models/game"
import question from "../models/question"
import fcm from 'fcm-node'
import agenda from 'node-schedule'

function createPushNotification(game) {
    var serverkey = 'AAAA98IRcAQ:APA91bF8dcgsiMKqsuLz65q87e8tIiGUz_VFUHEeAjH_wAA3L_FK5tanevbY9ykqI08A2KUWXeYX_S1FeB91MaiZNVtc_O8IVsCHJbRDQmUl8-cBdcjcCcE1xacSBxA7YNaroe3MUQ3R';
    var FCM = new fcm(serverkey);
    
    var cambio = JSON.parse(JSON.stringify(game.notification))[0];
    var titulo = cambio.subject;
    var mensaje = cambio.message;
    
    var cambio2 = JSON.parse(JSON.stringify(game.notification))[1];
    var titulo2 = cambio2.subject;
    var mensaje2 = cambio2.message;
    
    var hora = cambio.date.split(":");
    var hora2 = cambio2.date.split(":");
    var mesC = "";
    var diaC= "";
   
   
    var mes = parseInt(game.date.substring(0,1));
    var dia = parseInt(game.date.substring(3,4));
    
    if(dia === 0){
        if(mes === 0) {
            diaC = game.date.substring(4,5);
            mesC = game.date.substring(1,2); 
        } else {
            mesC = game.date.substring(0,2);
            diaC = game.date.substring(4,5);
        }
       
    } else {
        if(mes === 0) {
            diaC = game.date.substring(3,5);
            mesC = game.date.substring(1,2); 
        } else {
            mesC = game.date.substring(0,2);
            diaC = game.date.substring(3,5);
        }
    
       

    var mesConResta = mesC - 1;
    var total = '50 ' + hora[0] + ' ' + diaC + ' ' + mesConResta + '0';
    var date = new Date(2019,mesConResta, diaC, hora[0], 50, 0);
        console.log(mesC);
        console.log("fecha y hora de notificacion 1 "+ date);
     //ENVIO NOTIFICACION TIPO 1
    agenda.scheduleJob(date ,()=> {
        console.log('aqi a las 3 y 581');
        console.log(total);
        var message = {
            to: 'eaZol7mhW7E:APA91bHuvl6ch_1bfTE-IzrZMOqIWrHoyPJvkFWtSXait2ixtu_dbRMIArJw5TD9Fhd2LJXzOxTjMDe4dWkgaitoklWUu440eKB-jxnyERfgU17CS2nzWHl7L_giPvfjSSD40Q-EWvDh',
            notification: {
                title: titulo,
                body: mensaje
            }
        };
        
        FCM.send(message, (err,response) => {
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log("Successfully sent with response:", response);
            }
        })

    })
    }


     // ENVIO NOTIFICACION TIPO 2


    var date2 = new Date(2019,mesConResta, diaC, hora2[0], 0, 0);


    // console.log("fecha y hora de notificacion 2 "+ date2);
   
     agenda.scheduleJob(date2 ,()=> {
        console.log('aqi a las 3 y 582');
        var message = {
            to: 'eaZol7mhW7E:APA91bHuvl6ch_1bfTE-IzrZMOqIWrHoyPJvkFWtSXait2ixtu_dbRMIArJw5TD9Fhd2LJXzOxTjMDe4dWkgaitoklWUu440eKB-jxnyERfgU17CS2nzWHl7L_giPvfjSSD40Q-EWvDh',
            notification: {
                title: titulo2,
                body: mensaje2
            }
        };
        
        FCM.send(message, (err,response) => {
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log("Successfully sent with response:", response);
            }
        })

    })
    

}


function newGame(req,res) {
    
    req.check("title").notEmpty().withMessage("The title field can not be empty.");
    req.check("date").exists().withMessage("The date field can not be empty.");
    req.check("time").exists().withMessage("The time field can not be empty.");
    req.check("prize").notEmpty().withMessage("The prize field can not be empty.");
    req.check("preguntasCombo").exists().withMessage("You must choose 12 questions, 4 for each level.");
    req.check('prize').matches('[0-9]').withMessage('Only numbers are allowed in the prize field.');
    req.check('title').isLength({min: 4}).withMessage('The title field can not be that short.');
    req.check("subject").notEmpty().withMessage("The subject field can not be empty (Notification 1).");
    req.check("message").notEmpty().withMessage("The message field can not be empty (Notification 1).");
    req.check("subject2").notEmpty().withMessage("The subject field can not be empty (Notification 2).");
    req.check("message2").notEmpty().withMessage("The message field can not be empty (Notification 2).");

    var errors = req.validationErrors();
    if (errors){
        // Low Medium High
        question.count().where({level:"Low", status:"available"},{"question": 1}).exec().then( resultCount=> {
            question.count().where({level:"Medium", status:"available"},{"question": 1}).exec().then( resultCount2=> {
                question.count().where({level:"High", status:"available"},{"question": 1}).exec().then( resultCount3=> {
                    var rand = Math.floor(Math.random() *resultCount);
                    var rand2 = Math.floor(Math.random() *resultCount2);
                    var rand3 = Math.floor(Math.random() *resultCount3);
                    question.find({level:"Low", status:"available"},{"question": 1}).limit(10).skip(rand).exec().then(result1=> {
                        question.find({level:"Medium", status:"available"},{"question": 1}).limit(10).skip(rand2).exec().then(result2=> {
                            question.find({level:"High", status:"available"},{"question": 1}).limit(10).skip(rand3).exec().then(result3=> {
                                res.render('game/newGame',{bajos: result1,  medios: result2, altos: result3,  error: errors})
                                return;
                            });                   
                        });
                    });
                });
            });
        });
                   

    } else {  
    
            var estadoDefault = "No start"
            var ver = req.body.date;    
            var tiempo = req.body.time;
            var timeN = tiempo.substring(0,2);
            var totalT = timeN - 1;
            var concatT = totalT + ':50'
            var cambioArr = [];
            cambioArr = req.body.preguntasCombo;
            var concatFecha = ver + 'T' + tiempo;
            var totalT2 = timeN - 0;
            var concatT2 = totalT2 + ':00'
       



            const partida = new game({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                date: concatFecha,
                questions: req.body.preguntasCombo,
                prize: req.body.prize,
                status: estadoDefault,
                notification: [{
                    type: 1,
                    subject: req.body.subject,
                    message: req.body.message,
                    date: concatT,
                }, {
                    type: 2,
                    subject: req.body.subject2,
                    message: req.body.message2,
                    date: concatT2
                }]
               
                });
                
            
            for (let i=0; i < cambioArr.length; i++ )
            {         
                question.where({'_id': cambioArr[i]})
                            .update( {status: 'not available'})
                            .exec()
            }
            
               
                    partida.save()
                            .then(nuevapartida => {
                                game.findById(nuevapartida._id)
                                    .exec()
                                .then( newG => {
                                    question.find({'_id': {$in: newG.questions}}, {"question":1, "options":1, "level":1}).sort({"level": 1}).exec().then(result2=>{ 
                                        if(newG){
                                            createPushNotification(newG);
                                            res.status(200).render('game/gameDetail',{partida: newG, questions: result2, message: "Game added successfully"})
                                        }else {
                                            game.find()
                                            .exec()
                                            .then(games => {          
                                                res.status(500).render( 'game/gameAll', { partidas: games, error: "Internal server error, try again"})                 
                                        
                                            })
                                            
                                        }
                                    })
                                    
                                     
                                      
                                })
                            })
                            .catch(err => {
                                game.find()
                                    .exec()
                                    .then(games => {          
                                        res.status(500).render( 'game/gameAll', { partidas: games, error: "Internal server error, try again"})                 
                                
                                    })
                            }); 
                    
              
    }
}

function getGames(req,res,next){
    
        game.find()
            .exec()
            .then(games => {          
                res.status(200).render( 'game/gameAll', { partidas: games})                 
            
            }).catch(err => {                  
                res.status(500).render( 'index', {error: "Internal server error, try again"} )
            })
    

}

function getGameID(req,res,next){
    const id = req.params.gameID;
    
   
    if(mongoose.Types.ObjectId.isValid(id)){
        game.findById(id)
            .exec()
            .then(gameByID =>{  
                question.find({'_id': {$in: gameByID.questions}}, {"question":1, "options":1, "level":1}).sort({"level": 1}).exec().then(result2=>{              
                    if(gameByID){ 
                        res.status(200).render('game/gameDetail',{ partida: gameByID, questions: result2})                       
                    }
                    else { 
                        game.find()
                        .exec()
                        .then(games => {          
                            res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
                    
                        })
                    }  
                })              
            })
            .catch(err=>{                
                game.find()
                    .exec()
                    .then(games => {          
                        res.status(500).render( 'game/gameAll', { partidas: games, error: "Internal server error, try again"})                 
                                
                    })
            })
    }
    else{
        game.find()
        .exec()
        .then(games => {          
            res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
    
        })
    }
}

function updateGameByID(req, res, next){

    
    const id = req.params.gameID;

    req.check("title").notEmpty().withMessage("The title field can not be empty.");
    req.check("date").exists().withMessage("The date field can not be empty.");
    req.check("time").exists().withMessage("The time field can not be empty.");
    req.check("prize").notEmpty().withMessage("The prize field can not be empty.");
    req.check("preguntasCombo").exists().withMessage("You must choose 12 questions, 4 for each level.");
    req.check('prize').matches('[0-9]').withMessage('Only numbers are allowed in the prize field.');
    req.check('title').isLength({min: 4}).withMessage('The title field can not be that short.');
    req.check("subject").notEmpty().withMessage("The subject field can not be empty (Notification 1).");
    req.check("message").notEmpty().withMessage("The message field can not be empty (Notification 1).");
    req.check("subject2").notEmpty().withMessage("The subject field can not be empty (Notification 2).");
    req.check("message2").notEmpty().withMessage("The message field can not be empty (Notification 2).");

    var errors = req.validationErrors();
    if (errors){
        
        question.count().where({level:"Low", status:"available"},{"question": 1}).exec().then( resultCount=> {
            question.count().where({level:"Medium", status:"available"},{"question": 1}).exec().then( resultCount2=> {
                question.count().where({level:"High", status:"available"},{"question": 1}).exec().then( resultCount3=> {
                    var rand = Math.floor(Math.random() *resultCount);
                    var rand2 = Math.floor(Math.random() *resultCount2);
                    var rand3 = Math.floor(Math.random() *resultCount3);


                   
                    question.find({level:"Low" , status:"available"},{"question":1}).limit(10).skip(rand).exec().then(result1 =>{
                        question.find({level:"Medium", status:"available"},{"question":1}).limit(10).skip(rand2).exec().then(result2 =>{
                            question.find({level:"High", status:"available"},{"question":1}).limit(10).skip(rand3).exec().then(result3 =>{
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
                                    game.find()
                                    .exec()
                                    .then(games => {          
                                        res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
                                    })
                                }
                            })
                        })
                    })
                    
                })
            })
        }); 
    } else {
      
        var comboP1 = req.body.preguntasCombo;
        var comboP2 = req.body.preguntasCombo2;
        var ver = req.body.date;
        var tiempo = req.body.time;
        var concatFecha = ver + 'T' + tiempo;
        var timeN = tiempo.substring(0,2);
        var totalT = timeN - 1;
        var concatT = totalT + ':50'
        var totalT2 = timeN - 0;
        var concatT2 = totalT2 + ':00'



        for (let i=0; i < comboP1.length; i++ )
            {         
                question.where({'_id': comboP1[i]})
                            .update( {status: 'not available'})
                            .exec()
            }

        for (let j=0; j < comboP2.length; j++ )
        {         
            question.where({'_id': comboP2[j]})
                        .update( {status: 'available'})
                        .exec()
        }


        if (mongoose.Types.ObjectId.isValid(id)) {
                game.where({'_id': id})
                        .update( {$set: {title: req.body.title, 
                                         date: concatFecha, 
                                         questions: req.body.preguntasCombo, 
                                         prize: req.body.prize, 
                                         status: req.body.status,
                                        notification: [{
                                            type: 1,
                                            subject: req.body.subject,
                                            message: req.body.message,
                                            date: concatT

                                        },{
                                            type: 2,
                                            subject: req.body.subject2,
                                            message: req.body.message2,
                                            date: concatT2
                                        }]

                                        
                                        }})
                        .exec()
                        .then(result =>{                
                            if(result.nModified===1){  
                                game.findById(id)
                                .exec()
                                .then(juego => {
                                    question.find({'_id': {$in: juego.questions}}, {"question":1, "options":1, "level":1}).sort({"level": 1}).exec().then(result2=>{              
                                        createPushNotification(juego);
                                        res.status(200).render( 'game/gameDetail' , { partida: juego, questions: result2, message: "Game successfully modified"})    
                                    })
                                })  
                            }   
                            else {                        
                                game.find()
                                    .exec()
                                    .then(games => {          
                                        res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
                                
                                    })
                            }
                        })
                        .catch(err =>{
                            game.find()
                            .exec()
                            .then(games => {          
                                res.status(500).render( 'game/gameAll', { partidas: games, error: "Internal server error, try again"})                 
                        
                            })
                        })
            }
            else{
                game.find()
                .exec()
                .then(games => {          
                    res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
            
                })
            }
        }
}

function deleteGameByID(req, res){
    
    const id = req.params.gameID;    
    game.findById(id).exec().then( resultado => {
        
        if(resultado!=null) {

        
        
        
        var cambio= [];
        var cambio = resultado.questions;
        
        console.log(cambio.length);

      
            for (let i=0; i < cambio.length; i++ ){   
                question.where({'_id': cambio[i]})
                        .update( {status: 'available'})
                        .exec()
            }
        
        
    
    
            if(mongoose.Types.ObjectId.isValid(id)){
                game.findByIdAndRemove(id).exec().then(result=>{
                    if(result){
                        game.find()
                            .exec()
                            .then(games => {                               
                                res.status(200).render( 'game/gameAll', { message: "Game successfully eliminated", partidas: games})
                            })
                 
                    }
                    else {
                        game.find()
                            .exec()
                            .then(games => {                               
                                res.status(404).render( 'game/gameAll', {error: "Bad Request, try again", partidas: games})
                            })
                    }
                })
                .catch(err =>{
                   console.log("en el catch");
                    game.find()
                    .exec()
                    .then(games => {                               
                        res.status(500).render( 'game/gameAll', { error: "Internal server error, try again", partidas: games})
                    })
                })
            }
            else{
                game.find()
                .exec()
                .then(games => {                               
                    res.status(404).render( 'game/gameAll', {error: "Bad Request, try again", partidas: games})
                })
            }
        } else {
            game.find()
                    .exec()
                    .then(games => {                               
                        res.status(404).render( 'game/gameAll', {error: "Bad Request, try again", partidas: games})
                    })
        }
        })
    
}


function createGame(req,res, next){
   
    question.count().where({level:"Low", status:"available"},{"question": 1}).exec().then( resultCount=> {
        question.count().where({level:"Medium", status:"available"},{"question": 1}).exec().then( resultCount2=> {
            question.count().where({level:"High", status:"available"},{"question": 1}).exec().then( resultCount3=> {
                var rand = Math.floor(Math.random() *resultCount);
                var rand2 = Math.floor(Math.random() *resultCount2);
                var rand3 = Math.floor(Math.random() *resultCount3);
                question.find({level:"Low", status:"available"},{"question": 1}).limit(10).skip(rand).exec().then(result1=> {
                    question.find({level:"Medium", status:"available"},{"question": 1}).limit(10).skip(rand2).exec().then(result2=> {
                        question.find({level:"High", status:"available"},{"question": 1}).limit(10).skip(rand3).exec().then(result3=> {
                            res.render('game/newGame',{bajos: result1,  medios: result2, altos: result3})
                        });                   
                    });
                });
            });
        });
    });



}

function editGame(req,res){

    
    const id= req.params.gameID;
    question.count().where({level:"Low", status:"available"},{"question": 1}).exec().then( resultCount=> {
        question.count().where({level:"Medium", status:"available"},{"question": 1}).exec().then( resultCount2=> {
            question.count().where({level:"High", status:"available"},{"question": 1}).exec().then( resultCount3=> {
                var rand = Math.floor(Math.random() *resultCount);
                var rand2 = Math.floor(Math.random() *resultCount2);
                var rand3 = Math.floor(Math.random() *resultCount3);
                question.find({level:"Low", status:"available"},{"question": 1}).limit(10).skip(rand).exec().then(result1=> {
                    question.find({level:"Medium", status:"available"},{"question": 1}).limit(10).skip(rand2).exec().then(result2=> {
                        question.find({level:"High", status:"available"},{"question": 1}).limit(10).skip(rand3).exec().then(result3=> {
                            
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
                                        game.find()
                                            .exec()
                                            .then(games => {          
                                                res.status(500).render( 'game/gameAll', { partidas: games, error: "Internal server error, try again"})                 
                                            
                                            })
                                    })
                            }
                            else {
                                game.find()
                                    .exec()
                                    .then(games => {          
                                        res.status(404).render( 'game/gameAll', { partidas: games, error: "Bad Request, try again"})                 
                                            
                                    })
                                }
                            
                           
                        });                   
                    });
                });
            });
        });
    });

    
}


module.exports ={editGame, newGame, getGames, getGameID, updateGameByID, deleteGameByID, createGame};
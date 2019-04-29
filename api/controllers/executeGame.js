import game from "../models/game"
import question from "../models/question"
import {connect} from '../socket'


function getExecuteGame(req, res) {
    
    let now = new Date();
    var cambio = JSON.parse(JSON.stringify(now));
    var cambio2 = cambio.split("T");
    var cambio3 = cambio2[0].split("-");
    var concatenar = cambio3[1] + "/"+ cambio3[2] +"/" + cambio3[0];
    var Partidas = [];
    
    game.find({'status': "No start"}).exec().then(result=>{

        for(let i=0; i< result.length; i++){
            var fecha = result[i].date.split("T");

            if(fecha[0]==concatenar){
                Partidas.push(result[i]);          
            }
        }
        res.render('executeGame/executeGame', {partidas: Partidas});
       
    }).catch(err=>{
        res.render('index',{error: "Server error, try again"});
    });

     
  
}
function connectionGame(req,res,next){
    var identificador= req.params.gameID;
    res.render('executeGame/conexionExecuteGame' ,{partida: identificador})
}
function getQuestionsGame(req, res){
    var id = req.params.gameID;
    var questionsBajas=[];
    var questionsMedios=[];
    var questionsAltas=[];
    


    game.findById(id).exec().then(result=>{
    
        question.find({'_id': {$in: result.questions}}, {"question":1, "options":1, "level":1}).sort({"level": 1}).exec().then(result2=>{
            for(let i=0; i < result2.length; i++){
                if(result2[i].level=="Low"){ 
                    questionsBajas.push(result2[i])
                }
                if(result2[i].level=="Medium"){ 
                    questionsMedios.push(result2[i])
                }
                if(result2[i].level=="High"){ 
                    questionsAltas.push(result2[i])
                }
            }
            connect();


            game.where({'_id': id}).update({$set: {status: "In progress"}}).exec();

            res.render('executeGame/questionsExecGame', {juego: result ,preguntas: result2, questionsB: questionsBajas, questionsM: questionsMedios, questionsA: questionsAltas, message: "The server is available to connect. You can connect when you are ready to start the game."})
        }).catch(err=>{
            res.render('index',{error: "Internal server error, try again"});
        });

       
    }).catch(err=>{
        res.render('index',{error: "Internal server error, try again"});
    });

}




 function conectandoAlSocket() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
        connect('hola');
        
      }, 2000);
    });
  }
  
 async function startGame(req, res, next) {
    console.log('calling');
    var result = await conectandoAlSocket();
    console.log(result);

 
  
  }

  function endGame(req, res) {
    var identificador = req.params.gameID;
    game.where({'_id': identificador}).update({$set: {status: "Finished"}}).exec();

    let now = new Date();
    var cambio = JSON.parse(JSON.stringify(now));
    var cambio2 = cambio.split("T");
    var cambio3 = cambio2[0].split("-");
    var concatenar = cambio3[1] + "/"+ cambio3[2] +"/" + cambio3[0];
    var Partidas = [];
    
    game.find({'status': "No start"}).exec().then(result=>{

        for(let i=0; i< result.length; i++){
            var fecha = result[i].date.split("T");

            if(fecha[0]==concatenar){
                Partidas.push(result[i]);          
            }
        }
        res.render('executeGame/executeGame', {partidas: Partidas, message: "The game has ended successfully. The connection to the server has been closed."});
       
    }).catch(err=>{
        res.render('index',{error: "Internal server error, try again"});
    });

  }





module.exports ={getExecuteGame, getQuestionsGame, startGame, conectandoAlSocket, connectionGame, endGame};

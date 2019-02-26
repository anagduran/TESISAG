import game from "../models/game"
import question from "../models/question"


function getExecuteGame(req, res) {
    
    let now = new Date();
    var cambio = JSON.parse(JSON.stringify(now));
    var cambio2 = cambio.split("T");
    var cambio3 = cambio2[0].split("-");
    var concatenar = cambio3[1] + "/"+ cambio3[2] +"/" + cambio3[0];
    var Partidas = [];
    
    game.find().exec().then(result=>{

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

function getQuestionsGame(req, res){
    var id = req.params.gameID;
    
  

    game.findById(id).exec().then(result=>{
    
        question.find({'_id': {$in: result.questions}}).exec().then(result2=>{
            res.render('executeGame/questionsExecGame', {preguntas: result2})
        })

       
    }).catch(err=>{
        console.log("en el catch de game");
        console.log(err);
    })

}



module.exports ={getExecuteGame, getQuestionsGame};

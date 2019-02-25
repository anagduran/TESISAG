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
    

    // hacer un for con el lenght de game seleccionado.
    // por cada game.question.id buscar la pregunta con sus opciones
    // enviarlo al front
}



module.exports ={getExecuteGame, getQuestionsGame};

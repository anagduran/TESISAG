import game from "../models/game"


function getExecuteGame(req, res) {
    res.render('executeGame/executeGame');
    let now = new Date();
    var cambio = JSON.parse(JSON.stringify(now));
    console.log('stringify', cambio);
    var cambio2 = cambio.split("T");
    var cambio3 = 

  
    console.log("split", cambio2[0]);
    console.log('La fecha actual es',now);


    
  
}



module.exports ={getExecuteGame};

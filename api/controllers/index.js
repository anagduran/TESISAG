import admin from '../models/admin'

function getIndex(req,res,next) {
 
    console.log("aqui en la funcion getIndex");
    

    res.render('index');
}



module.exports ={getIndex};
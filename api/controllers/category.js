import category from "../models/category"
import mongoose from "mongoose"
//obtener informacion de las categorias

function getCategories(req,res){
    console.log("aqui en el controlador")
    //res.status(200).send({ message: "entrando al controlador"})

   category.find({},function(err,categories){
        console.log(categories);
        res.send(categories)
   })
   
   
    /* category.find(function(err,categories){
        console.log(categories);
        res.json(categories)
    }); */
    
    /*category.find({}).exec().then(categories=>{
        console.log("dentro del find ")
        res.send(categories)
    });*/



}

module.exports ={ getCategories};

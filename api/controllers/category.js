import category from "../models/category"
import mongoose from "mongoose"



//obtener informacion de las categorias
function getCategories(req,res, next){
    console.log("aqui en el controlador")

    category.find()
            .exec()
            .then(categories => { 
                    console.log(categories);
                    res.status(200).json(categories)
                    })
            .catch(err => {
                console.log(err);
                rest.status(500).json({error: err})
            });
    
}

module.exports ={getCategories};

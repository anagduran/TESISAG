import category from "../models/category"
import mongoose from "mongoose"



//obtener informacion de las categorias
function getCategories(req,res, next){
    console.log("aqui en la funcion de getCategories")

    category.find()
            .exec()
            .then(categories => { 
                if(categories.length>=0){
                    console.log(categories);
                    res.status(200).json(categories)
                }else{
                    res.status(404).json({message: 'no hay categorias'})
                }   
                
            })                
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            })
        
    
}
//crear una nueva categoria
function newCategory(req,res,next) {
    console.log("aqui en la funcion newCategory")

    const categoria = new category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });
 
        categoria.save()
                    .then(nuevacategory => {
                    console.log(nuevacategory);
                    res.status(201).json({createdCategory : nuevacategory})
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    });   
    
}


// modificar una categoria
function updateCategoryByID(req, res, next){
    console.log("aqui en el update de category");
    const id = req.params.categoryByID;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    category.update({id: id}, {$set: updateOps})
            .exec()
            .then(result =>{
                if(result){
                res.status(200).json(result)
                }
                else {
                    res.status(404).json({message: "id incorrecto, no existe la categoria"})
                }
            })
            .catch(err =>{
                res.status(500).json({error: err})
            })

}

//eliminar una categoria
function deleteCategoryByID(req, res, next){
    console.log("dentro de la funcion delete category")
    const id = req.params.categoryByID;

    category.findByIdAndRemove(id).exec().then(result=>{
        if(result){
            res.status(200).json({message: "eliminado exitosamente"})
        }
        else {
            res.status(404).json({message: "no existe la categoria a eliminar"})
        }
    })
    /*category.remove({_id: id})
            .exec()
            .then(result =>{
                if(result){
                    res.status(200).json({message: "eliminado exitosamente"})
                }
                else {
                    res.status(404).json({message: "no existe la categoria, no se puede eliminar"})
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({error: err})
            })*/
}

// consultar una categoria en particular
function getCategoryID(req,res,next) {
    console.log("aqui en el getcategory por ID");
    const id = req.params.categoryID;
    
    category.findById(id)
            .exec()
            .then(categoryByID =>{
                
                if(categoryByID){
                    console.log(categoryByID);
                    res.status(200).json(categoryByID)
                }
                else {
                    res.status(404).json({message: 'no valid entry for provided ID'})
                }
                
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({error: err})
            })
}
module.exports ={getCategories, newCategory, getCategoryID, deleteCategoryByID, updateCategoryByID};

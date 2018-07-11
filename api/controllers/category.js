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
    const id = req.params.categoryID;
    const cambios = req.body;
    const updateOps = {};
    const q = category.where({_id: id});

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

     if(id.length===24){
        category.where({'_id':id}).update( {$set: updateOps}).exec()
                .then(result =>{
                    if(result.nModified===1){
                        res.status(200).json({message: "modificado con exito"})
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

//eliminar una categoria
function deleteCategoryByID(req, res, next){
    console.log("dentro de la funcion delete category")
    const id = req.params.categoryID;
    
    if(id.length===24)
    {
        category.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200).json({message: "borrado con exito"})
            }
            else {
                res.status(404).json({message: "error, ID no encontrado"})
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
   
}

// consultar una categoria en particular
function getCategoryID(req,res,next) {
    console.log("aqui en el getcategory por ID");
    const id = req.params.categoryID;
    
    if(id.length===24)
    {
    category.findById(id)
            .exec()
            .then(categoryByID =>{
                
                if(categoryByID){
                   // console.log(categoryByID);
                    res.status(200).json(categoryByID)
                }
                else {
                    res.status(404).json({message: 'no encontrado, ID incorrecto'})
                }
                
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({error: err})
            })
    }
    else{
        res.status(404).json({message: "no valid entry for provided ID"})
    }
}
module.exports ={getCategories, newCategory, getCategoryID, deleteCategoryByID, updateCategoryByID};

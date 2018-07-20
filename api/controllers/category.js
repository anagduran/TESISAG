import category from "../models/category"
import mongoose from "mongoose"
import { lstat } from "fs";



//obtener informacion de las categorias
function getCategories(req,res, next){
    console.log("aqui en la funcion de getCategories")
    try {
    //realizo el find, ejecuto y luego si categorias existe envia status HTTP 200 y redirige a la
    //vista categoryAll, sino envia status 404
    category.find()
            .exec()
            .then(categories => { 
                if(categories) {
                  res.status(200).render( 'category/categoryAll', { categorias: categories})
                }else{
                    res.status(404).json({message: 'no hay categorias'})
                }   
                
            }).catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            })
        }
        catch(error) {
            console.log(error)
        }   
}

//crear una nueva categoria
function newCategory(req,res,next) {

    //creo la estructura de la nueva categoria
    const categoria = new category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });
        //realizo el save, si resulta exitoso envio estatus HTTP 201 y redirijo a la vista categoryDetail
        //sino envio status HTTP 500
        try{ 
            categoria.save()
                    .then(nuevacategory => {
                        res.status(201).render('category/categoryDetail',{categoria: nuevacategory})
                     })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    }); 
        }  
        catch(error){
           console.log(error) 
        }
    
}


// modificar una categoria
function updateCategoryByID(req, res, next){

   const id = mongoose.Types.ObjectId(req.body.id)
    
   console.log(id);
   
    // valido que el ID enviado sea correcto, si es asi realizo el update y si este resulta exitoso
    // envio status 200 y redirijo a la vista categoryDetail, sino envio error 404
    if (mongoose.Types.ObjectId.isValid(id)) {
        category.where({'_id': id}).update( {$set: {name: req.body.name, description: req.body.description}}).exec()
                .then(result =>{
                    
                    if(result.nModified===1){
                    res.status(200).render('category/categoryDetail', {categoria: req.body})
                       
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
   
    const id = req.params.categoryID;
    
    //Valido el ID enviado si es correcto busco y elimino la categoria seleccionada
    //AQUI FALTA VALIDAR QUE SI LA CATEGORIA TIENE PREGUNTAS ASOCIADAS NO SE PUEDE ELIMINAR
    //FALTAN COSAS AQUI 
    if(mongoose.Types.ObjectId.isValid(id))
    {
        category.findByIdAndRemove(id).exec().then(result=>{
            if(result){
            res.status(200).redirect('/')
            //send('<h3>eliminado con exito</h3>')
           // render('category/categoryAll', { categorias: categories})
            }
            else {
                res.status(404).json({message: "ERROR ID"})
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

    const id = req.params.categoryID;
    
    //Si el ID enviado escorrecto, realizo la busqueda y redirijo a la vista categoryDetail con status HTTP 200
    //sino envio 404
    if(mongoose.Types.ObjectId.isValid(id))
    {
    category.findById(id)
            .exec()
            .then(categoryByID =>{
                
                if(categoryByID){
                    res.status(200).render( 'category/categoryDetail', { categoria: categoryByID})
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


//funcion que toma los parametros y los redirige a otra pagina para ser editados
function editCategory(req,res, next){

    
    const id= req.params.categoryID;
    if(mongoose.Types.ObjectId.isValid(id)){
        category.findById(id)
        .exec()
        .then(categoryByID =>{           
            res.render('category/updateCategory', {categoria: categoryByID})
        }).catch(err=> {
            res.status(404).json({message: "no valid entry for provided ID"})
        })
    }
    else {
        res.status(404).json({message: "no valid entry for provided ID"})
    }
   

    
}

//funcion que solo redirige para crear una nueva categoria
function createCategory(req,res, next){
    console.log("dentro de la funcion nueva categoria")
    res.render('category/newCategory')
}


module.exports ={createCategory, newCategory, getCategories,  getCategoryID, deleteCategoryByID, updateCategoryByID, editCategory};

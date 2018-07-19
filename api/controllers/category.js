import category from "../models/category"
import mongoose from "mongoose"



//obtener informacion de las categorias
function getCategories(req,res, next){
    console.log("aqui en la funcion de getCategories")
    try {
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

    const categoria = new category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });
 
        categoria.save()
                    .then(nuevacategory => {
                    console.log(nuevacategory);
                    res.status(201).render('category/categoryDetail',{categoria: nuevacategory})
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    });   
    
}


// modificar una categoria
function updateCategoryByID(req, res, next){

   const id = mongoose.Types.ObjectId(req.body.id)
    
   console.log(id);
   

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
    
    if(mongoose.Types.ObjectId.isValid(id))
    {
    category.findById(id)
            .exec()
            .then(categoryByID =>{
                
                if(categoryByID){
                    res.status(200).render( 'category/categoryDetail', { categoria: categoryByID})
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



function editCategory(req,res, next){
    const id= req.params.categoryID;
    
    category.findById(id)
            .exec()
            .then(categoryByID =>{
               
                res.render('category/updateCategory', {categoria: categoryByID})
            })
    
}

function createCategory(req,res, next){
    console.log("dentro de la funcion nueva categoria")
    res.render('category/newCategory')
    
  
}


module.exports ={createCategory, newCategory, getCategories,  getCategoryID, deleteCategoryByID, updateCategoryByID, editCategory};

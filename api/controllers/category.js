import category from "../models/category"
import mongoose from "mongoose"
import question from "../models/question"



//obtener informacion de las categorias
function getCategories(req,res, next){
    
    
    //realizo el find, ejecuto y luego si categorias existe envia status HTTP 200 y redirige a la
    //vista categoryAll, sino envia status 404
    category.find()
            .exec()
            .then(categories => { 
                if(categories) {
                  res.status(200).render( 'category/categoryAll', { categorias: categories})
                }else{
                    res.status(404).render( 'index', { error: "Server error, try again"} )
                }   
                
            }).catch(err => {
                res.status(500).render( 'index', { error: "Server error, try again"} )
            })
        
         
}

//crear una nueva categoria
function newCategory(req,res,next) {
    
    req.check('name').isLength({min: 4}).withMessage('The name of the category can not be too short');
    req.check('name').notEmpty().withMessage('The name of the category can not be empty');
    req.check('name').matches('[a-zA-Z]').withMessage('No special characters or numbers are allowed in the "Name" field');

    req.check('description').isLength({min: 10}).withMessage('The description of the category can not be too short');
    req.check('description').notEmpty().withMessage('The description of the category can not be empty');
    req.check('description').matches('[a-zA-Z]').withMessage('No special characters or numbers are allowed in the "Description" field');
    

    var errors = req.validationErrors();
    if (errors){
        //console.log(errors)
        res.render('category/newCategory', {error: errors});
        return;
    } else { 
        //creo la estructura de la nueva categoria
        const categoria = new category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
        });
        //realizo el save, si resulta exitoso envio estatus HTTP 201 y redirijo a la vista categoryDetail
        //sino envio status HTTP 500
        
            categoria.save()
                    .then(nuevacategory => {
                        if(nuevacategory) {
                            res.status(201).render('category/categoryDetail',{categoria: nuevacategory , message: "Category added successfully"})
                        }
                        else {
                            category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )
                                    })
                        }
                        
                     }).catch(err => {
                        category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(500).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )
                                    })
                     })
        
        
    }
    
    
}


// modificar una categoria
function updateCategoryByID(req, res){   
    req.check('name').isLength({min: 4}).withMessage('The name of the category can not be too short');
    req.check('name').notEmpty().withMessage('The name of the category can not be empty');
    req.check('name').matches('[a-zA-Z]').withMessage('No special characters or numbers are allowed in the "Name" field');

    req.check('description').isLength({min: 10}).withMessage('The description of the category can not be too short');
    req.check('description').notEmpty().withMessage('The description of the category can not be empty');
    req.check('description').matches('[a-zA-Z]').withMessage('No special characters or numbers are allowed in the "Description" field');

    var errors = req.validationErrors();
    if (errors){
     
        res.render('category/updateCategory', {error: errors,  categoria: req.body});
        return;
    } else {
        const id = mongoose.Types.ObjectId(req.body._id)
            // valido que el ID enviado sea correcto, si es asi realizo el update y si este resulta exitoso
            // envio status 200 y redirijo a la vista categoryDetail, sino envio error 404
            if (mongoose.Types.ObjectId.isValid(id)) {
                
                category.where({'_id': id}).update( {$set: {name: req.body.name, description: req.body.description}}).exec()
                        .then(result =>{
                            
                            if(result.nModified===1){
                            res.status(200).render('category/categoryDetail', {categoria: req.body, message: "Category successfully modified"})
                            
                            }
                            else { 
                                category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )
                                    })                       
                           
                            }
                        })
                        .catch(err =>{
                            category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(500).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )
                                    })
                        })
            }
           
        }
        
  
}

//eliminar una categoria
function deleteCategoryByID(req, res, next){
   
    const id = mongoose.Types.ObjectId(req.params.categoryID)
    
    //Valido el ID enviado si es correcto busco y elimino la categoria seleccionada
    //AQUI FALTA VALIDAR QUE SI LA CATEGORIA TIENE PREGUNTAS ASOCIADAS NO SE PUEDE ELIMINAR
    if(mongoose.Types.ObjectId.isValid(id))
    {
       
        question.findOne({category: id}).then(result =>{
            if(result==null)
            {
                category.findByIdAndRemove(id).exec().then(result=>{
                    if(result){   
                        category.find()
                        .exec()
                        .then(categories => {                                                     
                            res.status(200).render( 'category/categoryAll', { message: "Category successfully eliminated", categorias: categories} )               
                        })
                        
                      
                    }
                    else {
                        category.find()
                                .exec()
                                .then(categories => {                                                                
                                    res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                                })
                    }
                }).catch(err=>{
                    category.find()
                                .exec()
                                .then(categories => {                                                                
                                    res.status(500).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                                })
                })
               
            
            }
            
        })       
       
    }        
    else{
        category.find()
        .exec()
        .then(categories => {                                                                
            res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
        })
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
                    category.find()
                                .exec()
                                .then(categories => {                                                                
                                    res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                                })
            
                }
                
            })
            .catch(err=>{
                category.find()
                .exec()
                .then(categories => {                                                                
                    res.status(500).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                })
            })
    }
    else{
        category.find()
        .exec()
        .then(categories => {                                                                
            res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
        })
    }
}


//funcion que toma los parametros y los redirige a otra pagina para ser editados
function editCategory(req,res, next){

    
    const id= req.params.categoryID;
      
            if(mongoose.Types.ObjectId.isValid(id)){
                category.findById(id)
                .exec()
                .then(categoryByID =>{ 
                    if(categoryByID) {
                        res.status(200).render('category/updateCategory', {categoria: categoryByID})
                    } else {
                        category.find()
                        .exec()
                        .then(categories => {                                                                
                            res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                        })
                    }   
                   
                }).catch(err=> {
                    category.find()
                            .exec()
                            .then(categories => {                                                                
                                res.status(500).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                            })
                })
            }
            else {
                category.find()
                        .exec()
                        .then(categories => {                                                                
                            res.status(404).render( 'category/categoryAll', { error: "Server error, try again", categorias: categories} )                                   
                        })
            }  
}

//funcion que solo redirige para crear una nueva categoria
function createCategory(req,res, next){
    res.render('category/newCategory')
}


module.exports ={createCategory, newCategory, getCategories,  getCategoryID, deleteCategoryByID, updateCategoryByID, editCategory};

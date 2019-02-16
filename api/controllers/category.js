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
                    res.status(404).render( 'index', { error: "Error de servidor, intente mas tarde"} )
                }   
                
            }).catch(err => {
                res.status(500).render( 'index', { error: "Error de servidor, intente mas tarde"} )
            })
        
         
}

//crear una nueva categoria
function newCategory(req,res,next) {
    
    req.check('name').isLength({min: 4}).withMessage('nombre de categoria muy corto');
    req.check('name').notEmpty().withMessage('el nombre de la categoria no puede estar vacio');
    req.check('name').matches('[a-zA-Z]').withMessage('No se permiten caracteres especiales ni numeros en el campo Nombre');

    req.check('description').isLength({min: 10}).withMessage('La descripcion de la categoria muy corta');
    req.check('description').notEmpty().withMessage('La descripcion de la categoria no puede estar vacia');
    req.check('description').matches('[a-zA-Z]').withMessage('No se permiten caracteres especiales ni numeros en el campo Descripcion');
    

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
                            res.status(201).render('category/categoryDetail',{categoria: nuevacategory})
                        }
                        else {
                            category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )
                                    })
                        }
                        
                     }).catch(err => {
                        category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(500).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )
                                    })
                     })
        
        
    }
    
    
}


// modificar una categoria
function updateCategoryByID(req, res){   

    req.check('name').isLength({min: 4}).withMessage('El nombre es muy corto');
    req.check('name').notEmpty().withMessage('El nombre no puede estar vacio');
    req.check('name').matches('[a-zA-Z]').withMessage('No se permiten caracteres especiales, espacios en blanco o numeros en el campo Nombre');
 
    req.check('description').isLength({min: 10}).withMessage('La descripcion es muy corta');
    req.check('description').notEmpty().withMessage('La descripcion no puede estar vacia');
    req.check('description').matches('[a-zA-Z]').withMessage('No se permiten caracteres especiales, espacios en blanco o numeros en el campo Descripcion');
    
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
                            res.status(200).render('category/categoryDetail', {categoria: req.body})
                            
                            }
                            else { 
                                category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )
                                    })                       
                           
                            }
                        })
                        .catch(err =>{
                            category.find()
                                    .exec()
                                    .then(categories => { 
                                    res.status(500).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )
                                    })
                        })
            }
           
        }
        
  
}

//eliminar una categoria
function deleteCategoryByID(req, res, next){
   
    const id = mongoose.Types.ObjectId(req.params.categoryID)
    var referencia = req.header('Referer')
    let exito = 'Categoria eliminada exitosamente'
    let fallo = 'Esta categoria no se puede eliminar porque tiene preguntas asociadas'

    
    //Valido el ID enviado si es correcto busco y elimino la categoria seleccionada
    //AQUI FALTA VALIDAR QUE SI LA CATEGORIA TIENE PREGUNTAS ASOCIADAS NO SE PUEDE ELIMINAR
    if(mongoose.Types.ObjectId.isValid(id))
    {
       
        question.findOne({category: id}).then(result =>{
            if(result==null)
            {
                category.findByIdAndRemove(id).exec().then(result=>{
                    if(result){   
                        var mensaje= "Eliminado con exito"  
                        category.find()
                        .exec()
                        .then(categories => {                                                     
                            res.status(200).render( 'category/categoryAll', { message: mensaje, categorias: categories} )               
                        })
                        
                      
                    }
                    else {
                        category.find()
                                .exec()
                                .then(categories => {                                                                
                                    res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                                })
                    }
                }).catch(err=>{
                    category.find()
                                .exec()
                                .then(categories => {                                                                
                                    res.status(500).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                                })
                })
               
            
            }
            
        })       
       
    }        
    else{
        category.find()
        .exec()
        .then(categories => {                                                                
            res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
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
                                    res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                                })
            
                }
                
            })
            .catch(err=>{
                category.find()
                .exec()
                .then(categories => {                                                                
                    res.status(500).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                })
            })
    }
    else{
        category.find()
        .exec()
        .then(categories => {                                                                
            res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
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
                            res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                        })
                    }   
                   
                }).catch(err=> {
                    category.find()
                            .exec()
                            .then(categories => {                                                                
                                res.status(500).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                            })
                })
            }
            else {
                category.find()
                        .exec()
                        .then(categories => {                                                                
                            res.status(404).render( 'category/categoryAll', { error: "Error de servidor, intente mas tarde", categorias: categories} )                                   
                        })
            }  
}

//funcion que solo redirige para crear una nueva categoria
function createCategory(req,res, next){
    res.render('category/newCategory')
}


module.exports ={createCategory, newCategory, getCategories,  getCategoryID, deleteCategoryByID, updateCategoryByID, editCategory};

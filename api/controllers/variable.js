import mongoose from "mongoose"
import variable from "../models/variable"

function newVariable(req,res,next) {

    req.check("title").notEmpty().withMessage("El campo de titulo no puede estar vacio") 
    req.check("description").notEmpty().withMessage("El campo de descripcion no puede estar vacio")
    req.check('description').isLength({min: 10}).withMessage('La descripcion es muy corta') 
    req.check('title').isLength({min: 5}).withMessage('El titulo es muy corto') 
    

    var errors = req.validationErrors();
    if (errors){
        res.render('variable/newVariable', {error: errors});
        return;
    } else {
        const variableC = new variable({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description
            });
        
         
                variableC.save()
                        .then(nuevavariable => { 
                            if(nuevavariable){
                                res.status(201).render('variable/variableDetail',{variableC: nuevavariable})
                            } else {
                                variable.find()
                                        .exec()
                                        .then(variables => {                               
                                            res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                        });
                                }
                           
                        })
                        .catch(err => {
                            variable.find()
                                        .exec()
                                        .then(variables => {                               
                                            res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                        });
                        }); 
            

        }
}

function getVariables(req,res,next){
   
        variable.find()
                .exec()
                .then(variables => {  
                    if(variables){
                        res.status(200).render('variable/variableAll',{variableConfiguracion: variables})   
                    }    
                    else {
                        variable.find()
                                .exec()
                                .then(variables => {                               
                                    res.status(404).render('index',{ error: "Error al conectar con el servidor, intente nuevamente"})          
                                });
                    }                         
                         
                }).catch(err => {
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('index',{error: "Error al conectar con el servidor, intente nuevamente"})          
                            });   
                })  

}

function getVariableID(req,res,next){
    const id = req.params.variableID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        variable.findById(id)
                .exec()
                .then(variableByID =>{                
                    if(variableByID){ 
                        res.status(200).render('variable/variableDetail',{variableC: variableByID})
                    }
                    else { 
                        variable.find()
                                .exec()
                                .then(variables => {                               
                                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                });
                    }                
                })
                .catch(err=>{
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                            });
                    })
    }
    else{
        variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                });
    }
}

function updateVariableByID(req, res, next){
   
    req.check("title").notEmpty().withMessage("El campo de titulo no puede estar vacio") 
    req.check("description").notEmpty().withMessage("El campo de descripcion no puede estar vacio")
    req.check('description').isLength({min: 10}).withMessage('La descripcion es muy corta') 
    req.check('title').isLength({min: 5}).withMessage('El titulo es muy corto') 
    
    var errors = req.validationErrors();
    if (errors){
        res.render('variable/updateVariable', {error: errors, variableC: req.body});
        return;
    } else {
        const id = mongoose.Types.ObjectId(req.body._id)
    //const id = req.params.variableID;

        if (mongoose.Types.ObjectId.isValid(id)) {
            variable.where({'_id': id})
                    .update( {$set: {title: req.body.title, description: req.body.description}})
                    .exec()
                    .then(result =>{                    
                        if(result.nModified===1){
                        res.status(200).render('variable/variableDetail',{variableC: req.body})                      
                        }
                        else {                        
                            variable.find()
                                    .exec()
                                    .then(variables => {                               
                                        res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                    });
                        }
                    })
                    .catch(err =>{
                        variable.find()
                                .exec()
                                .then(variables => {                               
                                    res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                });
                    })
        }
        else{
            variable.find()
                    .exec()
                    .then(variables => {                               
                        res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                    });
        }
    }
}

function deleteVariableByID(req, res, next){
    
    const id = req.params.variableID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        variable.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                variable.find()
                .exec()
                .then(variables => {                               
                    res.status(200).render('variable/variableAll',{message: "eliminado con exito", variableConfiguracion: variables})          
                })     
            }
            else {
                variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{message: "Error con el servidor, intente nuevamente", variableConfiguracion: variables})          
                }) 
            }
        })
        .catch(err =>{
            variable.find()
                .exec()
                .then(variables => {                               
                    res.status(500).render('variable/variableAll',{message: "Error con el servidor, intente nuevamente", variableConfiguracion: variables})          
                }) 
        })
    }
    else{
        variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{message: "Error con el servidor, intente nuevamente", variableConfiguracion: variables})          
                }) 
    }
}

function editVariable(req,res, next){

    
    const id= req.params.variableID;
      
            if(mongoose.Types.ObjectId.isValid(id)){
                variable.findById(id)
                .exec()
                .then(variableByID =>{  
                    if(variableByID) {        
                        res.render('variable/updateVariable', {variableC: variableByID})
                    }else {
                        variable.find()
                                .exec()
                                .then(variables => {                               
                                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                                });
                    }
                }).catch(err=> {
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                            });
                })
            }
            else {
                variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Error al conectar con el servidor, intente nuevamente"})          
                });
            }
        
     
}

function createVariable(req,res, next){
    res.render('variable/newVariable')
}
module.exports ={editVariable, createVariable, newVariable, getVariables, getVariableID, updateVariableByID, deleteVariableByID};
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
        
            try{ 
                variableC.save()
                        .then(nuevavariable => { 
                            res.status(201).render('variable/variableDetail',{variableC: nuevavariable})
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err})
                        }); 
            }  
            catch(error){
            console.log(error);
            }

        }
}

function getVariables(req,res,next){
    try{
        variable.find()
                .exec()
                .then(variables => { 
                   
                        if(variables) {                        
                            res.status(200).render('variable/variableAll',{variableConfiguracion: variables})
                        }else{
                            res.status(404).json({message: 'no hay variables'})
                        }   
            
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err})
                })
        }catch(error){
            console.log(error)
        }
    

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
                        res.status(404).json({message: 'no encontrado, ID incorrecto'})
                    }                
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message:"aqui en el error 500"})
                })
    }
    else{
        res.status(404).json({message: "no valid entry for provided ID"})
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
}

function deleteVariableByID(req, res, next){
    
    const id = req.params.variableID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        variable.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200)     
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

function editVariable(req,res, next){

    
    const id= req.params.variableID;
      
            if(mongoose.Types.ObjectId.isValid(id)){
                variable.findById(id)
                .exec()
                .then(variableByID =>{           
                    res.render('variable/updateVariable', {variableC: variableByID})
                }).catch(err=> {
                    res.status(404).json({message: "no valid entry for provided ID"})
                })
            }
            else {
                res.status(404).json({message: "no valid entry for provided ID"})
            }
        
     
}

function createVariable(req,res, next){
    res.render('variable/newVariable')
}
module.exports ={editVariable, createVariable, newVariable, getVariables, getVariableID, updateVariableByID, deleteVariableByID};
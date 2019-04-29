import mongoose from "mongoose"
import variable from "../models/variable"

function newVariable(req,res,next) {

    req.check("title").notEmpty().withMessage("The title field can not be empty") 
    req.check("description").notEmpty().withMessage("The description field can not be empty")
    req.check('description').isLength({min: 10}).withMessage('The description is very short') 
    req.check('title').isLength({min: 5}).withMessage('The title is very short') 
    

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
                                res.status(201).render('variable/variableDetail',{variableC: nuevavariable,  message: "Setting added successfully"})
                            } else {
                                variable.find()
                                        .exec()
                                        .then(variables => {                               
                                            res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error:"Bad Request, try again"})          
                                        });
                                }
                           
                        })
                        .catch(err => {
                            variable.find()
                                        .exec()
                                        .then(variables => {                               
                                            res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Internal server error, try again"})          
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
                                    res.status(404).render('index',{ error:"Bad Request, try again"})          
                                });
                    }                         
                         
                }).catch(err => {
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('index',{error: "Internal server error, try again"})          
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
                                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again"})          
                                });
                    }                
                })
                .catch(err=>{
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Internal server error, try again"})          
                            });
                    })
    }
    else{
        variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again"})          
                });
    }
}

function updateVariableByID(req, res, next){
   
    req.check("title").notEmpty().withMessage("The title field can not be empty") 
    req.check("description").notEmpty().withMessage("The description field can not be empty")
    req.check('description').isLength({min: 10}).withMessage('The description is very short') 
    req.check('title').isLength({min: 5}).withMessage('The title is very short')  
    
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
                        res.status(200).render('variable/variableDetail',{variableC: req.body, message: "Setting successfully modified"})                      
                        }
                        else {                        
                            variable.find()
                                    .exec()
                                    .then(variables => {                               
                                        res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again" })          
                                    });
                        }
                    })
                    .catch(err =>{
                        variable.find()
                                .exec()
                                .then(variables => {                               
                                    res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Internal server error, try again"})          
                                });
                    })
        }
        else{
            variable.find()
                    .exec()
                    .then(variables => {                               
                        res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again"})          
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
                    res.status(200).render('variable/variableAll',{message: "Setting successfully eliminated", variableConfiguracion: variables})          
                })     
            }
            else {
                variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{error: "Bad Request, try again", variableConfiguracion: variables})          
                }) 
            }
        })
        .catch(err =>{
            variable.find()
                .exec()
                .then(variables => {                               
                    res.status(500).render('variable/variableAll',{error: "Internal server error, try again", variableConfiguracion: variables})          
                }) 
        })
    }
    else{
        variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{error: "Bad Request, try again", variableConfiguracion: variables})          
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
                                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again"})          
                                });
                    }
                }).catch(err=> {
                    variable.find()
                            .exec()
                            .then(variables => {                               
                                res.status(500).render('variable/variableAll',{variableConfiguracion: variables, error: "Internal server error, try again"})          
                            });
                })
            }
            else {
                variable.find()
                .exec()
                .then(variables => {                               
                    res.status(404).render('variable/variableAll',{variableConfiguracion: variables, error: "Bad Request, try again"})          
                });
            }
        
     
}

function createVariable(req,res, next){
    res.render('variable/newVariable')
}
module.exports ={editVariable, createVariable, newVariable, getVariables, getVariableID, updateVariableByID, deleteVariableByID};
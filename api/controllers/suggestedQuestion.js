import mongoose from "mongoose"
import suggestedQuestion from "../models/suggestedQuestion"
import question from "../models/question"



function getSuggestedQuestion(req,res,next){
  
        suggestedQuestion.find()
                        .exec()
                        .then(suggested => {      
                            if(suggested)    {                              
                                res.status(200).render('suggested/suggestedAll',{preguntas: suggested}) 
                            } else {
                                res.status(404).render('index' , {error: "error en servidor intente nuevamente"}) 
                            }                    
                        }).catch(err => {                    
                            res.status(404).render('index', {error: "error en servidor intente nuevamente"}) 
                        })
        
    

}

function getQuestionID(req,res,next){
    const id = req.params.questionID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        suggestedQuestion.findById(id)
                         .populate('category', ['name']) 
                         .exec()
                         .then(questionByID =>{ 
                                        
                                    if(questionByID){ 
                                        res.status(200).render('suggested/suggestedDetail',{pregunta: questionByID})
                                        
                                    }
                                    else { 
                                        suggestedQuestion.find()
                                                         .exec()
                                                         .then(suggested => { 
                                                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                                                         })     
                                        
                                    }                
                         })
                         .catch(err=>{
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                    res.status(500).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                                            })     
                         })
        }
    else{
        suggestedQuestion.find()
                         .exec()
                         .then(suggested => { 
                                res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                        })     
    }
}

function deleteQuestionByID(req, res, next){
    
    const id = req.params.questionID;    

    
    if(mongoose.Types.ObjectId.isValid(id)){
        suggestedQuestion.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                suggestedQuestion.find()
                .exec()
                .then(suggested => {                     
                    res.status(200).render('suggested/suggestedAll',{message: "eliminado con exito" , preguntas: suggested})                     
                       
                }) 
            }
            else {
                suggestedQuestion.find()
                                .exec()
                                .then(suggested => {                     
                                    res.status(404).render('suggested/suggestedAll',{message: "Error con el servidor, intente nuevamente" , preguntas: suggested})                     
                                        
                                }) 
            }
        })
        .catch(err =>{
            suggestedQuestion.find()
                            .exec()
                            .then(suggested => {                     
                                res.status(500).render('suggested/suggestedAll',{message: "Error con el servidor, intente nuevamente" , preguntas: suggested})                     
                                
                            }) 
        })
    }
    else{
        suggestedQuestion.find()
                        .exec()
                        .then(suggested => {                     
                            res.status(404).render('suggested/suggestedAll',{message: "Error con el servidor, intente nuevamente" , preguntas: suggested})                     
                                
                        }) 
    }
}


function createQuestion(req,res, next){
    const id = req.params.questionID;
    if(mongoose.Types.ObjectId.isValid(id)){
        suggestedQuestion.findById(id)
                         .populate('category', ['name']) 
                         .exec()
                         .then(questionByID =>{                
                                    if(questionByID){ 
                                        res.status(200).render('suggested/newSuggested',{pregunta: questionByID})
                                        
                                    }
                                    else { 
                                        suggestedQuestion.find()
                                                         .exec()
                                                         .then(suggested => { 
                                                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                                                         })     
                                    }                
                         })
                         .catch(err=>{
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                res.status(500).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                                            })     
                         })
        }
    else{
        suggestedQuestion.find()
                         .exec()
                         .then(suggested => { 
                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                        })     
    }

}

function capitalizeFirstLetter(string){
    let caracter =  string.charAt(0).toUpperCase()+ string.slice(1);
    return caracter;
}


function newQuestion(req, res) {

    
    req.check("level").isIn(['bajo','medio','alto']).withMessage("El nivel debe ser bajo, medio o alto")
    let id = req.body._id;
    
    var errors = req.validationErrors();
    
    if(errors){
        suggestedQuestion.findById(id).populate('category', ['name']).exec().then(SQ => {
            res.render('suggested/newSuggested', {error: errors , pregunta: SQ});
            return;
        });
    }
    else {    
        let cambio = capitalizeFirstLetter(req.body.question);
        let signoUno= '¿'
        let signoDos= '?'
        let preg = signoUno + cambio + signoDos;        
        let estado ='available'
        
       
        const pregunta = new question({
                
                _id: new mongoose.Types.ObjectId(),
                question: preg,
                options: req.body.options,
                answer: req.body.options[0],
                level: req.body.level,
                status: estado,
                category: req.body.category
              

 
            }); 
        
            //GUARDA LA PREGUNTA Y RETORNA STATUS 201 SI SE HIZO CON EXITO, SINO RETORNO STATUS 500 
            
                pregunta.save()
                        .then(nuevapregunta => {
                            question.findById(nuevapregunta._id)
                                    .populate('category', ['name'])
                                    .exec()
                                    .then( newQ => {
                                        res.status(201).render('question/questionDetail', {pregunta :newQ})
                                    })
                        })
                        .catch(err => {
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                    res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error:" error con el servidor intente mas tarde"})  
                                            })     
                        }); 


            try {
                if(mongoose.Types.ObjectId.isValid(id)){
                    suggestedQuestion.findByIdAndRemove(id).exec();
                }
               
            }
            catch(error){
                console.log(error)
            }
    }
    

}

module.exports ={getSuggestedQuestion , getQuestionID, createQuestion, newQuestion, deleteQuestionByID};
import mongoose from "mongoose"
import suggestedQuestion from "../models/suggestedQuestion"
import question from "../models/question"



function getSuggestedQuestion(req,res,next){
    try{
        suggestedQuestion.find()
                .exec()
                .then(suggested => { 
                   
                        if(suggested) {   
                            res.status(200).render('suggested/suggestedAll',{preguntas: suggested})                     
                        }else{
                            res.status(404).json({message: 'no hay preguntas sugeridas'})
                        }   
            
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err})
                })
        }catch(error){
            console.log(error)
        }
    

}

function getQuestionID(req,res,next){
    const id = req.params.questionID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        suggestedQuestion.findById(id)
                         
                         .exec()
                         .then(questionByID =>{                
                                    if(questionByID){ 
                                        res.status(200).render('suggested/suggestedDetail',{pregunta: questionByID})
                                        
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
/*
function deleteUserByID(req, res, next){
    
    const id = req.params.userID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200).json({message: "eliminado con exito"})      
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

*/
function createQuestion(req,res, next){
    const id = req.params.questionID;
    if(mongoose.Types.ObjectId.isValid(id)){
        suggestedQuestion.findById(id)
                         
                         .exec()
                         .then(questionByID =>{                
                                    if(questionByID){ 
                                        res.status(200).render('suggested/newSuggested',{pregunta: questionByID})
                                        
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

function capitalizeFirstLetter(string){
    let caracter =  string.charAt(0).toUpperCase()+ string.slice(1);
    return caracter;
}


function newQuestion(req, res) {

    
    req.check("level").isIn(['bajo','medio','alto']).withMessage("El nivel debe ser bajo, medio o alto")
    let id = req.body._id;
    
    var errors = req.validationErrors();
    
    if(errors){
        suggestedQuestion.findById(id).exec().then(SQ => {
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
              

 
            }); 
        
            //GUARDA LA PREGUNTA Y RETORNA STATUS 201 SI SE HIZO CON EXITO, SINO RETORNO STATUS 500 
            try {
                pregunta.save()
                        .then(nuevapregunta => {
                            question.findById(nuevapregunta._id)
                            
                            .exec()
                            .then( newQ => {
                                 res.status(201).render('question/questionDetail', {pregunta :newQ})
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error: err})
                        }); 
            }
            catch(error){
                console.log(error)
            }


            try {
                if(mongoose.Types.ObjectId.isValid(id)){
                    suggestedQuestion.findByIdAndRemove(id).exec();
                }
                else{
                    res.status(404).json({message: "error IDs incorrecto"}) 
                }
            }
            catch(error){
                console.log(error)
            }
    }
    

}

module.exports ={getSuggestedQuestion , getQuestionID, createQuestion, newQuestion};
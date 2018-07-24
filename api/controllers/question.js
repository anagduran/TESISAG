import question from "../models/question"
import mongoose from "mongoose"


function newQuestion(req, res) {
    console.log( "aqui en la funcion new question ")
    
 
 const pregunta = new question({
        
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        level: req.body.level,
        category: req.body.category

    });
   
   console.log(pregunta)
   res.json(pregunta)

    pregunta.save()
            .then(nuevapregunta => {
             res.status(201).json(nuevapregunta)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            }); 

}

function getQuestions(req, res)
{
    question.find()
    .exec()
    .then(questions => { 
        if(questions) {
          res.status(200).json(questions)
        }else{
            res.status(404).json({message: 'no hay preguntas'})
        }   
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}

function getQuestionID(req, res){
    const id = req.params.questionID;
   
    if(mongoose.Types.ObjectId.isValid(id))
    {
    question.findById(id)
            .exec()
            .then(questionByID =>{
                
                if(questionByID){
                    res.status(200).json(questionByID)
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

function deleteQuestionByID(req,res){
    const id = req.params.questionID;
    
    
    if(mongoose.Types.ObjectId.isValid(id))
    {
        question.findByIdAndRemove(id).exec().then(result=>{
            if(result){
            res.status(200).json(result)
         
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


function updateQuestionByID(req, res){
    //const id = mongoose.Types.ObjectId(req.body.id)
    const id = req.params.questionID;
   console.log(id);
   
 
    if (mongoose.Types.ObjectId.isValid(id)) {
        question.where({'_id': id})
                .update( {$set: {question: req.body.question, options: req.body.options, answer: req.body.answer, level: req.body.level, category: req.body.category}})
                .exec()
                .then(result =>{
                    
                    if(result.nModified===1){
                    res.status(200).json(question)
                       
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
module.exports= {newQuestion, getQuestions, getQuestionID, deleteQuestionByID, updateQuestionByID}
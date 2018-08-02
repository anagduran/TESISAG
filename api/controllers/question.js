import question from "../models/question"
import category from "../models/category"
import mongoose from "mongoose"

//CREAR UNA NUEVA PREGUNTA
function newQuestion(req, res) {

    

   const pregunta = new question({
        
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer,
        level: req.body.level,
        category: req.body.categoriasCombo

    });
   
   
  
    try {
        pregunta.save()
                .then(nuevapregunta => {
                     res.status(201).json(nuevapregunta)
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


//BUSCAR TODAS LAS PREGUNTAS DE LA BD
function getQuestions(req, res)
{
  try{
    question.find()
            .populate('category', ['name']) 
            .exec()
            .then(questions => { 
               
                    if(questions) {                        
                        res.status(200).render( 'question/questionAll', { preguntas: questions})
                    }else{
                        res.status(404).json({message: 'no hay preguntas'})
                    }   
        
            }).catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            })
    }catch(error){
        console.log(error)
    }


 
}


//BUSCAR UNA PREGUNTA POR SU ID
function getQuestionID(req, res){

    const id = req.params.questionID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        question.findById(id)
                .populate('category', ['name'])
                .exec()
                .then(questionByID =>{                
                    if(questionByID){
                        res.status(200).render( 'question/questionDetail', { pregunta: questionByID})
                        
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


//ELIMINAR UNA PREGUNTA
function deleteQuestionByID(req,res){

    const id = req.params.questionID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
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


//MODIFICAR DATA DE UNA PREGUNTA 
function updateQuestionByID(req, res){
const id = mongoose.Types.ObjectId(req.body.id)
   // const id = req.params.questionID;
   
    if (mongoose.Types.ObjectId.isValid(id)) {
        question.where({'_id': id})
                .update( {$set: {question: req.body.question, options: req.body.options, answer: req.body.answer, level: req.body.level, category: req.body.category2}})
                .exec()
                .then(result =>{                    
                    if(result.nModified===1){
                    res.status(200).render( 'question/questionDetail', { pregunta: req.body})                      
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



function editQuestion(req,res){

    
    const id= req.params.questionID;
    category.find({},{"name":1}).exec().then(categories =>{
        if(mongoose.Types.ObjectId.isValid(id)){
            question.findById(id)
            .populate('category', ['name'])
            .exec()
            .then(questionByID =>{           
                res.render('question/updateQuestion', {pregunta: questionByID, categorias: categories})
            }).catch(err=> {
                res.status(500).json({message: "Error en el servidor"})
            })
        }
        else {
            res.status(404).json({message: "no valid entry for provided ID"})
        }
    })
}
   
function createQuestion(req,res,next){

   category.find({},{"name":1}).exec().then(categories =>{
        res.render('question/newQuestion',{ categorias: categories})
    })
   
    

}


module.exports= {newQuestion, getQuestions, getQuestionID, deleteQuestionByID, updateQuestionByID, createQuestion, editQuestion}
import question from "../models/question"
import category from "../models/category"
import mongoose from "mongoose"
import diff from 'simple-array-diff'

//CREAR UNA NUEVA PREGUNTA

function capitalizeFirstLetter(string){
    let caracter =  string.charAt(0).toUpperCase()+ string.slice(1);
    return caracter;
}

function newQuestion(req, res) {

    req.check("question").notEmpty().withMessage("El campo de pregunta no puede estar vacio")
    req.check("options").notEmpty().withMessage("Los campos de opciones no pueden estar vacios")
    req.check("level").isIn(['bajo','medio','alto']).withMessage("El nivel debe ser bajo, medio o alto")
    req.check('categoriasCombo').exists().withMessage('Debe seleccionar por lo menos una categoria')
  
   
    
    var errors = req.validationErrors();
    
    if(errors){
        category.find({},{"name":1}).exec().then(categories =>{
            res.render('question/newQuestion', {error: errors,  categorias: categories});
            return;
        })
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
                answer: req.body.options[2],
                level: req.body.level,
                status: estado,
                category: req.body.categoriasCombo,
                created_at: new Date().toISOString()

 
            }); 
        
            //GUARDA LA PREGUNTA Y RETORNA STATUS 201 SI SE HIZO CON EXITO, SINO RETORNO STATUS 500 
        
                pregunta.save()
                        .then(nuevapregunta => {
                            question.findById(nuevapregunta._id)
                            .populate('category', ['name'])
                            .exec()
                            .then( newQ => {
                                if(newQ){
                                    res.status(201).render('question/questionDetail', {pregunta :newQ})
                                }
                                else {
                                    question.find()
                                            .populate('category', ['name']) 
                                            .exec()
                                            .then(questions => {                                                
                                                res.status(404).render( 'question/questionAll', { preguntas: questions, error: "error al conectar con el servidor intente nuevamente"})
                                            })

                                }
                                
                            })
                        })
                        .catch(err => {
                             question.find()
                                     .populate('category', ['name']) 
                                     .exec()
                                     .then(questions => {                                                
                                            res.status(500).render( 'question/questionAll', { preguntas: questions, error: "error al conectar con el servidor intente nuevamente"})
                                    })
                        }); 
            
    }

}


//BUSCAR TODAS LAS PREGUNTAS DE LA BD
//SI TODO ESTA BIEN RETORNA STATUS 200, SINO RETORNA STATUS 404. SI HAY ERROR DE CONEXION RETORNA STATUS 500
function getQuestions(req, res)
{
  
    question.find()
            .populate('category', ['name']) 
            .exec()
            .then(questions => {                                                
                res.status(200).render( 'question/questionAll', { preguntas: questions})
                    
        
            }).catch(err => {
                res.status(404).render( 'index', { error: "Error de servidor, intente mas tarde"} )          
            })
   


 
}


//BUSCAR UNA PREGUNTA POR SU ID
//SI EL ID ES EL CORRECTO RETORNA STATUS 200,SINO STATUS 404. SI HAY ERROR DE CONEXION RETORNA ERROR 500
function getQuestionID(req, res){

    const id = req.params.questionID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        question.findById(id)
                .populate('category', ['name'])
                .exec()
                .then(questionByID =>{                
                    if(questionByID){
                        res.status(200).render('question/questionDetail', { pregunta: questionByID})
                        
                    }
                    else {
                        question.find()
                                .populate('category', ['name']) 
                                .exec()
                                .then(questions => {                                                
                                    res.status(404).render( 'question/questionAll', { preguntas: questions, error:" error con el servidor intente nuevamente"})               
                                })
                    }                
                })
                .catch(err=>{
                    question.find()
                                .populate('category', ['name']) 
                                .exec()
                                .then(questions => {                                                
                                    res.status(500).render( 'question/questionAll', { preguntas: questions, error:" error con el servidor intente nuevamente"})               
                                })
                })
    }
    else{
        question.find()
        .populate('category', ['name']) 
        .exec()
        .then(questions => {                                                
            res.status(404).render( 'question/questionAll', { preguntas: questions, error:" error con el servidor intente nuevamente"})               
        })
    }
}


//ELIMINAR UNA PREGUNTA
// SI LOGRA ELIMINAR LA PREGUNTA RETORNA STATUS 200, SI EL ID ENVIADO ES INCORRECTO RETORAN ERROR 404
// SI HAY FALLA DE CONEXION CON EL SERVIDOR RETORNA ERROR 500
function deleteQuestionByID(req,res){

    const id = req.params.questionID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        question.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                question.find()
                        .populate('category', ['name']) 
                        .exec()
                        .then(questions => {                                                
                            res.status(200).render( 'question/questionAll', { message: "eliminado con exito", preguntas: questions})  
                        })      
            }
            else {
                question.find()
                        .populate('category', ['name']) 
                        .exec()
                        .then(questions => {                                                
                            res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                        })      
            }
        })
        .catch(err =>{
            question.find()
                    .populate('category', ['name']) 
                    .exec()
                    .then(questions => {                                                
                        res.status(500).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                    })
        })
    }
    else{
        question.find()
                .populate('category', ['name']) 
                .exec()
                .then(questions => {                                                
                    res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                })      
    }
}


//MODIFICAR DATA DE UNA PREGUNTA 
//SI EL ID ENVIADO ES CORRECTO Y LA MODIFICACION SE HIZO CON EXITO RETORNA STATUS 200, SI EL ID ES INCORRECTO
// O NO SE HIZO LA MODIFICACION RETORNA STATUS 404, SI HAY FALLA DE CONEXION CON EL SERVIDOR RETORNA ERROR 500

function updateQuestionByID(req, res){
const id = mongoose.Types.ObjectId(req.body._id)
   // const id = req.params.questionID;
  
    req.check("question").notEmpty().withMessage("El campo de pregunta no puede estar vacio")
    req.check("options").notEmpty().withMessage("Los campos de opciones no pueden estar vacios")
    req.check("level").isIn(['bajo','medio','alto']).withMessage("El nivel debe ser bajo, medio o alto")
    req.check('category').exists().withMessage('Debe seleccionar por lo menos una categoria')
    

    var errors = req.validationErrors();
    if (errors){

          

        category.find({},{"name":1}).exec().then(categories =>{
            question.findById(id)
                    .populate('category', ['name'])
                    .exec()
                    .then(questionByID =>{ 
                    var result = diff (questionByID.category, categories)
                    res.render('question/updateQuestion', {error: errors,  pregunta: questionByID, categorias: result.added});
                return;
                    })
        })
        
    } 
    else {
        console.log(req.body.category);
        if (mongoose.Types.ObjectId.isValid(id)) {
            question.where({'_id': id})
                    .update( {$set: {question: req.body.question, options: req.body.options, answer: req.body.answer, level: req.body.level, category: req.body.category}})
                    .exec()
                    .then(result =>{                    
                        if(result.nModified===1){
                            question.findById(id)
                            .populate('category', ['name'])
                            .exec()
                            .then( cuestion => { 
                                    res.status(200).render( 'question/questionDetail', { pregunta: cuestion})                      
                                })
                        }   
                        else {                        
                            question.find()
                                    .populate('category', ['name']) 
                                    .exec()
                                    .then(questions => {                                                
                                        res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                                    })
                        }
                    })
                    .catch(err =>{
                        question.find()
                                .populate('category', ['name']) 
                                .exec()
                                .then(questions => {                                                
                                    res.status(500).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                                })
                    })
        }
        else{
            question.find()
                    .populate('category', ['name']) 
                    .exec()
                    .then(questions => {                                                
                        res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                    })
        }
    }
}



//FUNCION QUE VALIDA EL ID ENVIADO PARA SER MODIFICADO, SI ES ASI REDIRIGE A LA VISTA UPDATE QUESTION
// SI EL ID ES ERRONEO DEVUELVE STATUS 404
//SI HAY ERROR DE CONEXION DEVUELVE STATUS 500
function editQuestion(req,res){

    
    const id= req.params.questionID;
    category.find({},{"name":1}).exec().then(categories =>{
        if(mongoose.Types.ObjectId.isValid(id)){
            question.findById(id)
                    .populate('category', ['name'])
                    .exec()
                    .then(questionByID =>{   
                        var result = diff (questionByID.category, categories);
                        res.render('question/updateQuestion', {pregunta: questionByID, categorias: result.added})
                    }).catch(err=> {
                        question.find()
                                .populate('category', ['name']) 
                                .exec()
                                .then(questions => {                                                
                                    res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                                })
                    })
        }
        else {
            question.find()
                    .populate('category', ['name']) 
                    .exec()
                    .then(questions => {                                                
                        res.status(404).render( 'question/questionAll', { error: "Error con el servidor, intente nuevamente", preguntas: questions})  
                    })
        }
    })
}

//FUNCION QUE REDIRIJE A LA VISTA NEW QUESTION
function createQuestion(req,res,next){

   category.find({},{"name":1}).exec().then(categories =>{
        res.render('question/newQuestion',{ categorias: categories})
    })
   
    

}


module.exports= {newQuestion, getQuestions, getQuestionID, deleteQuestionByID, updateQuestionByID, createQuestion, editQuestion}
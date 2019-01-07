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
    req.check("answer").equals(req.body.options[2]).withMessage("la respuesta debe ser igual a la opcion 3")
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
        
        const pregunta = new question({
                
                _id: new mongoose.Types.ObjectId(),
                question: preg,
                options: req.body.options,
                answer: req.body.answer,
                level: req.body.level,
                category: req.body.categoriasCombo

            }); 
        
            //GUARDA LA PREGUNTA Y RETORNA STATUS 201 SI SE HIZO CON EXITO, SINO RETORNO STATUS 500 
            try {
                pregunta.save()
                        .then(nuevapregunta => {
                        res.status(201).render('question/questionDetail', {pregunta :nuevapregunta})
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

}


//BUSCAR TODAS LAS PREGUNTAS DE LA BD
//SI TODO ESTA BIEN RETORNA STATUS 200, SINO RETORNA STATUS 404. SI HAY ERROR DE CONEXION RETORNA STATUS 500
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
// SI LOGRA ELIMINAR LA PREGUNTA RETORNA STATUS 200, SI EL ID ENVIADO ES INCORRECTO RETORAN ERROR 404
// SI HAY FALLA DE CONEXION CON EL SERVIDOR RETORNA ERROR 500
function deleteQuestionByID(req,res){

    const id = req.params.questionID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        question.findByIdAndRemove(id).exec().then(result=>{
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


//MODIFICAR DATA DE UNA PREGUNTA 
//SI EL ID ENVIADO ES CORRECTO Y LA MODIFICACION SE HIZO CON EXITO RETORNA STATUS 200, SI EL ID ES INCORRECTO
// O NO SE HIZO LA MODIFICACION RETORNA STATUS 404, SI HAY FALLA DE CONEXION CON EL SERVIDOR RETORNA ERROR 500

function updateQuestionByID(req, res){
const id = mongoose.Types.ObjectId(req.body._id)
   // const id = req.params.questionID;
  
    req.check("question").notEmpty().withMessage("El campo de pregunta no puede estar vacio")
    req.check("options").notEmpty().withMessage("Los campos de opciones no pueden estar vacios")
    req.check("level").isIn(['bajo','medio','alto']).withMessage("El nivel debe ser bajo, medio o alto")
    req.check("answer").equals(req.body.options[2]).withMessage("la respuesta debe ser igual a la opcion 3")
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
        if (mongoose.Types.ObjectId.isValid(id)) {
            question.where({'_id': id})
                    .update( {$set: {question: req.body.question, options: req.body.options, answer: req.body.answer, level: req.body.level, category: req.body.category}})
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
                console.log('categorias de la pregunta');   
                console.log(questionByID.category);
                console.log('categorias');
                console.log(categories);
                var result = diff (questionByID.category, categories);
                console.log('diff');
                console.log(result);
                res.render('question/updateQuestion', {pregunta: questionByID, categorias: result.added})
            }).catch(err=> {
                res.status(500).json({message: "Error en el servidor"})
            })
        }
        else {
            res.status(404).json({message: "no valid entry for provided ID"})
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
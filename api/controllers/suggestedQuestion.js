import mongoose from "mongoose"
import suggestedQuestion from "../models/suggestedQuestion"
import question from "../models/question"




 function getSuggestedQuestion(req,res,next){
   
    var regexEspeciales = /[`~!@#$%^&*()_°¬|+\-=?;:'",.<>\{\}\[\]\\\/]{3}/;
    var palabrasConsecutivas = /[a-zA-Z]{4}$/;
    var trivia = [];
    var allObject = [];
    var contador= 0;
        suggestedQuestion.find()
        .exec()
        .then(suggested => {      
            if(suggested)    {  
               // SI LA PREGUNTA TIENE UNICAMENTE UNA PALABRA
               
                for(let i=0; i < suggested.length; i++ ){
                    
                    var separacion = suggested[i].question.split(" ");
                   
                    if((separacion.length==0) || (separacion.length==1)){
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                        console.log("aqui 1");
                    }
                    
                }
                // SI UNA MISMA PALABRA ESTA EN LAS OPCIONES A B Y C
                for(let i=1; i < suggested.length; i++ ){
                  trivia.push(suggested[i].question.toLowerCase(), suggested[i].correctAnswer.toLowerCase(), suggested[i].optionB.toLowerCase(), suggested[i].optionC.toLowerCase());
                    var separacion2 = trivia[1].split(" ");
                    var separacion3 = trivia[2].split(" ");
                    var separacion4 = trivia[3].split(" ");
                   
                    
                    for(let i=0; i < separacion2.length; i++ ){
                        allObject.push(separacion2[i]);
    
                    }
                        
                    for(let j=0; j < separacion3.length; j++ ){
                        allObject.push(separacion3[j]);
                    } 
    
                    for(let k=0; k < separacion4.length; k++ ){
                           allObject.push(separacion4[k]);
                    } 
                           
                           
                    for(let m=0; m< allObject.length; m++) {
                        if(allObject[m]==allObject[m+1]){
                            contador++;
                        }
                       
                    }
    
                    if(contador>0){
                        console.log("aqui 2");
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                    }
                    contador=0;
                    trivia=[];
                    allObject=[];
                }
               
                //SI LAS OPCIONES TIENE MAS DE 3 CAMPOS
               for(let i=0; i < suggested.length; i++ ){
                
                    var separacion6 = suggested[i].correctAnswer.split(" ");
                    var separacion7 = suggested[i].optionB.split(" ");
                    var separacion8 = suggested[i].optionC.split(" ");                          
                   
                    if((separacion6.length > 3) || (separacion7.length > 3) || (separacion8.length > 3)) {
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                        console.log("aqui 3");
                    }
                                                       
                }
                // SI EL LENGHT DE LAS OPCIONES PASA DE 30
                for(let i=0; i < suggested.length; i++ ){                        
                    
                    if((suggested[i].correctAnswer.length > 25) || (suggested[i].optionB.length > 25) || (suggested[i].optionC.length > 25)) {
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                        console.log("aqui 4");
                    }
                                                       
                }
    
                //SI TIENE CARACTERES ALFABETICOS CONSECUTIVOS: aaaa,bbbb,cccc,dddd,eeees EN LA PREGUNTA
         
                // ARREGLAR PALABRAS REGEX DE PALABRAS CONSECUTIVAS
                for(let i=0; i < suggested.length; i++){                        
                    console.log(suggested[i].question)
                    console.log(palabrasConsecutivas)
                    var separacionquestion = suggested[i].question.split(" ");


                    for(let j=0; j <separacionquestion.length; j++) {   
                        console.log(separacionquestion[j]);               
                        if(palabrasConsecutivas.test(separacionquestion[j])) {
                            suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                            console.log("aqui 5");
                        }     
                    }                                                
                }
                
                // ARREGLAR PALABRAS REGEX DE PALABRAS CONSECUTIVAS
                //SI TIENE CARACTERES ALFABETICOS CONSECUTIVOS: aaaa,bbbb,cccc,dddd,eeees EN LAS OPCIONES
                for(let i=0; i < suggested.length; i++ ){                        
                    var separacion6 = suggested[i].correctAnswer.split(" ");
                    var separacion7 = suggested[i].optionB.split(" ");
                    var separacion8 = suggested[i].optionC.split(" ");   
                    
                    if( (palabrasConsecutivas.test(separacion6[0])) || (palabrasConsecutivas.test(separacion7[0])) || (palabrasConsecutivas.test(separacion8[0]))) {
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                        console.log("aqui 6");
                    }                                                     
                }

                //SI EXISTEN CARACTERES ESPECIALES CONSECUTIVOS EN LA PREGUNTA
                for(let i=0; i < suggested.length; i++ ){                        
                    
                    if(regexEspeciales.test(suggested[i].question)) {
                        suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                        console.log("aqui 7");
                    }                                                     
                }

                //SI LA LOGINTUD DE LA PREGUNTA ES MENOR A 4
                for(let i=0; i < suggested.length; i++ ){                        
        
                    
                    var separacion6 = suggested[i].question.split(" ");
                     if(separacion.length < 4) {
                         suggestedQuestion.findByIdAndRemove(suggested[i]._id).exec();
                         console.log("aqui 8");
                     }                                                     
                 }

            }
          
            suggestedQuestion.find()
            .exec()
            .then(suggested => {      
                if(suggested)    {    

                    res.status(200).render('suggested/suggestedAll',{preguntas: suggested})
                     
                } else {
                    res.status(404).render('index' , {error: "Server error, try again"}) 
                }                    
            }).catch(err => {                    
                res.status(404).render('index', {error: "Server error, try again"}) 
            });
        
        
        
        
        
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
                                                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
                                                         })     
                                        
                                    }                
                         })
                         .catch(err=>{
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                    res.status(500).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
                                            })     
                         })
        }
    else{
        suggestedQuestion.find()
                         .exec()
                         .then(suggested => { 
                                res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
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
                    res.status(200).render('suggested/suggestedAll',{message: "Question successfully eliminated" , preguntas: suggested})                     
                       
                }) 
            }
            else {
                suggestedQuestion.find()
                                .exec()
                                .then(suggested => {                     
                                    res.status(404).render('suggested/suggestedAll',{error: "Server error, try again" , preguntas: suggested})                     
                                        
                                }) 
            }
        })
        .catch(err =>{
            suggestedQuestion.find()
                            .exec()
                            .then(suggested => {                     
                                res.status(500).render('suggested/suggestedAll',{error: "Server error, try again" , preguntas: suggested})                     
                                
                            }) 
        })
    }
    else{
        suggestedQuestion.find()
                        .exec()
                        .then(suggested => {                     
                            res.status(404).render('suggested/suggestedAll',{error: "Server error, try again" , preguntas: suggested})                     
                                
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
                                                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
                                                         })     
                                    }                
                         })
                         .catch(err=>{
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                res.status(500).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
                                            })     
                         })
        }
    else{
        suggestedQuestion.find()
                         .exec()
                         .then(suggested => { 
                            res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
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
                                        res.status(201).render('question/questionDetail', {pregunta :newQ, message: "Question added successfully"})
                                    })
                        })
                        .catch(err => {
                            suggestedQuestion.find()
                                             .exec()
                                             .then(suggested => { 
                                                    res.status(404).render('suggested/suggestedAll',{preguntas: suggested, error: "Server error, try again"})  
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
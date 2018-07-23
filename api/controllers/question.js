import question from "../models/question"
import mongoose from "mongoose"


function newQuestion(req, res, next) {
    console.log( "aqui en la funcion new question ")
    let array = [];
    const pregunta = new question({
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question,
        options: req.body.question.split(','),
        answer: req.body.answer,
        level: req.body.level,
        category: req.body.category

    });

    pregunta.save()
            .then(nuevapregunta => {
             res.status(201).json(nuevapregunta)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            }); 

}


module.exports= {newQuestion}
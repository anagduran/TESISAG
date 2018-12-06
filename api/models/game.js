import mongoose from 'mongoose'

const gameSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date:{type: Date } ,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
    prize: {type: String},
    status: {type: String, estatus: ["sin inicio", "en progreso", "finalizada"]}, 
   
},{ 
    versionKey: false
});

const question =mongoose.model('game', gameSchema, 'game')


module.exports = question;
import mongoose from 'mongoose'

const gameSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: ,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
    prize: {type: String},
    status: {type: String, lvl: ["sin inicio", "en progreso", "finalizada"]}, 
   
},{ 
    versionKey: false
});

const question =mongoose.model('game', questionSchema, 'game')


module.exports = question;
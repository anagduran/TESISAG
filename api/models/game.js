import mongoose from 'mongoose'

const gameSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String},
    date:{type: String } ,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
    prize: {type: String},
    status: {type: String, estatus: ["sin inicio", "en progreso", "finalizada"]}, 
    notification: [{
        type: {type: Number},
        subject: {type: String},
        message: {type: String},
        date: {type: String}

    }]
},{ 
    versionKey: false
});

const game =mongoose.model('game', gameSchema, 'game')


module.exports = game;
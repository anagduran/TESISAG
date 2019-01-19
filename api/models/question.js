import mongoose from 'mongoose'

const questionSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question: {type: String},
    options:[{type: String}],
    answer: {type: String},
    level:  {type: String, lvl: ["bajo", "medio", "alto"]}, 
    status: {type: String, lvl: ["available", "not available"]},
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}]
},{ 
    versionKey: false
});

const question =mongoose.model('question', questionSchema, 'question')


module.exports = question;
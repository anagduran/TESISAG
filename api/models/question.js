import mongoose from 'mongoose'

const questionSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question: {type: String, require: true},
    options: [{type: String,  require: true, validate: {  validator: function (str) {
                                                           return str.length =3 }}}],
    answer: {type: String, require: true, require: true},
    level:  {$in: ["bajo", "medio", "alto"]}, 
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}]
},{
    versionKey: false
});

const question =mongoose.model('question', questionSchema, 'question')


module.exports = question;
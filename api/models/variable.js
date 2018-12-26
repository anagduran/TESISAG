import mongoose from 'mongoose'

const variableSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, require: true},
    description: {type: String, require:true}
},{
    versionKey: false
});

const variable =mongoose.model('variable', variableSchema, 'variable')


module.exports = variable;
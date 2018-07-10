import mongoose from 'mongoose'

const categorySchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require: true},
    description: String
},{
    versionKey: false
});

const category =mongoose.model('category', categorySchema, 'category')


module.exports = category;

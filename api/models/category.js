import mongoose from 'mongoose'

/*const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name:{type: String, require: true},
    description: String
});*/


const categorySchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{type: String, require: true},
    description: String
});




const category =mongoose.model('category', categorySchema, 'category')


module.exports = category;

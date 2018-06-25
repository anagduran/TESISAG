import mongoose from 'mongoose'

//const Schema = new  mongoose.Schema;

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name:{type: String, require: true},
    description: String
})

//const category = connection.model('category', categorySchema)
export default mongoose.model('category', categorySchema)
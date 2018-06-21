import mongoose from "mongoose"

const Schema =  mongoose.Schema;

const categorySchema = Schema({
    _id: 
    name= {type: String, require: true},
    description= String
})

export default mongoose.model('Category', new categorySchema)
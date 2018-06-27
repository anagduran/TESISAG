import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    //_id: mongoose.Schema.ObjectId,
    name:{type: String, require: true},
    description: String
});

const category = mongoose.model('category', categorySchema)

module.exports= category;
//const category = connection.model('category', categorySchema)
//export default mongoose.model('category', categorySchema)
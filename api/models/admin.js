import mongoose from 'mongoose'

const adminSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, require: true},
    password: {type: String, require:true}
},{
    versionKey: false
});

const admin =mongoose.model('admin', adminSchema, 'admin')


module.exports = admin;

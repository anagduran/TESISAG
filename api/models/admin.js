import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const adminSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, require: true},
    password: {type: String, require:true}
},{
    versionKey: false
});



//transformacion de la contraseña del usuario cuando se hace login 

adminSchema.methods.validatePassword = function(pw) {
    return bcrypt.compareSync(pw, this.password);
}
const admin = mongoose.model('admin', adminSchema, 'admin')


module.exports = admin;

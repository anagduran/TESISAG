import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const adminSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, require: true},
    password: {type: String, require:true}
},{
    versionKey: false
});

// cifrar la contrase;a antes de guardarla dentro de la BD
adminSchema.methods.generateHash = function (pass) {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);

}

//transformacion de la contrase;a del usuario cuando se hace login 

adminSchema.methods.validatePassword = function(pw) {
    return bcrypt.compareSync(pw, this.password);
}
const admin = mongoose.model('admin', adminSchema, 'admin')


module.exports = admin;

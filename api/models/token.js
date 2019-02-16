import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const tokenSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: {type: String, require: true}
    
},{
    versionKey: false
});

// cifrar la contrase;a antes de guardarla dentro de la BD
tokenSchema.methods.generateHash = function (tok) {
    return bcrypt.hashSync(tok, bcrypt.genSaltSync(8), null);

}

//transformacion de la contrase;a del usuario cuando se hace login 

tokenSchema.methods.validatePassword = function(tkn) {
    return bcrypt.compareSync(tkn, this.token);
}
const token = mongoose.model('token', tokenSchema , 'token')


module.exports = token;

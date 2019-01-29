import mongoose from "mongoose"
import user from "../models/user"
import random from 'randomstring'
import randomToken from 'random-token'


function newUser(req,res) {
    var username = req.body.nickname;

    req.check('nickname').isLength({min: 4}).withMessage('El nickname es muy corto');
    req.check('nickname').notEmpty().withMessage('El nickname no puede estar vacio');
    req.check('country_code').exists().withMessage('Debe seleccionar un codigo de pais');
    req.check('phone').isLength({min: 4}).withMessage('El telefono es muy corto, minimo 8 digitos');
    req.check('phone').notEmpty().withMessage('El numero de telefono no puede estar vacio');
    req.check('phone').matches('[0-9]').withMessage('Solo se permiten numeros en el campo de Telefono');
  
    
   var codigo = random.generate(4);
   var device = randomToken(16);
    var errors = req.validationErrors();
    user.find({'nickname': username})
        .exec()
        .then(usuario =>  {
        console.log(usuario.length);
        if((usuario.length > 0) || (errors)) {
            res.render('user/newUser', {error: errors , error2: usuario.length});
            return;    
        } else { 
            var Defatult= 0;
                     
            const usuarioN = new user({
                _id: new mongoose.Types.ObjectId(),
                nickname: req.body.nickname,
                country_code: req.body.country_code,
                phone: req.body.phone,
                share_code: codigo,
                extra_life: Defatult,
                balance: Defatult,
                id_device: device
                
                });
            
                try{ 
                    usuarioN.save()
                            .then(nuevouser => {
                                res.status(200).render('user/userDetail',{usuario: nuevouser})
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err})
                            }); 
                }  
                catch(error){
                console.log(error) 
                }
            }
        });
}

function getUsers(req,res,next){
    try{
        user.find()
                .exec()
                .then(users => { 
                   
                        if(users) {                        
                            res.status(200).render('user/userAll',{usuarios: users})
                        }else{
                            res.status(404).json({message: 'no hay variables'})
                        }   
            
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err})
                })
        }catch(error){
            console.log(error)
        }
    

}

function getUserID(req,res,next){
    const id = req.params.userID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findById(id)
                .exec()
                .then(userByID =>{                
                    if(userByID){ 
                        res.status(200).render('user/userDetail',{usuario: userByID})
                        
                    }
                    else { 
                        res.status(404).json({message: 'no encontrado, ID incorrecto'})
                    }                
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message:"aqui en el error 500"})
                })
    }
    else{
        res.status(404).json({message: "no valid entry for provided ID"})
    }
}

function updateUserByID(req, res, next){

    req.check('nickname').isLength({min: 4}).withMessage('El nickname es muy corto');
    req.check('nickname').notEmpty().withMessage('El nickname no puede estar vacio');
    req.check('country_code').exists().withMessage('Debe seleccionar un codigo de pais');
    req.check('phone').isLength({min: 4}).withMessage('El telefono es muy corto, minimo 8 digitos');
    req.check('phone').notEmpty().withMessage('El numero de telefono no puede estar vacio');
    req.check('phone').matches('[0-9]').withMessage('Solo se permiten numeros en el campo de Telefono');

    var errors = req.validationErrors();
    if (errors){
        res.render('user/updateUser', {error: errors, usuario: req.body});
        return;   
    }
    else{

        const id = mongoose.Types.ObjectId(req.body._id)
        if (mongoose.Types.ObjectId.isValid(id)) {
            user.where({'_id': id})
                    .update( {$set: {nickname: req.body.nickname, country_code: req.body.country_code, phone: req.body.phone }})
                    .exec()
                    .then(result =>{                    
                        if(result.nModified===1){
                        res.status(200).render('user/userDetail',{usuario: req.body})                      
                        }
                        else {                        
                            res.status(404).json({message: 'no encontrado'})
                        }
                    })
                    .catch(err =>{
                        res.status(500).json({error: err})
                    })
        }
        else{
            res.status(404).json({message: 'error de id, incorrecto'})
        }
    }
}

function deleteUserByID(req, res, next){
    
    const id = req.params.userID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200)     
            }
            else {
                res.status(404).json({message: "ERROR ID"})
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err})
        })
    }
    else{
        res.status(404).json({message: "error ID incorrecto"}) 
    }
}

function editUser(req,res, next){

    
    const id= req.params.userID;
      
            if(mongoose.Types.ObjectId.isValid(id)){
                user.findById(id)
                .exec()
                .then(userByID =>{           
                    res.render('user/updateUser', {usuario: userByID})
                }).catch(err=> {
                    res.status(404).json({message: "no valid entry for provided ID"})
                })
            }
            else {
                res.status(404).json({message: "no valid entry for provided ID"})
            }  
}

function createUser(req,res, next){
    res.render('user/newUser')
}
module.exports ={editUser, createUser, newUser,  getUsers, getUserID, updateUserByID, deleteUserByID};
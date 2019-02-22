import mongoose from "mongoose"
import user from "../models/user"
import random from 'randomstring'
import randomToken from 'random-token'


function newUser(req,res) {
    var username = req.body.nickname;

    req.check('nickname').isLength({min: 4}).withMessage('The nickname field is very short');
    req.check('nickname').notEmpty().withMessage('The nickname field can not be empty');
    req.check('country_code').exists().withMessage('You must select a country code');
    req.check('phone').isLength({min: 4}).withMessage('Phone field is very short, minimum 8 digits');
    req.check('phone').notEmpty().withMessage('The phone field can not be empty');
    req.check('phone').matches('[0-9]').withMessage('Only numbers are allowed in the Phone field');
  
    
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
            
              
                    usuarioN.save()
                            .then(nuevouser => {
                                if(nuevouser){
                                    res.status(200).render('user/userDetail',{usuario: nuevouser,  message: "User added successfully"})
                                }
                                else {
                                    user.find()
                                    .exec()
                                    .then(users => {                                          
                                        res.status(404).render('user/userAll',{usuarios: users, error: "Server error, try again" })         
                                    })
                                }
                               
                            })
                            .catch(err => {
                                user.find()
                                    .exec()
                                    .then(users => {                                          
                                        res.status(500).render('user/userAll',{usuarios: users, error: "Server error, try again" })         
                                    })
                            }); 
                
               
            }
        });
}

function getUsers(req,res,next){
        user.find()
                .exec()
                .then(users => {  
                    if(users){
                        res.status(200).render('user/userAll',{usuarios: users})  
                    }  else {
                        res.status(404).render( 'index', { error: "Server error, try again"} )
                    }                                      
                }).catch(err => {
                    res.status(500).render( 'index', { error: "Server error, try again"} )
                })
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
                        user.find()
                        .exec()
                        .then(users => {                                          
                            res.status(5404).render('user/userAll',{usuarios: users, error: "Server error, try again" })         
                        })
                    }                
                })
                .catch(err=>{
                    user.find()
                        .exec()
                        .then(users => {                                          
                            res.status(500).render('user/userAll',{usuarios: users, error: "Server error, try again" })         
                        })
                })
    }
    else{
        user.find()
        .exec()
        .then(users => {                                          
            res.status(404).render('user/userAll',{usuarios: users, error: "Server error, try again" })         
        })
    }
}

function updateUserByID(req, res, next){

    req.check('nickname').isLength({min: 4}).withMessage('The nickname field is very short');
    req.check('nickname').notEmpty().withMessage('The nickname field can not be empty');
    req.check('country_code').exists().withMessage('You must select a country code');
    req.check('phone').isLength({min: 4}).withMessage('Phone field is very short, minimum 8 digits');
    req.check('phone').notEmpty().withMessage('The phone field can not be empty');
    req.check('phone').matches('[0-9]').withMessage('Only numbers are allowed in the Phone field');

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
                        res.status(200).render('user/userDetail',{usuario: req.body, message: "User successfully modified"})                      
                        }
                        else {                        
                            user.find()
                                .exec()
                                .then(users => {                                          
                                    res.status(404).render('user/userAll',{usuarios: users,  error: "Server error, try again" })         
                                })
                        }
                    })
                    .catch(err =>{
                        user.find()
                            .exec()
                            .then(users => {                                          
                                res.status(500).render('user/userAll',{usuarios: users,  error: "Server error, try again" })         
                            })
                    })
        }
        else{
            user.find()
            .exec()
            .then(users => {                                          
                res.status(404).render('user/userAll',{usuarios: users,  error: "Server error, try again" })         
            })
        }
    }
}

function deleteUserByID(req, res, next){
    
    const id = req.params.userID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                user.find()
                .exec()
                .then(users => {                                            
                    res.status(200).render('user/userAll',{ message: "User successfully eliminated",usuarios: users})         
                })    
            }
            else {
                user.find()
                .exec()
                .then(users => {                                            
                    res.status(404).render('user/userAll',{ error: "Server error, try again" ,usuarios: users})         
                })    
            }
        })
        .catch(err =>{
            user.find()
                .exec()
                .then(users => {                                            
                    res.status(500).render('user/userAll',{  error: "Server error, try again" ,usuarios: users})         
                })   
        })
    }
    else{
        user.find()
            .exec()
            .then(users => {                                            
                res.status(404).render('user/userAll',{ error: "Server error, try again" ,usuarios: users})         
            })  
    }
}

function editUser(req,res, next){

    
    const id= req.params.userID;
      
            if(mongoose.Types.ObjectId.isValid(id)){
                user.findById(id)
                .exec()
                .then(userByID =>{  
                    if(userByID)  {
                        res.render('user/updateUser', {usuario: userByID})
                    } else {
                        user.find()
                        .exec()
                        .then(users => {                                            
                            res.status(404).render('user/userAll',{ error: "Server error, try again",usuarios: users})         
                        })  
                    }
                }).catch(err=> {
                    user.find()
                        .exec()
                        .then(users => {                                            
                            res.status(500).render('user/userAll',{ error: "Server error, try again" ,usuarios: users})         
                        })  
                })
            }
            else {
                user.find()
                    .exec()
                    .then(users => {                                            
                        res.status(404).render('user/userAll',{ error: "Server error, try again" ,usuarios: users})         
                    })  
            }  
}

function createUser(req,res, next){
    res.render('user/newUser')
}
module.exports ={editUser, createUser, newUser,  getUsers, getUserID, updateUserByID, deleteUserByID};